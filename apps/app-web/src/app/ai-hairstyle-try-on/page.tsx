import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'AI Hairstyle Try-On — See Yourself With Any Hairstyle | Haircut AI',
  description:
    'Try on hairstyles with AI before you cut your hair. Upload a photo, get personalized recommendations based on your face shape, and see realistic results instantly.',
}

export default function AIHairstyleTryOnPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="AI Hairstyle Try-On"
      title="Try on any hairstyle with AI"
      subtitle="Upload a selfie, get AI recommendations for your face shape, and see yourself with a new haircut — before you visit the salon."
      description="AI hairstyle try-on tool"
      sections={[
        {
          h3: 'How AI hairstyle try-on works',
          p: 'AI hairstyle try-on uses an image editing model to apply a new hairstyle to your photo. Unlike filters or face swaps, our AI preserves your facial identity — your eyes, nose, mouth, skin tone, expression and pose all stay exactly the same. Only the hair changes. This means you see a realistic preview of what you would actually look like with that haircut.',
        },
        {
          h3: 'Get personalized recommendations for your face shape',
          p: 'Before you try on any style, our AI analyzes your photo to determine your face shape — oval, round, square, heart, oblong or diamond. It also reads your hair length, texture and density. Based on these features, you get a curated list of recommended hairstyles with clear explanations of why each one suits you.',
        },
        {
          h3: 'Compare multiple hairstyles side by side',
          p: 'Can\'t decide between a bob, a wolf cut or curtain bangs? Select up to 5 hairstyles and generate them all at once. The comparison view puts them side by side so you can quickly see which one feels most like you. Use the Before/After slider on each result for a detailed look.',
        },
        {
          h3: 'Try on hairstyles from Instagram, Pinterest and TikTok',
          p: 'Saw a hairstyle you love on social media? Upload that photo as a reference image, and our AI will extract the hairstyle from it and apply it to your face. You get to see what that celebrity or influencer hairstyle looks like on you — not on them.',
        },
      ]}
      faqs={[
        {
          q: 'Is the try-on realistic?',
          a: 'Yes. Our AI blends the hairline naturally with your forehead and sideburns, matches the original photo\'s lighting and camera angle, and produces a result that looks like a real photograph — not a cartoon or filter.',
        },
        {
          q: 'Do I need to write a prompt?',
          a: 'No. Simply click a hairstyle from our library and the AI does the rest. Each style has a detailed description built in — you never need to write or understand AI prompts.',
        },
        {
          q: 'Can I try men\'s and women\'s hairstyles?',
          a: 'Yes. Our library includes 24 styles for both women and men — from pixies and bobs to fades, crew cuts, two-block cuts and more.',
        },
      ]}
    />
  )
}
