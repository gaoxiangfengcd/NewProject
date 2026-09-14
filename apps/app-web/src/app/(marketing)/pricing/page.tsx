'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'

interface QuotaInfo {
  freeUsedThisMonth: number
  freeLimit: number
  paidCredits: number
  subscriptionStatus: string
}

const PACK = {
  id: 'credit-6' as const,
  name: 'Credit Pack',
  price: '$9.99',
  credits: '6 credits',
  description: 'Buy once, use anytime. Each credit = one AI hairstyle generation.',
  popular: true,
}

// Paddle.js 全局声明
declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: 'sandbox' | 'production') => void }
      Initialize: (opts: { token: string }) => void
      Checkout: {
        open: (opts: {
          transactionId?: string
          items?: Array<{ priceId: string; quantity: number }>
          customData?: Record<string, unknown>
          settings?: {
            successUrl?: string
            displayMode?: 'overlay' | 'inline'
            theme?: 'light' | 'dark'
          }
          eventCallback?: (e: { name: string; data: unknown }) => void
        }) => void
      }
    }
  }
}

interface MeResponse {
  userId?: string
  quota?: QuotaInfo
}

export default function PricingPage(): React.ReactElement {
  const [authed, setAuthed] = useState(false)
  const [quota, setQuota] = useState<QuotaInfo | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  // 初始化 Paddle.js
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    if (!token) return
    const timer = setInterval(() => {
      if (window.Paddle) {
        clearInterval(timer)
        window.Paddle.Environment.set('sandbox')
        window.Paddle.Initialize({ token })
      }
    }, 200)
    return () => clearInterval(timer)
  }, [])

  const refreshQuota = useCallback(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: MeResponse | null) => {
        if (d) {
          setAuthed(true)
          setQuota(d.quota ?? null)
          setUserId(d.userId ?? null)
        }
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    refreshQuota()
  }, [refreshQuota])

  async function buyCredits(packId: 'credit-6') {
    if (!authed) {
      window.location.href = '/auth/register'
      return
    }
    if (!agreed) {
      setError('Please accept the Terms & Conditions and Refund Policy to continue.')
      return
    }
    setBusy(true)
    setError('')

    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID

    // Mock 模式：没有 API key，直接调后端 mock 加点数
    if (!priceId || !window.Paddle) {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId }),
        })
        const data = (await res.json()) as { url?: string; error?: { message: string } }
        if (!res.ok) {
          setError(data.error?.message ?? 'Failed to start checkout')
          setBusy(false)
          return
        }
        window.location.href = data.url ?? '/account'
        return
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error')
        setBusy(false)
        return
      }
    }

    // 真实 Paddle 模式：用 items + priceId 直接打开 overlay checkout
    // 关键：customData 会自动传递到所有 webhook 事件（包括 transaction.completed）
    // customData 是对象，Paddle 会序列化成 data.custom_data
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId: userId ?? undefined, credits: 6, packId },
      settings: {
        successUrl: `${window.location.origin}/account?purchased=${packId}`,
        displayMode: 'overlay',
        theme: 'light',
      },
      eventCallback: (e) => {
        if (e.name === 'checkout.completed') {
          setBusy(false)
          refreshQuota()
          window.location.href = `/account?purchased=${packId}`
        } else if (e.name === 'checkout.closed') {
          setBusy(false)
        }
      },
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <div className="text-center">
        <p className="eyebrow mb-2">Pricing</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start free. Buy credits only when you need them.
        </p>
      </div>

      {/* 当前额度 */}
      {authed && quota && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-white p-5">
          <p className="eyebrow mb-2">Your balance</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="font-display text-3xl font-semibold">{quota.paidCredits}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Paid credits</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="font-display text-3xl font-semibold">
                {Math.max(0, quota.freeLimit - quota.freeUsedThisMonth)}
              </p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Free this month</p>
            </div>
          </div>
        </div>
      )}

      {!authed && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-white p-5 text-center">
          <p className="font-medium">Free forever — 3 generations per month.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to track your usage and buy credits when you need more.
          </p>
          <Link href="/auth/register" className="btn-primary mt-4 inline-flex text-sm">
            Create free account
          </Link>
        </div>
      )}

      <div className="mt-10 mx-auto max-w-md">
        <div
          className={`card flex flex-col ${
            PACK.popular ? 'border-accent ring-1 ring-accent/30' : ''
          }`}
        >
          {PACK.popular && (
            <span className="mb-2 inline-block self-start rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">
              Most popular
            </span>
          )}
          <h2 className="font-display text-xl font-semibold">{PACK.name}</h2>
          <p className="mt-1 font-display text-3xl font-semibold">{PACK.price}</p>
          <p className="mt-1 text-sm text-muted-foreground">{PACK.credits}</p>
          <p className="mt-2 text-sm text-muted-foreground">{PACK.description}</p>

          {error && (
            <p className="mt-3 text-xs text-destructive">{error}</p>
          )}

          <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-accent"
            />
            <span>
              I have read and agree to the{' '}
              <Link href="/terms" className="text-accent underline underline-offset-2">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link href="/refund" className="text-accent underline underline-offset-2">
                Refund Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="button"
            disabled={busy}
            onClick={() => void buyCredits(PACK.id)}
            className={`mt-4 text-center ${
              PACK.popular ? 'btn-accent' : 'btn-outline'
            }`}
          >
            {!authed
              ? 'Log in to buy'
              : busy
                ? 'Opening checkout…'
                : `Buy ${PACK.credits} — ${PACK.price}`}
          </button>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
        Our order process is conducted by our online reseller{' '}
        <a
          href="https://www.paddle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          Paddle.com
        </a>
        . Paddle.com is the Merchant of Record for all our orders. No subscription — buy credits
        whenever you need them. See our{' '}
        <Link href="/terms" className="text-accent underline underline-offset-2">Terms</Link> and{' '}
        <Link href="/refund" className="text-accent underline underline-offset-2">Refund Policy</Link>.
      </p>
    </div>
  )
}
