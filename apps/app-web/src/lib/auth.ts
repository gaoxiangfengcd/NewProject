import { signToken, verifyToken } from '@repo/auth'
import { ApiError, err, ok, type AsyncResult } from '@repo/common'
import { NextRequest, NextResponse } from 'next/server'

// 认证复用 @repo/auth 包：signToken / verifyToken。

/** 会话用户（脱敏，仅必要字段）。 */
export interface SessionUser {
  userId: string
  email: string
}

export interface SignInResult {
  token: string
}

/** 会话 cookie 名。 */
export const SESSION_COOKIE = 'session'

/** 从请求 cookie 头中解析出指定 cookie 的值。 */
function readCookie(header: string | null, name: string): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq)
    if (key === name) {
      return decodeURIComponent(trimmed.slice(eq + 1))
    }
  }
  return null
}

/**
 * 从 Request 的 cookie 中解析 JWT，校验后返回 SessionUser。
 * 未登录/无效 token 返回 null（非错误）。
 * 用 @repo/auth.verifyToken。
 */
export async function getSessionFromRequest(
  req: Request,
): AsyncResult<SessionUser | null> {
  const token = readCookie(req.headers.get('cookie'), SESSION_COOKIE)
  if (!token) return ok(null)
  const result = await verifyToken(token)
  if (!result.ok) return ok(null)
  const payload = result.value
  if (!payload.email) return ok(null)
  return ok({ userId: payload.userId, email: payload.email })
}

/**
 * 在 Response 上设置会话 cookie（httpOnly, secure, sameSite=lax）。
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
}

/**
 * 强制鉴权：未登录返回 ApiError（status=401），登录返回 SessionUser。
 * 路由 handler 起始处调用。
 */
export async function requireAuth(req: NextRequest): AsyncResult<SessionUser> {
  const session = await getSessionFromRequest(req)
  if (!session.ok) return session
  if (!session.value) {
    return err(new ApiError('UNAUTHORIZED', 401, 'Login required'))
  }
  return ok(session.value)
}

/**
 * 签发 JWT。调用 @repo/auth.signToken({ userId, email })。
 * 由登录/OAuth 回调路由调用，再 setSessionCookie 写入响应。
 */
export async function signIn(
  userId: string,
  email: string,
): AsyncResult<SignInResult> {
  const issuer = process.env.NEXTAUTH_URL
  const result = await signToken(
    { userId, email },
    { expiresInSec: 7 * 24 * 60 * 60, ...(issuer ? { issuer } : {}) },
  )
  if (!result.ok) return err(result.error)
  return ok({ token: result.value })
}
