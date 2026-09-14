// 生成任务核心逻辑：worker 进程和 generate route（无 Redis 同步模式）共用。
// 抽出此处避免重复，上线切回 BullMQ 时 worker 仍调此函数。
import { getProvider, buildKey } from '@repo/storage'
import { logger, ok, type AsyncResult } from '@repo/common'
import { prisma } from '@/db/client'
import { createPrediction } from '@/lib/replicate'

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

/** 无 REPLICATE_API_TOKEN 即视为 mock 模式（本地生成占位结果，不走 Replicate）。 */
function isMockMode(): boolean {
  const token = process.env.REPLICATE_API_TOKEN
  return !token || token.trim() === ''
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}

/** 组装 Replicate webhook 回调 URL（未配公网 base URL 时返回 undefined → 走轮询）。 */
function buildWebhookUrl(): string | undefined {
  const webhookBase =
    process.env.REPLICATE_WEBHOOK_BASE_URL ?? process.env.PUBLIC_BASE_URL ?? ''
  return webhookBase
    ? `${webhookBase.replace(/\/$/, '')}/api/webhook/replicate`
    : undefined
}

/**
 * 构造发型迁移的限制性 prompt（自定义描述模式）。
 * 结构：固定身份锁定约束（开头） + 用户发型描述（可变） + 固定质量约束（结尾）。
 * nano-banana 是 instruction-based 编辑模型：明确 "只改头发、脸完全不动" 是防止换脸的关键。
 */
export function buildHairPrompt(userPrompt: string): string {
  return wrapPrompt(userPrompt.trim())
}

/**
 * 构造发型库点击模式的最终 prompt。
 * 以发型库的 promptTemplate 为核心（含长度/轮廓/刘海/纹理细节），可选叠加发色。
 */
export function buildStylePrompt(
  style: { promptTemplate: string; name: string },
  hairColor?: string,
): string {
  const styleDesc = hairColor
    ? `${style.promptTemplate}, ${hairColor} hair color`
    : style.promptTemplate
  return wrapPrompt(styleDesc)
}

/**
 * 构造参考图模式的最终 prompt。
 * 用户上传一张明星/模特的发型照片，AI 需要理解该发型并应用到用户脸上。
 * 关键约束：从参考图中提取发型特征，但保持用户本人的身份不变。
 */
export function buildReferencePrompt(hairColor?: string): string {
  const colorSuffix = hairColor ? ` Use ${hairColor} hair color.` : ''
  const refDesc =
    'Replicate the hairstyle shown in the reference image — match its length, ' +
    'shape, layers, bangs, texture and overall silhouette. Apply this hairstyle ' +
    'to the person in the portrait.' + colorSuffix
  return wrapPrompt(refDesc)
}

/** 身份锁定 + 发型描述 + 质量锁定 的三段式包裹。 */
function wrapPrompt(hairstyleDesc: string): string {
  const identityLock =
    'Edit this portrait photo. Keep the person\'s face, facial features, ' +
    'skin tone, expression, pose, clothing and background exactly the same ' +
    'and fully recognizable as the same person. Do not beautify, do not ' +
    'change age, gender or identity.'
  const qualityLock =
    'Blend the hairline naturally with the forehead and sideburns. Match ' +
    'the original photo\'s lighting, camera angle, perspective and image ' +
    'quality so the result looks like a real photograph of the same person. ' +
    'Change ONLY the hair — everything else must remain untouched.'
  return `${identityLock} Change the hairstyle to: ${hairstyleDesc}. ${qualityLock}`
}

/** 生成一张占位 SVG（含用户描述），作为 mock 模式的生成结果。 */
function buildMockSvg(prompt: string): string {
  const desc = escapeXml(prompt.slice(0, 120))
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">` +
    `<rect width="512" height="512" fill="#f3f4f6"/>` +
    `<text x="256" y="240" font-size="16" text-anchor="middle" fill="#6b7280">AI Generated (mock)</text>` +
    `<text x="256" y="280" font-size="12" text-anchor="middle" fill="#9ca3af">${desc}</text>` +
    `</svg>`
  )
}

async function markFailed(generationId: string, error: string): Promise<void> {
  try {
    await prisma.generation.update({
      where: { id: generationId },
      data: { status: 'failed', error, completedAt: new Date() },
    })
  } catch {
    // 忽略：已是失败态或记录不存在
  }
}

export interface GenerateHairPayload {
  generationId: string
  userId: string
  photoId: string
  /** 最终发给模型的完整 prompt（已含身份锁定约束，由 API 层组装） */
  prompt: string
  /** mock 占位图上展示的短标签（发型名或用户原始描述） */
  label?: string
}

