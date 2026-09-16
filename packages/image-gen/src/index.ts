import { ApiError } from '@repo/common'
import { MockProvider } from './providers/mock'
import { ReplicateProvider } from './providers/replicate'

export type {
  ImageSize,
  GenerateImageOpts,
  GeneratedImage,
  ImageGenProvider,
} from './types'
export { MockProvider } from './providers/mock'
export { ReplicateProvider } from './providers/replicate'
export type { ReplicateConfig } from './providers/replicate'

// 默认图生图模型：支持参考图 + prompt_strength，身份保持与夸张表现力均衡
const DEFAULT_REPLICATE_MODEL = 'black-forest-labs/flux-1.1-pro'

/**
 * 统一入口：由环境变量决定图片生成实现。
 * - IMAGE_GEN_PROVIDER=replicate：必须配置 REPLICATE_API_TOKEN，否则 CONFIG_MISSING
 * - IMAGE_GEN_PROVIDER=mock：强制 mock
 * - 未指定：有 REPLICATE_API_TOKEN 走 replicate，否则回退 mock（零成本本地开发）
 */
export function getProvider() {
  const explicit = (process.env.IMAGE_GEN_PROVIDER ?? '').trim().toLowerCase()
  const token = (process.env.REPLICATE_API_TOKEN ?? '').trim()
  const model = (process.env.REPLICATE_IMAGE_MODEL ?? '').trim() || DEFAULT_REPLICATE_MODEL

  if (explicit === 'replicate') {
    if (!token) {
      throw new ApiError(
        'CONFIG_MISSING',
        500,
        'IMAGE_GEN_PROVIDER=replicate requires REPLICATE_API_TOKEN',
      )
    }
    return new ReplicateProvider({ token, model })
  }

  if (explicit && explicit !== 'mock') {
    throw new ApiError(
      'CONFIG_MISSING',
      500,
      `Unsupported IMAGE_GEN_PROVIDER: ${explicit} (expected mock | replicate)`,
    )
  }

  if (token) {
    return new ReplicateProvider({ token, model })
  }

  return new MockProvider()
}
