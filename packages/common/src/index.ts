import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

// === 错误 ===
export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: unknown
  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export type Result<T, E = ApiError> = { ok: true; value: T } | { ok: false; error: E }

export type AsyncResult<T> = Promise<Result<T>>

export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

export function err<E = ApiError>(error: E): Result<never, E> {
  return { ok: false, error }
}

// === HTTP 客户端 ===
export interface HttpRequestOpts {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  timeoutMs?: number
  retries?: number
}

export interface HttpClient {
  get(url: string, opts?: Omit<HttpRequestOpts, 'method' | 'body'>): AsyncResult<Response>
  post(url: string, body?: unknown, opts?: Omit<HttpRequestOpts, 'method'>): AsyncResult<Response>
  request(url: string, opts: HttpRequestOpts): AsyncResult<Response>
}

export interface HttpClientOpts {
  baseUrl?: string
  timeoutMs?: number
  retries?: number
  headers?: Record<string, string>
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createClient(opts: HttpClientOpts): HttpClient {
  const baseUrl = opts.baseUrl ?? ''
  const defaultTimeoutMs = opts.timeoutMs ?? 30000
  const defaultRetries = opts.retries ?? 0
  const baseHeaders: Record<string, string> = opts.headers ?? {}

  async function request(url: string, reqOpts: HttpRequestOpts): AsyncResult<Response> {
    const method = reqOpts.method ?? 'GET'
    const headers: Record<string, string> = { ...baseHeaders, ...reqOpts.headers }
    const timeoutMs = reqOpts.timeoutMs ?? defaultTimeoutMs
    const retries = Math.max(0, reqOpts.retries ?? defaultRetries)

    const fullUrl = baseUrl
      ? baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
      : url

    let body: BodyInit | undefined
    const rawBody = reqOpts.body
    if (rawBody !== undefined && rawBody !== null) {
      if (
        typeof rawBody === 'object' &&
        !(rawBody instanceof FormData) &&
        !(rawBody instanceof Blob) &&
        !(rawBody instanceof URLSearchParams) &&
        !(rawBody instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(rawBody)
      ) {
        headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
        body = JSON.stringify(rawBody)
      } else {
        body = rawBody as BodyInit
      }
    }

    const maxAttempts = retries + 1
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let response: Response
      try {
        response = await fetch(fullUrl, {
          method,
          headers,
          body,
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (attempt < retries) {
          await sleep(Math.pow(2, attempt) * 100)
          continue
        }
        return err(
          new ApiError('HTTP_REQUEST_FAILED', 500, message, { url: fullUrl, method }),
        )
      }
      if (response.status >= 500 && attempt < retries) {
        await sleep(Math.pow(2, attempt) * 100)
        continue
      }
      return ok(response)
    }
    return err(
      new ApiError('HTTP_REQUEST_FAILED', 500, 'request failed: retries exhausted'),
    )
  }

  return {
    request,
    get: (url, getOpts = {}) => request(url, { ...getOpts, method: 'GET' }),
    post: (url, body, postOpts = {}) =>
      request(url, { ...postOpts, method: 'POST', body }),
  }
}

// === 日志 ===
export interface Logger {
  info(msg: string, meta?: Record<string, unknown>): void
  warn(msg: string, meta?: Record<string, unknown>): void
  error(msg: string, meta?: Record<string, unknown>): void
  debug(msg: string, meta?: Record<string, unknown>): void
  child(bindings: Record<string, unknown>): Logger
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

function createLogger(bindings: Record<string, unknown>): Logger {
  function emit(
    level: LogLevel,
    msg: string,
    meta: Record<string, unknown> | undefined,
  ): void {
    if (level === 'debug' && process.env.NODE_ENV === 'production') return
    const record = {
      level,
      time: new Date().toISOString(),
      msg,
      ...bindings,
      ...(meta ?? {}),
    }
    const line = JSON.stringify(record)
    switch (level) {
      case 'info':
        console.info(line)
        break
      case 'warn':
        console.warn(line)
        break
      case 'error':
        console.error(line)
        break
      case 'debug':
        console.debug(line)
        break
    }
  }
  return {
    info: (msg, meta) => emit('info', msg, meta),
    warn: (msg, meta) => emit('warn', msg, meta),
    error: (msg, meta) => emit('error', msg, meta),
    debug: (msg, meta) => emit('debug', msg, meta),
    child: (childBindings) => createLogger({ ...bindings, ...childBindings }),
  }
}

export const logger: Logger = createLogger({})

// === 配置加载 ===
export interface ConfigSchema<T> {
  parse(input: unknown): T
}

export function loadConfig<T>(schema: ConfigSchema<T>): T {
  return schema.parse(process.env)
}

// === 通用工具 ===
const ID_ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomId(size = 21): string {
  const bytes = randomBytes(size)
  let id = ''
  for (let i = 0; i < size; i++) {
    id += ID_ALPHABET[bytes[i] & 63]
  }
  return id
}

export function genId(prefix?: string): string {
  const id = randomId(21)
  return prefix ? `${prefix}_${id}` : id
}

export interface WebhookVerifyOpts {
  algorithm?: string
  encoding?: 'hex' | 'base64'
  toleranceSec?: number
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
  opts?: WebhookVerifyOpts,
): boolean {
  const algorithm = opts?.algorithm ?? 'sha256'
  const encoding = opts?.encoding ?? 'hex'
  const expected = createHmac(algorithm, secret).update(rawBody).digest()
  const received = Buffer.from(signature, encoding)
  if (expected.length !== received.length) return false
  return timingSafeEqual(expected, received)
}

export type MaybePromise<T> = T | Promise<T>

// === PII 打码（用于日志不泄露） ===
export function maskEmail(email: string): string {
  if (typeof email !== 'string' || email.length === 0) return '***'
  const at = email.indexOf('@')
  if (at < 1 || at === email.length - 1) return '***'
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (!domain.includes('.')) return '***'
  return `${local[0]}***@${domain}`
}

export function maskPhone(phone: string): string {
  if (typeof phone !== 'string' || phone.length === 0) return '****'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return '****'
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`
}
