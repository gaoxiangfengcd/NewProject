import type { AsyncResult } from '@repo/common'
import { ApiError, err, ok } from '@repo/common'
import { prisma } from '@/db/client'

/**
 * 额度校验结果。
 * - allowed: 是否允许生成
 * - remaining: 剩余可用次数（免费+付费合计；订阅为 Infinity）
 * - source: 命中的额度来源，供调用方决定扣减哪一种
 * - reason: 拒绝原因（仅 allowed=false 时）
 */
export interface QuotaCheck {
  allowed: boolean
  reason?: 'free_exhausted' | 'no_paid_credits' | 'subscription_inactive' | 'no_quota'
  remaining: number
  source?: 'free' | 'paid' | 'subscription'
}

export interface QuotaSnapshot {
  freeUsedThisMonth: number
  freeLimit: number
  paidCredits: number
  subscriptionStatus: string
}

/** 免费额度每月上限，从 env FREE_QUOTA_PER_MONTH 读取，默认 3。 */
function freeLimit(): number {
  const n = Number(process.env.FREE_QUOTA_PER_MONTH ?? '3')
  return Number.isFinite(n) && n >= 0 ? n : 3
}

/** 计算下一个自然月 1 号 0 点（用于 freeResetAt 推迟）。 */
function nextMonthStart(from: Date): Date {
  const d = new Date(from)
  d.setDate(1)
  d.setMonth(d.getMonth() + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

function toApiError(e: unknown, code: string, message: string): ApiError {
  return new ApiError(code, 500, message, {
    message: e instanceof Error ? e.message : String(e),
  })
}

/**
 * 校验用户是否有可用额度。
 * 优先级：免费额度 → 订阅有效 → 付费点数。任一可用即 allowed=true。
 * 调用前先 resetMonthlyIfDue 自动跨月重置。
 */
export async function checkQuota(userId: string): AsyncResult<QuotaCheck> {
  try {
    await resetMonthlyIfDue(userId)
    let quota = await prisma.quota.findUnique({ where: { userId } })
    // 开发阶段兼容：老用户可能没有 Quota 记录，自动补一条
    if (!quota) {
      quota = await prisma.quota.create({
        data: {
          userId,
          freeUsedThisMonth: 0,
          freeResetAt: (() => {
            const d = new Date()
            d.setMonth(d.getMonth() + 1)
            d.setDate(1)
            d.setHours(0, 0, 0, 0)
            return d
          })(),
        },
      })
    }
    const limit = freeLimit()
    if (quota.freeUsedThisMonth < limit) {
      return ok({
        allowed: true,
        remaining: limit - quota.freeUsedThisMonth,
        source: 'free',
      })
    }
    const sub = await prisma.subscription.findUnique({ where: { userId } })
    if (sub && sub.status === 'active') {
      return ok({ allowed: true, remaining: Infinity, source: 'subscription' })
    }
    if (quota.paidCredits > 0) {
      return ok({ allowed: true, remaining: quota.paidCredits, source: 'paid' })
    }
    return ok({ allowed: false, reason: 'free_exhausted', remaining: 0 })
  } catch (e) {
    return err(toApiError(e, 'QUOTA_CHECK_FAILED', 'Failed to check quota'))
  }
}

/** 消耗一次免费额度：freeUsedThisMonth++。调用前应先 checkQuota。 */
export async function consumeFreeQuota(userId: string): AsyncResult<void> {
  try {
    await prisma.quota.update({
      where: { userId },
      data: { freeUsedThisMonth: { increment: 1 } },
    })
    return ok(undefined)
  } catch (e) {
    return err(toApiError(e, 'QUOTA_CONSUME_FAILED', 'Failed to consume free quota'))
  }
}

/** 消耗一次付费点数：paidCredits--。调用前应先 checkQuota。 */
export async function consumePaidCredit(userId: string): AsyncResult<void> {
  try {
    await prisma.quota.update({
      where: { userId },
      data: { paidCredits: { decrement: 1 } },
    })
    return ok(undefined)
  } catch (e) {
    return err(toApiError(e, 'QUOTA_CONSUME_FAILED', 'Failed to consume paid credit'))
  }
}

/** 若当前已过 freeResetAt，则重置 freeUsedThisMonth=0 并把 freeResetAt 推到下月初。 */
export async function resetMonthlyIfDue(userId: string): AsyncResult<void> {
  try {
    const quota = await prisma.quota.findUnique({ where: { userId } })
    if (!quota) return ok(undefined)
    if (quota.freeResetAt > new Date()) return ok(undefined)
    await prisma.quota.update({
      where: { userId },
      data: { freeUsedThisMonth: 0, freeResetAt: nextMonthStart(new Date()) },
    })
    return ok(undefined)
  } catch (e) {
    return err(toApiError(e, 'QUOTA_RESET_FAILED', 'Failed to reset monthly quota'))
  }
}

/** 支付成功后增加付费点数。 */
export async function addPaidCredits(userId: string, n: number): AsyncResult<void> {
  try {
    await prisma.quota.update({
      where: { userId },
      data: { paidCredits: { increment: n } },
    })
    return ok(undefined)
  } catch (e) {
    return err(toApiError(e, 'QUOTA_ADD_FAILED', 'Failed to add paid credits'))
  }
}

/**
 * 退款后扣减付费点数（不允许扣成负数）。
 * n = 退款对应的点数（正数，内部会取负做 decrement）。
 */
export async function removePaidCredits(userId: string, n: number): AsyncResult<{ newBalance: number }> {
  try {
    const quota = await prisma.quota.findUnique({ where: { userId } })
    if (!quota) {
      return err(toApiError(new Error('quota not found'), 'QUOTA_NOT_FOUND', 'Quota record not found'))
    }
    // 防止扣成负数（用户可能已经消耗了部分点数）
    const newBalance = Math.max(0, quota.paidCredits - n)
    await prisma.quota.update({
      where: { userId },
      data: { paidCredits: newBalance },
    })
    return ok({ newBalance })
  } catch (e) {
    return err(toApiError(e, 'QUOTA_REMOVE_FAILED', 'Failed to remove paid credits'))
  }
}

/** 读取用户额度快照（含订阅状态），用于前端展示。 */
export async function getQuota(userId: string): AsyncResult<QuotaSnapshot> {
  try {
    const quota = await prisma.quota.findUnique({ where: { userId } })
    const sub = await prisma.subscription.findUnique({ where: { userId } })
    return ok({
      freeUsedThisMonth: quota?.freeUsedThisMonth ?? 0,
      freeLimit: freeLimit(),
      paidCredits: quota?.paidCredits ?? 0,
      subscriptionStatus: sub?.status ?? 'none',
    })
  } catch (e) {
    return err(toApiError(e, 'QUOTA_GET_FAILED', 'Failed to get quota'))
  }
}
