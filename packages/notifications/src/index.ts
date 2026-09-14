import type { AsyncResult } from '@repo/common'

export interface SendResult {
  messageId: string
}

export interface SendEmailOpts {
  to: string
  template: string // 模板名，见下方 EmailTemplate['name']
  vars: Record<string, unknown>
  from?: string
  subject?: string // 不传则用模板自带 subject
}

export interface SendSmsOpts {
  to: string
  template: string
  vars: Record<string, unknown>
  from?: string
}

export interface NotificationProvider {
  sendEmail(opts: SendEmailOpts): AsyncResult<SendResult>
  sendSms?(opts: SendSmsOpts): AsyncResult<SendResult>
}

// 模板系统（React Email，编译后缓存）
export interface EmailTemplate<P = Record<string, unknown>> {
  name: string
  render(props: P): { html: string; text: string }
  subject(props: P): string
}

// 预置模板名常量
export const TEMPLATE_NAMES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  PAYMENT_RECEIPT: 'payment-receipt',
  SUBSCRIPTION_RENEWED: 'subscription-renewed',
  DSR_ACKNOWLEDGEMENT: 'dsr-acknowledgement',
  DELETION_CONFIRMATION: 'deletion-confirmation',
} as const

export function renderTemplate<P>(
  template: EmailTemplate<P>,
  props: P,
): { html: string; text: string; subject: string } {
  void template
  void props
  throw new Error('Not implemented')
}

export function getProvider(): NotificationProvider {
  throw new Error('Not implemented')
}

// 便捷函数（封装常用邮件）
export function sendWelcomeEmail(
  to: string,
  vars: { name: string },
): AsyncResult<SendResult> {
  void to
  void vars
  throw new Error('Not implemented')
}

export function sendPasswordResetEmail(
  to: string,
  vars: { resetUrl: string; expiresInMin: number },
): AsyncResult<SendResult> {
  void to
  void vars
  throw new Error('Not implemented')
}

export function sendPaymentReceiptEmail(
  to: string,
  vars: { orderId: string; amount: number; currency: string; receiptUrl?: string },
): AsyncResult<SendResult> {
  void to
  void vars
  throw new Error('Not implemented')
}

export function sendDeletionConfirmationEmail(
  to: string,
  vars: { userName?: string },
): AsyncResult<SendResult> {
  void to
  void vars
  throw new Error('Not implemented')
}
