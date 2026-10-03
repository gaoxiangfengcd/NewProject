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
      <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>

      <h2>The short version</h2>
      <p>
        {SITE_NAME} does not require an account. We do not ask for your name, email or password.
        Your photos are used only as a reference to draw a cartoon character. They are not used to
        swap or change a real face. Photos and cartoons are automatically deleted after{' '}
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
        sold. We do not use them for advertising.
      </p>
      <p>
        We also use Google Analytics to see which countries and links bring visitors. Google
        receives the page address, the referring site, and a rough location. It does not receive
        your photos. You can opt out with the{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          className="font-medium text-primary"
          rel="noopener noreferrer"
        >
          Google Analytics Opt-out Browser Add-on
        </a>
        .
      </p>

      <h2>Payments</h2>
      <p>
        Paid HD unlocks are processed by <strong>PayPal</strong>. PayPal receives the information
        needed to complete checkout. We store a wallet id and credit balance so your purchase can be
        applied after you return to the site. We do not store full card numbers.
      </p>

      <h2>Cookies</h2>
      <p>
        We set a small essential cookie so your free/paid generation quota and HD credits stay on
        this browser. Google Analytics may also set its own cookie to tell new visits from return
        visits. We do not use advertising cookies.
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
