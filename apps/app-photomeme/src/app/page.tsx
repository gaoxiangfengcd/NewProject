import type { Metadata } from 'next'
import { ExampleGallery } from '@/components/ExampleGallery'
import { Generator } from '@/components/Generator'
import { Hero } from '@/components/Hero'
import { Faq } from '@/components/Faq'
import { GiftSeoNav } from '@/components/GiftSeoNav'
import { SITE_NAME } from '@/lib/site'
import { homeMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = homeMetadata()

const HOME_FAQS = [
  {
    q: 'What is a digital gift?',
    a: `${SITE_NAME} draws a cartoon character from a photo. You download the cartoon and send it. It does not swap or change a real person's face, and we do not ship a physical product.`,
  },
  {
    q: 'Can I send a digital gift instantly?',
    a: 'Yes. Create, download, and share. We do not offer physical same-day delivery.',
  },
  {
    q: 'Do I need to install an app?',
    a: 'No. It runs in the browser.',
  },
  {
    q: 'Is the generated image printable?',
    a: 'Unlocked HD gifts are full resolution with no watermark, so you can print them if you want. Free previews are lighter and watermarked.',
  },
]

/**
 * 首页：礼物搜索意图优先，不是通用 AI 作图工具。
 */
export default function HomePage(): React.ReactElement {
  return (
    <div>
      <Hero />

      <ExampleGallery />

      <section id="generator" className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-10 sm:px-6">
        <Generator />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-6 sm:px-6">
        <GiftSeoNav heading="Gift ideas people actually search for" />
      </section>

      <Faq extras={HOME_FAQS} />
    </div>
  )
}
