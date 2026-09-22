import type { PersonPortrait, PhotoScoreReport, SelectedFeature } from './types'
import { fusionSentenceFromReport } from './reasoning-engine'

/** Distinctiveness 25 · Exaggeration 25 · Humor 20 · Environment 20 · Safety 10 */

export const FEATURE_WEIGHTS = {
  distinctiveness: 0.25,
  exaggeration_potential: 0.25,
  visual_humor: 0.2,
  environment_interaction: 0.2,
  recognition_safety: 0.1,
} as const

export const DEFAULT_EXAGGERATION_LEVEL = 7
export const MIN_EXAGGERATION_LEVEL = 1
export const MAX_EXAGGERATION_LEVEL = 10

export const MIN_ENV_INTERACTION = 0.45
export const MIN_RECOGNITION_SAFETY = 0.7
export const MIN_WEIGHTED_SCORE = 0.45

export const EXAGGERATION_LABELS: Record<number, string> = {
  1: 'subtle',
  2: 'noticeable',
  3: 'clearly exaggerated',
  4: 'big',
  5: 'very exaggerated',
  6: 'ridiculous',
  7: 'absurd',
  8: 'extreme',
  9: 'surreal',
  10: 'completely insane',
}

const SENSITIVE_RE =
  /\b(race|racial|racist|ethnic|ethnicity|skin[\s-]?colou?r|religion|religious|muslim|islam|jew(?:ish)?|christian|hindu|disabled|disability|handicap|retarded?|disease|medical condition|mental health|mentally ill|sexual(?:ity)?|genitals?|penis|vagina|breast|nude|naked|porn|nsfw|weight-shame|fat-shame|ugly)\b|种族|民族歧视|肤色|宗教|穆斯林|伊斯兰|犹太|残疾|残障|智障|精神病|性器官|生殖器|裸体|色情|乳房/i

export const SENSITIVE_USER_RULES_MESSAGE =
  'Keep it loving and playful. Do not joke about race, ethnicity, religion, disability, medical conditions, or sexual characteristics.'

export function isSensitiveFeatureText(...parts: string[]): boolean {
  return parts.some((p) => Boolean(p) && SENSITIVE_RE.test(p))
}

export function suggestedCreativeSeed(report: PhotoScoreReport): string {
  return report.primary_feature.feature.trim()
}

/** 输入框等于 AI 提炼的核心笑点时，仍按分析 brief 出图，不当作用户覆盖规则。 */
export function effectiveUserDirection(
  twist: string,
  report?: PhotoScoreReport | null,
): string {
  const t = twist.trim()

  if (!t) return ''
  if (!report) return t

  if (t === suggestedCreativeSeed(report)) return ''

  return t
}

export const MEMEGO_PENCIL_STYLE =
  'black-and-white hand-drawn caricature, graphite pencil and black ink, expressive contour lines, dense cross-hatching, visible pencil texture, lively imperfect strokes, editorial cartoon energy, strong wide-angle/fisheye perspective, deliberately exaggerated head and facial proportions for the selected joke, recognizable likeness, warm playful humor, original drawing rather than a photo filter'

/** 参考效果要求：黑白手绘漫画，而不是彩色滤镜。 */
export const MEMEGO_COLOR_RULES =
  'HARD MONOCHROME: finished image is black-and-white pencil and ink with graphite values and cross-hatching. No color wash, no painted color, no photorealistic color grade.'

/** 礼物底线：好笑，但不许变老、变丑、往身体里塞东西。 */
export const MEMEGO_KINDNESS_RULES = [
  'HARD KINDNESS: this is playful visual comedy, not a cruel roast.',
  'Keep every person recognizable through stable identity cues such as hairstyle, glasses, clothing, accessory identity, and overall facial character.',
  'For the selected person, deliberate caricature distortion is allowed: head size, face proportions, nose perspective, eye scale, smile width, cheeks, jaw, neck-to-head ratio, and foreshortening may change.',
  'Do not replace a person with a different person, animal, monster, or unrelated character.',
  'Do not use race, ethnicity, religion, disability, medical conditions, mental health, sexual characteristics, or body-shaming as the joke.',
  'Do not add wrinkles, aging, disease cues, or humiliating deformation.',
  'Do not put objects inside mouths, eyes, faces, or bodies.',
  'Non-focus people remain recognizable and should not receive a competing caricature joke.',
].join(' ')

