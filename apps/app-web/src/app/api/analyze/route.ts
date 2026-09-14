import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@repo/common'
import { requireAuth } from '@/lib/auth'
import { analyzeFace } from '@/lib/analysis'
import {
  recommendForFaceShape,
  getRecommendReason,
  type FaceShape,
} from '@/lib/hairstyles'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

function errorResponse(error: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: error.code, message: error.message } },
    { status: error.status },
  )
}

function recommendationsFor(faceShape: FaceShape) {
  return recommendForFaceShape(faceShape, 5).map((s) => ({
    styleId: s.id,
    styleName: s.name,
    reason: getRecommendReason(s, faceShape),
  }))
}

// 人脸 & 发质分析：鉴权 → 校验照片归属 → 命中缓存直接返回 → 分析并落库
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) return errorResponse(authRes.error)
  const { userId } = authRes.value

  let body: { photoId?: string }
  try {
    body = (await req.json()) as { photoId?: string }
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }
  if (!body.photoId) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'photoId is required' } },
      { status: 400 },
    )
  }

  const photo = await prisma.photo.findFirst({
    where: { id: body.photoId, userId },
    include: { analysis: true },
  })
  if (!photo) {
    return NextResponse.json(
      { error: { code: 'PHOTO_NOT_FOUND', message: 'photo not found' } },
      { status: 404 },
    )
  }

  // 已分析过：直接返回缓存（推荐列表按静态数据实时重组）
  if (photo.analysis) {
    const a = photo.analysis
    return NextResponse.json({
      photoId: photo.id,
      photoUrl: photo.r2Url,
      cached: true,
      analysis: {
        faceShape: a.faceShape,
        hairLength: a.hairLength,
        hairTexture: a.hairTexture,
        hairDensity: a.hairDensity,
        forehead: a.forehead,
        jawline: a.jawline,
        provider: a.provider,
        recommendations: recommendationsFor(a.faceShape as FaceShape),
      },
    })
  }

  const res = await analyzeFace(photo.id)
  if (!res.ok) return errorResponse(res.error)
  const a = res.value

  await prisma.faceAnalysis.create({
    data: {
      photoId: photo.id,
      faceShape: a.faceShape,
      hairLength: a.hairLength,
      hairTexture: a.hairTexture,
      hairDensity: a.hairDensity,
      forehead: a.forehead,
      jawline: a.jawline,
      provider: a.provider,
    },
  })

  return NextResponse.json({ photoId: photo.id, photoUrl: photo.r2Url, cached: false, analysis: a })
}

// 查询某张照片已有的分析结果（发型库页"Great for you"标记用；未分析返回 404 状态标记）
export async function GET(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) return errorResponse(authRes.error)
  const { userId } = authRes.value

  const photoId = req.nextUrl.searchParams.get('photoId')
  if (!photoId) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'photoId is required' } },
      { status: 400 },
    )
  }

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, userId },
    include: { analysis: true },
  })
  if (!photo) {
    return NextResponse.json(
      { error: { code: 'PHOTO_NOT_FOUND', message: 'photo not found' } },
      { status: 404 },
    )
  }
  if (!photo.analysis) {
    return NextResponse.json({ analyzed: false })
  }
  return NextResponse.json({
    analyzed: true,
    faceShape: photo.analysis.faceShape,
  })
}
