import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'Best Hairstyle for Your Face Shape — AI Guide | Haircut AI',
  description:
    'Find the best hairstyle for your face shape. AI analyzes oval, round, square, heart, oblong and diamond faces and recommends the most flattering cuts.',
}

export default function BestHairstyleForFaceShapePage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Best Hairstyle for Face Shape"
      title="Find the best hairstyle for your face shape"
      subtitle="Our AI analyzes your face shape and recommends the cuts that suit you — with clear explanations of why."
      description="Best hairstyle for my face shape"
      sections={[
        {
          h3: 'Why face shape matters for your hairstyle',
          p: 'Your face shape is one of the most important factors in choosing a flattering hairstyle. The right cut balances your proportions, softens or sharpens your features, and draws attention to your best assets. But most people do not know their face shape — and even if they do, they do not know which hairstyles suit it. That is where AI comes in.',
        },
        {
          h3: 'How AI determines your face shape',
          p: 'Upload a clear front-facing photo, and our AI analyzes your facial proportions — the width of your forehead, cheekbones, jawline and the length of your face. It classifies your face as one of six shapes: oval, round, square, heart, oblong or diamond. It also reads your hair length, texture and density for more personalized recommendations.',
        },
        {
          h3: 'Oval face: the versatile canvas',
          p: 'Oval faces are balanced and can pull off almost any hairstyle. Recommended cuts include pixies, French bobs, curtain bangs and long layers. The AI picks styles that highlight your natural symmetry without adding unnecessary volume.',
        },
        {
          h3: 'Round face: add angles and height',
          p: 'For round faces, the goal is to add height and angles to elongate the face. Recommended cuts include layered bobs, wolf cuts, shags and pixies with textured tops. Avoid blunt, chin-length cuts that emphasize roundness.',
        },
        {
          h3: 'Square face: soften the jawline',
          p: 'Square faces have strong jawlines. Recommended cuts include curtain bangs, long layers, butterfly cuts and soft bobs that soften the angles. Avoid sharp, blunt cuts that mirror the square shape.',
        },
        {
          h3: 'Heart, oblong and diamond faces',
          p: 'Heart-shaped faces benefit from chin-length cuts that balance a narrower chin. Oblong faces look great with cuts that add width — like bobs and waves. Diamond faces suit styles that soften cheekbone width with textured fringe. The AI gives you specific recommendations for your exact shape.',
        },
      ]}
      faqs={[
        {
          q: 'How do I know my face shape?',
          a: 'Upload a front-facing photo to our AI and it will analyze your proportions automatically — no measuring tape required. You get an instant face shape result along with hairstyle recommendations.',
        },
        {
          q: 'Can I try the recommended hairstyles?',
          a: 'Yes. After the analysis, each recommended hairstyle has a "Try This Style" button. Click it and the AI generates a realistic preview of that hairstyle on your photo.',
        },
        {
          q: 'What if I disagree with the AI\'s assessment?',
          a: 'No problem. The AI recommendations are a starting point. You can browse all 24 hairstyles in our library and try on any of them — regardless of the AI\'s recommendation.',
        },
      ]}
    />
  )
}
