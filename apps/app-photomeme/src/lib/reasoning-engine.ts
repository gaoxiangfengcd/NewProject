import { logger } from '@repo/common'
import type { PhotoScoreReport } from './types'

export type PhotoBriefAnalysis = {
  people_count: number
  people: { id: string; visible_features: string[] }[]
  relationship: { type: string; description: string }
  environment_features: string[]
}

const REASONING_TIMEOUT_MS = 30_000
const FUSION_PREFIX = 'FUSION:'

export function analysisFromReport(report: PhotoScoreReport): PhotoBriefAnalysis {
  const portraits = report.scene.portraits ?? []
  return {
    people_count: portraits.length,
    people: portraits.map((person) => ({
      id: person.id,
      visible_features: person.visible_features,
    })),
    relationship: {
      type: report.scene.relationship || report.scene.photo_dynamic?.type || 'no_clear_relationship',
      description: report.scene.photo_dynamic?.description || '',
    },
    environment_features: (report.scene.important_objects ?? []).filter(
      (item) => !item.startsWith('contact:'),
    ),
  }
}

export function fusionSentenceFromReport(report: PhotoScoreReport): string {
  const raw = report.primary_feature.reason.trim()
  if (!raw.startsWith(FUSION_PREFIX)) return ''
  return raw.slice(FUSION_PREFIX.length).trim()
}

export function withFusionReason(report: PhotoScoreReport, fusion: string): PhotoScoreReport {
  const sentence = cleanFusionSentence(fusion)
  if (!sentence) return report
  return {
    ...report,
    primary_feature: {
      ...report.primary_feature,
      reason: `${FUSION_PREFIX} ${sentence}`,
    },
  }
}

export async function attachFusionIfNeeded(report: PhotoScoreReport): Promise<PhotoScoreReport> {
  if (fusionSentenceFromReport(report)) return report
  const fusion = await reasonAboutFusion(analysisFromReport(report))
  return fusion ? withFusionReason(report, fusion) : report
}

function cleanFusionSentence(raw: string): string {
  const stripped = raw
    .replace(/^```(?:\w+)?/g, '')
    .replace(/```$/g, '')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!stripped) return ''
  if (/\b(megaphone|sound waves?|pressure|bulge|shadow pointing|surface deformation)\b/i.test(stripped)) {
    return ''
  }
  const words = stripped.split(' ')
  return words.slice(0, 40).join(' ')
}

function decodeFeatureLine(raw: string): {
  feature: string
  score: number
  part: string
} {
  const scoreMatch = raw.match(/\[score:(\d+)\]/i)
  const partMatch = raw.match(/\[part:([^\]]+)\]/i)
  return {
    feature: raw
      .replace(/\s\[score:\d+\]/gi, '')
      .replace(/\s\[part:[^\]]+\]/gi, '')
      .replace(/\s\[why:[^\]]+\]/gi, '')
      .trim(),
    score: scoreMatch ? Number(scoreMatch[1]) : 5,
    part: partMatch?.[1]?.trim() || '',
  }
}

function guessPart(feature: string): string {
  const t = feature.toLowerCase()
  if (/\b(hat|cap|brim)\b/.test(t)) return 'hat'
  if (/\bglasses|spectacles\b/.test(t)) return 'glasses'
  if (/\b(scarf|headscarf)\b/.test(t)) return 'headscarf'
  if (/\b(mouth|grin|laugh|smile|lips)\b/.test(t)) return 'mouth'
  if (/\b(eye|gaze|side-eye)\b/.test(t)) return 'eyes'
  if (/\b(jacket|coat|hoodie|shirt|top)\b/.test(t)) return 'clothing'
  if (/\b(hand|pose)\b/.test(t)) return 'hands'
  return 'feature'
}

function parseDynamicFields(description: string): Record<string, string> {
  const fields: Record<string, string> = { text: description }
  for (const chunk of description.split('|')) {
    const trimmed = chunk.trim()
    const match = trimmed.match(/^(Trigger|Flow|Dir|Proximity|Eye):\s*(.+)$/i)
    if (match) fields[match[1].toLowerCase()] = match[2].trim()
    else if (!fields.base) fields.base = trimmed
  }
  return fields
}

