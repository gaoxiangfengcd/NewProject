import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
import { ExploreMenu } from '@/components/ExploreMenu'
import { JsonLd } from '@/components/JsonLd'
import { CONTACT_EMAIL, RETENTION_DAYS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import { organizationJsonLd, webAppJsonLd, websiteJsonLd } from '@/lib/seo/metadata'
import { VisitTracker } from '@/components/VisitTracker'
import { SEO_PAGES } from '@/lib/seo/pages'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Funny Personalized Digital Gifts From Photos | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `Funny Personalized Digital Gifts From Photos | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/examples/after.webp',
        width: 960,
        height: 720,
        alt: 'Funny personalized digital gift created from a photo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Funny Personalized Digital Gifts From Photos | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: ['/examples/after.webp'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blush/50 blur-[110px]" />
          <div className="absolute right-[-80px] top-[220px] h-[320px] w-[380px] rounded-full bg-accent/12 blur-[100px]" />
          <div className="absolute bottom-[-100px] left-[-60px] h-[340px] w-[420px] rounded-full bg-primary/8 blur-[110px]" />
        </div>

        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex h-[4.5rem] max-w-4xl items-center justify-between px-4 sm:h-20 sm:px-6">
            <Link href="/" className="flex items-center" aria-label={`${SITE_NAME} home`}>
              <Image
                src="/logo.webp"
                alt={`${SITE_NAME} — funny personalized digital gifts from photos`}
                width={720}
                height={730}
                priority
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:block">
                1 free preview a day
              </span>
              <ExploreMenu />
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        <footer className="border-t border-border/70 bg-paper/50">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <nav aria-label="Gift ideas" className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Gift ideas
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {SEO_PAGES.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`} className="text-muted-foreground transition hover:text-primary">
                      {page.eyebrow}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
              <p className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
                <Image
                  src="/logo.webp"
                  alt=""
                  width={560}
                  height={568}
                  className="h-10 w-auto"
                />
                <span>
                  © {new Date().getFullYear()} {SITE_NAME}. Funny personalized digital gifts from
                  photos.
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <Link href="/privacy" className="transition hover:text-primary">
                  Privacy
                </Link>
                <Link href="/terms" className="transition hover:text-primary">
                  Terms
                </Link>
                <Link href="/refund" className="transition hover:text-primary">
                  Refunds
                </Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-primary">
                  Contact us{' '}
                  <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
              Your photos stay private and are automatically deleted after {RETENTION_DAYS} days.
              {SITE_NAME} draws a cartoon character from your photo. It does not swap or change a
              real person&apos;s face.
            </p>
          </div>
        </footer>

        <VisitTracker />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(), webAppJsonLd()]} />
      </body>
    </html>
  )
}
