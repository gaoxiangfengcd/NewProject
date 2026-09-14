import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { refundTransaction, getTransaction } from '@/lib/paddle'

export const runtime = 'nodejs'

/**
 * 管理员触发退款接口。
 *
 * POST /api/refund
 * { transactionId: string, reason: string, type: 'full' | 'partial', amountCents?: number }
 *
 * 鉴权：登录用户邮箱必须匹配 ADMIN_EMAIL 环境变量。
 *
 * 流程：
 *   1. 调 Paddle POST /adjustments 创建退款
 *   2. Paddle 审批（沙箱自动，live 需审核）
 *   3. Paddle 发 adjustment.updated webhook → 自动扣点数
 *
 * 注意：扣点数不在这里做，由 webhook 异步处理，保证幂等。
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Login required' } },
      { status: authRes.error.status },
    )
  }

  // 简单管理员鉴权：邮箱白名单
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || authRes.value.email !== adminEmail) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
      { status: 403 },
    )
  }

  let body: {
    transactionId?: string
    reason?: string
    type?: 'full' | 'partial'
    amountCents?: number
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'invalid json body' } },
      { status: 400 },
    )
  }

  if (!body.transactionId || !body.reason?.trim()) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'transactionId and reason are required' } },
      { status: 400 },
    )
  }

  if (body.type !== 'full' && body.type !== 'partial') {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'type must be full or partial' } },
      { status: 400 },
    )
  }

  // 先查交易详情返回给管理员确认
  const txRes = await getTransaction(body.transactionId)
  if (!txRes.ok) {
    return NextResponse.json(
      { error: { code: txRes.error.code, message: txRes.error.message } },
      { status: txRes.error.status },
    )
  }
  const tx = txRes.value

  // 发起退款
  const refundRes = await refundTransaction({
    txnId: body.transactionId,
    reason: body.reason,
    type: body.type,
    amountCents: body.amountCents,
  })

  if (!refundRes.ok) {
    return NextResponse.json(
      { error: { code: refundRes.error.code, message: refundRes.error.message } },
      { status: refundRes.error.status },
    )
  }

  return NextResponse.json({
    success: true,
    refund: {
      adjustmentId: refundRes.value.adjustmentId,
      status: refundRes.value.status,
      amount: refundRes.value.amount,
      currencyCode: refundRes.value.currencyCode,
    },
    transaction: {
      id: tx.id,
      status: tx.status,
      userId: tx.customData?.userId,
      credits: tx.customData?.credits,
    },
    note:
      refundRes.value.status === 'pending_approval'
        ? '退款已提交，等待 Paddle 审批后 webhook 自动扣点数'
        : '退款已批准，扣点数将由 webhook 异步处理',
  })
}

// GET：查交易详情（退款前确认）
export async function GET(req: NextRequest): Promise<NextResponse> {
  const authRes = await requireAuth(req)
  if (!authRes.ok) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Login required' } },
      { status: authRes.error.status },
    )
  }
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || authRes.value.email !== adminEmail) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
      { status: 403 },
    )
  }

  const txnId = new URL(req.url).searchParams.get('transactionId')
  if (!txnId) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'transactionId query param required' } },
      { status: 400 },
    )
  }

  const txRes = await getTransaction(txnId)
  if (!txRes.ok) {
    return NextResponse.json(
      { error: { code: txRes.error.code, message: txRes.error.message } },
      { status: txRes.error.status },
    )
  }

  return NextResponse.json({
    transaction: {
      id: txRes.value.id,
      status: txRes.value.status,
      currencyCode: txRes.value.currencyCode,
      userId: txRes.value.customData?.userId,
      credits: txRes.value.customData?.credits,
      packId: txRes.value.customData?.packId,
      total: txRes.value.details.totals.total,
      lineItems: txRes.value.lineItems,
    },
  })
}
