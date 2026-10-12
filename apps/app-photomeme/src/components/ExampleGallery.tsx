import { ExampleGrid } from '@/components/ExampleGrid'
import { GiftOccasions } from '@/components/GiftOccasions'

/**
 * 首屏下面的信任区：多样图墙 + 家人/伴侣/朋友等场景。
 * 首屏已经有前后对比，这里不再重复同一对。
 */
export function ExampleGallery(): React.ReactElement {
  return (
    <section id="examples" className="scroll-mt-20 pb-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          A few from our users
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Friends, family, couples — anyone in the photo. Same 30 seconds. A cartoon they can laugh
          at and send today, not a change to their real face.
        </p>
      </div>

      <ExampleGrid />

      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        <GiftOccasions heading={false} />
      </div>

      <div className="mt-8 text-center">
        <a href="#generator" className="btn-primary text-lg sm:min-h-[60px] sm:px-10">
          Create Your Free Preview
        </a>
      </div>
    </section>
  )
}
