export type GenerationTier = 'free' | 'paid'

export const WALLET_COOKIE = 'memego_wid'
export const DEV_CREDITS_COOKIE = 'memego_pc'

export const FREE_PER_DAY = Math.max(1, Number(process.env.FREE_GENERATIONS_PER_DAY ?? '1') || 1)
export const PAID_PRICE_CENTS = Math.max(1, Number(process.env.PAID_PRICE_CENTS ?? '299') || 299)
export const CREDITS_PER_PURCHASE = Math.max(
  1,
  Number(process.env.PAID_CREDITS_PER_PURCHASE ?? '1') || 1,
)

export function paidPriceLabel(): string {
  const cents = PAID_PRICE_CENTS
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

export function isLiveImageGen(): boolean {
  const explicit = (process.env.IMAGE_GEN_PROVIDER ?? '').trim().toLowerCase()
  if (explicit === 'mock') return false
  if (explicit === 'replicate') return true
  return Boolean((process.env.REPLICATE_API_TOKEN ?? '').trim())
}

export function isDevCreditGrantEnabled(): boolean {
  if (process.env.ALLOW_DEV_CREDIT_GRANT === '1') return true
  return process.env.NODE_ENV !== 'production'
}

export function isCheckoutEnabled(): boolean {
  return Boolean(
    (process.env.PADDLE_API_KEY ?? '').trim() &&
      ((process.env.PADDLE_PRICE_ID ?? '').trim() || (process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? '').trim()),
  )
}

/** 免费档 / 付费档模型。只配了 REPLICATE_IMAGE_MODEL 时两档共用，仍会走不同后处理。 */
export function modelForTier(tier: GenerationTier): string {
  const shared = (process.env.REPLICATE_IMAGE_MODEL ?? '').trim()
  if (tier === 'paid') {
    return (
      (process.env.REPLICATE_IMAGE_MODEL_PAID ?? '').trim() ||
      shared ||
      'black-forest-labs/flux-kontext-pro'
    )
  }
  return (
    (process.env.REPLICATE_IMAGE_MODEL_FREE ?? '').trim() ||
    shared ||
    'black-forest-labs/flux-kontext-dev'
  )
}

export interface QuotaSnapshot {
  freeRemaining: number
  freeLimit: number
  paidCredits: number
  checkoutEnabled: boolean
  devGrantEnabled: boolean
  priceLabel: string
  creditsPerPurchase: number
}
