import { NextResponse } from 'next/server'
import { analyzePhoto } from '@/lib/photo-brief'
import { checkGenerateRateLimit } from '@/lib/rate-limit'
import { validateImage } from '@/lib/validation'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'
export const maxDuration = 90

/**
 * POST /api/analyze  multipart file · exclude_features?（换点子时避开已用特征）
 * 找一个主特征 + 环境后果，不扣次数。
 */
export async function POST(req: Request): Promise<NextResponse> {
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

  const excludeRaw = form.get('exclude_features')
  const excludeFeatures: string[] = []
  if (typeof excludeRaw === 'string' && excludeRaw.trim()) {
    try {
      const parsed = JSON.parse(excludeRaw) as unknown
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string' && item.trim()) excludeFeatures.push(item.trim().slice(0, 80))
          if (excludeFeatures.length >= 8) break
        }
      }
    } catch {
      excludeRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8)
        .forEach((s) => excludeFeatures.push(s))
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length === 0) {
    return NextResponse.json(
      { ok: false, error: { code: 'EMPTY_FILE', message: 'The uploaded image is empty.' } },
      { status: 400 },
    )
  }

  try {
    const report = await analyzePhoto({ buffer, mime: validation.mime, excludeFeatures })
    console.log('[analyze] ---- pipeline stop (qwen + deepseek, no FLUX) ----')
    const res = NextResponse.json({ ok: true, data: report })
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'ANALYZE_FAILED', message: 'Could not read the photo. Try again.' } },
      { status: 502 },
    )
  }
}
