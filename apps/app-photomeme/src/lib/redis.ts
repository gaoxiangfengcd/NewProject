import IORedis, { type Redis } from 'ioredis'
import { logger } from '@repo/common'

let redisClient: Redis | null = null

/** 连接期错误日志节流：ioredis 在重连期间会反复 emit error，避免刷屏 */
let lastErrorLoggedAt = 0
const ERROR_LOG_INTERVAL_MS = 30_000

/**
 * 共享 Redis 连接：限流、每日免费额度、付费次数都走这里。
 *
 * ⚠️ `enableOfflineQueue` 必须保持 `true`（**不要**改回 `false`）。
 *
 * 本客户端是惰性建连的：第一次调用才 `new IORedis()`，而命令紧跟着就发出去。
 * 设成 `false` 时，连接还没 ready 的那一瞬间发命令会**立刻**抛
 * `Stream isn't writeable and enableOfflineQueue options is false`，
 * 被上层 catch 后按「Redis 不可用」fail-closed 处理 → 返回 503。
 *
 * 线上实测症状：容器每次重启后，**第一个**生成请求必然失败
 * （POST /api/generate 返回 SERVICE_UNAVAILABLE
 * 「The generator is temporarily unavailable. Please try again later.」），
 * 紧接着重试即成功——极易被误判成 Redis 挂了或密码错。
 *
 * 保持 `true` 会把这批命令排队到连接就绪后再执行；Redis 真的不可用时，
 * 命令仍会在 `connectTimeout` 之后失败，fail-closed 语义不变，
 * 只是多等约 2 秒而不是立即失败。
 */
export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (!redisClient) {
    redisClient = new IORedis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: true,
      connectTimeout: 2000,
    })
    // 没有 error 监听时，连接/命令失败只会被上层的空 catch 吞掉，
    // 日志里不留任何痕迹（这正是上面那个 503 当初查不出原因的地方）。
    redisClient.on('error', (err: Error) => {
      const now = Date.now()
      if (now - lastErrorLoggedAt < ERROR_LOG_INTERVAL_MS) return
      lastErrorLoggedAt = now
      logger.error('redis error', { message: err.message })
    })
  }
  return redisClient
}
