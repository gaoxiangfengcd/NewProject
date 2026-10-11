import { HeroDemo } from '@/components/HeroDemo'

/**
 * 首屏只做三件事：一句话说清、拖一下看懂、点免费预览。
 * 手机上演示在标题下面、按钮上面，不用先滚一屏才看到成品。
 */
export function Hero(): React.ReactElement {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-5 pt-6 sm:px-6 sm:pb-8 sm:pt-10">
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="contents lg:block">
          <p className="eyebrow order-1 text-center lg:text-left">30 seconds · no sign-up</p>
          <h1 className="order-2 mt-2 text-center font-display text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-[2.6rem] lg:mt-3 lg:text-left lg:text-5xl">
            Turn a friend&apos;s photo into a funny gift in 30 seconds
          </h1>
          <p className="order-5 mx-auto mt-3 hidden max-w-md text-base leading-relaxed text-muted-foreground lg:mt-4 lg:block lg:text-left">
            Drop in a photo you already have. They get a cartoon they can laugh at and send today —
            not a filter, not a face swap. The first preview is free.
          </p>
          <a
            href="#generator"
            className="btn-primary order-4 mt-5 w-full animate-glow text-lg sm:min-h-[64px] sm:px-12 lg:mt-6 lg:w-auto"
          >
            Create Your Free Preview
          </a>
          <p className="order-6 mt-2.5 text-center text-sm text-muted-foreground lg:text-left">
            No account. A cartoon they can send today — not a change to their real face.
          </p>
        </div>

        <div className="order-3">
          <HeroDemo />
        </div>
      </div>
    </section>
  )
}
