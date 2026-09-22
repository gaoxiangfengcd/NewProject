import Link from 'next/link'
import { Generator } from '@/components/Generator'
import { ExampleBeforeAfter } from '@/components/ExampleBeforeAfter'
import { FaqBlock } from '@/components/FaqBlock'
import { JsonLd } from '@/components/JsonLd'
import { SEO_PAGE_MAP } from '@/lib/seo/pages'
import { breadcrumbJsonLd, faqJsonLd, webpageJsonLd } from '@/lib/seo/metadata'
import type { SeoLandingPage } from '@/lib/seo/types'

const STEPS = [
  'Upload their photo',
  'MeMeGo finds a distinctive, playful feature',
  'That feature gets exaggerated in the original scene',
  'Download and send the finished digital gift',
]

export function SeoLanding({ page }: { page: SeoLandingPage }): React.ReactElement {
  const related = page.related
    .map((slug) => SEO_PAGE_MAP[slug])
    .filter(Boolean)

  return (
    <article>
      <JsonLd
        data={[
          webpageJsonLd(page),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.eyebrow, path: `/${page.slug}` },
          ]),
          faqJsonLd(page.faqs),
        ]}
      />

      <header className="mx-auto max-w-3xl px-4 pb-6 pt-8 text-center sm:px-6 sm:pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center justify-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">{page.eyebrow}</li>
          </ol>
        </nav>
        <p className="eyebrow mt-4">{page.eyebrow}</p>
        <h1 className="mt-2 font-display text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-[2.6rem]">
          {page.h1}
        </h1>
        <div className="mx-auto mt-4 max-w-xl space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {page.intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <a href="#make-a-gift" className="btn-primary">
            Make a Gift
          </a>
          <a href="#examples" className="btn-secondary">
            Explore Examples
          </a>
        </div>
      </header>

      <section id="examples" className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-10 sm:px-6">
        <ExampleBeforeAfter caption={page.heroAlt} />
      </section>

      <section id="make-a-gift" className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-14 sm:px-6">
        <h2 className="mb-5 text-center font-display text-2xl font-bold">Make a Gift</h2>
        <Generator />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Why this gift is different</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {page.whyDifferent.map((item) => (
            <li key={item} className="rounded-2xl border border-border bg-paper px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step} className="card p-4">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Step {i + 1}
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Who it is for</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{page.whoFor}</p>
        <h3 className="mt-6 font-display text-lg font-bold">When to give it</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{page.whenToGive}</p>
        <h3 className="mt-6 font-display text-lg font-bold">What kind of photo works best</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{page.photoTips}</p>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <FaqBlock items={page.faqs} />
      </div>

      {related.length > 0 ? (
        <nav aria-label="Related gift pages" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 className="font-display text-lg font-bold">Related gift ideas</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`} className="chip chip-idle">
                  {item.eyebrow}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  )
}
