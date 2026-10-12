import { setDefaultResultOrder } from 'node:dns'
import sharp from 'sharp'
import type { PhotoBriefAnalysis } from '@/lib/reasoning-engine'
import { generateSeedreamImage } from '@/lib/seedream-client'

try {
  setDefaultResultOrder('ipv4first')
} catch {
  // Node without this API — ignore.
}

const SEEDREAM_MAX_EDGE = 768
const DOWNLOAD_ATTEMPTS = 3
const DOWNLOAD_TIMEOUT_MS = 45_000

async function fetchAsBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('data:')) {
    const base64 = url.slice(url.indexOf(',') + 1)
    return Buffer.from(base64, 'base64')
  }

  let host = 'unknown'
  try {
    host = new URL(url).host
  } catch {
    host = 'invalid-url'
  }

  let lastError: unknown
  for (let attempt = 1; attempt <= DOWNLOAD_ATTEMPTS; attempt++) {
    const started = Date.now()
    try {
      console.log('[seedream] downloading result', { host, attempt })
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'MeMeGo/1.0' },
        signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
      })
      if (!res.ok) throw new Error(`RESULT_FETCH_FAILED:${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      console.log('[seedream] downloaded result', {
        host,
        bytes: buf.length,
        ms: Date.now() - started,
        attempt,
      })
      if (buf.length < 500) throw new Error('RESULT_FETCH_FAILED:empty')
      return buf
    } catch (error) {
      lastError = error
      console.warn('[seedream] download attempt failed', {
        host,
        attempt,
        ms: Date.now() - started,
        message: error instanceof Error ? error.message : String(error),
      })
      if (attempt < DOWNLOAD_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 700 * attempt))
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('RESULT_FETCH_FAILED')
}

async function shrinkInputImage(image: string): Promise<string> {
  if (!image.startsWith('data:')) return image
  const comma = image.indexOf(',')
  if (comma < 0) return image
  const buf = Buffer.from(image.slice(comma + 1), 'base64')
  const out = await sharp(buf)
    .rotate()
    .resize({
      width: SEEDREAM_MAX_EDGE,
      height: SEEDREAM_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toBuffer()
  return `data:image/jpeg;base64,${out.toString('base64')}`
}

export async function executeT2I(opts: {
  prompt: string
  model: string
  analysis?: PhotoBriefAnalysis | null
  inputImage?: string
}): Promise<
  | { ok: true; buffer: Buffer; provider: string; model: string; prompt: string }
  | { ok: false; error: { code: string; details?: unknown } }
> {
  void opts.analysis
  const provider = 'seedream'
  const prompt = opts.prompt
  console.log('[generate] using provider:', provider)
  console.log('[generate] provider:', provider)
  console.log('[generate] model:', opts.model)
  console.log('[seedream] final prompt:\n', prompt)
  console.log('[seedream] calling with prompt length:', prompt.length)
  console.log('[seedream] has input_image:', Boolean(opts.inputImage))

  const result = await generateSeedreamImage({
    prompt,
    image: opts.inputImage ? await shrinkInputImage(opts.inputImage) : opts.inputImage,
  })

  if (!result.ok) {
    console.error('[seedream] error:', result.error)
    return result
  }

  try {
    const outputBuffer = await fetchAsBuffer(result.url)
    console.log('[seedream] image size:', outputBuffer.length)
    console.log('[route] ---- generation done ----')
    return { ok: true, buffer: outputBuffer, provider, model: result.model, prompt }
  } catch (e) {
    console.error('[seedream] fetch error:', e)
    return {
      ok: false,
      error: {
        code: 'RESULT_FETCH_FAILED',
        details: { message: e instanceof Error ? e.message : String(e) },
      },
    }
  }
}
