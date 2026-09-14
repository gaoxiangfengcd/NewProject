import { ApiError, err, genId, ok } from '@repo/common'
import type { AsyncResult, MaybePromise } from '@repo/common'
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'

// Token（JWT）
export interface TokenPayload {
  userId: string
  email?: string
  scopes?: string[]
  iat?: number
  exp?: number
}

export interface SignTokenOpts {
  expiresInSec?: number
  audience?: string
  issuer?: string
}

export async function signToken(payload: TokenPayload, opts?: SignTokenOpts): AsyncResult<string> {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    return err(new ApiError('CONFIG_MISSING', 500, 'JWT_SECRET is not configured'))
  }
  try {
    const key = new TextEncoder().encode(secret)
    const expiresInSec = opts?.expiresInSec ?? 7 * 24 * 60 * 60
    const claims: Record<string, unknown> = {}
    if (payload.email !== undefined) claims.email = payload.email
    if (payload.scopes !== undefined) claims.scopes = payload.scopes
    const builder = new SignJWT(claims)
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.userId)
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSec)
    if (opts?.issuer) builder.setIssuer(opts.issuer)
    if (opts?.audience) builder.setAudience(opts.audience)
    const token = await builder.sign(key)
    return ok(token)
  } catch (e) {
    return err(new ApiError('TOKEN_SIGN_FAILED', 500, 'Failed to sign token', toDetails(e)))
  }
}

export async function verifyToken(
  token: string,
  opts?: { audience?: string; issuer?: string },
): AsyncResult<TokenPayload> {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    return err(new ApiError('CONFIG_MISSING', 500, 'JWT_SECRET is not configured'))
  }
  try {
    const key = new TextEncoder().encode(secret)
    const verifyOpts: { audience?: string; issuer?: string } = {}
    if (opts?.audience) verifyOpts.audience = opts.audience
    if (opts?.issuer) verifyOpts.issuer = opts.issuer
    const { payload } = await jwtVerify(token, key, verifyOpts)
    const userId = payload.sub
    if (!userId) {
      return err(new ApiError('TOKEN_INVALID', 401, 'Token missing subject claim'))
    }
    const result: TokenPayload = {
      userId,
      email: asOptionalString(payload.email),
      scopes: asStringArray(payload.scopes),
    }
    if (payload.iat !== undefined) result.iat = payload.iat
    if (payload.exp !== undefined) result.exp = payload.exp
    return ok(result)
  } catch (e) {
    return err(new ApiError('TOKEN_INVALID', 401, 'Token verification failed', toDetails(e)))
  }
}

// 密码（scrypt，Node 内置 crypto，无需 native build；与 argon2 同级别强度）
export async function hashPassword(password: string): AsyncResult<string> {
  try {
    const salt = randomBytes(16)
    const hash = scryptSync(password, salt, 64)
    return ok(`scrypt$${salt.toString('hex')}$${hash.toString('hex')}`)
  } catch (e) {
    return err(new ApiError('HASH_FAILED', 500, 'Failed to hash password', toDetails(e)))
  }
}

export async function verifyPassword(password: string, stored: string): AsyncResult<boolean> {
  try {
    const parts = stored.split('$')
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return err(new ApiError('INVALID_CREDENTIALS', 401, 'Password verification failed'))
    }
    const salt = Buffer.from(parts[1], 'hex')
    const storedHash = Buffer.from(parts[2], 'hex')
    const hash = scryptSync(password, salt, storedHash.length)
    if (hash.length !== storedHash.length || !timingSafeEqual(hash, storedHash)) {
      return err(new ApiError('INVALID_CREDENTIALS', 401, 'Password verification failed'))
    }
    return ok(true)
  } catch (e) {
    return err(new ApiError('INVALID_CREDENTIALS', 401, 'Password verification failed', toDetails(e)))
  }
}

// 会话（repository 由各 app 自实现并注入，不强绑 ORM）
export interface Session {
  id: string
  userId: string
  createdAt: number
  expiresAt: number
  meta?: Record<string, unknown>
}

export interface SessionRepo {
  create(session: Session): MaybePromise<void>
  find(id: string): MaybePromise<Session | null>
  delete(id: string): MaybePromise<void>
}

export interface CreateSessionOpts {
  userId: string
  ttlSec?: number
  meta?: Record<string, unknown>
}

