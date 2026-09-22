import type { Metadata } from 'next'
import { Generator } from '@/components/Generator'
import { ExampleBeforeAfter } from '@/components/ExampleBeforeAfter'
import { Faq } from '@/components/Faq'
import { GiftSeoNav } from '@/components/GiftSeoNav'
import { SITE_NAME } from '@/lib/site'
import { homeMetadata, HOME_SEO } from '@/lib/seo/metadata'
import Image from 'next/image'

export const metadata: Metadata = homeMetadata()

const HOME_FAQS = [
  {
    q: 'What is a digital gift?',
    a: `${SITE_NAME} makes a personalized illustrated image from a photo. You download it and send it — no shipping and no physical product from us.`,
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
      <section className="mx-auto max-w-3xl px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-8 sm:pt-10">
        <Image
          src="/logo.webp"
          alt={`${SITE_NAME} — funny personalized digital gifts from photos`}
          width={720}
          height={730}
          priority
          className="mx-auto h-auto w-[min(100%,22rem)] sm:w-[26rem]"
        />
        <h1 className="mt-6 font-display text-[2.1rem] font-bold leading-[1.15] tracking-tight sm:mt-8 sm:text-[2.75rem]">
          {HOME_SEO.h1}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {HOME_SEO.support}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <a href="#generator" className="btn-primary">
            Make a Gift
          </a>
          <a href="#examples" className="btn-secondary">
            Explore Examples
          </a>
        </div>
      </section>

      <section id="examples" className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-8 sm:px-6">
        <ExampleBeforeAfter />
      </section>

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
