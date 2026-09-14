import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'
import type { FaceShape } from '@/lib/hairstyles'

export const metadata: Metadata = {
  title: 'Best Hairstyle for Oval Face — AI Recommendations | Haircut AI',
  description:
    'Discover the best hairstyles for an oval face. Pixies, bobs, curtain bangs, long layers and more — try them on your photo with AI.',
}

export default function HairstyleForOvalFacePage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Hairstyle for Oval Face"
      title="The best hairstyles for an oval face"
      subtitle="Oval faces are the most versatile — but some cuts still stand out. See and try the most flattering styles."
      description="Best hairstyle for oval face shape"
      faceShape={'oval' as FaceShape}
      sections={[
        {
          h3: 'Why oval is the most versatile face shape',
          p: 'An oval face is longer than it is wide, with a slightly rounded jawline and balanced forehead. It is considered the most versatile face shape because almost any hairstyle looks good. But that does not mean every cut is equally flattering — the right style highlights your natural symmetry and brings out your best features.',
        },
        {
          h3: 'Top hairstyle picks for oval faces',
          p: 'For women: pixies highlight balanced proportions, French bobs add Parisian chic, curtain bangs frame the face softly, and long layers add movement. For men: textured crops, middle parts and two-block cuts all complement the oval shape. The AI gives you a full ranked list with reasons.',
        },
        {
          h3: 'Styles to approach with caution',
          p: 'Avoid heavy, forward-facing bangs that can shorten the face, and very long, flat hair that can drag down your proportions. If you love those looks, the AI can still generate them so you can see for yourself — the recommendations are a guide, not a rule.',
        },
        {
          h3: 'Try them on your own photo',
          p: 'Upload a selfie and the AI will confirm your face shape, then generate realistic previews of each recommended style on your photo. You can compare up to 5 styles at once and use the Before/After slider for a detailed look.',
        },
      ]}
      faqs={[
        {
          q: 'What if my face is not actually oval?',
          a: 'If the AI determines your face is round, square, heart, oblong or diamond instead, it will give you recommendations suited to that shape. Each face shape has its own dedicated guide page.',
        },
        {
          q: 'Can I try both short and long hairstyles?',
          a: 'Yes. The library includes short, medium and long styles for both women and men. Filter by length and try any style on your photo.',
        },
      ]}
    />
  )
}
