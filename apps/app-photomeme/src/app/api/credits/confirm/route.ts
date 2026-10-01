import { NextResponse } from 'next/server'
import { capturePayPalOrder, paypalConfigured } from '@/lib/paypal'
import {
  addPaidCredits,
  addPaidCreditsToWallet,
  claimCheckoutOnce,
  getQuotaSnapshot,
  releaseCheckoutClaim,
} from '@/lib/quota'
import { applyDevCreditsCookie, applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

const ORDER_ID = /^[A-Z0-9]{10,20}$/

/**
 * POST /api/credits/confirm  { transactionId }
 * PayPal 回站后的订单号在 token 里。先 capture，再按订单金额入账。
 * 与 webhook 共用同一订单号，不会加两次。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)
  if (!paypalConfigured()) {
    return NextResponse.json(
      { ok: false, error: { code: 'CHECKOUT_UNAVAILABLE', message: 'Card checkout is not configured yet.' } },
      { status: 501 },
    )
  }

  let transactionId = ''
  try {
    const body = (await req.json()) as { transactionId?: unknown }
    if (typeof body.transactionId === 'string') transactionId = body.transactionId.trim()
  } catch {
    transactionId = ''
  }
  if (!ORDER_ID.test(transactionId)) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_SESSION', message: 'Missing checkout transaction.' } },
      { status: 400 },
    )
  }

  const captured = await capturePayPalOrder(transactionId)
  if (!captured.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: captured.unpaid ? 'NOT_PAID' : 'CONFIRM_FAILED',
          message: captured.message,
        },
      },
      { status: captured.unpaid ? 402 : 502 },
    )
  }

  const claimedWallet = captured.grant.walletId || wallet.id
  const credits = captured.grant.credits
  const claimed = await claimCheckoutOnce(captured.grant.orderId)
  if (claimed === 'unavailable') {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'CREDIT_GRANT_FAILED',
          message: 'Payment received, but credits could not be saved. Contact support.',
        },
      },
      { status: 503 },
    )
  }
  if (claimed === 'duplicate') {
    const quota = await getQuotaSnapshot(req, claimedWallet)
    const res = NextResponse.json({ ok: true, data: quota, alreadyGranted: true })
    applyWalletCookie(res, claimedWallet)
    return res
  }

  const addedRedis = await addPaidCreditsToWallet(claimedWallet, credits)
  if (addedRedis.ok) {
    const quota = await getQuotaSnapshot(req, claimedWallet)
    const res = NextResponse.json({ ok: true, data: quota })
    applyWalletCookie(res, claimedWallet)
    return res
  }

  const added = await addPaidCredits(req, claimedWallet, credits)
  if (!added.ok) {
    await releaseCheckoutClaim(captured.grant.orderId)
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'CREDIT_GRANT_FAILED',
          message: 'Payment received, but credits could not be saved. Contact support.',
        },
      },
      { status: 503 },
    )
  }

  const quota = await getQuotaSnapshot(req, claimedWallet)
  if (typeof added.cookieCredits === 'number') quota.paidCredits = added.cookieCredits
  const res = NextResponse.json({ ok: true, data: quota })
  applyWalletCookie(res, claimedWallet)
  if (typeof added.cookieCredits === 'number') applyDevCreditsCookie(res, added.cookieCredits)
  return res
}
