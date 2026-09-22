export const FACE_KEYS = [
  'eyes',
  'nose',
  'mouth_jaw',
  'forehead',
  'cheeks',
  'head_shape',
  'chin',
  'eyebrows',
] as const

export const EXPRESSION_KEYS = [
  'smile',
  'side_eye',
  'raised_eyebrow',
  'smirk',
  'open_mouth',
] as const

export const EXAGGERATION_TEMPLATES: Record<string, string> = {
  neck: 'Stretch the neck to 2.2x its original length, so the head floats visibly above the shoulders.',
  eyes: 'Enlarge the eyes to 2.8x, make them bulge out of the face like cartoon eyes.',
  nose: 'Enlarge the nose to 2.2x, push it forward and downward so it dominates the face.',
  mouth_jaw: 'Widen the mouth and jaw by 2.0x, stretch the lips sideways beyond the natural face width.',
  forehead: 'Enlarge the forehead to 2.0x, push the hairline upward to create a tall dome.',
  head_shape: 'Enlarge the entire head to 2.5x relative to the body, so the body looks too small.',
  ears: 'Enlarge the ears to 2.5x, push them outward and slightly forward.',
  cheeks: 'Puff up the cheeks to 2.0x, make them bulge outward and upward.',
  chin: 'Extend the chin downward to 1.8x, elongating the lower face.',
  eyebrows: 'Raise and enlarge the eyebrows to 2.0x, exaggerating the expression they carry.',
  hair: 'Expand the hair volume to 2.0x, push it outward from the scalp in exaggerated shapes.',
  shoulders: 'Widen the shoulders by 1.8x, tilting them at a comic angle.',
  torso: 'Stretch the torso vertically or compress it horizontally, distorting the body shape.',
  arms: 'Extend the arms to 1.8x length, pushing them out at unnatural angles.',
  hands: 'Enlarge the hands to 2.0x, making them disproportionately big.',
  fingers: 'Extend the fingers to 1.8x, spreading them out dramatically.',
  posture: 'Push the existing pose to an extreme angle — exaggerate tilt, lean, or twist far beyond the original.',
  body_proportion: 'Shrink the body to 0.6x relative to the head, so the head dominates.',
  hat: 'Enlarge the hat to 2.2x, push it up and back so it tilts dramatically.',
  glasses: 'Enlarge the glasses to 1.8x, tilt them at a comic angle across the face.',
  headscarf: 'Expand the headscarf to 2.0x, push the fabric outward with exaggerated folds.',
  clothing: 'Distort the clothing shape — stretch, balloon, or pinch it to match the exaggerated body.',
  held_object: 'Enlarge the held object to 2.0x, making it visibly too big for the hand.',
  smile: 'Stretch the smile width to 2.0x, pull the mouth corners up toward the cheeks.',
  side_eye: 'Push the eyeballs to the side to 2.5x, exaggerating the side-eye direction.',
  raised_eyebrow: 'Raise one eyebrow to 2.0x height, keeping the other eyebrow level.',
  smirk: 'Widen the smirk to 1.8x, pulling one mouth corner up sharply.',
  open_mouth: 'Open the mouth wider to 2.0x, showing teeth and the inside of the mouth.',
}

export const RELATIONSHIP_PROMPTS: Record<string, string> = {
  one_laughing_at_other:
    'Both faces must be turned toward each other. The laughing person’s mouth enlarged, the side-eye person’s eyes exaggerated in the opposite direction.',
  side_by_side: 'Both people stand side by side, both exaggerated in different directions.',
  looking_at_each_other:
    'Both people must look at each other, exaggerated features reacting to each other.',
  one_leaning_on_other:
    'One person leans on the other, the leaning person’s weight visibly compressing the other.',
  leaning_on:
    'One person leans on the other, the leaning person’s weight visibly compressing the other.',
  one_behind_other:
    'One person stands behind the other, both heads visible and exaggerated.',
  holding_together:
    'Both people hold the same object, which is enlarged to match their exaggerated hands.',
  back_to_back: 'Both people back to back, both exaggerated in opposite directions.',
  single: '',
  no_clear_relationship: '',
}

export function scaleInstruction(text: string, factor: number): string {
  if (factor === 1) return text
  return text.replace(/(\d+(?:\.\d+)?)x/gi, (_, n: string) => `${(Number(n) * factor).toFixed(2)}x`)
}

export function instructionForKey(key: string, supporting: boolean): string {
  const base = EXAGGERATION_TEMPLATES[key]
  if (!base) return ''
  return scaleInstruction(base, supporting ? 0.7 : 1)
}

export function isFaceKey(key: string): boolean {
  return (FACE_KEYS as readonly string[]).includes(key) || key === 'raised_eyebrow'
}

export function isExpressionKey(key: string): boolean {
  return (EXPRESSION_KEYS as readonly string[]).includes(key)
}

export function sortStructuralFirst(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ae = isExpressionKey(a) ? 1 : 0
    const be = isExpressionKey(b) ? 1 : 0
    return ae - be
  })
}
