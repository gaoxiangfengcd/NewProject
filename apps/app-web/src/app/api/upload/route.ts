import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { validatePhoto, detectFaces, cropAndAlignToFace } from '@/lib/face-detect'
import { getProvider as getStorageProvider, buildKey } from '@repo/storage'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

// 上传照片：鉴权 → multipart → 人脸校验 → 上传存储 → 写库
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. 鉴权
  const sessionResult = await requireAuth(req)
  if (!sessionResult.ok) {
    return NextResponse.json(
      { error: sessionResult.error.message },
      { status: sessionResult.error.status },
    )
  }
  const user = sessionResult.value

  // 2. 解析 multipart
  const formData = await req.formData()
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file_required' }, { status: 400 })
  }

  // 3. 读取 buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 4. 照片校验
  const validateResult = await validatePhoto(buffer)
  if (!validateResult.ok) {
    return NextResponse.json(
      { error: 'invalid_photo', reason: 'low_quality' },
      { status: 400 },
    )
  }
  if (!validateResult.value.ok) {
    return NextResponse.json(
      { error: 'invalid_photo', reason: validateResult.value.reason ?? 'low_quality' },
      { status: 400 },
    )
  }

  // 5. 检测尺寸（含 mock 人脸检测）
  const detectResult = await detectFaces(buffer)
  if (!detectResult.ok) {
    return NextResponse.json(
      { error: 'invalid_photo', reason: 'low_quality' },
      { status: 400 },
    )
  }
  const { width, height } = detectResult.value

  // 6. 裁剪对齐（阶段1 返回原图）
  const cropResult = await cropAndAlignToFace(buffer, detectResult.value.bounds)
  if (!cropResult.ok) {
    return NextResponse.json(
      { error: 'invalid_photo', reason: 'low_quality' },
      { status: 400 },
    )
  }
  const uploadBuffer = cropResult.value.buffer

  // 7. 上传到存储
  const storage = getStorageProvider()
  const key = buildKey({
    bucket: 'photos',
    scope: 'photos',
    ownerId: user.userId,
    filename: file.name,
  })
  const uploadResult = await storage.upload(key, uploadBuffer, {
    contentType: file.type || undefined,
    public: true,
  })
  if (!uploadResult.ok) {
    return NextResponse.json(
      { error: 'upload_failed', message: uploadResult.error.message },
      { status: 500 },
    )
  }

  // Local provider 的 url 不可直接用于静态服务，统一用 /api/storage/<key> 访问
  const r2Url = `/api/storage/${uploadResult.value.key}`

  // 8. 写库
  const photo = await prisma.photo.create({
    data: {
      userId: user.userId,
      r2Key: uploadResult.value.key,
      r2Url,
      width,
      height,
      faceDetected: detectResult.value.detected,
    },
  })

  return NextResponse.json({ photoId: photo.id, url: r2Url })
}
