export type GenerationTier = 'free' | 'paid'

export const WALLET_COOKIE = 'memego_wid'
export const DEV_CREDITS_COOKIE = 'memego_pc'

/**
 * 免费预览次数/天（带水印，只用来让人先看到效果）。
 *
 * 刻意只给 1 次：免费次数是引流的，不是用来「调到满意」的 —— 那是付费额度该干的事。
 * 给多了用户会靠每天刷免费额度白嫖，礼物又是一次性需求，不会因此养成习惯。
 */
export const FREE_PER_DAY = Math.max(1, Number(process.env.FREE_GENERATIONS_PER_DAY ?? '1') || 1)
export const PAID_PRICE_CENTS = Math.max(
  1,
  Number(process.env.PAID_PRICE_CENTS ?? '1999') || 1999,
)
export const CREDITS_PER_PURCHASE = Math.max(
  1,
  Number(process.env.PAID_CREDITS_PER_PURCHASE ?? '1') || 1,
)

/** 点数有效期（天）。0 = 永不过期。购买后剩余次数一直有效。 */
export const CREDIT_TTL_DAYS = Math.max(0, Number(process.env.CREDIT_TTL_DAYS ?? '0') || 0)
export const CREDIT_TTL_MS = CREDIT_TTL_DAYS * 24 * 60 * 60 * 1000

/** 一个可购买的点数包。价格实体在 Creem，priceId 存的是商品 id。 */
export interface CreditPack {
  id: string
  credits: number
  priceCents: number
  priceId: string
  priceLabel: string
  unitLabel: string
  badge?: string
}

const PACK_ID_RE = /^[a-z0-9][a-z0-9_-]{0,23}$/

function money(cents: number): string {
  const v = cents / 100
  return Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`
}

/** 卖的是「一份礼物 = 若干次生成机会」，不是点数，文案一律用 gift 不用 credit。 */
function giftUnitLabel(cents: number, count: number): string {
  return `${money(Math.round(cents / Math.max(1, count)))} each`
}

export function currentPriceId(): string {
  return (process.env.CREEM_PRODUCT_ID ?? '').trim()
}

/**
 * 点数包配置。读 `CREEM_PACKS`，格式为
 *   id:点数:美分:product_id,id:点数:美分:product_id
 * 例如 CREEM_PACKS=single:5:1999:prod_aaa,trio:15:4499:prod_bbb,quint:25:6999:prod_ccc
 * 未配置时退化成单包（CREEM_PRODUCT_ID）。
 */
export function creditPacks(): CreditPack[] {
  const raw = (process.env.CREEM_PACKS ?? '').trim()

  if (!raw) {
    const priceId = currentPriceId()
    if (!priceId) return []
    return [
      {
        id: 'default',
        credits: CREDITS_PER_PURCHASE,
        priceCents: PAID_PRICE_CENTS,
        priceId,
        priceLabel: money(PAID_PRICE_CENTS),
        unitLabel: giftUnitLabel(PAID_PRICE_CENTS, CREDITS_PER_PURCHASE),
      },
    ]
  }

  const packs: CreditPack[] = []
  for (const chunk of raw.split(/[,;]/)) {
    const [rawId, creditsRaw, centsRaw, priceId] = chunk.split(':').map((s) => s.trim())
    const id = (rawId ?? '').toLowerCase()
    if (!PACK_ID_RE.test(id) || !priceId) continue
    const credits = Math.floor(Number(creditsRaw))
    const priceCents = Math.floor(Number(centsRaw))
    if (!Number.isFinite(credits) || credits < 1) continue
    if (!Number.isFinite(priceCents) || priceCents < 1) continue
    packs.push({
      id,
      credits,
      priceCents,
      priceId,
      priceLabel: money(priceCents),
      unitLabel: giftUnitLabel(priceCents, credits),
    })
  }
  if (packs.length === 0) return []

  packs.sort((a, b) => a.credits - b.credits)
  if (packs.length > 1) {
    let best = packs[0]
    for (const p of packs) {
      if (p.priceCents / p.credits < best.priceCents / best.credits) best = p
    }
    best.badge = 'Best value'
  }
  return packs
}

/** 取指定点数包；不传或传错时退回最小的那一档。 */
export function findPack(id?: string | null): CreditPack | null {
  const packs = creditPacks()
  if (packs.length === 0) return null
  if (!id) return packs[0]
  const wanted = id.trim().toLowerCase()
  return packs.find((p) => p.id === wanted) ?? packs[0]
}

export function paidPriceLabel(): string {
  return money(PAID_PRICE_CENTS)
}

export function isLiveImageGen(): boolean {
  const explicit = (process.env.IMAGE_GEN_PROVIDER ?? '').trim().toLowerCase()
  if (explicit === 'mock') return false
  return Boolean(
    (process.env.VOLC_ACCESS_KEY ?? '').trim() && (process.env.VOLC_SEEDREAM_ENDPOINT ?? '').trim(),
  )
}

export function isDevCreditGrantEnabled(): boolean {
  if (process.env.ALLOW_DEV_CREDIT_GRANT === '1') return true
  return process.env.NODE_ENV !== 'production'
}

export function isCheckoutEnabled(): boolean {
  if (!(process.env.CREEM_API_KEY ?? '').trim()) return false
  return creditPacks().length > 0
}

/** 免费/付费都走火山引擎 Seedream（模型 ID 见 VOLC_SEEDREAM_MODEL）。 */
export function modelForTier(tier: GenerationTier): string {
  void tier
  return (process.env.VOLC_SEEDREAM_MODEL ?? '').trim() || 'doubao-seedream-4-0-250828'
}

export interface QuotaSnapshot {
  freeRemaining: number
  freeLimit: number
  paidCredits: number
  checkoutEnabled: boolean
  devGrantEnabled: boolean
  priceLabel: string
  creditsPerPurchase: number
  /** 可购买的点数包（按点数升序，已标好 Best value）。 */
  packs: CreditPack[]
  /** 点数有效期天数，0 = 永不过期。 */
  creditTtlDays: number
}
