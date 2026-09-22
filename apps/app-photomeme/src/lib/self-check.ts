import { logger } from '@repo/common'
import sharp from 'sharp'
import type { PhotoBriefAnalysis } from './reasoning-engine'

export type GeneratedImageCheck = {
  pass: boolean
  feedback?: string
}

const CHECK_TIMEOUT_MS = 10_000

function extractJsonObject(text: string): Record<string, unknown> | null {
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first < 0 || last <= first) return null
  try {
    return JSON.parse(text.slice(first, last + 1)) as Record<string, unknown>
  } catch {
    try {
      return JSON.parse(text.slice(first, last + 1).replace(/,\s*([}\]])/g, '$1')) as Record<
        string,
        unknown
      >
    } catch {
      return null
    }
  }
}

function asBool(value: unknown, fallback = false): boolean {
  if (value === true || value === 'true' || value === 1) return true
  if (value === false || value === 'false' || value === 0) return false
  return fallback
}

async function checkImageDataUri(buffer: Buffer): Promise<string> {
  const jpeg = await sharp(buffer)
    .rotate()
    .resize(768, 768, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72 })
    .toBuffer()
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`
}

export async function checkGeneratedImage(
  imageBuffer: Buffer,
  originalAnalysis: PhotoBriefAnalysis,
): Promise<GeneratedImageCheck> {
  console.log('[self-check] start, checking image of size:', imageBuffer?.length)
  console.log('[self-check] using key prefix:', process.env.DASHSCOPE_API_KEY?.slice(0, 8))
  const key = (process.env.DASHSCOPE_API_KEY ?? '').trim()
  if (!key) {
    const result = { pass: true }
    console.log('[self-check] verdict:', JSON.stringify(result))
    return result
  }

  const rawUrl = (process.env.DASHSCOPE_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1')
    .trim()
    .replace(/\/+$/, '')
  const url = `${rawUrl}/chat/completions`
  const model = (process.env.DASHSCOPE_ANALYSIS_MODEL ?? 'qwen3-vl-plus').trim() || 'qwen3-vl-plus'

  let dataUri = ''
  try {
    dataUri = await checkImageDataUri(imageBuffer)
  } catch {
    const result = { pass: true }
    console.log('[self-check] verdict:', JSON.stringify(result))
    return result
  }

  const prompt = [
    'Look at this generated caricature. Answer three yes/no questions:',
    '1. Is the image grayscale (black and white only, no color)?',
    '2. If there are 2+ people in the original photo, are BOTH people visibly distorted?',
    '3. Are the head and neck clearly distorted (bigger head, longer neck)?',
    '',
    'Original photo analysis (for people count and who should be exaggerated):',
    JSON.stringify(originalAnalysis),
    '',
    'Output JSON: { "grayscale": true/false, "all_people_distorted": true/false, "structural_distortion": true/false, "feedback": "one short sentence" }',
  ].join('\n')
  console.log('[self-check] prompt sent to Qwen:', prompt)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 220,
        enable_thinking: false,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: dataUri } },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
    })
    const text = await res.text()
    let data: unknown = text
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = text
    }
    console.log('[self-check] raw Qwen response:\n', JSON.stringify(data, null, 2).slice(0, 1500))
    if (!res.ok) {
      logger.warn('self-check request failed', { status: res.status, body: text.slice(0, 240) })
      const result = { pass: true }
      console.log('[self-check] verdict:', JSON.stringify(result))
      return result
    }
    const json = data && typeof data === 'object'
      ? (data as { choices?: { message?: { content?: string | unknown[] } }[] })
      : {}
    const raw = json.choices?.[0]?.message?.content
    const content = Array.isArray(raw)
      ? raw
          .map((part) =>
            typeof part === 'string'
              ? part
              : part && typeof part === 'object' && 'text' in part
                ? String((part as { text?: unknown }).text ?? '')
                : '',
          )
          .join('\n')
      : typeof raw === 'string'
        ? raw
        : ''
    const parsed = extractJsonObject(content)
    if (!parsed) {
      const result = { pass: true }
      console.log('[self-check] verdict:', JSON.stringify(result))
      return result
    }

    const grayscale = asBool(parsed.grayscale, true)
    const allPeople = asBool(parsed.all_people_distorted, true)
    const structural = asBool(parsed.structural_distortion, true)
    const feedback =
      typeof parsed.feedback === 'string' ? parsed.feedback.replace(/\s+/g, ' ').trim().slice(0, 220) : ''
    const pass = grayscale && allPeople && structural
    if (!pass) {
      logger.warn('self-check failed', {
        grayscale,
        all_people_distorted: allPeople,
        structural_distortion: structural,
        feedback,
      })
    }
    const result = pass
      ? { pass: true }
      : { pass: false, feedback: feedback || 'Push grayscale, distort every person, and exaggerate body structure not just expression.' }
    console.log('[self-check] verdict:', JSON.stringify(result))
    return result
  } catch (e) {
    console.error('[self-check] error:', e)
    logger.warn('self-check skipped', {
      message: e instanceof Error ? e.message : String(e),
    })
    const result = { pass: true }
    console.log('[self-check] verdict:', JSON.stringify(result))
    return result
  }
}
