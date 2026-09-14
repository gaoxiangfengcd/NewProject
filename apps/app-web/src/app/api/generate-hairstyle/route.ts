import { NextRequest, NextResponse } from 'next/server'
import { ApiError, logger } from '@repo/common'
import { nanoid } from 'nanoid'
import { requireAuth } from '@/lib/auth'
import { checkQuota, consumeFreeQuota, consumePaidCredit } from '@/lib/quota'
import { enqueueHairGeneration } from '@/lib/queue'
import { runGenerateHairJob, buildStylePrompt, buildHairPrompt, buildReferencePrompt } from '@/lib/generate-hair'
import { getHairstyleById } from '@/lib/hairstyles'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

const MIN_PROMPT_LEN = 3
const MAX_PROMPT_LEN = 500
const MAX_BATCH = 5

function errorResponse(error: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: error.code, message: error.message } },
    { status: error.status },
  )
}

interface GenerateTask {
  prompt: string
  label: string
  styleId: string | null
  styleName: string | null
  mode: 'style' | 'custom' | 'reference'
  referencePhotoId?: string | null
}

/**
 * 统一发型生成入口（前端与 AI 服务解耦，未来可换 provider）。
 * 入参：{ photoId, styleIds?: string[], customPrompt?: string, hairColor? }
 * - styleIds：发型库点选（1-5 款，批量对比）
 * - customPrompt：自定义描述模式
 * 出参：{ generationIds, batchId }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) return errorResponse(authRes.error)
  const { userId } = authRes.value

  let body: {
    photoId?: string
    styleIds?: string[]
    customPrompt?: string
    hairColor?: string
    referencePhotoId?: string
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }
  const { photoId, styleIds, customPrompt, hairColor, referencePhotoId } = body

  if (!photoId) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'photoId is required' } },
      { status: 400 },
    )
  }

  // 组装任务列表
  const tasks: GenerateTask[] = []
  if (styleIds && styleIds.length > 0) {
    if (styleIds.length > MAX_BATCH) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: `up to ${MAX_BATCH} styles per batch` } },
        { status: 400 },
      )
    }
    for (const sid of styleIds) {
      const style = getHairstyleById(sid)
      if (!style) {
        return NextResponse.json(
          { error: { code: 'STYLE_NOT_FOUND', message: `hairstyle not found: ${sid}` } },
          { status: 404 },
        )
      }
      tasks.push({
        prompt: buildStylePrompt(style, hairColor),
        label: style.name,
        styleId: style.id,
        styleName: style.name,
        mode: 'style',
      })
    }
  } else if (customPrompt) {
    const trimmed = customPrompt.trim()
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
    tasks.push({
      prompt: buildHairPrompt(trimmed),
      label: trimmed,
      styleId: null,
      styleName: null,
      mode: 'custom',
    })
  } else if (referencePhotoId) {
    // 参考图模式：从参考照片中提取发型，应用到用户照片
    const refPhoto = await prisma.photo.findFirst({
      where: { id: referencePhotoId, userId },
    })
    if (!refPhoto) {
      return NextResponse.json(
        { error: { code: 'PHOTO_NOT_FOUND', message: 'reference photo not found' } },
        { status: 404 },
      )
    }
    tasks.push({
      prompt: buildReferencePrompt(hairColor),
      label: 'Reference hairstyle',
      styleId: null,
      styleName: 'Reference Look',
      mode: 'reference',
      referencePhotoId,
    })
  } else {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'styleIds, customPrompt or referencePhotoId is required' } },
      { status: 400 },
    )
  }

  // 校验照片归属
  const photo = await prisma.photo.findFirst({ where: { id: photoId, userId } })
  if (!photo) {
    return NextResponse.json(
      { error: { code: 'PHOTO_NOT_FOUND', message: 'photo not found' } },
      { status: 404 },
    )
  }

  // 额度校验（批量需 N 次额度）
  const quotaRes = await checkQuota(userId)
  if (!quotaRes.ok) return errorResponse(quotaRes.error)
  if (!quotaRes.value.allowed) {
    return errorResponse(new ApiError('QUOTA_EXCEEDED', 402, 'Generation quota exceeded'))
  }
  const need = tasks.length
  if (Number.isFinite(quotaRes.value.remaining) && quotaRes.value.remaining < need) {
    return errorResponse(
      new ApiError(
        'QUOTA_EXCEEDED',
        402,
        `Not enough credits: this batch needs ${need}, you have ${quotaRes.value.remaining}`,
      ),
    )
  }
  const source = quotaRes.value.source ?? 'free'

  const batchId = nanoid()
  const useRedis = Boolean(process.env.REDIS_URL)

  const generations: { id: string; task: GenerateTask }[] = []
  for (const task of tasks) {
    // 扣减额度
    const consumeRes =
      source === 'paid' ? await consumePaidCredit(userId) : await consumeFreeQuota(userId)
    if (!consumeRes.ok) return errorResponse(consumeRes.error)

    const gen = await prisma.generation.create({
      data: {
        userId,
        photoId,
        prompt: task.prompt,
        status: 'queued',
        styleId: task.styleId,
        styleName: task.styleName,
        mode: task.mode,
        batchId,
        hairColor: hairColor ?? null,
        referencePhotoId: task.referencePhotoId ?? null,
        shareToken: nanoid(16),
      },
    })
    generations.push({ id: gen.id, task })

    const payload = {
      generationId: gen.id,
      userId,
      photoId,
      prompt: task.prompt,
      label: task.label,
    }

    if (!useRedis) {
      // 无 Redis：同步执行（本地开发），批量时顺序触发
      runGenerateHairJob(payload).catch((e) => {
        logger.error('sync generate failed', {
          generationId: gen.id,
          message: e instanceof Error ? e.message : String(e),
        })
      })
    }
    // Redis 模式在循环外统一入队
  }

  if (useRedis) {
    for (const { id, task } of generations) {
      const enqRes = await enqueueHairGeneration({
        userId,
        photoId,
        generationId: id,
        prompt: task.prompt,
        label: task.label,
      })
      if (!enqRes.ok) {
        await prisma.generation
          .update({
            where: { id },
            data: { status: 'failed', error: 'enqueue failed', completedAt: new Date() },
          })
          .catch(() => undefined)
      }
    }
  }

  return NextResponse.json({
    generationIds: generations.map((g) => g.id),
    batchId,
  })
}
