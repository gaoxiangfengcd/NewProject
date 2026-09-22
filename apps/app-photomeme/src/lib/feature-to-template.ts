import { instructionForKey, isExpressionKey, isFaceKey, sortStructuralFirst } from './exaggeration-templates'

export function matchFeatureToTemplate(visibleFeature: string): string | null {
  const t = visibleFeature.toLowerCase()

  if (/\bheadscarf|scarf|hijab\b/.test(t)) return 'headscarf'
  if (/\bhat|brim|cap\b/.test(t)) return 'hat'
  if (/\bglasses|spectacles\b/.test(t)) return 'glasses'
  if (/\bside[- ]eye|sideways glance|looking aside\b/.test(t)) return 'side_eye'
  if (/\beyebrow\b/.test(t)) return 'raised_eyebrow'
  if (/\bsmirk\b/.test(t)) return 'smirk'
  if (/\bgrin|smile|smiling|teeth\b/.test(t)) return 'smile'
  if (/\bopen mouth|mouth open|wide mouth\b/.test(t)) return 'open_mouth'
  if (/\bmouth|jaw|lips\b/.test(t)) return 'mouth_jaw'
  if (/\bchin\b/.test(t)) return 'chin'
  if (/\bcheek\b/.test(t)) return 'cheeks'
  if (/\beye\b/.test(t)) return 'eyes'
  if (/\bnose\b/.test(t)) return 'nose'
  if (/\bforehead|hairline\b/.test(t)) return 'forehead'
  if (/\bear\b/.test(t) && !/\bhand|cupped|pressed\b/.test(t)) return 'ears'
  if (/\bneck\b/.test(t)) return 'neck'
  if (/\bhair|hairstyle\b/.test(t)) return 'hair'
  if (/\bhead\b/.test(t)) return 'head_shape'
  if (/\bshoulder\b/.test(t)) return 'shoulders'
  if (/\btorso|jacket|top|shirt|clothing|coat|hoodie\b/.test(t)) {
    if (/\bjacket|top|shirt|clothing|coat|hoodie\b/.test(t)) return 'clothing'
    return 'torso'
  }
  if (/\bfinger\b/.test(t)) return 'fingers'
  if (/\bhand\b/.test(t)) return 'hands'
  if (/\barm\b/.test(t)) return 'arms'
  if (/\bposture|pose|lean|tilt|tucked|cupped\b/.test(t)) return 'posture'
  if (/\bhold|holding|object\b/.test(t)) return 'held_object'

  return null
}

function faceFallbackFrom(keys: string[]): string {
  if (keys.includes('smile') || keys.includes('open_mouth') || keys.includes('smirk')) return 'mouth_jaw'
  if (keys.includes('side_eye')) return 'eyes'
  if (keys.includes('raised_eyebrow')) return 'eyebrows'
  return 'eyes'
}

export function pickTemplateKeysForPerson(features: string[]): string[] {
  const keys: string[] = []
  for (const feature of features) {
    const key = matchFeatureToTemplate(feature)
    if (!key || keys.includes(key)) continue
    keys.push(key)
  }

  const preferred = keys.filter((key) => isFaceKey(key) || isExpressionKey(key))
  const rest = keys.filter((key) => !preferred.includes(key))
  let picked = [...preferred, ...rest].slice(0, 3)
  if (!picked.some(isFaceKey)) {
    const laterFace = keys.find(isFaceKey)
    const face = laterFace || faceFallbackFrom(keys)
    const withoutReplacedExpr = picked.filter((key) => !isExpressionKey(key) || key === face)
    picked = [face, ...withoutReplacedExpr.filter((key) => key !== face)].slice(0, 3)
  }

  while (picked.length < 2) {
    if (!picked.includes('head_shape')) picked.push('head_shape')
    else if (!picked.includes('mouth_jaw')) picked.push('mouth_jaw')
    else break
  }

  return picked
}

export function scoreMappedFeatures(features: string[]): number {
  let score = 0
  let weight = 5
  const seen = new Set<string>()
  for (const feature of features) {
    const key = matchFeatureToTemplate(feature)
    if (!key || seen.has(key)) continue
    seen.add(key)
    score += weight
    weight = Math.max(1, weight - 1)
  }
  return score
}

function punchlineKey(keys: string[]): string {
  const order = [
    'side_eye',
    'smile',
    'open_mouth',
    'smirk',
    'mouth_jaw',
    'eyes',
    'raised_eyebrow',
  ]
  return order.find((key) => keys.includes(key)) || keys.find(isFaceKey) || keys[0]
}

const KEY_CN: Record<string, string> = {
  neck: '脖子',
  eyes: '眼睛',
  nose: '鼻子',
  mouth_jaw: '嘴',
  forehead: '额头',
  head_shape: '头型',
  ears: '耳朵',
  cheeks: '脸颊',
  chin: '下巴',
  eyebrows: '眉毛',
  hair: '头发',
  shoulders: '肩膀',
  torso: '躯干',
  arms: '手臂',
  hands: '手',
  fingers: '手指',
  posture: '姿态',
  body_proportion: '身材比例',
  hat: '帽子',
  glasses: '眼镜',
  headscarf: '头巾',
  clothing: '衣服',
  held_object: '手里的东西',
  smile: '笑容',
  side_eye: '斜眼',
  raised_eyebrow: '挑眉',
  smirk: '坏笑',
  open_mouth: '张嘴',
}

function contrastHint(relType: string, relDescription: string): string {
  if (relType === 'one_laughing_at_other') return '大笑和斜眼'
  if (relType === 'looking_at_each_other') return '对视'
  if (relType === 'side_by_side') return '并排的反差'
  if (relType === 'one_leaning_on_other' || relType === 'leaning_on') return '靠和被靠'
  if (relType === 'one_behind_other') return '一前一后'
  if (relType === 'holding_together') return '一起拿着的东西'
  if (relType === 'back_to_back') return '背对背'
  const short = relDescription.replace(/\s+/g, ' ').trim()
  if (short.length >= 8 && short.length <= 36) return short
  return '两人的互动'
}

export function humanPlayWithSentence(
  people: { id: string; features: string[] }[],
  relType: string,
  relDescription: string,
): string {
  if (people.length >= 2) {
    const a = people[0]
    const b = people[1]
    const aPart = KEY_CN[punchlineKey(pickTemplateKeysForPerson(a.features))] || a.id
    const bPart = KEY_CN[punchlineKey(pickTemplateKeysForPerson(b.features))] || b.id
    return `把 ${a.id} 的${aPart}和 ${b.id} 的${bPart}同时夸张，让${contrastHint(relType, relDescription)}形成对比`
  }
  const person = people[0]
  if (!person) return '把画面里最显眼的五官夸张到漫画比例'
  const parts = pickTemplateKeysForPerson(person.features)
    .map((key) => KEY_CN[key] || key)
    .join('、')
  return `把 ${person.id} 的${parts}夸张到一眼就能看出来的漫画比例`
}

export function pickMainPersonId(people: { id: string; features: string[] }[]): string {
  if (!people.length) return 'p1'
  return [...people].sort((a, b) => {
    const delta = scoreMappedFeatures(b.features) - scoreMappedFeatures(a.features)
    if (delta !== 0) return delta
    return a.id.localeCompare(b.id)
  })[0].id
}

export function instructionsForKeys(keys: string[], supporting: boolean): string[] {
  return sortStructuralFirst(keys)
    .map((key) => instructionForKey(key, supporting))
    .filter(Boolean)
}

