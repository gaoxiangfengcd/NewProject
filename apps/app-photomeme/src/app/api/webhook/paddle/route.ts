import { NextResponse } from 'next/server'
import { logger } from '@repo/common'
import { CREDITS_PER_PURCHASE } from '@/lib/billing'
import { parseWalletFromCustomData, verifyPaddleWebhook } from '@/lib/paddle'
import { addPaidCreditsToWallet, claimCheckoutOnce, releaseCheckoutClaim } from '@/lib/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PaddlePayload {
  event_id?: string
  event_name?: string
  data?: {
    id?: string
    custom_data?: { walletId?: string; credits?: number | string } | null
    passthrough?: string
  }
}

/**
 * Paddle Billing webhook。
 * Dashboard → Notifications：https://<domain>/api/webhook/paddle
 * 事件：transaction.completed
 */
export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text()
  const signature =
    req.headers.get('paddle-signature') ?? req.headers.get('Paddle-Signature') ?? ''

  if (!verifyPaddleWebhook(rawBody, signature)) {
    logger.error('paddle webhook bad signature')
    return NextResponse.json({ ok: false, error: { code: 'BAD_SIGNATURE' } }, { status: 401 })
  }

  let body: PaddlePayload
  try {
    body = JSON.parse(rawBody) as PaddlePayload
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_JSON' } }, { status: 400 })
  }

  const eventName = body.event_name ?? ''
  const txnId = body.data?.id
  if (eventName !== 'transaction.completed') {
    return NextResponse.json({ ok: true, handled: false, eventName })
  }
  if (!txnId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_TXN' } }, { status: 400 })
  }

  let parsed = parseWalletFromCustomData(body.data?.custom_data ?? null)
  if (!parsed && body.data?.passthrough) {
    try {
      parsed = parseWalletFromCustomData(JSON.parse(body.data.passthrough) as { walletId?: string; credits?: number })
    } catch {
      parsed = null
    }
  }
  if (!parsed) {
    logger.error('paddle webhook missing walletId', { txnId })
    return NextResponse.json({ ok: false, error: { code: 'MISSING_WALLET' } }, { status: 400 })
  }

  const claimed = await claimCheckoutOnce(txnId)
  if (claimed === 'duplicate') {
    return NextResponse.json({ ok: true, alreadyGranted: true, transactionId: txnId })
  }
  if (claimed === 'unavailable') {
    return NextResponse.json({ ok: false, error: { code: 'REDIS_UNAVAILABLE' } }, { status: 503 })
  }

  const added = await addPaidCreditsToWallet(parsed.walletId, parsed.credits || CREDITS_PER_PURCHASE)
  if (!added.ok) {
    await releaseCheckoutClaim(txnId)
    logger.error('paddle webhook credit grant failed', { txnId, error: added.error })
    return NextResponse.json({ ok: false, error: { code: 'CREDIT_GRANT_FAILED' } }, { status: 503 })
  }

  logger.info('paddle credits granted', { txnId, walletId: parsed.walletId, credits: parsed.credits })
  return NextResponse.json({ ok: true, handled: true, transactionId: txnId })
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'memego-paddle-webhook',
    events: ['transaction.completed'],
  })
}
