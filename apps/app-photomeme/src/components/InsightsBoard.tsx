'use client'

import { useEffect, useState } from 'react'

const KEY_STORAGE = 'memego_insights_key'

const CHANNELS: Record<string, string> = {
  organic: '搜索引擎',
  social: '社交网站',
  referral: '别的网站',
  campaign: '推广链接',
  ad: '广告',
  direct: '直接打开',
}

interface InsightDay {
  date: string
  entries: { channel: string; source: string; landing: string; count: number }[]
  pages: { path: string; count: number }[]
  clicks: { name: string; count: number }[]
}

const CLICK_NAMES: Record<string, string> = {
  checkout_clicked: '购买',
  download_clicked: '下载',
  unlock_hd_clicked: '解锁高清',
  explore_opened: '打开 Explore',
  share_link_copied: '复制分享链接',
  share_platform_clicked: '分享',
  start_over_clicked: '重新开始',
  showcase_style_clicked: '点了风格',
  idea_clicked: '点了点子',
}

function pageName(path: string): string {
  if (path === '/' || path === '') return '首页'
  return path
}

function entryText(row: InsightDay['entries'][number]): string {
  const where = pageName(row.landing)
  const channel = CHANNELS[row.channel] ?? row.channel
  if (row.channel === 'direct' || row.source === 'direct') return `${channel} ${where}`
  return `${channel} ${row.source} → ${where}`
}

function clickLabel(name: string): string {
  const [kind, label, href] = name.split('|')
  if (kind === 'a' || kind === 'button' || kind === 'summary' || kind === 'link') {
    const target = href ? pageName(href) : ''
    return [label || '点击', target].filter(Boolean).join(' · ')
  }
  const known = CLICK_NAMES[kind] ?? kind
  return label ? `${known} · ${label}` : known
}

function total(rows: { count: number }[]): number {
  return rows.reduce((sum, row) => sum + row.count, 0)
}

function mergeCounts(rows: { key: string; count: number }[]): { key: string; count: number }[] {
  const map = new Map<string, number>()
  for (const row of rows) map.set(row.key, (map.get(row.key) ?? 0) + row.count)
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

export function InsightsBoard(): React.ReactElement {
  const [key, setKey] = useState('')
  const [days, setDays] = useState<InsightDay[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load(secret: string): Promise<void> {
    const trimmed = secret.trim()
    if (!trimmed) {
      setError('先填读取密钥。')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/insights?days=7', {
        headers: { Authorization: `Bearer ${trimmed}` },
      })
      if (res.status === 404) {
        setDays(null)
        setError('密钥不对，或者服务器上还没写 ANALYTICS_READ_KEY。')
        return
      }
      const json = (await res.json()) as {
        ok?: boolean
        storage?: string
        days?: InsightDay[]
        message?: string
      }
      if (!res.ok || !json.ok) {
        setDays(null)
        setError(json.message || '读不到数据。')
        return
      }
      if (json.storage === 'logs_only') {
        setDays([])
        setError('服务器没有接上 Redis，页面里还没有汇总。')
        return
      }
      sessionStorage.setItem(KEY_STORAGE, trimmed)
      setDays(json.days ?? [])
    } catch {
      setDays(null)
      setError('读不到数据。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE)
    if (!saved) return
    setKey(saved)
    void load(saved)
  }, [])

  const hasRows = days?.some((day) => day.entries.length || day.pages.length || day.clicks.length)
  const entries = mergeCounts(
    (days ?? []).flatMap((day) =>
      day.entries.map((row) => ({ key: entryText(row), count: row.count })),
    ),
  )
  const pages = mergeCounts(
    (days ?? []).flatMap((day) => day.pages.map((row) => ({ key: pageName(row.path), count: row.count }))),
  )
  const clicks = mergeCounts(
    (days ?? []).flatMap((day) => day.clicks.map((row) => ({ key: clickLabel(row.name), count: row.count }))),
  )

  return (
    <div data-no-track className="mt-6">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          void load(key)
        }}
      >
        <input
          type="password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          autoComplete="current-password"
          placeholder="读取密钥"
          className="input-base sm:max-w-sm"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '正在读取…' : '查看'}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-primary">{error}</p>}

      {days && !error && !hasRows && (
        <p className="mt-6 text-sm text-muted-foreground">这 7 天还没有访问记录。</p>
      )}

      {hasRows && (
        <div className="mt-8">
          <p className="text-sm font-bold text-muted-foreground">最近 7 天</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="card px-4 py-5 text-center">
              <p className="font-display text-3xl font-bold">{total(entries)}</p>
              <p className="mt-1 text-xs text-muted-foreground">进入次数</p>
            </div>
            <div className="card px-4 py-5 text-center">
              <p className="font-display text-3xl font-bold">{total(pages)}</p>
              <p className="mt-1 text-xs text-muted-foreground">浏览次数</p>
            </div>
            <div className="card px-4 py-5 text-center">
              <p className="font-display text-3xl font-bold">{total(clicks)}</p>
              <p className="mt-1 text-xs text-muted-foreground">点击次数</p>
            </div>
          </div>

          <section className="card mt-4 p-5">
            {entries.length > 0 && (
              <div>
                <h2 className="text-sm font-bold">从哪进来</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {entries.map((row) => (
                    <li key={row.key} className="flex justify-between gap-4">
                      <span>{row.key}</span>
                      <span className="font-semibold text-foreground">{row.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pages.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold">打开了哪些页</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {pages.map((row) => (
                    <li key={row.key} className="flex justify-between gap-4">
                      <span>{row.key}</span>
                      <span className="font-semibold text-foreground">{row.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <h2 className="text-sm font-bold">点了什么</h2>
              {clicks.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">还没有点击。</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {clicks.map((row) => (
                    <li key={row.key} className="flex justify-between gap-4">
                      <span>{row.key}</span>
                      <span className="font-semibold text-foreground">{row.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
