import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'Virtual Hairstyle Try-On — Preview Your Next Haircut | Haircut AI',
  description:
    'Virtual hairstyle try-on tool. Upload your photo, see yourself with different hairstyles, compare looks, and find the one that suits you best — all online.',
}

export default function VirtualHairstyleTryOnPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Virtual Hairstyle Try-On"
      title="Virtual hairstyle try-on that feels real"
      subtitle="Preview any hairstyle on your own face before you commit. AI-powered, identity-preserving, and free to start."
      description="Virtual hairstyle try-on online"
      sections={[
        {
          h3: 'The smarter way to choose your next hairstyle',
          p: 'Choosing a new hairstyle is a big decision. You see a look on Instagram or in a magazine, but will it actually suit you? Virtual try-on removes the guesswork. Upload a photo, try on as many styles as you want, and compare them side by side. No more hoping for the best at the salon — you walk in knowing exactly what you want.',
        },
        {
          h3: 'What makes our virtual try-on different',
          p: 'Most virtual try-on tools either overlay a wig on your photo or generate a completely new face. Ours does neither. We use an instruction-based AI editing model that changes only your hair while locking your facial identity. The result is a photo that genuinely looks like you — just with different hair. The hairline, texture, lighting and shadows all blend naturally.',
        },
        {
          h3: 'From face analysis to hairstyle recommendation',
          p: 'Our system does not just change hair — it helps you decide what to change it to. First, AI analyzes your face shape, hair length, texture and density. Then it recommends hairstyles that flatter your specific features, with clear explanations of why. You can also browse a library of 24 styles for women and men, filter by length and gender, and search by name.',
        },
        {
          h3: 'Share your results and get feedback',
          p: 'Once you find a look you love, download it, share it with a public link, or compare multiple looks in a single view. Send options to your friends, your stylist, or your barber — and get feedback before you make the cut.',
        },
      ]}
      faqs={[
        {
          q: 'Do I need to download an app?',
          a: 'No. Haircut AI is a web app that works on any device — phone, tablet or computer. No download or installation required.',
        },
        {
          q: 'How long does a virtual try-on take?',
          a: 'Each hairstyle generation takes about 3–10 seconds depending on the style. You can generate up to 5 styles at once for side-by-side comparison.',
        },
      ]}
    />
  )
}
