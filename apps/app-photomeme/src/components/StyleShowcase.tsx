'use client'

import { EXAGGERATION_STYLES, type ExaggerationStyleId } from '@/lib/styles'
import { track } from '@/lib/analytics'

/** 点击后向生成器广播"预选该风格"的事件名。 */
export const SELECT_STYLE_EVENT = 'memego:select-style'

const CARD_ACCENT: Record<ExaggerationStyleId, string> = {
  'funny-meme': 'group-hover:border-primary/60 group-hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.4)]',
  dramatic: 'group-hover:border-amber-500/60 group-hover:shadow-[0_0_24px_-6px_rgba(245,158,11,0.35)]',
  absurd: 'group-hover:border-accent/60 group-hover:shadow-[0_0_24px_-6px_hsl(var(--accent)/0.4)]',
  'pop-poster': 'group-hover:border-cyan-500/60 group-hover:shadow-[0_0_24px_-6px_rgba(6,182,212,0.35)]',
  anime: 'group-hover:border-rose-500/60 group-hover:shadow-[0_0_24px_-6px_rgba(244,63,94,0.35)]',
  'cartoon-3d': 'group-hover:border-violet-500/60 group-hover:shadow-[0_0_24px_-6px_rgba(139,92,246,0.35)]',
}

export function StyleShowcase(): React.ReactElement {
  function pick(id: ExaggerationStyleId): void {
    track('showcase_style_clicked', { style: id })
    window.dispatchEvent(new CustomEvent(SELECT_STYLE_EVENT, { detail: { styleId: id } }))
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="eyebrow">More looks after the first laugh</p>
        <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Want a different <span className="text-gradient">flavor</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          First generate is funny by default. Loading another look and generating again uses a new
          run — your free preview or an HD credit.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXAGGERATION_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => pick(style.id)}
            className={`group card card-hover flex flex-col gap-2 p-5 text-left active:scale-[0.98] ${CARD_ACCENT[style.id]}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none" aria-hidden="true">
                {style.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-foreground">{style.name}</h3>
                <p className="text-xs text-muted-foreground">{style.tagline}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground/80">
              e.g. {style.ideas[0]}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
              Try this look →
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
