'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'

interface ShareData {
  styleName: string
  resultUrl: string
  beforeUrl: string | null
  createdAt: string
}

export default function SharePage(): React.ReactElement {
  const params = useParams<{ token: string }>()
  const token = params.token

  const [data, setData] = useState<ShareData | null>(null)
  const [state, setState] = useState<'loading' | 'done' | 'notfound'>('loading')
  const stopped = useRef(false)

  const load = useCallback(async () => {
    setState('loading')
    try {
      const res = await fetch(`/api/share/${token}`)
      if (stopped.current) return
      if (!res.ok) {
        setState('notfound')
        return
      }
      setData((await res.json()) as ShareData)
      setState('done')
    } catch {
      setState('notfound')
    }
  }, [token])

  useEffect(() => {
    stopped.current = false
    void load()
    return () => {
      stopped.current = true
    }
  }, [load])

  if (state === 'loading') {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <p className="text-muted-foreground">Loading shared look…</p>
      </div>
    )
  }

  if (state === 'notfound' || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="eyebrow mb-3">Shared look</p>
        <h1 className="font-display text-3xl font-semibold">
          This look is no longer available
        </h1>
        <p className="mt-3 text-muted-foreground">
          But you can still find the hairstyle that suits you.
        </p>
        <div className="mt-8">
          <Link href="/upload" className="btn-primary">
            Try Your Hairstyle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-3">Shared look · Haircut AI</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {data.styleName}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Same face, new hairstyle — try it on yourself.
        </p>
      </div>

      <div className="mt-10">
        {data.beforeUrl ? (
          <BeforeAfterSlider
            beforeSrc={data.beforeUrl}
            afterSrc={data.resultUrl}
            beforeLabel="Before"
            afterLabel="After"
          />
        ) : (
          <img
            src={data.resultUrl}
            alt={data.styleName}
            className="w-full rounded-3xl border border-border"
          />
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/upload" className="btn-accent px-8 py-3.5 text-base">
          Try Your Hairstyle →
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          Upload a photo and see hairstyles on you before you cut your hair.
        </p>
      </div>
    </div>
  )
}
