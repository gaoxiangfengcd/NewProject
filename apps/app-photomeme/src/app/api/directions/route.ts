import { NextResponse } from 'next/server'
import { analyzePhoto, rememberPhotoReport } from '@/lib/photo-brief'
import {
  getDirectionsFromDeepSeek,
  reasonCreativeDirections,
  ReasoningError,
} from '@/lib/reasoning-engine'
import { checkGenerateRateLimit } from '@/lib/rate-limit'
import { validateImage } from '@/lib/validation'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'
export const maxDuration = 90

const FAIL_MESSAGE = '创意方向生成失败，请稍后重试'

function errorBody(error_code: 'REASONING_TIMEOUT' | 'REASONING_FAILED' | 'PARSE_FAILED') {
  return { status: 'error' as const, error_code, message: FAIL_MESSAGE }
}

/**
 * POST /api/directions  multipart file
 * Qwen 分析 + DeepSeek 方向；只返回 directions，不返回分析 JSON。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const started = Date.now()
  let qwenMs = 0
  let deepseekMs = 0
  const wallet = ensureWalletId(req)
  const limited = await checkGenerateRateLimit(req)
  if (limited.limited) {
    const res = NextResponse.json(
      {
        ok: false,
        error: { code: 'RATE_LIMITED', message: 'Please wait a moment and try again.' },
      },
      { status: limited.status ?? 429 },
    )
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_FORM', message: 'Please upload the image as multipart form data.' } },
      { status: 400 },
    )
  }

  const file = form.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: { code: 'FILE_REQUIRED', message: 'An image file is required.' } },
      { status: 400 },
    )
  }

  const validation = validateImage({ type: file.type, size: file.size })
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: { code: validation.code, message: validation.message } },
      { status: 400 },
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length === 0) {
    return NextResponse.json(
      { ok: false, error: { code: 'EMPTY_FILE', message: 'The uploaded image is empty.' } },
      { status: 400 },
    )
  }

  const logTiming = (status: string) => {
    const totalMs = Date.now() - started
    console.log(
      '[directions] qwen took',
      qwenMs,
      'ms, deepseek took',
      deepseekMs,
      'ms, total',
      totalMs,
      'ms, status',
      status,
    )
  }

  try {
    const mode = (process.env.ANALYSIS_MODE || 'deepseek_direct').trim()
    console.log('[directions] mode:', mode || 'deepseek_direct')
    console.log('[directions] image size:', buffer.length)

    let directions
    if (mode !== 'qwen_then_deepseek') {
      const deepseekStart = Date.now()
      directions = await getDirectionsFromDeepSeek(buffer)
      deepseekMs = Date.now() - deepseekStart
    } else {
      const qwenStart = Date.now()
      const report = await analyzePhoto({ buffer, mime: validation.mime })
      qwenMs = Date.now() - qwenStart
      rememberPhotoReport(buffer, report)
      const deepseekStart = Date.now()
      directions = await reasonCreativeDirections(report)
      deepseekMs = Date.now() - deepseekStart
    }
    logTiming('ok')
    const res = NextResponse.json({ status: 'ok', directions })
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  } catch (error) {
    if (error instanceof ReasoningError) {
      logTiming(error.code)
      const http = error.code === 'REASONING_TIMEOUT' ? 504 : 502
      const res = NextResponse.json(errorBody(error.code), { status: http })
      if (wallet.created) applyWalletCookie(res, wallet.id)
      return res
    }
    logTiming('REASONING_FAILED')
    const res = NextResponse.json(errorBody('REASONING_FAILED'), { status: 502 })
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  }
}
