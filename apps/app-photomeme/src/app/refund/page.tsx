import type { Metadata } from 'next'
import { CONTACT_EMAIL, RETENTION_DAYS, SITE_NAME } from '@/lib/site'
import { CREDITS_PER_PURCHASE, paidPriceLabel } from '@/lib/billing'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: `How refunds work for ${SITE_NAME} HD credits, processed by Paddle.`,
  alternates: { canonical: '/refund' },
}

export default function RefundPage(): React.ReactElement {
  return (
    <article className="prose-app mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <h2>The short version</h2>
      <p>
        Every HD purchase is {CREDITS_PER_PURCHASE === 1 ? 'one' : CREDITS_PER_PURCHASE} HD
        {CREDITS_PER_PURCHASE === 1 ? ' generation' : ' generations'} at {paidPriceLabel()}. If you
        paid and did not get what you expected, email us within <strong>14 days</strong> and we will
        make it right. Unused credits are always refundable.
      </p>

      <h2>What you can get refunded</h2>
      <ul>
        <li>
          <strong>Unused HD credits</strong> — full refund, no questions asked, within 14 days of
          purchase.
        </li>
        <li>
          <strong>Failed generations</strong> — if a paid generation errored out, timed out or
          produced nothing, the credit is automatically returned to your balance, or refunded if you
          prefer.
        </li>
        <li>
          <strong>Wrong or duplicate charges</strong> — full refund, including accidental double
          purchases.
        </li>
      </ul>

      <h2>When a refund is not available</h2>
      <p>
        Once an HD credit is spent, the image has already been generated and the compute cost has
        been paid to our AI provider. We cannot refund a credit you already used just because you
        did not like the result.
      </p>
      <p>
        {SITE_NAME} generates exaggerated, quirky versions of your photo — results vary run to run
        and that is part of the joke. Try another vibe or another photo before deciding it did not
        work.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary">
          {CONTACT_EMAIL}
        </a>{' '}
        with:
      </p>
      <ul>
        <li>the email address used at checkout, and</li>
        <li>your Paddle transaction ID (it looks like <code>txn_01h...</code> and is in your receipt).</li>
      </ul>
      <p>
        We aim to reply within 2 business days. Approved refunds are processed by{' '}
        <strong>Paddle.com</strong>, our Merchant of Record, and go back to your original payment
        method — usually within 5–10 business days, depending on your bank or card issuer.
      </p>

      <h2>Before starting a chargeback</h2>
      <p>
        Please contact us first. A chargeback freezes the transaction and slows everything down,
        while a direct refund is usually settled in a couple of days. We would rather just fix it.
      </p>

      <h2>Your statutory rights</h2>
      <p>
        Nothing in this policy limits rights you have under applicable consumer law (including EU
        and UK consumer protection rules). Where those rights give you more than what is written
        above, they apply.
      </p>

      <h2>Free previews</h2>
      <p>
        Nothing to refund here — the daily watermarked preview is free. Your uploaded photos and
        results are still deleted automatically after {RETENTION_DAYS} days, so download anything you
        want to keep within that window.
      </p>
    </article>
  )
}
