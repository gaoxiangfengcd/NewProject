'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  analyzing?: boolean
}

export function ResultPanel({
  loading,
  loadingLine,
  elapsed,
  result,
  unlocking,
  onUnlockHd,
  analyzing,
}: ResultPanelProps): React.ReactElement {
  // 大图查看态。Hooks 必须在提前 return 之前，所以放在组件最顶部。
  const [zoomed, setZoomed] = useState(false)

  // 换了新结果（重新生成/解锁高清）就关掉旧的大图
  useEffect(() => {
    setZoomed(false)
  }, [result])

  useEffect(() => {
    if (!zoomed) return
    function onKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [zoomed])

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="photo-frame">
        <div className="photo-canvas flex aspect-square w-full flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="skeleton absolute inset-0" />
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
        <p className="photo-caption">Making their gift…</p>
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
        {/* 相框：成品图带装裱标签，看起来是一份能直接送出去的东西 */}
        <div className="photo-frame animate-pop-in">
          <div className="photo-mat">
            <div className="photo-canvas">
            {/* 整张图可点击放大：成品是这个页面的主角，缩略图看不清细节 */}
            <div
              className="relative block w-full"
              onContextMenu={isFree ? (event) => event.preventDefault() : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.outputUrl}
                alt="Your keepsake preview"
                draggable={false}
                className="pointer-events-none aspect-square w-full select-none object-cover"
              />
              {isFree ? (
                <button
                  type="button"
                  onClick={() => setZoomed(true)}
                  aria-label="Enlarge the keepsake"
                  className="absolute inset-0 cursor-zoom-in"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setZoomed(true)}
                  title="Click to enlarge"
                  aria-label="Enlarge the keepsake"
                  className="absolute inset-0 cursor-zoom-in"
                />
              )}
            </div>
            <span className="absolute left-2.5 top-2.5 rounded-lg bg-primary/95 px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-[0_2px_8px_-2px_hsl(12_62%_30%/0.4)]">
              {isFree ? 'Preview' : 'Ready to give'}
            </span>
          </div>
            <p className="photo-caption">
              {style?.name ?? 'Keepsake'} ·{' '}
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {isFree && onUnlockHd ? (
            <button
              type="button"
              onClick={() => {
                track('download_clicked', { tier: 'free' })
                onUnlockHd()
              }}
              disabled={unlocking}
              className="btn-primary w-full"
            >
              {unlocking ? 'Unlocking…' : 'Download · unlock print-ready'}
            </button>
          ) : (
            <a
              href={result.outputUrl}
              download={downloadName}
              onClick={() => track('download_clicked', { tier: result.tier })}
              className="btn-primary w-full"
            >
              {`Download${style ? ` · ${style.name}` : ''}`}
            </a>
          )}
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Share it
            </p>
            <ShareButtons url={shareUrl} />
          </div>
        </div>

        {/* 大图层用 portal 挂到 body：Header 的 backdrop-blur 会创建 containing block，
            组件树内的 position:fixed 会相对 Header 定位（Explore 面板踩过的坑） */}
        {zoomed &&
          createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Keepsake, enlarged"
              onClick={() => setZoomed(false)}
              className="fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-[hsl(24_22%_13%/0.92)] p-4 sm:p-8"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.outputUrl}
                alt="Your keepsake, enlarged"
                draggable={false}
                onContextMenu={isFree ? (event) => event.preventDefault() : undefined}
                className="pointer-events-none max-h-full max-w-full select-none rounded-[4px] object-contain"
              />
              <p className="text-xs font-medium text-white/70">Click anywhere to close</p>
            </div>,
            document.body,
          )}
      </div>
    )
  }

  if (analyzing) {
    return (
      <div role="status" aria-live="polite" className="photo-frame">
        <div className="photo-canvas flex aspect-square w-full flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="skeleton absolute inset-0" />
          <span className="animate-float text-4xl" aria-hidden="true">
            👀
          </span>
          <p className="relative text-sm font-bold text-foreground">Looking for their thing…</p>
          <div className="progress-track relative w-36">
            <div className="progress-bar" />
          </div>
          <p className="relative text-xs text-muted-foreground">The person first. Then the joke.</p>
        </div>
        <p className="photo-caption">Reading the photo</p>
      </div>
    )
  }

  return (
    <div className="photo-frame">
      <div className="photo-canvas flex aspect-square w-full flex-col items-center justify-center gap-2 bg-paper text-center">
        <svg
          className="h-9 w-9 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z"
          />
        </svg>
        <span className="px-4 text-sm text-muted-foreground">Their gift appears here</span>
      </div>
      <p className="photo-caption">Waiting for their photo</p>
    </div>
  )
}
