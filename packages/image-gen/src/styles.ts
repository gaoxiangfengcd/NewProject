import type { ImageStyle, ImageStyleId } from './types'

/**
 * 预置风格表。界面文案（中文 label）由各 app 自己维护，
 * 共享包只保留与模型相关的 prompt 约束。
 */
export const IMAGE_STYLES: ImageStyle[] = [
  { id: 'auto', promptSuffix: '' },
  {
    id: 'realistic',
    promptSuffix: 'ultra realistic photograph, natural lighting, sharp focus, high detail, 8k',
  },
  {
    id: 'anime',
    promptSuffix: 'anime style, cel shading, vibrant colors, clean lineart, anime key visual',
  },
  {
    id: 'oil-painting',
    promptSuffix: 'classical oil painting, visible brush strokes, textured canvas, fine art',
  },
  {
    id: 'watercolor',
    promptSuffix: 'delicate watercolor painting, soft color washes, hand-drawn illustration',
  },
  {
    id: 'cyberpunk',
    promptSuffix: 'cyberpunk style, neon lights, futuristic city night, detailed digital art',
  },
  {
    id: '3d-render',
    promptSuffix: '3D render, octane render, soft studio lighting, smooth glossy materials',
  },
  {
    id: 'pixel',
    promptSuffix: 'pixel art, 16-bit retro game style, crisp pixels, limited color palette',
  },
  {
    id: 'line-art',
    promptSuffix: 'clean line art, minimalist ink sketch, monochrome, elegant linework',
  },
]

const STYLE_MAP: Record<ImageStyleId, ImageStyle> = Object.fromEntries(
  IMAGE_STYLES.map((style) => [style.id, style]),
) as Record<ImageStyleId, ImageStyle>

/** 把用户描述与风格约束拼成最终 prompt；auto 风格不加后缀。 */
export function buildStyledPrompt(prompt: string, style?: ImageStyleId): string {
  const suffix = STYLE_MAP[style ?? 'auto']?.promptSuffix ?? ''
  const base = prompt.trim()
  return suffix ? `${base}, ${suffix}` : base
}
