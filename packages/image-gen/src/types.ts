import type { AsyncResult } from '@repo/common'

/** 支持的画幅比例（透传给模型的 aspect_ratio） */
export type ImageSize = '1:1' | '3:2' | '2:3' | '4:3' | '3:4' | '16:9' | '9:16'

export interface GenerateImageOpts {
  /**
   * 最终 prompt。
   * 风格模板 / 身份锁定约束由 app 层组装完成后传入，
   * provider 只负责透传，不内置产品风格表。
   */
  prompt: string
  size?: ImageSize
  seed?: number
  /**
   * 图生图参考图：公网可访问 URL 或 data URI。
   * 缺省为纯文生图；提供时走模型的 image-to-image 入参。
   */
  inputImage?: string
  /**
   * 参考图影响强度（0..1，对应多数模型的 prompt_strength / denoise）。
   * 值越大结果越自由、越夸张；值越小越贴近原图。
   */
  promptStrength?: number
  /**
   * 覆盖 provider 默认模型。免费档 / 付费档可以走不同 Replicate 模型。
   */
  model?: string
}

export interface GeneratedImage {
  /** 生成结果图 URL（模型托管地址或 mock 占位图/回显图） */
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
