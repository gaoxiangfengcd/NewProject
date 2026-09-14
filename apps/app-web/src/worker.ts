// 独立 BullMQ worker 进程，用 `pnpm worker`（tsx src/worker.ts）运行。
// 仅在有 Redis 时启用；本地 mock 模式（无 REDIS_URL）不需要启动此进程。
// 生成逻辑抽到 @/lib/generate-hair，worker 与 generate route 共用。
import { logger, ok } from '@repo/common'
import { registerWorker } from '@/lib/queue'
import { runGenerateHairJob } from '@/lib/generate-hair'

if (!process.env.REDIS_URL) {
  console.error('[worker] REDIS_URL not set. Worker only runs with Redis. For local mock mode, you do not need to start this worker.')
  process.exit(1)
}

registerWorker({
  'generate-hair': async (job) => {
    return runGenerateHairJob(job.data)
  },
  'cleanup-expired-sessions': async (job) => {
    console.log('[worker] cleanup-expired-sessions placeholder', job.data)
    return ok(undefined)
  },
  'process-dsr': async (job) => {
    // GDPR 数据删除请求：阶段1 占位，阶段2 调 @repo/compliance 编排。
    console.log('[worker] process-dsr placeholder', job.data)
    return ok(undefined)
  },
})

console.log('[worker] hair generation worker started')
logger.info('worker running', { redis: process.env.REDIS_URL })
