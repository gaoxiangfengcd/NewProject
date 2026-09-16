'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { UploadZone } from './UploadZone'
import { StylePicker } from './StylePicker'
import { ResultPanel } from './ResultPanel'
import { SELECT_STYLE_EVENT } from './StyleShowcase'
import {
  DEFAULT_STYLE_ID,
  EXAGGERATION_STYLES,
  getStyle,
  type ExaggerationStyleId,
} from '@/lib/styles'
import { MAX_TWIST_LENGTH } from '@/lib/prompt'
import { SITE_NAME, RETENTION_DAYS } from '@/lib/site'
import { track } from '@/lib/analytics'
import type { GenerationResult, QuotaSnapshot } from '@/lib/types'

const LOADING_LINES = [
  'Warming up the exaggerator',
  'Making your head slightly too big',
  'Adding drama. So much drama',
  'Consulting the meme council',
  'Turning reality up to 11',
  'Almost there',
]

export function Generator(): React.ReactElement {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [styleId, setStyleId] = useState<ExaggerationStyleId>(DEFAULT_STYLE_ID)
  const [showStyles, setShowStyles] = useState(false)
  const [twist, setTwist] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [loadingLine, setLoadingLine] = useState(0)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)
  const [paywall, setPaywall] = useState(false)
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const previewRef = useRef<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<File | null>(null)

  useEffect(() => {
    fileRef.current = file
  }, [file])

  useEffect(() => {
    track('homepage_view')
  }, [])

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/quota')
      const json = await res.json().catch(() => null)
      if (json?.ok && json.data) setQuota(json.data as QuotaSnapshot)
    })()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const txnId = params.get('_ptxn') || params.get('transaction_id')
    const returned = params.get('checkout') === 'success' || Boolean(txnId)
    if (!returned) return

    void (async () => {
      if (txnId) {
        const res = await fetch('/api/credits/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: txnId }),
        })
        const json = await res.json().catch(() => null)
        if (json?.ok && json.data) {
          setQuota(json.data as QuotaSnapshot)
          setPaywall(false)
          setError(null)
          track('credits_granted', { source: 'paddle' })
        } else {
          setError(json?.error?.message ?? 'Payment succeeded, but credits did not land. Refresh and try again.')
        }
      } else {
        const res = await fetch('/api/quota')
        const json = await res.json().catch(() => null)
        if (json?.ok && json.data) {
          setQuota(json.data as QuotaSnapshot)
          setPaywall(false)
        }
      }
      window.history.replaceState({}, '', `${window.location.pathname}#generator`)
    })()
  }, [])

  useEffect(() => {
    function onPick(event: Event): void {
      const id = (event as CustomEvent<{ styleId?: string }>).detail?.styleId
      if (!id || !EXAGGERATION_STYLES.some((s) => s.id === id)) return
      setStyleId(id as ExaggerationStyleId)
      setShowStyles(true)
      setResult(null)
      setError(null)
    }
    window.addEventListener(SELECT_STYLE_EVENT, onPick)
    return () => window.removeEventListener(SELECT_STYLE_EVENT, onPick)
  }, [])

  useEffect(() => {
    if (!loading) return
    setLoadingLine(0)
    setElapsed(0)
    const lineTimer = setInterval(
      () => setLoadingLine((i) => (i + 1) % LOADING_LINES.length),
      2400,
    )
    const tickTimer = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => {
      clearInterval(lineTimer)
      clearInterval(tickTimer)
    }
  }, [loading])

  useEffect(() => {
    if (!result) return
    if (window.matchMedia('(min-width: 640px)').matches) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [result])

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  function clearPreview(): void {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
    }
    setPreviewUrl(null)
  }

  function handleSelect(next: File): void {
    setError(null)
    setResult(null)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(next)
    previewRef.current = url
    setFile(next)
    setPreviewUrl(url)
  }

  function handleStyleChange(id: ExaggerationStyleId): void {
    setStyleId(id)
    setShowStyles(true)
    setResult(null)
    setError(null)
  }

  const selectedStyle = getStyle(styleId)
  const canGenerate = Boolean(file) && !loading
  const freeRemaining = quota?.freeRemaining ?? 1
  const paidCredits = quota?.paidCredits ?? 0
  const needsPay = freeRemaining < 1 && paidCredits < 1

  async function generate(tier: 'free' | 'paid'): Promise<void> {
    const currentFile = fileRef.current
    if (!currentFile || !styleId) return
    setError(null)
    setPaywall(false)
    setLoading(true)
    track('generate_started', { style: styleId, hasTwist: twist.trim().length > 0, tier })

    try {
      const body = new FormData()
      body.append('file', currentFile)
      body.append('style', styleId)
      body.append('tier', tier)
      if (twist.trim()) body.append('twist', twist.trim())

      const res = await fetch('/api/generate', { method: 'POST', body })
      const json = await res.json().catch(() => null)

      if (json?.quota) setQuota(json.quota as QuotaSnapshot)
      if (json?.data?.quota) setQuota(json.data.quota as QuotaSnapshot)

      if (res.status === 402) {
        setPaywall(true)
        track('quota_blocked', { code: json?.error?.code ?? 'PAYMENT_REQUIRED' })
        throw new Error(json?.error?.message ?? 'Unlock HD to keep generating.')
      }

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message ?? 'Something went wrong. Please try again.')
      }

      setResult(json.data as GenerationResult)
      setShowStyles(true)
      track('generation_success', { style: styleId, tier })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
      setError(message)
      track('generation_error', { message })
    } finally {
      setLoading(false)
    }
  }

  function handlePrimaryGenerate(): void {
    if (needsPay) {
      setPaywall(true)
      setError('Your free preview for today is used. Unlock HD to generate again.')
      return
    }
    void generate(freeRemaining > 0 ? 'free' : 'paid')
  }

  async function startCheckout(): Promise<void> {
    setCheckoutBusy(true)
    setError(null)
    track('checkout_clicked')
    try {
      const res = await fetch('/api/credits/checkout', { method: 'POST' })
      const json = await res.json().catch(() => null)
      if (json?.ok && json.data?.url) {
        window.location.href = json.data.url as string
        return
      }
      throw new Error(json?.error?.message ?? 'Checkout is not available yet.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is not available yet.')
    } finally {
      setCheckoutBusy(false)
    }
  }

  async function grantDevCredit(): Promise<void> {
    setCheckoutBusy(true)
    try {
      const res = await fetch('/api/credits/dev-grant', { method: 'POST' })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message ?? 'Could not add a test credit.')
      }
      setQuota(json.data as QuotaSnapshot)
      setPaywall(false)
      setError(null)
      track('credits_granted', { source: 'dev' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add a test credit.')
    } finally {
      setCheckoutBusy(false)
    }
  }

  async function unlockHd(): Promise<void> {
    track('unlock_hd_clicked')
    if (paidCredits < 1) {
      setPaywall(true)
      if (quota?.checkoutEnabled) {
        await startCheckout()
        return
      }
      setError('Unlock HD with a paid generation — better model, no watermark.')
      return
    }
    await generate('paid')
  }

  function reset(): void {
    setFile(null)
    clearPreview()
    setStyleId(DEFAULT_STYLE_ID)
    setShowStyles(false)
    setTwist('')
    setResult(null)
    setError(null)
    setPaywall(false)
  }

  const primaryLabel = loading
    ? 'Generating…'
    : result
      ? 'Generate again'
      : 'Make it funny'

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Original
          </span>
          <UploadZone previewUrl={previewUrl} onSelect={handleSelect} onError={setError} />
        </div>

        <div ref={resultRef} className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Result
          </span>
          <ResultPanel
            loading={loading}
            loadingLine={LOADING_LINES[loadingLine]}
            elapsed={elapsed}
            result={result}
            unlocking={loading}
            onUnlockHd={result?.tier === 'free' ? () => void unlockHd() : undefined}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="space-y-5">
          <div>
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <label htmlFor="twist" className="text-sm font-bold">
                Add a twist{' '}
                <span className="text-sm font-normal text-muted-foreground">(optional)</span>
              </label>
              <span className="text-xs tabular-nums text-muted-foreground/70">
                {twist.length}/{MAX_TWIST_LENGTH}
              </span>
            </div>

            {selectedStyle && (
              <div className="mb-2.5 flex flex-wrap gap-2">
                {selectedStyle.ideas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => {
                      track('idea_clicked', { style: selectedStyle.id, idea })
                      setTwist(idea)
                    }}
                    className={`chip ${twist === idea ? 'chip-active' : 'chip-idle'}`}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            )}

            <input
              id="twist"
              type="text"
              value={twist}
              maxLength={MAX_TWIST_LENGTH}
              onChange={(e) => setTwist(e.target.value)}
              placeholder="e.g. riding a giant rubber duck"
              className="input-base"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          {(paywall || needsPay) && (
            <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <p className="text-sm font-bold">HD unlock — better model, no watermark</p>
              <p className="text-sm text-muted-foreground">
                Free is 1 preview per day (low-res, watermarked). Generate again and a new vibe
                each count as a new run. {quota?.priceLabel ?? '$2.99'} unlocks{' '}
                {quota?.creditsPerPurchase ?? 1} full-quality image
                {(quota?.creditsPerPurchase ?? 1) > 1 ? 's' : ''}.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {quota?.checkoutEnabled && (
                  <button
                    type="button"
                    onClick={() => void startCheckout()}
                    disabled={checkoutBusy}
                    className="btn-primary flex-1"
                  >
                    {checkoutBusy ? 'Redirecting…' : `Unlock HD · ${quota.priceLabel}`}
                  </button>
                )}
                {quota?.devGrantEnabled && (
                  <button
                    type="button"
                    onClick={() => void grantDevCredit()}
                    disabled={checkoutBusy}
                    className="btn-secondary flex-1"
                  >
                    Add a test credit
                  </button>
                )}
              </div>
              {/* Paddle 域名审核要求：退款政策必须在结账入口处可见 */}
              <p className="text-xs text-muted-foreground">
                Payments are handled by Paddle.com (Merchant of Record). Unused credits are
                refundable within 14 days — see the{' '}
                <Link href="/refund" className="font-medium text-primary underline-offset-2 hover:underline">
                  refund policy
                </Link>
                .
              </p>
            </div>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handlePrimaryGenerate}
              disabled={!canGenerate}
              className={`btn-primary flex-1 text-base ${canGenerate ? 'animate-glow' : ''}`}
            >
              {primaryLabel}
            </button>
            {result && (
              <button type="button" onClick={reset} className="btn-secondary">
                Start over
              </button>
            )}
          </div>

          {!canGenerate && !loading && (
            <p className="text-center text-xs text-muted-foreground">Add a photo to get started</p>
          )}

          {showStyles && (
            <div>
              <label className="mb-2.5 block text-sm font-bold">
                Try another vibe{' '}
                <span className="text-sm font-normal text-muted-foreground">
                  (counts as a new generation)
                </span>
              </label>
              <StylePicker value={styleId} onChange={handleStyleChange} />
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            {freeRemaining} free preview left today · {paidCredits} HD credit
            {paidCredits === 1 ? '' : 's'} · photos auto-deleted after {RETENTION_DAYS} days ·{' '}
            {SITE_NAME} watermark on free previews
          </p>
        </div>
      </div>
    </div>
  )
}
