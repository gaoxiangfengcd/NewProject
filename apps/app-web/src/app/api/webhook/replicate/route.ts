import { NextRequest, NextResponse } from 'next/server'
import { verifyReplicateWebhookSignature } from '@/lib/replicate'
import { finalizeGeneration } from '@/lib/generate-hair'
import { prisma } from '@/db/client'

export const runtime = 'nodejs'

interface ReplicateWebhookPayload {
  id?: string
  status?: string
  output?: string | string[]
  error?: string
}

// Replicate 完成回调：验签 → 解析 prediction → 更新状态 → 成功则下载/上传结果
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text()
  const signature = req.headers.get('replicate-signature') ?? ''
  if (!verifyReplicateWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: { code: 'INVALID_SIGNATURE', message: 'invalid webhook signature' } },
      { status: 401 },
    )
  }

  let payload: ReplicateWebhookPayload
  try {
    payload = JSON.parse(rawBody) as ReplicateWebhookPayload
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }
  const predictionId = payload.id
  const status = payload.status
  if (!predictionId || !status) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'missing prediction id or status' } },
      { status: 400 },
    )
  }

  const generation = await prisma.generation.findFirst({
    where: { replicatePredictionId: predictionId },
  })
  if (!generation) {
    // 未匹配到记录：仍返回 200，避免 Replicate 无限重试
    return NextResponse.json({ ok: true, matched: false })
  }

  if (status === 'succeeded') {
    const outputUrl = Array.isArray(payload.output)
      ? payload.output[0]
      : payload.output
    if (!outputUrl) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: 'failed', error: 'no output', completedAt: new Date() },
      })
      return NextResponse.json({ ok: true })
    }
    await finalizeGeneration(generation.id, outputUrl)
    return NextResponse.json({ ok: true })
  }

  if (status === 'failed') {
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: 'failed',
        error: payload.error ?? 'replicate prediction failed',
        completedAt: new Date(),
      },
    })
  }
  // starting/processing 等中间态：不更新，等待最终回调
  return NextResponse.json({ ok: true })
}
