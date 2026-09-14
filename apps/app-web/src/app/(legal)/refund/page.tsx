import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy — Haircut AI',
  description: 'Refund terms for credit purchases on Haircut AI.',
}

const LAST_UPDATED = '9 September 2026'

export default function RefundPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Overview</h2>
          <p className="mt-3 text-muted-foreground">
            Haircut AI sells consumable AI generation credits. Because credits are consumed in real
            time when you generate hairstyles, our refund policy distinguishes between{' '}
            <strong className="text-foreground">unused</strong> and{' '}
            <strong className="text-foreground">used</strong> credits.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-accent-soft/40 p-5">
          <h2 className="font-display text-xl font-semibold">2. Merchant of Record</h2>
          <p className="mt-3 text-muted-foreground">
            Paddle.com is the Merchant of Record for all our orders. Paddle handles all customer
            service inquiries and returns. Refund requests are processed by Paddle in accordance
            with their{' '}
            <a
              href="https://www.paddle.com/legal/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              Refund Policy
            </a>{' '}
            and applicable local consumer protection laws.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">3. Unused Credits — 30-Day Guarantee</h2>
          <p className="mt-3 text-muted-foreground">
            If you have purchased credits that remain <strong className="text-foreground">unused</strong>{' '}
            (not yet consumed by AI generation), you may request a full refund within{' '}
            <strong className="text-foreground">30 days</strong> of the purchase date. Email{' '}
            <a
              href="mailto:gaoxiangfengcd@gmail.com"
              className="text-accent underline underline-offset-2"
            >
              gaoxiangfengcd@gmail.com
            </a>{' '}
            with your transaction ID and we will arrange the refund via Paddle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">4. Used Credits — Non-Refundable</h2>
          <p className="mt-3 text-muted-foreground">
            Credits that have <strong className="text-foreground">already been consumed</strong>{' '}
            (used to generate hairstyle images) are <strong className="text-foreground">non-refundable</strong>,
            as the AI generation service has been delivered and cannot be reversed. This applies
            even within the 30-day window.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">5. Statutory Rights</h2>
          <p className="mt-3 text-muted-foreground">
            Nothing in this policy affects your mandatory consumer rights under local law. If the
            Service is not as described, faulty, or not fit for purpose, you may be entitled to a
            refund regardless of the above. For EU/EEA/UK consumers, the 14-day statutory
            withdrawal right applies to unused digital content.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">6. How to Request a Refund</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>
              Email{' '}
              <a
                href="mailto:gaoxiangfengcd@gmail.com"
                className="text-accent underline underline-offset-2"
              >
                gaoxiangfengcd@gmail.com
              </a>{' '}
              with the subject &ldquo;Refund Request&rdquo;.
            </li>
            <li>Include your transaction ID (found in your Paddle receipt email).</li>
            <li>State the reason for the refund.</li>
            <li>
              We will verify your unused credit balance and forward the refund to Paddle for
              processing within 5 business days.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">7. Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Questions about refunds? Email{' '}
            <a
              href="mailto:gaoxiangfengcd@gmail.com"
              className="text-accent underline underline-offset-2"
            >
              gaoxiangfengcd@gmail.com
            </a>{' '}
            or visit our <Link href="/contact" className="text-accent underline underline-offset-2">contact page</Link>.
            For payment-specific inquiries, you may also contact{' '}
            <a
              href="https://paddle.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              Paddle buyer support
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
