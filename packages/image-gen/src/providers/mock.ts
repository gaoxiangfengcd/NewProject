import { logger, ok } from '@repo/common'
import type { AsyncResult } from '@repo/common'
import type { GeneratedImage, GenerateImageOpts, ImageGenProvider, ImageSize } from '../types'
import { buildStyledPrompt } from '../styles'

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
 * 不发起网络请求、不花钱，返回占位图，保证本地开发与演示可完整走通流程。
 */
export class MockProvider implements ImageGenProvider {
  readonly name = 'mock'

  async generate(opts: GenerateImageOpts): AsyncResult<GeneratedImage> {
    const size = opts.size ?? '1:1'
    const { width, height } = DIMENSIONS[size]
    const fullPrompt = buildStyledPrompt(opts.prompt, opts.style)

    logger.info('mock image generation', {
      prompt: fullPrompt.slice(0, 120),
      style: opts.style ?? 'auto',
      size,
    })

    // 模拟模型推理延迟
    await sleep(600)

    const url = `https://placehold.co/${width}x${height}/ede9fe/5b21b6?text=${encodeURIComponent(
      'Imagine · Mock',
    )}`

    return ok({ url, provider: this.name, model: 'mock-v1', size })
  }
}