function compactAnalysisFromReport(report: PhotoScoreReport) {
  const portraits = report.scene.portraits ?? []
  const fields = parseDynamicFields(report.scene.photo_dynamic?.description || '')
  const potential =
    (report.scene.important_objects ?? [])
      .find((item) => item.startsWith('potential:'))
      ?.slice('potential:'.length) || 'weak'
  return {
    people: portraits.map((person) => ({
      id: person.id,
      key_features: person.visible_features
        .map(decodeFeatureLine)
        .filter((item) => item.feature)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((item) => ({
          part: item.part || guessPart(item.feature),
          desc: item.feature,
          score: item.score,
        })),
    })),
    relationship: {
      type: report.scene.relationship || report.scene.photo_dynamic?.type || 'no_clear_relationship',
      description: fields.base || '',
      trigger: fields.trigger || '',
      emotion_flow: fields.flow || '',
    },
    environment: {
      setting: report.scene.environment,
      potential,
    },
  }
}

export type CreativeDirection = {
  id: string
  title: string
  description: string
  english_prompt: string
  focus: string
}

export class ReasoningError extends Error {
  code: 'REASONING_TIMEOUT' | 'REASONING_FAILED' | 'PARSE_FAILED'
  constructor(code: 'REASONING_TIMEOUT' | 'REASONING_FAILED' | 'PARSE_FAILED', message: string) {
    super(message)
    this.name = 'ReasoningError'
    this.code = code
  }
}

function asDirection(raw: unknown, index: number): CreativeDirection | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const title = typeof o.title === 'string' ? o.title.replace(/\s+/g, ' ').trim() : ''
  const description =
    typeof o.description === 'string' ? o.description.replace(/\s+/g, ' ').trim() : ''
  const english =
    typeof o.english_prompt === 'string' ? o.english_prompt.replace(/\s+/g, ' ').trim() : ''
  const focus = typeof o.focus === 'string' ? o.focus.replace(/\s+/g, ' ').trim() : ''
  const layerSource =
    typeof o.layer_source === 'string' ? o.layer_source.replace(/\s+/g, ' ').trim() : ''
  if (!title || !description || !english) return null
  const id =
    typeof o.id === 'string' && /^d\d+$/i.test(o.id.trim())
      ? o.id.trim().toLowerCase()
      : `d${index + 1}`
  const focusNote = [focus || title, layerSource].filter(Boolean).join(' | ')
  return {
    id,
    title: title.slice(0, 40),
    description: description.slice(0, 180),
    english_prompt: english.slice(0, 280),
    focus: focusNote.slice(0, 120),
  }
}

function parseDirectionsPayload(raw: string): CreativeDirection[] {
  const stripped = raw.replace(/^```(?:json|javascript)?/i, '').replace(/```$/g, '').trim()
  const start = stripped.indexOf('{')
  const end = stripped.lastIndexOf('}')
  if (start < 0 || end <= start) return []
  try {
    const parsed = JSON.parse(stripped.slice(start, end + 1)) as { directions?: unknown }
    if (!Array.isArray(parsed.directions)) return []
    const out: CreativeDirection[] = []
    for (const item of parsed.directions) {
      const direction = asDirection(item, out.length)
      if (!direction) continue
      if (out.some((d) => d.title === direction.title || d.english_prompt === direction.english_prompt)) {
        continue
      }
      out.push({ ...direction, id: `d${out.length + 1}` })
      if (out.length >= 5) break
    }
    return out
  } catch {
    return []
  }
}

