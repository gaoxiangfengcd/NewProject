import type { ExaggerationStyle } from './styles'
import type { PhotoScoreReport } from './types'
import { isSensitiveFeatureText, SENSITIVE_USER_RULES_MESSAGE } from './creative-engine'

/** 用户创作说明长度上限：输入框 maxLength 与服务端校验共用同一常量。 */
export const MAX_TWIST_LENGTH = 400

export const SENSITIVE_TWIST_MESSAGE = SENSITIVE_USER_RULES_MESSAGE

export type TwistParseResult =
  | { ok: true; value: string }
  | { ok: false; code: 'INVALID_TWIST' | 'SENSITIVE_TWIST'; message: string }

function sceneKeepZh(report?: PhotoScoreReport | null): string {
  const env = report?.scene.environment?.trim()
  if (env) return `保留原场景（${env.slice(0, 24)}）`
  return '保留原照片场景'
}

function jimengStyleWrapper(sceneBody: string, report?: PhotoScoreReport | null): string {
  void report
  return [
    sceneBody,
    '上面这句是梗。梗里点名的五官或物件必须比照片大一倍，第一眼就能看出来。',
    '黑白石墨铅笔肖像漫画。只画照片里的人，有几张清晰的脸就画几个人。',
    '轮廓要清楚，脸上不要密排线。人要年轻、可爱、漂亮。禁止再贴一张别人的大脸。',
  ]
    .filter(Boolean)
    .join('')
}

function buildShortSeedreamPrompt(
  report: PhotoScoreReport | null | undefined,
  directionJoke: string,
): string {
  void report
  const scene = directionJoke.replace(/\s+/g, ' ').trim()
  if (!scene) return jimengStyleWrapper('把照片里最显眼的表情或物件放大一倍。')
  if (/[\u4e00-\u9fff]/.test(scene)) return jimengStyleWrapper(scene)
  return jimengStyleWrapper(`梗：${scene}。`)
}

export function buildExaggerationPrompt(
  style: ExaggerationStyle,
  twist?: string,
  tier: 'free' | 'paid' = 'free',
  report?: PhotoScoreReport | null,
): string {
  void style
  void tier
  const userRules = (twist ?? '').trim()
  const directionJoke = userRules.startsWith('DIRECTION:')
    ? userRules.slice('DIRECTION:'.length).trim()
    : userRules

  return buildShortSeedreamPrompt(report, directionJoke)
}

export function promptStrengthForTier(tier: 'free' | 'paid', styleStrength: number): number {
  // Lower strength gives Flux Kontext more room to redraw instead of preserving the photo.
  if (tier === 'paid') return Math.min(0.85, styleStrength)
  return Math.max(0.62, styleStrength - 0.08)
}

export function parseUserCreativeRules(input: unknown): TwistParseResult {
  if (input === undefined || input === null || input === '') return { ok: true, value: '' }
  if (typeof input !== 'string') {
    return { ok: false, code: 'INVALID_TWIST', message: 'Your creative note is invalid.' }
  }
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()

  if (cleaned.startsWith('DIRECTION:')) {
    if (cleaned.length > 800) {
      return { ok: false, code: 'INVALID_TWIST', message: 'Your creative note is too long.' }
    }
    if (isSensitiveFeatureText(cleaned.slice('DIRECTION:'.length))) {
      return { ok: false, code: 'SENSITIVE_TWIST', message: SENSITIVE_TWIST_MESSAGE }
    }
    return { ok: true, value: cleaned }
  }

  if (cleaned.length > MAX_TWIST_LENGTH) {
    return { ok: false, code: 'INVALID_TWIST', message: 'Your creative note is too long.' }
  }
  if (isSensitiveFeatureText(cleaned)) {
    return { ok: false, code: 'SENSITIVE_TWIST', message: SENSITIVE_TWIST_MESSAGE }
  }
  return { ok: true, value: cleaned }
}

/** @deprecated 用 parseUserCreativeRules；保留给旧调用。敏感或超长返回 null。 */
export function sanitizeTwist(input: unknown): string | null {
  const parsed = parseUserCreativeRules(input)
  return parsed.ok ? parsed.value : null
}

export function shouldRedrawFromPhoto(feedback: string): boolean {
  return /丑|老|皱|褶|不像|本人|原图|毁容|难看|气球|去掉|不要加|加一个|发明|换成/.test(feedback)
}

export function buildIteratePrompt(
  originalPrompt: string,
  history: string[],
  newFeedback: string,
): string {
  const notes = [...history, newFeedback].map((item) => item.trim()).filter(Boolean)
  return [
    originalPrompt.trim(),
    `再改一版：${notes.join('；')}。把已有的笑话点再画大两三倍，一眼能笑。不要普通素描，不要新物体。`,
  ].join('')
}
