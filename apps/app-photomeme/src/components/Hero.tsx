/**
 * 首屏只做两件事：一句话说清、点免费预览。
 * 成品对比放在下面的样图墙，这里不再重复同一张图。
 */
export function Hero(): React.ReactElement {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-5 pt-8 text-center sm:px-6 sm:pb-6 sm:pt-12">
      <p className="eyebrow">30 seconds · no sign-up</p>
      <h1 className="mt-2 font-display text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-[2.6rem] lg:mt-3 lg:text-5xl">
        Turn their photo into a funny gift in 30 seconds
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground lg:mt-4">
        A friend, a parent, a partner, the whole family — anyone in a photo you already have.
        Custom cartoon portraits you can laugh at and send today. Not a filter. Not a face swap.
        Free cartoon portrait.
      </p>
      <a
        href="#generator"
        className="btn-primary mt-5 w-full animate-glow text-lg sm:min-h-[64px] sm:w-auto sm:px-12"
      >
        Create Your Free Preview
      </a>
      <p className="mt-2.5 text-sm text-muted-foreground">
        No account. Friends, family, couples — a cartoon, not a change to their real face.
      </p>
    </section>
  )
}
