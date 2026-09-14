import type { AsyncResult } from '@repo/common'
// 计费复用 @repo/payment 抽象：getProvider() 返回 PaymentProvider。
// 也可直接用 stripe SDK（import Stripe from 'stripe'）以获取更细粒度的事件字段。
// import { getProvider as getPaymentProvider } from '@repo/payment'

export interface CreateCheckoutOpts {
  userId: string
  mode: 'payment' | 'subscription'
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreatePortalOpts {
  userId: string
  returnUrl: string
}

export interface WebhookHandled {
  event: string
  handled: boolean
}

export interface SubStatus {
  status: string
  currentPeriodEnd?: Date
}

/**
 * 创建 Stripe Checkout Session。
 * mode='payment' 为按次买点数，mode='subscription' 为订阅。
 * 内部调 stripe.checkout.sessions.create 或 @repo/payment.getProvider().createOrder。
 */
export function createCheckoutSession(opts: CreateCheckoutOpts): AsyncResult<{ url: string }> {
  void opts
  throw new Error('Not implemented')
}

/**
 * 创建 Stripe Customer Portal Session，供用户管理订阅/更换支付方式。
 */
export function createCustomerPortalSession(opts: CreatePortalOpts): AsyncResult<{ url: string }> {
  void opts
  throw new Error('Not implemented')
}

/**
 * 处理 Stripe webhook 事件。
 * 处理：
 * - checkout.session.completed → 按 mode 加付费点数或激活订阅
 * - customer.subscription.updated → 更新 Subscription.status / currentPeriodEnd
 * - customer.subscription.deleted → 置 Subscription.status=canceled
 * - invoice.paid → 续费成功，延长周期 + 重置免费额度
 * 返回 event 类型与是否被本服务处理。
 */
export function handleStripeWebhook(
  headers: Record<string, string>,
  rawBody: string,
): AsyncResult<WebhookHandled> {
  void headers
  void rawBody
  throw new Error('Not implemented')
}

/** 查询用户当前订阅状态。 */
export function getSubscriptionStatus(userId: string): AsyncResult<SubStatus> {
  void userId
  throw new Error('Not implemented')
}
