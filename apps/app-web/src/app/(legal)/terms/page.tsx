import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Haircut AI',
  description: 'Terms governing your use of Haircut AI and the purchase of AI hairstyle credits.',
}

const LAST_UPDATED = '9 September 2026'

export default function TermsPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Agreement</h2>
          <p className="mt-3 text-muted-foreground">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the Haircut AI
            website and service (the &ldquo;Service&rdquo;) operated by Haircut AI
            (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the Service, you
            agree to these Terms. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">2. The Service</h2>
          <p className="mt-3 text-muted-foreground">
            Haircut AI is an AI-powered hairstyle try-on tool. You upload a photo, and we use AI to
            generate realistic previews of different hairstyles on your image. The Service operates
            on a credit model: you receive a limited number of free generations per month, and may
            purchase additional paid credits.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">3. Credits &amp; Purchases</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Each AI generation consumes one (1) credit.</li>
            <li>Free monthly credits reset at the end of each calendar month and do not roll over.</li>
            <li>Paid credits do not expire unless your account is deleted.</li>
            <li>Purchased credits are non-transferable to other accounts.</li>
          </ul>
        </section>

        {/* Paddle Merchant of Record — required by Paddle Seller Handbook */}
        <section className="rounded-2xl border border-border bg-accent-soft/40 p-5">
          <h2 className="font-display text-xl font-semibold">4. Payment &amp; Merchant of Record</h2>
          <p className="mt-3 text-muted-foreground">
            Our order process is conducted by our online reseller Paddle.com. Paddle.com is the
            Merchant of Record for all our orders. Paddle provides all customer service inquiries
            and handles returns.
          </p>
          <p className="mt-3 text-muted-foreground">
            By purchasing credits, you agree to the{' '}
            <a
              href="https://www.paddle.com/legal/buyer-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              Paddle Buyer Terms &amp; Conditions
            </a>{' '}
            and our{' '}
            <Link href="/refund" className="text-accent underline underline-offset-2">
              Refund Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">5. User Responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>You must be at least 13 years old to use the Service.</li>
            <li>You may only upload photos of yourself or photos you have permission to use.</li>
            <li>
              You agree not to use the Service to generate misleading, defamatory, or
              non-consensual images of others.
            </li>
            <li>You may not resell, redistribute, or scrape the Service or its outputs.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">6. Photos &amp; Data Deletion</h2>
          <p className="mt-3 text-muted-foreground">
            Uploaded photos and AI generation results are{' '}
            <strong className="text-foreground">automatically deleted after 7 days</strong>. We do
            not retain historical photos or generation records beyond this window. See our{' '}
            <Link href="/privacy" className="text-accent underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">7. Intellectual Property</h2>
          <p className="mt-3 text-muted-foreground">
            You retain ownership of the photos you upload. Generated hairstyle images may be used
            for personal, non-commercial purposes. The Service, its design, and underlying
            technology remain the property of Haircut AI.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">8. Limitation of Liability</h2>
          <p className="mt-3 text-muted-foreground">
            The Service is provided &ldquo;as is&rdquo; without warranty of any kind. AI-generated
            results are for entertainment and preview purposes only — we are not liable for
            hairstyle decisions made based on generated images. We are not liable for indirect,
            incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">9. Changes to These Terms</h2>
          <p className="mt-3 text-muted-foreground">
            We may update these Terms from time to time. Material changes will be notified via
            email or on the Service. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">10. Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Questions about these Terms? Email{' '}
            <a
              href="mailto:gaoxiangfengcd@gmail.com"
              className="text-accent underline underline-offset-2"
            >
              gaoxiangfengcd@gmail.com
            </a>{' '}
            or visit our <Link href="/contact" className="text-accent underline underline-offset-2">contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
