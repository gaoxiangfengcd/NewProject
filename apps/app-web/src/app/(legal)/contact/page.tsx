'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage(): React.ReactElement {
  const [txnId, setTxnId] = useState('')
  const [reason, setReason] = useState('')

  // 生成退款申请邮件链接（mailto 带预填内容）
  const refundMailHref = `mailto:gaoxiangfengcd@gmail.com?subject=${encodeURIComponent(
    'Refund Request',
  )}&body=${encodeURIComponent(
    `Transaction ID: ${txnId || '[paste your transaction ID from the Paddle receipt email]'}\n\nReason: ${reason || '[explain why you want a refund]'}`,
  )}`

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-2">Support</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Questions, refund requests, or feedback — we&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {/* 退款申请快速入口 */}
        <div className="card border-accent/30">
          <p className="eyebrow mb-2">Request a Refund</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your transaction ID and reason, then click to send the email. We&apos;ll process
            the refund via Paddle within 1–2 business days. Unused credits are fully refundable
            within 30 days; used credits are non-refundable.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="Transaction ID (e.g. txn_01m...)"
              className="input"
            />
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for refund (optional but helpful)"
              rows={3}
              className="input resize-none"
            />
            <a href={refundMailHref} className="btn-accent inline-flex text-sm">
              Send Refund Request Email
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            See our full{' '}
            <Link href="/refund" className="text-accent underline underline-offset-2">
              Refund Policy
            </Link>
            .
          </p>
        </div>

        <div className="card">
          <p className="eyebrow mb-2">Email</p>
          <a
            href="mailto:gaoxiangfengcd@gmail.com"
            className="font-display text-xl font-semibold text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
          >
            gaoxiangfengcd@gmail.com
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            The fastest way to reach us. We respond within 1–2 business days.
          </p>
        </div>

        <div className="card">
          <p className="eyebrow mb-2">What to include</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Refund requests:</strong> include your
              transaction ID from the Paddle receipt email.
            </li>
            <li>
              <strong className="text-foreground">Bug reports:</strong> describe what happened, what
              you expected, and your browser/ device.
            </li>
            <li>
              <strong className="text-foreground">Account deletion:</strong> include the email
              registered on your account and we will process full GDPR-compliant deletion within 30
              days.
            </li>
          </ul>
        </div>

        <div className="card">
          <p className="eyebrow mb-2">Payment support</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Paddle.com is the Merchant of Record for all our orders. For payment-specific
            inquiries (charge disputes, card issues, transaction questions), contact{' '}
            <a
              href="https://paddle.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              Paddle buyer support
            </a>{' '}
            directly.
          </p>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          See also our{' '}
          <Link href="/privacy" className="text-accent underline underline-offset-2">
            Privacy Policy
          </Link>
          ,{' '}
          <Link href="/terms" className="text-accent underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
          , and{' '}
          <Link href="/refund" className="text-accent underline underline-offset-2">
            Refund Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
