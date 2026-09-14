import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'AI Haircut Simulator — Try Any Haircut on Your Photo | Haircut AI',
  description:
    'AI haircut simulator: upload your photo, pick a haircut, and see a realistic preview instantly. Bobs, fades, pixies, wolf cuts and more — free to try.',
}

export default function AIHaircutSimulatorPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="AI Haircut Simulator"
      title="The AI haircut simulator that keeps it you"
      subtitle="Upload a photo, simulate any haircut, and see a realistic before/after — in seconds, free."
      description="AI powered haircut simulator"
      sections={[
        {
          h3: 'What is an AI haircut simulator?',
          p: 'An AI haircut simulator uses image editing AI to apply a new haircut to your photo. Upload a front-facing selfie, pick a cut from the library, and the AI generates a realistic image of you with that haircut. Your face, features, skin tone, expression, pose and background all stay the same — only the hair changes. It is like trying on a haircut in a mirror, but before you actually cut.',
        },
        {
          h3: 'Simulate any haircut — for women and men',
          p: 'The library includes 24 haircuts: for women — pixies, French bobs, Italian bobs, short shags, lobs, layered bobs, wolf cuts, shags, long layers, butterfly cuts, U-cuts and curtain bangs. For men — buzz cuts, crew cuts, French crops, textured crops, fades, two-block cuts, curtains, middle parts, wolf cuts, long layers, slick backs and long curtains.',
        },
        {
          h3: 'How realistic is the simulation?',
          p: 'Our AI uses an instruction-based image editing model that preserves your identity. It does not swap your face or generate a new person. The hairline blends naturally with your forehead and sideburns, and the lighting matches your original photo. The result looks like a real photograph — not a filter, overlay or cartoon.',
        },
        {
          h3: 'From simulation to decision',
          p: 'After simulating a haircut, you can compare it side by side with up to 5 other cuts, try different hair colors, download the result, and share a public link with friends or your stylist. The Before/After slider lets you compare your current hair with the simulation in detail.',
        },
      ]}
      faqs={[
        {
          q: 'How is this different from a filter or face swap?',
          a: 'Filters overlay hair on top of your photo. Face swaps replace your face entirely. Our AI edits your actual photo — changing only the hair region while locking your identity. The result is far more realistic and useful for making real decisions.',
        },
        {
          q: 'Can I use a haircut photo from a magazine or social media?',
          a: 'Yes. Use the Reference Image feature to upload any photo with a haircut you like. The AI extracts the haircut and applies it to your photo — keeping your face intact.',
        },
        {
          q: 'Is the simulator free?',
          a: 'Yes, you can start free. Upload your photo, get face analysis, and generate your first simulations at no cost. Upgrade for unlimited generations.',
        },
      ]}
    />
  )
}