export async function createSession(opts: CreateSessionOpts, repo: SessionRepo): AsyncResult<Session> {
  try {
    const now = Date.now()
    const ttlSec = opts.ttlSec ?? 30 * 24 * 60 * 60
    const session: Session = {
      id: genId(),
      userId: opts.userId,
      createdAt: now,
      expiresAt: now + ttlSec * 1000,
      meta: opts.meta,
    }
    await Promise.resolve(repo.create(session))
    return ok(session)
  } catch (e) {
    return err(new ApiError('SESSION_CREATE_FAILED', 500, 'Failed to create session', toDetails(e)))
  }
}

export async function destroySession(id: string, repo: SessionRepo): AsyncResult<void> {
  try {
    await Promise.resolve(repo.delete(id))
    return ok(undefined)
  } catch (e) {
    return err(new ApiError('SESSION_DELETE_FAILED', 500, 'Failed to destroy session', toDetails(e)))
  }
}

// OAuth（Google / GitHub / Apple）
export type OAuthProvider = 'google' | 'github' | 'apple'

export interface OAuthUser {
  provider: OAuthProvider
  providerUserId: string
  email?: string
  name?: string
  avatarUrl?: string
}

export interface GetOAuthAuthUrlOpts {
  provider: OAuthProvider
  redirectUri: string
  state: string
  scopes?: string[]
}

const OAUTH_AUTH_BASE_URL: Record<OAuthProvider, string> = {
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  github: 'https://github.com/login/oauth/authorize',
  apple: 'https://appleid.apple.com/auth/authorize',
}

const OAUTH_CLIENT_ID_ENV: Record<OAuthProvider, string> = {
  google: 'GOOGLE_CLIENT_ID',
  github: 'GITHUB_CLIENT_ID',
  apple: 'APPLE_CLIENT_ID',
}

const OAUTH_DEFAULT_SCOPES: Record<OAuthProvider, string[]> = {
  google: ['openid', 'email', 'profile'],
  github: ['read:user', 'user:email'],
  apple: ['email', 'name'],
}

export async function getOAuthAuthUrl(opts: GetOAuthAuthUrlOpts): AsyncResult<string> {
  const envKey = OAUTH_CLIENT_ID_ENV[opts.provider]
  const clientId = process.env[envKey]
  if (!clientId) {
    return err(new ApiError('CONFIG_MISSING', 500, `${envKey} is not configured`))
  }
  const scopes = opts.scopes ?? OAUTH_DEFAULT_SCOPES[opts.provider]
  const url = new URL(OAUTH_AUTH_BASE_URL[opts.provider])
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', opts.redirectUri)
  url.searchParams.set('state', opts.state)
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('response_type', 'code')
  return ok(url.toString())
}

interface GoogleTokenResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
  error?: string
  error_description?: string
}

interface GoogleUserInfo {
  sub?: string
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

interface GitHubTokenResponse {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
  error_uri?: string
}

interface GitHubUser {
  id?: number
  login?: string
  name?: string
  email?: string
  avatar_url?: string
}

export async function exchangeOAuthCode(opts: {
  provider: OAuthProvider
  code: string
  redirectUri: string
}): AsyncResult<OAuthUser> {
  const { provider, code, redirectUri } = opts
  if (provider === 'apple') {
    return err(
      new ApiError('OAUTH_UNSUPPORTED', 400, 'Apple OAuth code exchange is not implemented'),
    )
  }
  try {
    if (provider === 'google') {
      return await exchangeGoogleCode(code, redirectUri)
    }
    return await exchangeGitHubCode(code, redirectUri)
  } catch (e) {
    return err(new ApiError('OAUTH_EXCHANGE_FAILED', 502, 'OAuth code exchange failed', toDetails(e)))
  }
}

async function exchangeGoogleCode(code: string, redirectUri: string): AsyncResult<OAuthUser> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return err(new ApiError('CONFIG_MISSING', 500, 'GOOGLE_CLIENT_ID is not configured'))
  }
  const tokenBody = new URLSearchParams({
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (clientSecret) tokenBody.set('client_secret', clientSecret)
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody.toString(),
  })
  if (!tokenRes.ok) {
    return err(new ApiError('OAUTH_TOKEN_FAILED', 502, 'Failed to exchange Google OAuth code'))
  }
  const tokenData = (await tokenRes.json()) as GoogleTokenResponse
  const accessToken = tokenData.access_token
  if (!accessToken) {
    return err(
      new ApiError('OAUTH_TOKEN_FAILED', 502, 'Google token response missing access_token'),
    )
  }
  const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!userRes.ok) {
    return err(new ApiError('OAUTH_USERINFO_FAILED', 502, 'Failed to fetch Google userinfo'))
  }
  const user = (await userRes.json()) as GoogleUserInfo
  return ok({
    provider: 'google',
    providerUserId: user.sub ?? '',
    email: user.email,
    name: user.name,
    avatarUrl: user.picture,
  })
}

