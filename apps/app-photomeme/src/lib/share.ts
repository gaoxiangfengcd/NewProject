import 'server-only'
import { randomBytes } from 'node:crypto'
import type { StorageProvider } from '@repo/storage'
import { logger } from '@repo/common'
import type { ExaggerationStyleId } from './styles'

/**
 * 无数据库的分享方案：
 * 每次生成创建一个不可猜的 shareId，对象存储目录布局：
 *   shares/{id}/input.{jpg|png|webp}  原始照片
 *   shares/{id}/output.jpg|png        生成结果（免费预览 jpg，付费成图 png）
 *   shares/{id}/meta.json             元数据（唯一记录源）
 * 清理脚本按 mtime / meta.createdAt 删除超过保留期的目录。
 */
export interface ShareMeta {
  id: string
  style: ExaggerationStyleId
  twist: string | null
  inputKey: string
  outputKey: string
  inputUrl: string
  outputUrl: string
  createdAt: string
  tier?: 'free' | 'paid'
}

export function newShareId(): string {
  // 12 字符 base64url，够短可分享、够随机不可枚举
  return randomBytes(9).toString('base64url')
}

export function shareInputKey(id: string, ext: string): string {
  return `shares/${id}/input.${ext}`
}

export function shareOutputKey(id: string, ext: 'png' | 'jpg' = 'png'): string {
  return `shares/${id}/output.${ext}`
}

export function shareMetaKey(id: string): string {
  return `shares/${id}/meta.json`
}

/** 统一经由本站代理读取：local 流式输出，R2 在路由内 302 直链。 */
export function storageUrl(key: string): string {
  return `/api/storage/${key}`
}

export async function writeShareMeta(
  storage: StorageProvider,
  meta: ShareMeta,
): Promise<void> {
  const result = await storage.upload(
    shareMetaKey(meta.id),
    Buffer.from(JSON.stringify(meta), 'utf8'),
    { contentType: 'application/json' },
  )
  if (!result.ok) {
    logger.error('failed writing share meta', { id: meta.id, message: result.error.message })
  }
}

export async function readShareMeta(
  storage: StorageProvider,
  id: string,
): Promise<ShareMeta | null> {
  // 只允许合法 id，避免路径穿越
  if (!/^[A-Za-z0-9_-]{8,32}$/.test(id)) return null
  const result = await storage.download(shareMetaKey(id))
  if (!result.ok) return null
  try {
    const buffer = Buffer.from(await new Response(result.value).arrayBuffer())
    const parsed = JSON.parse(buffer.toString('utf8')) as Partial<ShareMeta>
    if (
      !parsed.id ||
      !parsed.style ||
      !parsed.inputKey ||
      !parsed.outputKey ||
      !parsed.inputUrl ||
      !parsed.outputUrl ||
      !parsed.createdAt
    ) {
      return null
    }
    return parsed as ShareMeta
  } catch {
    return null
  }
}
