import { createHmac, timingSafeEqual } from 'node:crypto'
import { logger } from '@repo/common'
import { CREDITS_PER_PURCHASE, creditPacks, type CreditPack } from './billing'
import { SITE_URL } from './site'

function apiBaseUrl(apiKey: string): string {
  if (apiKey.includes('sdbx')) return 'https://sandbox-api.paddle.com'
  return 'https://api.paddle.com'
}

export function paddleApiKey(): string {
  return (process.env.PADDLE_API_KEY ?? '').trim()
}

export function isPaddleConfigured(): boolean {
  return Boolean(paddleApiKey() && creditPacks().length > 0)
}

export interface PaddleTransaction {
  id: string
  status: string
  customData: { walletId?: string; credits?: number | string } | null
}

/**
 * 创建一次性 HD 次数的 Paddle Billing transaction，返回 Hosted Checkout URL。
 */
export async function createHdCheckout(
  walletId: string,
  pack: Pick<CreditPack, 'id' | 'priceId' | 'credits'>,
): Promise<
  { ok: true; checkoutUrl: string; transactionId: string; packId: string } | { ok: false; message: string }
> {
  const apiKey = paddleApiKey()
  if (!apiKey || !pack.priceId) {
    return { ok: false, message: 'Paddle checkout is not configured yet.' }
  }

  // ⚠️ 入账的 credits 一定要来自服务端配置，绝不能相信前端传来的数字。
  const credits = Math.max(1, Math.floor(pack.credits) || CREDITS_PER_PURCHASE)

  const payload = {
    items: [{ price_id: pack.priceId, quantity: 1 }],
    custom_data: {
      walletId,
      credits,
      packId: pack.id,
    },
    checkout: {
      success_url: `${SITE_URL}/?checkout=success#generator`,
    },
  }

  let res: Response
  try {
    res = await fetch(`${apiBaseUrl(apiKey)}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    logger.error('paddle create transaction network error', {
      message: e instanceof Error ? e.message : String(e),
    })
    return { ok: false, message: 'Cannot reach Paddle. Check your network and try again.' }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('paddle create transaction failed', { status: res.status, body: body.slice(0, 400) })
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }

  const json = (await res.json()) as { data?: { id?: string; checkout?: { url?: string | null } } }
  const txnId = json.data?.id
  if (!txnId) {
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }

  return {
    ok: true,
    checkoutUrl: `${SITE_URL}/?_ptxn=${encodeURIComponent(txnId)}`,
    transactionId: txnId,
    packId: pack.id,
  }
}

export async function getPaddleTransaction(
  txnId: string,
): Promise<{ ok: true; transaction: PaddleTransaction } | { ok: false; message: string }> {
  const apiKey = paddleApiKey()
  if (!apiKey) return { ok: false, message: 'Paddle checkout is not configured yet.' }

  const res = await fetch(`${apiBaseUrl(apiKey)}/transactions/${encodeURIComponent(txnId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('paddle get transaction failed', { status: res.status, body: body.slice(0, 300) })
    return { ok: false, message: 'Could not verify payment.' }
  }

  const json = (await res.json()) as {
    data?: {
      id?: string
      status?: string
      custom_data?: { walletId?: string; credits?: number | string } | null
    }
  }
  const data = json.data
  if (!data?.id) return { ok: false, message: 'Could not verify payment.' }

  return {
    ok: true,
    transaction: {
      id: data.id,
      status: data.status ?? '',
      customData: data.custom_data ?? null,
    },
  }
}

export function paddlePaymentSettled(status: string): boolean {
  return status === 'completed' || status === 'paid' || status === 'billed'
}

/** Paddle-Signature: ts=...;h1=...  HMAC-SHA256(ts:rawBody) */
export function verifyPaddleWebhook(rawBody: string, signatureHeader: string): boolean {
  const secret = (process.env.PADDLE_WEBHOOK_SECRET ?? '').trim()
  if (!secret || !signatureHeader) return false

  const parts = signatureHeader.split(';').reduce<Record<string, string>>((acc, kv) => {
    const i = kv.trim().indexOf('=')
    if (i > 0) acc[kv.trim().slice(0, i)] = kv.trim().slice(i + 1)
    return acc
  }, {})

  const ts = parts.ts
  const h1 = parts.h1
  if (!ts || !h1) return false

  const computed = createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex')
  try {
    const a = Buffer.from(computed, 'hex')
    const b = Buffer.from(h1, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function parseWalletFromCustomData(
  customData: PaddleTransaction['customData'],
): { walletId: string; credits: number } | null {
  const walletId = customData?.walletId
  if (typeof walletId !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(walletId)) return null
  const credits = Math.max(1, Number(customData?.credits ?? CREDITS_PER_PURCHASE) || CREDITS_PER_PURCHASE)
  return { walletId, credits }
}
