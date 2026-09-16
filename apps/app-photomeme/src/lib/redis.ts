import IORedis, { type Redis } from 'ioredis'

let redisClient: Redis | null = null

/** 共享 Redis 连接：限流、每日免费额度、付费次数都走这里。 */
export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (!redisClient) {
    redisClient = new IORedis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2000,
    })
  }
  return redisClient
}
