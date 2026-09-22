export type EntryChannel = 'direct' | 'organic' | 'social' | 'referral' | 'campaign' | 'ad'

export interface EntrySource {
  channel: EntryChannel
  source: string
  medium: string
  campaign: string
}

const SEARCH_ENGINES: { test: RegExp; source: string }[] = [
  { test: /(^|\.)google\./, source: 'google' },
  { test: /(^|\.)bing\.com$/, source: 'bing' },
  { test: /(^|\.)duckduckgo\.com$/, source: 'duckduckgo' },
  { test: /(^|\.)yahoo\./, source: 'yahoo' },
  { test: /(^|\.)baidu\.com$/, source: 'baidu' },
  { test: /(^|\.)yandex\./, source: 'yandex' },
  { test: /(^|\.)ecosia\.org$/, source: 'ecosia' },
  { test: /(^|\.)brave\.com$/, source: 'brave' },
]

const SOCIAL_HOSTS: { test: RegExp; source: string }[] = [
  { test: /(^|\.)facebook\.com$|(^|\.)fb\.com$/, source: 'facebook' },
  { test: /(^|\.)instagram\.com$/, source: 'instagram' },
  { test: /(^|\.)tiktok\.com$/, source: 'tiktok' },
  { test: /(^|\.)twitter\.com$|(^|\.)x\.com$|(^|\.)t\.co$/, source: 'x' },
  { test: /(^|\.)reddit\.com$/, source: 'reddit' },
  { test: /(^|\.)pinterest\.com$/, source: 'pinterest' },
  { test: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/, source: 'youtube' },
  { test: /(^|\.)linkedin\.com$/, source: 'linkedin' },
  { test: /(^|\.)discord\.com$|(^|\.)discord\.gg$/, source: 'discord' },
  { test: /(^|\.)threads\.net$/, source: 'threads' },
]

const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paidsocial', 'display', 'cpm', 'cpv'])

function cleanToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40)
}

export function referrerHost(referrer: string): string {
  try {
    return new URL(referrer).hostname.replace(/^www\./, '').slice(0, 80)
  } catch {
    return ''
  }
}

function matchHost(
  host: string,
  rows: { test: RegExp; source: string }[],
): string | null {
  for (const row of rows) {
    if (row.test.test(host)) return row.source
  }
  return null
}

/**
 * 把这次打开归到一个渠道：广告参数优先，其次搜索引擎（SEO）、社交、其它网站、直接打开。
 */
export function classifyEntry(
  referrer: string,
  params: URLSearchParams,
  selfHost: string,
): EntrySource {
  const utmSource = cleanToken(params.get('utm_source') ?? '')
  const utmMedium = cleanToken(params.get('utm_medium') ?? '')
  const utmCampaign = cleanToken(params.get('utm_campaign') ?? '')
  const host = referrerHost(referrer)
  const externalHost = host && host !== selfHost.replace(/^www\./, '') ? host : ''

  if (utmSource || utmMedium || utmCampaign) {
    const paid = PAID_MEDIUMS.has(utmMedium)
    return {
      channel: paid ? 'ad' : 'campaign',
      source: utmSource || externalHost || 'campaign',
      medium: utmMedium || (paid ? 'ad' : 'campaign'),
      campaign: utmCampaign,
    }
  }

  if (!externalHost) {
    return { channel: 'direct', source: 'direct', medium: 'none', campaign: '' }
  }

  const organic = matchHost(externalHost, SEARCH_ENGINES)
  if (organic) {
    return { channel: 'organic', source: organic, medium: 'organic', campaign: '' }
  }

  const social = matchHost(externalHost, SOCIAL_HOSTS)
  if (social) {
    return { channel: 'social', source: social, medium: 'social', campaign: '' }
  }

  return { channel: 'referral', source: externalHost, medium: 'referral', campaign: '' }
}
