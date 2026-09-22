'use client'

import { referrerHost } from '@/lib/entry-source'

/**
 * 轻量埋点：sendBeacon 优先（页面卸载也能发出），fetch keepalive 兜底。
 * 服务端 /api/collect 校验白名单、写 stdout，并把进入来源、页面、点击按天累加到 Redis。
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'session_entry'
  | 'ui_click'
  | 'homepage_view'
  | 'explore_opened'
  | 'photo_selected'
  | 'style_selected'
  | 'showcase_style_clicked'
  | 'idea_clicked'
  | 'generate_started'
  | 'generation_success'
  | 'generation_error'
  | 'download_clicked'
  | 'share_link_copied'
  | 'share_platform_clicked'
  | 'start_over_clicked'
  | 'share_page_view'
  | 'checkout_clicked'
  | 'unlock_hd_clicked'
  | 'quota_blocked'
  | 'credits_granted'
  | 'twist_hint_shown'
  | 'twist_hint_skipped'
  | 'twist_hint_muted'
  | 'photo_analyzed'
  | 'make_crazier'
  | 'try_another_idea'

type Props = Record<string, string | number | boolean | null | undefined>

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === 'undefined') return
  const payload = JSON.stringify({
    event,
    props: props ?? {},
    path: window.location.pathname,
    referrer: referrerHost(document.referrer) || null,
    ts: new Date().toISOString(),
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      if (navigator.sendBeacon('/api/collect', blob)) return
    }
  } catch {
    // fall through to fetch
  }

  void fetch('/api/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // 埋点失败永远不影响用户体验
  })
}
