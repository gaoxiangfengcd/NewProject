import { logger } from '@repo/common'
import { creditPacks, type CreditPack } from './billing'
import { SITE_NAME, SITE_URL } from './site'

const WALLET_RE = /^[A-Za-z0-9_-]{8,64}$/

function paypalMode(): 'sandbox' | 'live' {
  const mode = (process.env.PAYPAL_MODE ?? '').trim().toLowerCase()
  if (mode === 'live') return 'live'
  if (mode === 'sandbox') return 'sandbox'
  return process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
}

function apiBase(): string {
  return paypalMode() === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'
}

export function paypalConfigured(): boolean {
  return Boolean(clientId() && clientSecret())
}

function clientId(): string {
  return (process.env.PAYPAL_CLIENT_ID ?? '').trim()
}

function clientSecret(): string {
  return (process.env.PAYPAL_CLIENT_SECRET ?? '').trim()
}

let tokenCache: { value: string; expiresAt: number } | null = null

async function accessToken(): Promise<string | null> {
  const id = clientId()
  const secret = clientSecret()
  if (!id || !secret) return null
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.value

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('paypal oauth failed', { status: res.status, body: body.slice(0, 300) })
    return null
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!json.access_token) return null
  tokenCache = {
    value: json.access_token,
    expiresAt: Date.now() + Math.max(60, Number(json.expires_in ?? 300)) * 1000,
  }
  return json.access_token
}

function moneyValue(cents: number): string {
  return (cents / 100).toFixed(2)
}

function centsFromValue(value: string): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

export interface PayPalGrant {
  orderId: string
  walletId: string
  credits: number
}

function packForCents(cents: number): CreditPack | null {
  return creditPacks().find((pack) => pack.priceCents === cents) ?? null
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function grantFromOrder(order: Record<string, unknown>, orderId: string): PayPalGrant | null {
  const units = Array.isArray(order.purchase_units) ? order.purchase_units : []
  const unit = asRecord(units[0])
  if (!unit) return null
  const amount = asRecord(unit.amount)
  const cents = centsFromValue(typeof amount?.value === 'string' ? amount.value : '')
  const pack = packForCents(cents)
  const walletId = typeof unit.custom_id === 'string' ? unit.custom_id : ''
  if (!pack || !WALLET_RE.test(walletId)) return null
  return { orderId, walletId, credits: pack.credits }
}

export async function createPayPalCheckout(
  walletId: string,
  pack: Pick<CreditPack, 'id' | 'credits' | 'priceCents'>,
): Promise<{ ok: true; checkoutUrl: string; transactionId: string; packId: string } | { ok: false; message: string }> {
  const token = await accessToken()
  if (!token) return { ok: false, message: 'Card checkout is not configured yet.' }

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: pack.id,
        custom_id: walletId,
        description: `${pack.credits} cartoon generations on ${SITE_NAME}`,
        amount: { currency_code: 'USD', value: moneyValue(pack.priceCents) },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: SITE_NAME,
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${SITE_URL}/?checkout=success`,
          cancel_url: `${SITE_URL}/?checkout=cancel#generator`,
        },
      },
    },
  }

  let res: Response
  try {
    res = await fetch(`${apiBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    logger.error('paypal create order network error', {
      message: e instanceof Error ? e.message : String(e),
    })
    return { ok: false, message: 'Cannot reach checkout. Check your network and try again.' }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('paypal create order failed', { status: res.status, body: body.slice(0, 400) })
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }

  const json = (await res.json()) as { id?: string; links?: { rel?: string; href?: string }[] }
  const approve = json.links?.find((link) => link.rel === 'payer-action' || link.rel === 'approve')?.href ?? ''
  if (!json.id || !approve.startsWith('https://')) {
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }
  return { ok: true, checkoutUrl: approve, transactionId: json.id, packId: pack.id }
}

/** 买家已在 PayPal 点过同意。APPROVED 时扣款，COMPLETED 时直接入账。 */
export async function capturePayPalOrder(
  orderId: string,
): Promise<{ ok: true; grant: PayPalGrant } | { ok: false; message: string; unpaid?: boolean }> {
  const token = await accessToken()
  if (!token) return { ok: false, message: 'Card checkout is not configured yet.' }

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const existing = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, { headers })
  if (!existing.ok) {
    const body = await existing.text().catch(() => '')
    logger.error('paypal get order failed', { status: existing.status, body: body.slice(0, 300) })
    return { ok: false, message: 'Could not verify payment.' }
  }
  const order = (await existing.json()) as Record<string, unknown>
  const status = typeof order.status === 'string' ? order.status : ''

  if (status === 'COMPLETED') {
    const grant = grantFromOrder(order, orderId)
    if (!grant) return { ok: false, message: 'Could not match this payment to a gift pack.' }
    return { ok: true, grant }
  }
  if (status !== 'APPROVED') {
    return { ok: false, message: 'Payment is not complete yet.', unpaid: true }
  }

  const captured = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers,
  })
  if (!captured.ok) {
    const body = await captured.text().catch(() => '')
    logger.error('paypal capture failed', { status: captured.status, body: body.slice(0, 400) })
    return { ok: false, message: 'Could not verify payment.' }
  }
  const done = (await captured.json()) as Record<string, unknown>
  if (done.status !== 'COMPLETED') {
    return { ok: false, message: 'Payment is not complete yet.', unpaid: true }
  }
  const grant = grantFromOrder(done, orderId)
  if (!grant) return { ok: false, message: 'Could not match this payment to a gift pack.' }
  return { ok: true, grant }
}

/** 只用交易号找回钱包，不扣款、不加次数。订单号或 Capture 号都可以。 */
export async function lookupPayPalWallet(paymentId: string): Promise<string | null> {
  const token = await accessToken()
  if (!token) return null
  const headers = { Authorization: `Bearer ${token}` }

  const orderRes = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(paymentId)}`, { headers })
  if (orderRes.ok) {
    const order = (await orderRes.json()) as Record<string, unknown>
    if (order.status !== 'COMPLETED') return null
    return grantFromOrder(order, paymentId)?.walletId ?? null
  }

  const captureRes = await fetch(`${apiBase()}/v2/payments/captures/${encodeURIComponent(paymentId)}`, {
    headers,
  })
  if (!captureRes.ok) return null
  const capture = (await captureRes.json()) as { status?: string; custom_id?: string }
  if (capture.status !== 'COMPLETED') return null
  const walletId = capture.custom_id ?? ''
  if (!WALLET_RE.test(walletId)) return null
  return walletId
}

