import { NextRequest, NextResponse } from 'next/server'
import { ApiError, logger } from '@repo/common'
import { requireAuth } from '@/lib/auth'
import { checkQuota, consumeFreeQuota, consumePaidCredit } from '@/lib/quota'
import { enqueueHairGeneration } from '@/lib/queue'
import { runGenerateHairJob } from '@/lib/generate-hair'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

const MIN_PROMPT_LEN = 3
const MAX_PROMPT_LEN = 500

function errorResponse(error: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: error.code, message: error.message } },
    { status: error.status },
  )
}

// 发起发型生成：鉴权 → 解析入参 → 校验照片 → 额度校验/扣减 → 写库 → 入队
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) return errorResponse(authRes.error)
  const { userId } = authRes.value

  let body: { photoId?: string; prompt?: string }
  try {
    body = (await req.json()) as { photoId?: string; prompt?: string }
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }
  const { photoId, prompt } = body
  if (!photoId || !prompt) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'photoId and prompt are required' } },
      { status: 400 },
    )
  }
  const trimmed = prompt.trim()
  if (trimmed.length < MIN_PROMPT_LEN || trimmed.length > MAX_PROMPT_LEN) {
    return NextResponse.json(
      {
        error: {
          code: 'BAD_REQUEST',
          message: `prompt must be between ${MIN_PROMPT_LEN} and ${MAX_PROMPT_LEN} characters`,
        },
      },
      { status: 400 },
    )
  }

  // 校验照片属于该用户
  const photo = await prisma.photo.findFirst({ where: { id: photoId, userId } })
  if (!photo) {
    return NextResponse.json(
      { error: { code: 'PHOTO_NOT_FOUND', message: 'photo not found' } },
      { status: 404 },
    )
  }

  // 额度校验
  const quotaRes = await checkQuota(userId)
  if (!quotaRes.ok) return errorResponse(quotaRes.error)
  if (!quotaRes.value.allowed) {
    return errorResponse(new ApiError('QUOTA_EXCEEDED', 402, 'Generation quota exceeded'))
  }

  // 扣减额度：付费点数优先扣 paid，其余（免费/订阅）走 free 计数
  const source = quotaRes.value.source ?? 'free'
  const consumeRes =
    source === 'paid'
      ? await consumePaidCredit(userId)
      : await consumeFreeQuota(userId)
  if (!consumeRes.ok) return errorResponse(consumeRes.error)

  // 写库（generationId 作为幂等 jobId）
  const gen = await prisma.generation.create({
    data: { userId, photoId, prompt: trimmed, status: 'queued' },
  })

  // 无 Redis：mock 同步执行（开发模式，免 worker 进程）。
  if (!process.env.REDIS_URL) {
    runGenerateHairJob({ generationId: gen.id, userId, photoId, prompt: trimmed }).catch(
      (e) => {
        logger.error('sync generate failed', {
          generationId: gen.id,
          message: e instanceof Error ? e.message : String(e),
        })
      },
    )
    return NextResponse.json({ generationId: gen.id, jobId: gen.id })
  }

  // 有 Redis：入队 BullMQ（由独立 worker 进程处理）
  const enqRes = await enqueueHairGeneration({
    userId,
    photoId,
    prompt: trimmed,
    generationId: gen.id,
  })
  if (!enqRes.ok) {
    await prisma.generation
      .update({
        where: { id: gen.id },
        data: { status: 'failed', error: 'enqueue failed', completedAt: new Date() },
      })
      .catch(() => undefined)
    return errorResponse(enqRes.error)
  }

  return NextResponse.json({ generationId: gen.id, jobId: enqRes.value.jobId })
}
