'use client'

/**
 * 未填 twist 时的可选提示。不强制输入。
 * 「7 天内不再提示」记在 localStorage（并写一份 cookie 兜底）。
 */
const SKIP_UNTIL_KEY = 'memego_skip_twist_until'
export const TWIST_HINT_COOKIE = 'memego_skip_twist_v2'
const SKIP_MS = 7 * 24 * 60 * 60 * 1000

export const TWIST_HINT_EXAMPLES = [
  'Give them a giant cartoon head and tiny legs',
  'Put them on a movie poster as the unlikely hero',
  'Turn a tiny everyday moment into an epic disaster',
  'Make the family pet the real star of the photo',
] as const

export function twistHintMuted(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const until = Number(window.localStorage.getItem(SKIP_UNTIL_KEY) ?? '0')
    if (Number.isFinite(until) && until > Date.now()) return true
  } catch {
    // private mode 等读不了 storage 时看 cookie
  }
  return document.cookie.split(';').some((part) => part.trim().startsWith(`${TWIST_HINT_COOKIE}=`))
}

export function muteTwistHintForWeek(): void {
  const until = Date.now() + SKIP_MS
  try {
    window.localStorage.setItem(SKIP_UNTIL_KEY, String(until))
  } catch {
    // ignore
  }
  document.cookie = `${TWIST_HINT_COOKIE}=1; Path=/; Max-Age=${Math.floor(SKIP_MS / 1000)}; SameSite=Lax`
}
