// AI 人脸 & 发质分析（provider 抽象）：
// - mock：按 photoId 哈希稳定返回（同一张照片结果一致），零成本跑通 MVP
// - gemini（预留）：多模态模型返回结构化 JSON，接口形状不变
import type { AsyncResult } from '@repo/common'
import { ok } from '@repo/common'
import type { FaceShape } from '@/lib/hairstyles'
import { recommendForFaceShape, getRecommendReason } from '@/lib/hairstyles'

export interface FaceAnalysisResult {
  faceShape: FaceShape
  hairLength: string
  hairTexture: string
  hairDensity: string
  forehead: string
  jawline: string
  provider: string
  recommendations: { styleId: string; styleName: string; reason: string }[]
}

const FACE_SHAPES: FaceShape[] = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond']
const TEXTURES = ['straight', 'wavy', 'curly', 'coily']
const DENSITIES = ['thin', 'medium', 'thick']
const LENGTHS = ['short', 'medium', 'long']
const FOREHEADS = ['narrow', 'average', 'wide']
const JAWLINES = ['soft', 'average', 'strong']

/** 稳定哈希：同 photoId 永远得到同一组分析结果（mock 一致性）。 */
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * 分析人脸与发质。
 * MVP：mock provider（分阶段延迟模拟分析耗时）。
 * 真实实现：ANALYSIS_PROVIDER=gemini 时调多模态模型，返回同构 FaceAnalysisResult。
 */
export async function analyzeFace(
  photoId: string,
): AsyncResult<FaceAnalysisResult> {
  const provider = process.env.ANALYSIS_PROVIDER ?? 'mock'

  if (provider === 'mock') {
    // 分阶段等待，让前端的 staged progress 动画有节奏
    await sleep(2600)
    const seed = hashString(photoId)
    const faceShape = pick(FACE_SHAPES, seed, 0)
    const result: FaceAnalysisResult = {
      faceShape,
      hairLength: pick(LENGTHS, seed, 1),
      hairTexture: pick(TEXTURES, seed, 2),
      hairDensity: pick(DENSITIES, seed, 3),
      forehead: pick(FOREHEADS, seed, 4),
      jawline: pick(JAWLINES, seed, 5),
      provider: 'mock',
      recommendations: [],
    }
    result.recommendations = recommendForFaceShape(faceShape, 5).map((s) => ({
      styleId: s.id,
      styleName: s.name,
      reason: getRecommendReason(s, faceShape),
    }))
    return ok(result)
  }

  // 预留：真实视觉模型分析（返回结构必须与 mock 一致）
  // const gemini = await analyzeFaceWithGemini(photoId)
  // return gemini
  await sleep(2600)
  const seed = hashString(photoId)
  const faceShape = pick(FACE_SHAPES, seed, 0)
  return ok({
    faceShape,
    hairLength: pick(LENGTHS, seed, 1),
    hairTexture: pick(TEXTURES, seed, 2),
    hairDensity: pick(DENSITIES, seed, 3),
    forehead: pick(FOREHEADS, seed, 4),
    jawline: pick(JAWLINES, seed, 5),
    provider,
    recommendations: recommendForFaceShape(faceShape, 5).map((s) => ({
      styleId: s.id,
      styleName: s.name,
      reason: getRecommendReason(s, faceShape),
    })),
  })
}