export async function reasonCreativeDirections(
  report: PhotoScoreReport,
): Promise<CreativeDirection[]> {
  const input = compactAnalysisFromReport(report)
  console.log('[reasoning] directions input:\n', JSON.stringify(input, null, 2))
  console.log('[reasoning] input size (tokens estimated):', Math.ceil(JSON.stringify(input).length / 4))
  const key = (process.env.DEEPSEEK_API_KEY ?? '').trim()
  if (!key) {
    throw new ReasoningError('REASONING_FAILED', '创意方向生成失败，请稍后重试')
  }

  const url = (
    process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/chat/completions'
  ).trim()
  const model = process.env.DEEPSEEK_REASONING_MODEL || 'deepseek-v4-pro'
  const prompt = [
    'You are a caricature art director. Input is a compact photo analysis: people.key_features, relationship, environment.',
    'Propose 1 creative direction. Only use what is in the JSON. Do not invent objects, sound waves, shadows, horns, or physics.',
    'Tone: affectionate gift caricature (即梦). People stay good-looking. No 嫌弃/丑化/毁容. Playful side-eye, not hostile.',
    '',
    'Cover different categories when the photo supports them. Do not write two directions that are the same joke restated:',
    'A. Person-feature dominant: pick one highest-score key_feature and make it the whole picture.',
    'B. Expression dominant: pick a mouth/eyes/expression feature and exaggerate it into the center of the frame.',
    'C. People-interaction dominant: use relationship as the core. Skip if type is single.',
    'D. Person-environment dominant: let the existing setting join the joke. Skip if environment.potential is no.',
    'E. Multi-layer fusion: combine a key_feature, the relationship, and the setting into one scene.',
    '',
    'Each direction:',
    '- title: Simplified Chinese, 4-8 characters, names the scene',
    '- description: 100% Simplified Chinese. Zero English letters or words. Translate any English feature names first. Do not paste English from the analysis JSON.',
    '- english_prompt: 100% English. Zero Chinese characters. One or two sentences for the image model. Same scene as description. Keep people recognizable.',
    '- focus: short English note of what dominates',
    '- layer_source: e.g. "Layer 1 - p1 hat" / "Layer 2 - relationship" / "Layer 3 - environment" / "Layer 1+2+3"',
    '- Return JSON only, no markdown.',
    '',
    'Output schema:',
    '{"directions":[{"id":"d1","title":"物件吞画面","description":"他的黑色宽檐帽膨胀成画面主角，人几乎被它吞没，只剩眼镜和衣服边缘露出来。","english_prompt":"His black wide-brimmed hat expands into the dominant visual, almost swallowing him, only his glasses and clothing edges remain visible.","focus":"p1 hat as the dominant visual","layer_source":"Layer 1 - p1 hat"}]}',
    '',
    'Analysis JSON:',
    JSON.stringify(input),
  ].join('\n')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(REASONING_TIMEOUT_MS),
    })
    const text = await res.text()
    console.log('[reasoning] directions http status:', res.status)
    let data: unknown = text
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = text
    }
    console.log('[reasoning] directions raw:\n', JSON.stringify(data, null, 2).slice(0, 2000))
    if (!res.ok) {
      logger.warn('direction reasoning request failed', {
        status: res.status,
        body: text.slice(0, 240),
      })
      throw new ReasoningError('REASONING_FAILED', '创意方向生成失败，请稍后重试')
    }
    const json = data && typeof data === 'object'
      ? (data as {
          choices?: { message?: { content?: string | unknown[]; reasoning_content?: string } }[]
        })
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
          .join(' ')
      : typeof raw === 'string'
        ? raw
        : ''
    const reasoning = json.choices?.[0]?.message?.reasoning_content ?? ''
    const parsed = parseDirectionsPayload(content || reasoning)
    if (!parsed.length) {
      throw new ReasoningError('PARSE_FAILED', '创意方向生成失败，请稍后重试')
    }
    return parsed
  } catch (error) {
    if (error instanceof ReasoningError) throw error
    const timedOut =
      error instanceof Error && (error.name === 'TimeoutError' || /timeout|aborted/i.test(error.message))
    console.error('[reasoning] directions error:', timedOut ? 'timeout' : error)
    logger.warn('direction reasoning skipped', {
      message: error instanceof Error ? error.message : String(error),
      timedOut,
    })
    throw new ReasoningError(
      timedOut ? 'REASONING_TIMEOUT' : 'REASONING_FAILED',
      '创意方向生成失败，请稍后重试',
    )
  }
}

