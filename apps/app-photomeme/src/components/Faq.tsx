import { RETENTION_DAYS, SITE_NAME } from '@/lib/site'

const FAQS = [
  {
    q: `Is ${SITE_NAME} free?`,
    a: `You get 1 free preview per day — low-res, with a ${SITE_NAME} watermark across the image. Generate again or try another vibe counts as a new run. Unlock HD (paid via Paddle) to get the full-quality image with no watermark.`,
  },
  {
    q: 'Do I need an account?',
    a: 'Nope. No sign-up, no password, no email. Upload a photo and get your meme in seconds.',
  },
  {
    q: 'What happens to my photos?',
    a: `Your photo and the generated image are stored only so your share link works. Everything is automatically deleted after ${RETENTION_DAYS} days. We never sell your images.`,
  },
  {
    q: 'What kind of photo works best?',
    a: 'A clear, well-lit shot of one face gives the best result — front-facing selfies work great. Group photos and heavy sunglasses make it harder for the AI to know who to exaggerate.',
  },
  {
    q: 'How long does it take?',
    a: 'Most memes are ready in 10–20 seconds. If the generator is busy it can take a bit longer, and the countdown on screen shows how long yours has been running.',
  },
  {
    q: 'Can I write my own prompt?',
    a: 'Yes. Tap a suggested twist or type anything you like into the "Add a twist" box — the wilder the better. After your first meme you can also try another vibe.',
  },
]

export function Faq(): React.ReactElement {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Questions
      </h2>

      <div className="mt-7 flex flex-col gap-2.5">
        {FAQS.map((item) => (
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
