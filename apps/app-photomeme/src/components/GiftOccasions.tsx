import Link from 'next/link'

/**
 * 礼物场景区。
 *
 * 页面里唯一直接回答「我为什么要买」的区块：用户不是来玩 AI 的，
 * 是带着某个具体的人、某个具体的日子来的。把场景摆出来，比讲参数有用。
 */
const OCCASIONS = [
  {
    emoji: '🎂',
    title: 'Birthdays',
    line: 'Mum as a superhero. Dad on a film poster. The one gift that gets shown to everyone at the table.',
    tint: 'from-primary/12 to-blush/40',
    href: '/last-minute-digital-gifts',
  },
  {
    emoji: '💞',
    title: 'Anniversaries',
    line: 'The two of you, turned into something worth framing for another ten years.',
    tint: 'from-blush/50 to-accent/12',
    href: '/gifts-for-couples',
  },
  {
    emoji: '🐾',
    title: 'The one with four legs',
    line: 'Because the dog is family too — especially the one who did not make it.',
    tint: 'from-accent/12 to-primary/10',
    href: '/gifts-for-family',
  },
  {
    emoji: '🎓',
    title: 'Graduations & farewells',
    line: 'Send them off with something that makes the whole group chat laugh at once.',
    tint: 'from-primary/10 to-accent/14',
    href: '/gifts-for-friends',
  },
  {
    emoji: '🎄',
    title: 'Christmas & holidays',
    line: "A card that earns a spot on the fridge instead of the recycling bin.",
    tint: 'from-blush/45 to-primary/12',
    href: '/digital-gifts',
  },
  {
    emoji: '💌',
    title: 'Just because',
    line: 'No occasion required. A Wednesday surprise beats a forgotten birthday.',
    tint: 'from-accent/14 to-blush/45',
    href: '/funny-gifts',
  },
] as const

export function GiftOccasions(): React.ReactElement {
  return (
    <div>
      <div className="text-center">
        <span className="eyebrow">Who it&apos;s for</span>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
          Made for the moments that matter
        </h2>
        <div className="section-rule mt-3.5" />
        <p className="mx-auto mt-3.5 max-w-xl text-sm text-muted-foreground">
          A framed print says &ldquo;I thought about you&rdquo;. This one also says &ldquo;I know
          exactly who you are&rdquo; — and it makes them laugh first.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {OCCASIONS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`rounded-3xl border border-border bg-gradient-to-br p-5 transition hover:border-primary/40 ${item.tint}`}
          >
            <span className="text-xl" aria-hidden="true">
              {item.emoji}
            </span>
            <h3 className="mt-2.5 font-display text-base font-bold">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.line}</p>
          </Link>
        ))}
      </div>

      {/* 差异点：市面上全是正经肖像，这里点明「会让人笑」这个空白 */}
      <div className="mx-auto mt-7 max-w-2xl rounded-3xl border border-primary/25 bg-paper px-6 py-5 text-center shadow-soft">
        <p className="font-display text-base font-bold sm:text-lg">
          Every other AI portrait is serious.{' '}
          <span className="text-highlight">This one is the joke they keep forever.</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Oil paintings and royal portraits already exist. Nobody is making the one where Grandpa
          rides a giant rubber duck — and that is the one that ends up on the wall.
        </p>
      </div>
    </div>
  )
}
