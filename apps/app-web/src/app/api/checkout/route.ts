import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createCheckoutTransaction, getPackCredits } from '@/lib/paddle'
import { addPaidCredits } from '@/lib/quota'

export const runtime = 'nodejs'

/**
 * 创建 Paddle Checkout。
 *
 * POST /api/checkout  { packId: 'credit-1' | 'credit-6' }
 *
 * 返回：{ url } — 前端重定向过去。
 *
 * 未配 PADDLE_API_KEY 时走 mock 路径，直接给用户加点数并返回
 * 跳转到 pricing 页，方便本地开发。
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Please log in to purchase credits' } },
      { status: authRes.error.status },
    )
  }
  const { userId } = authRes.value

  let body: { packId?: string }
  try {
    body = (await req.json()) as { packId?: string }
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }
  if (!body.packId || body.packId !== 'credit-6') {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'packId must be credit-6' } },
      { status: 400 },
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const successUrl = `${baseUrl}/account?purchased=${body.packId}`
  const cancelUrl = `${baseUrl}/pricing`

  const result = await createCheckoutTransaction({
    userId,
    packId: body.packId as 'credit-6',
    successUrl,
    cancelUrl,
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: { code: result.error.code, message: result.error.message } },
      { status: result.error.status },
    )
  }

  // Mock 模式（createCheckoutTransaction 在 PADDLE_API_KEY 为空时已走 mock 分支）
  // 这里再补加点数，让本地点击 $9.99 按钮即可看到 credits 变化
  if (!process.env.PADDLE_API_KEY?.trim()) {
    const credits = getPackCredits(body.packId) ?? 1
    await addPaidCredits(userId, credits)
  }

  return NextResponse.json({
    url: result.value.checkoutUrl,
    transactionId: result.value.transactionId,
  })
}
