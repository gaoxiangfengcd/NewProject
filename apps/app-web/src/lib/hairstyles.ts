// 发型库静态数据（MVP 占位图：设计过的渐变卡片；后续替换真实素材只改 image 字段）
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong' | 'diamond'
export type Gender = 'women' | 'men' | 'unisex'
export type HairLength = 'short' | 'medium' | 'long'

export interface Hairstyle {
  id: string
  slug: string
  name: string
  gender: Gender
  length: HairLength
  /** 发给 AI 模型的发型描述（英文：长度/轮廓/刘海/纹理） */
  promptTemplate: string
  /** 适配脸型 */
  suitableFaceShapes: FaceShape[]
  /** 按脸型的解释性推荐文案 */
  reasonByFaceShape: Partial<Record<FaceShape, string>>
  /** 卡片一句话描述 */
  description: string
  /** 占位卡片渐变色（CSS gradient） */
  gradient: string
  popular?: boolean
}

export const FACE_SHAPE_LABELS: Record<FaceShape, string> = {
  oval: 'Oval',
  round: 'Round',
  square: 'Square',
  heart: 'Heart',
  oblong: 'Oblong',
  diamond: 'Diamond',
}

export const HAIRSTYLES: Hairstyle[] = [
  // ============ Women ============
  {
    id: 'w-pixie',
    slug: 'pixie',
    name: 'Pixie',
    gender: 'women',
    length: 'short',
    promptTemplate:
      'a short pixie cut with textured layers on top, closely cropped sides, soft wispy fringe, natural finish',
    suitableFaceShapes: ['oval', 'heart', 'diamond'],
    reasonByFaceShape: {
      oval: 'Highlights balanced proportions and brings focus to your features.',
      heart: 'Adds gentle volume at the nape to balance a narrower chin.',
      diamond: 'Softens cheekbone width with textured fringe framing.',
    },
    description: 'Bold, low-maintenance and effortlessly chic.',
    gradient: 'linear-gradient(150deg,#E8C7C0 0%,#C98E86 100%)',
    popular: true,
  },
  {
    id: 'w-french-bob',
    slug: 'french-bob',
    name: 'French Bob',
    gender: 'women',
    length: 'short',
    promptTemplate:
      'a French bob ending at jaw length with curtain bangs, effortless slightly wavy texture, Parisian style',
    suitableFaceShapes: ['oval', 'round', 'square'],
    reasonByFaceShape: {
      oval: 'A timeless silhouette that complements balanced features.',
      round: 'Jaw-length cut with curtain bangs elongates and slims the face.',
      square: 'Soft waves and curtain fringe gently soften a strong jawline.',
    },
    description: 'Jaw-length Parisian bob with curtain bangs.',
    gradient: 'linear-gradient(150deg,#D9C9E8 0%,#9E84C4 100%)',
    popular: true,
  },
  {
    id: 'w-italian-bob',
    slug: 'italian-bob',
    name: 'Italian Bob',
    gender: 'women',
    length: 'short',
    promptTemplate:
      'an Italian bob with blunt rounded ends at neck length, lots of volume and soft bounce, glossy finish',
    suitableFaceShapes: ['oval', 'round', 'heart'],
    reasonByFaceShape: {
      oval: 'Full rounded ends frame an oval face beautifully.',
      round: 'Length below the chin creates a lengthening effect.',
      heart: 'Volume around the jaw balances a pointed chin.',
    },
    description: 'Neck-length blunt bob with soft, bouncy volume.',
    gradient: 'linear-gradient(150deg,#C9D6E8 0%,#7E9EC4 100%)',
  },
  {
    id: 'w-short-shag',
    slug: 'short-shag',
    name: 'Short Shag',
    gender: 'women',
    length: 'short',
    promptTemplate:
      'a short shag haircut with choppy layered texture, piece-y fringe around the crown, messy rock-and-roll finish',
    suitableFaceShapes: ['square', 'round', 'diamond'],
    reasonByFaceShape: {
      square: 'Choppy layers distract from angular jawlines.',
      round: 'Crown height and texture add length to round faces.',
      diamond: 'Piece-y fringe narrows the look at cheekbone level.',
    },
    description: 'Choppy, textured layers with a cool-girl edge.',
    gradient: 'linear-gradient(150deg,#E8DCC7 0%,#C4A57E 100%)',
  },
  {
    id: 'w-lob',
    slug: 'lob',
    name: 'Lob',
    gender: 'women',
    length: 'medium',
    promptTemplate:
      'a long bob (lob) ending at collarbone length with soft face-framing pieces, center part, sleek glossy texture',
    suitableFaceShapes: ['oval', 'round', 'square', 'heart'],
    reasonByFaceShape: {
      oval: 'The most universally flattering length for oval faces.',
      round: 'Collarbone length with face-framing pieces slims the cheeks.',
      square: 'Soft ends and center part ease strong angles.',
      heart: 'Length around the shoulders balances cheek width.',
    },
    description: 'Collarbone-grazing long bob — the universal favorite.',
    gradient: 'linear-gradient(150deg,#C7E0D6 0%,#7EB89E 100%)',
    popular: true,
  },
  {
    id: 'w-layered-bob',
    slug: 'layered-bob',
    name: 'Layered Bob',
    gender: 'women',
    length: 'medium',
    promptTemplate:
      'a layered bob at chin to shoulder length with stacked layers at the back, side-swept bangs, soft movement',
    suitableFaceShapes: ['square', 'round', 'oblong'],
    reasonByFaceShape: {
      square: 'Stacked layers soften jawline corners.',
      round: 'Side-swept bangs add asymmetry that slims.',
      oblong: 'Width at the sides visually shortens a long face.',
    },
    description: 'Stacked, swingy layers with side-swept bangs.',
    gradient: 'linear-gradient(150deg,#E8C7D4 0%,#C47E9E 100%)',
  },
  {
    id: 'w-wolf-cut',
    slug: 'wolf-cut',
    name: 'Wolf Cut',
    gender: 'women',
    length: 'medium',
    promptTemplate:
      'a wolf cut with short choppy layers at the crown blending into longer wispy ends, curtain bangs, edgy texture',
    suitableFaceShapes: ['round', 'square', 'heart'],
    reasonByFaceShape: {
      round: 'Crown volume lengthens; wispy ends avoid bulk at cheeks.',
      square: 'Soft shaggy layers break up strong angles.',
      heart: 'Wispy ends add width toward the jawline.',
    },
    description: 'Shag-meets-mullet with bold crown layers.',
    gradient: 'linear-gradient(150deg,#D6D6C7 0%,#9EA57E 100%)',
    popular: true,
  },
  {
    id: 'w-shag',
    slug: 'shag',
    name: 'Shag',
    gender: 'women',
    length: 'medium',
    promptTemplate:
      'a medium shag haircut with lots of choppy layers throughout, wispy eyebrow-length fringe, natural wavy texture',
    suitableFaceShapes: ['square', 'round', 'diamond'],
    reasonByFaceShape: {
      square: 'Layered softness counterbalances angular features.',
      round: 'All-over texture adds angles to soft curves.',
      diamond: 'Fringe and layers balance narrow eye line.',
    },
    description: 'Effortless 70s-inspired choppy layers.',
    gradient: 'linear-gradient(150deg,#E8D0C7 0%,#C48A7E 100%)',
  },
  {
    id: 'w-long-layers',
    slug: 'long-layers',
    name: 'Long Layers',
    gender: 'women',
    length: 'long',
    promptTemplate:
      'long hair past the shoulders with soft cascading layers starting at the collarbone, face-framing pieces, glossy smooth finish',
    suitableFaceShapes: ['oval', 'square', 'heart', 'oblong'],
    reasonByFaceShape: {
      oval: 'Cascading layers enhance natural balance.',
      square: 'Face-framing pieces soften a strong jaw.',
      heart: 'Length and layers add fullness below the chin.',
      oblong: 'Horizontal layering adds width to a long face.',
    },
    description: 'Flowing, face-framing layers past the shoulders.',
    gradient: 'linear-gradient(150deg,#C7CDE8 0%,#7E8AC4 100%)',
    popular: true,
  },
  {
    id: 'w-butterfly-cut',
    slug: 'butterfly-cut',
    name: 'Butterfly Cut',
    gender: 'women',
    length: 'long',
    promptTemplate:
      'a butterfly haircut with short rounded face-framing layers that flare like wings at the cheekbones blending into long flowing hair, bouncy blowout',
    suitableFaceShapes: ['round', 'square', 'heart'],
    reasonByFaceShape: {
      round: 'Cheekbone layers lift and slim the face.',
      square: 'Wing-like layers soften square corners.',
      heart: 'Volume at the jaw balances a narrow chin.',
    },
    description: 'Winged face-framing layers on long hair.',
    gradient: 'linear-gradient(150deg,#F0DCCF 0%,#D49E7E 100%)',
    popular: true,
  },
  {
    id: 'w-u-cut',
    slug: 'u-cut',
    name: 'U-Cut',
    gender: 'women',
    length: 'long',
    promptTemplate:
      'long hair cut in a soft U-shaped hemline with minimal layering, thick healthy-looking ends, sleek center-parted style',
    suitableFaceShapes: ['oval', 'oblong', 'diamond'],
    reasonByFaceShape: {
      oval: 'Clean rounded silhouette lets balanced features stand out.',
      oblong: 'Full width at the hemline widens a long face.',
      diamond: 'Smooth lines soften angular cheekbones.',
    },
    description: 'Soft rounded hemline with dense, healthy ends.',
    gradient: 'linear-gradient(150deg,#CFE0DC 0%,#7EB8AC 100%)',
  },
  {
    id: 'w-curtain-bangs',
    slug: 'curtain-bangs',
    name: 'Curtain Bangs',
    gender: 'women',
    length: 'long',
    promptTemplate:
      'long hair with signature curtain bangs parted in the middle, sweeping down to cheekbone length and blending into face-framing layers, soft waves',
    suitableFaceShapes: ['oval', 'round', 'square', 'heart'],
    reasonByFaceShape: {
      oval: 'Face-framing fringe adds effortless chic.',
      round: 'Diagonal sweep visually narrows round cheeks.',
      square: 'Soft curtain fringe masks a strong hairline and jaw.',
      heart: 'Bangs shorten the forehead and balance width.',
    },
    description: 'The fringe that flatters almost every face.',
    gradient: 'linear-gradient(150deg,#E8CFCF 0%,#C47E84 100%)',
    popular: true,
  },

  // ============ Men ============
  {
    id: 'm-buzz-cut',
    slug: 'buzz-cut',
    name: 'Buzz Cut',
    gender: 'men',
    length: 'short',
    promptTemplate:
      'a classic buzz cut, hair clipped very short and even all over with a clean hairline, sharp masculine finish',
    suitableFaceShapes: ['oval', 'square', 'oblong'],
    reasonByFaceShape: {
      oval: 'Clean lines show off a well-proportioned skull.',
      square: 'Reinforces a strong, structured jawline.',
      oblong: 'Minimal hair on top keeps face proportions balanced.',
    },
    description: 'Timeless, low-maintenance and sharp.',
    gradient: 'linear-gradient(150deg,#D8D4CC 0%,#8E887E 100%)',
    popular: true,
  },
  {
    id: 'm-crew-cut',
    slug: 'crew-cut',
    name: 'Crew Cut',
    gender: 'men',
    length: 'short',
    promptTemplate:
      'a classic crew cut, short hair on the sides with slightly longer textured hair on top, neat tapered hairline',
    suitableFaceShapes: ['oval', 'round', 'heart'],
    reasonByFaceShape: {
      oval: 'A clean, balanced everyday cut.',
      round: 'Height on top elongates a round face.',
      heart: 'Shorter sides balance a broader forehead.',
    },
    description: 'Neat taper with subtle length on top.',
    gradient: 'linear-gradient(150deg,#D4D8E0 0%,#8490A8 100%)',
  },
  {
    id: 'm-french-crop',
    slug: 'french-crop',
    name: 'French Crop',
    gender: 'men',
    length: 'short',
    promptTemplate:
      'a French crop with short faded sides and a textured top combed forward into a straight cropped fringe, matte finish',
    suitableFaceShapes: ['round', 'square', 'heart'],
    reasonByFaceShape: {
      round: 'Forward fringe shortens a long forehead and slims.',
      square: 'Texture up top softens angularity.',
      heart: 'Cropped fringe balances a wide forehead.',
    },
    description: 'Textured forward fringe with faded sides.',
    gradient: 'linear-gradient(150deg,#E0D8CC 0%,#B09878 100%)',
  },
  {
    id: 'm-textured-crop',
    slug: 'textured-crop',
    name: 'Textured Crop',
    gender: 'men',
    length: 'short',
    promptTemplate:
      'a textured crop with messy choppy strands on top, low taper fade on the sides, natural matte product finish',
    suitableFaceShapes: ['oval', 'round', 'diamond'],
    reasonByFaceShape: {
      oval: 'Relaxed texture suits balanced features.',
      round: 'Messy height on top adds length.',
      diamond: 'Soft texture balances wide cheekbones.',
    },
    description: 'Messy, modern and easy to style.',
    gradient: 'linear-gradient(150deg,#DCD0CC 0%,#A8847E 100%)',
    popular: true,
  },
  {
    id: 'm-fade',
    slug: 'fade',
    name: 'Fade',
    gender: 'men',
    length: 'short',
    promptTemplate:
      'a sharp skin fade with hair blending seamlessly from bare skin at the temples up to short textured length on top, crisp hairline',
    suitableFaceShapes: ['oval', 'square', 'diamond'],
    reasonByFaceShape: {
      oval: 'Crisp fades highlight proportionate features.',
      square: 'Clean fade complements a strong jaw.',
      diamond: 'Exposed sides slim the cheek area.',
    },
    description: 'Skin-tight fade with crisp lines.',
    gradient: 'linear-gradient(150deg,#D0D4D8 0%,#7E868E 100%)',
  },
  {
    id: 'm-two-block',
    slug: 'two-block',
    name: 'Two Block',
    gender: 'men',
    length: 'medium',
    promptTemplate:
      'a two-block haircut with short trimmed sides and back, longer thick hair on top styled with soft volume and a natural comma fringe',
    suitableFaceShapes: ['oval', 'heart', 'diamond'],
    reasonByFaceShape: {
      oval: 'Contrast between sides and top looks sharp.',
      heart: 'Fullness on top balances a narrow chin.',
      diamond: 'Soft fringe shortens a tapered face.',
    },
    description: 'Trimmed sides, statement length on top.',
    gradient: 'linear-gradient(150deg,#D8CCE0 0%,#9878B0 100%)',
    popular: true,
  },
  {
    id: 'm-curtains',
    slug: 'curtains',
    name: 'Curtains',
    gender: 'men',
    length: 'medium',
    promptTemplate:
      '90s curtains hairstyle with medium-length hair parted in the center, two soft curtain-like fringe panels sweeping past the eyebrows, natural flow',
    suitableFaceShapes: ['oval', 'square', 'oblong'],
    reasonByFaceShape: {
      oval: 'Symmetric framing suits balanced faces.',
      square: 'Soft fringe eases a strong hairline.',
      oblong: 'Brow-grazing fringe shortens a long face.',
    },
    description: 'Center-parted 90s heartthrob fringe.',
    gradient: 'linear-gradient(150deg,#CCD6E0 0%,#7898B8 100%)',
  },
  {
    id: 'm-middle-part',
    slug: 'middle-part',
    name: 'Middle Part',
    gender: 'men',
    length: 'medium',
    promptTemplate:
      'medium-length hair with a clean center part, sleek smooth strands falling evenly on both sides past the ears, polished finish',
    suitableFaceShapes: ['oval', 'round', 'heart'],
    reasonByFaceShape: {
      oval: 'Even, polished framing.',
      round: 'Vertical length slims round cheeks.',
      heart: 'Length around the jaw adds balance.',
    },
    description: 'Sleek, even center-parted length.',
    gradient: 'linear-gradient(150deg,#CCE0D8 0%,#78B09E 100%)',
  },
  {
    id: 'm-wolf-cut',
    slug: 'wolf-cut-men',
    name: 'Wolf Cut',
    gender: 'men',
    length: 'medium',
    promptTemplate:
      'a male wolf cut with shaggy layered mullet texture, shorter choppy crown blending into longer wispy nape, messy natural finish',
    suitableFaceShapes: ['round', 'square', 'heart'],
    reasonByFaceShape: {
      round: 'Crown height and nape length add angles.',
      square: 'Shaggy layers soften hard lines.',
      heart: 'Nape fullness balances the chin.',
    },
    description: 'Shaggy layered mullet energy.',
    gradient: 'linear-gradient(150deg,#E0D4CC 0%,#B89078 100%)',
  },
  {
    id: 'm-long-layers',
    slug: 'long-layers-men',
    name: 'Long Layers',
    gender: 'men',
    length: 'long',
    promptTemplate:
      "men's long hair past the shoulders with soft layered movement, tucked loosely behind the ears, natural flowing texture",
    suitableFaceShapes: ['oval', 'square', 'diamond'],
    reasonByFaceShape: {
      oval: 'Flowing length complements symmetry.',
      square: 'Soft hair around the face eases angles.',
      diamond: 'Layers widen a narrow jaw.',
    },
    description: 'Flowing layered length past shoulders.',
    gradient: 'linear-gradient(150deg,#D0CCE0 0%,#8878B0 100%)',
  },
  {
    id: 'm-slick-back',
    slug: 'slick-back',
    name: 'Slick Back',
    gender: 'men',
    length: 'long',
    promptTemplate:
      'medium-long hair slicked straight back off the face with a glossy wet-look product, strong polished silhouette with slight volume at the front',
    suitableFaceShapes: ['oval', 'oblong', 'diamond'],
    reasonByFaceShape: {
      oval: 'Off-the-face styling shows balanced features.',
      oblong: 'Slick sides avoid widening; back volume balances.',
      diamond: 'Exposes a balanced hairline and cheekbones.',
    },
    description: 'Glossy, polished and swept back.',
    gradient: 'linear-gradient(150deg,#DCD8D0 0%,#A89A88 100%)',
  },
  {
    id: 'm-long-curtains',
    slug: 'long-curtains',
    name: 'Long Curtains',
    gender: 'men',
    length: 'long',
    promptTemplate:
      'long curtains hairstyle with shoulder-length hair parted center, soft layered fringe panels sweeping past the cheekbones, natural wavy flow',
    suitableFaceShapes: ['oval', 'square', 'heart'],
    reasonByFaceShape: {
      oval: 'Romantic framing for balanced faces.',
      square: 'Wavy softness around jawline and temples.',
      heart: 'Cheekbone-level fullness balances the chin.',
    },
    description: 'Shoulder-length wavy center-parted flow.',
    gradient: 'linear-gradient(150deg,#DCCFD6 0%,#B08498 100%)',
  },
]

