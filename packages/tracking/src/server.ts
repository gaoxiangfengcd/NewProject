import type { AsyncResult } from '@repo/common'

// Provider 抽象（分析后端抽象）
export interface TrackerProvider {
  track(event: string, props?: Record<string, unknown>): AsyncResult<void>
  page(url: string, props?: Record<string, unknown>): AsyncResult<void>
  identify(userId: string, traits?: Record<string, unknown>): AsyncResult<void>
  alias?(fromId: string, toId: string): AsyncResult<void>
  // GDPR：抑制用户（被 compliance 包调用）
  suppressUser(userId: string): AsyncResult<void>
}

// Feature flags（PostHog 自带，合并到此包暴露统一 API）
export type FlagValue = boolean | string | number | null

export interface FeatureFlagsProvider {
  getFlag(key: string, userId?: string, defaultValue?: FlagValue): AsyncResult<FlagValue>
  getAllFlags(userId?: string): AsyncResult<Record<string, FlagValue>>
}

// 服务端统一入口
export function createServerTracker(opts: {
  provider?: TrackerProvider
  flagsProvider?: FeatureFlagsProvider
}): {
  track: (event: string, props?: Record<string, unknown>) => AsyncResult<void>
  page: (url: string, props?: Record<string, unknown>) => AsyncResult<void>
  identify: (userId: string, traits?: Record<string, unknown>) => AsyncResult<void>
  getFlag: (key: string, userId?: string, defaultValue?: FlagValue) => AsyncResult<FlagValue>
} {
  void opts
  throw new Error('Not implemented')
}
