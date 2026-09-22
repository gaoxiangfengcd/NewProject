const TEMPLATES = {
  wall: 'Bend the wall slightly outward where the person leans on it.',
  chair: 'Warp the chair or seat under the person, exaggerating the compression.',
  car: 'Stretch the car roof or squeeze the window to match the exaggerated head size.',
  held_object: 'Enlarge the held object to match the exaggerated hand and arm.',
  table: 'Bend the table surface under the person’s weight.',
  background: 'Stretch the background slightly for comic effect.',
} as const

export type EnvironmentContact = keyof typeof TEMPLATES

const CONTACT_GUARD =
  ' The environment change must stay secondary. Do not cover faces. Do not look like a rendering glitch.'

export function pickEnvironmentTemplate(opts: {
  contact?: string
  environment?: string
  poses?: string[]
  objects?: string[]
}): string {
  const blob = [opts.contact, opts.environment, ...(opts.poses ?? []), ...(opts.objects ?? [])]
    .join(' ')
    .toLowerCase()

  let key: EnvironmentContact = 'background'
  if (/\b(wall|lean(?:ing)? on (?:the )?wall|against the wall)\b/.test(blob)) key = 'wall'
  else if (/\b(chair|seat|bench|sofa|stool)\b/.test(blob)) key = 'chair'
  else if (/\b(car|vehicle|cabin|boat|window)\b/.test(blob) && /\b(sit|sitting|inside|in the)\b/.test(blob)) {
    key = 'car'
  } else if (/\b(hold|holding|held|hand|prop|cup|glass|phone)\b/.test(blob)) key = 'held_object'
  else if (/\b(table|desk)\b/.test(blob)) key = 'table'
  else if (opts.contact && opts.contact in TEMPLATES) key = opts.contact as EnvironmentContact

  const hasContact = key !== 'background'
  if (!hasContact && !/\b(lean|sit|hold|touch|against|on the)\b/.test(blob)) {
    return TEMPLATES.background + CONTACT_GUARD
  }
  return TEMPLATES[key] + CONTACT_GUARD
}