// ============ 查询函数 ============

export function getHairstyleById(id: string): Hairstyle | undefined {
  return HAIRSTYLES.find((h) => h.id === id || h.slug === id)
}

export interface ListHairstylesOpts {
  gender?: Gender
  length?: HairLength
  q?: string
}

export function listHairstyles(opts: ListHairstylesOpts = {}): Hairstyle[] {
  const { gender, length, q } = opts
  const query = q?.trim().toLowerCase()
  return HAIRSTYLES.filter((h) => {
    if (gender && h.gender !== gender && h.gender !== 'unisex') return false
    if (length && h.length !== length) return false
    if (query) {
      const haystack = `${h.name} ${h.slug} ${h.description}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function getPopularHairstyles(n = 8): Hairstyle[] {
  return HAIRSTYLES.filter((h) => h.popular).slice(0, n)
}

/** 按脸型推荐：匹配的优先，不足 n 个用通用适配（oval 适配款）补足 */
export function recommendForFaceShape(faceShape: FaceShape, n = 5): Hairstyle[] {
  const matched = HAIRSTYLES.filter((h) => h.suitableFaceShapes.includes(faceShape))
  const others = HAIRSTYLES.filter((h) => !h.suitableFaceShapes.includes(faceShape))
  // 同脸型内按 popular 优先
  matched.sort((a, b) => Number(b.popular ?? false) - Number(a.popular ?? false))
  return [...matched, ...others].slice(0, n)
}

/** 推荐理由：优先取该脸型专属文案，否则取通用描述 */
export function getRecommendReason(style: Hairstyle, faceShape?: FaceShape): string {
  if (faceShape && style.reasonByFaceShape[faceShape]) {
    return style.reasonByFaceShape[faceShape] as string
  }
  return style.description
}
