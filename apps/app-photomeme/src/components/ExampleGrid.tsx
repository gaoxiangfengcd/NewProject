import Image from 'next/image'
import { EXAMPLE_SLOTS, type ExampleSlot } from '@/lib/example-slots'

const CARD_FRAME = 'photo-frame w-[320px] shrink-0 pb-[11px] sm:w-[400px] lg:w-[460px]'

function SlotCard({
  slot,
  decorative = false,
}: {
  slot: ExampleSlot
  decorative?: boolean
}): React.ReactElement {
  if (!slot.ready) {
    return (
      <figure className={CARD_FRAME} aria-hidden={decorative || undefined}>
        <div className="photo-canvas">
          <div className="aspect-[4/5] w-full bg-[hsl(30_28%_94%)]" />
        </div>
      </figure>
    )
  }

  return (
    <figure className={CARD_FRAME} aria-hidden={decorative || undefined}>
      <div className="photo-canvas">
        <div className="grid grid-cols-2 gap-px bg-[rgba(116,88,54,0.12)]">
          <Image
            src={slot.after}
            alt={decorative ? '' : slot.alt}
            width={640}
            height={800}
            className="aspect-[4/5] w-full object-cover object-top"
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 200px, 160px"
          />
          <Image
            src={slot.before}
            alt=""
            width={640}
            height={800}
            className="aspect-[4/5] w-full object-cover object-top"
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 200px, 160px"
          />
        </div>
      </div>
    </figure>
  )
}

function CardRow({
  slots,
  decorative = false,
}: {
  slots: ExampleSlot[]
  decorative?: boolean
}): React.ReactElement {
  return (
    <div className="flex gap-4 pr-4" aria-hidden={decorative || undefined}>
      {slots.map((slot) => (
        <SlotCard key={`${decorative ? 'loop' : 'show'}-${slot.id}`} slot={slot} decorative={decorative} />
      ))}
    </div>
  )
}

/**
 * 多样图墙：横向走马灯。原图和漫画并排，卡片上不写分组、不写备注。
 */
export function ExampleGrid(): React.ReactElement {
  const slots = EXAMPLE_SLOTS

  return (
    <>
      <div className="example-marquee mt-6 motion-reduce:hidden">
        <div className="example-marquee-track">
          <CardRow slots={slots} />
          <CardRow slots={slots} decorative />
        </div>
      </div>
      <div className="mt-6 hidden overflow-x-auto px-4 motion-reduce:block sm:px-6">
        <div className="flex w-max gap-4 pb-2">
          {slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      </div>
    </>
  )
}
