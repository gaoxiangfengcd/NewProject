import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'AI Hairstyle Changer — Change Your Hair in Photos | Haircut AI',
  description:
    'Change your hairstyle in any photo with AI. Upload a selfie, pick a style, and see yourself with a new haircut instantly. Free, realistic, identity-preserving.',
}

export default function AIHairstyleChangerPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="AI Hairstyle Changer"
      title="Change your hairstyle with AI — instantly"
      subtitle="Upload a photo, choose any hairstyle, and see yourself transformed. Your face stays the same — only the hair changes."
      description="AI hairstyle changer tool"
      sections={[
        {
          h3: 'What is an AI hairstyle changer?',
          p: 'An AI hairstyle changer lets you swap the hairstyle in any photo with a different one — no Photoshop, no salon visit required. Upload a clear front-facing selfie, pick from a library of bobs, pixies, fades, wolf cuts and more, and our AI applies the new hairstyle to your photo while keeping your face, features, skin tone and background exactly the same. It is the fastest way to preview a new look before committing to a real haircut.',
        },
        {
          h3: 'How does the AI hairstyle changer work?',
          p: 'Our AI uses an instruction-based image editing model. When you select a hairstyle, we send a detailed description — length, layers, bangs, texture, silhouette — along with your photo. The model edits the hair region of the image while locking your facial identity, expression, pose, lighting and background. The result looks like a real photograph of you with a different haircut, not a cartoon or a face-swap.',
        },
        {
          h3: 'Can I change my hair color too?',
          p: 'Yes. After generating a hairstyle, you can try different hair colors — black, brown, dark brown, blonde, ash blonde, red, copper and silver. Pick a color and the AI regenerates the look with that shade, so you can find the perfect hairstyle and color combination before your next salon appointment.',
        },
        {
          h3: 'Is it free to use the AI hairstyle changer?',
          p: 'Yes — you can try hairstyle changes for free. Upload your photo, get AI face analysis, and generate your first looks at no cost. Each generation takes just a few seconds, and you can download or share your results. Upgrade to a paid plan for unlimited generations.',
        },
      ]}
      faqs={[
        {
          q: 'Will the AI change my face or identity?',
          a: 'No. Our system is specifically designed to preserve your face, facial features, skin tone, expression, pose, clothing and background. Only the hair changes — everything else stays untouched.',
        },
        {
          q: 'What photo should I upload?',
          a: 'A clear, well-lit, front-facing photo works best. Make sure your hair is not covering your face and that the lighting is even. JPG, PNG and WebP formats are supported up to 10MB.',
        },
        {
          q: 'Can I use a reference photo from Instagram or Pinterest?',
          a: 'Yes. Upload any hairstyle photo you found online as a reference image, and the AI will extract the hairstyle from it and apply it to your photo — keeping your identity intact.',
        },
      ]}
    />
  )
}