export const MEMEGO_NEGATIVE_RULES = [
  'do not randomly change the location or replace the background',
  'do not import objects or landmarks that are not in the original photo',
  'do not change the person identity or their relationship with other people',
  'do not randomly exaggerate unrelated body parts',
  'do not age anyone or add wrinkles',
  'do not put objects inside a mouth or body',
  'do not joke about race, ethnicity, religion, disability, medical conditions, or sexual characteristics',
  'do not create a generic cartoon portrait, anime filter, or simple art-style transfer',
  'do not merely enlarge the feature without an environmental consequence',
  'do not pack multiple unrelated jokes into one image',
  'do not add random surreal objects just to look crazy',
  'do not turn the image into a photorealistic filter or a generic sketch effect',
  'avoid cruel insults, horror, gore, sexualization, humiliating deformation, and unflattering aging',
].join('. ')

export function clamp01(n: unknown, fallback = 0.7): number {
  const v = Number(n)

  if (!Number.isFinite(v)) return fallback

  return Math.min(1, Math.max(0, v))
}

export function clampExaggeration(
  n: unknown,
  fallback = DEFAULT_EXAGGERATION_LEVEL,
): number {
  const v = Math.round(Number(n))

  if (!Number.isFinite(v)) return fallback

  return Math.min(
    MAX_EXAGGERATION_LEVEL,
    Math.max(MIN_EXAGGERATION_LEVEL, v),
  )
}

export function weightedFeatureScore(
  scores: SelectedFeature['scores'],
): number {
  return (
    scores.distinctiveness * FEATURE_WEIGHTS.distinctiveness +
    scores.exaggeration_potential * FEATURE_WEIGHTS.exaggeration_potential +
    scores.visual_humor * FEATURE_WEIGHTS.visual_humor +
    scores.environment_interaction * FEATURE_WEIGHTS.environment_interaction +
    scores.recognition_safety * FEATURE_WEIGHTS.recognition_safety
  )
}

export function bumpExaggeration(
  report: PhotoScoreReport,
  delta = 1,
): PhotoScoreReport {
  const nextLevel = clampExaggeration(
    report.primary_feature.exaggeration_level + delta,
  )

  const primary: SelectedFeature = {
    ...report.primary_feature,
    exaggeration_level: nextLevel,
    environment_consequence: escalateConsequence(
      report.primary_feature.environment_consequence,
      nextLevel,
      report.scene.environment,
    ),
  }

  return {
    ...report,
    primary_feature: primary,
    overall_creative_direction: scaleDirection(
      report.overall_creative_direction,
      nextLevel,
    ),
    summary: scaleDirection(report.summary, nextLevel),
    hooks: reportToHooks({
      ...report,
      primary_feature: primary,
    }),
  }
}

function escalateConsequence(
  text: string,
  level: number,
  environment: string,
): string {
  const place = environment.trim() || 'the original location'

  if (level <= 7) return text

  if (level === 8) {
    return `${text} Push it further: the same feature becomes large enough to visibly overlap one existing architectural or environmental element in ${place}. Do not add or deform that element.`
  }

  if (level === 9) {
    return `${text} Surreal version of the SAME joke: the feature becomes much larger and visibly occupies the same visual space as one existing architectural or environmental element in ${place}, while the original element remains structurally unchanged.`
  }

  return `${text} Completely insane version of the SAME joke: the feature becomes absurdly large and visibly overlaps existing elements of ${place}, while the original environment remains recognizable and structurally unchanged.`
}

function scaleDirection(text: string, level: number): string {
  const label = EXAGGERATION_LABELS[level] ?? 'absurd'

  const stripped = text
    .replace(
      /\s*\(exaggeration level \d+:[^)]*\)\s*$/i,
      '',
    )
    .trim()

  return `${stripped} (exaggeration level ${level}: ${label})`
}

export function reportToHooks(
  report: Pick<
    PhotoScoreReport,
    'primary_feature' | 'secondary_feature'
  >,
): {
  title: string
  twist: string
}[] {
  const hooks = [
    {
      title: report.primary_feature.feature,
      twist:
        report.primary_feature.environment_consequence ||
        report.primary_feature.creative_concept,
    },
  ]

  if (report.secondary_feature) {
    hooks.push({
      title: report.secondary_feature.feature,
      twist:
        report.secondary_feature.environment_consequence ||
        report.secondary_feature.creative_concept,
    })
  }

  return hooks
}

export interface QualityCheck {
  ok: boolean
  reasons: string[]
}

