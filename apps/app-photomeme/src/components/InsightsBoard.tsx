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

function clickLabel(name: string): string {
  return name.replace(/\|/g, ' · ')
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
        <div className="mt-8 space-y-8">
          {days?.map((day) =>
            day.entries.length + day.pages.length + day.clicks.length === 0 ? null : (
              <section key={day.date} className="card p-5">
                <h2 className="font-display text-xl font-bold">{day.date}</h2>

                {day.entries.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold">从哪进来</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {day.entries.map((row) => (
                        <li key={`${row.channel}-${row.source}-${row.landing}`}>
                          {CHANNELS[row.channel] ?? row.channel} · {row.source} · {row.landing} ·{' '}
                          {row.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.pages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold">打开了哪些页</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {day.pages.map((row) => (
                        <li key={row.path}>
                          {row.path} · {row.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.clicks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold">点了什么</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {day.clicks.map((row) => (
                        <li key={row.name}>
                          {clickLabel(row.name)} · {row.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ),
          )}
        </div>
      )}
    </div>
  )
}
