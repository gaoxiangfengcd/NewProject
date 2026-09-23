import type { Metadata } from 'next'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms for using ${SITE_NAME}.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage(): React.ReactElement {
  return (
    <article className="prose-app mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <h2>The service</h2>
      <p>
        {SITE_NAME} uses a photo only as a reference to draw a cartoon character. The result is an
        illustrated cartoon you can download and send as a gift. You get one free watermarked
        preview per day on a lighter, milder model. Paid unlocks use a stronger HD model. Unused
        paid generations are stored on your wallet and do not expire.
      </p>

      <h2>Cartoon characters only</h2>
      <p>
        {SITE_NAME} does not change, swap, or replace a real person&apos;s face. It does not make
        realistic edits of a photograph, and it is not a face-swap or deepfake tool. The picture
        you get is a cartoon character. Do not present that cartoon as a real photo of someone, and
        do not use it to impersonate them.
      </p>

      <h2>Paid unlocks</h2>
      <p>
        HD purchases are processed by Creem, who is the Merchant of Record. We never see your full
        card number. Each pack adds a set number of HD generations to your wallet (stored in our
        credits ledger). Remaining generations never expire. Unused HD credits may be refunded by
        emailing us with your Creem order ID.
      </p>

      <h2>Your content</h2>
      <ul>
        <li>You may only upload photos you have the right to use.</li>
        <li>Do not upload illegal, sexual, abusive or otherwise harmful content.</li>
        <li>
          You are responsible for the cartoons you create and how you share them. Don&apos;t use{' '}
          {SITE_NAME} to harass, defame or deceive anyone.
        </li>
        <li>Generated results may be imperfect. AI output can occasionally look wrong.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Automated abuse, attempts to overwhelm the service, or generation of content targeting
        minors is prohibited. Do not use {SITE_NAME} to create nude or sexually explicit images, or
        to change a real face. Rate limits are applied to keep the service free for everyone.
      </p>

      <h2>Availability</h2>
      <p>
        We may change or discontinue features at any time. Uploaded photos and generated images are
        automatically deleted after the retention period described in the Privacy Policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </article>
  )
}
