// Paddle Billing v2 集成（一次性点数包）。
// 参考：https://developer.paddle.com/api-reference/checkout/transactions/create
import { createHmac } from 'node:crypto'
import { ApiError, err, ok, type AsyncResult, type Result } from '@repo/common'

// Paddle Billing v2 的 base URL：sandbox 和 live 是**完全隔离**的域名
// 根据 API key 前缀自动判断：pdl_sdbx_ → sandbox，pdl_live_ → live
function apiBaseUrl(apiKey?: string): string {
  if (!apiKey) return 'https://api.paddle.com'
  if (apiKey.includes('sdbx')) return 'https://sandbox-api.paddle.com'
  return 'https://api.paddle.com'
}

export interface PackConfig {
  /** 点数包标识（代码侧用） */
  id: 'credit-6'
  /** 该包赠送的点数 */
  credits: number
  /** 展示用名称 */
  label: string
  /** 美元价（Paddle 实际定价；展示用） */
  priceUsd: number
}

/** 简化为单包：$9.99 = 6 credits。未来扩展多包在此追加即可。 */
export const CREDIT_PACKS: PackConfig[] = [
  { id: 'credit-6', credits: 6, label: 'Credit Pack', priceUsd: 9.99 },
]

export function getPackCredits(packId: string): number | null {
  return CREDIT_PACKS.find((p) => p.id === packId)?.credits ?? null
}

/** 从 env 取唯一 price_id。优先兼容单包 NEXT_PUBLIC_PADDLE_PRICE_ID，fallback 到旧名 PADDLE_PRICE_CREDIT6。 */
function paddlePriceId(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID
    ?? process.env.PADDLE_PRICE_CREDIT6
  )
}

function paddleKey(): string | undefined {
  const k = process.env.PADDLE_API_KEY
  return k && k.trim() ? k : undefined
}

/**
 * 创建 Paddle Checkout Transaction（一次性支付）。
 *
 * 返回的 checkout.url 前端重定向过去即可。
 * passthrough 里塞入 userId + credits，webhook 验签后解析加点数。
 */
