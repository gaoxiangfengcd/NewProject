import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { DEV_CREDITS_COOKIE, WALLET_COOKIE } from './billing'

export function newWalletId(): string {
  return randomBytes(16).toString('base64url')
}

export function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get('cookie') ?? ''
  const parts = raw.split(';')
  for (const part of parts) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function readWalletId(req: Request): string | null {
  const value = readCookie(req, WALLET_COOKIE)
  if (!value || !/^[A-Za-z0-9_-]{8,64}$/.test(value)) return null
  return value
}

export function ensureWalletId(req: Request): { id: string; created: boolean } {
  const existing = readWalletId(req)
  if (existing) return { id: existing, created: false }
  return { id: newWalletId(), created: true }
}

function cookieBase(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const maxAge = 60 * 60 * 24 * 365
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString()
  return `Path=/; Max-Age=${maxAge}; Expires=${expires}; SameSite=Lax; HttpOnly${secure}`
}

export function applyWalletCookie(res: NextResponse, walletId: string): void {
  res.headers.append('Set-Cookie', `${WALLET_COOKIE}=${encodeURIComponent(walletId)}; ${cookieBase()}`)
}

export function readDevCreditsCookie(req: Request): number {
  const raw = readCookie(req, DEV_CREDITS_COOKIE)
  const n = Number(raw ?? '0')
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

export function applyDevCreditsCookie(res: NextResponse, credits: number): void {
  const n = Math.max(0, Math.floor(credits))
  res.headers.append('Set-Cookie', `${DEV_CREDITS_COOKIE}=${n}; ${cookieBase()}`)
}
