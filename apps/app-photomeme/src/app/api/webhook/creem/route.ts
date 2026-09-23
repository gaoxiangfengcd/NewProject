import { NextResponse } from 'next/server'
import { logger } from '@repo/common'
import { creemPaymentSettled, grantFromCheckout, verifyCreemWebhook, type CreemCheckout } from '@/lib/creem'
import { addPaidCreditsToWallet, claimCheckoutOnce, releaseCheckoutClaim } from '@/lib/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Creem webhook。
 * Dashboard → Developers → Webhooks：https://<domain>/api/webhook/creem
 * 事件：checkout.completed
 */
export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text()
  if (!verifyCreemWebhook(rawBody, req.headers)) {
    logger.error('creem webhook bad signature')
    return NextResponse.json({ ok: false, error: { code: 'BAD_SIGNATURE' } }, { status: 401 })
  }

  let body: {
    eventType?: string
    object?: {
      id?: string
      status?: string
      product?: { id?: string }
      order?: { product?: string; status?: string }
      metadata?: Record<string, string>
    }
  }
  try {
    body = JSON.parse(rawBody) as typeof body
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_JSON' } }, { status: 400 })
  }

  if (body.eventType !== 'checkout.completed') {
    return NextResponse.json({ ok: true, handled: false, eventType: body.eventType ?? '' })
  }

  const object = body.object
  const checkoutId = object?.id ?? ''
  if (!checkoutId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_TXN' } }, { status: 400 })
  }

  const checkout: CreemCheckout = {
    id: checkoutId,
    status: object?.status || object?.order?.status || '',
    productId: object?.product?.id || object?.order?.product || '',
    metadata: object?.metadata ?? {},
  }
  if (!creemPaymentSettled(checkout) && object?.order?.status !== 'paid') {
    return NextResponse.json({ ok: true, handled: false, status: checkout.status })
  }

  const parsed = grantFromCheckout(checkout)
  if (!parsed) {
    logger.error('creem webhook missing wallet or product', { checkoutId, productId: checkout.productId })
    return NextResponse.json({ ok: false, error: { code: 'MISSING_WALLET' } }, { status: 400 })
  }

  const claimed = await claimCheckoutOnce(checkoutId)
  if (claimed === 'duplicate') {
    return NextResponse.json({ ok: true, alreadyGranted: true, transactionId: checkoutId })
  }
  if (claimed === 'unavailable') {
    return NextResponse.json({ ok: false, error: { code: 'REDIS_UNAVAILABLE' } }, { status: 503 })
  }

  const added = await addPaidCreditsToWallet(parsed.walletId, parsed.credits)
  if (!added.ok) {
    await releaseCheckoutClaim(checkoutId)
    logger.error('creem webhook credit grant failed', { checkoutId, error: added.error })
    return NextResponse.json({ ok: false, error: { code: 'CREDIT_GRANT_FAILED' } }, { status: 503 })
  }

  logger.info('creem credits granted', { checkoutId, walletId: parsed.walletId, credits: parsed.credits })
  return NextResponse.json({ ok: true, handled: true, transactionId: checkoutId })
}
