import Image from 'next/image'

/**
 * 用真实 before / after 效果图说明产品：左边原片，右边夸张成品。
 */
export function ExampleBeforeAfter({
  caption,
}: {
  caption?: string
} = {}): React.ReactElement {
  const afterAlt =
    caption ?? 'Funny personalized digital gift created from a couple’s photo'
  return (
    <div>
      <div className="text-center">
        <p className="eyebrow">See a real example</p>
        <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight">
          Same photo. Then the <span className="text-gradient">gift</span>.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This is the cartoon character you get — drawn from their photo, not a change to their real face.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <figure className="photo-frame">
          <div className="photo-canvas">
            <Image
              src="/examples/before.webp"
              alt="Original photo of a couple, used as the starting point for a personalized gift"
              width={960}
              height={720}
              className="aspect-[4/3] w-full object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-paper/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-soft backdrop-blur-md">
              Before
            </span>
          </div>
          <figcaption className="photo-caption">The photo they sent</figcaption>
        </figure>

        <figure className="photo-frame">
          <div className="photo-canvas">
            <Image
              src="/examples/after.webp"
              alt={afterAlt}
              width={960}
              height={720}
              className="aspect-[4/3] w-full object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <span className="absolute left-2.5 top-2.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              After
            </span>
          </div>
          <figcaption className="photo-caption">The gift they got back</figcaption>
        </figure>
      </div>
    </div>
  )
}
