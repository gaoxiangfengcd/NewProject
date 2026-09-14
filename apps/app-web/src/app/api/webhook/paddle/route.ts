import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { verifyWebhookSignature } from '@/lib/paddle'
import { addPaidCredits, removePaidCredits } from '@/lib/quota'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Paddle webhook 处理的事件白名单
// transaction.completed → 加点数（一次性支付完成）
// adjustment.created / adjustment.updated → 退款审批状态变更
//   - status=approved 且 action=refund → 扣减对应点数
//   - 其他状态（pending_approval / rejected）→ 仅落库，不扣点数
// 其他事件一律忽略（返回 200），但仍落库供排查
const HANDLED_EVENTS = new Set([
  'transaction.completed',
  'adjustment.created',
  'adjustment.updated',
])

interface PaddlePayload {
  event_id?: string          // Paddle v2: event 唯一 ID，幂等键
  event_name?: string
  data?: {
    id?: string              // transaction.id 或 adjustment.id
    // === transaction 字段 ===
    custom_data?: Record<string, unknown> | null  // Paddle.js customData → webhook 里是 data.custom_data
    passthrough?: string     // 服务端创建 transaction 时的 passthrough（兼容旧逻辑）
    customer_id?: string
    subscription_id?: string
    // === adjustment 字段 ===
    transaction_id?: string  // adjustment 关联的 transaction ID
    action?: string          // refund | credit | chargeback
    type?: string            // full | partial
    status?: string          // pending_approval | approved | rejected
    reason?: string         // 退款原因
    amount?: string         // 退款金额（最小货币单位，cents）
    currency_code?: string
    items?: { item_id: string; amount?: string }[]
  }
}

