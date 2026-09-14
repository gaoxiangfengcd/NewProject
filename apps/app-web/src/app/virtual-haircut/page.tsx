import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'Virtual Haircut — Try a Haircut Online Before You Cut | Haircut AI',
  description:
    'Get a virtual haircut online. Upload your photo, try any haircut, and see realistic results instantly. Free, AI-powered, identity-preserving.',
}

export default function VirtualHaircutPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Virtual Haircut"
      title="Get a virtual haircut — before the real one"
      subtitle="Upload your photo and try any haircut online. See yourself transformed in seconds, then decide with confidence."
      description="Virtual haircut try-on tool"
      sections={[
        {
          h3: 'What is a virtual haircut?',
          p: 'A virtual haircut is an AI-generated preview of a haircut on your own photo. Instead of imagining how a cut might look, you see it — realistically, on your face, with your features. Upload a selfie, pick a cut, and the AI does the rest. No appointment, no risk, no waiting for it to grow back.',
        },
        {
          h3: 'How it works',
          p: 'Our AI takes your photo and a detailed description of the target haircut — length, layers, bangs, texture, silhouette — and edits the hair region of the image. Your facial identity is locked: face, features, skin tone, expression, pose, clothing and background all remain exactly the same. The hairline blends naturally and the lighting matches. The result looks like a real photograph.',
        },
        {
          h3: 'Perfect for your next salon visit',
          p: 'Take the guesswork out of your next haircut. Try 5 or 10 styles, compare them side by side, pick your favorite, and show it to your stylist. Many of our users screenshot their favorite result and bring it to the salon — their stylist gets a clear visual reference of exactly what they want.',
        },
        {
          h3: 'For men and women',
          p: 'The library includes 24 cuts: for women — pixies, French bobs, lobs, wolf cuts, shags, butterfly cuts, curtain bangs and more. For men — buzz cuts, crew cuts, French crops, textured crops, fades, two-block cuts, middle parts and more. Try short, medium or long styles.',
        },
      ]}
      faqs={[
        {
          q: 'Is it really free?',
          a: 'Yes. You can upload your photo, get AI face analysis, and generate virtual haircuts for free. Upgrade to a paid plan for unlimited generations.',
        },
        {
          q: 'Can I share my virtual haircut?',
          a: 'Yes. Each result has a Share button that copies a public link. Send it to friends, your stylist or your barber for feedback.',
        },
        {
          q: 'What if the result does not look like me?',
          a: 'Our AI is specifically designed to preserve your identity. If the result does not look like you, try uploading a clearer, better-lit front-facing photo and make sure your face is not partially covered by hair.',
        },
      ]}
    />
  )
}
