import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Turn Any Photo Into an Exaggerated Meme`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Turn Any Photo Into an Exaggerated Meme`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Turn Any Photo Into an Exaggerated Meme`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {/* 背景装饰：顶部品红光晕 */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-accent/8 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[320px] w-[480px] rounded-full bg-primary/5 blur-[90px]" />
        </div>

        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-black text-primary-foreground shadow-[0_0_16px_-2px_hsl(var(--primary)/0.6)]">
                M
              </span>
              <span className="font-display text-xl font-bold tracking-tight">
                {SITE_NAME}
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <a href="#generator" className="btn-secondary text-sm">
                Try it free
              </a>
            </nav>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        <footer className="border-t border-border/60">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. Photos auto-deleted in 7 days.
            </p>
            <div className="flex items-center gap-4">
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
                Contact
              </a>
            </div>
          </div>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
