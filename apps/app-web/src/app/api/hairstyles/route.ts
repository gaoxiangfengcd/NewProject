import { NextRequest, NextResponse } from 'next/server'
import { listHairstyles, type Gender, type HairLength } from '@/lib/hairstyles'

export const runtime = 'nodejs'

// 发型库查询（公开）：?gender=women|men&length=short|medium|long&q=keyword
// 不返回 promptTemplate 等服务端字段
export async function GET(req: NextRequest): Promise<NextResponse> {
  const params = req.nextUrl.searchParams
  const gender = (params.get('gender') as Gender | null) ?? undefined
  const length = (params.get('length') as HairLength | null) ?? undefined
  const q = params.get('q') ?? undefined

  const styles = listHairstyles({ gender, length, q }).map((h) => ({
    id: h.id,
    slug: h.slug,
    name: h.name,
    gender: h.gender,
    length: h.length,
    description: h.description,
    suitableFaceShapes: h.suitableFaceShapes,
    gradient: h.gradient,
    popular: h.popular ?? false,
  }))

  return NextResponse.json({ styles })
}
