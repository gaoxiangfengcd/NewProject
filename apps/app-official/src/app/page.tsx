import Link from 'next/link'

const PRODUCTS = [
  {
    name: 'MeMeGo 梗图生成器',
    desc: '用 AI 一句话生成创意梗图，支持写实、动漫、油画等 9 种风格，多种画幅比例自由选择。',
    badge: '即将上线',
    tags: ['AI 生成', '图片', '创意'],
  },
]

const VALUES = [
  {
    title: '让创意触手可及',
    desc: '不需要专业设计软件，不需要复杂 prompt 工程。用自然语言描述，AI 即刻为你呈现画面。',
  },
  {
    title: '隐私优先',
    desc: '用户数据安全是我们的底线。照片和生成结果自动清理，不长期存储，遵循 GDPR 合规要求。',
  },
  {
    title: '持续创新',
    desc: '底层采用 Provider 抽象架构，随时接入最新图片大模型，让用户始终用上最好的 AI 能力。',
  },
]

const FAQS = [
  {
    q: 'MeMeGo 什么时候上线？',
    a: 'MeMeGo 梗图生成器目前正在做最后的打磨和稳定性测试，预计很快就会与大家正式见面。你可以通过首页的"体验 MeMeGo"按钮进入预告页并留下邮箱，上线时我们会第一时间通知你，同时也会在博客中发布产品动态。',
  },
  {
    q: '你们的 AI 工具是免费的吗？',
    a: 'MeMeGo 上线后会采用免费加付费的模式：新用户可以免费体验一定数量的生成次数，足够完成日常的创意表达；如果需要更多生成额度，可以选择购买积分包。具体的定价方案会在上线时公布，我们承诺定价简单透明，绝不设隐藏费用。',
  },
  {
    q: '生成的图片可以商用吗？',
    a: '通过 MeMeGo 生成的图片，用户拥有使用权，可以用于社交媒体分享、个人项目和大部分商业场景。我们建议你在正式商用前查阅服务条款中的图片使用权限说明，如有特殊的大规模商业授权需求，欢迎通过邮箱与我们联系沟通。',
  },
  {
    q: '我的数据和隐私安全吗？',
    a: '隐私安全是我们的核心设计原则，而不是事后补丁。你上传的照片和 AI 生成结果会在 7 天后自动删除，系统级清理机制不可关闭；我们不追踪你的浏览行为，不建立用户画像，并遵循 GDPR 合规要求。详细信息请阅读隐私政策页面。',
  },
  {
    q: '如何联系你们？',
    a: '你可以随时通过邮箱 gaoxiangfengcd@gmail.com 联系我们，无论是产品建议、Bug 反馈、商务合作还是媒体咨询，我们都会认真阅读并尽快回复。你也可以先浏览博客和联系我们页面，那里有更多关于团队和产品的信息。',
  },
]

export default function HomePage(): React.ReactElement {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          AI 创意工具工作室
        </span>
        <h1 className="mx-auto mt-6 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          让每一个创意，都能被看见
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          菅等村致力于开发简单好用的 AI 创意工具。从一句话生成梗图，到更多创意可能——我们相信，
          每个人都有值得表达的想法。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/coming-soon" className="btn-accent">
            体验 MeMeGo →
          </Link>
          <Link href="/about" className="btn-primary">
            了解我们
          </Link>
        </div>
      </section>

      {/* 产品 */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold sm:text-3xl">我们的产品</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((product) => (
            <Link key={product.name} href="/coming-soon" className="card group">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold group-hover:text-accent">{product.name}</h3>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {product.badge}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          <div className="card flex flex-col items-center justify-center border-dashed text-center">
            <span className="text-3xl">💡</span>
            <h3 className="mt-3 text-lg font-semibold">更多产品正在开发中</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              我们持续探索 AI 在创意领域的更多可能性。
            </p>
          </div>
        </div>
      </section>

      {/* 效果演示 */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
          一张照片，一键变身
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          上传一张普通照片，MeMeGo 就能把它变成令人捧腹的趣味漫画——
          这是团队小伙伴的真实自拍效果。
        </p>
        <div className="mt-10 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <figure className="card !p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/demo-before.jpg"
              alt="MeMeGo 效果演示：原始照片"
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
            <figcaption className="mt-3 text-center text-sm font-medium text-muted-foreground">
              上传原图
            </figcaption>
          </figure>
          <div className="flex items-center justify-center text-3xl text-accent" aria-hidden>
            →
          </div>
          <figure className="card !p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/demo-after.jpg"
              alt="MeMeGo 生成效果：铅笔素描风趣味漫画"
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
            <figcaption className="mt-3 text-center text-sm font-medium text-accent">
              MeMeGo 生成
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          铅笔素描风格 · 自动夸张化处理 · 支持写实、动漫、油画等 9 种风格
        </p>
      </section>

      {/* 价值观 */}
      <section className="border-y border-border bg-white/60">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">我们的理念</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            让我们栖居在乡村，心却与世界相连——用技术把灵感变成美好的创意，
            只为创造一份单纯而快乐的惊喜。
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">准备好开始创作了吗？</h2>
        <p className="mt-3 text-muted-foreground">打开 MeMeGo，用一句话生成你的第一张 AI 创意图片。</p>
        <Link href="/coming-soon" className="btn-accent mt-6">
          立即体验 →
        </Link>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-white/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
            常见问题解答
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            关于 MeMeGo 和菅等村，大家最关心的几个问题。
          </p>
          <div className="mt-10 space-y-4">
            {FAQS.map((item) => (
              <details key={item.q} className="card group cursor-pointer">
                <summary className="list-none font-semibold marker:hidden">
                  <span className="mr-2 text-accent" aria-hidden>
                    Q
                  </span>
                  {item.q}
                </summary>
                <p className="mt-3 cursor-default text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ 结构化数据（SEO） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />
    </div>
  )
}
