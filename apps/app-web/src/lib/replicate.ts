import type { AsyncResult } from '@repo/common'
import { ApiError, err, logger, ok, verifyWebhookSignature } from '@repo/common'
import { nanoid } from 'nanoid'

// mock 模式占位结果（getPrediction 轮询回退路径返回）。
const MOCK_PLACEHOLDER_URL =
  'https://placehold.co/512x512/e5e7eb/374151?text=Generated+Hairstyle'

/** 无 REPLICATE_API_TOKEN 即视为 mock 模式（不调真 API，不花钱）。 */
function isMockMode(): boolean {
  const token = process.env.REPLICATE_API_TOKEN
  return !token || token.trim() === ''
}

/**
 * Replicate prediction 创建参数。
 * - imageBuffer: 用户原图二进制（SDK 自动上传为托管文件，本地/生产均无需公网 URL）
 * - imageContentType: 图片 MIME（image/jpeg | image/png）
 * - stylePrompt: generate-hair.ts 组装好的完整限制性 prompt
 * - webhookUrl: Replicate 完成后回调本服务的 URL（/api/webhook/replicate）；本地未配公网时为空 → 走轮询
 */
export interface CreatePredictionOpts {
  imageBuffer: Buffer
  imageContentType: string
  stylePrompt: string
  webhookUrl?: string
}

/**
 * Replicate prediction 状态查询结果。
 * output 为生成结果图 URL（succeeded 时存在）。
 */
export interface PredictionStatus {
  status: 'starting' | 'succeeded' | 'failed' | 'processing'
  output?: string
  error?: string
}

/**
 * 创建 Replicate prediction，返回 prediction id。
 * - mock 模式：直接返回 'mock-' + nanoid()，不发起网络请求。
 * - 真模式：模型默认 google/nano-banana（Gemini 2.5 Flash Image，官方模型无需 version）。
 *   input 为 prompt + image_input（原图 Blob，SDK 自动上传）；保持原图构图 aspect_ratio=match_input_image。
 *   配置了 webhookUrl 则由 Replicate 回调；否则前端轮询 /api/generate/[id] 拉取结果。
 */
export async function createPrediction(
  opts: CreatePredictionOpts,
): AsyncResult<{ predictionId: string }> {
  if (isMockMode()) {
    const predictionId = 'mock-' + nanoid()
    logger.info('mock replicate prediction', {
      predictionId,
      stylePrompt: opts.stylePrompt,
    })
    return ok({ predictionId })
  }
  try {
    const Replicate = (await import('replicate')).default
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
    const model = process.env.REPLICATE_HAIR_MODEL ?? 'google/nano-banana'
    const input: Record<string, unknown> = {
      prompt: opts.stylePrompt,
      image_input: [
        new Blob([new Uint8Array(opts.imageBuffer)], {
          type: opts.imageContentType,
        }),
      ],
      aspect_ratio: 'match_input_image',
      output_format: 'png',
    }
    const createOpts: Record<string, unknown> = { model, input }
    if (opts.webhookUrl) {
      createOpts.webhook = opts.webhookUrl
      createOpts.webhook_events_filter = ['completed']
    }
    const prediction = (await replicate.predictions.create(
      createOpts as Parameters<typeof replicate.predictions.create>[0],
    )) as { id: string }
    return ok({ predictionId: prediction.id })
  } catch (e) {
    return err(
      new ApiError('REPLICATE_CREATE_FAILED', 502, 'Failed to create Replicate prediction', {
        message: e instanceof Error ? e.message : String(e),
      }),
    )
  }
}

/**
 * 查询 prediction 当前状态（轮询回退路径，正常靠 webhook）。
 * - mock 模式（predictionId 以 'mock-' 开头）：直接返回 succeeded + 占位图。
 * - 真模式：replicate.predictions.get(predictionId)。
 */
export async function getPrediction(
  predictionId: string,
): AsyncResult<PredictionStatus> {
  if (predictionId.startsWith('mock-')) {
    return ok({ status: 'succeeded', output: MOCK_PLACEHOLDER_URL })
  }
  try {
    const Replicate = (await import('replicate')).default
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
    const prediction = (await replicate.predictions.get(predictionId)) as {
      id: string
      status: string
      output: unknown
      error?: string | null
    }
    const output = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output
    return ok({
      status: prediction.status as PredictionStatus['status'],
      output: typeof output === 'string' ? output : undefined,
      error: prediction.error ?? undefined,
    })
  } catch (e) {
    return err(
      new ApiError('REPLICATE_GET_FAILED', 502, 'Failed to get Replicate prediction', {
        message: e instanceof Error ? e.message : String(e),
      }),
    )
  }
}

/**
 * 校验 Replicate webhook 签名。
 * Replicate 通过 REPLICATE_WEBHOOK_SECRET（HMAC-SHA256，header: replicate-signature）签名。
 * - mock 模式：直接放行（开发期无需配 secret）。
 * - 真模式：复用 @repo/common 的 verifyWebhookSignature（hex 编码 + SHA256）。
 */
export function verifyReplicateWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  if (isMockMode()) {
    return true
  }
  const secret = process.env.REPLICATE_WEBHOOK_SECRET ?? ''
  return verifyWebhookSignature(rawBody, signature, secret, { encoding: 'hex' })
}
