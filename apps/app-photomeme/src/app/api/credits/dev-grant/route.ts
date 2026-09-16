import { NextResponse } from 'next/server'
import { CREDITS_PER_PURCHASE, isDevCreditGrantEnabled } from '@/lib/billing'
import { addPaidCredits, getQuotaSnapshot } from '@/lib/quota'
import { applyDevCreditsCookie, applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

/**
 * POST /api/credits/dev-grant
 * 仅开发环境（或 ALLOW_DEV_CREDIT_GRANT=1）给当前钱包加付费次数，用来测付费成图链路。
 */
export async function POST(req: Request): Promise<NextResponse> {
  if (!isDevCreditGrantEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'Dev credit grant is disabled.' } },
      { status: 403 },
    )
  }

  const wallet = ensureWalletId(req)
  const added = await addPaidCredits(req, wallet.id, CREDITS_PER_PURCHASE)
  if (!added.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'CREDIT_GRANT_FAILED', message: 'Could not add credits. Is Redis running?' },
      },
      { status: 503 },
    )
  }

  const quota = await getQuotaSnapshot(req, wallet.id)
  if (typeof added.cookieCredits === 'number') quota.paidCredits = added.cookieCredits
  const res = NextResponse.json({ ok: true, data: quota })
  if (wallet.created) applyWalletCookie(res, wallet.id)
  if (typeof added.cookieCredits === 'number') applyDevCreditsCookie(res, added.cookieCredits)
  return res
}
