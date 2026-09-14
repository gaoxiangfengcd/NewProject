import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

const EXT_CONTENT_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

/**
 * 开发环境本地文件服务：从 LOCAL_STORAGE_DIR 读取上传的文件并返回。
 * 路径 /api/storage/<key> 映射到 ${LOCAL_STORAGE_DIR}/<key>。
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } },
): Promise<NextResponse> {
  const root = process.env.LOCAL_STORAGE_DIR
  if (!root) {
    return NextResponse.json({ error: 'storage_not_configured' }, { status: 500 })
  }

  const segments = (params?.path ?? []).map((s) => decodeURIComponent(s))
  if (segments.length === 0) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // 防路径穿越：拒绝包含 .. 或绝对路径片段
  for (const seg of segments) {
    if (seg === '..' || seg.includes('\\') || path.isAbsolute(seg)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 400 })
    }
  }

  const key = segments.join('/')
  const fullPath = path.join(path.resolve(root), key)

  // 再次校验解析后路径仍在 root 下
  const rootResolved = path.resolve(root)
  if (!fullPath.startsWith(rootResolved + path.sep) && fullPath !== rootResolved) {
    return NextResponse.json({ error: 'forbidden' }, { status: 400 })
  }

  let data: Buffer
  try {
    data = await fs.readFile(fullPath)
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const ext = path.extname(fullPath).slice(1).toLowerCase()
  const contentType = EXT_CONTENT_TYPE[ext] ?? 'application/octet-stream'

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
