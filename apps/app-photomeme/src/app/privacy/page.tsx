import type { Metadata } from 'next'
import { CONTACT_EMAIL, RETENTION_DAYS, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles the photos you upload.`,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage(): React.ReactElement {
  return (
    <article className="prose-app mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <h2>The short version</h2>
      <p>
        {SITE_NAME} does not require an account. We do not ask for your name, email or password.
        Your photos are used only to generate your meme and are automatically deleted after{' '}
        {RETENTION_DAYS} days.
      </p>

      <h2>Photos you upload</h2>
      <ul>
        <li>Your uploaded photo and the generated image are stored so your share link works.</li>
        <li>
          Both are permanently deleted within {RETENTION_DAYS} days by an automated cleanup job.
        </li>
        <li>We never sell your images or use them to train models.</li>
        <li>
          Image generation is processed by our AI infrastructure provider (Replicate), which
          receives the image necessary to produce your result.
        </li>
      </ul>

      <h2>Share links</h2>
      <p>
        Each meme gets a share link with a random, unguessable ID. Anyone you send the link to can
        view the meme until it is deleted.
      </p>

      <h2>Analytics</h2>
      <p>
        We collect anonymous product events, such as which page you opened, the site that linked
        here, and which buttons or links you clicked. Campaign tags in the address (utm_source and
        similar) are stored the same way. These logs do not identify you personally and are not
        sold. We do not use third-party advertising cookies.
      </p>

      <h2>Payments</h2>
      <p>
        Paid HD unlocks are processed by <strong>Paddle</strong> (Paddle.com is the Merchant of
        Record). Paddle receives the information needed to complete checkout. We store a wallet id
        and credit balance so your purchase can be applied after you return to the site. We do not
        store full card numbers.
      </p>

      <h2>Cookies</h2>
      <p>
        We set a small essential cookie so your free/paid generation quota and HD credits stay on
        this browser. No advertising or third-party tracking cookies.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </article>
  )
}
