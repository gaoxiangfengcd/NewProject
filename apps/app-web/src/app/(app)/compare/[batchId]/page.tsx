'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface BatchGen {
  id: string
  status: 'queued' | 'processing' | 'succeeded' | 'failed'
  resultUrl: string | null
  error: string | null
  styleId: string | null
  styleName: string | null
  mode: string
}

export default function ComparePage(): React.ReactElement {
  const params = useParams<{ batchId: string }>()
  const batchId = params.batchId

  const [gens, setGens] = useState<BatchGen[]>([])
  const [fatal, setFatal] = useState('')
  const [loaded, setLoaded] = useState(false)
  const stopped = useRef(false)

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/generate/batch/${batchId}`)
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: { message: string }
        } | null
        throw new Error(data?.error?.message ?? 'Batch not found')
      }
      const data = (await res.json()) as { generations: BatchGen[] }
      if (stopped.current) return
      setGens(data.generations)
      setLoaded(true)
      const pending = data.generations.some(
        (g) => g.status === 'queued' || g.status === 'processing',
      )
      if (pending) setTimeout(() => void poll(), 2500)
    } catch (e) {
      setFatal(e instanceof Error ? e.message : 'Failed to load comparison')
    }
  }, [batchId])

  useEffect(() => {
    stopped.current = false
    void poll()
    return () => {
      stopped.current = true
    }
  }, [poll])

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

  const done = gens.filter((g) => g.status === 'succeeded').length
  const allDone = gens.length > 0 && done === gens.length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-3">Compare looks</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your styles, side by side
        </h1>
        <p className="mt-3 text-muted-foreground">
          {!loaded
            ? 'Loading your looks…'
            : gens.length === 0
              ? 'Nothing to show here.'
              : allDone
                ? 'All looks ready — pick the one you love most.'
                : `${done} of ${gens.length} looks ready…`}
        </p>
      </div>

      {loaded && gens.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display text-2xl">This comparison isn&apos;t available</p>
          <p className="mt-2 text-sm text-muted-foreground">
            It may belong to another account or no longer exists.
          </p>
          <Link href="/upload" className="btn-primary mt-6 inline-flex">
            Try Your Hairstyle →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {gens.map((g) => (
            <div key={g.id} className="card flex flex-col overflow-hidden !p-0">
            <div className="relative aspect-[3/4] w-full bg-muted/40">
              {g.status === 'succeeded' && g.resultUrl ? (
                <img
                  src={g.resultUrl}
                  alt={g.styleName ?? 'Generated hairstyle'}
                  className="h-full w-full object-cover"
                />
              ) : g.status === 'failed' ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="text-2xl">⚠</span>
                  <p className="text-xs text-muted-foreground">
                    {g.error ?? 'Generation failed'}
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                  <p className="text-xs text-muted-foreground">Styling…</p>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-lg font-semibold">
                {g.styleName ?? 'Custom'}
              </h3>
              {g.status === 'succeeded' && (
                <Link
                  href={`/result/${g.id}`}
                  className="btn-primary mt-3 w-full text-center text-sm"
                >
                  View & compare
                </Link>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/hairstyles" className="btn-outline px-8 py-3.5 text-base">
          Try more hairstyles →
        </Link>
      </div>
    </div>
  )
}
