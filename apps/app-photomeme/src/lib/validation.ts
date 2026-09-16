/** 图片上传校验（客户端选择后可先做一次，服务端 API 必须再做一次）。 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp'

export interface ImageValidationOk {
  ok: true
  mime: AllowedMimeType
  ext: 'jpg' | 'png' | 'webp'
}

export interface ImageValidationError {
  ok: false
  code: 'TYPE_UNSUPPORTED' | 'FILE_TOO_LARGE'
  message: string
}

export type ImageValidationResult = ImageValidationOk | ImageValidationError

const EXT_BY_MIME: Record<AllowedMimeType, 'jpg' | 'png' | 'webp'> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateImage(file: { type: string; size: number }): ImageValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      ok: false,
      code: 'TYPE_UNSUPPORTED',
      message: 'Please upload a JPG, PNG or WebP image.',
    }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      code: 'FILE_TOO_LARGE',
      message: 'Image must be smaller than 10 MB.',
    }
  }
  const mime = file.type as AllowedMimeType
  return { ok: true, mime, ext: EXT_BY_MIME[mime] }
}
