import Image from 'next/image'
import type { BlogPair as BlogPairData } from '@/lib/blog-posts'

export function BlogPair({ pair }: { pair: BlogPairData }): React.ReactElement {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      <figure className="photo-frame pb-[11px]">
        <div className="photo-canvas">
          <Image
            src={pair.before}
            alt={pair.beforeAlt}
            width={960}
            height={1200}
            className="aspect-[4/5] w-full object-cover object-top"
            sizes="(min-width: 640px) 40vw, 100vw"
          />
        </div>
      </figure>
      <figure className="photo-frame pb-[11px]">
        <div className="photo-canvas">
          <Image
            src={pair.after}
            alt={pair.afterAlt}
            width={960}
            height={1200}
            className="aspect-[4/5] w-full object-cover object-top"
            sizes="(min-width: 640px) 40vw, 100vw"
          />
        </div>
      </figure>
    </div>
  )
}
