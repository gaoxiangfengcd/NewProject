import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { logger } from '@repo/common'
import type { GenerationTier } from './billing'

/**
 * 给生成结果烧水印。
 *
 * 水印是**预渲染的 PNG 资源**，不是运行时用 SVG <text> 画的——生产镜像是
 * node:22-slim，没有装任何系统字体，librsvg 渲染文字会得到空白。
 * 预渲染资源零字体依赖，且换样式只需替换 assets/watermark.png。
 */
const WATERMARK_CANDIDATES = [
  path.join(process.cwd(), 'assets', 'watermark.png'),
  path.join(process.cwd(), 'apps/app-photomeme/assets/watermark.png'),
]

/**
 * 免费预览参数。
 *
 * 预览是「满意才付」模式的命门：用户必须能看清细节，才能判断这张够不够好、
 * 值不值得送人。所以分辨率给到 1024（足以判断质量，但打印会糊），
 * 水印只在右下角放一枚 —— 满屏平铺的水印会让用户无法评估成品，直接掐死转化。
 */
const FREE_MAX_EDGE = 1024
const FREE_JPEG_QUALITY = 82
const FREE_MARK_RATIO = 0.3
const FREE_MARK_OPACITY = 0.72
const FREE_MARK_MARGIN = 0.035

let cached: Buffer | null = null

async function loadWatermark(): Promise<Buffer> {
  if (cached) return cached

  const errors: string[] = []
  for (const filePath of WATERMARK_CANDIDATES) {
    try {
      cached = await readFile(filePath)
      return cached
    } catch (e) {
      errors.push(`${filePath}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  throw new Error(`watermark asset missing (${errors.join('; ')})`)
}

async function fadedMark(mark: Buffer, targetWidth: number): Promise<Buffer> {
  // watermark.png 是一张大画布、logo 只占一角。不先裁掉空白直接按宽度缩放，
  // logo 会被压成几十像素的噪点。trim 后才是 logo 的真实尺寸。
  let source = mark
  try {
    source = await sharp(mark).trim({ threshold: 12 }).toBuffer()
  } catch {
    // 没有可裁的边就按原图用，别让水印整个挂掉
  }

  const resized = await sharp(source)
    .resize({ width: targetWidth, fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .png()
    .toBuffer()

  const meta = await sharp(resized).metadata()
  const width = meta.width ?? targetWidth
  const height = meta.height ?? targetWidth

  return sharp(resized)
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white" fill-opacity="${FREE_MARK_OPACITY}"/></svg>`,
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer()
}

/**
 * 免费档：可用分辨率 + 右下角单枚水印。
 * 目的是让用户能判断成品质量并愿意付费解锁，同时不能白拿。
 * 失败时仍返回降清晰度图，绝不回传高清原图。
 */
export async function prepareFreePreview(png: Buffer): Promise<Buffer> {
  const preview = await sharp(png)
    .rotate()
    .resize({
      width: FREE_MAX_EDGE,
      height: FREE_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: FREE_JPEG_QUALITY, mozjpeg: true })
    .toBuffer()

  try {
    const { width, height } = await sharp(preview).metadata()
    if (!width || !height) return preview

    const mark = await fadedMark(
      await loadWatermark(),
      Math.max(64, Math.round(width * FREE_MARK_RATIO)),
    )
    const markMeta = await sharp(mark).metadata()
    const mw = markMeta.width ?? 0
    const mh = markMeta.height ?? 0
    if (mw < 8 || mh < 8) return preview

    const margin = Math.round(Math.min(width, height) * FREE_MARK_MARGIN)

    return await sharp(preview)
      .composite([
        {
          input: mark,
          left: Math.max(0, width - mw - margin),
          top: Math.max(0, height - mh - margin),
        },
      ])
      .jpeg({ quality: FREE_JPEG_QUALITY, mozjpeg: true })
      .toBuffer()
  } catch (e) {
    logger.error('preview watermark failed, using plain preview', {
      message: e instanceof Error ? e.message : String(e),
    })
    return preview
  }
}

/** 付费档：原分辨率 PNG，不烧水印。 */
export async function preparePaidOutput(png: Buffer): Promise<Buffer> {
  return sharp(png).rotate().png().toBuffer()
}

export async function prepareGeneratedImage(
  png: Buffer,
  tier: GenerationTier,
): Promise<{ buffer: Buffer; contentType: 'image/jpeg' | 'image/png'; ext: 'jpg' | 'png' }> {
  if (tier === 'paid') {
    return { buffer: await preparePaidOutput(png), contentType: 'image/png', ext: 'png' }
  }
  return { buffer: await prepareFreePreview(png), contentType: 'image/jpeg', ext: 'jpg' }
}
