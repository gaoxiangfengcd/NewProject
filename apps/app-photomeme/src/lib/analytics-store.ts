import { getRedis } from './redis'

const TTL_SEC = 60 * 60 * 24 * 90

export interface AnalyticsRecord {
  event: string
  path: string | null
  props: Record<string, string | number | boolean | null>
}

export interface InsightDay {
  date: string
  entries: { channel: string; source: string; landing: string; count: number }[]
  pages: { path: string; count: number }[]
  clicks: { name: string; count: number }[]
}

function utcDay(offset: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - offset)
  return date.toISOString().slice(0, 10)
}

function propText(props: AnalyticsRecord['props'], key: string): string {
  const value = props[key]
  return typeof value === 'string' ? value.replace(/\|/g, '').slice(0, 80) : ''
}

function clickField(record: AnalyticsRecord): string | null {
  if (record.event === 'ui_click') {
    const kind = propText(record.props, 'kind') || 'click'
    const label = propText(record.props, 'label') || 'unlabeled'
    const href = propText(record.props, 'href')
    return `${kind}|${label}${href ? `|${href}` : ''}`.slice(0, 140)
  }
  if (record.event.endsWith('_clicked') || record.event === 'explore_opened') {
    const extra =
      propText(record.props, 'packId') ||
      propText(record.props, 'platform') ||
      propText(record.props, 'style') ||
      propText(record.props, 'tier')
    return extra ? `${record.event}|${extra}` : record.event
  }
  return null
}

/** 按 UTC 日累计进入来源、页面和点击。Redis 不可用时静默跳过，原始日志仍在。 */
export async function recordAnalytics(record: AnalyticsRecord): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  const day = utcDay(0)
  const multi = redis.multi()

  if (record.event === 'session_entry') {
    const channel = propText(record.props, 'channel') || 'direct'
    const source = propText(record.props, 'source') || 'direct'
    const landing = (record.path || '/').replace(/\|/g, '').slice(0, 80)
    const key = `analytics:entry:${day}`
    multi.hincrby(key, `${channel}|${source}|${landing}`.slice(0, 140), 1)
    multi.expire(key, TTL_SEC)
  }

  if (record.event === 'page_view' && record.path) {
    const key = `analytics:page:${day}`
    multi.hincrby(key, record.path.slice(0, 120), 1)
    multi.expire(key, TTL_SEC)
  }

  const click = clickField(record)
  if (click) {
    const key = `analytics:click:${day}`
    multi.hincrby(key, click, 1)
    multi.expire(key, TTL_SEC)
  }

  await multi.exec()
}

function ranked(raw: Record<string, string>): { name: string; count: number }[] {
  return Object.entries(raw)
    .map(([name, count]) => ({ name, count: Number(count) || 0 }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
}

export async function readInsights(days: number): Promise<InsightDay[]> {
  const redis = getRedis()
  if (!redis) return []
  const span = Math.min(30, Math.max(1, Math.floor(days)))
  const out: InsightDay[] = []

  for (let offset = 0; offset < span; offset += 1) {
    const date = utcDay(offset)
    const [entries, pages, clicks] = await Promise.all([
      redis.hgetall(`analytics:entry:${date}`),
      redis.hgetall(`analytics:page:${date}`),
      redis.hgetall(`analytics:click:${date}`),
    ])
    out.push({
      date,
      entries: ranked(entries).map((row) => {
        const [channel, source, landing] = row.name.split('|')
        return {
          channel: channel || 'direct',
          source: source || channel || 'direct',
          landing: landing || '/',
          count: row.count,
        }
      }),
      pages: ranked(pages).map((row) => ({ path: row.name, count: row.count })),
      clicks: ranked(clicks),
    })
  }

  return out
}
