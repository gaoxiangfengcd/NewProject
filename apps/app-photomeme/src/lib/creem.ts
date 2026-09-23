import { createHmac, timingSafeEqual } from 'node:crypto'
import { logger } from '@repo/common'
import { creditPacks, type CreditPack } from './billing'
import { SITE_URL } from './site'

function apiBaseUrl(apiKey: string): string {
  if (apiKey.startsWith('creem_test_')) return 'https://test-api.creem.io'
  return 'https://api.creem.io'
}

export function creemApiKey(): string {
  return (process.env.CREEM_API_KEY ?? '').trim()
}

export interface CreemCheckout {
  id: string
  status: string
  productId: string
  metadata: Record<string, string>
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function stringField(record: Record<string, unknown> | null, key: string): string {
  const value = record?.[key]
  return typeof value === 'string' ? value : ''
}

function metadataOf(record: Record<string, unknown> | null): Record<string, string> {
  const raw = asRecord(record?.metadata)
  if (!raw) return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') out[key] = value
    else if (typeof value === 'number') out[key] = String(value)
  }
  return out
}

function parseCheckout(json: unknown): CreemCheckout | null {
  const root = asRecord(json)
  const data = asRecord(root?.data) ?? root
  if (!data) return null
  const id = stringField(data, 'id')
  if (!id) return null
  const product = asRecord(data.product)
  const order = asRecord(data.order)
  const orderProduct = asRecord(order?.product)
  const productId =
    stringField(data, 'product_id') ||
    stringField(product, 'id') ||
    stringField(orderProduct, 'id') ||
    stringField(order, 'product')
  const orderStatus = stringField(order, 'status')
  let status = stringField(data, 'status')
  if (orderStatus === 'paid' && status !== 'completed' && status !== 'paid') status = 'paid'
  return {
    id,
    status,
    productId,
    metadata: metadataOf(data),
  }
}

export function creemPaymentSettled(checkout: CreemCheckout): boolean {
  return checkout.status === 'completed' || checkout.status === 'paid'
}

/**
 * 次数只认服务端商品配置。metadata 里的数字不能决定入账。
 */
export function grantFromCheckout(
  checkout: Pick<CreemCheckout, 'productId' | 'metadata'>,
): { walletId: string; credits: number } | null {
  const walletId = checkout.metadata.walletId ?? ''
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(walletId)) return null
  const pack = creditPacks().find((item) => item.priceId === checkout.productId)
  if (!pack) return null
  return { walletId, credits: pack.credits }
}

export async function createCreemCheckout(
  walletId: string,
  pack: Pick<CreditPack, 'id' | 'priceId' | 'credits'>,
): Promise<
  { ok: true; checkoutUrl: string; transactionId: string; packId: string } | { ok: false; message: string }
