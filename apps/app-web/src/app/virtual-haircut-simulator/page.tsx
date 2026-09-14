import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'Virtual Haircut Simulator — Try Before You Cut | Haircut AI',
  description:
    'Simulate any haircut on your own photo before going to the salon. AI-powered haircut simulator with realistic before/after comparison. Free to try.',
}

export default function VirtualHaircutSimulatorPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Virtual Haircut Simulator"
      title="Simulate your next haircut — before you cut"
      subtitle="Upload a photo, pick a haircut, and see a realistic preview. Our AI haircut simulator shows you exactly how it will look."
      description="AI virtual haircut simulator"
      sections={[
        {
          h3: 'What is a virtual haircut simulator?',
          p: 'A virtual haircut simulator lets you preview a haircut on your own photo before you actually cut your hair. Upload a front-facing selfie, choose from a library of haircuts — bobs, pixies, fades, wolf cuts, curtain bangs and more — and the AI applies the cut to your image. You get a realistic Before/After comparison so you can decide with confidence.',
        },
        {
          h3: 'Why use a haircut simulator?',
          p: 'A bad haircut can take months to grow out. A simulator lets you try 5, 10 or 20 haircuts in the time it takes to browse Instagram. You can compare styles side by side, try different hair colors, and even upload a reference photo of a haircut you saw somewhere. By the time you sit in the salon chair, you already know your answer.',
        },
        {
          h3: 'Realistic results that preserve your identity',
          p: 'Our AI does not generate a new face. It edits your photo — changing only the hair while keeping your facial features, skin tone, expression, pose, clothing and background exactly the same. The hairline blends naturally with your forehead, and the lighting matches the original photo. The result looks like a real photograph, not a filter or a face-swap.',
        },
        {
          h3: 'Works for both men and women',
          p: 'The simulator includes 24 haircuts across women\'s and men\'s styles. Women can try pixies, French bobs, wolf cuts, butterfly cuts, curtain bangs and more. Men can try buzz cuts, crew cuts, French crops, textured crops, fades, two-block cuts, curtains and more. Filter by short, medium or long, and search by name.',
        },
      ]}
      faqs={[
        {
          q: 'Can I try the simulator on my phone?',
          a: 'Yes. The simulator is a web app that works on any device. Upload a selfie from your phone, try haircuts, and compare results — all without downloading anything.',
        },
        {
          q: 'Can I simulate a haircut from a photo I found online?',
          a: 'Absolutely. Use the Reference Image feature: upload any photo with a hairstyle you like, and the AI will extract the haircut and apply it to your photo — keeping your face intact.',
        },
      ]}
    />
  )
}
