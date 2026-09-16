import { Generator } from '@/components/Generator'
import { Faq } from '@/components/Faq'
import { HowItWorks } from '@/components/HowItWorks'
import { StyleShowcase } from '@/components/StyleShowcase'
import { RETENTION_DAYS } from '@/lib/site'

const STATS = [
  { value: '~20s', label: 'From upload to meme', tone: 'text-primary' },
  { value: '1 free', label: 'Watermarked preview each day', tone: 'text-accent' },
  { value: 'HD', label: 'Pay to unlock the clean image', tone: 'text-primary' },
]

const TRUST_POINTS = ['1 free preview / day', 'HD unlock, no watermark', `Auto-deleted in ${RETENTION_DAYS} days`]

export default function HomePage(): React.ReactElement {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-6 pt-14 text-center sm:px-6 sm:pt-20">
        <span className="eyebrow">AI photo exaggerator</span>
        <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Turn any photo into a{' '}
          <span className="text-gradient">ridiculous meme</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
          Upload a selfie for one free watermarked preview. Unlock HD when you want the clean image.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a href="#generator" className="btn-primary animate-glow px-10 text-lg">
            Make my meme
          </a>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TRUST_POINTS.map((point) => (
              <span key={point} className="trust-pill">
                <svg
                  className="h-3.5 w-3.5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {point}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-8 sm:px-6">
        <Generator />
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-secondary p-6">
              <p className={`font-display text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />

      <StyleShowcase />

      <Faq />

      {/* Bottom CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Someone in your camera roll{' '}
          <span className="text-accent-highlight">deserves this</span>.
        </h2>
        <a href="#generator" className="btn-primary mt-6 px-10 text-lg">
          Start exaggerating
        </a>
      </section>
    </div>
  )
}
