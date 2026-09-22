import { ExampleBeforeAfter } from './ExampleBeforeAfter'

const STEPS = [
  {
    n: '01',
    emoji: '📸',
    title: 'Pick their photo',
    body: 'A clear, well-lit shot works best — your partner, a parent, a best friend, even the family dog. JPG, PNG or WebP up to 10 MB.',
  },
  {
    n: '02',
    emoji: '💡',
    title: 'Pick a direction',
    body: 'We read the photo quietly, then show a few joke directions. You choose the one to draw.',
  },
  {
    n: '03',
    emoji: '🎁',
    title: 'Draw, then tweak',
    body: 'See a preview, then tell us what to push: bigger laugh, simpler lines, keep the background. Iterate until it feels like them.',
  },
]

/**
 * 三步流程。
 *
 * 只在顶部导航的 Explore 面板里出现 —— 首页要留给上传和生成，
 * 所以这里不做整页区块的外边距，由面板控制间距。
 */
export function HowItWorks(): React.ReactElement {
  return (
    <div>
      <div className="text-center">
        <p className="eyebrow">Three steps, twenty seconds</p>
        <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight">
          From their photo to a <span className="text-highlight">finished gift</span>
        </h2>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="card relative overflow-hidden p-5">
            <span
              aria-hidden="true"
              className="absolute right-3.5 top-2.5 font-display text-4xl font-black text-foreground/[0.07]"
            >
              {step.n}
            </span>
            <span className="text-2xl leading-none" aria-hidden="true">
              {step.emoji}
            </span>
            <h3 className="mt-2.5 font-display text-base font-bold text-foreground">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <ExampleBeforeAfter />
      </div>
    </div>
  )
}
