export const MAX_PROMPT_LENGTH = 1000

/**
 * 校验并清洗用户的画面描述：
 * - 必须是非空字符串
 * - 去除 ASCII 控制字符（防 prompt 注入换行/回车等）
 * - 长度限制 1..1000
 * 不合法返回 null，由调用方返回 400。
 */
export function sanitizePrompt(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const cleaned = input
    // 移除 ASCII 控制字符（防 prompt 注入），此处必须使用控制字符正则
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
  if (cleaned.length === 0 || cleaned.length > MAX_PROMPT_LENGTH) return null
  return cleaned
}
