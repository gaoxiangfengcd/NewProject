'use client'

import { ShareButtons } from './ShareButtons'
import { SITE_URL } from '@/lib/site'
import { track } from '@/lib/analytics'
import { getStyle } from '@/lib/styles'
import type { GenerationResult } from '@/lib/types'

interface ResultPanelProps {
  loading: boolean
  loadingLine: string
  elapsed: number
  result: GenerationResult | null
  unlocking?: boolean
  onUnlockHd?: () => void
}

export function ResultPanel({
  loading,
  loadingLine,
  elapsed,
  result,
  unlocking,
  onUnlockHd,
}: ResultPanelProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-primary/30 bg-muted"
      >
        <div className="skeleton absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="animate-float text-4xl" aria-hidden="true">
            🤪
          </span>
          <p key={loadingLine} className="text-sm font-bold text-foreground">
            <span className="animate-fade-up inline-block">{loadingLine}…</span>
          </p>
          <div className="progress-track w-36">
            <div className="progress-bar" />
          </div>
          <p className="text-xs text-muted-foreground">
            {elapsed > 0 ? `${elapsed}s · ` : ''}usually 10–20 seconds
          </p>
        </div>
      </div>
    )
  }

  if (result) {
    const shareUrl = `${SITE_URL}/share/${result.shareId}`
    const style = getStyle(result.style)
    const isFree = result.tier !== 'paid'
    const downloadName = isFree ? 'memego-preview.jpg' : 'memego.png'

    return (
      <div className="animate-fade-up flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-muted shadow-[0_0_28px_-6px_hsl(var(--primary)/0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.outputUrl}
            alt="Your exaggerated meme"
            className="aspect-square w-full object-cover"
          />
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
            {isFree ? 'Preview' : 'HD'}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {isFree && onUnlockHd && (
            <button
              type="button"
              onClick={onUnlockHd}
              disabled={unlocking}
              className="btn-primary w-full"
            >
              {unlocking ? 'Unlocking…' : 'Unlock HD · no watermark'}
            </button>
          )}
          <a
            href={result.outputUrl}
            download={downloadName}
            onClick={() => track('download_clicked', { tier: result.tier })}
            className={isFree ? 'btn-secondary w-full' : 'btn-primary w-full'}
          >
            {isFree
              ? 'Download preview'
              : `Download${style ? ` · ${style.name}` : ''}`}
          </a>
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Share it
            </p>
            <ShareButtons url={shareUrl} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted text-center sm:aspect-square">
      <svg
        className="h-9 w-9 text-muted-foreground/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
      <span className="px-4 text-sm text-muted-foreground">Your meme appears here</span>
    </div>
  )
}
