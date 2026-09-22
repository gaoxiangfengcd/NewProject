import { NextResponse } from 'next/server'
import { logger } from '@repo/common'
import { recordAnalytics } from '@/lib/analytics-store'

export const runtime = 'nodejs'

/** 事件白名单：未列出的事件名直接丢弃，防止日志注入刷量 */
const ALLOWED_EVENTS = new Set([
  'page_view',
  'session_entry',
  'ui_click',
  'homepage_view',
  'photo_selected',
  'style_selected',
  'showcase_style_clicked',
  'idea_clicked',
  'generate_started',
  'generation_success',
  'generation_error',
  'download_clicked',
  'share_link_copied',
  'share_platform_clicked',
  'start_over_clicked',
  'share_page_view',
  'checkout_clicked',
  'unlock_hd_clicked',
  'quota_blocked',
  'credits_granted',
  'explore_opened',
  'twist_hint_shown',
  'twist_hint_skipped',
  'twist_hint_muted',
  'photo_analyzed',
  'make_crazier',
  'try_another_idea',
])

const MAX_PROPS = 20
const MAX_VALUE_LEN = 200

function sanitizeProps(raw: unknown): Record<string, string | number | boolean | null> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string | number | boolean | null> = {}
  let count = 0
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (count >= MAX_PROPS) break
    if (typeof value === 'string') {
      out[key] = value.slice(0, MAX_VALUE_LEN)
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value
    } else if (value === null || value === undefined) {
      out[key] = null
    }
    count += 1
  }
  return out
}

/**
 * POST /api/collect
 * 轻量埋点接收：结构化 stdout 日志，并把进入来源、浏览、点击按天累加到 Redis。
 * 不设追踪 cookie、不做用户画像。汇总见 GET /api/insights。
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  const events = Array.isArray(body) ? body : [body]
  for (const item of events.slice(0, 5)) {
    if (!item || typeof item !== 'object') continue
    const event = (item as { event?: unknown }).event
    if (typeof event !== 'string' || !ALLOWED_EVENTS.has(event)) continue

    const record = item as {
      props?: unknown
      path?: unknown
      referrer?: unknown
      ts?: unknown
    }
    const props = sanitizeProps(record.props)
    const path = typeof record.path === 'string' ? record.path.slice(0, 200) : null
    logger.info('analytics_event', {
      event,
      props,
      path,
      referrer: typeof record.referrer === 'string' ? record.referrer.slice(0, 200) : null,
      ts: typeof record.ts === 'string' ? record.ts : new Date().toISOString(),
    })
    void recordAnalytics({ event, path, props }).catch((error: unknown) => {
      logger.error('analytics aggregate failed', {
        message: error instanceof Error ? error.message : String(error),
      })
    })
  }

  return new NextResponse(null, { status: 204 })
}
