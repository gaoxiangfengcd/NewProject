import { NextResponse } from 'next/server'
import { lookupPayPalWallet } from '@/lib/paypal'
import { getClientIp } from '@/lib/rate-limit'
import {
  getQuotaSnapshot,
  movePaidCredits,
  readCheckoutWallet,
  walletIdForRecoveryCode,
} from '@/lib/quota'
import { getRedis } from '@/lib/redis'
import { applyWalletCookie, ensureWalletId } from '@/lib/wallet'

export const runtime = 'nodejs'

const CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/
const ORDER_RE = /^[A-Z0-9]{10,20}$/

function parseInput(raw: string): { kind: 'code'; code: string } | { kind: 'order'; id: string } | null {
  const compact = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (CODE_RE.test(compact)) return { kind: 'code', code: compact }
  if (ORDER_RE.test(compact)) return { kind: 'order', id: compact }
  return null
}

async function limited(req: Request): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const count = await redis.incr(`recovery:tries:${getClientIp(req)}`)
  if (count === 1) await redis.expire(`recovery:tries:${getClientIp(req)}`, 60 * 60)
  return count > 15
}

/**
 * POST /api/credits/restore  { code }
 * 恢复码或 PayPal 交易号。把那张钱包里还没用完的次数挪到当前浏览器。
 */
export async function POST(req: Request): Promise<NextResponse> {
  const wallet = ensureWalletId(req)

  let raw = ''
  try {
    const body = (await req.json()) as { code?: unknown }
    if (typeof body.code === 'string') raw = body.code
  } catch {
    raw = ''
  }

  try {
    if (await limited(req)) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: 'RATE_LIMITED', message: 'Too many tries. Wait an hour and try again.' },
        },
        { status: 429 },
      )
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'UNAVAILABLE', message: 'Could not restore generations right now. Try again in a moment.' },
      },
      { status: 503 },
    )
  }

  const parsed = parseInput(raw)
  if (!parsed) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'INVALID_CODE',
          message: 'Enter the restore code or the PayPal transaction ID.',
        },
      },
      { status: 400 },
    )
  }

  const source =
    parsed.kind === 'code' ? await walletIdForRecoveryCode(parsed.code) : await walletForOrder(parsed.id)
  if (!source) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'NOT_FOUND', message: 'That code or transaction ID was not found.' },
      },
      { status: 404 },
    )
  }

  const moved = await movePaidCredits(source, wallet.id)
  if (!moved.ok) {
    const empty = moved.error === 'empty'
    const missing = moved.error === 'not_found'
    const message = empty
      ? 'That payment has no generations left.'
      : missing
        ? 'That code or transaction ID was not found.'
        : 'Could not restore generations right now. Try again in a moment.'
    const status = empty ? 409 : missing ? 404 : 503
    return NextResponse.json({ ok: false, error: { code: moved.error.toUpperCase(), message } }, { status })
  }

  const quota = await getQuotaSnapshot(req, wallet.id)
  const res = NextResponse.json({
    ok: true,
    data: quota,
    recoveryCode: moved.recoveryCode,
    alreadyHere: moved.alreadyHere,
  })
  applyWalletCookie(res, wallet.id)
  return res
}

async function walletForOrder(id: string): Promise<string | null> {
  const stored = await readCheckoutWallet(id)
  if (stored) return stored
  return lookupPayPalWallet(id)
}
