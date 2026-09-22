import { NextResponse } from 'next/server'
import { findPack, isCheckoutEnabled } from '@/lib/billing'
import { createHdCheckout } from '@/lib/paddle'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

/**
 * POST /api/credits/checkout  { packId?: string }
 * 创建 Paddle transaction，返回 transactionId（前端用 Paddle.js 覆盖层打开）
 * 与兜底用的 Hosted Checkout URL。
 * packId 只用来在服务端配置里挑一个点数包——点数和价格都取自服务端，不信前端。
 * 入账以 webhook transaction.completed 为准；回站后再走 /api/credits/confirm 兜底。
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

  const created = await createHdCheckout(wallet.id, pack)
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
