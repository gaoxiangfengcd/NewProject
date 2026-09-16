'use client'

import { EXAGGERATION_STYLES, type ExaggerationStyleId } from '@/lib/styles'
import { track } from '@/lib/analytics'

interface StyleColor {
  border: string
  text: string
}

const STYLE_COLORS: Record<ExaggerationStyleId, StyleColor> = {
  'funny-meme': { border: 'hover:border-primary', text: 'text-primary' },
  dramatic: { border: 'hover:border-amber-500', text: 'text-amber-400' },
  absurd: { border: 'hover:border-accent', text: 'text-accent' },
  'pop-poster': { border: 'hover:border-cyan-500', text: 'text-cyan-400' },
  anime: { border: 'hover:border-rose-500', text: 'text-rose-400' },
  'cartoon-3d': { border: 'hover:border-violet-500', text: 'text-violet-400' },
}

interface StylePickerProps {
  value: ExaggerationStyleId
  onChange: (id: ExaggerationStyleId) => void
}

export function StylePicker({ value, onChange }: StylePickerProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {EXAGGERATION_STYLES.map((style) => {
        const active = style.id === value
        const color = STYLE_COLORS[style.id]
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => {
              track('style_selected', { style: style.id })
              onChange(style.id)
            }}
            className={
              active
                ? 'animate-pop-in flex flex-col items-start gap-1.5 rounded-2xl border border-primary bg-primary/15 p-4 text-left shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] transition active:scale-[0.97]'
                : `flex flex-col items-start gap-1.5 rounded-2xl border border-border bg-secondary p-4 text-left transition active:scale-[0.97] ${color.border} hover:bg-muted`
            }
          >
            <span className={active ? 'text-2xl leading-none' : `text-2xl leading-none ${color.text}`}>
              {style.emoji}
            </span>
            <span className="mt-0.5 text-sm font-bold leading-tight text-foreground">
              {style.name}
            </span>
            <span className="text-xs leading-snug text-muted-foreground">
              {style.tagline}
            </span>
          </button>
        )
      })}
    </div>
  )
}
