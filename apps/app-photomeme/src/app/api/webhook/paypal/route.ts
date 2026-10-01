import { NextResponse } from 'next/server'
import { logger } from '@repo/common'
import { grantFromPayPalCapture, verifyPayPalWebhook } from '@/lib/paypal'
import { addPaidCreditsToWallet, claimCheckoutOnce, releaseCheckoutClaim } from '@/lib/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PayPal webhook。
 * Developer Dashboard → Webhooks：https://memego.jiandengcun.com/api/webhook/paypal
 * 事件：PAYMENT.CAPTURE.COMPLETED
 */
export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text()
  if (!(await verifyPayPalWebhook(rawBody, req.headers))) {
    logger.error('paypal webhook bad signature')
    return NextResponse.json({ ok: false, error: { code: 'BAD_SIGNATURE' } }, { status: 401 })
  }

  let body: {
    event_type?: string
    resource?: {
      id?: string
      status?: string
      custom_id?: string
      amount?: { value?: string }
      supplementary_data?: { related_ids?: { order_id?: string } }
    }
  }
  try {
    body = JSON.parse(rawBody) as typeof body
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_JSON' } }, { status: 400 })
  }

  if (body.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
    return NextResponse.json({ ok: true, handled: false, eventType: body.event_type ?? '' })
  }
  if (body.resource?.status && body.resource.status !== 'COMPLETED') {
    return NextResponse.json({ ok: true, handled: false, status: body.resource.status })
  }

  const parsed = grantFromPayPalCapture(body)
  if (!parsed) {
    logger.error('paypal webhook missing wallet or amount', { captureId: body.resource?.id })
    return NextResponse.json({ ok: false, error: { code: 'MISSING_WALLET' } }, { status: 400 })
  }

  const claimed = await claimCheckoutOnce(parsed.orderId)
  if (claimed === 'duplicate') {
    return NextResponse.json({ ok: true, alreadyGranted: true, transactionId: parsed.orderId })
  }
  if (claimed === 'unavailable') {
    return NextResponse.json({ ok: false, error: { code: 'REDIS_UNAVAILABLE' } }, { status: 503 })
  }

  const added = await addPaidCreditsToWallet(parsed.walletId, parsed.credits)
  if (!added.ok) {
    await releaseCheckoutClaim(parsed.orderId)
    logger.error('paypal webhook credit grant failed', { orderId: parsed.orderId, error: added.error })
    return NextResponse.json({ ok: false, error: { code: 'CREDIT_GRANT_FAILED' } }, { status: 503 })
  }

  logger.info('paypal credits granted', {
    orderId: parsed.orderId,
    walletId: parsed.walletId,
    credits: parsed.credits,
  })
  return NextResponse.json({ ok: true, handled: true, transactionId: parsed.orderId })
}
