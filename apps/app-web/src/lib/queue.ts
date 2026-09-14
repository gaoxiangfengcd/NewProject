import type { AsyncResult } from '@repo/common'
import { ApiError, err, logger, ok } from '@repo/common'
import { Queue, Worker } from 'bullmq'
import type { ConnectionOptions, Job } from 'bullmq'
import IORedis from 'ioredis'
// BullMQ + ioredis 自部署 Redis（不经 @repo/jobs 包，在 app-web 内部封装）。

/** 任务名联合类型。 */
export type JobName = 'generate-hair' | 'cleanup-expired-sessions' | 'process-dsr'

/** generate-hair 任务的 payload。 */
export interface JobPayload {
  userId: string
  photoId: string
  generationId: string
  /** 最终发给模型的完整 prompt */
  prompt: string
  /** mock 占位图展示短标签（发型名/用户描述） */
  label?: string
}

export interface JobStatus {
  status: string
  result?: unknown
}

/** 任务处理器映射：每个 JobName 对应一个异步 handler。 */
export type WorkerHandlers = {
  [K in JobName]: (job: Job<JobPayload>) => AsyncResult<void>
}

// 复用单例 ioredis 连接（maxRetriesPerRequest:null 是 BullMQ 的硬性要求）。
let sharedRedis: IORedis | null = null

/** 从 REDIS_URL 解析 BullMQ 连接配置（ioredis 实例，复用单例）。 */
export function redisConnection(): ConnectionOptions {
  if (!sharedRedis) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
    sharedRedis = new IORedis(url, { maxRetriesPerRequest: null })
  }
  return sharedRedis as unknown as ConnectionOptions
}

// BullMQ 队列实例（hair-generation 队列承载 generate-hair 等任务）。
// 注：BullMQ 在构造时不立即同步连接 Redis（连接失败为异步事件，不会阻断模块加载）。
const connectionOpts = { url: process.env.REDIS_URL } as ConnectionOptions

export const hairGenerationQueue: Queue<JobPayload> = new Queue<JobPayload>(
  'hair-generation',
  { connection: connectionOpts },
)

/**
 * 入队一个发型生成任务。
 * 用 generationId 作为 BullMQ jobId 实现幂等（重复入队不会创建新任务）。
 * 返回 BullMQ jobId 供 API 响应与状态查询。
 */
export async function enqueueHairGeneration(
  payload: JobPayload,
): AsyncResult<{ jobId: string }> {
  try {
    const job = await hairGenerationQueue.add('generate-hair', payload, {
      jobId: payload.generationId,
    })
    logger.info('hair generation enqueued', {
      generationId: payload.generationId,
      jobId: job.id,
    })
    return ok({ jobId: job.id ?? payload.generationId })
  } catch (e) {
    return err(
      new ApiError('QUEUE_ENQUEUE_FAILED', 500, 'Failed to enqueue hair generation', {
        message: e instanceof Error ? e.message : String(e),
      }),
    )
  }
}

/**
 * 查询任务状态（completed/failed/active/delayed/waiting）。
 */
export async function getJobStatus(jobId: string): AsyncResult<JobStatus> {
  try {
    const job = await hairGenerationQueue.getJob(jobId)
    if (!job) return ok({ status: 'unknown' })
    const state = await job.getState()
    return ok({ status: state, result: job.returnvalue })
  } catch (e) {
    return err(
      new ApiError('QUEUE_STATUS_FAILED', 500, 'Failed to get job status', {
        message: e instanceof Error ? e.message : String(e),
      }),
    )
  }
}

/**
 * 注册 BullMQ Worker，绑定各 JobName 的 handler。
 * 在独立 worker 进程（src/worker.ts）调用一次。
 */
export function registerWorker(handlers: WorkerHandlers): Worker<JobPayload> {
  return new Worker<JobPayload>(
    'hair-generation',
    async (job) => {
      const handler = handlers[job.name as JobName]
      const result = await handler(job)
      if (!result.ok) {
        throw result.error
      }
      return 'done'
    },
    { connection: connectionOpts },
  )
}
