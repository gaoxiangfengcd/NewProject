import type {
  PhotoScoreReport,
  SelectedFeature,
  SceneBrief,
  FeatureScores,
  PersonPortrait,
  PhotoDynamic,
} from './types'
import { logger } from '@repo/common'
import sharp from 'sharp'
import {
  DEFAULT_EXAGGERATION_LEVEL,
  checkCreativeQuality,
  clamp01,
  clampExaggeration,
  ensureEnvironmentConsequence,
  isSensitiveFeatureText,
  reportToHooks,
  weightedFeatureScore,
} from './creative-engine'
import { humanPlayWithSentence } from './feature-to-template'

export type { PhotoScoreReport }

const TITLE_MAX = 48
const TEXT_MAX = 280
const LONG_MAX = 420

function stripEmoji(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripGuessedHat(text: string): string {
  return text
    .replace(/\bbucket hats?\b/gi, 'hat')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanText(raw: unknown, max: number): string {
  if (typeof raw !== 'string') return ''
  return stripGuessedHat(stripEmoji(raw.replace(/\s+/g, ' ').trim())).slice(0, max)
}

function clampDistortionScore(n: unknown): number | undefined {
  const v = Math.round(Number(n))
  if (!Number.isFinite(v)) return undefined
  return Math.min(10, Math.max(0, v))
}

function asStringList(raw: unknown, maxItems: number, itemMax: number): string[] {
  if (!Array.isArray(raw)) {
    const one = cleanText(raw, itemMax)
    return one ? [one] : []
  }
  const out: string[] = []
  for (const item of raw) {
    const t = cleanText(item, itemMax)
    if (!t) continue
    out.push(t)
    if (out.length >= maxItems) break
  }
  return out
}

/** Keep scores without a new type: `"green glasses [score:7]"`. */
function objectText(raw: unknown, keys: string[], max = TEXT_MAX): string {
  if (typeof raw === 'string') return cleanText(raw, max)
  if (!raw || typeof raw !== 'object') return ''
  const o = raw as Record<string, unknown>
  return keys.map((key) => cleanText(o[key], max)).filter(Boolean).join('; ')
}

function parseIdentityBlock(raw: unknown): { summary: string; tags: string[] } {
  if (typeof raw === 'string') return { summary: cleanText(raw, LONG_MAX), tags: [] }
  if (!raw || typeof raw !== 'object') return { summary: '', tags: [] }
  const o = raw as Record<string, unknown>
  const face = cleanText(o.face_shape, 40)
  const hair = cleanText(o.hair, 80)
  const eyes = cleanText(o.eyes, 60)
  const nose = cleanText(o.nose, 60)
  const mouth = cleanText(o.mouth, 80)
  const distinctive = asStringList(o.distinctive_features, 6, 80)
  const summary = [
    face ? `A ${face}-faced person` : 'A person',
    [hair, eyes && `eyes ${eyes}`, nose && `nose ${nose}`, mouth].filter(Boolean).join(', '),
    distinctive.length ? `distinctive: ${distinctive.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(', ')
  return {
    summary: summary.slice(0, LONG_MAX),
    tags: [
      face ? `face_shape:${face}` : '',
      hair ? `hair:${hair}` : '',
      eyes ? `eyes:${eyes}` : '',
      nose ? `nose:${nose}` : '',
      mouth ? `mouth:${mouth}` : '',
      ...distinctive.map((item) => `mark:${item}`),
    ].filter(Boolean),
  }
}

function parseExaggerableFeatures(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const feature = cleanText(o.feature, 140)
    if (!feature) continue
    const score = Math.round(Number(o.score))
    const part = cleanText(o.part, 40)
    const reason = cleanText(o.reason, 100)
    out.push(
      [
        feature,
        Number.isFinite(score) ? `[score:${Math.min(10, Math.max(0, score))}]` : '',
        part ? `[part:${part}]` : '',
        reason ? `[why:${reason}]` : '',
      ]
        .filter(Boolean)
        .join(' '),
    )
    if (out.length >= 8) break
  }
  return out
}

function flattenEnvironment(raw: unknown): {
  setting: string
  features: string[]
  contacts: string[]
  potential: string
} {
  if (typeof raw === 'string') {
    return { setting: cleanText(raw, TEXT_MAX), features: [], contacts: [], potential: '' }
  }
  if (!raw || typeof raw !== 'object') {
    return { setting: '', features: [], contacts: [], potential: '' }
  }
  const o = raw as Record<string, unknown>
  const features = parseVisibleFeatures(o.environment_features, 6)
  const contacts: string[] = []
  if (Array.isArray(o.person_environment_contact)) {
    for (const item of o.person_environment_contact) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      const person = cleanText(row.person, 12)
      const contact = cleanText(row.contact, 80)
      if (person && contact) contacts.push(`contact:${person}:${contact}`)
    }
  }
  return {
    setting: cleanText(o.setting, TEXT_MAX),
    features,
    contacts,
    potential: cleanText(o.environment_potential, 40),
  }
}

function parseVisibleFeatures(raw: unknown, maxItems = 8): string[] {
  if (!Array.isArray(raw)) return asStringList(raw, maxItems, 140)
  const out: string[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      const t = cleanText(item, 140)
      if (t) out.push(t)
    } else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const feature = cleanText(o.feature ?? o.name ?? o.part, 140)
      if (!feature) continue
      const score = Math.round(Number(o.score))
      const reason = cleanText(o.reason, 100)
      const extra = [
        Number.isFinite(score) ? `[score:${Math.min(10, Math.max(0, score))}]` : '',
        reason ? `[why:${reason}]` : '',
      ]
        .filter(Boolean)
        .join(' ')
      out.push(extra ? `${feature} ${extra}` : feature)
    }
    if (out.length >= maxItems) break
  }
  return out
}

function parseScores(o: Record<string, unknown>): FeatureScores {
  const nested = o.scores && typeof o.scores === 'object' ? (o.scores as Record<string, unknown>) : o
  return {
    distinctiveness: clamp01(nested.distinctiveness ?? o.distinctiveness, 0.7),
    exaggeration_potential: clamp01(nested.exaggeration_potential ?? o.exaggeration_potential, 0.7),
    visual_humor: clamp01(nested.visual_humor ?? o.visual_humor, 0.7),
    environment_interaction: clamp01(nested.environment_interaction ?? o.environment_interaction, 0.7),
    recognition_safety: clamp01(nested.recognition_safety ?? o.recognition_safety, 0.85),
  }
}

function flattenCreativeConcept(raw: unknown): { concept: string; consequence: string; environment: string } {
  if (typeof raw === 'string') {
    const t = cleanText(raw, LONG_MAX)
    return { concept: t, consequence: t, environment: '' }
  }
  if (!raw || typeof raw !== 'object') return { concept: '', consequence: '', environment: '' }
  const o = raw as Record<string, unknown>
  const original = cleanText(o.original_feature, TEXT_MAX)
  const exaggeration = cleanText(o.controlled_exaggeration ?? o.exaggeration ?? o.exaggeration_type, TEXT_MAX)
  const environment = cleanText(o.original_environment ?? o.environment, TEXT_MAX)
  const envJoke =
    typeof o.environment_interaction === 'string' ? cleanText(o.environment_interaction, LONG_MAX) : ''
  const consequence = cleanText(
    o.small_visual_consequence ?? o.environment_consequence ?? o.consequence ?? envJoke ?? o.concept,
    LONG_MAX,
  )
  const concept = [cleanText(o.concept, LONG_MAX), original, exaggeration, consequence].filter(Boolean).join(' — ')
  return { concept, consequence: consequence || concept, environment }
}

function parseSelectedFeature(raw: unknown): SelectedFeature | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const nestedConcept = flattenCreativeConcept(o.creative_concept)
  const feature = cleanText(o.feature ?? o.original_feature, LONG_MAX)
  const evidence = cleanText(o.evidence, TEXT_MAX) || cleanText(o.reason, TEXT_MAX)
  const creative = nestedConcept.concept || cleanText(o.creative_concept, LONG_MAX)
  const envText =
    cleanText(o.environment_consequence, LONG_MAX) ||
    nestedConcept.consequence ||
    (typeof o.environment_interaction === 'string' ? cleanText(o.environment_interaction, LONG_MAX) : '')
  if (!feature || (!envText && !creative)) return null
  if (isSensitiveFeatureText(feature, evidence, creative, envText)) return null
  const scores = parseScores(o)
  const composition = cleanText(o.composition, TEXT_MAX)
  const selected: SelectedFeature = {
    feature,
    evidence: evidence || `Visible in the photo: ${feature}`,
    person_id: (cleanText(o.person_id ?? o.id, 12) || '').toLowerCase(),
    reason: cleanText(o.reason, TEXT_MAX) || evidence,
    scores,
    weighted_score: 0,
    exaggeration_level: clampExaggeration(o.exaggeration_level, DEFAULT_EXAGGERATION_LEVEL),
    distortionScore: clampDistortionScore(o.distortionScore ?? o.distortion_score),
    creative_concept: creative || envText,
    environment_consequence: envText || creative,
    composition,
  }
  selected.weighted_score = Number(o.weighted_score)
  if (!Number.isFinite(selected.weighted_score) || selected.weighted_score <= 0) {
    selected.weighted_score = weightedFeatureScore(scores)
  }
  return selected
}

function uniquePhrases(items: string[], max = 4): string[] {
  const out: string[] = []
  for (const raw of items) {
    const t = stripGuessedHat(stripEmoji(raw.replace(/\s+/g, ' ').trim()))
    if (!t) continue
    const lower = t.toLowerCase()
    if (out.some((x) => x.toLowerCase() === lower)) continue
    if (out.some((x) => x.toLowerCase().includes(lower) || lower.includes(x.toLowerCase()))) continue
    out.push(t)
    if (out.length >= max) break
  }
  return out
}

function humanPersonLabel(position: string, index: number): string {
  const pos = position.trim().toLowerCase()
  if (pos.includes('left')) return 'Person on the left'
  if (pos.includes('right')) return 'Person on the right'
  if (pos.includes('center') || pos.includes('middle')) return 'Person in the center'
  if (pos.includes('front')) return 'Person in front'
  if (pos.includes('back') || pos.includes('behind')) return 'Person in back'
  return `Person ${index + 1}`
}

function parsePhotoDynamic(raw: unknown, portraits: PersonPortrait[] = []): PhotoDynamic | null {
  if (!raw || typeof raw !== 'object') {
    if (typeof raw === 'string') {
      return finalizePhotoDynamic('visual', cleanText(raw, LONG_MAX), portraits)
    }
    return null
  }
  const o = raw as Record<string, unknown>
  const type = cleanText(o.type, 40).toLowerCase() || 'visual'
  if (type === 'none' || type === 'n/a' || type === 'null') return null
  const description = cleanText(o.description ?? o.summary ?? o.text, LONG_MAX)
  return finalizePhotoDynamic(type, description, portraits)
}

function finalizePhotoDynamic(
  type: string,
  description: string,
  portraits: PersonPortrait[],
): PhotoDynamic | null {
  if (KNOWN_RELATION_TYPES.has(type) && description) {
    return { type, description }
  }
  if (!description) return null
  if (STORY_RELATION_RE.test(description)) return null
  if (isPeopleRestatement(description, portraits)) return null
  return { type, description }
}

const KNOWN_RELATION_TYPES = new Set([
  'one_laughing_at_other',
  'side_by_side',
  'looking_at_each_other',
  'one_leaning_on_other',
  'leaning_on',
  'one_behind_other',
  'holding_together',
  'back_to_back',
  'single',
  'no_clear_relationship',
])

const RELATIONAL_DYNAMIC_RE =
  /\b(contrast|contrasts|while|whereas|against|between them|side by side|together|beside|next to|compared|versus|echo|mirror|lean(?:s|ing)? toward|facing each other|height difference|scale|spatial|interaction)\b/i

function parseEncodedFeatures(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const part = cleanText(o.part ?? o.name, 40).toLowerCase()
    const score = Math.round(Number(o.score ?? o.value))
    if (!part || !Number.isFinite(score)) continue
    out.push(`${part}:${Math.min(10, Math.max(1, score))}`)
    if (out.length >= 12) break
  }
  return out
}

function isPeopleRestatement(description: string, portraits: PersonPortrait[]): boolean {
  if (portraits.length < 2) return false
  if (!RELATIONAL_DYNAMIC_RE.test(description)) return true
  const d = description.toLowerCase()
  let restatedPeople = 0
  for (const person of portraits) {
    const bag = [person.summary, ...person.visible_features, person.trait]
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4)
    if (bag.length < 3) continue
    const hits = bag.filter((w) => d.includes(w)).length
    if (hits / bag.length >= 0.55) restatedPeople += 1
  }
  return restatedPeople >= 2 && !/\b(contrast|while|whereas|between them)\b/i.test(description)
}

const STORY_RELATION_RE =
  /\b(boyfriend|girlfriend|husband|wife|couple|married|best friends?|mother|father|son|daughter|siblings?|jealousy|in love|romantic couple|family photo)\b/i

function parsePersonObject(o: Record<string, unknown>, index: number): PersonPortrait {
  const listed = parseVisibleFeatures(o.visible_features, 8)
  const exaggerable = parseExaggerableFeatures(o.exaggerable_features)
  const funny = asStringList(o.funny_details, 5, 120)
  const scoredParts = parseEncodedFeatures(o.features)
  const id = (cleanText(o.id ?? o.person_id, 12) || `p${index + 1}`).toLowerCase()
  const position = cleanText(o.position ?? o.approximate_position, 40)
  const clothingBits = parseClothingBits(o.clothing)
  const accessories = cleanText(o.accessories, 60)
  const identityBlock = parseIdentityBlock(o.identity)
  const appearance = uniquePhrases(
    [...asStringList(o.appearance, 8, 60), ...identityBlock.tags, ...clothingBits],
    16,
  )
  if (accessories) appearance.push(...uniquePhrases([accessories], 4))
  const identity = cleanText(o.identity_description, LONG_MAX) || identityBlock.summary
  const looks = cleanText(o.looks, TEXT_MAX)
  if (looks) appearance.unshift(looks)
  const trait = cleanText(o.trait ?? o.distinctive_trait, TITLE_MAX)
  const visible_features = (exaggerable.length ? exaggerable : listed.length ? listed : [...funny, ...scoredParts])
    .filter(Boolean)
    .slice(0, 8)
  const pose = objectText(o.pose, ['body', 'hands', 'head'])
  const expression = objectText(o.visible_facial_expression ?? o.expression, ['type', 'intensity', 'details'])
  const fromModel = cleanText(o.summary, TEXT_MAX)
  const clothingLine = (clothingBits.find((item) => item.startsWith('top:')) || '').replace(/^top:/, '')
  const summary =
    [identity || fromModel || looks, clothingLine].filter(Boolean).join(', ') ||
    uniquePhrases([...visible_features.slice(0, 3), expression, pose]).slice(0, 3).join(', ')
  return {
    id,
    position,
    summary,
    appearance: uniquePhrases(appearance, 16),
    visible_features,
    label: humanPersonLabel(position, index),
    trait: visible_features[0] || trait || appearance[0] || 'visible look in this photo',
    expression_or_action: expression,
    pose,
  }
}

function parseClothingBits(raw: unknown): string[] {
  if (typeof raw === 'string') return [cleanText(raw, 80)].filter(Boolean)
  if (!raw || typeof raw !== 'object') return []
  const o = raw as Record<string, unknown>
  const top = cleanText(o.top, 80)
  return [
    top ? `top:${top}` : '',
    ...asStringList(o.accessories, 6, 60).map((item) => `acc:${item}`),
    ...asStringList(o.colors_visible, 6, 20).map((c) => `color:${c}`),
  ].filter(Boolean)
}

function parsePortraits(raw: unknown): PersonPortrait[] {
  if (!Array.isArray(raw)) return []
  const out: PersonPortrait[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    out.push(parsePersonObject(item as Record<string, unknown>, out.length))
    if (out.length >= 6) break
  }
  return out
}

function peopleFromEngine(raw: unknown): { labels: string[]; portraits: PersonPortrait[] } {
  if (!Array.isArray(raw) || raw.length === 0) return { labels: [], portraits: [] }
  if (typeof raw[0] === 'string') {
    const labels = asStringList(raw, 6, 80)
    return {
      labels,
      portraits: labels.map((label, i) =>
        parsePersonObject({ label, position: '', trait: label }, i),
      ),
    }
  }
  const portraits: PersonPortrait[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    portraits.push(parsePersonObject(item as Record<string, unknown>, portraits.length))
    if (portraits.length >= 6) break
  }
  return { labels: portraits.map((p) => p.label), portraits }
}

function parseScene(raw: unknown, extras?: Record<string, unknown>): SceneBrief {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const fromEngine = peopleFromEngine(o.people ?? extras?.people)
  const portraits = parsePortraits(o.portraits ?? extras?.portraits)
  const mergedPortraits = portraits.length >= fromEngine.portraits.length ? portraits : fromEngine.portraits
  const people = fromEngine.labels.length ? fromEngine.labels : asStringList(o.people, 6, 80)
  if (mergedPortraits.length > people.length) {
    for (const p of mergedPortraits) {
      if (people.length >= 6) break
      if (!people.includes(p.label)) people.push(p.label)
    }
  }
  const relList = o.relationships ?? extras?.relationships
  const relRaw = Array.isArray(relList)
    ? relList.map((item) => cleanText(item, 40)).filter(Boolean).join(',')
    : typeof (o.relationship ?? extras?.relationship) === 'string'
      ? cleanText(o.relationship ?? extras?.relationship, LONG_MAX)
      : cleanText(
          (o.relationship && typeof o.relationship === 'object'
            ? (o.relationship as Record<string, unknown>).type
            : extras?.relationship && typeof extras.relationship === 'object'
              ? (extras.relationship as Record<string, unknown>).type
              : '') as unknown,
          LONG_MAX,
        )
  const relationship = !relRaw || /^unknown$/i.test(relRaw) || STORY_RELATION_RE.test(relRaw) ? '' : relRaw
  const envFlat = flattenEnvironment(o.environment ?? extras?.environment)
  const contact = cleanText(o.environment_contact ?? extras?.environment_contact, 40)
  const objects = [
    ...parseVisibleFeatures(
      o.important_objects ?? extras?.important_objects ?? extras?.environment_features ?? o.environment_features,
      6,
    ),
    ...envFlat.features,
    ...envFlat.contacts,
    envFlat.potential ? `potential:${envFlat.potential}` : '',
  ].filter(Boolean)
  const uniqueObjects: string[] = []
  for (const item of objects) {
    if (!uniqueObjects.includes(item)) uniqueObjects.push(item)
    if (uniqueObjects.length >= 8) break
  }
  if (
    contact &&
    contact !== 'none' &&
    !uniqueObjects.some((item) => item.startsWith('contact:'))
  ) {
    uniqueObjects.unshift(`contact:${contact}`)
  }
  return {
    people,
    portraits: mergedPortraits,
    photo_dynamic: parsePhotoDynamic(o.photo_dynamic ?? extras?.photo_dynamic, mergedPortraits),
    creative_relationship: parsePhotoDynamic(
      o.creative_relationship ?? extras?.creative_relationship,
      mergedPortraits,
    ),
    relationship,
    environment:
      envFlat.setting ||
      cleanText(typeof o.environment === 'string' ? o.environment : '', TEXT_MAX) ||
      cleanText(typeof extras?.environment === 'string' ? extras.environment : '', TEXT_MAX) ||
      'the original location in the photo',
    important_objects: uniqueObjects,
    composition: cleanText(o.composition, TEXT_MAX),
    lighting: cleanText(o.lighting, 80),
    camera_angle: cleanText(o.camera_angle, 80),
  }
}

function displayScores(primary: SelectedFeature): Pick<
  PhotoScoreReport,
  'personScore' | 'environmentScore' | 'chemistryScore' | 'overallScore'
> {
  return {
    personScore: Math.round(primary.scores.distinctiveness * 100),
    environmentScore: Math.round(primary.scores.environment_interaction * 100),
    chemistryScore: Math.round(primary.scores.visual_humor * 100),
    overallScore: Math.round(primary.weighted_score * 100),
  }
}

function ensurePersonFocus(report: PhotoScoreReport): PhotoScoreReport {
  const scene = { ...report.scene, portraits: [...(report.scene.portraits ?? [])], people: [...(report.scene.people ?? [])] }
  if (scene.people.length < 1) {
    scene.people = ['the person who is the subject of this photo']
  }
  if (scene.portraits.length < 1 && scene.people.length) {
    scene.portraits = scene.people.map((label, i) =>
      parsePersonObject(
        {
          person_id: `p${i + 1}`,
          position: '',
          trait: report.primary_feature.feature,
          expression: report.primary_feature.evidence,
        },
        i,
      ),
    )
  } else if (scene.portraits.length < scene.people.length) {
    const have = new Set(scene.portraits.map((p) => p.label.toLowerCase()))
    for (const label of scene.people) {
      if (have.has(label.toLowerCase())) continue
      scene.portraits.push(
        parsePersonObject({ person_id: `p${scene.portraits.length + 1}`, label, trait: label }, scene.portraits.length),
      )
    }
  }
  if (/^unknown$/i.test(scene.relationship.trim())) scene.relationship = ''
  const objectOnly =
    /^(chopsticks|food items?|the table|table|window|windows|bowl|plate|mug|box|fries|noodles|kfc.*|furniture|the room)$/i
  const primary = { ...report.primary_feature }
  if (objectOnly.test(primary.feature.trim())) {
    primary.feature = `how they use ${primary.feature.trim()}`
    primary.creative_concept = `The PERSON is the joke. ${primary.creative_concept}`.trim()
    primary.environment_consequence = `Keep them recognizable and centered. ${primary.environment_consequence}`.trim()
    primary.composition =
      primary.composition ||
      'The person remains the clear focal point. The exaggerated action starts from their body.'
  }
  const multi = scene.portraits.length >= 2
  const giftLead = multi
    ? 'The people in this photo are the gift — every person stays a hero.'
    : 'The person is the gift — keep them the hero.'
  const direction = report.overall_creative_direction.startsWith('The person') ||
    report.overall_creative_direction.startsWith('The people')
    ? report.overall_creative_direction
    : `${giftLead} ${report.overall_creative_direction}`
  const next: PhotoScoreReport = {
    ...report,
    primary_feature: primary,
    scene,
    overall_creative_direction: direction,
    summary: direction,
  }
  next.hooks = reportToHooks(next)
  return next
}

function finalizeReport(
  primary: SelectedFeature,
  secondary: SelectedFeature | null,
  scene: SceneBrief,
  direction: string,
  provider: string,
): PhotoScoreReport {
  let report: PhotoScoreReport = {
    primary_feature: primary,
    secondary_feature: secondary && secondary.feature !== primary.feature ? secondary : null,
    scene,
    overall_creative_direction: direction || primary.creative_concept,
    provider,
    ...displayScores(primary),
    summary: direction || primary.creative_concept,
    hooks: [],
  }
  report.hooks = reportToHooks(report)
  report = ensureEnvironmentConsequence(report)
  report = ensurePersonFocus(report)
  const gate = checkCreativeQuality(report)
  if (gate.reasons.includes('sensitive_attribute')) return mockSafeFromScene(scene, provider)
  return report
}

function mockSafeFromScene(scene: SceneBrief, provider: string): PhotoScoreReport {
  const env = scene.environment || 'the original scene'
  const primary: SelectedFeature = {
    feature: 'expressive presence',
    evidence: 'the most playful non-sensitive visual hook in how they occupy the frame',
    person_id: 'p1',
    reason: 'the most playful non-sensitive visual hook in how they occupy the frame',
    scores: {
      distinctiveness: 0.7,
      exaggeration_potential: 0.76,
      visual_humor: 0.72,
      environment_interaction: 0.82,
      recognition_safety: 0.96,
    },
    weighted_score: 0,
    exaggeration_level: DEFAULT_EXAGGERATION_LEVEL,
    creative_concept: `Their presence becomes so large that ${env} has to rearrange around them.`,
    environment_consequence: `The pose and energy spill into ${env}, bending nearby objects while they stay recognizable.`,
    composition: 'Keep the original camera. Let the joke break the frame edges.',
  }
  primary.weighted_score = weightedFeatureScore(primary.scores)
  return finalizeReport(primary, null, scene, primary.creative_concept, provider)
}

function fromLegacyHooks(o: Record<string, unknown>): PhotoScoreReport | null {
  const hooksIn = Array.isArray(o.hooks) ? o.hooks : []
  const first = hooksIn[0]
  if (!first || typeof first !== 'object') return null
  const h = first as Record<string, unknown>
  const feature = cleanText(h.title, TITLE_MAX) || 'distinctive detail'
  const twist = cleanText(h.twist, LONG_MAX)
  if (!twist) return null
  const primary: SelectedFeature = {
    feature,
    evidence: twist,
    person_id: 'p1',
    reason: twist,
    scores: {
      distinctiveness: clamp01((Number(o.personScore) || 70) / 100),
      exaggeration_potential: 0.75,
      visual_humor: clamp01((Number(o.overallScore) || 70) / 100),
      environment_interaction: clamp01((Number(o.environmentScore) || 70) / 100),
      recognition_safety: 0.9,
    },
    weighted_score: 0,
    exaggeration_level: DEFAULT_EXAGGERATION_LEVEL,
    creative_concept: twist,
    environment_consequence: twist,
    composition: cleanText(o.summary, TEXT_MAX),
  }
  primary.weighted_score = weightedFeatureScore(primary.scores)
  const scene = parseScene({})
  scene.environment = 'the original location in the uploaded photo'
  return finalizeReport(primary, null, scene, cleanText(o.summary, LONG_MAX) || twist, cleanText(o.provider, 32) || 'legacy')
}

function normalizeAnalysisJson(raw: Record<string, unknown>): Record<string, unknown> {
  const cc = flattenCreativeConcept(raw.creative_concept)
  const candidates = Array.isArray(raw.feature_candidates) ? raw.feature_candidates : []
  let primary: unknown = raw.primary_feature
  if ((!primary || typeof primary !== 'object') && candidates[0]) primary = candidates[0]
  if (primary && typeof primary === 'object') {
    const p = { ...(primary as Record<string, unknown>) }
    if (p.scores && typeof p.scores === 'object') Object.assign(p, p.scores as Record<string, unknown>)
    if (typeof p.creative_concept === 'object') {
      const inner = flattenCreativeConcept(p.creative_concept)
      p.creative_concept = inner.concept
      if (!p.environment_consequence) p.environment_consequence = inner.consequence
    }
    if (!cleanText(p.creative_concept, 12) && cc.concept) p.creative_concept = cc.concept
    if (!cleanText(p.environment_consequence, 12) && cc.consequence) {
      p.environment_consequence = cc.consequence
    }
    const constraints = [
      ...asStringList(raw.identity_constraints, 12, 180),
      ...asStringList(raw.generation_constraints, 12, 180),
    ]
    if (constraints.length) {
      p.composition = [cleanText(p.composition, TEXT_MAX), constraints.join(' ')].filter(Boolean).join(' ')
    }
    primary = p
  }
  const secondary = raw.secondary_feature ?? candidates[1] ?? null
  const sceneIn =
    raw.scene && typeof raw.scene === 'object' ? { ...(raw.scene as Record<string, unknown>) } : {}
  if (cc.environment && !sceneIn.environment) sceneIn.environment = cc.environment
  if (raw.people != null) sceneIn.people = sceneIn.people ?? raw.people
  if (raw.relationship != null) sceneIn.relationship = raw.relationship
  if (raw.photo_dynamic != null) sceneIn.photo_dynamic = raw.photo_dynamic
  if (raw.creative_relationship != null) sceneIn.creative_relationship = raw.creative_relationship
  const direction =
    cleanText(raw.final_generation_direction, LONG_MAX) ||
    cleanText(raw.overall_creative_direction, LONG_MAX) ||
    cc.concept
  return {
    ...raw,
    primary_feature: primary,
    secondary_feature: secondary,
    scene: sceneIn,
    overall_creative_direction: direction,
  }
}

function mapPriorityAnalysis(raw: Record<string, unknown>): Record<string, unknown> {
  const people = Array.isArray(raw.people) ? raw.people : []
  const hasNewPeople = people.some((item) => {
    if (!item || typeof item !== 'object') return false
    const o = item as Record<string, unknown>
    return (
      Array.isArray(o.visible_features) ||
      Array.isArray(o.funny_details) ||
      Array.isArray(o.features) ||
      Array.isArray(o.exaggerable_features) ||
      (o.identity != null && typeof o.identity === 'object')
    )
  })
  const relObj =
    raw.relationship && typeof raw.relationship === 'object'
      ? (raw.relationship as Record<string, unknown>)
      : null
  if (!hasNewPeople && !relObj) return raw

  const relType =
    cleanText(relObj?.type, 40) ||
    (Array.isArray(raw.relationships) ? String(raw.relationships[0] ?? '') : '') ||
    (people.length <= 1 ? 'single' : 'no_clear_relationship')
  const relDescription = cleanText(relObj?.description, LONG_MAX)
  const trigger = cleanText(relObj?.trigger, TEXT_MAX)
  const emotionFlow = cleanText(relObj?.emotion_flow, 80)
  const interactionDir = cleanText(relObj?.direction_of_interaction, 40)
  const proximity = cleanText(relObj?.proximity, 20)
  const eyeContact =
    relObj && typeof relObj.eye_contact === 'boolean' ? String(relObj.eye_contact) : ''
  const peopleForPlay = people.map((item, index) => {
    const o = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
    const id = (cleanText(o.id ?? o.person_id, 12) || `p${index + 1}`).toLowerCase()
    const features = [
      ...parseExaggerableFeatures(o.exaggerable_features),
      ...parseVisibleFeatures(o.visible_features, 8),
    ]
    const fallback = asStringList(o.funny_details, 5, 120)
    return { id, features: features.length ? features : fallback }
  })
  const playWith = humanPlayWithSentence(peopleForPlay, relType, relDescription)
  const funLine = relDescription || playWith
  const dynamicDescription = [
    funLine,
    trigger ? `Trigger: ${trigger}` : '',
    emotionFlow ? `Flow: ${emotionFlow}` : '',
    interactionDir ? `Dir: ${interactionDir}` : '',
    proximity ? `Proximity: ${proximity}` : '',
    eyeContact ? `Eye: ${eyeContact}` : '',
  ]
    .filter(Boolean)
    .join(' | ')
  const envFlat = flattenEnvironment(raw.environment)

  return {
    ...raw,
    photo_dynamic: {
      type: relType,
      description: dynamicDescription,
    },
    relationship: relType,
    environment: envFlat.setting || raw.environment,
    important_objects: [
      ...parseVisibleFeatures(raw.environment_features, 6),
      ...envFlat.features,
      ...envFlat.contacts,
      envFlat.potential ? `potential:${envFlat.potential}` : '',
    ].filter(Boolean),
    primary_feature: {
      person_id: peopleForPlay[0]?.id || 'p1',
      feature: playWith,
      reason: funLine,
      evidence: peopleForPlay.flatMap((person) => person.features).join('; ') || playWith,
      distinctiveness: 0.85,
      exaggeration_potential: 0.9,
      visual_humor: 0.8,
      environment_interaction: 0.6,
      recognition_safety: 0.95,
      exaggeration_level: 8,
      creative_concept: funLine,
      environment_consequence: funLine,
      composition: 'Keep every person recognizable. People first, environment second.',
    },
  }
}

export function sanitizePhotoReport(raw: unknown): PhotoScoreReport | null {
  if (!raw || typeof raw !== 'object') return null
  const o = normalizeAnalysisJson(mapPriorityAnalysis(raw as Record<string, unknown>))
  const primary = parseSelectedFeature(o.primary_feature)
  if (!primary) return fromLegacyHooks(o)
  const secondary = parseSelectedFeature(o.secondary_feature)
  const scene = parseScene(o.scene, o)
  const direction = cleanText(o.overall_creative_direction, LONG_MAX)
  const provider = cleanText(o.provider, 32) || 'unknown'
  return finalizeReport(primary, secondary, scene, direction, provider)
}

function hashBytes(buf: Buffer): number {
  let h = 2166136261
  const step = Math.max(1, Math.floor(buf.length / 256))
  for (let i = 0; i < buf.length; i += step) {
    h ^= buf[i]
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

interface MockIdea {
  feature: string
  evidence: string
  concept: string
  consequence: (env: string) => string
}

const MOCK_ENVIRONMENTS = [
  'a city street with buildings behind them',
  'an indoor room with furniture and a window',
  'an outdoor plaza with nearby architecture',
  'a cafe or restaurant interior',
  'a park or open outdoor path',
]

const MOCK_IDEAS: MockIdea[] = [
  {
    feature: 'very long hair',
    evidence: 'hair is a strong silhouette in the frame',
    concept: 'Hair becomes enormous ribbon-like strands that still grow from their head.',
    consequence: (env) =>
      `Hair becomes giant ribbon-like strands wrapping around the existing architecture in ${env}, never leaving this place.`,
  },
  {
    feature: 'distinctive glasses',
    evidence: 'glasses are a clear focal point on the face',
    concept: 'Glasses become giant architectural windows.',
    consequence: (env) =>
      `The glasses become huge window-like planes reflecting ${env}, sitting on their face, using only buildings and objects already in the photo.`,
  },
  {
    feature: 'expressive smile',
    evidence: 'the smile is the loudest thing in the portrait',
    concept: 'The smile stretches so far it rearranges the room.',
    consequence: (env) =>
      `The smile becomes so enormous it stretches across ${env}, tugging nearby walls or sky while they stay themselves.`,
  },
  {
    feature: 'dramatic posture',
    evidence: 'the pose already wants to be a statue',
    concept: 'The pose becomes physically impossible and recruits nearby objects.',
    consequence: (env) =>
      `The pose grows heroic and impossible, leaning on or through objects already in ${env}, same camera, same clothes.`,
  },
  {
    feature: 'oversized clothing or accessory',
    evidence: 'an outfit or accessory already dominates the silhouette',
    concept: 'The garment becomes architecture in this location.',
    consequence: (env) =>
      `The clothing or accessory expands until it functions like a roof, banner, or tent using the existing shapes of ${env}.`,
  },
  {
    feature: 'very curly hair',
    evidence: 'curl pattern is visually dominant',
    concept: 'Curls become a weather system that still starts from their head.',
    consequence: (env) =>
      `Curly hair becomes an enormous cloud-like volume filling the air of ${env}, wrapping street or room elements that are already there.`,
  },
  {
    feature: 'tall commanding stance',
    evidence: 'they already feel taller than the frame expects',
    concept: 'Height continues until they share scale with nearby structures.',
    consequence: (env) =>
      `They stretch taller through ${env}, overlapping existing buildings or ceiling lines, still clearly this person in this place.`,
  },
]

function mockReport(buf: Buffer, excludeFeatures: string[] = []): PhotoScoreReport {
  const seed = hashBytes(buf)
  const env = MOCK_ENVIRONMENTS[seed % MOCK_ENVIRONMENTS.length]
  const blocked = new Set(excludeFeatures.map((f) => f.trim().toLowerCase()).filter(Boolean))
  const pool = MOCK_IDEAS.filter((idea) => !blocked.has(idea.feature.toLowerCase()))
  const ideas = pool.length ? pool : MOCK_IDEAS
  const start = seed % ideas.length
  const main = ideas[start]
  const second = ideas[(start + 1) % ideas.length]
  const scene: SceneBrief = {
    people: ['the person in the uploaded photo'],
    portraits: [
      parsePersonObject(
        {
          person_id: 'p1',
          position: 'center',
          trait: main.feature,
          expression: main.evidence,
          visible_features: [main.feature],
        },
        0,
      ),
    ],
    relationship: '',
    photo_dynamic: null,
    creative_relationship: null,
    environment: env,
    important_objects: ['whatever architecture and props are already in the photo'],
    composition: 'Keep the original camera and framing; let the feature break the edges.',
    lighting: 'match the original photo',
    camera_angle: 'match the original photo',
  }
  const mk = (idea: MockIdea, scoresShift: number): SelectedFeature => {
    const scores: FeatureScores = {
      distinctiveness: 0.62 + ((seed >> scoresShift) % 28) / 100,
      exaggeration_potential: 0.7 + ((seed >> (scoresShift + 2)) % 22) / 100,
      visual_humor: 0.66 + ((seed >> (scoresShift + 4)) % 24) / 100,
      environment_interaction: 0.72 + ((seed >> (scoresShift + 6)) % 20) / 100,
      recognition_safety: 0.92,
    }
    const selected: SelectedFeature = {
      feature: idea.feature,
      evidence: idea.evidence,
      person_id: 'p1',
      reason: idea.evidence,
      scores,
      weighted_score: weightedFeatureScore(scores),
      exaggeration_level: DEFAULT_EXAGGERATION_LEVEL,
      creative_concept: idea.concept,
      environment_consequence: idea.consequence(env),
      composition: scene.composition,
    }
    return selected
  }
  const primary = mk(main, 0)
  const secondary = second.feature === main.feature ? null : mk(second, 8)
  return finalizeReport(primary, secondary, scene, primary.creative_concept, 'mock')
}

const ANALYSIS_PROMPT = `You are a visual observer for caricature drawing. Return JSON only. No markdown, no commentary.

Analyze the photo in three progressive layers, in this order. Every layer must be detailed. Describe only what is truly visible. Do not invent a joke, physics, missing objects, sound waves, shadows, horns, or megaphones.

FORBIDDEN: race, religion, specific skin-color names, medical conditions.
FORBIDDEN fields: primary_feature, fusion_point, is_main, "THE THING WE'LL PLAY WITH".

LAYER 1 — PEOPLE (each person separately)
Count people as p1, p2, p3... For EACH person output the full object below.

LAYER 2 — RELATIONSHIP (people vs people)
Build this only from Layer 1. If one person: type "single". If two or more: name ids, the visible trigger, direction, emotion flow, eye contact, proximity.

LAYER 3 — ENVIRONMENT (people vs setting)
Build this only from Layer 1 and Layer 2. Score visible setting pieces. Do not invent props. environment_potential is whether the existing setting can join a joke: yes / no / weak.

Return exactly this JSON:
{
  "people_count": 2,
  "people": [
    {
      "id": "p1",
      "position": "left",
      "identity": {
        "face_shape": "oval / round / square / long",
        "hair": "short dark hair / long wavy hair / ...",
        "eyes": "small / large / narrow",
        "nose": "wide / small / prominent",
        "mouth": "thin lips / full lips / wide grin",
        "distinctive_features": ["green-tinted glasses", "black wide-brimmed hat with chin strap"]
      },
      "expression": {
        "type": "laughing / smirking / side-eye / surprised / neutral",
        "intensity": "mild / strong / extreme",
        "details": "eyes crinkled, mouth open showing upper teeth, head tilted back"
      },
      "pose": {
        "body": "sitting upright / leaning forward / leaning back",
        "hands": "hand cupped behind ear / hands on lap / holding something",
        "head": "tilted left / tilted back / facing camera"
      },
      "clothing": {
        "top": "gray hooded jacket with red zipper",
        "accessories": ["black wide-brimmed hat", "green glasses"],
        "colors_visible": ["black", "green", "gray"]
      },
      "exaggerable_features": [
        { "feature": "black wide-brimmed hat", "part": "hat", "score": 9, "reason": "large and distinctive, dominates the head" },
        { "feature": "green glasses", "part": "glasses", "score": 7, "reason": "color contrast, askew on nose" },
        { "feature": "wide open laughing mouth", "part": "mouth", "score": 8, "reason": "mouth wide open, showing teeth" }
      ]
    }
  ],
  "relationship": {
    "type": "one_laughing_at_other / side_by_side / looking_at_each_other / one_leaning_on_other / one_behind_other / holding_together / back_to_back / single / no_clear_relationship",
    "description": "p1 is laughing at p2's patterned headscarf, p2 is giving a side-eye back",
    "trigger": "p2's patterned headscarf",
    "direction_of_interaction": "p1 → p2",
    "emotion_flow": "playful teasing / affectionate / mock-annoyed / competitive",
    "eye_contact": true,
    "proximity": "close / medium / far"
  },
  "environment": {
    "setting": "boat interior with blue padded seat, window showing sky and clouds",
    "person_environment_contact": [
      { "person": "p1", "contact": "none" },
      { "person": "p2", "contact": "leaning against the window frame" }
    ],
    "environment_features": [
      { "feature": "blue padded seat back", "score": 6, "reason": "distinctive color and shape" },
      { "feature": "metal handrail above heads", "score": 4, "reason": "visible frame element" },
      { "feature": "window showing sky and karst cliffs", "score": 7, "reason": "distinctive background" }
    ],
    "environment_potential": "yes / no / weak"
  }
}

Fill real observed values, not the slash examples. This JSON is for internal reasoning only.`

function extractJson(text: string): unknown {
  if (!text) return null
  let cleaned = text
    .replace(/^\uFEFF/, '')
    .replace(/```(?:json|javascript|js)?/gi, '')
    .replace(/```/g, '')
    .trim()

  // Some vision models wrap the JSON in a short sentence. Find the first balanced
  // JSON object instead of relying on lastIndexOf('}'), which breaks on trailing text.
  const candidates: string[] = []
  const first = cleaned.indexOf('{')
  if (first >= 0) {
    let depth = 0
    let inString = false
    let escaped = false
    let end = -1
    for (let i = first; i < cleaned.length; i += 1) {
      const ch = cleaned[i]
      if (inString) {
        if (escaped) escaped = false
        else if (ch === '\\') escaped = true
        else if (ch === '"') inString = false
        continue
      }
      if (ch === '"') {
        inString = true
        continue
      }
      if (ch === '{') depth += 1
      if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    if (end > first) candidates.push(cleaned.slice(first, end + 1))
  }
  if (!candidates.length && first >= 0) {
    const last = cleaned.lastIndexOf('}')
    if (last > first) candidates.push(cleaned.slice(first, last + 1))
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as unknown
    } catch {
      // A few models emit a trailing comma. This conservative cleanup is safe for
      // our fixed JSON schema and gives the parser one more chance.
      try {
        const repaired = candidate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/\u0000/g, '')
        return JSON.parse(repaired) as unknown
      } catch {
        // continue
      }
    }
  }

  // Last resort: parse a JSON object embedded in an array or return null.
  const arrayStart = cleaned.indexOf('[')
  const arrayEnd = cleaned.lastIndexOf(']')
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    try {
      const arr = JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1)) as unknown
      if (Array.isArray(arr) && arr[0] && typeof arr[0] === 'object') return arr[0]
    } catch {
      // ignore
    }
  }
  return null
}
const DASHSCOPE_DEFAULT_URL =
  'https://dashscope.aliyuncs.com/compatible-mode/v1'

function dashscopeChatCompletionsUrl(raw: string): string {
  const base = raw.trim().replace(/\/+$/, '')
  if (!base) return `${DASHSCOPE_DEFAULT_URL}`
  return `${base}/chat/completions`
}

async function analysisImageDataUri(buffer: Buffer, mime: string): Promise<string> {
  try {
    const jpeg = await sharp(buffer)
      .rotate()
      .resize(768, 768, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 76 })
      .toBuffer()
    return `data:image/jpeg;base64,${jpeg.toString('base64')}`
  } catch {
    return `data:${mime};base64,${buffer.toString('base64')}`
  }
}

type AnalysisBackend = {
  name: string
  key: string
  url: string
  model: string
}

function dashscopeBackend(): AnalysisBackend | null {
  const key = (process.env.DASHSCOPE_API_KEY ?? '').trim()
  if (!key) return null
  const url = dashscopeChatCompletionsUrl(
    process.env.DASHSCOPE_BASE_URL ?? DASHSCOPE_DEFAULT_URL,
  )
  const model = (process.env.DASHSCOPE_ANALYSIS_MODEL ?? 'qwen3-vl-plus').trim() || 'qwen3-vl-plus'
  return { name: 'dashscope', key, url, model }
}

function zhipuBackend(): AnalysisBackend | null {
  const key = (process.env.ZHIPU_API_KEY ?? '').trim()
  if (!key) return null
  const url = (
    process.env.ZHIPU_BASE_URL ?? 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  ).trim()
  const model = (process.env.ZHIPU_ANALYSIS_MODEL ?? 'glm-4v-flash').trim() || 'glm-4v-flash'
  return { name: 'zhipu', key, url, model }
}

function openaiBackend(): AnalysisBackend | null {
  const key = (process.env.OPENAI_API_KEY ?? '').trim()
  if (!key) return null
  const url = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1/chat/completions').trim()
  const model = (process.env.OPENAI_ANALYSIS_MODEL ?? 'gpt-4o-mini').trim() || 'gpt-4o-mini'
  return { name: 'openai', key, url, model }
}

function pickAnalysisBackend(): AnalysisBackend | null {
  const explicit = (process.env.ANALYSIS_PROVIDER ?? '').trim().toLowerCase()
  if (explicit === 'mock') return null
  if (explicit === 'dashscope' || explicit === 'qwen') return dashscopeBackend()
  if (explicit === 'zhipu' || explicit === 'glm') return zhipuBackend()
  if (explicit === 'openai') return openaiBackend()
  return dashscopeBackend() ?? zhipuBackend() ?? openaiBackend()
}

const VISION_TIMEOUT_MS = 50_000

async function postVision(
  backend: AnalysisBackend,
  dataUri: string,
  exclude: string,
): Promise<{ report: PhotoScoreReport } | { error: string }> {
  const prompts = [
    ANALYSIS_PROMPT + exclude,
    `Analyze this photo in three layers (people, relationship, environment). Return JSON only. Do not invent objects. Use this exact schema:\n${JSON.stringify({
      people_count: 1,
      people: [
        {
          id: 'p1',
          position: 'left',
          identity: {
            face_shape: '',
            hair: '',
            eyes: '',
            nose: '',
            mouth: '',
            distinctive_features: [''],
          },
          expression: { type: '', intensity: '', details: '' },
          pose: { body: '', hands: '', head: '' },
          clothing: { top: '', accessories: [''], colors_visible: [''] },
          exaggerable_features: [{ feature: '', part: '', score: 0, reason: '' }],
        },
      ],
      relationship: {
        type: 'single',
        description: '',
        trigger: '',
        direction_of_interaction: '',
        emotion_flow: '',
        eye_contact: false,
        proximity: '',
      },
      environment: {
        setting: '',
        person_environment_contact: [{ person: 'p1', contact: 'none' }],
        environment_features: [{ feature: '', score: 0, reason: '' }],
        environment_potential: 'weak',
      },
    })}` + exclude,
  ]

  let lastError = 'request failed'

  for (let attempt = 0; attempt < prompts.length; attempt += 1) {
    try {
      const payload: Record<string, unknown> = {
        model: backend.model,
        temperature: attempt === 0 ? 0.2 : 0.1,
        max_tokens: attempt === 0 ? 4000 : 2200,
        enable_thinking: false,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: dataUri } },
              { type: 'text', text: prompts[attempt] },
            ],
          },
        ],
      }
      // JSON mode on the retry greatly reduces prose/code-fence responses.
      if (attempt === 1) payload.response_format = { type: 'json_object' }

      const fullUrl = backend.url
      console.log('[analyze] full request URL:', fullUrl)
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${backend.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(VISION_TIMEOUT_MS),
      })
      const errText = await res.text().catch(() => '')
      if (!res.ok) {
        lastError = `${res.status} ${errText.slice(0, 180)}`
        console.log(
          '[analyze] request failed:',
          JSON.stringify({
            status: res.status,
            model: backend.model,
            url: backend.url,
            body: errText.slice(0, 400),
          }),
        )
        logger.warn('photo analysis request failed', {
          provider: backend.name,
          model: backend.model,
          url: backend.url,
          status: res.status,
          attempt: attempt + 1,
          body: errText.slice(0, 400),
        })
        continue
      }

      let json: { choices?: { message?: { content?: string | unknown[] } }[] }
      try {
        json = JSON.parse(errText) as { choices?: { message?: { content?: string | unknown[] } }[] }
      } catch {
        lastError = 'model returned non-JSON'
        continue
      }
      const raw = json.choices?.[0]?.message?.content
      const text = Array.isArray(raw)
        ? raw.map((part) =>
            typeof part === 'string'
              ? part
              : part && typeof part === 'object' && 'text' in part
                ? String((part as { text?: unknown }).text ?? '')
                : '',
          ).join('\n')
        : typeof raw === 'string'
          ? raw
          : ''

      console.log('[analyze] raw Qwen response:\n', JSON.stringify(json, null, 2).slice(0, 2000))
      const extracted = extractJson(text)
      if (extracted && typeof extracted === 'object') {
        const o = extracted as Record<string, unknown>
        const people = Array.isArray(o.people) ? o.people : []
        console.log(
          '[analyze] parsed:\n',
          JSON.stringify(
            {
              people_count: o.people_count,
              people: people.map((item) => {
                const person =
                  item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
                return { id: person.id, features: person.visible_features }
              }),
              relationship: o.relationship,
              environment: o.environment_features,
            },
            null,
            2,
          ),
        )
      }

      const parsed = sanitizePhotoReport(extracted)
      if (parsed) {
        parsed.provider = backend.name
        return { report: parsed }
      }

      lastError = 'model reply was not a usable comedy brief'
      logger.warn('photo analysis JSON invalid', {
        provider: backend.name,
        model: backend.model,
        attempt: attempt + 1,
        preview: text.slice(0, 500),
      })
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
      logger.warn('photo analysis threw', {
        provider: backend.name,
        url: backend.url,
        attempt: attempt + 1,
        message: lastError,
      })
    }
  }

  return { error: lastError }
}

async function analyzeWithVisionApi(
  backend: AnalysisBackend,
  dataUri: string,
  excludeFeatures: string[],
): Promise<{ report: PhotoScoreReport } | { error: string }> {
  const exclude = excludeFeatures.length
    ? `\nDo NOT select these already-used features: ${excludeFeatures.join(', ')}.`
    : ''
  return postVision(backend, dataUri, exclude)
}

export async function analyzePhoto(opts: {
  buffer: Buffer
  mime: string
  excludeFeatures?: string[]
}): Promise<PhotoScoreReport> {
  console.log('[analyze] input image size:', opts.buffer?.length)
  console.log('[analyze] using key prefix:', process.env.DASHSCOPE_API_KEY?.slice(0, 8))
  const dataUri = await analysisImageDataUri(opts.buffer, opts.mime)
  const exclude = (opts.excludeFeatures ?? []).map((s) => s.trim()).filter(Boolean)
  const backend = pickAnalysisBackend()

  if (backend) {
    const live = await analyzeWithVisionApi(backend, dataUri, exclude)
    if ('report' in live) {
      console.log('[analyze] ---- qwen done ----')
      return live.report
    }
    logger.warn('photo analysis fell back to mock', {
      provider: backend.name,
      model: backend.model,
      error: live.error,
    })
    const mock = mockReport(opts.buffer, exclude)
    mock.fallbackReason = live.error
    console.log('[analyze] ---- qwen failed, using mock ----')
    return mock
  }

  logger.info('photo analysis using mock (no live provider configured)')
  await new Promise((r) => setTimeout(r, 700))
  return mockReport(opts.buffer, exclude)
}

const REPORT_TTL_MS = 30 * 60 * 1000
const REPORT_CACHE = new Map<string, { report: PhotoScoreReport; expires: number }>()

function reportCacheKey(buffer: Buffer): string {
  return `${buffer.length}:${hashBytes(buffer)}`
}

export function rememberPhotoReport(buffer: Buffer, report: PhotoScoreReport): void {
  REPORT_CACHE.set(reportCacheKey(buffer), { report, expires: Date.now() + REPORT_TTL_MS })
}

export function recallPhotoReport(buffer: Buffer): PhotoScoreReport | null {
  const hit = REPORT_CACHE.get(reportCacheKey(buffer))
  if (!hit) return null
  if (hit.expires < Date.now()) {
    REPORT_CACHE.delete(reportCacheKey(buffer))
    return null
  }
  return hit.report
}
