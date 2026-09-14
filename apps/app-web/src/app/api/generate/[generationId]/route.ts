import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPrediction } from '@/lib/replicate'
import { finalizeGeneration } from '@/lib/generate-hair'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

// 查询生成状态：鉴权 → 取记录 → 校验归属 →
// processing 且有 predictionId 时主动向 Replicate 拉取一次（本地无公网 webhook 的兜底路径）→
// 返回 { id, status, resultUrl, error, createdAt }
export async function GET(
  req: NextRequest,
  { params }: { params: { generationId: string } },
): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) {
    return NextResponse.json(
      { error: { code: authRes.error.code, message: authRes.error.message } },
      { status: authRes.error.status },
    )
  }
  const { userId } = authRes.value

  let gen = await prisma.generation.findUnique({
    where: { id: params.generationId },
    include: { photo: { select: { r2Url: true } } },
  })
  if (!gen || gen.userId !== userId) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'generation not found' } },
      { status: 404 },
    )
  }

  // 本地/无公网 webhook：轮询时顺带向 Replicate 查一次最新状态并落地
  if (
    gen.status === 'processing' &&
    gen.replicatePredictionId &&
    !gen.replicatePredictionId.startsWith('mock-')
  ) {
    const predRes = await getPrediction(gen.replicatePredictionId)
    if (predRes.ok) {
      if (predRes.value.status === 'succeeded' && predRes.value.output) {
        await finalizeGeneration(gen.id, predRes.value.output)
      } else if (predRes.value.status === 'failed') {
        await prisma.generation.update({
          where: { id: gen.id },
          data: {
            status: 'failed',
            error: predRes.value.error ?? 'replicate prediction failed',
            completedAt: new Date(),
          },
        })
      }
      gen =
        (await prisma.generation.findUnique({
          where: { id: gen.id },
          include: { photo: { select: { r2Url: true } } },
        })) ?? gen
    }
    // 查询失败不阻断：仍返回 DB 当前状态
  }

  return NextResponse.json({
    id: gen.id,
    status: gen.status,
    resultUrl: gen.resultR2Url,
    photoUrl: gen.photo?.r2Url ?? null,
    styleId: gen.styleId,
    styleName: gen.styleName,
    mode: gen.mode,
    hairColor: gen.hairColor,
    shareToken: gen.shareToken,
    photoId: gen.photoId,
    error: gen.error,
    createdAt: gen.createdAt.toISOString(),
  })
}
