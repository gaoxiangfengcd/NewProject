import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Haircut AI',
  description: 'How Haircut AI collects, uses, and protects your personal data.',
}

const LAST_UPDATED = '9 September 2026'

export default function PrivacyPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-2">Legal</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Who We Are</h2>
          <p className="mt-3 text-muted-foreground">
            Haircut AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides an AI-powered hairstyle try-on
            service that lets you visualize different hairstyles on your own photo before you cut
            your hair. For any privacy questions, email{' '}
            <a
              href="mailto:gaoxiangfengcd@gmail.com"
              className="text-accent underline underline-offset-2"
            >
              gaoxiangfengcd@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">2. Data We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Account data:</strong> email address and hashed
              password when you register.
            </li>
            <li>
              <strong className="text-foreground">Photos:</strong> the selfie/reference images you
              upload to generate hairstyles. Photos and generation results are{' '}
              <strong className="text-foreground">automatically deleted after 7 days</strong> to
              control storage costs.
            </li>
            <li>
              <strong className="text-foreground">Usage data:</strong> number of generations,
              credit balance, and free-tier usage counts.
            </li>
            <li>
              <strong className="text-foreground">Technical data:</strong> IP address and browser
              type for security and abuse prevention.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">3. Payment Data &amp; Paddle</h2>
          <p className="mt-3 text-muted-foreground">
            We use <strong className="text-foreground">Paddle</strong> as our Merchant of Record for
            all payments. When you buy credits, Paddle processes your payment directly — we{' '}
            <strong className="text-foreground">never see or store your card details</strong>.
            Paddle may share your name, email, and transaction metadata with us so we can credit
            your account. Paddle&apos;s own{' '}
            <a
              href="https://www.paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              Privacy Policy
            </a>{' '}
            governs the payment data they process.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">4. How We Use Your Data</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>To provide AI hairstyle generation on your uploaded photos.</li>
            <li>To manage your account, credit balance, and usage limits.</li>
            <li>To process and fulfill credit purchases via Paddle.</li>
            <li>To prevent fraud, abuse, and violations of our Terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">5. Data Retention</h2>
          <p className="mt-3 text-muted-foreground">
            Uploaded photos and AI generation results are <strong className="text-foreground">deleted after 7 days</strong>.
            We keep your account data (email, credit history) for as long as your account is active.
            You may request full deletion of your account at any time by emailing us — we will
            cascade-delete your data across auth, storage, and tracking within 30 days (GDPR
            compliant).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">6. Your Rights (GDPR / CCPA)</h2>
          <p className="mt-3 text-muted-foreground">
            If you reside in the EU/EEA, UK, or California, you have the right to:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to processing and request portability.</li>
            <li>Withdraw consent at any time.</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            To exercise these rights, email{' '}
            <a
              href="mailto:gaoxiangfengcd@gmail.com"
              className="text-accent underline underline-offset-2"
            >
              gaoxiangfengcd@gmail.com
            </a>
            . We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">7. Cookies</h2>
          <p className="mt-3 text-muted-foreground">
            We use only essential cookies for authentication (session token). We do not use
            third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">8. Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Questions about this policy? Email{' '}
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
