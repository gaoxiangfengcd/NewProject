import { NextResponse } from 'next/server'
import { findPack, isCheckoutEnabled } from '@/lib/billing'
import { createPayPalCheckout } from '@/lib/paypal'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

/**
 * POST /api/credits/checkout  { packId?: string }
 * 创建 PayPal 订单，返回买家去付款的地址。
 * packId 只用来在服务端配置里挑一个点数包——点数和价格都取自服务端，不信前端。
 * 入账以回站后的 capture 为准，webhook 再兜一次，同一订单不会加两次。
 */
export async function POST(req: Request): Promise<NextResponse> {
  let packId = ''
  try {
    const body = (await req.json().catch(() => null)) as { packId?: unknown } | null
    if (typeof body?.packId === 'string') packId = body.packId
  } catch {
    packId = ''
  }

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

  const pack = findPack(packId)
  if (!pack) {
    const res = NextResponse.json(
      { ok: false, error: { code: 'CHECKOUT_UNAVAILABLE', message: 'No credit pack is configured.' } },
      { status: 501 },
    )
    if (wallet.created) applyWalletCookie(res, wallet.id)
    return res
  }

  const created = await createPayPalCheckout(wallet.id, pack)
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
    data: {
      url: created.checkoutUrl,
      transactionId: created.transactionId,
      packId: created.packId,
      credits: pack.credits,
    },
  })
  if (wallet.created) applyWalletCookie(res, wallet.id)
  return res
}
