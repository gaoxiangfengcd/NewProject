'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { StepProgress } from '@/components/ui/StepProgress'
import { StyleCardRecommend } from '@/components/hairstyles/StyleCard'
import { getHairstyleById, type FaceShape } from '@/lib/hairstyles'
import { startGeneration } from '@/lib/client-api'

interface Rec {
  styleId: string
  styleName: string
  reason: string
}
interface AnalysisResult {
  faceShape: FaceShape
  hairLength: string
  hairTexture: string
  hairDensity: string
  forehead: string
  jawline: string
  recommendations: Rec[]
}

const ANALYZE_STEPS = [
  'Detecting facial features…',
  'Analyzing face shape…',
  'Reading hair texture and density…',
  'Matching flattering hairstyles…',
]

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function AnalyzePage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Loading…</div>}>
      <AnalyzeContent />
    </Suspense>
  )
}

function AnalyzeContent(): React.ReactElement {
  const router = useRouter()
  const params = useSearchParams()
  const photoId = params.get('photoId') ?? ''

  const [phase, setPhase] = useState<'loading' | 'done' | 'error'>('loading')
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)
  const ran = useRef(false)

  const runAnalysis = useCallback(async () => {
    setPhase('loading')
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      })
      const data = (await res.json()) as {
        photoUrl?: string
        analysis?: AnalysisResult
        error?: { message: string }
      }
      if (!res.ok || !data.analysis) {
        throw new Error(data.error?.message ?? 'Analysis failed')
      }
      setAnalysis(data.analysis)
      setTimeout(() => setPhase('done'), 900)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
      setPhase('error')
    }
  }, [photoId])

  useEffect(() => {
    if (!photoId) {
      setError('No photo found. Please upload a photo first.')
      setPhase('error')
      return
    }
    if (ran.current) return
    ran.current = true
    void runAnalysis()
  }, [photoId, runAnalysis])

  async function tryStyle(styleId: string) {
    setStartingId(styleId)
    try {
      const { generationIds } = await startGeneration({ photoId, styleIds: [styleId] })
      router.push(`/result/${generationIds[0]}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setStartingId(null)
    }
  }

  if (phase === 'error') {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="eyebrow mb-3">Something went wrong</p>
        <h1 className="font-display text-3xl font-semibold">{error}</h1>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={() => void runAnalysis()} className="btn-primary">
            Try again
          </button>
          <Link href="/upload" className="btn-outline">
            Re-upload photo
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'loading' || !analysis) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="text-center">
          <p className="eyebrow mb-3">Step 2 of 3</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Analyzing your features
          </h1>
        </div>
        <div className="card mt-10">
          <StepProgress steps={ANALYZE_STEPS} intervalMs={1100} />
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Face Shape', value: cap(analysis.faceShape), highlight: true },
    { label: 'Hair Length', value: cap(analysis.hairLength) },
    { label: 'Hair Texture', value: cap(analysis.hairTexture) },
    { label: 'Hair Density', value: cap(analysis.hairDensity) },
    { label: 'Forehead', value: cap(analysis.forehead) },
    { label: 'Jawline', value: cap(analysis.jawline) },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-3">Step 2 of 3</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your face shape appears to be{' '}
          <span className="italic text-accent">{cap(analysis.faceShape)}</span>
        </h1>
      </div>

      {/* 分析指标 */}
      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`rounded-2xl border p-5 text-center ${
              m.highlight ? 'border-accent bg-accent-soft/50' : 'border-border bg-white'
            }`}
          >
            <p className="eyebrow">{m.label}</p>
            <p
              className={`mt-2 font-display text-xl font-semibold ${
                m.highlight ? 'text-accent' : ''
              }`}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* 推荐 */}
      <div className="mt-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold">
            Recommended hairstyles for you
          </h2>
          <p className="mt-2 text-muted-foreground">
            Chosen to flatter a {analysis.faceShape} face shape.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {analysis.recommendations.map((rec) => {
            const style = getHairstyleById(rec.styleId)
            if (!style) return null
            return (
              <StyleCardRecommend
                key={rec.styleId}
                style={style}
                reason={rec.reason}
                ctaLabel={startingId === rec.styleId ? 'Starting…' : 'Try This Style'}
                disabled={startingId !== null}
                onCta={() => void tryStyle(rec.styleId)}
              />
            )
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href={`/hairstyles?photoId=${photoId}`}
            className="btn-outline px-8 py-3.5 text-base"
          >
            Explore all hairstyles →
          </Link>
        </div>
      </div>
    </div>
  )
}
