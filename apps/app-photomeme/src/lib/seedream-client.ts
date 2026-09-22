import { createHash, createHmac } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'
import { logger } from '@repo/common'

const POLL_LIMIT_MS = 60_000
const POLL_GAP_MS = 2_000
// Seedream 5.0 Pro: doubao-seedream-5-0-pro-260628
const DEFAULT_MODEL = 'doubao-seedream-4-0-250828'
const DEFAULT_ARK =
  'https://ark.cn-beijing.volces.com/api/v3/images/generations'

export type SeedreamResult =
  | { ok: true; url: string; model: string }
  | { ok: false; error: { code: string; details?: unknown } }

type SeedreamConfig = {
  endpoint: string
  accessKey: string
  secretKey: string
  model: string
}

function missingEnvError(names: string[]): { ok: false; error: { code: string; details?: unknown } } {
  const message =
    `Missing ${names.join(', ')}. Set them in .env.local to call 火山引擎 Seedream.`
  console.error('[seedream] config error:', message)
  logger.error('seedream config missing', { names })
  return { ok: false, error: { code: 'SEEDREAM_CONFIG', details: { message } } }
}

export function loadSeedreamConfig():
  | { ok: true; value: SeedreamConfig }
  | { ok: false; error: { code: string; details?: unknown } } {
  const endpoint = (process.env.VOLC_SEEDREAM_ENDPOINT ?? '').trim()
  const accessKey = (process.env.VOLC_ACCESS_KEY ?? '').trim()
  const secretKey = (process.env.VOLC_SECRET_KEY ?? '').trim()
  const model = (process.env.VOLC_SEEDREAM_MODEL ?? '').trim() || DEFAULT_MODEL
  const missing: string[] = []
  if (!endpoint) missing.push('VOLC_SEEDREAM_ENDPOINT')
  if (!accessKey) missing.push('VOLC_ACCESS_KEY')
  const ark = isArkEndpoint(endpoint || DEFAULT_ARK)
  if (!ark && !secretKey) missing.push('VOLC_SECRET_KEY')
  if (missing.length) return missingEnvError(missing)
  if (/^xxx$/i.test(accessKey) || /^xxx$/i.test(endpoint) || (!ark && /^xxx$/i.test(secretKey))) {
    return missingEnvError([
      ark
        ? 'VOLC_ACCESS_KEY / VOLC_SEEDREAM_ENDPOINT are still placeholders (xxx)'
        : 'VOLC_ACCESS_KEY / VOLC_SECRET_KEY / VOLC_SEEDREAM_ENDPOINT are still placeholders (xxx)',
    ])
  }
  return { ok: true, value: { endpoint, accessKey, secretKey, model } }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sha256Hex(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest()
}

function signingKey(secret: string, date: string, region: string, service: string): Buffer {
  const kDate = hmac(secret, date)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, service)
  return hmac(kService, 'request')
}

function isArkEndpoint(endpoint: string): boolean {
  return /ark\.|\/api\/v3\/|images\/generations/i.test(endpoint)
}

function stripDataPrefix(image: string): { mime: string; base64: string; dataUri: string } {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(image)
  if (match) {
    return { mime: match[1] || 'image/jpeg', base64: match[2] || '', dataUri: image }
  }
  if (/^https?:\/\//i.test(image)) {
    return { mime: 'image/jpeg', base64: '', dataUri: image }
  }
  return { mime: 'image/jpeg', base64: image, dataUri: `data:image/jpeg;base64,${image}` }
}

let jimengStyleCache = ''

function loadJimengStyleDataUri(): string {
  if (jimengStyleCache) return jimengStyleCache
  const candidates = [
    join(process.cwd(), 'assets/style-example.jpg'),
    join(process.cwd(), 'apps/app-photomeme/assets/style-example.jpg'),
  ]
  for (const filePath of candidates) {
    try {
      const buf = readFileSync(filePath)
      if (buf.length > 1000) {
        const mime = filePath.endsWith('.png')
          ? 'image/png'
          : filePath.endsWith('.webp')
            ? 'image/webp'
            : 'image/jpeg'
        jimengStyleCache = `data:${mime};base64,${buf.toString('base64')}`
        return jimengStyleCache
      }
    } catch {
      // try next path
    }
  }
  console.warn('[seedream] example style ref missing, falling back to photo-only')
  return ''
}

function jsonStringValue(value: string): string {
  // JSON.stringify on multi-MB data URIs can throw "Maximum call stack size exceeded".
  if (value.length < 50_000) return JSON.stringify(value)
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function arkGenerateBody(model: string, prompt: string, images: string[]): string {
  const base =
    `{"model":${JSON.stringify(model)},` +
    `"prompt":${JSON.stringify(prompt)},` +
    `"size":"2K",` +
    `"response_format":"url",` +
    `"watermark":false`
  if (!images.length) return `${base}}`
  const imageField =
    images.length === 1
      ? jsonStringValue(images[0] ?? '')
      : `[${images.map(jsonStringValue).join(',')}]`
  return `${base},"image":${imageField}}`
}

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
}

