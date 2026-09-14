import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'
import type { FaceShape } from '@/lib/hairstyles'

export const metadata: Metadata = {
  title: 'Best Hairstyle for Round Face — AI Guide | Haircut AI',
  description:
    'Best hairstyles for round faces. Add height and angles with layered bobs, wolf cuts, pixies and more. Try on your photo with AI.',
}

export default function HairstyleForRoundFacePage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Hairstyle for Round Face"
      title="The best hairstyles for a round face"
      subtitle="Add height, angles and definition. See and try the cuts that flatter a round face shape."
      description="Best hairstyle for round face shape"
      faceShape={'round' as FaceShape}
      sections={[
        {
          h3: 'Understanding the round face shape',
          p: 'A round face is roughly as wide as it is long, with full cheeks and a softly curved jawline. The goal with hairstyles is to add height and angles that elongate the face and create definition. Avoid styles that add width at the cheek level or blunt, chin-length cuts that emphasize roundness.',
        },
        {
          h3: 'Best hairstyles for round faces',
          p: 'Layered bobs add movement and angles. Wolf cuts and shags add height at the crown. Pixies with textured tops draw the eye upward. Long layers with curtain bangs create vertical lines that elongate. The AI gives you a full ranked list based on your specific features.',
        },
        {
          h3: 'Styles to approach with caution',
          p: 'Blunt bobs at chin length can make a round face look wider. Heavy, flat fringes can shorten the face. Very short, uniform cuts without volume on top can emphasize roundness. If you love these looks, you can still try them — the AI will generate a preview so you can decide for yourself.',
        },
        {
          h3: 'Try before you cut',
          p: 'Upload a photo, get AI face shape confirmation, and try on each recommended hairstyle instantly. Compare multiple styles side by side and use the Before/After slider to make your decision with confidence.',
        },
      ]}
      faqs={[
        {
          q: 'Can I still try styles not recommended for round faces?',
          a: 'Absolutely. The recommendations are a guide, not a restriction. You can browse all 24 hairstyles and try any of them on your photo — including styles the AI did not specifically recommend.',
        },
        {
          q: 'Does hair color matter for round faces?',
          a: 'Darker colors can create a slimming effect, while lighter colors add dimension. Try different hair colors on any style using the color picker on the result page.',
        },
      ]}
    />
  )
}
