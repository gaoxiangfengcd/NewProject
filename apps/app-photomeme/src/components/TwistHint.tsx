'use client'

import { TWIST_HINT_EXAMPLES } from '@/lib/twist-hint'

interface TwistHintProps {
  suggestions: string[]
  onPickExample: (text: string) => void
  onWriteOwn: () => void
  onMuteWeek: () => void
}

export function TwistHint({
  suggestions,
  onPickExample,
  onWriteOwn,
  onMuteWeek,
}: TwistHintProps): React.ReactElement {
  const ideas = suggestions.length > 0 ? suggestions : [...TWIST_HINT_EXAMPLES]
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="twist-hint-title"
      className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close and write your own"
        onClick={onWriteOwn}
        className="absolute inset-0 cursor-default bg-foreground/25 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-5 shadow-lift sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">From this photo</p>
            <h2 id="twist-hint-title" className="mt-1.5 font-display text-xl font-bold">
              We found something lovely
            </h2>
          </div>
          <button
            type="button"
            onClick={onWriteOwn}
            aria-label="Close and write your own"
            className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We noticed one bright, unmistakable thing about them. Keep it, or write your own kind
          twist — the gift stays about them, never mean.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {ideas.map((example) => (
            <li key={example}>
              <button
                type="button"
                onClick={() => onPickExample(example)}
                className="w-full rounded-2xl border border-border bg-paper px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onWriteOwn} className="btn-primary w-full">
            Close and write my own
          </button>
          <button type="button" onClick={onMuteWeek} className="btn-secondary w-full">
            Don&apos;t remind me for 7 days
          </button>
        </div>
      </div>
    </div>
  )
}
