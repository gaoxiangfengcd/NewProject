import { logger, ok } from '@repo/common'
import type { AsyncResult } from '@repo/common'
import type { GeneratedImage, GenerateImageOpts, ImageGenProvider, ImageSize } from '../types'

const DIMENSIONS: Record<ImageSize, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '3:2': { width: 1152, height: 768 },
  '2:3': { width: 768, height: 1152 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
  '16:9': { width: 1280, height: 720 },
  '9:16': { width: 720, height: 1280 },
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock Provider：未配置任何图片模型时使用。
 * 不发起网络请求、不花钱：
 * - 图生图：直接回显用户上传的参考图，保证完整流程与分享页可演示
 * - 文生图：返回占位图
 */
export class MockProvider implements ImageGenProvider {
  readonly name = 'mock'

  async generate(opts: GenerateImageOpts): AsyncResult<GeneratedImage> {
    const size = opts.size ?? '1:1'
    const { width, height } = DIMENSIONS[size]

    logger.info('mock image generation', {
      mode: opts.inputImage ? 'image-to-image' : 'text-to-image',
      prompt: opts.prompt.slice(0, 120),
      promptStrength: opts.promptStrength,
      model: opts.model ?? 'mock',
      size,
    })

    await sleep(600)

    // 图生图演示：把输入图当作「生成结果」返回
    if (opts.inputImage) {
      return ok({ url: opts.inputImage, provider: this.name, model: 'mock-i2i-v1', size })
    }

    const url = `https://placehold.co/${width}x${height}/ede9fe/5b21b6?text=${encodeURIComponent(
      'MeMeGo · Mock',
    )}`

    return ok({ url, provider: this.name, model: 'mock-v1', size })
  }
}
