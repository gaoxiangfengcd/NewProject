'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'
import { StepProgress } from '@/components/ui/StepProgress'
import { getHairstyleById, getRecommendReason, type FaceShape } from '@/lib/hairstyles'
import { pollGeneration, startGeneration, type GenerationStatus } from '@/lib/client-api'

const HAIR_COLORS = [
  { id: 'black', name: 'Black', swatch: '#1a1a1a' },
  { id: 'brown', name: 'Brown', swatch: '#6B4E37' },
  { id: 'dark-brown', name: 'Dark Brown', swatch: '#3B2417' },
  { id: 'blonde', name: 'Blonde', swatch: '#D4A856' },
  { id: 'ash-blonde', name: 'Ash Blonde', swatch: '#C0B096' },
  { id: 'red', name: 'Red', swatch: '#A0522D' },
  { id: 'copper', name: 'Copper', swatch: '#B0633A' },
  { id: 'silver', name: 'Silver', swatch: '#C0C0C0' },
]

const GENERATE_STEPS = [
  'Placing the hairstyle on your photo…',
  'Matching hairline and texture…',
  'Blending color, light and shadows…',
  'Keeping your face and identity intact…',
]

export default function ResultPage(): React.ReactElement {
  const params = useParams<{ generationId: string }>()
  const router = useRouter()
  const generationId = params.generationId

  const [gen, setGen] = useState<GenerationStatus | null>(null)
  const [fatal, setFatal] = useState('')
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const stopped = useRef(false)

  const poll = useCallback(async () => {
    try {
      const g = await pollGeneration(generationId)
      if (stopped.current) return
      setGen(g)
      if (g.status === 'succeeded' || g.status === 'failed') {
        if (g.status === 'succeeded' && g.photoId) {
          fetch(`/api/analyze?photoId=${g.photoId}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
              if (d?.analyzed) setFaceShape(d.faceShape as FaceShape)
            })
            .catch(() => undefined)
        }
        return
      }
      setTimeout(() => void poll(), 2000)
    } catch (e) {
      setFatal(e instanceof Error ? e.message : 'Failed to load result')
    }
  }, [generationId])

  useEffect(() => {
    stopped.current = false
    void poll()
    return () => {
      stopped.current = true
    }
  }, [poll])

  async function copyShareLink(token: string) {
    const url = `${window.location.origin}/share/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your share link:', url)
    }
  }

  async function regenerateWithColor(color: string) {
    if (!gen?.photoId || busy) return
    setBusy(true)
    try {
      const opts: Parameters<typeof startGeneration>[0] = {
        photoId: gen.photoId,
        hairColor: color,
      }
      if (gen.styleId) opts.styleIds = [gen.styleId]
      else if (gen.mode === 'reference') opts.referencePhotoId = gen.photoId
      const { generationIds } = await startGeneration(opts)
      router.push(`/result/${generationIds[0]}`)
    } catch {
      setBusy(false)
    }
  }

  if (fatal) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="eyebrow mb-3">Something went wrong</p>
        <h1 className="font-display text-3xl font-semibold">{fatal}</h1>
        <div className="mt-8">
          <Link href="/hairstyles" className="btn-primary">
            Back to hairstyles
          </Link>
        </div>
      </div>
    )
  }

  const pending = !gen || gen.status === 'queued' || gen.status === 'processing'

  if (pending) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="text-center">
          <p className="eyebrow mb-3">Generating your look</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Your new hairstyle is on the way
          </h1>
        </div>
        <div className="card mt-10">
          <StepProgress steps={GENERATE_STEPS} intervalMs={1400} />
        </div>
      </div>
    )
  }

  if (gen.status === 'failed') {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="eyebrow mb-3">Generation failed</p>
        <h1 className="font-display text-3xl font-semibold">
          {gen.error ?? 'We could not generate this look.'}
        </h1>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={() => router.back()} className="btn-primary">
            Try another style
          </button>
          <Link href="/upload" className="btn-outline">
            Re-upload photo
          </Link>
        </div>
      </div>
    )
  }

  const style = gen.styleId ? getHairstyleById(gen.styleId) : null
  const why = style
    ? faceShape
      ? getRecommendReason(style, faceShape)
      : style.description
    : 'Your custom hairstyle, generated while keeping your face and identity intact.'
  const downloadName = (gen.styleName ?? 'hairstyle').toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Before / After */}
        <div>
          {gen.photoUrl && gen.resultUrl ? (
            <BeforeAfterSlider
              beforeSrc={gen.photoUrl}
              afterSrc={gen.resultUrl}
              beforeLabel="Before"
              afterLabel="After"
            />
          ) : (
            <img
              src={gen.resultUrl ?? ''}
              alt={gen.styleName ?? 'Generated hairstyle'}
              className="w-full rounded-3xl border border-border"
            />
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Drag the slider to compare — your face stays yours, only the hair changes.
          </p>
        </div>

        {/* 信息侧栏 */}
        <div className="flex flex-col">
          <p className="eyebrow">Your new look</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
            {gen.styleName ?? 'Custom Hairstyle'}
          </h1>

          <div className="card mt-6">
            <p className="eyebrow">Why it suits you</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{why}</p>
          </div>

          {/* 操作 */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href={`/hairstyles?photoId=${gen.photoId ?? ''}`}
              className="btn-outline text-center text-sm"
            >
              Try Another
            </Link>
            <Link
              href={`/hairstyles?photoId=${gen.photoId ?? ''}`}
              className="btn-outline text-center text-sm"
            >
              Compare Styles
            </Link>
            <a
              href={gen.resultUrl ?? '#'}
              download={`${downloadName}.png`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-center text-sm"
            >
              Download
            </a>
            <button
              type="button"
              onClick={() => gen.shareToken && void copyShareLink(gen.shareToken)}
              disabled={!gen.shareToken}
              className="btn-accent text-sm"
            >
              {copied ? '✓ Link copied' : 'Share'}
            </button>
          </div>

          {/* 发色切换 */}
          {gen.photoId && (gen.styleId || gen.mode === 'reference') && (
            <div className="mt-6 rounded-2xl border border-border bg-white p-5">
              <p className="eyebrow">Try a different hair color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={busy}
                    onClick={() => void regenerateWithColor(c.id)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-all hover:border-accent/40 disabled:opacity-50"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border"
                      style={{ background: c.swatch }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-accent-soft/50 p-5">
            <p className="text-sm font-medium">Want to see more options?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare up to 5 styles side by side to find your favorite before you cut.
            </p>
            <Link
              href={`/hairstyles?photoId=${gen.photoId ?? ''}`}
              className="mt-3 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Browse all hairstyles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