function extractUrl(payload: unknown): string {
  const root = asRecord(payload)
  if (!root) return ''
  if (typeof root.url === 'string' && root.url.trim()) return root.url.trim()
  const data = root.data
  if (Array.isArray(data)) {
    const first = asRecord(data[0])
    if (first && typeof first.url === 'string' && first.url.trim()) return first.url.trim()
    if (first && typeof first.b64_json === 'string' && first.b64_json.trim()) {
      return `data:image/png;base64,${first.b64_json.trim()}`
    }
  }
  const nested = asRecord(data)
  if (nested) {
    const urls = nested.image_urls
    if (Array.isArray(urls) && typeof urls[0] === 'string' && urls[0].trim()) return urls[0].trim()
    const b64 = nested.binary_data_base64
    if (Array.isArray(b64) && typeof b64[0] === 'string' && b64[0].trim()) {
      return `data:image/png;base64,${b64[0].trim()}`
    }
    if (typeof nested.url === 'string' && nested.url.trim()) return nested.url.trim()
  }
  return ''
}

function extractTaskId(payload: unknown): string {
  const root = asRecord(payload)
  if (!root) return ''
  const direct = root.task_id ?? root.taskId ?? root.id
  if (typeof direct === 'string' && direct.trim() && !/^http/i.test(direct)) return direct.trim()
  const nested = asRecord(root.data)
  if (!nested) return ''
  const nestedId = nested.task_id ?? nested.taskId ?? nested.id
  return typeof nestedId === 'string' && nestedId.trim() ? nestedId.trim() : ''
}

function extractError(payload: unknown, status: number): string {
  const root = asRecord(payload)
  if (!root) return `Seedream HTTP ${status}`
  const err = asRecord(root.error)
  const message =
    (typeof err?.message === 'string' && err.message) ||
    (typeof root.message === 'string' && root.message) ||
    (typeof root.Message === 'string' && root.Message) ||
    ''
  const code =
    (typeof err?.code === 'string' && err.code) ||
    (typeof root.code === 'string' && root.code) ||
    (typeof root.Code === 'string' && root.Code) ||
    String(status)
  return message ? `Seedream ${code}: ${message}` : `Seedream HTTP ${status}`
}

function volcHeaders(
  config: SeedreamConfig,
  url: URL,
  body: string,
): Record<string, string> {
  if (isArkEndpoint(config.endpoint)) {
    return {
      Authorization: `Bearer ${config.accessKey}`,
      'Content-Type': 'application/json',
    }
  }

  const now = new Date()
  const xDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const datestamp = xDate.slice(0, 8)
  const region = (process.env.VOLC_REGION ?? '').trim() || 'cn-north-1'
  const service = (process.env.VOLC_SERVICE ?? '').trim() || 'cv'
  const payloadHash = sha256Hex(body)
  const signedHeaders = 'content-type;host;x-content-sha256;x-date'
  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${url.host}\n` +
    `x-content-sha256:${payloadHash}\n` +
    `x-date:${xDate}\n`
  const canonicalQuery = [...url.searchParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  const canonicalRequest = [
    'POST',
    url.pathname || '/',
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')
  const credentialScope = `${datestamp}/${region}/${service}/request`
  const stringToSign = [
    'HMAC-SHA256',
    xDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')
  const signature = createHmac('sha256', signingKey(config.secretKey, datestamp, region, service))
    .update(stringToSign, 'utf8')
    .digest('hex')
  return {
    'Content-Type': 'application/json',
    'X-Date': xDate,
    'X-Content-Sha256': payloadHash,
    Authorization:
      `HMAC-SHA256 Credential=${config.accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  }
}

function requestUrl(config: SeedreamConfig, kind: 'generate' | 'poll', taskId = ''): URL {
  const raw = config.endpoint || DEFAULT_ARK
  if (isArkEndpoint(raw)) {
    if (kind === 'poll' && taskId) {
      const base = raw.replace(/\/images\/generations\/?$/, '')
      return new URL(`${base.replace(/\/$/, '')}/images/tasks/${encodeURIComponent(taskId)}`)
    }
    return new URL(raw)
  }
  const url = new URL(raw)
  if (!url.searchParams.get('Action')) {
    url.searchParams.set('Action', kind === 'poll' ? 'CVGetResult' : 'CVProcess')
    url.searchParams.set('Version', '2022-08-31')
  } else if (kind === 'poll') {
    url.searchParams.set('Action', 'CVGetResult')
  }
  return url
}

function generateBody(config: SeedreamConfig, prompt: string, image?: string): string {
  if (isArkEndpoint(config.endpoint)) {
    if (image) {
      const photo = stripDataPrefix(image).dataUri
      return arkGenerateBody(config.model, prompt, [photo])
    }
    return arkGenerateBody(config.model, prompt, [])
  }
  const body: Record<string, unknown> = {
    req_key: config.model,
    prompt,
    return_url: true,
    width: 1024,
    height: 1024,
  }
  if (image) {
    const packed = stripDataPrefix(image)
    if (packed.base64) body.binary_data_base64 = [packed.base64]
    else body.image_urls = [packed.dataUri]
  }
  return JSON.stringify(body)
}

