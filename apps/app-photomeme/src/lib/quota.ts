import { randomInt } from 'node:crypto'
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

const WALLET_RE = /^[A-Za-z0-9_-]{8,64}$/
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const RECOVERY_CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/

function walletRecoveryKey(walletId: string): string {
  return `wallet:${walletId}:recovery`
}

function recoveryCodeKey(code: string): string {
  return `recovery:${code}`
}

function mintRecoveryCode(): string {
  let out = ''
  for (let i = 0; i < 8; i++) {
    out += RECOVERY_ALPHABET[randomInt(RECOVERY_ALPHABET.length)]
  }
  return out
}

/**
 * 一张钱包一个恢复码。换电脑时把码（或 PayPal 交易号）填到新浏览器，
 * 剩余次数整包挪过去，码仍指向拿着次数的那张钱包。
 */
export async function ensureRecoveryCode(walletId: string): Promise<string | null> {
  const redis = getRedis()
  if (!redis || !WALLET_RE.test(walletId)) return null
  try {
    const key = walletRecoveryKey(walletId)
    const existing = await redis.get(key)
    if (existing && RECOVERY_CODE_RE.test(existing)) {
      const owner = await redis.get(recoveryCodeKey(existing))
      if (owner === walletId) return existing
      await redis.del(key)
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = mintRecoveryCode()
      const reserved = await redis.set(recoveryCodeKey(code), walletId, 'NX')
      if (reserved !== 'OK') continue
      const saved = await redis.set(key, code, 'NX')
      if (saved === 'OK') return code
      await redis.del(recoveryCodeKey(code))
      const winner = await redis.get(key)
      if (winner && RECOVERY_CODE_RE.test(winner)) return winner
    }
    return null
  } catch {
    return null
  }
}

export async function walletIdForRecoveryCode(code: string): Promise<string | null> {
  const redis = getRedis()
  if (!redis || !RECOVERY_CODE_RE.test(code)) return null
  try {
    const owner = await redis.get(recoveryCodeKey(code))
    if (!owner || !WALLET_RE.test(owner)) return null
    return owner
  } catch {
    return null
  }
}

export async function readCheckoutWallet(txnId: string): Promise<string | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const stored = await redis.get(`checkout:order:${txnId}`)
    if (!stored || !WALLET_RE.test(stored)) return null
    return stored
  } catch {
    return null
  }
}

const MOVE_CREDITS_SCRIPT = `
local owner = redis.call('GET', KEYS[3])
if not owner or owner ~= ARGV[1] then
  return -1
end
local fields = redis.call('HGETALL', KEYS[1])
local moved = 0
local now = tonumber(ARGV[4])
for i = 1, #fields, 2 do
  local exp = tonumber(fields[i])
  local n = tonumber(fields[i + 1])
  if exp and n and n > 0 and exp > now then
    redis.call('HINCRBY', KEYS[2], fields[i], n)
    moved = moved + n
  end
end
if moved <= 0 then
  return -2
end
redis.call('DEL', KEYS[1])
redis.call('SET', KEYS[3], ARGV[2])
redis.call('SET', KEYS[5], ARGV[3])
redis.call('DEL', KEYS[4])
local ttl = tonumber(ARGV[5])
if ttl > 0 then
  redis.call('PEXPIRE', KEYS[2], ttl)
else
  redis.call('PERSIST', KEYS[2])
end
return moved
`

export async function movePaidCredits(
  sourceWalletId: string,
  destWalletId: string,
): Promise<
  | { ok: true; recoveryCode: string; moved: number; alreadyHere: boolean }
  | { ok: false; error: 'not_found' | 'empty' | 'unavailable' }
> {
  const redis = getRedis()
  if (!redis || !WALLET_RE.test(sourceWalletId) || !WALLET_RE.test(destWalletId)) {
    return { ok: false, error: 'unavailable' }
  }
  if (sourceWalletId === destWalletId) {
    const code = await ensureRecoveryCode(sourceWalletId)
    if (!code) return { ok: false, error: 'unavailable' }
    return { ok: true, recoveryCode: code, moved: 0, alreadyHere: true }
  }

  const code = await ensureRecoveryCode(sourceWalletId)
  if (!code) return { ok: false, error: 'unavailable' }

  try {
    const moved = await redis.eval(
      MOVE_CREDITS_SCRIPT,
      5,
      batchesKey(sourceWalletId),
      batchesKey(destWalletId),
      recoveryCodeKey(code),
      walletRecoveryKey(sourceWalletId),
      walletRecoveryKey(destWalletId),
      sourceWalletId,
      destWalletId,
      code,
      String(Date.now()),
      String(CREDIT_TTL_MS > 0 ? CREDIT_TTL_MS + 86_400_000 : 0),
    )
    const count = Number(moved)
    if (count === -1) return { ok: false, error: 'not_found' }
    if (!Number.isFinite(count) || count <= 0) return { ok: false, error: 'empty' }
    return { ok: true, recoveryCode: code, moved: count, alreadyHere: false }
  } catch {
    return { ok: false, error: 'unavailable' }
  }
}

export async function claimCheckoutOnce(
  txnId: string,
  walletId = '',
): Promise<'ok' | 'duplicate' | 'unavailable'> {
  const redis = getRedis()
  if (!redis) return 'unavailable'
  try {
    const value = WALLET_RE.test(walletId) ? walletId : '1'
    const ok = await redis.set(`checkout:order:${txnId}`, value, 'EX', 60 * 60 * 24 * 30, 'NX')
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
