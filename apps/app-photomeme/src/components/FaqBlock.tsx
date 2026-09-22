import type { SeoFaq } from '@/lib/seo/types'

export function FaqBlock({
  items,
  heading = 'Questions',
}: {
  items: SeoFaq[]
  heading?: string
}): React.ReactElement {
  return (
    <section className="mx-auto max-w-2xl">
      <h2 className="text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
      <div className="mt-6 flex flex-col gap-2.5">
        {items.map((item) => (
          <details
            key={item.q}
            className="group card overflow-hidden px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
              {item.q}
              <span className="details-arrow group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
