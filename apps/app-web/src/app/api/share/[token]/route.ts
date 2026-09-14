import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

// 公开只读分享（免鉴权）：按 shareToken 返回脱敏后的结果
// 只含发型名、模式、结果图、原图相对路径、时间；不含任何用户信息
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } },
): Promise<NextResponse> {
  const gen = await prisma.generation.findUnique({
    where: { shareToken: params.token },
    select: {
      status: true,
      styleName: true,
      mode: true,
      resultR2Url: true,
      error: true,
      createdAt: true,
      photo: { select: { r2Url: true, r2Key: true } },
    },
  })

  if (!gen || gen.status !== 'succeeded') {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'shared result not found' } },
      { status: 404 },
    )
  }

  return NextResponse.json({
    styleName: gen.styleName ?? (gen.mode === 'custom' ? 'Custom hairstyle' : 'Hairstyle'),
    resultUrl: gen.resultR2Url,
    beforeUrl: gen.photo.r2Url ?? `/api/storage/photos/placeholder`,
    createdAt: gen.createdAt.toISOString(),
  })
}
