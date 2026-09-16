import { NextResponse, type NextRequest } from 'next/server'
import { getProvider } from '@repo/storage'
import { logger } from '@repo/common'

export const runtime = 'nodejs'

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  json: 'application/json',
}

/**
 * GET /api/storage/shares/{id}/output.png
 * 只读暴露 shares/ 前缀的对象：
 * - 配置了 R2_PUBLIC_URL：302 到 R2 直链（免 VPS 出口带宽）
 * - local provider：服务端流式输出
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string[] } },
): Promise<NextResponse> {
  const key = params.key.map((seg) => seg).join('/')

  if (!key.startsWith('shares/') || key.includes('..')) {
    return NextResponse.json({ ok: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 })
  }

  // R2 公开桶：直接跳转直链
  const r2PublicUrl = (process.env.R2_PUBLIC_URL ?? '').replace(/\/+$/, '')
  if (r2PublicUrl) {
    return NextResponse.redirect(`${r2PublicUrl}/${key}`, {
      status: 302,
      headers: { 'Cache-Control': 'public, max-age=604800, immutable' },
    })
  }

  try {
    const storage = getProvider()
    const result = await storage.download(key)
    if (!result.ok) {
      const status = result.error.status === 404 ? 404 : 502
      return NextResponse.json(
        { ok: false, error: { code: result.error.code, message: result.error.message } },
        { status },
      )
    }

    const ext = key.split('.').pop()?.toLowerCase() ?? ''
    const contentType = CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream'

    // key 不可变（每次生成都是新 id），边缘与浏览器可长期缓存
    return new NextResponse(result.value, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e) {
    logger.error('storage route error', { message: e instanceof Error ? e.message : String(e) })
    return NextResponse.json(
      { ok: false, error: { code: 'STORAGE_UNAVAILABLE', message: 'Storage is not configured' } },
      { status: 503 },
    )
  }
}
