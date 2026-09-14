import type { AsyncResult } from '@repo/common'

export type RateLimitStrategy = 'fixed' | 'sliding' | 'token'

export interface CheckOpts {
  key: string
  limit: number
  windowSec: number
  strategy?: RateLimitStrategy
}

export interface CheckResult {
  ok: boolean
  remaining: number
  resetAt: number
  limit: number
}

export interface RateLimiterProvider {
  check(opts: CheckOpts): AsyncResult<CheckResult>
  consume(key: string, amount?: number): AsyncResult<void>
  reset(key: string): AsyncResult<void>
}

export function getProvider(): RateLimiterProvider {
  throw new Error('Not implemented')
}

// 预设限流规则
export const limits = {
  login: { limit: 10, windowSec: 60 },
  signup: { limit: 5, windowSec: 3600 },
  passwordReset: { limit: 5, windowSec: 3600 },
  apiDefault: { limit: 100, windowSec: 60 },
} as const

// 路由级中间件（类型用泛型占位，不强绑框架）
export interface RateLimitMiddlewareOpts {
  key?: (req: unknown) => string
  limit?: number
  windowSec?: number
  strategy?: RateLimitStrategy
}

export function rateLimitMiddleware(
  opts: RateLimitMiddlewareOpts
): (req: unknown, res: unknown, next: () => void) => void {
  throw new Error('Not implemented')
}
