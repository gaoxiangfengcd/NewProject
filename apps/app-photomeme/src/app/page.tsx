import { Generator } from '@/components/Generator'

const FEATURES = [
  {
    icon: '💡',
    title: '一句话出图',
    desc: '用自然语言描述画面，无需专业 prompt 工程，AI 即刻理解并创作。',
  },
  {
    icon: '🎨',
    title: '9 种视觉风格',
    desc: '写实摄影、动漫、油画、水彩、赛博朋克、3D、像素、线稿一键切换。',
  },
  {
    icon: '📐',
    title: '多画幅比例',
    desc: '方形、横屏、竖屏、海报比例自由选择，适配头像、壁纸、封面等场景。',
  },
  {
    icon: '🔌',
    title: '模型可替换',
    desc: '底层采用 Provider 抽象，切换图片大模型只需改环境变量，不锁定厂商。',
  },
]

export default function HomePage(): React.ReactElement {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          ✨ AI 驱动的创意图片生成器
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          用一句话，生成你脑海中的
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            创意画面
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          描述场景、选择风格与比例，剩下的交给图片大模型。无需注册，打开即可创作。
        </p>
      </section>

      {/* Generator */}
      <section id="generator" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6">
        <Generator />
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-border/60 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            为什么选择 PhotoMeme
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-xl">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
