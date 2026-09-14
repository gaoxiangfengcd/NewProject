import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

// 批次状态查询：返回同批所有 generation 的状态（对比页轮询用）
export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } },
): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) {
    return NextResponse.json(
      { error: { code: authRes.error.code, message: authRes.error.message } },
      { status: authRes.error.status },
    )
  }
  const { userId } = authRes.value

  const gens = await prisma.generation.findMany({
    where: { batchId: params.batchId, userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      status: true,
      resultR2Url: true,
      error: true,
      styleId: true,
      styleName: true,
      mode: true,
    },
  })

  return NextResponse.json({
    batchId: params.batchId,
    generations: gens.map((g) => ({
      id: g.id,
      status: g.status,
      resultUrl: g.resultR2Url,
      error: g.error,
      styleId: g.styleId,
      styleName: g.styleName,
      mode: g.mode,
    })),
  })
}
