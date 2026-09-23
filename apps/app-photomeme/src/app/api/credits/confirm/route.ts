import { NextResponse } from 'next/server'
import {
  creemApiKey,
  creemPaymentSettled,
  getCreemCheckout,
  grantFromCheckout,
} from '@/lib/creem'
import {
  addPaidCredits,
  addPaidCreditsToWallet,
  claimCheckoutOnce,
  getQuotaSnapshot,
  releaseCheckoutClaim,
} from '@/lib/quota'
import { applyDevCreditsCookie, applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

const CHECKOUT_ID = /^ch_[A-Za-z0-9]+$/

/**
 * POST /api/credits/confirm  { transactionId }
 * Creem 付款成功回站后入账。transactionId 是 checkout id（ch_...）。
 * 与 webhook 共用同一幂等键，不会加两次。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)
  if (!creemApiKey()) {
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
  if (!CHECKOUT_ID.test(transactionId)) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_SESSION', message: 'Missing checkout transaction.' } },
      { status: 400 },
    )
  }

  const fetched = await getCreemCheckout(transactionId)
  if (!fetched.ok) {
    return NextResponse.json(
      { ok: false, error: { code: 'CONFIRM_FAILED', message: fetched.message } },
      { status: 502 },
    )
  }

  if (!creemPaymentSettled(fetched.checkout)) {
    return NextResponse.json(
      { ok: false, error: { code: 'NOT_PAID', message: 'Payment is not complete yet.' } },
      { status: 402 },
    )
  }

  const parsed = grantFromCheckout(fetched.checkout)
  const claimedWallet = parsed?.walletId || wallet.id
  const credits = parsed?.credits
  if (!credits) {
    return NextResponse.json(
      { ok: false, error: { code: 'CONFIRM_FAILED', message: 'Could not match this payment to a gift pack.' } },
      { status: 400 },
    )
  }

  const claimed = await claimCheckoutOnce(fetched.checkout.id)
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
    await releaseCheckoutClaim(fetched.checkout.id)
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
