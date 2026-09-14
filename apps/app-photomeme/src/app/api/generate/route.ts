import { NextResponse } from 'next/server'
import { getProvider, IMAGE_STYLES } from '@repo/image-gen'
import type { ImageSize, ImageStyleId } from '@repo/image-gen'
import { logger } from '@repo/common'
import { MAX_PROMPT_LENGTH, sanitizePrompt } from '@/lib/prompt'
import { checkGenerateRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
// 图片模型推理可能较慢（flux-schnell 通常数秒，复杂模型更久）
export const maxDuration = 60

const ALLOWED_SIZES: readonly ImageSize[] = [
  '1:1',
  '3:2',
  '2:3',
  '4:3',
  '3:4',
  '16:9',
  '9:16',
]

const ALLOWED_STYLE_IDS = new Set<ImageStyleId>(IMAGE_STYLES.map((style) => style.id))

function jsonError(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } }, { status })
}

/**
 * POST /api/generate
 * body: { prompt: string, style?: ImageStyleId, size?: ImageSize }
 * 统一响应：{ ok: true, data: GeneratedImage } | { ok: false, error: { code, message } }
 */
export async function POST(req: Request): Promise<NextResponse> {
  // P0：先限流再解析请求体，防止匿名刷量耗尽图片模型 API 额度
  const rateLimit = await checkGenerateRateLimit(req)
  if (rateLimit.limited) {
    const status = rateLimit.status ?? 429
    const message =
      rateLimit.reason === 'redis_unavailable'
        ? '生成服务暂不可用，请稍后重试'
        : '操作过于频繁，请稍后再试'
    return NextResponse.json(
      { ok: false, error: { code: status === 429 ? 'RATE_LIMITED' : 'SERVICE_UNAVAILABLE', message } },
      {
        status,
        headers: {
          'Retry-After': String(rateLimit.resetAfterSec),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'INVALID_JSON', '请求体不是合法 JSON')
  }

  const input = (body ?? {}) as { prompt?: unknown; style?: unknown; size?: unknown }

  const prompt = sanitizePrompt(input.prompt)
  if (!prompt) {
    return jsonError(
      400,
      'INVALID_PROMPT',
      `画面描述必填，且长度需在 1-${MAX_PROMPT_LENGTH} 字之间`,
    )
  }

  let style: ImageStyleId | undefined
  if (input.style !== undefined && input.style !== null && input.style !== '') {
    if (typeof input.style !== 'string' || !ALLOWED_STYLE_IDS.has(input.style as ImageStyleId)) {
      return jsonError(400, 'INVALID_STYLE', '不支持的风格参数')
    }
    style = input.style as ImageStyleId
  }

  let size: ImageSize | undefined
  if (input.size !== undefined && input.size !== null && input.size !== '') {
    if (typeof input.size !== 'string' || !ALLOWED_SIZES.includes(input.size as ImageSize)) {
      return jsonError(400, 'INVALID_SIZE', '不支持的画幅比例')
    }
    size = input.size as ImageSize
  }

  try {
    const provider = getProvider()
    const result = await provider.generate({ prompt, style, size })

    if (!result.ok) {
      logger.error('image generation failed', {
        provider: result.error.code,
        details: result.error.details,
      })
      return jsonError(result.error.status, result.error.code, result.error.message)
    }

    return NextResponse.json({ ok: true, data: result.value })
  } catch (e) {
    // getProvider() 配置缺失等同步错误
    logger.error('generate route error', {
      message: e instanceof Error ? e.message : String(e),
    })
    const message = e instanceof Error ? e.message : '生成服务暂不可用'
    return jsonError(500, 'GENERATION_ERROR', message)
  }
}
