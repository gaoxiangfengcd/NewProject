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
    '上面这句是梗。梗里点到的人和物件都要画大，点了几个就夸张几个，力度相当，不要只改其中一个。还留在原来的位置，第一眼就要好笑。',
    '彩色铅笔漫画，要趣味，不要可爱插画，不要皮克斯，不要迪士尼，不要所有人同一张大眼睛卡通脸。保留原来的表情和姿势，只把已有特征夸张到能笑。轮廓清楚，颜色饱和，笔触又密又多。只画照片里已有的人或动物。',
    '人要年轻、好看、还是本人。手脚爪子数量必须和照片一致，有几条腿就画几条，禁止多画腿。不要空轮廓，不要写实素描，不要黑白石墨，不要写实照片滤镜。禁止再贴一张别人的大脸。禁止添加放大镜、望远镜、相框、贴纸或任何照片里没有的新道具。',
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
  if (!scene) return jimengStyleWrapper('把照片里最显眼的表情或已有物件画得更大。')
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
    `再改一版：${notes.join('；')}。把已有的笑话点再画大两三倍，一眼能笑。要趣味漫画，不要可爱插画，不要皮克斯脸。手脚爪子数量必须和照片一致，禁止多画腿。修改里点到的人和物件都要同样夸张，点了几个就改几个，不要只改其中一个。颜色要饱和，笔触要密，不要黑白，不要放大镜，不要新物体。`,
  ].join('')
}
