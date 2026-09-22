import { NextResponse } from 'next/server'
import { getProvider as getStorageProvider } from '@repo/storage'
import { logger } from '@repo/common'
import { checkGenerateRateLimit } from '@/lib/rate-limit'
import { buildIteratePrompt, parseUserCreativeRules, shouldRedrawFromPhoto } from '@/lib/prompt'
import { getStyleOrDefault } from '@/lib/styles'
import { validateImage } from '@/lib/validation'
import { prepareGeneratedImage } from '@/lib/watermark'
import { modelForTier, type GenerationTier } from '@/lib/billing'
import { executeT2I } from '@/lib/execute-generation'
import {
  consumePaidCredit,
  getQuotaSnapshot,
  refundFreeSlot,
  refundPaidCredit,
  reserveFreeSlot,
} from '@/lib/quota'
import { applyDevCreditsCookie, applyWalletCookie, ensureWalletId } from '@/lib/wallet'
import {
  newShareId,
  shareInputKey,
  shareOutputKey,
  storageUrl,
  writeShareMeta,
  type ShareMeta,
} from '@/lib/share'

export const runtime = 'nodejs'
export const maxDuration = 90

function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message }, ...extra }, { status })
}

function attachSession(
  res: NextResponse,
  wallet: { id: string; created: boolean },
  cookieCredits?: number,
): NextResponse {
  if (wallet.created) applyWalletCookie(res, wallet.id)
  if (typeof cookieCredits === 'number') applyDevCreditsCookie(res, cookieCredits)
  return res
}

function quotaUnavailable(error: 'redis_required' | 'redis_unavailable'): NextResponse {
  return jsonError(
    503,
    'SERVICE_UNAVAILABLE',
    'The generator is temporarily unavailable. Please try again later.',
    { reason: error },
  )
}

async function resolveIterateInput(
  previousOutput: string,
  fallback: Buffer,
  mime: string,
): Promise<string | undefined> {
  const url = previousOutput.trim()
  if (url && /^https?:\/\//i.test(url)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length > 1000) {
          const type = (res.headers.get('content-type') || 'image/jpeg').split(';')[0]
          return `data:${type};base64,${buf.toString('base64')}`
        }
      }
    } catch (e) {
      console.warn('[iterate] previous output fetch failed', e)
    }
  }
  if (fallback.length > 10) return `data:${mime};base64,${fallback.toString('base64')}`
  return undefined
}

function historyTexts(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const item of raw) {
    const text =
      typeof item === 'string'
        ? item
        : item && typeof item === 'object' && typeof (item as { text?: unknown }).text === 'string'
          ? (item as { text: string }).text
          : ''
    const cleaned = text.replace(/\s+/g, ' ').trim()
    if (!cleaned) continue
    out.push(cleaned.slice(0, 200))
    if (out.length >= 12) break
  }
  return out
}

/**
 * POST /api/generate/iterate
 * JSON or multipart: originalPrompt + history + newFeedback (+ file/style/tier)
 */