/**
 * 将 Replicate output URL 下载并落盘 storage，更新 generation 为最终状态。
 * webhook 回调和本地轮询两条路径共用，保证幂等（已 succeeded 则跳过）。
 */
export async function finalizeGeneration(
  generationId: string,
  outputUrl: string,
): Promise<void> {
  const gen = await prisma.generation.findUnique({ where: { id: generationId } })
  if (!gen || gen.status === 'succeeded') return
  try {
    const dlRes = await fetch(outputUrl)
    if (!dlRes.ok) throw new Error(`download failed: HTTP ${dlRes.status}`)
    const buf = Buffer.from(await dlRes.arrayBuffer())
    const key = buildKey({
      bucket: 'results',
      scope: 'results',
      ownerId: gen.userId,
      filename: 'result.png',
    })
    const storage = getProvider()
    const upRes = await storage.upload(key, buf, {
      contentType: 'image/png',
      public: true,
    })
    if (!upRes.ok) {
      await markFailed(generationId, `storage upload failed: ${upRes.error.message}`)
      return
    }
    const resultUrl = upRes.value.url ?? outputUrl
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'succeeded',
        resultR2Key: key,
        resultR2Url: resultUrl,
        completedAt: new Date(),
      },
    })
  } catch (e) {
    await markFailed(
      generationId,
      `download/upload failed: ${e instanceof Error ? e.message : String(e)}`,
    )
  }
}

/**
 * 执行发型生成任务。
 * - mock 模式（无 REPLICATE_API_TOKEN）：sleep 2.5s 后生成 SVG 存 storage，直接标记成功。
 * - 真模式：读原图 buffer → 调 Replicate 创建 prediction（带 webhook），由 webhook 回调更新最终状态。
 */
export async function runGenerateHairJob(
  payload: GenerateHairPayload,
): AsyncResult<void> {
  const { generationId, userId, photoId, prompt, label } = payload
  const log = logger.child({ generationId, userId })
  try {
    const gen = await prisma.generation.findUnique({ where: { id: generationId } })
    if (!gen) {
      log.warn('generation not found')
      return ok(undefined)
    }
    await prisma.generation.update({
      where: { id: generationId },
      data: { status: 'processing' },
    })

    const photo = await prisma.photo.findUnique({ where: { id: photoId } })
    if (!photo) {
      await markFailed(generationId, 'photo not found')
      return ok(undefined)
    }

    if (isMockMode()) {
      log.info('mock generate-hair start', { prompt })
      await sleep(2500)
      const svg = buildMockSvg(label ?? prompt)
      const buffer = Buffer.from(svg, 'utf-8')
      const key = buildKey({
        bucket: 'results',
        scope: 'results',
        ownerId: userId,
        filename: 'result.svg',
      })
      const storage = getProvider()
      const upRes = await storage.upload(key, buffer, {
        contentType: 'image/svg+xml',
        public: true,
      })
      if (!upRes.ok) {
        await markFailed(generationId, `storage upload failed: ${upRes.error.message}`)
        return ok(undefined)
      }
      const dataUri = `data:image/svg+xml;base64,${buffer.toString('base64')}`
      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: 'succeeded',
          resultR2Key: key,
          resultR2Url: dataUri,
          completedAt: new Date(),
        },
      })
      log.info('mock generate-hair succeeded', { key })
      return ok(undefined)
    }

    // 真模式：读原图文件 → nano-banana 需要 image buffer（SDK 自动上传为托管文件）
    const storage = getProvider()
    const dlRes = await storage.download(photo.r2Key)
    if (!dlRes.ok) {
      await markFailed(generationId, `photo download failed: ${dlRes.error.message}`)
      return ok(undefined)
    }
    const chunks: Buffer[] = []
    const reader = dlRes.value.getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(Buffer.from(value))
    }
    const imageBuffer = Buffer.concat(chunks)

    const predRes = await createPrediction({
      imageBuffer,
      imageContentType: photo.r2Key.toLowerCase().endsWith('.png')
        ? 'image/png'
        : 'image/jpeg',
      stylePrompt: prompt,
      webhookUrl: buildWebhookUrl(),
    })
    if (!predRes.ok) {
      await markFailed(generationId, predRes.error.message)
      return ok(undefined)
    }
    await prisma.generation.update({
      where: { id: generationId },
      data: { replicatePredictionId: predRes.value.predictionId },
    })
    log.info('replicate prediction created', {
      predictionId: predRes.value.predictionId,
    })
    return ok(undefined)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    log.error('generate-hair failed', { message: msg })
    await markFailed(generationId, msg)
    return ok(undefined)
  }
}
