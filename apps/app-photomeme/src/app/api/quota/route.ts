import { NextResponse } from 'next/server'
import { ensureRecoveryCode, getQuotaSnapshot } from '@/lib/quota'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

export async function GET(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)
  const quota = await getQuotaSnapshot(req, wallet.id)
  const recoveryCode = quota.paidCredits > 0 ? await ensureRecoveryCode(wallet.id) : null
  const res = NextResponse.json({ ok: true, data: quota, recoveryCode })
  applyWalletCookie(res, wallet.id)
  return res
}
