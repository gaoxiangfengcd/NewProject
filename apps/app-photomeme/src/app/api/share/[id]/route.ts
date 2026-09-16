import { NextResponse } from 'next/server'
import { getProvider } from '@repo/storage'
import { readShareMeta } from '@/lib/share'

export const runtime = 'nodejs'

/** GET /api/share/{id} — 分享元数据（供分享页客户端渲染兜底） */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const storage = getProvider()
    const meta = await readShareMeta(storage, params.id)
    if (!meta) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'This meme no longer exists.' } },
        { status: 404 },
      )
    }
    return NextResponse.json({ ok: true, data: meta })
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVICE_UNAVAILABLE', message: 'Storage is not configured' } },
      { status: 503 },
    )
  }
}
