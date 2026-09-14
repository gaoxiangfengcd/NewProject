import sharp from 'sharp'
import { ApiError, err, ok } from '@repo/common'
import type { AsyncResult } from '@repo/common'

/**
 * 人脸检测结果。
 * - detected: 是否检测到人脸
 * - faceCount: 检测到的人脸数量（用于过滤多人照片）
 * - width / height: 图片原始尺寸
 * - bounds: 主人脸边界框（用于裁剪对齐）
 * - qualityScore: 图像质量评分 0~1（模糊/侧脸会降低）
 *
 * 阶段1 简化：不接 face-api.js，用 sharp 读尺寸后 mock 单人脸。
 */
export interface FaceDetectResult {
  detected: boolean
  faceCount: number
  width: number
  height: number
  bounds?: { x: number; y: number; width: number; height: number }
  qualityScore?: number
}

export type CropResult = { buffer: Buffer; width: number; height: number }

/**
 * 照片综合校验失败原因。
 * - no_face: 未检测到人脸
 * - multiple_faces: 多人照片，发型生成不准
 * - low_quality: 质量过低（模糊/曝光异常）/ 无效图片
 * - side_profile: 侧脸，对齐失败
 */
export type PhotoInvalidReason = 'no_face' | 'multiple_faces' | 'low_quality' | 'side_profile'

export type ValidatePhotoResult = { ok: boolean; reason?: PhotoInvalidReason }

const ACCEPTED_FORMATS = new Set(['jpeg', 'png', 'webp'])

/**
 * 检测图片中的人脸。
 * 阶段1：用 sharp.metadata() 读取尺寸信息，mock 返回单人脸结果。
 * 多人/侧脸/质量过滤留阶段2 接入 face-api.js。
 */
export async function detectFaces(imageBuffer: Buffer): AsyncResult<FaceDetectResult> {
  try {
    const metadata = await sharp(imageBuffer).metadata()
    const width = metadata.width ?? 0
    const height = metadata.height ?? 0
    if (width <= 0 || height <= 0) {
      return err(new ApiError('IMAGE_INVALID', 400, 'Image has no dimensions'))
    }
    return ok({
      detected: true,
      faceCount: 1,
      width,
      height,
      // mock 主人脸边界框：图片中心 60% 区域
      bounds: {
        x: Math.round(width * 0.2),
        y: Math.round(height * 0.2),
        width: Math.round(width * 0.6),
        height: Math.round(height * 0.6),
      },
      qualityScore: 1,
    })
  } catch (e) {
    return err(
      new ApiError(
        'IMAGE_INVALID',
        400,
        'Failed to read image metadata',
        e instanceof Error ? { message: e.message } : { error: String(e) },
      ),
    )
  }
}

/**
 * 按人脸边界框裁剪并对齐。
 * 阶段1：不裁剪，直接返回原图（用 sharp 读尺寸）。
 */
export async function cropAndAlignToFace(
  imageBuffer: Buffer,
  bounds?: { x: number; y: number; width: number; height: number },
): AsyncResult<CropResult> {
  void bounds
  try {
    const metadata = await sharp(imageBuffer).metadata()
    const width = metadata.width ?? 0
    const height = metadata.height ?? 0
    if (width <= 0 || height <= 0) {
      return err(new ApiError('IMAGE_INVALID', 400, 'Image has no dimensions'))
    }
    return ok({ buffer: imageBuffer, width, height })
  } catch (e) {
    return err(
      new ApiError(
        'IMAGE_INVALID',
        400,
        'Failed to read image metadata',
        e instanceof Error ? { message: e.message } : { error: String(e) },
      ),
    )
  }
}

/**
 * 综合校验上传照片是否可用于发型生成。
 * 阶段1：仅验证是有效图片（jpeg/png/webp）。通过则接受所有图片。
 */
export async function validatePhoto(imageBuffer: Buffer): AsyncResult<ValidatePhotoResult> {
  try {
    const metadata = await sharp(imageBuffer).metadata()
    const format = metadata.format
    if (!format || !ACCEPTED_FORMATS.has(format)) {
      return ok({ ok: false, reason: 'low_quality' })
    }
    if (!metadata.width || !metadata.height) {
      return ok({ ok: false, reason: 'low_quality' })
    }
    return ok({ ok: true })
  } catch (e) {
    void e
    return ok({ ok: false, reason: 'low_quality' })
  }
}
