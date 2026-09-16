import type { QuotaSnapshot } from './billing'

/** 客户端与展示组件共用的生成结果结构（与 /api/generate 的 data 字段一致）。 */
export interface GenerationResult {
  shareId: string
  inputUrl: string
  outputUrl: string
  style: string
  twist?: string
  tier: 'free' | 'paid'
  quota?: QuotaSnapshot
}

export type { QuotaSnapshot }
