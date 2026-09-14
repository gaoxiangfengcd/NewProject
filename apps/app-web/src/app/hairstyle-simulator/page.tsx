import type { Metadata } from 'next'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'

export const metadata: Metadata = {
  title: 'Hairstyle Simulator — Preview Any Hairstyle on Your Photo | Haircut AI',
  description:
    'Hairstyle simulator: upload your photo and see yourself with any hairstyle. AI-powered, realistic, identity-preserving. Free to start.',
}

export default function HairstyleSimulatorPage(): React.ReactElement {
  return (
    <SeoPageLayout
      keyword="Hairstyle Simulator"
      title="Preview any hairstyle on your own photo"
      subtitle="Our hairstyle simulator shows you exactly how a new style will look — before you commit to it."
      description="Online hairstyle simulator"
      sections={[
        {
          h3: 'Stop guessing, start seeing',
          p: 'Browsing photos of hairstyles on other people does not tell you how they will look on you. A hairstyle simulator bridges that gap. Upload your photo, pick a style, and the AI generates a realistic image of you wearing that hairstyle. Your face stays the same — only the hair changes.',
        },
        {
          h3: '24 styles for women and men',
          p: 'Our library covers the full range: short, medium and long. Women can simulate pixies, bobs, wolf cuts, butterfly cuts, curtain bangs and more. Men can simulate buzz cuts, crew cuts, fades, textured crops, two-block cuts, middle parts and more. Filter by length, search by name, and try as many as you want.',
        },
        {
          h3: 'How the simulator works',
          p: 'Each hairstyle in the library has a detailed description built in — length, layers, bangs, texture, silhouette. When you click a style, the AI receives that description along with your photo and edits the hair region of the image. The hairline, shadows and lighting all blend naturally with the original. No prompt-writing required.',
        },
        {
          h3: 'Compare, download and share',
          p: 'Generate up to 5 hairstyles at once for a side-by-side comparison. Use the Before/After slider on each result for a detailed look. Download high-quality results, or share a public link with friends, your stylist or your barber for feedback.',
        },
      ]}
      faqs={[
        {
          q: 'Do I need to know how to write AI prompts?',
          a: 'No. Simply click a hairstyle and the AI does everything. Each style has a detailed description built into the system. You can also describe a custom style in your own words if you want something specific.',
        },
        {
          q: 'Can I simulate hair color changes?',
          a: 'Yes. After simulating a hairstyle, try different hair colors — black, brown, blonde, red, copper, silver and more — with a single click.',
        },
        {
          q: 'What photo should I use?',
          a: 'A clear, well-lit, front-facing photo works best. Make sure your face is fully visible and not partially covered by hair. JPG, PNG and WebP are supported.',
        },
      ]}
    />
  )
}
