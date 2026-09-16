import { ApiError, err, ok } from '@repo/common'
import type { AsyncResult } from '@repo/common'
import type { GeneratedImage, GenerateImageOpts, ImageGenProvider } from '../types'

export interface ReplicateConfig {
  token: string
  /** 模型标识，如 black-forest-labs/flux-1.1-pro；切换模型只改环境变量 */
  model: string
}

/**
 * Replicate Provider：通过 Replicate 托管的图片大模型生成。
 * - replicate SDK 动态 import：mock 模式下不会加载该依赖
 * - client.run 会自动轮询到生成完成并直接返回结果，适合简单网站的同步接口
 * - 默认模型 flux-1.1-pro 的通用字段：prompt / image / prompt_strength /
 *   aspect_ratio / output_format；切换到同入参家族模型只需改环境变量
 */
export class ReplicateProvider implements ImageGenProvider {
  readonly name = 'replicate'

  constructor(private readonly config: ReplicateConfig) {}

  /**
   * 把 data URI 参考图上传为 Replicate 临时文件 URL。
   * 部分模型/版本不接受 data URI，优先走 files API；不可用时原样回退。
   */
  private async resolveImageInput(
    client: { files?: { create: (f: File) => Promise<{ urls: { get: string } }> } },
    input: string,
  ): Promise<string> {
    if (!input.startsWith('data:')) return input // 已是公网 URL
    try {
      const match = /^data:([^;]+);base64,(.*)$/s.exec(input)
      if (match && client.files?.create) {
        const mime = match[1] ?? 'image/png'
        const base64 = match[2] ?? ''
        const blob = new File([Uint8Array.from(Buffer.from(base64, 'base64'))], 'reference', {
          type: mime,
        })
        const file = await client.files.create(blob)
        return file.urls.get
      }
    } catch {
      // files API 不可用或被 SDK 版本拒绝：回退 data URI
    }
    return input
  }

  async generate(opts: GenerateImageOpts): AsyncResult<GeneratedImage> {
    const model = (opts.model ?? '').trim() || this.config.model

    try {
      const Replicate = (await import('replicate')).default
      const client = new Replicate({ auth: this.config.token })

      const input: Record<string, unknown> = {
        prompt: opts.prompt,
        num_outputs: 1,
        output_format: 'png',
      }
      if (opts.size) {
        input.aspect_ratio = opts.size
      }
      if (typeof opts.seed === 'number') {
        input.seed = opts.seed
      }

      // 图生图：Kontext 用 input_image；Flux 1.1 Pro 等用 image + prompt_strength
      if (opts.inputImage) {
        const imageUrl = await this.resolveImageInput(
          client as unknown as { files?: { create: (f: File) => Promise<{ urls: { get: string } }> } },
          opts.inputImage,
        )
        if (/kontext/i.test(model)) {
          input.input_image = imageUrl
        } else {
          input.image = imageUrl
          const envStrength = Number(process.env.REPLICATE_PROMPT_STRENGTH ?? '')
          const strength =
            opts.promptStrength ?? (Number.isFinite(envStrength) ? envStrength : undefined)
          if (typeof strength === 'number') {
            input.prompt_strength = Math.min(1, Math.max(0, strength))
          }
        }
      }

      // 不同模型的 run 泛型签名差异较大，这里按运行时调用处理
      const run = client.run as (
        identifier: string,
        options: { input: Record<string, unknown> },
      ) => Promise<unknown>
      const output = await run(model, { input })

      // flux 等模型输出为 URL 数组；兼容单字符串及 { url } 形态
      const raw: unknown = Array.isArray(output) ? output[0] : output
      let url: string | undefined
      if (typeof raw === 'string') {
        url = raw
      } else if (raw && typeof raw === 'object') {
        const candidate = (raw as { url?: unknown }).url
        if (typeof candidate === 'string') url = candidate
      }

      if (!url) {
        return err(
          new ApiError('IMAGE_GEN_INVALID_OUTPUT', 502, 'Image model returned no output URL', {
            provider: this.name,
            model,
          }),
        )
      }

      return ok({
        url,
        provider: this.name,
        model,
        size: opts.size ?? '1:1',
      })
    } catch (e) {
      return err(
        new ApiError('IMAGE_GEN_FAILED', 502, 'Image generation provider failed', {
          provider: this.name,
          model,
          message: e instanceof Error ? e.message : String(e),
        }),
      )
    }
  }
}
