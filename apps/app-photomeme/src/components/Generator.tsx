'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { UploadZone } from './UploadZone'
import { ResultPanel } from './ResultPanel'
import { AnalysisNarration } from './AnalysisNarration'
import { SELECT_STYLE_EVENT } from './StyleShowcase'
import {
  DEFAULT_STYLE_ID,
  EXAGGERATION_STYLES,
  type ExaggerationStyleId,
} from '@/lib/styles'
import { MAX_TWIST_LENGTH, SENSITIVE_TWIST_MESSAGE } from '@/lib/prompt'
import { isSensitiveFeatureText } from '@/lib/creative-engine'
import { track } from '@/lib/analytics'
import { openPaddleCheckout } from '@/lib/paddle-js'
import type { GenerationResult, QuotaSnapshot } from '@/lib/types'

type DirectionChoice = {
  id: string
  title: string
  description: string
  english_prompt: string
  focus: string
}

const LOADING_LINES = [
  'Finding their thing',
  'Taking it way too far',
  'Letting the joke hit the scene',
  'Keeping them recognizable',
  'Coloring the gift sketch',
  'Almost there',
]

function jokeLine(item: DirectionChoice): string {
  const english = item.english_prompt.trim()
  if (english) return english
  const title = item.title.trim()
  const head = item.description.trim().split(/[.;]/)[0]?.trim() ?? ''
  if (title && head && !head.toLowerCase().startsWith(title.toLowerCase())) return `${title}: ${head}`
  return head || title
}

