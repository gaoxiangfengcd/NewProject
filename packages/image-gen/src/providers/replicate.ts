import { ApiError, err, ok } from '@repo/common'
import type { AsyncResult } from '@repo/common'
import type { GeneratedImage, GenerateImageOpts, ImageGenProvider } from '../types'
import { buildStyledPrompt } from '../styles'

export interface ReplicateConfig {
  token: string
  /** 模型标识，如 black-forest-labs/flux-schnell；切换模型只改环境变量 */
  model: string
}

/**
 * Replicate Provider：通过 Replicate 托管的图片大模型生成。
 * - replicate SDK 动态 import：mock 模式下不会加载该依赖
 * - client.run 会自动轮询到生成完成并直接返回结果，适合简单网站的同步接口
 * - 模型输入采用 flux 系列通用字段（prompt / aspect_ratio / output_format）
 */
export class ReplicateProvider implements ImageGenProvider {
  readonly name = 'replicate'

  constructor(private readonly config: ReplicateConfig) {}

  async generate(opts: GenerateImageOpts): AsyncResult<GeneratedImage> {
    try {
      const Replicate = (await import('replicate')).default
      const client = new Replicate({ auth: this.config.token })

      const input: Record<string, unknown> = {
        prompt: buildStyledPrompt(opts.prompt, opts.style),
        num_outputs: 1,
        output_format: 'png',
      }
      if (opts.size) {
        input.aspect_ratio = opts.size
      }
      if (typeof opts.seed === 'number') {
        input.seed = opts.seed
      }

      // 不同模型的 run 泛型签名差异较大，这里按运行时调用处理
      const run = client.run as (
        identifier: string,
        options: { input: Record<string, unknown> },
      ) => Promise<unknown>
      const output = await run(this.config.model, { input })

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
            model: this.config.model,
          }),
        )
      }

      return ok({
        url,
        provider: this.name,
        model: this.config.model,
        size: opts.size ?? '1:1',
      })
    } catch (e) {
      return err(
        new ApiError('IMAGE_GEN_FAILED', 502, 'Image generation provider failed', {
          provider: this.name,
          model: this.config.model,
          message: e instanceof Error ? e.message : String(e),
        }),
      )
    }
  }
}