export function checkCreativeQuality(
  report: PhotoScoreReport,
): QualityCheck {
  const p = report.primary_feature
  const reasons: string[] = []

  if (!p.feature.trim()) reasons.push('missing_primary_feature')

  if (!p.evidence.trim()) reasons.push('missing_evidence')

  if (p.weighted_score < MIN_WEIGHTED_SCORE) {
    reasons.push('weak_feature_score')
  }

  if (p.scores.recognition_safety < MIN_RECOGNITION_SAFETY) {
    reasons.push('unsafe_feature')
  }

  if (
    isSensitiveFeatureText(
      p.feature,
      p.evidence,
      p.creative_concept,
      p.environment_consequence,
    )
  ) {
    reasons.push('sensitive_attribute')
  }

  if (
    p.scores.environment_interaction < MIN_ENV_INTERACTION ||
    !p.environment_consequence.trim()
  ) {
    reasons.push('weak_environment_consequence')
  }

  if (!report.scene.environment.trim()) {
    reasons.push('missing_environment')
  }

  return {
    ok: reasons.length === 0,
    reasons,
  }
}

/**
 * If the joke does not yet use the original scene,
 * force an environmental consequence.
 */
export function ensureEnvironmentConsequence(
  report: PhotoScoreReport,
): PhotoScoreReport {
  const gate = checkCreativeQuality(report)

  if (
    !gate.reasons.includes('weak_environment_consequence') &&
    !gate.reasons.includes('missing_environment')
  ) {
    return report
  }

  const env =
    report.scene.environment.trim() ||
    'the original scene from the photo'

  const primary: SelectedFeature = {
    ...report.primary_feature,

    scores: {
      ...report.primary_feature.scores,
      environment_interaction: Math.max(
        report.primary_feature.scores.environment_interaction,
        MIN_ENV_INTERACTION,
      ),
    },

    environment_consequence: [
      report.primary_feature.environment_consequence.trim(),

      `When this feature becomes absurd, it must visibly overlap one specific architectural or environmental element that already exists in ${env}. The feature should extend into the same visual space as that existing element. Do not invent, duplicate, move, bend, break, push, or reshape the existing element. The original scene remains structurally unchanged.`,
    ]
      .filter(Boolean)
      .join(' '),
  }

  primary.weighted_score = weightedFeatureScore(primary.scores)

  return {
    ...report,
    primary_feature: primary,
    hooks: reportToHooks({
      ...report,
      primary_feature: primary,
    }),
  }
}

export function prepareBriefForGeneration(
  report: PhotoScoreReport,
): PhotoScoreReport {
  const next = sanitizeGiftJoke(
    ensureEnvironmentConsequence(report),
  )

  const gate = checkCreativeQuality(next)

  if (
    gate.reasons.includes('sensitive_attribute') ||
    gate.reasons.includes('unsafe_feature')
  ) {
    return fallbackSafeBrief(next)
  }

  return next
}

const GROTESQUE_JOKE_RE =
  /\b(inside (the )?(mouth|face|jaw|skull|body)|unhinged|rubber ducks?|objects? in (his|her|their) mouth|now-opened face|cavity|viscera|gore)\b/i

function sanitizeGiftJoke(
  report: PhotoScoreReport,
): PhotoScoreReport {
  const p = report.primary_feature

  const blob = `${p.environment_consequence} ${p.creative_concept} ${report.overall_creative_direction}`

  if (!GROTESQUE_JOKE_RE.test(blob)) {
    return report
  }

  const env =
    report.scene.environment.trim() ||
    'the original scene'

  const primary: SelectedFeature = {
    ...p,

    creative_concept: `Their ${p.feature} becomes comically exaggerated while everyone remains recognizable in ${env}.`,

    environment_consequence:
      `Exaggerate "${p.feature}" in ${env} until it creates one clear visible spatial overlap with an existing architectural or environmental element already present in the photo. Do not invent, move, bend, break, push, or reshape that element. Do not put anything inside anyone's mouth. Do not age or wrinkle anyone.`,
  }

  return {
    ...report,
    primary_feature: primary,
    overall_creative_direction: primary.creative_concept,
    summary: primary.creative_concept,
    hooks: reportToHooks({
      ...report,
      primary_feature: primary,
    }),
  }
}

