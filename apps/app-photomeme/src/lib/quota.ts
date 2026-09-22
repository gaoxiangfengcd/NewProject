import type { Redis } from 'ioredis'
import { getClientIp } from './rate-limit'
import { getRedis } from './redis'
import {
  CREDITS_PER_PURCHASE,
  CREDIT_TTL_DAYS,
  CREDIT_TTL_MS,
  FREE_PER_DAY,
  creditPacks,
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

/**
 * 点数按「批次」存：一笔购买 = 一个批次，field = 到期时间戳(ms)，value = 剩余点数。
 * CREDIT_TTL_DAYS=0 时到期时间为极大值，剩余次数永久有效。
 * 购买流水另记在 wallet:{id}:ledger（Redis 即本站额度账本）。
 *
 * 为什么不是单个计数器：若配置了有效期，单一数字表达不了「先到期的先扣」。
 * 用 hash 后每次 HINCRBY 仍是原子操作，扣减时按到期时间升序取最早的批次。
 * 另起一个 key（不复用 wallet:{id}:credits）是为了避开旧数据的 WRONGTYPE。
 */
function batchesKey(walletId: string): string {
  return `wallet:${walletId}:credit_batches`
}

interface CreditBatch {
  exp: number
  n: number
}

function expiryFrom(now: number): number {
  return CREDIT_TTL_MS > 0 ? now + CREDIT_TTL_MS : Number.MAX_SAFE_INTEGER
}

/** 读出未过期批次（按到期时间升序），顺手清掉已过期/非法的 field。 */
async function readBatches(redis: Redis, walletId: string): Promise<CreditBatch[]> {
  const key = batchesKey(walletId)
  const raw = await redis.hgetall(key)
  const now = Date.now()
  const batches: CreditBatch[] = []
  const stale: string[] = []
  for (const [field, value] of Object.entries(raw ?? {})) {
    const exp = Number(field)
    const n = Number(value)
    if (!Number.isFinite(exp) || !Number.isFinite(n) || n <= 0 || exp <= now) {
      stale.push(field)
      continue
    }
    batches.push({ exp, n })
  }
  if (stale.length > 0) await redis.hdel(key, ...stale).catch(() => undefined)
  return batches.sort((a, b) => a.exp - b.exp)
}

/**
 * 发放点数。inheritExpiry=true 用于「生成失败退还」——退回原批次的有效期，
 * 而不是白送新的一年。
 */
async function grantCredits(
  redis: Redis,
  walletId: string,
  amount: number,
  inheritExpiry = false,
): Promise<void> {
  const n = Math.max(0, Math.floor(amount))
  if (n === 0) return

  const key = batchesKey(walletId)
  let exp = expiryFrom(Date.now())
  if (inheritExpiry) {
    const batches = await readBatches(redis, walletId)
    for (const batch of batches) {
      if (batch.exp > exp) exp = batch.exp
    }
  }

  await redis.hincrby(key, String(exp), n)
  if (CREDIT_TTL_MS > 0) {
    await redis.pexpire(key, CREDIT_TTL_MS + 86_400_000).catch(() => undefined)
  } else {
    await redis.persist(key).catch(() => undefined)
  }
  const ledger = `wallet:${walletId}:ledger`
  await redis
    .lpush(
      ledger,
      JSON.stringify({ at: new Date().toISOString(), credits: n, forever: CREDIT_TTL_MS <= 0 }),
    )
    .catch(() => undefined)
  await redis.ltrim(ledger, 0, 199).catch(() => undefined)
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
      const [usedRaw, batches] = await Promise.all([
        redis.get(freeKey(identityKey(req))),
        readBatches(redis, walletId),
      ])
      freeUsed = Math.max(0, Number(usedRaw ?? 0) || 0)
      paidCredits = batches.reduce((sum, b) => sum + b.n, 0)
    } catch {
      // 读失败时按 0 展示，真正生成仍会 fail-closed
    }
  } else {
    paidCredits = readDevCreditsCookie(req)
  }

  const packs = creditPacks()

  return {
    freeRemaining: Math.max(0, freeLimit - freeUsed),
    freeLimit,
    paidCredits,
    checkoutEnabled: isCheckoutEnabled(),
    devGrantEnabled: isDevCreditGrantEnabled(),
    priceLabel: paidPriceLabel(),
    creditsPerPurchase: packs[0]?.credits ?? CREDITS_PER_PURCHASE,
    packs,
    creditTtlDays: CREDIT_TTL_DAYS,
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
      const key = batchesKey(walletId)
      const batches = await readBatches(redis, walletId)
      // 先扣最早到期的批次；并发下可能扣到 -1，回滚后继续试下一个批次
      for (const batch of batches) {
        const field = String(batch.exp)
        const next = await redis.hincrby(key, field, -1)
        if (next >= 0) {
          if (next === 0) await redis.hdel(key, field).catch(() => undefined)
          return { ok: true }
        }
        await redis.hincrby(key, field, 1).catch(() => undefined)
      }
      return { ok: false, error: 'no_credits' }
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
      await grantCredits(redis, walletId, 1, true)
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
      await grantCredits(redis, walletId, n)
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
    await grantCredits(redis, walletId, n)
    return { ok: true }
  } catch {
    return { ok: false, error: 'redis_unavailable' }
  }
}
