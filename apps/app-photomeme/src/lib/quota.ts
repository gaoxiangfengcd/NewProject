import { getClientIp } from './rate-limit'
import { getRedis } from './redis'
import {
  CREDITS_PER_PURCHASE,
  FREE_PER_DAY,
  isCheckoutEnabled,
  isDevCreditGrantEnabled,
  isLiveImageGen,
  paidPriceLabel,
  type QuotaSnapshot,
} from './billing'
import { readDevCreditsCookie } from './wallet'

/**
 * 每日免费额度按 IP 计（设备指纹以后加在 identityKey 里，不改调用方）。
 * 付费次数记在钱包 cookie 对应的 Redis，未配 Redis 的 mock 开发可用 cookie 次数。
 */

export type QuotaBackendError = 'redis_required' | 'redis_unavailable'

function mustEnforceQuota(): boolean {
  return isLiveImageGen() && process.env.NODE_ENV === 'production'
}

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function ttlUntilNextUtcMidnightSec(): number {
  const now = new Date()
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  return Math.max(60, Math.ceil((next - Date.now()) / 1000))
}

function freeKey(ip: string): string {
  return `quota:free:ip:${ip}:${utcDateKey()}`
}

function creditsKey(walletId: string): string {
  return `wallet:${walletId}:credits`
}

export function identityKey(req: Request): string {
  return getClientIp(req)
}

export async function getQuotaSnapshot(req: Request, walletId: string): Promise<QuotaSnapshot> {
  const freeLimit = FREE_PER_DAY
  const redis = getRedis()

  let freeUsed = 0
  let paidCredits = 0

  if (redis) {
    try {
      const [usedRaw, creditsRaw] = await Promise.all([
        redis.get(freeKey(identityKey(req))),
        redis.get(creditsKey(walletId)),
      ])
      freeUsed = Math.max(0, Number(usedRaw ?? 0) || 0)
      paidCredits = Math.max(0, Number(creditsRaw ?? 0) || 0)
    } catch {
      // 读失败时按 0 展示，真正生成仍会 fail-closed
    }
  } else {
    paidCredits = readDevCreditsCookie(req)
  }

  return {
    freeRemaining: Math.max(0, freeLimit - freeUsed),
    freeLimit,
    paidCredits,
    checkoutEnabled: isCheckoutEnabled(),
    devGrantEnabled: isDevCreditGrantEnabled(),
    priceLabel: paidPriceLabel(),
    creditsPerPurchase: CREDITS_PER_PURCHASE,
  }
}

export async function reserveFreeSlot(
  req: Request,
): Promise<{ ok: true } | { ok: false; error: QuotaBackendError | 'quota_exceeded' }> {
  const redis = getRedis()
  if (!redis) {
    if (mustEnforceQuota()) return { ok: false, error: 'redis_required' }
    return { ok: true }
  }

  const key = freeKey(identityKey(req))
  try {
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, ttlUntilNextUtcMidnightSec())
    if (count > FREE_PER_DAY) {
      await redis.decr(key)
      return { ok: false, error: 'quota_exceeded' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'redis_unavailable' }
  }
}

export async function refundFreeSlot(req: Request): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    const key = freeKey(identityKey(req))
    const next = await redis.decr(key)
    if (next < 0) await redis.set(key, 0)
  } catch {
    // 退还失败只影响当天额度，不阻断错误响应
  }
}

export async function consumePaidCredit(
  req: Request,
  walletId: string,
): Promise<
  | { ok: true; cookieCredits?: number }
  | { ok: false; error: QuotaBackendError | 'no_credits' }
> {
  const redis = getRedis()
  if (redis) {
    try {
      const key = creditsKey(walletId)
      const next = await redis.decr(key)
      if (next < 0) {
        await redis.incr(key)
        return { ok: false, error: 'no_credits' }
      }
      return { ok: true }
    } catch {
      return { ok: false, error: 'redis_unavailable' }
    }
  }

  if (mustEnforceQuota()) return { ok: false, error: 'redis_required' }

  const current = readDevCreditsCookie(req)
  if (current < 1) return { ok: false, error: 'no_credits' }
  return { ok: true, cookieCredits: current - 1 }
}

export async function refundPaidCredit(walletId: string, cookieCredits?: number): Promise<number | undefined> {
  const redis = getRedis()
  if (redis) {
    try {
      await redis.incr(creditsKey(walletId))
    } catch {
      // ignore
    }
    return undefined
  }
  if (typeof cookieCredits === 'number') return cookieCredits + 1
  return undefined
}

export async function addPaidCredits(
  req: Request,
  walletId: string,
  amount: number,
): Promise<{ ok: true; cookieCredits?: number } | { ok: false; error: QuotaBackendError }> {
  const n = Math.max(0, Math.floor(amount))
  if (n === 0) return { ok: true }

  const redis = getRedis()
  if (redis) {
    try {
      await redis.incrby(creditsKey(walletId), n)
      return { ok: true }
    } catch {
      return { ok: false, error: 'redis_unavailable' }
    }
  }

  if (mustEnforceQuota()) return { ok: false, error: 'redis_required' }
  return { ok: true, cookieCredits: readDevCreditsCookie(req) + n }
}

export async function claimCheckoutOnce(txnId: string): Promise<'ok' | 'duplicate' | 'unavailable'> {
  const redis = getRedis()
  if (!redis) return 'unavailable'
  try {
    const ok = await redis.set(`checkout:paddle:${txnId}`, '1', 'EX', 60 * 60 * 24 * 30, 'NX')
    return ok === 'OK' ? 'ok' : 'duplicate'
  } catch {
    return 'unavailable'
  }
}

export async function releaseCheckoutClaim(txnId: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.del(`checkout:paddle:${txnId}`)
  } catch {
    // ignore
  }
}

/** Webhook 入账：只写 Redis 钱包，不依赖浏览器 cookie。 */
export async function addPaidCreditsToWallet(
  walletId: string,
  amount: number,
): Promise<{ ok: true } | { ok: false; error: QuotaBackendError }> {
  const n = Math.max(0, Math.floor(amount))
  if (n === 0) return { ok: true }
  const redis = getRedis()
  if (!redis) return { ok: false, error: mustEnforceQuota() ? 'redis_required' : 'redis_unavailable' }
  try {
    await redis.incrby(creditsKey(walletId), n)
    return { ok: true }
  } catch {
    return { ok: false, error: 'redis_unavailable' }
  }
}
