'use client'

import { useEffect, useState } from 'react'

const STAGES = [
  {
    title: 'Looking at them',
    line: 'Who is in this photo — face, pose, clothes, the visible interaction.',
  },
  {
    title: 'Listing the bits',
    line: 'Hats, glasses, grins, side-eyes — every exaggeratable trait, scored quietly.',
  },
  {
    title: 'Writing joke directions',
    line: 'A few distinct ideas, each aimed at one feature or one interaction.',
  },
  {
    title: 'Handing you the choice',
    line: 'You pick the direction. We only draw after you choose.',
  },
] as const

/**
 * 读图等待态：把「按钮灰掉」换成一段好看的释义，说明我们在找人身上的笑话。
 */
export function AnalysisNarration(): React.ReactElement {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((i) => (i + 1) % STAGES.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [])

  const current = STAGES[step]

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-primary/25 bg-gradient-to-br from-blush/40 to-paper px-4 py-4 shadow-soft sm:px-5"
    >
      <p className="eyebrow">Reading the photo</p>
      <p key={current.title} className="mt-1.5 font-display text-xl font-bold leading-snug text-foreground">
        <span className="animate-fade-up inline-block">{current.title}</span>
      </p>
      <p key={current.line} className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        <span className="animate-fade-up inline-block">{current.line}</span>
      </p>
      <div className="progress-track mt-4 max-w-xs">
        <div className="progress-bar" />
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {STAGES.map((stage, i) => (
          <li
            key={stage.title}
            className={`rounded-xl px-3 py-2 text-xs leading-snug ${
              i === step
                ? 'bg-primary/12 font-semibold text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <span className="mr-1.5 tabular-nums text-[10px] uppercase tracking-wide opacity-70">
              {String(i + 1).padStart(2, '0')}
            </span>
            {stage.title}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        Gift ideas first, generate second. You choose the joke before we draw.
      </p>
    </div>
  )
}
