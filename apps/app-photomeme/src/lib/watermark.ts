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

/** 免费预览最长边，截图也不够当成品发 */
const FREE_MAX_EDGE = 512
const FREE_TILE_RATIO = 0.4
const FREE_TILE_OPACITY = 0.42

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

async function fadedTile(mark: Buffer, targetWidth: number): Promise<{ tile: Buffer; width: number; height: number }> {
  const resized = await sharp(mark)
    .resize({ width: targetWidth, fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .png()
    .toBuffer()

  const meta = await sharp(resized).metadata()
  const width = meta.width ?? targetWidth
  const height = meta.height ?? targetWidth

  const tile = await sharp(resized)
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white" fill-opacity="${FREE_TILE_OPACITY}"/></svg>`,
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer()

  return { tile, width, height }
}

/**
 * 免费档：降分辨率 + 铺满半透明水印。失败时仍返回降清晰度图，绝不回传高清原图。
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
    .jpeg({ quality: 58, mozjpeg: true })
    .toBuffer()

  try {
    const { width, height } = await sharp(preview).metadata()
    if (!width || !height) return preview

    const targetWidth = Math.max(72, Math.round(width * FREE_TILE_RATIO))
    const { tile, width: tw, height: th } = await fadedTile(await loadWatermark(), targetWidth)
    const stepX = Math.max(1, Math.round(tw * 0.78))
    const stepY = Math.max(1, Math.round(th * 0.78))

    const overlays: sharp.OverlayOptions[] = []
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const cropW = Math.min(tw, width - x)
        const cropH = Math.min(th, height - y)
        if (cropW < 8 || cropH < 8) continue
        const input =
          cropW === tw && cropH === th
            ? tile
            : await sharp(tile).extract({ left: 0, top: 0, width: cropW, height: cropH }).png().toBuffer()
        overlays.push({ input, left: x, top: y })
      }
    }

    if (overlays.length === 0) return preview

    return await sharp(preview).composite(overlays).jpeg({ quality: 58, mozjpeg: true }).toBuffer()
  } catch (e) {
    logger.error('tiled watermark failed, using downscaled preview', {
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