async function exchangeGitHubCode(code: string, redirectUri: string): AsyncResult<OAuthUser> {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return err(new ApiError('CONFIG_MISSING', 500, 'GITHUB_CLIENT_ID is not configured'))
  }
  const tokenBody: Record<string, unknown> = {
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  }
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (clientSecret) tokenBody.client_secret = clientSecret
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenBody),
  })
  if (!tokenRes.ok) {
    return err(new ApiError('OAUTH_TOKEN_FAILED', 502, 'Failed to exchange GitHub OAuth code'))
  }
  const tokenData = (await tokenRes.json()) as GitHubTokenResponse
  const accessToken = tokenData.access_token
  if (!accessToken) {
    return err(
      new ApiError('OAUTH_TOKEN_FAILED', 502, 'GitHub token response missing access_token'),
    )
  }
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': '@repo/auth',
    },
  })
  if (!userRes.ok) {
    return err(new ApiError('OAUTH_USERINFO_FAILED', 502, 'Failed to fetch GitHub user'))
  }
  const user = (await userRes.json()) as GitHubUser
  return ok({
    provider: 'github',
    providerUserId:
      user.id !== undefined ? String(user.id) : (user.login ?? ''),
    email: user.email,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
  })
}

// MFA（TOTP，RFC6238）
export interface MfaEnrollment {
  userId: string
  secret: string
  qrUrl: string
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const TOTP_PERIOD = 30
const TOTP_DIGITS = 6

function base32Encode(buffer: Uint8Array): string {
  let output = ''
  let bits = 0
  let value = 0
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 0x1f]
      bits -= 5
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f]
  }
  while (output.length % 8 !== 0) {
    output += '='
  }
  return output
}

function base32Decode(input: string): Uint8Array {
  const clean = input.replace(/=+$/g, '').toUpperCase()
  const bytes: number[] = []
  let bits = 0
  let value = 0
  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i])
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new Uint8Array(bytes)
}

function generateTotp(key: Uint8Array, counter: number): string {
  const counterBytes = Buffer.alloc(8)
  counterBytes.writeBigUInt64BE(BigInt(counter))
  const hmac = createHmac('sha1', key).update(counterBytes).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  const code = binary % 10 ** TOTP_DIGITS
  return code.toString().padStart(TOTP_DIGITS, '0')
}

export async function mfaEnable(userId: string): AsyncResult<MfaEnrollment> {
  try {
    const secretBytes = randomBytes(20)
    const secret = base32Encode(secretBytes)
    const issuer = process.env.APP_NAME ?? 'app'
    const issuerEnc = encodeURIComponent(issuer)
    const accountEnc = encodeURIComponent(userId)
    const otpauthUrl = `otpauth://totp/${issuerEnc}:${accountEnc}?secret=${secret}&issuer=${issuerEnc}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`
    return ok({ userId, secret, qrUrl: otpauthUrl })
  } catch (e) {
    return err(new ApiError('MFA_ENABLE_FAILED', 500, 'Failed to enable MFA', toDetails(e)))
  }
}

export async function mfaVerify(code: string, secret: string): AsyncResult<boolean> {
  try {
    const key = base32Decode(secret)
    const now = Math.floor(Date.now() / 1000)
    const expected = code.replace(/\s/g, '')
    for (let offset = -1; offset <= 1; offset++) {
      const counter = Math.floor(now / TOTP_PERIOD) + offset
      if (generateTotp(key, counter) === expected) {
        return ok(true)
      }
    }
    return ok(false)
  } catch (e) {
    return err(new ApiError('MFA_VERIFY_FAILED', 500, 'Failed to verify MFA code', toDetails(e)))
  }
}

export async function mfaDisable(userId: string): AsyncResult<void> {
  // 无状态实现：secret 由 app 层持久化，此处仅占位返回 ok。
  void userId
  return ok(undefined)
}

// 用户脱敏（被 compliance 包调用做 GDPR 删除）
export async function anonymizeUser(userId: string): AsyncResult<void> {
  // 无状态实现：实际脱敏由 app 层调用 db 完成，此处仅占位返回 ok。
  void userId
  return ok(undefined)
}

// === 内部工具 ===
function toDetails(e: unknown): unknown {
  if (e instanceof Error) return { name: e.name, message: e.message }
  return String(e)
}

function asOptionalString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined
  return v.filter((x): x is string => typeof x === 'string')
}
