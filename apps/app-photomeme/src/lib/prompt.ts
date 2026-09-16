import type { ExaggerationStyle } from './styles'

/** twist 文案长度上限：输入框 maxLength 与服务端校验共用同一常量。 */
export const MAX_TWIST_LENGTH = 240

/**
 * 风格化夸张 prompt 组装（style 模型）。
 *
 * 身份锁定是硬约束：夸张可以改变比例 / 场景 / 画风，但必须让人物"一眼可认"，
 * 否则产品核心价值（这是我/朋友的梗图）不成立。用户 twist 只做场景补充，
 * 放在风格模板之前，无法覆盖风格与身份约束。
 *
 * 注意：这里刻意不锁 "same pose / same clothing"——风格场景（骑士、宇航员、
 * 动漫主角）本身就需要改变姿态和装扮，锁死会让 scenePrompt 失效。
 */
export function buildExaggerationPrompt(style: ExaggerationStyle, twist?: string): string {
  const parts = [
    twist,
    style.scenePrompt,
    "preserve the person's exact identity and likeness, same face, same hairstyle, one person, instantly recognizable",
    style.stylePrompt,
  ]
  return parts.filter(Boolean).join(', ')
}

/** 过滤控制字符 + 长度约束。返回 null 表示不合法（超长或非字符串）。 */
export function sanitizeTwist(input: unknown): string | null {
  if (input === undefined || input === null || input === '') return ''
  if (typeof input !== 'string') return null
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  if (cleaned.length > MAX_TWIST_LENGTH) return null
  return cleaned
}
