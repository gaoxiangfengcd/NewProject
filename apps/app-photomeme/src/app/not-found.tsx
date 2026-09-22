import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-6xl font-bold text-primary">404</h1>
      <p className="mt-2 font-display text-2xl font-bold">This gift got away</p>
      <p className="mt-2 text-muted-foreground">
        The link is wrong, or a shared gift was auto-deleted after a few days.
      </p>
      <Link href="/#generator" className="btn-primary mt-8">
        Make a Gift
      </Link>
    </div>
  )
}
