import type { CreditPack, QuotaSnapshot } from './billing'

/** 客户端与展示组件共用的生成结果结构（与 /api/generate 的 data 字段一致）。 */
export interface GenerationResult {
  shareId: string
  inputUrl: string
  outputUrl: string
  style: string
  twist?: string
  tier: 'free' | 'paid'
  quota?: QuotaSnapshot
  exaggerationLevel?: number
  primaryFeature?: string
}

export interface ComedyHook {
  title: string
  twist: string
}

export interface FeatureScores {
  distinctiveness: number
  exaggeration_potential: number
  visual_humor: number
  environment_interaction: number
  recognition_safety: number
}

export interface SelectedFeature {
  feature: string
  evidence: string
  person_id: string
  reason: string
  scores: FeatureScores
  weighted_score: number
  exaggeration_level: number
  /** Qwen 0-10: how physically distortable the joke is. Optional for mock/legacy briefs. */
  distortionScore?: number
  creative_concept: string
  environment_consequence: string
  composition: string
}

/** 图里每一个清晰可见的人。people ≠ primary_feature。 */
export interface PersonPortrait {
  id: string
  position: string
  summary: string
  appearance: string[]
  visible_features: string[]
  /** 给人看的称呼，如 Person on the left，不要暴露 p1 */
  label: string
  trait: string
  expression_or_action: string
  pose: string
}

/** 多人照：照片里真实存在的视觉关系，不是编出来的故事。 */
export interface PhotoDynamic {
  type: string
  description: string
}

export interface SceneBrief {
  people: string[]
  portraits: PersonPortrait[]
  photo_dynamic: PhotoDynamic | null
  /** 若 photo_dynamic 能帮助选笑点，记下怎么用；没有则为 null。 */
  creative_relationship: PhotoDynamic | null
  /** 两人及以上：仅当画面明确支持时填写；unknown 则为空。 */
  relationship: string
  environment: string
  important_objects: string[]
  composition: string
  lighting: string
  camera_angle: string
}

/**
 * 创意决策系统的主产物：一张图只押一个主特征，再把它推到环境后果。
 * hooks / 分数条是给 UI 用的派生字段，不作为出图主输入。
 */
export interface PhotoScoreReport {
  primary_feature: SelectedFeature
  secondary_feature: SelectedFeature | null
  scene: SceneBrief
  overall_creative_direction: string
  provider: string
  personScore: number
  environmentScore: number
  chemistryScore: number
  overallScore: number
  summary: string
  hooks: ComedyHook[]
  /** 真模型失败时退回模板的原因，给页面展示；成功时为空。 */
  fallbackReason?: string
}

export type { QuotaSnapshot, CreditPack }
