import type { Metadata } from 'next'
import Link from 'next/link'
import { SubscribeForm } from '@/components/SubscribeForm'

export const metadata: Metadata = {
  title: 'MeMeGo 即将上线',
  description: 'MeMeGo 梗图生成器即将发布，订阅通知，上线第一时间告诉你。',
}

export default function ComingSoonPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
        敬请期待
      </span>
      <h1 className="mt-6 font-serif text-4xl font-bold leading-tight sm:text-5xl">
        MeMeGo 即将发布
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
        用 AI 一句话生成创意梗图的工具正在做最后的打磨。
        留下你的邮箱，上线第一时间通知你，还会不定期分享创作技巧和灵感素材。
      </p>

      <SubscribeForm />

      <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
        {[
          { icon: '🎨', title: '9 种视觉风格', desc: '写实、动漫、油画、赛博朋克等风格一键切换。' },
          { icon: '⚡', title: '秒级生成', desc: '输入描述后几秒出图，灵感趁热落地。' },
          { icon: '🔒', title: '隐私优先', desc: '上传照片与生成结果自动清理，不留存。' },
        ].map((f) => (
          <div key={f.title} className="card">
            <div className="text-2xl">{f.icon}</div>
            <h2 className="mt-3 font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 space-x-4 text-sm">
        <Link href="/" className="text-accent hover:underline">
          ← 返回首页
        </Link>
        <Link href="/blog" className="text-accent hover:underline">
          先看看博客 →
        </Link>
      </div>
    </div>
  )
}
