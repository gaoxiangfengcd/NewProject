import Link from 'next/link'
import { ComingSoonToast } from '@/components/ComingSoonToast'

const PRODUCTS = [
  {
    name: 'MeMeGo 梗图生成器',
    url: 'https://memego.jiandengcun.com',
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
          <ComingSoonToast className="btn-accent">
            体验 MeMeGo →
          </ComingSoonToast>
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
            <ComingSoonToast key={product.name} className="card group">
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
            </ComingSoonToast>
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
        <ComingSoonToast className="btn-accent mt-6">
          立即体验 →
        </ComingSoonToast>
      </section>
    </div>
  )
}
