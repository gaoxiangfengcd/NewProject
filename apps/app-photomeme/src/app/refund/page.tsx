import type { Metadata } from 'next'
import { CONTACT_EMAIL, RETENTION_DAYS, SITE_NAME } from '@/lib/site'
import { CREDIT_TTL_DAYS, creditPacks } from '@/lib/billing'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: `How refunds work for ${SITE_NAME} gifts, processed by Paddle.`,
  alternates: { canonical: '/refund' },
}

function ttlLabel(days: number): string {
  if (days <= 0) return ''
  if (days >= 365) {
    const years = Math.round(days / 365)
    return `${years} year${years > 1 ? 's' : ''}`
  }
  return `${days} days`
}

export default function RefundPage(): React.ReactElement {
  const packs = creditPacks()
  const ttl = ttlLabel(CREDIT_TTL_DAYS)
  const packList = packs
    .map((p) => `${p.credits} generations for ${p.priceLabel}`)
    .join(', ')

  return (
    <article className="prose-app mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <h2>The short version</h2>
      <p>
        A gift is a set number of generations{packList ? ` (${packList})` : ''}. Every generation you
        spend produces a finished piece at full resolution with no watermark, using the stronger HD
        model, and you keep all of them. The free preview uses a lighter model so you can check the
        idea before you spend anything
        {ttl
          ? `. Unused generations stay valid for ${ttl} from the date of purchase`
          : '. Unused generations never expire'}
        . Unused generations are always refundable — email us within <strong>14 days</strong>.
      </p>

      <h2>What you can get refunded</h2>
      <ul>
        <li>
          <strong>Unused generations</strong> — full refund, no questions asked, within 14 days of
          purchase.
        </li>
        <li>
          <strong>Delivered files</strong> — if an unlock errored out, timed out or gave you a
          broken or wrong-resolution file, the gift is automatically returned to your balance, or
          refunded if you prefer.
        </li>
        <li>
          <strong>Wrong or duplicate charges</strong> — full refund, including accidental double
          purchases.
        </li>
      </ul>

      <h2>When a refund is not available</h2>
      <p>
        Once a generation has been spent, the image has been made and the compute cost has been paid
        to our AI provider. We cannot refund generations you already used just because you did not
        like the result — that is exactly what the free preview is for, so you know what you are
        getting.
      </p>
      <p>
        But if something is genuinely broken — a garbled face, a corrupted file, a result that does
        not look like the person at all — that is on us. Email us and we will top you up with extra
        generations, or refund you if you would rather stop there.
      </p>
      <p>
        {SITE_NAME} generates exaggerated, quirky versions of your photo — results vary run to run
        and that is part of the charm. Pick the photo and style you like most before you spend a
        generation, because each one counts.
      </p>

      {CREDIT_TTL_DAYS > 0 && (
        <p>
          Generations that have already expired cannot be refunded. If you do not plan to use a pack
          right away, ask for a refund inside the 14-day window rather than waiting for them to
          lapse.
        </p>
      )}

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