export function Generator(): React.ReactElement {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [styleId, setStyleId] = useState<ExaggerationStyleId>(DEFAULT_STYLE_ID)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [loadingLine, setLoadingLine] = useState(0)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)
  const [paywall, setPaywall] = useState(false)
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [directions, setDirections] = useState<DirectionChoice[]>([])
  const [selectedDirectionId, setSelectedDirectionId] = useState<string | null>(null)
  const [generatedDirectionId, setGeneratedDirectionId] = useState<string | null>(null)
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [iterateText, setIterateText] = useState('')
  const [iterateHistory, setIterateHistory] = useState<{ text: string }[]>([])
  const previewRef = useRef<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<File | null>(null)
  const analyzeAbortRef = useRef<AbortController | null>(null)

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
    const paidReturn = params.get('checkout') === 'success'
    if (!paidReturn && !txnId) return

    async function applyConfirm(id: string): Promise<boolean> {
      const res = await fetch('/api/credits/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: id }),
      })
      const json = await res.json().catch(() => null)
      if (json?.ok && json.data) {
        setQuota(json.data as QuotaSnapshot)
        setPaywall(false)
        setError(null)
        track('credits_granted', { source: 'paddle' })
        return true
      }
      return false
    }

    void (async () => {
      if (txnId && !paidReturn) {
        await openPaddleCheckout({
          transactionId: txnId,
          onSuccess: async () => {
            const landed = await applyConfirm(txnId)
            if (!landed) {
              const qr = await fetch('/api/quota').then((r) => r.json()).catch(() => null)
              if (qr?.ok && qr.data) setQuota(qr.data as QuotaSnapshot)
            }
          },
        })
        return
      }

      if (txnId) {
        const landed = await applyConfirm(txnId)
        if (!landed) {
          setError('Payment succeeded, but credits did not land. Refresh and try again.')
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
    setDirections([])
    setSelectedDirectionId(null)
    setGeneratedDirectionId(null)
    setOriginalPrompt('')
    setIterateText('')
    setIterateHistory([])
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(next)
    previewRef.current = url
    setFile(next)
    setPreviewUrl(url)
    void runDirections(next)
  }

  async function runDirections(photo: File): Promise<DirectionChoice[] | null> {
    analyzeAbortRef.current?.abort()
    const abort = new AbortController()
    analyzeAbortRef.current = abort
    setAnalyzing(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', photo)
      const timeoutSignal = AbortSignal.timeout(70_000)
      const signal =
        typeof AbortSignal.any === 'function' ? AbortSignal.any([abort.signal, timeoutSignal]) : abort.signal
      const res = await fetch('/api/directions', { method: 'POST', body, signal })
      const json = await res.json().catch(() => null)
      if (abort.signal.aborted) return null
      if (json?.status === 'error' || json?.status !== 'ok') {
        setDirections([])
        setSelectedDirectionId(null)
        return null
      }
      const next = Array.isArray(json.directions)
        ? (json.directions as DirectionChoice[]).filter(
            (item) => item && item.title && item.description && item.english_prompt,
          )
        : []
      if (!next.length) {
        setDirections([])
        setSelectedDirectionId(null)
        return null
      }
      setDirections(next)
      setSelectedDirectionId(next[0]?.id ?? null)
      setIterateText((current) => (current.trim() ? current : jokeLine(next[0]!)))
      track('photo_analyzed', { feature: next[0]?.focus ?? '', score: next.length })
      return next
    } catch {
      if (abort.signal.aborted) return null
      setDirections([])
      setSelectedDirectionId(null)
      return null
    } finally {
      if (analyzeAbortRef.current === abort) setAnalyzing(false)
    }
  }

  const selectedDirection = directions.find((item) => item.id === selectedDirectionId) ?? null
  const hasTweak = Boolean(iterateText.trim())
  const readyForFirstDraw = !result && hasTweak
  const readyToRedraw = Boolean(result) && Boolean(originalPrompt)
  const canGenerate = Boolean(file) && !loading && (readyForFirstDraw || readyToRedraw)
  const showJokeBox = Boolean(file)
  // 出图阶段（生成中/有结果）切换成"原图小、成品大"：这一屏的主角是成品，原图只做对照。
  // 空态仍是两等分，上传是第一步动作，不能被挤小。
  const resultFocused = loading || Boolean(result)
  const freeRemaining = quota?.freeRemaining ?? 1
  const paidCredits = quota?.paidCredits ?? 0
  const needsPay = freeRemaining < 1 && paidCredits < 1
  const packs = quota?.packs ?? []
  const creditTtlDays = quota?.creditTtlDays ?? 0
  const generationsNeverExpire = creditTtlDays <= 0
  const ttlLabel =
    creditTtlDays >= 365
      ? `${Math.round(creditTtlDays / 365)} year${Math.round(creditTtlDays / 365) > 1 ? 's' : ''}`
      : creditTtlDays > 0
        ? `${creditTtlDays} days`
        : ''

  async function generate(tier: 'free' | 'paid'): Promise<void> {
    const currentFile = fileRef.current
    const note = iterateText.trim()
    const suggestion = selectedDirection ? jokeLine(selectedDirection) : ''
    const unchanged = Boolean(selectedDirection && note === suggestion)
    const direction: DirectionChoice | null = note
      ? {
          id: selectedDirection?.id ?? 'custom',
          title: unchanged ? selectedDirection!.title : note.slice(0, 48),
          description: unchanged ? selectedDirection!.description : note,
          english_prompt: note,
          focus: selectedDirection?.focus || note,
        }
      : null
    if (!currentFile || !styleId || !direction) return
    if (isSensitiveFeatureText(note)) {
      setError(SENSITIVE_TWIST_MESSAGE)
      return
    }
    analyzeAbortRef.current?.abort()
    setAnalyzing(false)
    setError(null)
    setPaywall(false)
    setLoading(true)
    track('generate_started', {
      style: styleId,
      hasTwist: Boolean(note),
      tier,
      feature: direction.focus,
      exaggeration: 0,
    })

    try {
      const body = new FormData()
      body.append('file', currentFile)
      body.append('style', styleId)
      body.append('tier', tier)
      body.append('direction', JSON.stringify(direction))

      const res = await fetch('/api/generate', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(120_000),
      })
      const json = await res.json().catch(() => null)

      if (json?.quota) setQuota(json.quota as QuotaSnapshot)
      if (json?.data?.quota) setQuota(json.data.quota as QuotaSnapshot)

      if (res.status === 402) {
        setPaywall(true)
        track('quota_blocked', { code: json?.error?.code ?? 'PAYMENT_REQUIRED' })
        throw new Error(json?.error?.message ?? 'Unlock a gift to keep generating.')
      }

      if (!res.ok || !json?.ok) {
        throw new Error(
          json?.error?.message ?? `Something went wrong (${res.status}). Please try again.`,
        )
      }

      setResult(json.data as GenerationResult)
      const returnedPrompt = typeof json.data?.prompt === 'string' ? json.data.prompt : ''
      setOriginalPrompt(returnedPrompt || direction.english_prompt)
      setGeneratedDirectionId(direction.id)
      if (note) {
        setIterateHistory((prev) =>
          prev[prev.length - 1]?.text === note ? prev : [...prev, { text: note }],
        )
      }
      track('generation_success', { style: styleId, tier })
    } catch (e) {
      const timedOut =
        (e instanceof DOMException && e.name === 'TimeoutError') ||
        (e instanceof Error && (e.name === 'TimeoutError' || /aborted|timeout/i.test(e.message)))
      const message = timedOut
        ? 'The drawing is taking too long. Cancel and try again — Seedream may still be working.'
        : e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.'
      setError(message)
      track('generation_error', { message })
    } finally {
      setLoading(false)
    }
  }

  function requestGenerate(tier: 'free' | 'paid'): void {
    if (!hasTweak) {
      setError('Type the joke you want, then generate.')
      return
    }
    void generate(tier)
  }

  async function iterateGenerate(tier: 'free' | 'paid'): Promise<void> {
    const currentFile = fileRef.current
    const typed = iterateText.trim()
    const feedback =
      typed || '表情再夸张一点，人必须好看像本人，不要皱纹变老变丑'
    if (!currentFile || !originalPrompt) return
    if (typed && isSensitiveFeatureText(typed)) {
      setError(SENSITIVE_TWIST_MESSAGE)
      return
    }
    setError(null)
    setPaywall(false)
    setLoading(true)
    try {
      const body = new FormData()
      body.append('file', currentFile)
      body.append('style', styleId)
      body.append('tier', tier)
      body.append('originalPrompt', originalPrompt)
      body.append('history', JSON.stringify(iterateHistory))
      body.append('newFeedback', feedback)
      if (result?.outputUrl) body.append('previousOutput', result.outputUrl)
      const res = await fetch('/api/generate/iterate', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(120_000),
      })
      const json = await res.json().catch(() => null)
      if (json?.quota) setQuota(json.quota as QuotaSnapshot)
      if (json?.data?.quota) setQuota(json.data.quota as QuotaSnapshot)
      if (res.status === 402) {
        setPaywall(true)
        throw new Error(json?.error?.message ?? 'Unlock a gift to keep generating.')
      }
      if (!res.ok || !json?.ok) {
        throw new Error(
          json?.error?.message ?? `Something went wrong (${res.status}). Please try again.`,
        )
      }
      setResult(json.data as GenerationResult)
      setOriginalPrompt(typeof json.data?.prompt === 'string' ? json.data.prompt : originalPrompt)
      setIterateHistory((prev) => (typed ? [...prev, { text: typed }] : prev))
      setIterateText('')
    } catch (e) {
      const timedOut =
        (e instanceof DOMException && e.name === 'TimeoutError') ||
        (e instanceof Error && (e.name === 'TimeoutError' || /aborted|timeout/i.test(e.message)))
      setError(
        timedOut
          ? 'The drawing is taking too long. Cancel and try again — Seedream may still be working.'
          : e instanceof Error
            ? e.message
            : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handlePrimaryGenerate(): void {
    if (needsPay) {
      setPaywall(true)
      setError(
        'You are out of free previews and generations. Get a gift to keep making, or come back tomorrow for another free preview.',
      )
      return
    }
    requestGenerate(paidCredits > 0 ? 'paid' : 'free')
  }

  async function startCheckout(packId?: string): Promise<void> {
    setCheckoutBusy(true)
    setError(null)
    track('checkout_clicked', { packId: packId ?? 'default' })
    try {
      const res = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message ?? 'Checkout is not available yet.')
      }
      const data = (json.data ?? {}) as { url?: string; transactionId?: string }
      await openPaddleCheckout({
        transactionId: data.transactionId,
        checkoutUrl: data.url,
        onSuccess: async () => {
          // 站内浮层付款成功：先走 confirm 兜底入账，再拉最新额度（不必整页跳转回站）。
          if (data.transactionId) {
            await fetch('/api/credits/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transactionId: data.transactionId }),
            }).catch(() => undefined)
          }
          const qr = await fetch('/api/quota').then((r) => r.json()).catch(() => null)
          if (qr?.ok && qr.data) {
            setQuota(qr.data as QuotaSnapshot)
            setPaywall(false)
            setError(null)
            track('credits_granted', { source: 'paddle' })
          }
        },
        onError: (message) => setError(message),
      })
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
      if (!quota?.checkoutEnabled) {
        setError(
          'You are out of generations. Get another gift to keep making keepsakes — full resolution, no watermark, ready to print or send.',
        )
      }
      requestAnimationFrame(() => {
        document.getElementById('gift-packs')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }
    requestGenerate('paid')
  }

  function reset(): void {
    setFile(null)
    clearPreview()
    setStyleId(DEFAULT_STYLE_ID)
    setResult(null)
    setError(null)
    setPaywall(false)
    setDirections([])
    setSelectedDirectionId(null)
    setGeneratedDirectionId(null)
    setOriginalPrompt('')
    setIterateText('')
    setIterateHistory([])
    analyzeAbortRef.current?.abort()
    setAnalyzing(false)
  }

  const primaryLabel = loading
    ? 'Generating…'
    : result
      ? 'Generate again'
      : hasTweak
        ? 'Generate'
        : analyzing
          ? 'Finding a joke…'
          : 'Type a joke, then generate'

  return (
    <div className="space-y-5">
      <div
        className={`grid gap-3 sm:gap-4 ${
          resultFocused ? 'sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]' : 'sm:grid-cols-2'
        }`}
      >
        <div className="flex flex-col gap-2">
          <UploadZone previewUrl={previewUrl} onSelect={handleSelect} onError={setError} />
        </div>

        <div ref={resultRef} className="flex flex-col gap-2">
          <ResultPanel
            loading={loading}
            loadingLine={LOADING_LINES[loadingLine]}
            elapsed={elapsed}
            result={result}
            unlocking={loading}
            analyzing={analyzing && !result && !loading}
            onUnlockHd={result?.tier === 'free' ? () => void unlockHd() : undefined}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="space-y-5">
          {analyzing && !hasTweak ? <AnalysisNarration /> : null}
          {showJokeBox ? (
            <div className="space-y-5">
              <div>
                {iterateHistory.length ? (
                  <div className="mb-3 space-y-1.5">
                    {iterateHistory.map((item, index) => (
                      <button
                        key={`${index}-${item.text}`}
                        type="button"
                        onClick={() => setIterateText(item.text)}
                        className="block w-full rounded-xl border border-border bg-paper px-3 py-2 text-left text-sm text-foreground hover:border-primary/50"
                      >
                        Edit {index + 1}: {item.text}
                      </button>
                    ))}
                  </div>
                ) : null}
                <label htmlFor="iterate" className="mb-2.5 block text-sm font-bold">
                  What&apos;s the joke?
                </label>
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                  This is a meme, so the picture follows the scene you describe. Name one thing already in the photo and push it too far. A suggestion may appear — edit it until the joke is specific.
                </p>
                <input
                  id="iterate"
                  type="text"
                  value={iterateText}
                  maxLength={MAX_TWIST_LENGTH}
                  onChange={(e) => {
                    setIterateText(e.target.value)
                    if (error === SENSITIVE_TWIST_MESSAGE) setError(null)
                  }}
                  placeholder="e.g. huge red lips, giant laugh, playful side-eye"
                  className="input-base"
                />
              </div>
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}

          {(paywall || needsPay) && (
            <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <p className="text-sm font-bold">Unlock the funnier HD model</p>
              <p className="text-sm text-muted-foreground">
                Today&apos;s free preview uses a lighter model: lower resolution, a watermark, and a
                milder look. A gift unlocks the stronger, funnier HD model — full resolution, no
                watermark. Unused generations never expire
                {ttlLabel ? ` (or stay valid for ${ttlLabel} if a time limit is configured)` : ''}.
              </p>
              {quota?.checkoutEnabled && packs.length > 0 && (
                <div id="gift-packs" className="grid gap-2 sm:grid-cols-3">
                  {packs.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => void startCheckout(pack.id)}
                      disabled={checkoutBusy}
                      className="relative flex flex-col items-center rounded-2xl border border-primary/40 bg-paper px-3 py-3.5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lift disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {pack.badge && (
                        <span className="absolute -top-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                          {pack.badge}
                        </span>
                      )}
                      <span className="text-base font-bold leading-tight">
                        {pack.credits} generation{pack.credits === 1 ? '' : 's'}
                      </span>
                      <span className="text-sm font-semibold text-primary">{pack.priceLabel}</span>
                      <span className="text-xs text-muted-foreground">{pack.unitLabel}</span>
                    </button>
                  ))}
                </div>
              )}
              {checkoutBusy && (
                <p className="text-center text-xs text-muted-foreground">Redirecting to checkout…</p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                {quota?.devGrantEnabled && (
                  <button
                    type="button"
                    onClick={() => void grantDevCredit()}
                    disabled={checkoutBusy}
                    className="btn-secondary flex-1"
                  >
                    Add a test gift
                  </button>
                )}
              </div>
              {/* Paddle 域名审核要求：退款政策必须在结账入口处可见 */}
              <p className="text-xs text-muted-foreground">
                Payments are handled by Paddle.com (Merchant of Record). Unused generations are
                refundable within 14 days — see the{' '}
                <Link href="/refund" className="font-medium text-primary underline-offset-2 hover:underline">
                  refund policy
                </Link>
                .
              </p>
            </div>
          )}

          {showJokeBox ? (
            <div className="flex flex-col gap-2.5">
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
            </div>
          ) : result ? (
            <div className="flex gap-2.5">
              <button type="button" onClick={reset} className="btn-secondary flex-1">
                Start over
              </button>
            </div>
          ) : null}

          <p className="text-center text-xs text-muted-foreground">
            {freeRemaining} free preview{freeRemaining === 1 ? '' : 's'} left today (lighter model)
            {paidCredits > 0
              ? ` · ${paidCredits} HD generation${paidCredits === 1 ? '' : 's'} left${generationsNeverExpire ? ' · never expire' : ttlLabel ? ` · valid ${ttlLabel}` : ''}`
              : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
