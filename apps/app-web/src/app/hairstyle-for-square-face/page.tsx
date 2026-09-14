import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'
import type { FaceShape } from '@/lib/hairstyles'

export const metadata: Metadata = {
  title: 'Best Hairstyle for Square Face — AI Recommendations | Haircut AI',
  description:
    'Best hairstyles for square faces. Soften your jawline with curtain bangs, long layers, butterfly cuts and more. Try on your photo with AI.',
}

export default function HairstyleForSquareFacePage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Hairstyle for Square Face"
      title="The best hairstyles for a square face"
      subtitle="Soften strong angles and add movement. See and try the most flattering cuts for square faces."
      description="Best hairstyle for square face shape"
      faceShape={'square' as FaceShape}
      sections={[
        {
          h3: 'Understanding the square face shape',
          p: 'A square face has a strong, defined jawline with a forehead and jawline of similar width. The goal is to soften the angles and add movement that breaks up the strong horizontal lines. Avoid blunt, geometric cuts that mirror the square shape.',
        },
        {
          h3: 'Best hairstyles for square faces',
          p: 'Curtain bangs soften the forehead and frame the face. Long layers add movement and break up angularity. Butterfly cuts and shags add texture and softness. Soft bobs with waves round out the jawline. The AI gives you a full ranked list based on your specific features.',
        },
        {
          h3: 'Styles to approach with caution',
          p: 'Blunt, straight-across bobs can emphasize the square shape. Very short, uniform cuts without texture can make the jaw look sharper. Center parts with flat, heavy hair can draw attention to the forehead width. If you love these looks, try them anyway — the AI will show you a preview.',
        },
        {
          h3: 'Try them on your own photo',
          p: 'Upload a selfie and the AI will confirm your face shape, then generate realistic previews of each recommended style. You can compare up to 5 styles at once and use the Before/After slider for a detailed look.',
        },
      ]}
      faqs={[
        {
          q: 'I have a strong jawline — should I avoid short hair?',
          a: 'Not necessarily. Short styles like pixies can look stunning on square faces if they have texture and softness. The key is to avoid blunt, geometric cuts. Try a textured pixie or a soft French bob.',
        },
        {
          q: 'Can I try different hair colors?',
          a: 'Yes. After generating any hairstyle, use the color picker to try black, brown, blonde, red, copper, silver and more — all on your photo.',
        },
      ]}
    />
  )
}