function fallbackSafeBrief(
  report: PhotoScoreReport,
): PhotoScoreReport {
  const env =
    report.scene.environment.trim() ||
    'the original location'

  const primary: SelectedFeature = {
    feature: 'expressive pose and presence',

    evidence:
      'the way they hold themselves in this photo is the most playful, non-sensitive hook',

    person_id:
      report.primary_feature.person_id || 'p1',

    reason:
      'the way they hold themselves in this photo is the most playful, non-sensitive hook',

    scores: {
      distinctiveness: 0.72,
      exaggeration_potential: 0.78,
      visual_humor: 0.74,
      environment_interaction: 0.8,
      recognition_safety: 0.95,
    },

    weighted_score: 0,

    exaggeration_level:
      report.primary_feature.exaggeration_level ||
      DEFAULT_EXAGGERATION_LEVEL,

    creative_concept:
      `Their pose becomes physically impossible while remaining inside ${env}.`,

    environment_consequence:
      `The pose becomes large enough to visibly overlap one existing architectural or environmental element already present in ${env}. The original element remains structurally unchanged.`,

    composition:
      'Keep the original camera angle. Let the pose break the frame edges while the location stays recognizable.',
  }

  primary.weighted_score = weightedFeatureScore(primary.scores)

  return {
    ...report,
    primary_feature: primary,
    overall_creative_direction: primary.creative_concept,
    summary: primary.creative_concept,
    hooks: reportToHooks({
      ...report,
      primary_feature: primary,
    }),
  }
}

export function exaggerationLevelForTier(
  level: number,
  tier: 'free' | 'paid',
): number {
  const clamped = clampExaggeration(level)

  if (tier === 'free') {
    return Math.min(clamped, 7)
  }

  return Math.min(clamped, 9)
}

const SPECULATION_RE =
  /\b(seems|appears|looks like|adventurous|confident|secretly|planning|personality|knowing smirk|obliviously|over-the-top|vibe|energetic|cheerful and relaxed|funny personality|comedic tension|quiet observation)\b/i

const IDENTITY_TRAIT_RE =
  /\b(eye shape|brow position|skin tone|facial structure|teeth visible|open smile)\b/i

function uniqueShort(
  items: string[],
  max = 3,
): string[] {
  const out: string[] = []

  for (const raw of items) {
    const t = raw.replace(/\s+/g, ' ').trim()

    if (!t || t.length > 70) continue

    // 防止残留不完整的括号文本
    if (t.includes('(') && !t.includes(')')) continue

    if (
      SPECULATION_RE.test(t) ||
      IDENTITY_TRAIT_RE.test(t)
    ) {
      continue
    }

    const lower = t.toLowerCase()

    if (
      out.some(
        (x) =>
          x.toLowerCase() === lower ||
          x.toLowerCase().includes(lower) ||
          lower.includes(x.toLowerCase()),
      )
    ) {
      continue
    }

    out.push(t)

    if (out.length >= max) break
  }

  return out
}

function compactPersonLine(
  person: PersonPortrait,
  index: number,
): string {
  const id = person.id || `p${index + 1}`
  const label = person.label || `Person ${index + 1}`

  const pos = person.position.trim()

  const where = pos
    ? `on the ${pos}`
    : label.toLowerCase().replace(/^person\s+/i, '')

  const looks = uniqueShort(
    [
      ...person.appearance,
      ...person.visible_features,
      person.trait,
    ],
    3,
  )

  const wearing = looks.length
    ? `, wearing ${looks.join(', ')}`
    : ''

  return `${id} (${label}) is ${where}${wearing}.`
}

function compactPeopleBlock(
  report: PhotoScoreReport,
): string {
  const portraits = report.scene.portraits ?? []

  if (portraits.length) {
    return portraits
      .map((person, i) => compactPersonLine(person, i))
      .join('\n')
  }

  if (report.scene.people.length) {
    return report.scene.people
      .map(
        (label, i) =>
          `- ${label || `Person ${i + 1}`}`,
      )
      .join('\n')
  }

  return 'Keep every person visible in the uploaded photo.'
}

function exaggerationHow(level: number): string {
  if (level <= 4) return 'slightly exaggerated'

  if (level <= 6) return 'clearly exaggerated'

  return 'dramatically exaggerated'
}

