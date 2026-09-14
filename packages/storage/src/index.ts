import { ApiError } from '@repo/common'
import type { AsyncResult } from '@repo/common'
import { LocalProvider } from './providers/local'
import { R2Provider } from './providers/r2'
import { nanoid } from './util'

export interface UploadResult {
  key: string
  url?: string
  etag?: string
}

export interface UploadOpts {
  contentType?: string
  metadata?: Record<string, string>
  public?: boolean
}

export type Content = Buffer | ReadableStream

export interface StorageObject {
  key: string
  lastModified?: Date
}

export interface StorageProvider {
  upload(key: string, content: Content, opts?: UploadOpts): AsyncResult<UploadResult>
  download(key: string): AsyncResult<ReadableStream>
  delete(key: string): AsyncResult<void>
  // 列出指定前缀下的所有对象（孤儿文件清理用）
  listObjects(prefix?: string): AsyncResult<StorageObject[]>
  // GDPR 级联删除用
  deleteByOwner(ownerId: string): AsyncResult<{ deleted: number }>
  getSignedUrl(
    key: string,
    opts: { expiresInSec: number; action: 'get' | 'put' }
  ): AsyncResult<string>
  exists(key: string): AsyncResult<boolean>
}

export function getProvider(): StorageProvider {
  const bucket = process.env.R2_BUCKET
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const publicUrl = process.env.R2_PUBLIC_URL
  if (bucket && accountId && accessKeyId && secretAccessKey) {
    return new R2Provider({
      bucket,
      accountId,
      accessKeyId,
      secretAccessKey,
      publicUrl,
    })
  }
  const localDir = process.env.LOCAL_STORAGE_DIR
  if (localDir) {
    return new LocalProvider(localDir)
  }
  throw new ApiError(
    'CONFIG_MISSING',
    500,
    'No storage provider configured: set R2_* env vars or LOCAL_STORAGE_DIR',
  )
}

// 命名规范
export interface BuildKeyOpts {
  bucket: string
  scope: string
  ownerId: string
  filename: string
}

// 如 "avatars/user_xxx/abc-photo.jpg"。bucket 不进 key，bucket 在 provider 层。
export function buildKey(opts: BuildKeyOpts): string {
  return `${opts.scope}/${opts.ownerId}/${nanoid()}-${opts.filename}`
}
