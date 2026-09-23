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
 * 免费额度按「这个浏览器」计，同时再卡一道 IP。
 * 只按 IP 时，关浏览器、换网络或 IPv4/IPv6 切换都会变成一个新人，免费次数被重置。
 * 钱包 cookie 关浏览器还在，所以免费次数跟钱包走，从第一次使用起 24 小时。
 * 付费次数也记在这个钱包上。未配 Redis 的 mock 开发可用 cookie 次数。
 */

export type QuotaBackendError = 'redis_required' | 'redis_unavailable'

function mustEnforceQuota(): boolean {
  return isLiveImageGen() && process.env.NODE_ENV === 'production'
}

/** 免费窗口从第一次占用起算，不是到 UTC 零点（北京时间早上 8 点）清零。 */
const FREE_WINDOW_SEC = 60 * 60 * 24

function freeDeviceKey(walletId: string): string {
  return `quota:free:dev:${walletId}`
}

function freeIpKey(ip: string): string {
  return `quota:free:ip:${ip}`
}

async function readFreeCount(redis: Redis, key: string): Promise<number> {
  const raw = await redis.get(key)
  return Math.max(0, Number(raw ?? 0) || 0)
}

async function takeFreeCount(redis: Redis, key: string): Promise<number> {
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, FREE_WINDOW_SEC)
  return count
}

async function giveBackFreeCount(redis: Redis, key: string): Promise<void> {
  const next = await redis.decr(key)
  if (next <= 0) await redis.del(key)
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
      const [deviceUsed, ipUsed, batches] = await Promise.all([
        readFreeCount(redis, freeDeviceKey(walletId)),
        readFreeCount(redis, freeIpKey(identityKey(req))),
        readBatches(redis, walletId),
      ])
      freeUsed = Math.max(deviceUsed, ipUsed)
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
  walletId: string,
): Promise<{ ok: true } | { ok: false; error: QuotaBackendError | 'quota_exceeded' }> {
  const redis = getRedis()
  if (!redis) {
    if (mustEnforceQuota()) return { ok: false, error: 'redis_required' }
    return { ok: true }
  }

  const deviceKey = freeDeviceKey(walletId)
  const ipKey = freeIpKey(identityKey(req))
  try {
    const deviceCount = await takeFreeCount(redis, deviceKey)
    const ipCount = await takeFreeCount(redis, ipKey)
    if (deviceCount > FREE_PER_DAY || ipCount > FREE_PER_DAY) {
      await giveBackFreeCount(redis, deviceKey)
      await giveBackFreeCount(redis, ipKey)
      return { ok: false, error: 'quota_exceeded' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'redis_unavailable' }
  }
}

export async function refundFreeSlot(req: Request, walletId: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await giveBackFreeCount(redis, freeDeviceKey(walletId))
    await giveBackFreeCount(redis, freeIpKey(identityKey(req)))
  } catch {
    // 退还失败只影响这次免费额度，不阻断错误响应
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
    const ok = await redis.set(`checkout:order:${txnId}`, '1', 'EX', 60 * 60 * 24 * 30, 'NX')
    return ok === 'OK' ? 'ok' : 'duplicate'
  } catch {
    return 'unavailable'
  }
}

export async function releaseCheckoutClaim(txnId: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.del(`checkout:order:${txnId}`)
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
