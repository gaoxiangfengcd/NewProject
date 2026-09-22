/**
 * Visual styles used by the UI and generation API.
 *
 * The product's main promise is not "apply a filter". It is:
 * photo -> AI notices the funniest visible thing -> pushes that thing
 * into an unexpected caricature while keeping the people recognizable.
 */
export type ExaggerationStyleId =
  | 'gift-sketch'
  | 'funny-meme'
  | 'dramatic'
  | 'absurd'
  | 'pop-poster'
  | 'anime'
  | 'cartoon-3d'

export const DEFAULT_STYLE_ID: ExaggerationStyleId = 'gift-sketch'

export interface ExaggerationStyle {
  id: ExaggerationStyleId
  emoji: string
  name: string
  tagline: string
  scenePrompt: string
  stylePrompt: string
  strength: number
  ideas: string[]
  houseStyle?: boolean
}

export const EXAGGERATION_STYLES: ExaggerationStyle[] = [
  {
    id: 'gift-sketch',
    emoji: '✏️',
    name: 'Funny Caricature',
    tagline: 'Push their funniest feature way too far',
    scenePrompt:
      'turn the uploaded photo into an unexpected hand-drawn caricature built around the single funniest visible feature, keeping the original scene as the stage for the joke',
    stylePrompt:
      'black-and-white hand-drawn pencil and ink caricature, expressive graphite and pen lines, dense cross-hatching, visible sketch texture, slightly rough handmade contours, editorial cartoon drawing, strong wide-angle and fisheye perspective, exaggerated head and facial proportions where useful, playful visual distortion, high detail, funny rather than cruel, the kind of drawing that makes the viewer laugh before they understand why',
    // Strong enough to allow actual redraw/caricature instead of a light filter.
    strength: 0.88,
    houseStyle: true,
    ideas: [],
  },
  {
    id: 'dramatic',
    emoji: '🎬',
    name: 'Dramatic',
    tagline: 'Turn the joke into a movie moment',
    scenePrompt:
      'reimagine the original scene as an absurdly dramatic cinematic moment built around the selected visual feature',
    stylePrompt:
      'cinematic film still, dramatic rim lighting, lens flare, shallow depth of field, blockbuster color grade, expressive perspective',
    strength: 0.78,
    ideas: [
      'as the star of an absurd movie poster',
      'with an outrageously dramatic camera angle',
      'as if this tiny moment were the climax of an action movie',
      'with an over-the-top cinematic close-up',
    ],
  },
  {
    id: 'pop-poster',
    emoji: '🎨',
    name: 'Pop Poster',
    tagline: 'A bold comic-book version of the joke',
    scenePrompt:
      'reimagine the original photo as a bold comic-book caricature with the selected feature pushed into an unmistakable visual joke',
    stylePrompt:
      'thick black ink outlines, halftone texture, bold poster composition, vibrant print colors, dramatic foreshortening, expressive caricature',
    strength: 0.84,
    ideas: [
      'as the hero of a ridiculous comic-book cover',
      'with an extreme close-up perspective',
      'as a retro screen-printed poster',
      'with an absurdly dramatic action pose',
    ],
  },
  {
    id: 'cartoon-3d',
    emoji: '🧸',
    name: '3D Cartoon',
    tagline: 'A wildly exaggerated animated version',
    scenePrompt:
      'reimagine the people as expressive 3D animated caricatures while keeping the original scene and the selected visual joke recognizable',
    stylePrompt:
      'high-quality 3D animated film render, oversized head, expressive facial exaggeration, rounded shapes, playful perspective, polished materials',
    strength: 0.82,
    ideas: [
      'as a ridiculously oversized-headed animated character',
      'with an extreme wide-angle camera',
      'as a character in a comedy movie',
      'with exaggerated toy-like proportions',
    ],
  },
  {
    id: 'anime',
    emoji: '🌸',
    name: 'Anime',
    tagline: 'Push the photo into an expressive anime scene',
    scenePrompt:
      'reimagine the original photo as an expressive anime caricature while preserving the people, scene, and selected visual joke',
    stylePrompt:
      'anime key visual, clean lineart, expressive facial exaggeration, dramatic perspective, energetic composition, polished cel shading',
    strength: 0.82,
    ideas: [
      'with an absurdly dramatic anime close-up',
      'as the hero of a comedy anime',
      'with exaggerated perspective and speed lines',
      'in an over-the-top reaction shot',
    ],
  },
  {
    id: 'funny-meme',
    emoji: '😂',
    name: 'Funny Meme',
    tagline: 'Maximum visual surprise',
    scenePrompt:
      'turn the original photo into a highly exaggerated visual meme while keeping the selected feature and people recognizable',
    stylePrompt:
      'bold digital illustration, extreme caricature, oversized head, dramatic fisheye perspective, expressive facial distortion, crisp humorous detail',
    strength: 0.86,
    ideas: [
      'with the biggest possible version of the selected feature',
      'as an absurd reaction meme',
      'with extreme fisheye perspective',
      'as if the camera were inches from the face',
    ],
  },
  {
    id: 'absurd',
    emoji: '🌀',
    name: 'Absurd',
    tagline: 'Take the visual joke into surreal territory',
    scenePrompt:
      'push the selected visual feature into a surreal but still recognizable extension of the original scene',
    stylePrompt:
      'surreal editorial illustration, caricature, dramatic perspective, visual paradox, intricate detail, playful absurdity',
    strength: 0.9,
    ideas: [
      'with the selected feature becoming absurdly enormous',
      'with impossible but visually coherent perspective',
      'where the original environment becomes part of the joke',
      'with a surreal visual punchline',
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
