'use client'

/**
 * 打开 Paddle Billing 浮层收银台（transactionId）。
 * Dashboard 里 Allowed websites 必须包含当前 origin（含端口），
 * 例如 http://localhost:3001 和 http://127.0.0.1:3001。
 */

type PaddleSdk = {
  Initialize: (opts: { token: string; eventCallback?: (event: unknown) => void }) => void
  Checkout: {
    open: (opts: {
      transactionId?: string
      url?: string
      settings?: { displayMode?: 'overlay' | 'attachment' }
      successCallback?: (data: unknown) => void
      closeCallback?: () => void
    }) => void
  }
  Environment?: { set: (env: 'sandbox' | 'production') => void }
}

declare global {
  interface Window {
    Paddle?: PaddleSdk & { __megoInitialized?: boolean }
  }
}

function clientToken(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '').trim()
}

export function paddleOverlayReady(): boolean {
  return Boolean(clientToken())
}

let loader: Promise<PaddleSdk | null> | null = null

function loadPaddle(): Promise<PaddleSdk | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  const existing = window.Paddle
  if (existing) return Promise.resolve(existing)
  if (loader) return loader

  loader = new Promise((resolve) => {
    const token = clientToken()
    if (!token) {
      resolve(null)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      const Paddle = window.Paddle
      if (!Paddle) {
        resolve(null)
        return
      }
      if (!Paddle.__megoInitialized) {
        if (token.startsWith('test_') && Paddle.Environment?.set) {
          Paddle.Environment.set('sandbox')
        }
        Paddle.Initialize({ token, eventCallback: () => undefined })
        Paddle.__megoInitialized = true
      }
      resolve(Paddle)
    }
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
  return loader
}

export interface OpenCheckoutOpts {
  transactionId?: string
  checkoutUrl?: string
  onSuccess?: (data: unknown) => void
  onClose?: () => void
  onError?: (message: string) => void
}

export async function openPaddleCheckout(opts: OpenCheckoutOpts): Promise<void> {
  const paddle = await loadPaddle()
  if (paddle && opts.transactionId) {
    try {
      paddle.Checkout.open({
        transactionId: opts.transactionId,
        settings: { displayMode: 'overlay' },
        successCallback: (data) => opts.onSuccess?.(data),
        closeCallback: () => opts.onClose?.(),
      })
      return
    } catch {
      // fall through
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const txn = (opts.transactionId ?? '').trim()
  if (origin && /^txn_[A-Za-z0-9]+$/.test(txn)) {
    window.location.assign(`${origin}/?_ptxn=${encodeURIComponent(txn)}`)
    return
  }

  opts.onError?.('Checkout could not open — Paddle is not configured yet.')
}
