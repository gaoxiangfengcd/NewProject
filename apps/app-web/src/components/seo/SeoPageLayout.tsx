import Link from 'next/link'
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'
import { StylePlaceholder } from '@/components/hairstyles/StyleCard'
import {
  getPopularHairstyles,
  recommendForFaceShape,
  type FaceShape,
} from '@/lib/hairstyles'

const comparePairs = [
  { before: '/styles/before-frenchbob.svg', after: '/styles/frenchbob.svg', label: 'French Bob' },
  { before: '/styles/before-twoblock.svg', after: '/styles/twoblock.svg', label: 'Two Block' },
  { before: '/styles/before-buzz.svg', after: '/styles/buzz.svg', label: 'Buzz Cut' },
]

export interface SeoPageProps {
  /** H1 主标题 */
  title: string
  /** hero 副标题 */
  subtitle: string
  /** 页面 SEO 关键词（用于 eyebrow 和 meta） */
  keyword: string
  /** 主体内容段落（每段 { h3, p } 结构） */
  sections: { h3: string; p: string }[]
  /** meta description */
  description: string
  /** 可选：推荐的脸型（生成针对性推荐区） */
  faceShape?: FaceShape
  /** 可选：页面底部 FAQ */
  faqs?: { q: string; a: string }[]
}

export function SeoPageLayout({
  title,
  subtitle,
  keyword,
  sections,
  description: _description,
  faceShape,
  faqs,
}: SeoPageProps): React.ReactElement {
  const popular = getPopularHairstyles(8)
  const recommended = faceShape ? recommendForFaceShape(faceShape, 4) : null

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(168,91,107,0.08) 0%, rgba(250,247,242,0) 70%)',
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <p className="eyebrow mb-5">{keyword}</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/upload" className="btn-primary px-8 py-3.5 text-base">
              Try Your Hairstyle
            </Link>
            <Link href="/hairstyles" className="btn-outline px-8 py-3.5 text-base">
              Browse Hairstyles
            </Link>
          </div>
        </div>
      </section>

      {/* Before / After showcase */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Real Results</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            See the difference on real photos
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {comparePairs.map((pair) => (
            <div key={pair.label}>
              <BeforeAfterSlider
                beforeSrc={pair.before}
                afterSrc={pair.after}
                beforeLabel="Before"
                afterLabel="After"
              />
              <p className="mt-3 text-center font-display text-lg font-medium">{pair.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 针对脸型的推荐 */}
      {recommended && faceShape && (
        <section className="border-y border-border/60 bg-white/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="eyebrow mb-3">Recommended for {faceShape} faces</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Best hairstyles for your face shape
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {recommended.map((style) => (
                <Link key={style.id} href="/upload" className="group block transition-transform hover:-translate-y-1">
                  <StylePlaceholder style={style} />
                  <p className="mt-2.5 text-sm font-medium">{style.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 主体内容 */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {sections.map((s, i) => (
          <div key={i} className="mb-10">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{s.h3}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </div>
        ))}
      </section>

      {/* Popular styles */}
      <section className="border-y border-border/60 bg-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">Explore</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Popular hairstyles to try
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {popular.map((style) => (
              <Link key={style.id} href="/upload" className="group block transition-transform hover:-translate-y-1">
                <StylePlaceholder style={style} />
                <p className="mt-2.5 text-sm font-medium">{style.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center font-display text-3xl font-semibold sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-lg font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t border-border/60 bg-accent-soft/30 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Ready to see yourself with a new hairstyle?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Upload your photo and try on any hairstyle in seconds — free, no sign-up needed to start.
          </p>
          <Link href="/upload" className="btn-primary mt-6 inline-flex px-8 py-3.5 text-base">
            Try Your Hairstyle →
          </Link>
        </div>
      </section>
    </div>
  )
}
