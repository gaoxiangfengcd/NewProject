import sharp from 'sharp'
import type { PhotoBriefAnalysis } from '@/lib/reasoning-engine'
import { generateSeedreamImage } from '@/lib/seedream-client'

const SEEDREAM_MAX_EDGE = 768

async function fetchAsBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('data:')) {
    const base64 = url.slice(url.indexOf(',') + 1)
    return Buffer.from(base64, 'base64')
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`RESULT_FETCH_FAILED:${res.status}`)
  return Buffer.from(await res.arrayBuffer())
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
    let outputBuffer = await fetchAsBuffer(result.url)
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
