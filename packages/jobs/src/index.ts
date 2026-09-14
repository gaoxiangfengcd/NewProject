import type { AsyncResult } from '@repo/common'

export interface Job {
  id: string
  name: string
  payload: unknown
  attempts: number
}

export type JobHandler = (job: Job) => AsyncResult<void>

export interface EnqueueOpts {
  delaySec?: number
  idempotencyKey?: string
}

export interface EnqueueResult {
  jobId: string
}

export interface JobsProvider {
  enqueue(name: string, payload: unknown, opts?: EnqueueOpts): AsyncResult<EnqueueResult>
  schedule(name: string, payload: unknown, cron: string): AsyncResult<{ scheduleId: string }>
  cancel(id: string): AsyncResult<void>
  register(name: string, handler: JobHandler): void
  start(): Promise<void>
}

export function getProvider(): JobsProvider {
  throw new Error('Not implemented')
}

// 预置任务名常量（apps 可直接 enqueue）
export const JOB_NAMES = {
  SEND_SCHEDULED_EMAIL: 'send-scheduled-email',
  CLEANUP_EXPIRED_SESSIONS: 'cleanup-expired-sessions',
  SUBSCRIPTION_RENEWAL_REMINDER: 'subscription-renewal-reminder',
  PROCESS_DSR: 'process-dsr',
  REVENUE_REPORT: 'revenue-report',
} as const

// 预置任务注册器（apps 启动时调 registerPresetJobs(getProvider())）
export function registerPresetJobs(provider: JobsProvider): void {
  throw new Error('Not implemented')
}