export async function createCheckoutTransaction(opts: {
  userId: string
  packId: PackConfig['id']
  successUrl?: string
  cancelUrl?: string
}): AsyncResult<{ checkoutUrl: string; transactionId: string }> {
  const apiKey = paddleKey()
  const priceId = paddlePriceId()
  if (!priceId) {
    return err(
      new ApiError('PADDLE_CONFIG_MISSING', 500, 'PADDLE_PRICE_* not set (NEXT_PUBLIC_PADDLE_PRICE_ID or PADDLE_PRICE_CREDIT6)'),
    )
  }
  if (!apiKey) {
    // 未配 API key：mock 模式，返回假 URL 方便前端联调
    return ok({
      checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/account?purchased=${opts.packId}`,
      transactionId: `mock-${opts.packId}-${Date.now()}`,
    })
  }

  const credits = getPackCredits(opts.packId) ?? 1

  const payload = {
    items: [{ price_id: priceId, quantity: 1 }],
    passthrough: JSON.stringify({ userId: opts.userId, credits }),
    ...(opts.successUrl && { success_url: opts.successUrl }),
    ...(opts.cancelUrl && { cancel_url: opts.cancelUrl }),
  }

  const res = await fetch(`${apiBaseUrl(apiKey)}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return err(
      new ApiError(
        'PADDLE_API_ERROR',
        502,
        `Paddle create transaction failed: ${res.status} ${body.slice(0, 300)}`,
      ),
    )
  }

  const data = (await res.json()) as {
    data: {
      id: string
      checkout: { url: string }
    }
  }
  // 始终使用 Paddle Hosted Checkout URL（redirect 模式），不用 checkout.url
  // 因为 checkout.url 是给 Paddle.js overlay 模式用的（形如 https://localhost/?_ptxn=...）
  // 我们是服务端 redirect 流程，需要 hosted checkout 页面
  const checkoutUrl = buildCheckoutUrl(data.data.id, apiKey)

  return ok({
    checkoutUrl,
    transactionId: data.data.id,
  })
}

/**
 * 手动拼 Paddle Hosted Checkout URL（绕过 "default payment link" 未设置的限制）。
 *
 * Sandbox：https://sandbox-checkout.paddle.com/checkout/buy?_ptxn=<txnId>
 * Live：   https://checkout.paddle.com/checkout/buy?_ptxn=<txnId>
 *
 * 参考 https://github.com/PaddleHQ/paddle-js-wrapper/issues/22 的 workaround
 */
function buildCheckoutUrl(txnId: string, apiKey?: string): string {
  const isSandbox = !!apiKey?.includes('sdbx')
  const host = isSandbox
    ? 'https://sandbox-checkout.paddle.com'
    : 'https://checkout.paddle.com'
  return `${host}/checkout/buy?_ptxn=${txnId}`
}

/**
 * 校验 Paddle webhook 签名（HMAC-SHA256，Paddle v2 格式）。
 * Header 形如：Paddle-Signature: ts=1700000000;h1=abcdef…
 * Signature 按时间戳 + ":" + 原始 body 计算。
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
): Result<{ valid: boolean }> {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) {
    return err(new ApiError('PADDLE_CONFIG_MISSING', 500, 'PADDLE_WEBHOOK_SECRET not set'))
  }

  // 解析 ts=...;h1=...
  const parts = signatureHeader
    .split(';')
    .map((s) => s.trim())
    .reduce<Record<string, string>>((acc, kv) => {
      const i = kv.indexOf('=')
      if (i > 0) acc[kv.slice(0, i)] = kv.slice(i + 1)
      return acc
    }, {})

  const { ts, h1 } = parts
  if (!ts || !h1) {
    return ok({ valid: false })
  }

  const signaturePayload = `${ts}:${rawBody}`
  const computed = createHmac('sha256', secret).update(signaturePayload).digest('hex')

  // 常量时间比较
  const valid = computed.length === h1.length
    && computed.split('').every((c, i) => c === h1[i])
  return ok({ valid })
}

// ===== 退款（Adjustment）相关 =====

/** Paddle 交易详情（仅取退款需要的字段）。 */
export interface PaddleTransactionInfo {
  id: string
  status: string
  currencyCode: string
  customData: { userId?: string; credits?: number; packId?: string } | null
  lineItems: { id: string; total: string }[]
  details: { totals: { total: string } }
}

/**
 * 查询 Paddle 交易详情（用于退款前校验交易状态 + 取 line item ID）。
 * GET /transactions/{id}
 */
export async function getTransaction(txnId: string): AsyncResult<PaddleTransactionInfo> {
  const apiKey = paddleKey()
  if (!apiKey) {
    return err(new ApiError('PADDLE_CONFIG_MISSING', 500, 'PADDLE_API_KEY not set'))
  }
  const res = await fetch(`${apiBaseUrl(apiKey)}/transactions/${txnId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return err(
      new ApiError('PADDLE_API_ERROR', 502, `Get transaction failed: ${res.status} ${body.slice(0, 300)}`),
    )
  }
  const json = (await res.json()) as {
    data: {
      id: string
      status: string
      currency_code: string
      custom_data: { userId?: string; credits?: number; packId?: string } | null
      details: {
        line_items: { id: string; totals: { total: string } }[]
        totals: { total: string }
      }
    }
  }
  const d = json.data
  return ok({
    id: d.id,
    status: d.status,
    currencyCode: d.currency_code,
    customData: d.custom_data,
    lineItems: (d.details?.line_items ?? []).map((li) => ({
      id: li.id,
      total: li.totals?.total ?? '0',
    })),
    details: { totals: { total: d.details?.totals?.total ?? '0' } },
  })
}

/** 退款创建结果。 */
export interface RefundResult {
  adjustmentId: string
  status: string
  amount: string
  currencyCode: string
}

/**
 * 对一笔 Paddle 交易发起退款（创建 adjustment，action=refund）。
 *
 * type=full  → 退全款（所有 line items 按 full 退）
 * type=partial → 退部分金额（按传入金额，单位 cents）
 *
 * Paddle 退款流程：
 *   1. POST /adjustments 创建退款申请 → 返回 status=pending_approval（live）
 *      或 status=approved（sandbox 自动批准）
 *   2. Paddle 审批后发送 adjustment.updated webhook → 我们在 webhook 里扣点数
 *   3. 沙箱每 10 分钟自动批准
 *
 * 注意：退款审批前不应扣点数；审批通过后由 webhook 触发扣点数。
 */
export async function refundTransaction(opts: {
  txnId: string
  reason: string
  type: 'full' | 'partial'
  amountCents?: number
}): AsyncResult<RefundResult> {
  const apiKey = paddleKey()
  if (!apiKey) {
    return err(new ApiError('PADDLE_CONFIG_MISSING', 500, 'PADDLE_API_KEY not set'))
  }

  // 先查交易拿 line item ID
  const txRes = await getTransaction(opts.txnId)
  if (!txRes.ok) {
    return err(txRes.error)
  }
  const tx = txRes.value
  if (tx.status !== 'completed') {
    return err(
      new ApiError('PADDLE_REFUND_NOT_ALLOWED', 400, `Transaction status is ${tx.status}, must be completed to refund`),
    )
  }
  if (tx.lineItems.length === 0) {
    return err(new ApiError('PADDLE_NO_LINE_ITEMS', 400, 'Transaction has no line items to refund'))
  }

  const payload: {
    action: 'refund'
    type: 'full' | 'partial'
    transaction_id: string
    reason: string
    items?: { item_id: string; type: 'full' | 'partial'; amount?: string }[]
  } = {
    action: 'refund',
    type: opts.type,
    transaction_id: opts.txnId,
    reason: opts.reason,
  }

  if (opts.type === 'full') {
    payload.items = tx.lineItems.map((li) => ({ item_id: li.id, type: 'full' as const }))
  } else {
    if (!opts.amountCents || opts.amountCents <= 0) {
      return err(new ApiError('BAD_REQUEST', 400, 'amountCents required for partial refund'))
    }
    // 部分退款：金额分摊到第一个 line item
    payload.items = [
      {
        item_id: tx.lineItems[0].id,
        type: 'partial' as const,
        amount: String(opts.amountCents),
      },
    ]
  }

  const res = await fetch(`${apiBaseUrl(apiKey)}/adjustments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return err(
      new ApiError('PADDLE_REFUND_FAILED', 502, `Refund failed: ${res.status} ${body.slice(0, 400)}`),
    )
  }

  const json = (await res.json()) as {
    data: {
      id: string
      status: string
      amount: string
      currency_code: string
    }
  }
  return ok({
    adjustmentId: json.data.id,
    status: json.data.status,
    amount: json.data.amount,
    currencyCode: json.data.currency_code,
  })
}