export async function POST(req: Request): Promise<NextResponse> {
  const provider = 'seedream'
  console.log('[generate] using provider:', provider)
  console.log('[generate] provider:', provider)
  const wallet = ensureWalletId(req)
  const rateLimit = await checkGenerateRateLimit(req)
  if (rateLimit.limited) {
    const status = rateLimit.status ?? 429
    const message =
      rateLimit.reason === 'redis_unavailable'
        ? 'The generator is temporarily unavailable. Please try again later.'
        : 'You are generating too fast. Please wait a moment and try again.'
    return attachSession(
      jsonError(status, status === 429 ? 'RATE_LIMITED' : 'SERVICE_UNAVAILABLE', message),
      wallet,
    )
  }

  const contentType = req.headers.get('content-type') || ''
  let originalPrompt = ''
  let history: string[] = []
  let newFeedback = ''
  let styleId = ''
  let requestedTier: GenerationTier = 'free'
  let file: File | null = null
  let previousOutput = ''

  try {
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as Record<string, unknown>
      originalPrompt = typeof body.originalPrompt === 'string' ? body.originalPrompt.trim() : ''
      history = historyTexts(body.history)
      newFeedback = typeof body.newFeedback === 'string' ? body.newFeedback.trim() : ''
      styleId = typeof body.style === 'string' ? body.style : ''
      requestedTier = body.tier === 'paid' ? 'paid' : 'free'
      previousOutput = typeof body.previousOutput === 'string' ? body.previousOutput.trim() : ''
    } else {
      const form = await req.formData()
      originalPrompt = String(form.get('originalPrompt') ?? '').trim()
      const historyRaw = form.get('history')
      if (typeof historyRaw === 'string' && historyRaw.trim()) {
        try {
          history = historyTexts(JSON.parse(historyRaw) as unknown)
        } catch {
          history = []
        }
      }
      newFeedback = String(form.get('newFeedback') ?? '').trim()
      styleId = String(form.get('style') ?? '')
      requestedTier = String(form.get('tier') ?? 'free') === 'paid' ? 'paid' : 'free'
      previousOutput = String(form.get('previousOutput') ?? '').trim()
      const uploaded = form.get('file')
      if (uploaded instanceof File) file = uploaded
    }
  } catch {
    return attachSession(jsonError(400, 'INVALID_FORM', 'Invalid iterate request.'), wallet)
  }

  if (!originalPrompt || originalPrompt.length > 8000) {
    return attachSession(
      jsonError(400, 'INVALID_PROMPT', 'The original prompt is missing or too long.'),
      wallet,
    )
  }
  const feedbackParsed = parseUserCreativeRules(newFeedback)
  if (!feedbackParsed.ok) {
    return attachSession(jsonError(400, feedbackParsed.code, feedbackParsed.message), wallet)
  }
  const feedback =
    feedbackParsed.value ||
    '表情再夸张一点，人必须好看像本人，不要皱纹变老变丑'

  const style = getStyleOrDefault(styleId)
  const prompt = buildIteratePrompt(originalPrompt, history, feedback)

  let cookieCredits: number | undefined
  let reservedFree = false
  let consumedPaid = false
  let tier: GenerationTier = requestedTier

  if (requestedTier === 'paid') {
    const paid = await consumePaidCredit(req, wallet.id)
    if (!paid.ok) {
      if (paid.error === 'no_credits') {
        const quota = await getQuotaSnapshot(req, wallet.id)
        return attachSession(
          jsonError(
            402,
            'PAYMENT_REQUIRED',
            'Unlock HD to generate with the full-quality model — no watermark.',
            { quota },
          ),
          wallet,
        )
      }
      return attachSession(quotaUnavailable(paid.error), wallet)
    }
    consumedPaid = true
    cookieCredits = paid.cookieCredits
  } else {
    const free = await reserveFreeSlot(req)
    if (!free.ok) {
      if (free.error === 'quota_exceeded') {
        const quota = await getQuotaSnapshot(req, wallet.id)
        return attachSession(
          jsonError(
            402,
            'QUOTA_EXCEEDED',
            'Your free preview for today is used. Unlock HD or buy another generation.',
            { quota },
          ),
          wallet,
        )
      }
      return attachSession(quotaUnavailable(free.error), wallet)
    }
    reservedFree = true
    tier = 'free'
  }

  let storage
  try {
    storage = getStorageProvider()
  } catch {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    return attachSession(
      jsonError(503, 'STORAGE_UNAVAILABLE', 'The generator is temporarily unavailable.'),
      wallet,
      cookieCredits,
    )
  }

  const id = newShareId()
  let inputBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xd9])
  let ext = 'jpg'
  let mime = 'image/jpeg'
  if (file) {
    const validation = validateImage({ type: file.type, size: file.size })
    if (!validation.ok) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      return attachSession(jsonError(400, validation.code, validation.message), wallet)
    }
    inputBuffer = Buffer.from(await file.arrayBuffer())
    ext = validation.ext
    mime = validation.mime
  }
  const inputKey = shareInputKey(id, ext)

  const inputUpload = await storage.upload(inputKey, inputBuffer, {
    contentType: mime,
  })
  if (!inputUpload.ok) {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    return attachSession(
      jsonError(502, 'UPLOAD_FAILED', 'Could not store the uploaded image.'),
      wallet,
      cookieCredits,
    )
  }

  try {
    const model = modelForTier(tier)
    console.log('[generate] using provider:', provider)
    console.log('[generate] provider:', provider)
    console.log('[generate] model:', model)
    const generated = await executeT2I({
      prompt,
      model,
      inputImage: await resolveIterateInput(
        shouldRedrawFromPhoto(feedback) ? '' : previousOutput,
        inputBuffer,
        mime,
      ),
    })
    if (!generated.ok) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      const message = String(
        (generated.error.details as { message?: unknown } | undefined)?.message ??
          'Seedream failed to redraw this image.',
      )
      return attachSession(
        jsonError(
          generated.error.code === 'SEEDREAM_CONFIG' ? 503 : 502,
          generated.error.code === 'SEEDREAM_CONFIG' ? 'SEEDREAM_CONFIG' : 'GENERATION_FAILED',
          message,
        ),
        wallet,
        cookieCredits,
      )
    }

    const prepared = await prepareGeneratedImage(generated.buffer, tier)
    const outputKey = shareOutputKey(id, prepared.ext)
    const outputUpload = await storage.upload(outputKey, prepared.buffer, {
      contentType: prepared.contentType,
    })
    if (!outputUpload.ok) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      return attachSession(
        jsonError(502, 'UPLOAD_FAILED', 'Could not store the generated image.'),
        wallet,
        cookieCredits,
      )
    }

    const meta: ShareMeta = {
      id,
      style: style.id,
      twist: feedback,
      inputKey,
      outputKey,
      inputUrl: storageUrl(inputKey),
      outputUrl: storageUrl(outputKey),
      createdAt: new Date().toISOString(),
      tier,
    }
    await writeShareMeta(storage, meta)
    const quota = await getQuotaSnapshot(req, wallet.id)
    if (typeof cookieCredits === 'number') quota.paidCredits = cookieCredits

    logger.info('meme iterated', {
      id,
      style: style.id,
      tier,
      provider: generated.provider,
      model: generated.model,
    })

    return attachSession(
      NextResponse.json({
        ok: true,
        data: {
          shareId: id,
          inputUrl: meta.inputUrl,
          outputUrl: meta.outputUrl,
          imageUrl: meta.outputUrl,
          style: style.id,
          twist: feedback,
          tier,
          quota,
          prompt: generated.prompt,
        },
      }),
      wallet,
      cookieCredits,
    )
  } catch (e) {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    logger.error('iterate route error', { message: e instanceof Error ? e.message : String(e) })
    return attachSession(
      jsonError(500, 'GENERATION_ERROR', 'Something went wrong. Please try again.'),
      wallet,
      cookieCredits,
    )
  }
}