function pollBody(config: SeedreamConfig, taskId: string): string {
  if (isArkEndpoint(config.endpoint)) return JSON.stringify({ task_id: taskId })
  return JSON.stringify({ req_key: config.model, task_id: taskId })
}

async function postJson(
  config: SeedreamConfig,
  url: URL,
  body: string,
): Promise<{ status: number; json: unknown; text: string }> {
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: volcHeaders(config, url, body),
    body,
    signal: AbortSignal.timeout(60_000),
  })
  const text = await res.text().catch(() => '')
  let json: unknown = text
  try {
    json = text ? (JSON.parse(text) as unknown) : null
  } catch {
    json = text
  }
  return { status: res.status, json, text }
}

async function pollForUrl(
  config: SeedreamConfig,
  taskId: string,
  budgetMs = POLL_LIMIT_MS,
): Promise<SeedreamResult> {
  const started = Date.now()
  const limitMs = Math.max(2_000, Math.min(POLL_LIMIT_MS, budgetMs))
  let lastMessage = 'Seedream task is still running'
  while (Date.now() - started < limitMs) {
    await sleep(POLL_GAP_MS)
    const url = requestUrl(config, 'poll', taskId)
    const body = pollBody(config, taskId)
    const method = isArkEndpoint(config.endpoint) ? 'GET' : 'POST'
    console.log('[seedream] polling task', taskId, 'elapsed_ms', Date.now() - started)
    let status = 0
    let json: unknown = null
    let text = ''
    if (method === 'GET') {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${config.accessKey}` },
        signal: AbortSignal.timeout(20_000),
      })
      status = res.status
      text = await res.text().catch(() => '')
      try {
        json = text ? (JSON.parse(text) as unknown) : null
      } catch {
        json = text
      }
    } else {
      const posted = await postJson(config, url, body)
      status = posted.status
      json = posted.json
      text = posted.text
    }
    const imageUrl = extractUrl(json)
    if (imageUrl) return { ok: true, url: imageUrl, model: config.model }
    if (status >= 400) {
      lastMessage = extractError(json, status)
      console.error('[seedream] poll failed:', lastMessage, text.slice(0, 400))
      return { ok: false, error: { code: 'SEEDREAM_FAILED', details: { message: lastMessage } } }
    }
    const root = asRecord(json)
    const nested = asRecord(root?.data)
    const statusText = String(nested?.status ?? root?.status ?? '')
    if (/fail|error/i.test(statusText)) {
      lastMessage = extractError(json, status)
      return { ok: false, error: { code: 'SEEDREAM_FAILED', details: { message: lastMessage } } }
    }
  }
  const message = `Seedream timed out after 60s waiting for task ${taskId}`
  console.error('[seedream]', message)
  return { ok: false, error: { code: 'SEEDREAM_TIMEOUT', details: { message } } }
}

export async function generateSeedreamImage(opts: {
  prompt: string
  image?: string
}): Promise<SeedreamResult> {
  const loaded = loadSeedreamConfig()
  if (!('value' in loaded)) return loaded
  const config = loaded.value
  const model = config.model
  const endpoint = config.endpoint
  const url = requestUrl(config, 'generate')
  const body = generateBody(config, opts.prompt, opts.image)
  console.log('[seedream] model:', model)
  console.log('[seedream] endpoint:', endpoint)
  console.log('[seedream] prompt length:', opts.prompt.length)
  console.log('[seedream] body bytes:', Buffer.byteLength(body))
  console.log('[seedream] has image:', Boolean(opts.image))

  const started = Date.now()
  try {
    const posted = await postJson(config, url, body)
    console.log('[seedream] http status:', posted.status)
    if (posted.status >= 400) {
      const message = extractError(posted.json, posted.status)
      console.error('[seedream] request failed:', message, posted.text.slice(0, 500))
      logger.error('seedream request failed', { status: posted.status, message })
      return { ok: false, error: { code: 'SEEDREAM_FAILED', details: { message } } }
    }
    const imageUrl = extractUrl(posted.json)
    if (imageUrl) return { ok: true, url: imageUrl, model: config.model }
    const taskId = extractTaskId(posted.json)
    if (taskId) {
      const remaining = POLL_LIMIT_MS - (Date.now() - started)
      return pollForUrl(config, taskId, remaining)
    }
    const message =
      extractError(posted.json, posted.status) ||
      'Seedream returned neither an image URL nor a task id'
    console.error('[seedream] unexpected response:', posted.text.slice(0, 500))
    return { ok: false, error: { code: 'SEEDREAM_FAILED', details: { message } } }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[seedream] error:', message)
    logger.error('seedream threw', { message })
    return {
      ok: false,
      error: {
        code: /timeout|aborted/i.test(message) ? 'SEEDREAM_TIMEOUT' : 'SEEDREAM_FAILED',
        details: { message: `Seedream call failed: ${message}` },
      },
    }
  }
}