function matchNamedTarget(text: string): string | null {
  const targetGroups = [
    /\b(?:stainless[- ]steel|metallic|metal|overhead)\s+(?:overhead\s+)?(?:hand)?rails?\b/i,
    /\b(?:overhead|metallic|metal|stainless[- ]steel)\s+rails?\b/i,
    /\bhandrails?\b/i,
    /\brails?\b/i,
    /\b(window|window frame)\b/i,
    /\b(doorway|door frame|door)\b/i,
    /\b(wall|building|architecture)\b/i,
    /\b(?:water|sea|ocean|beach)\b/i,
  ]

  for (const group of targetGroups) {
    const fromText = text.match(group)
    if (fromText?.[0]) {
      return fromText[0].replace(/\s+/g, ' ').trim()
    }
  }

  return null
}

function pickExistingTarget(
  consequence: string,
  objects: string[],
  environment: string,
): string {
  const fromConsequence = matchNamedTarget(consequence)
  if (fromConsequence) return fromConsequence

  for (const obj of objects) {
    const named = matchNamedTarget(obj)
    if (named) return obj.replace(/\s+/g, ' ').trim()
  }

  const fromEnvironment = matchNamedTarget(environment)
  if (fromEnvironment) return fromEnvironment

  const fromObjectTokens = objects.find((obj) => {
    const tokens = obj
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 3 &&
          ![
            'with',
            'from',
            'that',
            'this',
            'left',
            'right',
            'dark',
            'blue',
          ].includes(w),
      )

    return tokens.some((w) =>
      consequence.toLowerCase().includes(w),
    )
  })

  if (fromObjectTokens) {
    return fromObjectTokens
  }

  return 'the existing architectural or environmental element explicitly described in the environmental consequence'
}

function sceneFitPhrase(
  environment: string,
): string {
  const first =
    environment.split(/[.,]/)[0]?.trim() ?? ''

  const compact = first
    .replace(/\s+with\b[\s\S]*$/i, '')
    .trim()

  if (
    compact.length >= 8 &&
    compact.length <= 70
  ) {
    return compact
  }

  if (
    first.length >= 8 &&
    first.length <= 90
  ) {
    return first
  }

  return 'the original scene'
}

function compactEnvironmentalJoke(
  feature: string,
  consequence: string,
  environment: string,
  objects: string[],
  how: string,
): {
  joke: string
  visible: string
  success: string
  scale: string
  target: string
} {
  const target = pickExistingTarget(consequence, objects, environment)
  const place = sceneFitPhrase(environment)
  const featureLooksLikeHat = /\b(hat|brim|cap|headwear)\b/i.test(feature)
  const edge = featureLooksLikeHat ? 'the hat/brim silhouette' : `the selected ${feature}`

  return {
    target,
    scale: [
      `Push "${feature}" to ${how} caricature scale.`,
      `Do not stop at a slightly larger version; the exaggeration should be obvious from a thumbnail.`,
      `Allow the selected person's head and facial proportions to bend with the caricature when that helps the joke.`,
      `Use strong wide-angle or fisheye perspective when useful, especially when ${edge} is close to the camera or an existing environmental element.`,
      `The final scale should feel physically surprising but visually coherent inside ${place}.`,
      `Keep the original material, color/value identity, attachment, and recognizable silhouette of the selected feature.`,
    ].join(' '),

    joke: [
      `The core visual joke is the selected "${feature}" becoming absurdly exaggerated while still clearly belonging to the same person.`,
      `Use the existing ${target} as a visual scale or spatial reference when possible.`,
      `The consequence described by the photo brief should be visible, not merely stated: the feature can crowd, overlap, nearly touch, frame, block, wrap around, or otherwise interact with the existing element if that is physically coherent.`,
      `Do not add a new prop just to explain the joke.`,
      `The environment stays recognizable; exaggerate the feature and/or camera perspective rather than replacing the location.`,
    ].join(' '),

    visible: [
      `THE JOKE MUST READ IMMEDIATELY: at a glance the viewer should notice an intentionally ridiculous exaggeration of "${feature}" and understand that this is a caricature of the source photo.`,
      `Make the visual punchline large enough to survive a small thumbnail.`,
    ].join(' '),

    success: [
      `SUCCESS CONDITION: the viewer recognizes the same people and scene within one second, then immediately notices that "${feature}" has been pushed to an unexpectedly ridiculous scale or perspective.`,
      `The image should feel like a talented caricature artist looked at the photo and thought of one mischievous visual idea, then pushed it much farther than expected.`,
    ].join(' '),
  }
}