const DIRECT_VISION_TIMEOUT_MS = 45_000

const DIRECTIONS_PROMPT = `You are a caricature art director. Look at the photo and propose 1 creative direction for a gift caricature.

STEP 1 — READ THE PHOTO:
- How many people? (1 / 2 / 3+)
- Is there visible interaction between them? (one looking at another, one reacting to another)
- What are the strongest visible features? (expression, action, pose, clothing, environment)

STEP 2 — CHOOSE THE CREATIVE SUBJECT:
- If 2+ people AND there is visible interaction → the INTERACTION is the subject
- If 1 person OR no visible interaction → the strongest EXPRESSION or ACTION is the subject
- If no strong expression/action → fall back to CLOTHING or ENVIRONMENT

STEP 3 — PRIORITY ORDER (highest first):
1. Expression (laughing, side-eye, raised eyebrow, open mouth)
2. Action (hand behind ear, hand on cheek, pointing, leaning)
3. Pose (head tilt, body lean, chin up)
4. Relationship (who is looking at whom, who is reacting to whom)
5. Clothing or accessory (hat, glasses, scarf, jacket)
6. Environment (boat, window, sky)

Never make clothing or environment the dominant subject if a higher-priority feature is present.

STEP 4 — WRITE 1 DIRECTION (not 3):
One joke only. The user will see it as a single editable suggestion, not a set of cards.

ACCURACY FIRST — do not upgrade what you see:
- A mild smile is not 咧嘴大笑 or 牙齿全露 unless the teeth are actually visible.
- A hand by the ear is not 托腮. Name the real gesture.
- Count a person only when their face is visible. A sliver of clothing or color at the edge is not a second person. Never invent a companion.
- Then push that REAL feature on the same person: a slightly bigger head still attached to their body. Never add a second face, a floating head, a portrait inset, or an extra person.

The joke is that real feature pushed bigger. Bad: "巨笑牙齿全露" when the photo is a closed smile. Bad: adding a woman because the style example is a couple. Good: "他把已有的微笑、帽子和眼镜推大，还是这一个人".
Every direction must include the people whose faces are actually visible:
- One visible face means one person. Do not write 另一个人, 旁边的人, or a relationship.
- Two or more visible faces means all of them, each with their own expression.
- Key clothing/accessories (hat, glasses, scarf) that help identity
- Keep the original setting as the stage, like the homepage After example. Do not flatten to blank paper.

The DIRECTION that changes is only the FOCUS — which feature is pushed to the extreme. But the rest of the scene must still be present.

TONE — gift caricature like 即梦, NOT a mean political cartoon:
- Humor is affectionate, cute, and pretty. People stay young and good-looking.
- Exaggerate the smile and eyes. Do NOT age them. Never write 皱纹, 法令纹, 抬头纹, 褶子, 变老, 显老, 丑化.
- Pencil hatching belongs on hair, clothes, and background. Facial skin stays smooth.
- Never write 嫌弃, 丑化, 毁容, 畸形, 狰狞. Side-eye is playful, not hostile.
- Side-eye means round open eyes with pupils flicked toward the other person. Never write 眯眼, 皱眉, 挤眼, or a glare.
- Style target is 黑白石墨铅笔肖像漫画, the homepage After: graphite hatching, exaggerated neck and features, full original scene, people still recognizable. Not a photoreal pencil trace, not anime.
- Do not write 细节清晰 or 服饰细节保留 as a photoreal sketch instruction.

Each direction's description MUST include:
- The number of visible faces, and only those people
- Each of those people's expression
- At least one key clothing or accessory
- 背景保留原场景，画成黑白石墨铅笔肖像漫画，不要改成白纸，不要画成写实素描。不要多画一个人。
If a description does not include all of these, rewrite it.

Do not write 3 alternatives. Pick the single strongest joke.

Each direction must include:
- "title": English, 2-5 words, names the joke. Shown only as a label.
- "description": Simplified Chinese for the image model. One or two sentences. Zero English. Name the real feature already in the photo and enlarge it on that same person. People must look young, cute, and pretty. Write 脸要年轻可爱，不要画老. Never write 皱纹, 变老, 丑化, 毁容, 大头像, 另一张脸.
- "english_prompt": English, 1-2 sentences for the user to read and edit. Same joke as description. Zero Chinese. Keep them young, cute, and pretty. Do not say ugly, old, or wrinkled.
- "based_on": the exact visible feature that is the FOCUS (in English)
- "priority": one of "expression" / "action" / "pose" / "relationship" / "clothing" / "environment"
- "focus": short English note of which feature is pushed to the extreme

HARD RULES:
- NO INVENTED OBJECTS: do not add balloons, phones, selfie sticks, telescopes, props, weather, or anything not in the photo.
- Do not use metaphors that name another object (e.g. "eye mask like a balloon"). Enlarge the real item; never replace it.
- If a direction cannot name a specific "based_on" feature from the photo, do NOT include it.
- priority should be "expression" or "action" or "relationship" when those are visible.

Good (complete scene, playful, both people):
{
  "title": "Bigger glasses",
  "description": "两人戴着眼镜微笑合影。把已有的微笑和眼镜比例拉开，人要好看、还是本人，不要变老不要皱纹。吉祥物和夜景都还在，黑白石墨铅笔肖像漫画。",
  "english_prompt": "Push the smile and glasses they already have. Keep both people good-looking. Keep the mascot and the night scene.",
  "based_on": "man's laugh and woman's side-eye",
  "priority": "relationship"
}

Output JSON only. Do not include any thinking process.
{"directions":[{"id":"d1","title":"...","description":"...","english_prompt":"...","based_on":"...","priority":"expression","focus":"..."}]}`