/**
 * Paddle Billing v2 webhook 入口。
 *
 * URL：`POST /api/webhook/paddle`
 * Header：`Paddle-Signature: ts=...;h1=...`
 *
 * 幂等：PaddleEvent.eventId 唯一索引保证同一个 event 只会处理一次。
 * 即使 Paddle 网络抖动重试 10 次，用户也只会被加/扣一次 credits。
 *
 * 配置位置：Paddle Dashboard → Settings → Billing → Webhook
 *   - URL: https://<your-domain>/api/webhook/paddle
 *   - Events: transaction.completed, adjustment.created, adjustment.updated
 *   - 创建后把 Webhook Secret 写到 PADDLE_WEBHOOK_SECRET
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 原始 body 必须保留给签名校验
  const rawBody = await req.text()

  // 兼容 header 大小写（Paddle 发小写 paddle-signature，但有些代理会标准化）
  const signatureHeader =
    req.headers.get('paddle-signature')
    ?? req.headers.get('Paddle-Signature')
    ?? ''

  // —— 签名校验 ——
  const sigRes = verifyWebhookSignature(rawBody, signatureHeader)
  if (!sigRes.ok) {
    console.warn('[paddle-webhook] sig verify failed:', sigRes.error.message)
    return NextResponse.json(
      { error: { code: sigRes.error.code, message: sigRes.error.message } },
      { status: sigRes.error.status },
    )
  }
  if (!sigRes.value.valid) {
    console.warn('[paddle-webhook] bad signature header:', signatureHeader.slice(0, 30))
    return NextResponse.json(
      { error: { code: 'BAD_SIGNATURE', message: 'HMAC mismatch' } },
      { status: 401 },
    )
  }

  // —— 解析 payload ——
  let body: PaddlePayload
  try {
    body = JSON.parse(rawBody) as PaddlePayload
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const eventId = body.event_id
  const eventName = body.event_name ?? ''
  const txId = body.data?.id ?? null

  if (!eventId) {
    return NextResponse.json({ error: 'missing event_id' }, { status: 400 })
  }

  // —— 幂等检查：已经处理过这个 event 就直接 200 返回 ——
  const existing = await prisma.paddleEvent.findUnique({ where: { eventId } })
  if (existing) {
    console.info('[paddle-webhook] duplicate event, skip:', eventId, eventName)
    return NextResponse.json({
      received: true,
      handled: false,
      skipped: true,
      transactionId: txId,
    })
  }

  // —— 非白名单事件：落库 + 返回 200，不做业务处理 ——
  if (!HANDLED_EVENTS.has(eventName)) {
    await prisma.paddleEvent.create({
      data: {
        eventId,
        eventName,
        transactionId: txId,
        payload: rawBody,
        success: true,
        error: null,
      },
    })
    return NextResponse.json({
      received: true,
      handled: false,
      reason: 'event not in handler list',
      eventName,
    })
  }

  // —— 路由到对应处理器 ——
  if (eventName === 'transaction.completed') {
    return handleTransactionCompleted(eventId, eventName, txId, body, rawBody)
  }
  if (eventName === 'adjustment.created' || eventName === 'adjustment.updated') {
    return handleAdjustmentEvent(eventId, eventName, body, rawBody)
  }
  // 不该到这，前面白名单已过滤
  return NextResponse.json({ received: true, handled: false })
}

// ===== transaction.completed 处理 =====
async function handleTransactionCompleted(
  eventId: string,
  eventName: string,
  txId: string | null,
  body: PaddlePayload,
  rawBody: string,
): Promise<NextResponse> {
  let userId: string | null = null
  let credits: number | null = null
  let errorMessage: string | null = null

  try {
    const customData = body.data?.custom_data
    const passthrough = body.data?.passthrough

    let parsed: { userId?: string; credits?: number } | null = null

    if (customData && typeof customData === 'object') {
      parsed = customData as { userId?: string; credits?: number }
    } else if (passthrough) {
      parsed = JSON.parse(passthrough) as { userId?: string; credits?: number }
    }

    if (!parsed) {
      throw new Error('missing custom_data / passthrough in transaction.completed')
    }

    userId = parsed.userId ?? null
    credits = Number(parsed.credits) || null

    if (!userId) throw new Error('missing userId in custom_data')
    if (!credits || credits < 1) throw new Error('invalid credits in custom_data')

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error(`user not found: ${userId}`)

    const addRes = await addPaidCredits(userId, credits)
    if (!addRes.ok) {
      throw new Error(`addPaidCredits failed: ${addRes.error.message}`)
    }

    await prisma.paddleEvent.create({
      data: {
        eventId,
        eventName,
        transactionId: txId,
        userId,
        credits,
        payload: rawBody,
        success: true,
        error: null,
      },
    })
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e)
    try {
      await prisma.paddleEvent.create({
        data: {
          eventId,
          eventName,
          transactionId: txId,
          userId,
          credits,
          payload: rawBody,
          success: false,
          error: errorMessage.slice(0, 500),
        },
      })
    } catch {
      // 并发冲突，忽略
    }
    console.error('[paddle-webhook] transaction.completed error:', errorMessage)
    return NextResponse.json({
      received: true,
      handled: false,
      error: errorMessage,
    })
  }

  return NextResponse.json({
    received: true,
    handled: true,
    transactionId: txId,
    userId,
    credits,
  })
}

// ===== adjustment.created / adjustment.updated 处理 =====
// 只在 action=refund 且 status=approved 时扣点数
// 其他状态（pending_approval / rejected）只落库
async function handleAdjustmentEvent(
  eventId: string,
  eventName: string,
  body: PaddlePayload,
  rawBody: string,
): Promise<NextResponse> {
  const adjustmentId = body.data?.id ?? null
  const txnId = body.data?.transaction_id ?? null
  const action = body.data?.action ?? null
  const adjStatus = body.data?.status ?? null
  const reason = body.data?.reason ?? null
  const amountStr = body.data?.amount ?? null
  const refundAmount = amountStr ? Number(amountStr) : null

  let userId: string | null = null
  let credits: number | null = null
  let errorMessage: string | null = null

  try {
    // 从关联的 transaction 上找 userId + credits
    // adjustment webhook 的 data 里不含 custom_data，需要查 transaction 或本地 PaddleEvent
    const originalEvent = await prisma.paddleEvent.findFirst({
      where: { transactionId: txnId, eventName: 'transaction.completed', success: true },
      select: { userId: true, credits: true },
    })
    if (originalEvent) {
      userId = originalEvent.userId
      credits = originalEvent.credits
    }

    // 只有退款审批通过 + action=refund 才扣点数
    const shouldDeduct = action === 'refund' && adjStatus === 'approved'

    if (shouldDeduct) {
      if (!userId) {
        throw new Error(`cannot find userId for refund: txn=${txnId}`)
      }
      if (!credits || credits < 1) {
        throw new Error(`cannot find credits to deduct for txn=${txnId}`)
      }
      const rmRes = await removePaidCredits(userId, credits)
      if (!rmRes.ok) {
        throw new Error(`removePaidCredits failed: ${rmRes.error.message}`)
      }
    }

    // 落库审计（退款时 credits 存负数表示扣减）
    await prisma.paddleEvent.create({
      data: {
        eventId,
        eventName,
        transactionId: txnId,
        adjustmentId,
        userId,
        credits: shouldDeduct ? -(credits ?? 0) : null,
        refundAmount: Number.isFinite(refundAmount) ? refundAmount : null,
        refundReason: reason,
        eventType: action,
        payload: rawBody,
        success: true,
        error: null,
      },
    })

    return NextResponse.json({
      received: true,
      handled: shouldDeduct,
      eventName,
      adjustmentId,
      transactionId: txnId,
      action,
      status: adjStatus,
      userId,
      creditsDeducted: shouldDeduct ? credits : 0,
    })
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e)
    try {
      await prisma.paddleEvent.create({
        data: {
          eventId,
          eventName,
          transactionId: txnId,
          adjustmentId,
          userId,
          refundAmount: Number.isFinite(refundAmount) ? refundAmount : null,
          refundReason: reason,
          eventType: action,
          payload: rawBody,
          success: false,
          error: errorMessage.slice(0, 500),
        },
      })
    } catch {
      // 并发冲突，忽略
    }
    console.error('[paddle-webhook] adjustment event error:', errorMessage)
    return NextResponse.json({
      received: true,
      handled: false,
      error: errorMessage,
    })
  }
}

// Paddle 在 Dashboard 里做 webhook URL 测试时发 GET，返回 200 + 标识
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'haircut-ai-paddle-webhook',
    ready: true,
    signatureHeader: 'Paddle-Signature: ts=<timestamp>;h1=<hmac-sha256-hex>',
    eventsAccepted: Array.from(HANDLED_EVENTS),
    env: process.env.NODE_ENV ?? 'development',
  })
}
