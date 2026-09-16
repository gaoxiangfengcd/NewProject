import { NextResponse } from 'next/server'
import { getQuotaSnapshot } from '@/lib/quota'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

export async function GET(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)
  const quota = await getQuotaSnapshot(req, wallet.id)
  const res = NextResponse.json({ ok: true, data: quota })
  if (wallet.created) applyWalletCookie(res, wallet.id)
  return res
}
