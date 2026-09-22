import type { PersonPortrait, PhotoScoreReport } from '@/lib/types'

function personBlurb(person: PersonPortrait): string {
  if (person.summary.trim()) return person.summary.trim()
  const bits = person.visible_features.slice(0, 3)
  if (bits.length) return bits.join(', ')
  return person.trait
}

function distinctiveForUi(person: PersonPortrait): string[] {
  const summary = person.summary.trim().toLowerCase()
  const out: string[] = []
  for (const raw of person.visible_features) {
    const t = raw.replace(/\s+/g, ' ').trim()
    if (!t) continue
    const k = t.toLowerCase()
    if (summary.includes(k)) continue
    if (out.some((x) => x.toLowerCase() === k || x.toLowerCase().includes(k) || k.includes(x.toLowerCase()))) continue
    out.push(t)
    if (out.length >= 4) break
  }
  return out
}

function groupLine(count: number): string {
  return `${count} people, one photo.`
}

export function ScoreBrief({ report }: { report: PhotoScoreReport }): React.ReactElement {
  const p = report.primary_feature
  const portraits = report.scene.portraits ?? []
  const multi = portraits.length >= 2
  const dynamic = report.scene.photo_dynamic?.description?.trim() || ''
  const keepLine =
    portraits.length === 2
      ? `We're going to push it way too far — while keeping both of you recognizable.`
      : `We're going to push it way too far — while keeping everyone recognizable.`
  return (
    <div className="rounded-2xl border border-border bg-paper px-4 py-3.5 shadow-soft">
      <p className="eyebrow">
        We noticed this about them
        <span className="ml-2 font-sans text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {report.provider === 'mock' ? 'a stand-in read' : 'from this photo'}
        </span>
      </p>

      {multi ? (
        <>
          <p className="mt-1 font-display text-lg font-bold leading-snug text-foreground">
            {groupLine(portraits.length)}
          </p>
          <div className="mt-3 space-y-3">
            {portraits.map((person) => {
              const extras = distinctiveForUi(person)
              return (
                <div key={person.id || person.label}>
                  <p className="text-sm font-semibold text-foreground">{person.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground">{personBlurb(person)}</p>
                  {extras.length ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{extras.join(' · ')}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p className="mt-1 font-display text-lg font-bold leading-snug text-foreground">
          {portraits[0] ? personBlurb(portraits[0]) : p.feature}
        </p>
      )}

      {multi && dynamic ? (
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            What makes this photo fun
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">{dynamic}</p>
        </div>
      ) : null}

      <div className={multi ? 'mt-4 border-t border-border pt-3' : 'mt-3'}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          The thing we&apos;ll play with
        </p>
        <p className="mt-1 font-display text-base font-bold leading-snug text-foreground">{p.feature}</p>
        {multi ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{keepLine}</p>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Keep the line below, or rewrite it in your own words.
          </p>
        )}
      </div>

      {report.provider === 'mock' && report.fallbackReason ? (
        <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">
          Live analysis failed, so this is a template. {report.fallbackReason}
        </p>
      ) : null}
    </div>
  )
}
