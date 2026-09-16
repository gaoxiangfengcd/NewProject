import { NextResponse } from 'next/server'
import { getProvider as getImageProvider } from '@repo/image-gen'
import { getProvider as getStorageProvider } from '@repo/storage'
import { logger } from '@repo/common'
import { checkGenerateRateLimit } from '@/lib/rate-limit'
import { buildExaggerationPrompt, sanitizeTwist } from '@/lib/prompt'
import { getStyleOrDefault } from '@/lib/styles'
import { validateImage } from '@/lib/validation'
import { prepareGeneratedImage } from '@/lib/watermark'
import { modelForTier, type GenerationTier } from '@/lib/billing'
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
export const maxDuration = 60

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

async function fetchAsBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('data:')) {
    const base64 = url.slice(url.indexOf(',') + 1)
    return Buffer.from(base64, 'base64')
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`RESULT_FETCH_FAILED:${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function quotaUnavailable(error: 'redis_required' | 'redis_unavailable'): NextResponse {
  return jsonError(
    503,
    'SERVICE_UNAVAILABLE',
    'The generator is temporarily unavailable. Please try again later.',
    { reason: error },
  )
}

/**
 * POST /api/generate  (multipart/form-data)
 * fields: file · style? · twist? · tier=free|paid
 *
 * free：每 IP 每天 1 次，便宜模型 + 低清满幅水印
 * paid：扣 1 次付费额度，好模型 + 高清无水印
 * Generate again / 换 vibe 都是一次新的生成，按当时剩余额度计。
 */
export async function POST(req: Request): Promise<NextResponse> {
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

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return attachSession(
      jsonError(400, 'INVALID_FORM', 'Please upload the image as multipart form data.'),
      wallet,
    )
  }

  const file = form.get('file')
  if (!file || !(file instanceof File)) {
    return attachSession(jsonError(400, 'FILE_REQUIRED', 'An image file is required.'), wallet)
  }

  const style = getStyleOrDefault(String(form.get('style') ?? ''))
  const twist = sanitizeTwist(form.get('twist'))
  if (twist === null) {
    return attachSession(jsonError(400, 'INVALID_TWIST', 'Your twist is too long.'), wallet)
  }

  const requestedTier: GenerationTier = String(form.get('tier') ?? 'free') === 'paid' ? 'paid' : 'free'

  const validation = validateImage({ type: file.type, size: file.size })
  if (!validation.ok) {
    return attachSession(jsonError(400, validation.code, validation.message), wallet)
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer())
  if (inputBuffer.length === 0) {
    return attachSession(jsonError(400, 'EMPTY_FILE', 'The uploaded image is empty.'), wallet)
  }

  let tier: GenerationTier = requestedTier
  let cookieCredits: number | undefined
  let reservedFree = false
  let consumedPaid = false

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
  const inputKey = shareInputKey(id, validation.ext)

  const inputUpload = await storage.upload(inputKey, inputBuffer, {
    contentType: validation.mime,
  })
  if (!inputUpload.ok) {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    logger.error('input upload failed', { id, message: inputUpload.error.message })
    return attachSession(
      jsonError(502, 'UPLOAD_FAILED', 'Could not store the uploaded image.'),
      wallet,
      cookieCredits,
    )
  }

  try {
    const dataUri = `data:${validation.mime};base64,${inputBuffer.toString('base64')}`
    const provider = getImageProvider()
    const prompt = buildExaggerationPrompt(style, twist || undefined)
    const model = modelForTier(tier)

    const result = await provider.generate({
      prompt,
      inputImage: dataUri,
      promptStrength: style.strength,
      size: '1:1',
      model,
    })

    if (!result.ok) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      logger.error('image generation failed', {
        id,
        provider: result.error.code,
        details: result.error.details,
      })
      return attachSession(
        jsonError(
          502,
          'GENERATION_FAILED',
          'Our artist had a brain freeze. Please try again in a moment.',
        ),
        wallet,
        cookieCredits,
      )
    }

    let outputBuffer: Buffer
    try {
      outputBuffer = await fetchAsBuffer(result.value.url)
    } catch (e) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      logger.error('result fetch failed', {
        id,
        message: e instanceof Error ? e.message : String(e),
      })
      return attachSession(
        jsonError(502, 'RESULT_FETCH_FAILED', 'Could not download the generated image.'),
        wallet,
        cookieCredits,
      )
    }

    const prepared = await prepareGeneratedImage(outputBuffer, tier)
    const outputKey = shareOutputKey(id, prepared.ext)

    const outputUpload = await storage.upload(outputKey, prepared.buffer, {
      contentType: prepared.contentType,
    })
    if (!outputUpload.ok) {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      logger.error('output upload failed', { id, message: outputUpload.error.message })
      return attachSession(
        jsonError(502, 'UPLOAD_FAILED', 'Could not store the generated image.'),
        wallet,
        cookieCredits,
      )
    }

    const meta: ShareMeta = {
      id,
      style: style.id,
      twist: twist || null,
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

    logger.info('meme generated', {
      id,
      style: style.id,
      tier,
      provider: result.value.provider,
      model: result.value.model,
      bytes: prepared.buffer.length,
    })

    return attachSession(
      NextResponse.json({
        ok: true,
        data: {
          shareId: id,
          inputUrl: meta.inputUrl,
          outputUrl: meta.outputUrl,
          style: style.id,
          twist: twist || '',
          tier,
          quota,
        },
      }),
      wallet,
      cookieCredits,
    )
  } catch (e) {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    logger.error('generate route error', { id, message: e instanceof Error ? e.message : String(e) })
    return attachSession(
      jsonError(500, 'GENERATION_ERROR', 'Something went wrong. Please try again.'),
      wallet,
      cookieCredits,
    )
  }
}
