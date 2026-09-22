import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { readInsights } from '@/lib/analytics-store'
import { getRedis } from '@/lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(req: Request, key: string): boolean {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
  const left = Buffer.from(token)
  const right = Buffer.from(key)
  if (left.length === 0 || left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/**
 * GET /api/insights?days=7
 * 进入来源、页面浏览、点击的按日汇总。需要 ANALYTICS_READ_KEY。
 * 未配置或密钥不对时返回 404，避免把这个地址暴露成公开接口。
 */
export async function GET(req: Request): Promise<NextResponse> {
  const key = (process.env.ANALYTICS_READ_KEY ?? '').trim()
  if (!key || !authorized(req, key)) {
    return new NextResponse(null, { status: 404 })
  }

  const requested = Number(new URL(req.url).searchParams.get('days') ?? '7')
  if (!getRedis()) {
    return NextResponse.json({ ok: true, storage: 'logs_only', days: [] })
  }

  try {
    const rows = await readInsights(Number.isFinite(requested) ? requested : 7)
    return NextResponse.json({
      ok: true,
      storage: 'redis',
      days: rows.filter(
        (row, index) =>
          index === 0 || row.entries.length > 0 || row.pages.length > 0 || row.clicks.length > 0,
      ),
    })
  } catch {
    return NextResponse.json({ ok: false, message: 'Could not read analytics.' }, { status: 500 })
  }
}