export async function verifyPayPalWebhook(rawBody: string, headers: Headers): Promise<boolean> {
  const webhookId = (process.env.PAYPAL_WEBHOOK_ID ?? '').trim()
  const token = await accessToken()
  if (!webhookId || !token) return false

  let event: unknown
  try {
    event = JSON.parse(rawBody) as unknown
  } catch {
    return false
  }

  const res = await fetch(`${apiBase()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo') ?? '',
      cert_url: headers.get('paypal-cert-url') ?? '',
      transmission_id: headers.get('paypal-transmission-id') ?? '',
      transmission_sig: headers.get('paypal-transmission-sig') ?? '',
      transmission_time: headers.get('paypal-transmission-time') ?? '',
      webhook_id: webhookId,
      webhook_event: event,
    }),
  })
  if (!res.ok) return false
  const json = (await res.json()) as { verification_status?: string }
  return json.verification_status === 'SUCCESS'
}

/** Webhook 的 capture 里拿出订单号、钱包和金额。次数只认服务端价目。 */
export function grantFromPayPalCapture(event: {
  resource?: {
    id?: string
    custom_id?: string
    amount?: { value?: string }
    supplementary_data?: { related_ids?: { order_id?: string } }
  }
}): PayPalGrant | null {
  const resource = event.resource
  const orderId = resource?.supplementary_data?.related_ids?.order_id || resource?.id || ''
  const cents = centsFromValue(resource?.amount?.value ?? '')
  const pack = packForCents(cents)
  const walletId = resource?.custom_id ?? ''
  if (!orderId || !pack || !WALLET_RE.test(walletId)) return null
  return { orderId, walletId, credits: pack.credits }
}
