import Link from 'next/link'
import { SEO_PAGES } from '@/lib/seo/pages'

export function GiftSeoNav({
  currentSlug,
  heading = 'More gift ideas',
}: {
  currentSlug?: string
  heading?: string
}): React.ReactElement {
  const pages = SEO_PAGES.filter((page) => page.slug !== currentSlug)
  return (
    <nav aria-label={heading}>
      <h2 className="font-display text-lg font-bold">{heading}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/${page.slug}`}
              className="block rounded-2xl border border-border bg-paper px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              {page.h1}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
