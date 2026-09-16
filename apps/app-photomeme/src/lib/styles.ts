/**
 * 夸张风格预设（产品层唯一风格数据源，UI 与 API 共用）。
 *
 * 字段说明：
 * - scenePrompt：主体发生了什么（动作/场景）
 * - stylePrompt：视觉画法约束（材质/光影/画风）
 * - strength：传给模型的 prompt_strength（越大越自由夸张，越小越贴近原图）
 * - ideas：可选 twist 灵感，点击后填入输入框
 */
export type ExaggerationStyleId =
  | 'funny-meme'
  | 'dramatic'
  | 'absurd'
  | 'pop-poster'
  | 'anime'
  | 'cartoon-3d'

/** 主路径默认风格：上传即可生成搞笑图，不必先选 vibe。 */
export const DEFAULT_STYLE_ID: ExaggerationStyleId = 'funny-meme'

export interface ExaggerationStyle {
  id: ExaggerationStyleId
  emoji: string
  name: string
  tagline: string
  scenePrompt: string
  stylePrompt: string
  strength: number
  ideas: string[]
}

export const EXAGGERATION_STYLES: ExaggerationStyle[] = [
  {
    id: 'funny-meme',
    emoji: '😂',
    name: 'Funny Meme',
    tagline: 'Goofy faces, big-head energy',
    scenePrompt:
      'turned into a hilarious viral internet meme, oversized head, exaggerated goofy facial expression, ridiculous body proportions',
    stylePrompt:
      'bold saturated colors, modern internet meme aesthetic, highly detailed digital art',
    strength: 0.75,
    ideas: [
      'riding a giant rubber duck',
      'as a medieval knight who forgot their pants',
      'sneezing a cloud of confetti',
      'covered in pizza',
    ],
  },
  {
    id: 'dramatic',
    emoji: '🎬',
    name: 'Dramatic',
    tagline: 'Star of your own blockbuster',
    scenePrompt:
      'reimagined as the hero of an epic blockbuster movie scene, intense dramatic moment, powerful action pose',
    stylePrompt:
      'cinematic film still, dramatic rim lighting, lens flare, shallow depth of field, blockbuster color grade, photorealistic',
    strength: 0.62,
    ideas: [
      'walking away from a giant explosion',
      'on top of a mountain in a thunderstorm',
      'as a secret agent in a neon city',
      'giving a presidential speech',
    ],
  },
  {
    id: 'absurd',
    emoji: '🌀',
    name: 'Absurd',
    tagline: 'Weird. Surreal. Hilarious.',
    scenePrompt:
      'thrown into a bizarre surreal dream world, impossible and absurd situation, weirdly funny',
    stylePrompt:
      'surrealist art style, dreamlike atmosphere, Salvador Dali inspired, vivid colors, intricate detail',
    strength: 0.82,
    ideas: [
      'head replaced by a giant strawberry',
      'melting into a sofa made of clouds',
      'surrounded by floating goldfish',
      'as a centaur, but the horse is a wiener dog',
    ],
  },
  {
    id: 'pop-poster',
    emoji: '🎨',
    name: 'Pop Poster',
    tagline: 'Bold comic-book poster art',
    scenePrompt:
      'reimagined as a bold comic book pop-art poster hero, dynamic poster pose with dramatic foreshortening',
    stylePrompt:
      'pop art style, thick black ink outlines, halftone dots, vibrant primary colors, vintage screen-printed poster',
    strength: 0.75,
    ideas: [
      'saving the city from a giant rubber chicken',
      'as a retro space ranger',
      'smashing through a brick wall',
      'on a vintage propaganda poster',
    ],
  },
  {
    id: 'anime',
    emoji: '🌸',
    name: 'Anime',
    tagline: 'Main character energy',
    scenePrompt:
      'reimagined as the main character of an anime series, expressive sparkling eyes, dynamic anime action pose',
    stylePrompt:
      'anime key visual, cel shading, clean lineart, vibrant colors, studio-quality anime illustration',
    strength: 0.7,
    ideas: [
      'powering up with a glowing aura',
      'as a student late for the first day of school',
      'holding a legendary glowing sword',
      'under cherry blossoms with wind in their hair',
    ],
  },
  {
    id: 'cartoon-3d',
    emoji: '🧸',
    name: '3D Cartoon',
    tagline: 'Glossy animated-movie look',
    scenePrompt:
      'reimagined as a glossy 3D animated movie character, oversized head, cute exaggerated features, playful expression',
    stylePrompt:
      '3D Pixar-style render, soft studio lighting, smooth subsurface skin shading, rounded toy-like shapes, high-quality animated film',
    strength: 0.7,
    ideas: [
      'as a grumpy tiny sidekick',
      'wearing a tiny golden crown',
      'as an action figure in a toy box',
      'holding a giant lollipop',
    ],
  },
]

const STYLE_MAP: Record<ExaggerationStyleId, ExaggerationStyle> = Object.fromEntries(
  EXAGGERATION_STYLES.map((style) => [style.id, style]),
) as Record<ExaggerationStyleId, ExaggerationStyle>

export function getStyle(id: string): ExaggerationStyle | undefined {
  return STYLE_MAP[id as ExaggerationStyleId]
}

export function getStyleOrDefault(id: string): ExaggerationStyle {
  return getStyle(id) ?? STYLE_MAP[DEFAULT_STYLE_ID]
}
