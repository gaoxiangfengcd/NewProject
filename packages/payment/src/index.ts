import type { AsyncResult } from '@repo/common'

// 金额统一最小货币单位（分），避免浮点
export interface Money {
  amount: number
  currency: string
}

export interface CheckoutSession {
  id: string
  url: string
  providerPaymentId?: string
}

export interface CreateOrderOpts {
  orderId: string
  amount: Money
  customer?: { email?: string; id?: string }
  metadata?: Record<string, unknown>
  successUrl?: string
  cancelUrl?: string
  idempotencyKey?: string
}

export interface Refund {
  id: string
  paymentId: string
  amount: Money
  status: 'pending' | 'succeeded' | 'failed'
}

export interface Subscription {
  id: string
  customerId: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  currentPeriodEnd?: number
}

export interface CreateSubscriptionOpts {
  customerId: string
  priceId: string
  couponId?: string
  trialDays?: number
  metadata?: Record<string, unknown>
}

export interface CancelSubscriptionOpts {
  immediately?: boolean
  reason?: string
}

export type CallbackEvent =
  | { type: 'payment.succeeded'; orderId: string; amount: Money; provider: string; providerPaymentId: string }
  | { type: 'payment.failed'; orderId: string; reason?: string }
  | { type: 'subscription.updated'; subId: string; status: Subscription['status'] }
  | { type: 'subscription.canceled'; subId: string; reason?: string }

// Provider 抽象（每个支付渠道实现此接口）
export interface PaymentProvider {
  createOrder(opts: CreateOrderOpts): AsyncResult<CheckoutSession>
  verifyCallback(
    headers: Record<string, string>,
    rawBody: string,
  ): AsyncResult<CallbackEvent>
  refund(paymentId: string, amount?: Money): AsyncResult<Refund>
  createSubscription(opts: CreateSubscriptionOpts): AsyncResult<Subscription>
  cancelSubscription(subId: string, opts?: CancelSubscriptionOpts): AsyncResult<Subscription>
  getSubscription(subId: string): AsyncResult<Subscription>
}

// 统一入口（由 env 决定实现，未配置抛 ApiError('CONFIG_MISSING')）
export function getProvider(): PaymentProvider {
  throw new Error('Not implemented')
}

export function handleWebhook(req: {
  headers: Record<string, string>
  rawBody: string
}): AsyncResult<CallbackEvent> {
  void req
  throw new Error('Not implemented')
}