const GENERATION_DO_NOT = [
  'make the result a simple filter, tracing, or mild color/style transfer',
  'preserve normal facial geometry when caricature distortion would improve the selected joke',
  'change the identity cues so the selected person becomes a different person',
  'give non-selected people a competing exaggerated feature',
  'remove, duplicate, merge, or swap people',
  'replace the original scene or camera context without a joke-driven reason',
  'invent unrelated props, animals, food, vehicles, landmarks, or buildings',
  'use sensitive attributes or body-shaming as humor',
  'put objects inside mouths, eyes, faces, or bodies',
  'turn people into animals or monsters',
  'create horror, gore, sexualization, or humiliating deformation',
  'make the selected person unrecognizable',
].join('\n- ')

export const FLUX_EXAGGERATION_RULES = [
  'CARICATURE RULES:',
  '- This is a funny gift caricature, NOT a realistic pencil portrait and NOT a filter on the photo.',
  '- Push the selected expression, gesture, or accessory until the joke is obvious at first glance.',
  '- People must still be recognizable, but expressions can go far beyond the photo.',
  '- Do not invent a giraffe neck or a brand-new nose as the joke.',
].join('\n')

export const FLUX_STYLE_ANCHOR =
  'STYLE LOCK: black and white pencil caricature only. Dense hand-drawn cross-hatching, scratchy uneven strokes, comic contrast, visible paper grain. NOT a smooth digital portrait, NOT photorealistic, NOT a soft illustration, NOT a photo filter. It must look like a satirical pencil caricature drawn as a gift.'

export const PENCIL_CARICATURE_STYLE =
  'STYLE: black and white satirical pencil caricature. Scratchy loose linework, heavy cross-hatching in shadows, uneven line weight, paper texture. Comic, not pretty. NOT smooth digital shading, NOT a realistic portrait sketch, NOT flat coloring.'

const CONTACT_KEYS = new Set(['wall', 'chair', 'car', 'held_object', 'table'])

function contactKey(objects: string[]): string {
  const tagged = objects.find((item) => item.startsWith('contact:'))?.replace(/^contact:/, '').trim()
  if (tagged && CONTACT_KEYS.has(tagged)) return tagged
  return ''
}

export function buildMemegoPrompt(opts: {
  report: PhotoScoreReport
  twist?: string
  tier: 'free' | 'paid'
  mediumNote?: string
}): string {
  const report = prepareBriefForGeneration(opts.report)
  console.log(
    '[prompt] building with:',
    JSON.stringify(
      {
        style: opts.mediumNote,
        tier: opts.tier,
        hasReport: Boolean(opts.report),
        fusionReason: opts.report?.primary_feature?.reason,
      },
      null,
      2,
    ),
  )
  const userRules = (opts.twist ?? '').trim()
  const directionJoke = userRules.startsWith('DIRECTION:')
    ? userRules.slice('DIRECTION:'.length).trim()
    : ''
  const portraits = report.scene.portraits ?? []
  const peopleCount = Math.max(portraits.length, report.scene.people.length, 1)
  const fusionSentence =
    directionJoke ||
    fusionSentenceFromReport(report) ||
    report.scene.photo_dynamic?.description ||
    report.primary_feature.feature

  const personLines = portraits.map((person, index) => {
    const identity = person.summary || person.appearance.slice(0, 3).join(', ') || person.label
    return `PERSON ${index + 1}: ${identity}`
  })

  console.log('[memego]', {
    fusion: fusionSentence,
    people: portraits.map((person) => ({
      id: person.id,
      expression: person.expression_or_action,
      pose: person.pose,
      features: person.visible_features.slice(0, 4),
    })),
  })

  const core = [
    `REDRAW the uploaded photo as a funny black-and-white pencil caricature of ${peopleCount} people.`,
    'Use the photo only for identity, clothing, and scene. Do not trace the photo. Do not make a realistic portrait.',
    'The visual joke must be obvious in one second.',
    '',
    ...personLines,
    '',
    fusionSentence ? `FUSION POINT: ${fusionSentence}` : '',
    '',
    PENCIL_CARICATURE_STYLE,
    directionJoke ? '' : userRules ? `USER NOTE: ${userRules}` : '',
    opts.mediumNote ? `Optional extra medium: ${opts.mediumNote}` : '',
  ]

  const result = core.filter((line) => line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n')
  console.log('[prompt] ===== FINAL SEEDREAM PROMPT START =====')
  console.log(result)
  console.log('[prompt] ===== FINAL SEEDREAM PROMPT END =====')
  return result
}
