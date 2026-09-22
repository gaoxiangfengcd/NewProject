'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import { classifyEntry } from '@/lib/entry-source'

const SESSION_KEY = 'memego_session_entry'

function labelOf(el: Element): string {
  const aria = el.getAttribute('aria-label')?.trim()
  const text = (aria || el.textContent || '').trim().replace(/\s+/g, ' ')
  return text.slice(0, 80)
}

function publicHref(raw: string): string {
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) return raw.split(':')[0] ?? ''
  if (raw.startsWith('#')) return raw.slice(0, 80)
  try {
    const url = new URL(raw, window.location.origin)
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.hash}`.slice(0, 120)
    }
    return `${url.origin}${url.pathname}`.slice(0, 120)
  } catch {
    return ''
  }
}

/**
 * 每个页面记一次浏览；同一标签页只记一次进入来源。
 * 链接、按钮、折叠问题的点击记成 ui_click，方便看人点了哪里。
 */
export function VisitTracker(): null {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/insights') return
    track('page_view')
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      return
    }
    const source = classifyEntry(
      document.referrer,
      new URLSearchParams(window.location.search),
      window.location.hostname,
    )
    track('session_entry', {
      channel: source.channel,
      source: source.source,
      medium: source.medium,
      campaign: source.campaign || null,
    })
  }, [pathname])

  useEffect(() => {
    let last = ''
    let lastAt = 0

    function onClick(event: MouseEvent): void {
      const target = event.target
      if (!(target instanceof Element)) return
      if (window.location.pathname === '/insights') return
      const el = target.closest('a, button, summary')
      if (!el || el.hasAttribute('data-no-track') || el.closest('[data-no-track]')) return
      const kind = el.tagName.toLowerCase()
      const label = labelOf(el)
      if (!label || label === '+' || label.toLowerCase() === 'close') return
      const href = el instanceof HTMLAnchorElement ? publicHref(el.getAttribute('href') || '') : ''
      const stamp = `${kind}|${label}|${href}`
      const now = Date.now()
      if (stamp === last && now - lastAt < 400) return
      last = stamp
      lastAt = now
      track('ui_click', { kind, label, href: href || null })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