function messageText(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (!Array.isArray(raw)) return ''
  return raw
    .map((part) =>
      typeof part === 'string'
        ? part
        : part && typeof part === 'object' && 'text' in part
          ? String((part as { text?: unknown }).text ?? '')
          : '',
    )
    .join(' ')
}

function parseDirectionsFromDeepSeek(data: unknown): CreativeDirection[] {
  const json =
    data && typeof data === 'object'
      ? (data as {
          choices?: { message?: { content?: unknown; reasoning_content?: unknown } }[]
        })
      : {}
  const message = json.choices?.[0]?.message
  const content = messageText(message?.content)
  const reasoning = typeof message?.reasoning_content === 'string' ? message.reasoning_content : ''
  console.log('[reasoning] content length:', content.length)
  console.log('[reasoning] reasoning length:', reasoning.length)
  const fromContent = parseDirectionsPayload(content)
  if (fromContent.length) return fromContent
  return parseDirectionsPayload(reasoning)
}

export async function getDirectionsFromDeepSeek(imageBuffer: Buffer): Promise<CreativeDirection[]> {
  const start = Date.now()
  console.log('[directions] mode:', process.env.ANALYSIS_MODE || 'deepseek_direct')
  console.log('[directions] image size:', imageBuffer.length)

  const key = (process.env.DEEPSEEK_API_KEY ?? '').trim()
  if (!key) {
    throw new ReasoningError('REASONING_FAILED', '创意方向生成失败，请稍后重试')
  }

  const url = (
    process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/chat/completions'
  ).trim()
  const base64 = imageBuffer.toString('base64')
  const dataUrl = `data:image/jpeg;base64,${base64}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-flash',
        max_tokens: 4000,
        thinking: { type: 'disabled' },
        enable_thinking: false,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: DIRECTIONS_PROMPT },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(DIRECT_VISION_TIMEOUT_MS),
    })
    const text = await res.text()
    console.log('[reasoning] direct vision http status:', res.status)
    let data: unknown = text
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = text
    }
    console.log('[reasoning] direct vision raw:\n', JSON.stringify(data, null, 2).slice(0, 2000))
    if (!res.ok) {
      logger.warn('direct vision direction request failed', {
        status: res.status,
        body: text.slice(0, 240),
      })
      throw new ReasoningError('REASONING_FAILED', '创意方向生成失败，请稍后重试')
    }
    const parsed = parseDirectionsFromDeepSeek(data)
    if (!parsed.length) {
      throw new ReasoningError('PARSE_FAILED', '创意方向生成失败，请稍后重试')
    }
    console.log('[directions] deepseek took', Date.now() - start, 'ms')
    console.log('[directions] returned', parsed.length, 'directions')
    return parsed
  } catch (error) {
    if (error instanceof ReasoningError) throw error
    const timedOut =
      error instanceof Error && (error.name === 'TimeoutError' || /timeout|aborted/i.test(error.message))
    console.error('[reasoning] direct vision error:', timedOut ? 'timeout' : error)
    throw new ReasoningError(
      timedOut ? 'REASONING_TIMEOUT' : 'REASONING_FAILED',
      '创意方向生成失败，请稍后重试',
    )
  }
}

export async function reasonAboutFusion(analysis: PhotoBriefAnalysis): Promise<string> {
  console.log(
    '[reasoning] input analysis:\n',
    JSON.stringify(
      {
        people_count: analysis.people_count,
        people: analysis.people,
        relationship: analysis.relationship,
        environment_features: analysis.environment_features,
      },
      null,
      2,
    ),
  )
  const key = (process.env.DEEPSEEK_API_KEY ?? '').trim()
  if (!key) {
    console.log('[reasoning] final fusion sentence:', '')
    return ''
  }

  const url = (
    process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/chat/completions'
  ).trim()
  const model = process.env.DEEPSEEK_REASONING_MODEL || 'deepseek-v4-pro'
  const prompt = [
    'You are a caricature art director. Read the photo analysis JSON below. Your job is to find ONE fusion point that combines two people\'s most exaggerated features into a single visual joke.',
    '',
    'Rules:',
    '- If 2+ people: the fusion point MUST involve BOTH people. Name who does what to whom.',
    '- Pick the highest-scoring or most visually distinctive feature from each person.',
    '- The fusion point must create a visual contrast or interaction (laughing vs side-eye, big head vs small body, one leaning on the other).',
    '- Output ONE sentence, no more than 40 words, in English.',
    '- Do NOT invent objects, sound waves, shadows, or physics effects.',
    '',
    'Analysis JSON:',
    JSON.stringify(analysis),
    '',
    'Output only the fusion sentence, nothing else.',
  ].join('\n')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(REASONING_TIMEOUT_MS),
    })
    const text = await res.text()
    console.log('[reasoning] http status:', res.status)
    let data: unknown = text
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = text
    }
    console.log('[reasoning] raw DeepSeek response:\n', JSON.stringify(data, null, 2).slice(0, 2000))
    if (!res.ok) {
      logger.warn('fusion reasoning request failed', {
        status: res.status,
        body: text.slice(0, 240),
      })
      console.log('[reasoning] final fusion sentence:', '')
      return ''
    }
    const json = data && typeof data === 'object'
      ? (data as {
          choices?: { message?: { content?: string | unknown[]; reasoning_content?: string } }[]
        })
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
          .join(' ')
      : typeof raw === 'string'
        ? raw
        : ''
    const reasoning = json.choices?.[0]?.message?.reasoning_content ?? ''
    const sentence = cleanFusionSentence(
      content || (reasoning ? reasoning.split('.').slice(-3).join('.').trim() : ''),
    )
    console.log('[reasoning] final sentence:', sentence)
    console.log('[reasoning] final fusion sentence:', sentence)
    return sentence
  } catch (error) {
    console.error('[reasoning] error:', error)
    logger.warn('fusion reasoning skipped', {
      message: error instanceof Error ? error.message : String(error),
    })
    console.log('[reasoning] final fusion sentence:', '')
    return ''
  }
}
