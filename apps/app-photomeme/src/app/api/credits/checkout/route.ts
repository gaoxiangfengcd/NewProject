import { NextResponse } from 'next/server'
import { isCheckoutEnabled } from '@/lib/billing'
import { createHdCheckout } from '@/lib/paddle'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

/**
 * POST /api/credits/checkout
 * 创建 Paddle Hosted Checkout，前端跳转付款。
 * 入账以 webhook transaction.completed 为准；回站后再走 /api/credits/confirm 兜底。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)
  if (!isCheckoutEnabled()) {
    const res = NextResponse.json(
      {
        ok: false,
        error: {
          code: 'CHECKOUT_UNAVAILABLE',
          message: 'Card checkout is not configured yet.',
        },
      },
      { status: 501 },
    )
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  }

  const created = await createHdCheckout(wallet.id)
  if (!created.ok) {
    const res = NextResponse.json(
      { ok: false, error: { code: 'CHECKOUT_FAILED', message: created.message } },
      { status: 502 },
    )
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  }

  const res = NextResponse.json({
    ok: true,
    data: { url: created.checkoutUrl, transactionId: created.transactionId },
  })
  if (wallet.created) applyWalletCookie(res, wallet.id)
  return res
}
