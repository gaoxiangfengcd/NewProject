import { getRedis } from './redis'

/**
 * 生成接口的 IP 固定窗口限流（Redis 实现）。
 *
 * 策略：
 * - 未配置 REDIS_URL（本地开发）：限流关闭，直接放行
 * - 已配置 REDIS_URL 但 Redis 不可用：fail-closed 拒绝请求（保护 Replicate 计费额度，
 *   宁可短暂 503，也不能在限流失效时被刷量烧钱）
 *
 * 环境变量：
 *   RATE_LIMIT_WINDOW_SEC  窗口长度（秒），默认 60
 *   RATE_LIMIT_GENERATE_MAX 每窗口每 IP 最大次数，默认 5
 */

const DEFAULT_WINDOW_SEC = 60
const DEFAULT_MAX = 5

/**
 * 从反向代理注入的头中取真实客户端 IP。
 * 优先级：CF-Connecting-IP > X-Forwarded-For > X-Real-IP
 *
 * Cloudflare 适配：
 * - DNS 代理模式（橙云）：CF 注入 CF-Connecting-IP（单个真实 IP，最可靠）
 * - Tunnel 模式：cloudflared 同样注入 CF-Connecting-IP
 * - 非 CF 直连：回退到 X-Forwarded-For（Caddy 自动设置）
 */
export function getClientIp(req: Request): string {
  // Cloudflare 专有头：单个真实客户端 IP，不存在伪造问题
  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()
  // 通用代理头：可能为逗号分隔的 IP 链，取第一个（最早的客户端）
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export interface RateLimitDecision {
  limited: boolean
  status?: 429 | 503
  remaining: number
  limit: number
  resetAfterSec: number
  /** 503 时说明 Redis 异常；429 时说明触发限额 */
  reason?: 'rate_limited' | 'redis_unavailable'
}

/**
 * 固定窗口计数：key 内 INCR，首次计数设置 TTL。
 * 多实例部署也安全（计数集中在 Redis）。
 */
export async function checkGenerateRateLimit(req: Request): Promise<RateLimitDecision> {
  const redis = getRedis()
  if (!redis) {
    return { limited: false, remaining: DEFAULT_MAX, limit: DEFAULT_MAX, resetAfterSec: 0 }
  }

  const windowSec = Number(process.env.RATE_LIMIT_WINDOW_SEC ?? DEFAULT_WINDOW_SEC)
  const limit = Number(process.env.RATE_LIMIT_GENERATE_MAX ?? DEFAULT_MAX)
  const windowIndex = Math.floor(Date.now() / 1000 / windowSec)
  const key = `ratelimit:generate:${getClientIp(req)}:${windowIndex}`

  try {
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, windowSec)
    }
    return {
      limited: count > limit,
      status: count > limit ? 429 : undefined,
      reason: count > limit ? 'rate_limited' : undefined,
      remaining: Math.max(0, limit - count),
      limit,
      resetAfterSec: windowSec - (Math.floor(Date.now() / 1000) % windowSec),
    }
  } catch {
    // Redis 故障时 fail-closed：拒绝生成，避免限流失效导致 API 额度被盗刷
    return {
      limited: true,
      status: 503,
      reason: 'redis_unavailable',
      remaining: 0,
      limit,
      resetAfterSec: windowSec,
    }
  }
}
