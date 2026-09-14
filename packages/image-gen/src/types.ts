import type { AsyncResult } from '@repo/common'

/** 支持的画幅比例（透传给模型的 aspect_ratio） */
export type ImageSize = '1:1' | '3:2' | '2:3' | '4:3' | '3:4' | '16:9' | '9:16'

/** 预置视觉风格 id（promptSuffix 由 styles.ts 维护） */
export type ImageStyleId =
  | 'auto'
  | 'realistic'
  | 'anime'
  | 'oil-painting'
  | 'watercolor'
  | 'cyberpunk'
  | '3d-render'
  | 'pixel'
  | 'line-art'

export interface ImageStyle {
  id: ImageStyleId
  /** 追加到用户 prompt 后的英文风格约束（模型对英文响应更稳定） */
  promptSuffix: string
}

export interface GenerateImageOpts {
  /** 用户原始画面描述（已 trim、已过滤控制字符） */
  prompt: string
  style?: ImageStyleId
  size?: ImageSize
  seed?: number
}

export interface GeneratedImage {
  /** 生成结果图 URL（模型托管地址或 mock 占位图） */
  url: string
  /** 实际提供方名（replicate | mock） */
  provider: string
  /** 实际使用的模型标识 */
  model: string
  size: ImageSize
}

/**
 * 图片生成 Provider 抽象。
 * 每个图片大模型渠道（Replicate / 自托管 SD / 其他厂商）实现此接口，
 * app 层只依赖接口，由环境变量决定具体实现，避免供应商锁定。
 */
export interface ImageGenProvider {
  readonly name: string
  generate(opts: GenerateImageOpts): AsyncResult<GeneratedImage>
}
