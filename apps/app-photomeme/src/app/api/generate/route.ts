import { NextResponse } from 'next/server'
import { getProvider as getStorageProvider } from '@repo/storage'
import { logger } from '@repo/common'
import { checkGenerateRateLimit } from '@/lib/rate-limit'
import { buildExaggerationPrompt, parseUserCreativeRules } from '@/lib/prompt'
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

function parseDirectionField(raw: unknown): { scene: string } | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const title = typeof parsed.title === 'string' ? parsed.title.replace(/\s+/g, ' ').trim() : ''
    const description =
      typeof parsed.description === 'string' ? parsed.description.replace(/\s+/g, ' ').trim() : ''
    const english =
      typeof parsed.english_prompt === 'string' ? parsed.english_prompt.replace(/\s+/g, ' ').trim() : ''
    const scene = /[\u4e00-\u9fff]/.test(description)
      ? description
      : [title, description].filter(Boolean).join('. ') || english
    if (!scene) return null
    return { scene: scene.slice(0, 700) }
  } catch {
    return null
  }
}

/**
 * POST /api/generate  (multipart/form-data)
 * fields: file · style? · twist? · tier=free|paid · analysis? JSON creative brief
 *
 * free：每 IP 每天 1 次，便宜模型 + 低清水印 + 更轻的夸张
 * paid：扣 1 次付费额度（记在 Redis 钱包，剩余次数永不过期），更好模型 + 高清无水印 + 更搞笑
 * Generate again / 换 vibe 都是一次新的生成，按当时剩余额度计。
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
  const twistParsed = parseUserCreativeRules(form.get('twist'))
  if (!twistParsed.ok) {
    return attachSession(jsonError(400, twistParsed.code, twistParsed.message), wallet)
  }
  let twist = twistParsed.value
  const direction = parseDirectionField(form.get('direction'))
  if (direction) {
    const scene = twist ? `${direction.scene}。用户要求：${twist}` : direction.scene
    const directed = parseUserCreativeRules(`DIRECTION:${scene}`)
    if (!directed.ok) {
      return attachSession(jsonError(400, directed.code, directed.message), wallet)
    }
    twist = directed.value
  }

  const requestedTier: GenerationTier = String(form.get('tier') ?? 'free') === 'paid' ? 'paid' : 'free'
  console.log(
    '[route] request:',
    JSON.stringify({
      hasPhoto: Boolean(file),
      style: style?.name,
      tier: requestedTier,
      twist: twist?.slice(0, 50),
    }),
  )
  console.log('[route] ---- analyze done ----')

  if (process.env.DEBUG_STOP_AFTER_REASONING === '1') {
    console.log('[route] ---- debug stop after reasoning (generation skipped) ----')
    return attachSession(
      NextResponse.json({
        ok: true,
        data: {
          shareId: '',
          inputUrl: '',
          outputUrl: '',
          style: style.id,
          twist: twist || '',
          tier: requestedTier,
          primaryFeature: '',
          debugStop: 'reasoning',
        },
      }),
      wallet,
    )
  }

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
    console.log('[route] ---- reasoning done ----')
    const prompt = buildExaggerationPrompt(style, twist || undefined, tier, null)
    const model = modelForTier(tier)
    console.log('[generate] using provider:', provider)
    console.log('[generate] provider:', provider)
    console.log('[generate] model:', model)

    const failGeneration = async (result: {
      error: { code: string; details?: unknown }
    }): Promise<NextResponse> => {
      if (reservedFree) await refundFreeSlot(req)
      if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
      logger.error('image generation failed', {
        id,
        provider: result.error.code,
        details: result.error.details,
      })
      const providerMessage = String(
        (result.error.details as { message?: unknown } | undefined)?.message ?? '',
      )
      const blocked = /flagged as sensitive|E005|nsfw|safety/i.test(providerMessage)
      const noCredit = /insufficient credit|402/i.test(providerMessage)
      const timedOut = /timed out/i.test(providerMessage)
      return attachSession(
        jsonError(
          blocked ? 422 : noCredit ? 402 : timedOut ? 504 : 502,
          blocked ? 'CONTENT_BLOCKED' : noCredit ? 'PROVIDER_CREDIT' : 'GENERATION_FAILED',
          blocked
            ? 'The image model blocked this photo. Photos of young children are often rejected by the safety filter — try a photo of an adult, or a different picture.'
            : noCredit
              ? 'The drawing service is out of credit. Check 火山引擎 Seedream billing and try again.'
              : timedOut
                ? 'Seedream took too long (over 60s). Please try once more in a minute.'
                : providerMessage
                  ? providerMessage
                  : 'Seedream failed to draw this image. Please try again in a moment.',
        ),
        wallet,
        cookieCredits,
      )
    }

    const generated = await executeT2I({
      prompt,
      model,
      inputImage: `data:${validation.mime};base64,${inputBuffer.toString('base64')}`,
    })
    if (!generated.ok) {
      if (generated.error.code === 'SEEDREAM_CONFIG' || generated.error.code === 'SEEDREAM_FAILED') {
        if (reservedFree) await refundFreeSlot(req)
        if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
        const message = String(
          (generated.error.details as { message?: unknown } | undefined)?.message ??
            'Seedream is not configured or the request failed.',
        )
        return attachSession(
          jsonError(
            generated.error.code === 'SEEDREAM_CONFIG' ? 503 : 502,
            generated.error.code,
            message,
          ),
          wallet,
          cookieCredits,
        )
      }
      if (generated.error.code === 'RESULT_FETCH_FAILED') {
        if (reservedFree) await refundFreeSlot(req)
        if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
        return attachSession(
          jsonError(502, 'RESULT_FETCH_FAILED', 'Could not download the generated image.'),
          wallet,
          cookieCredits,
        )
      }
      return await failGeneration(generated)
    }

    const outputBuffer = generated.buffer
    const usedProvider = generated.provider
    const usedModel = generated.model
    const usedPrompt = generated.prompt

    let prepared: Awaited<ReturnType<typeof prepareGeneratedImage>>
    try {
      prepared = await prepareGeneratedImage(outputBuffer, tier)
    } catch (e) {
      logger.error('prepare generated image failed', {
        id,
        message: e instanceof Error ? e.message : String(e),
      })
      return attachSession(
        jsonError(
          502,
          'GENERATION_FAILED',
          'Seedream returned an image we could not process. Please try again.',
        ),
        wallet,
        cookieCredits,
      )
    }
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
      provider: usedProvider,
      model: usedModel,
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
          prompt: usedPrompt,
          imageUrl: meta.outputUrl,
        },
      }),
      wallet,
      cookieCredits,
    )
  } catch (e) {
    if (reservedFree) await refundFreeSlot(req)
    if (consumedPaid) cookieCredits = await refundPaidCredit(wallet.id, cookieCredits)
    const message = e instanceof Error ? e.message : String(e)
    logger.error('generate route error', { id, message })
    return attachSession(
      jsonError(
        500,
        'GENERATION_ERROR',
        message ? `Generation failed: ${message}` : 'Something went wrong. Please try again.',
      ),
      wallet,
      cookieCredits,
    )
  }
}