> {
  const apiKey = creemApiKey()
  if (!apiKey || !pack.priceId) {
    return { ok: false, message: 'Card checkout is not configured yet.' }
  }

  const payload = {
    product_id: pack.priceId,
    request_id: `${walletId}:${pack.id}:${Date.now()}`,
    success_url: `${SITE_URL}/?checkout=success`,
    metadata: {
      walletId,
      packId: pack.id,
      credits: String(pack.credits),
    },
  }

  let res: Response
  try {
    res = await fetch(`${apiBaseUrl(apiKey)}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    logger.error('creem create checkout network error', {
      message: e instanceof Error ? e.message : String(e),
    })
    return { ok: false, message: 'Cannot reach checkout. Check your network and try again.' }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('creem create checkout failed', { status: res.status, body: body.slice(0, 400) })
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }

  const json = (await res.json()) as { id?: string; checkout_url?: string; data?: { id?: string; checkout_url?: string } }
  const txnId = json.id || json.data?.id
  const hosted = (json.checkout_url || json.data?.checkout_url || '').trim()
  if (!txnId || !hosted.startsWith('https://')) {
    return { ok: false, message: 'Could not start checkout. Please try again.' }
  }

  return { ok: true, checkoutUrl: hosted, transactionId: txnId, packId: pack.id }
}

export async function getCreemCheckout(
  checkoutId: string,
): Promise<{ ok: true; checkout: CreemCheckout } | { ok: false; message: string }> {
  const apiKey = creemApiKey()
  if (!apiKey) return { ok: false, message: 'Card checkout is not configured yet.' }

  const res = await fetch(`${apiBaseUrl(apiKey)}/v1/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { 'x-api-key': apiKey },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    logger.error('creem get checkout failed', { status: res.status, body: body.slice(0, 300) })
    return { ok: false, message: 'Could not verify payment.' }
  }

  const checkout = parseCheckout(await res.json())
  if (!checkout) return { ok: false, message: 'Could not verify payment.' }
  return { ok: true, checkout }
}

function equalText(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function verifyLegacySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const computed = createHmac('sha256', secret).update(rawBody).digest('hex')
  const got = signatureHeader.trim().replace(/^sha256=/i, '')
  if (got.length !== computed.length) return false
  try {
    return timingSafeEqual(Buffer.from(got, 'hex'), Buffer.from(computed, 'hex'))
  } catch {
    return false
  }
}

/** Standard Webhooks：HMAC-SHA256(`${id}.${ts}.${body}`)，密钥是 whsec_ 后面的 base64。 */
function verifyStandardSignature(
  rawBody: string,
  id: string,
  timestamp: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return false
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - ts) > 5 * 60) return false
  const secretValue = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret
  const key = Buffer.from(secretValue, 'base64')
  if (key.length === 0) return false
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest('base64')
  for (const part of signatureHeader.split(' ')) {
    const [version, signature] = part.split(',')
    if (version === 'v1' && signature && equalText(signature, expected)) return true
  }
  return false
}

/**
 * 同时认两种签名：旧的 creem-signature（body 的 hex HMAC），
 * 和新的 webhook-id / webhook-timestamp / webhook-signature。
 */
export function verifyCreemWebhook(rawBody: string, headers: Headers): boolean {
  const secret = (process.env.CREEM_WEBHOOK_SECRET ?? '').trim()
  if (!secret) return false

  const id = headers.get('webhook-id') ?? ''
  const timestamp = headers.get('webhook-timestamp') ?? ''
  const standard = headers.get('webhook-signature') ?? ''
  if (id && timestamp && standard && verifyStandardSignature(rawBody, id, timestamp, standard, secret)) {
    return true
  }

  const legacy = headers.get('creem-signature') ?? headers.get('x-creem-signature') ?? ''
  return Boolean(legacy) && verifyLegacySignature(rawBody, legacy, secret)
}

/**
 * 生图前把即将送给模型的文案交给 Creem 审核。
 * 没配 CREEM_API_KEY 时跳过。配了就必须通过：deny、flag、接口失败都不生图。
 */
export async function screenGenerationPrompt(
  prompt: string,
  externalId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const apiKey = creemApiKey()
  if (!apiKey) return { ok: true }
  const text = prompt.trim().slice(0, 8000)
  if (!text) return { ok: true }

  try {
    const res = await fetch(`${apiBaseUrl(apiKey)}/v1/moderation/prompt`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: text, external_id: externalId }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      logger.error('creem moderation failed', { status: res.status, body: body.slice(0, 300) })
      return { ok: false, message: 'This idea could not be checked. Please try again.' }
    }
    const json = (await res.json()) as { decision?: string; data?: { decision?: string } }
    const decision = json.decision || json.data?.decision || ''
    if (decision === 'allow') return { ok: true }
    logger.info('creem moderation blocked', { decision: decision || 'missing', externalId })
    return { ok: false, message: 'This idea can’t be generated. Try a different joke.' }
  } catch (e) {
    logger.error('creem moderation network error', {
      message: e instanceof Error ? e.message : String(e),
    })
    return { ok: false, message: 'This idea could not be checked. Please try again.' }
  }
}
