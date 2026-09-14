import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@repo/common'
import { handleStripeWebhook } from '@/lib/billing'

export const runtime = 'nodejs'

// Stripe webhook：验签（需原始 raw body）→ 解析事件 → billing.handleStripeWebhook 处理
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Stripe 签名校验必须用原始 raw body：App Router route handler 用 req.text() 取未解析体。
  // 1. rawBody = await req.text()
  //    signature = req.headers.get('stripe-signature') ?? ''
  //    if (!verifyWebhookSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)) → 400
  // 2. 事件类型：checkout.session.completed / customer.subscription.updated
  //    / customer.subscription.deleted / invoice.paid
  // 3. handleStripeWebhook(Object.fromEntries(req.headers), rawBody) → { event, handled }
  // 4. return NextResponse.json({ received: true })
  throw new Error('Not implemented')
}
