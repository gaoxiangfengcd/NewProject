import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BLOG_POSTS, postExamplePair } from '@/lib/blog-posts'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog',
  description: `How ${SITE_NAME} turns a photo into a funny cartoon gift — with real before and after examples.`,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `Blog | ${SITE_NAME}`,
    description: `How ${SITE_NAME} turns a photo into a funny cartoon gift — with real before and after examples.`,
    url: `${SITE_URL}/blog`,
    images: [{ url: '/examples/friends-after.webp', width: 960, height: 720 }],
  },
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function BlogIndexPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="text-center">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Real photos, then the gift
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          How MeMeGo works, with the before and after from gifts people actually made.
        </p>
      </header>

      <ul className="mt-10 space-y-4">
        {BLOG_POSTS.map((post) => {
          const pair = postExamplePair(post)
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-hover flex gap-4 overflow-hidden rounded-3xl border border-border bg-paper p-3 sm:p-4"
              >
                {pair ? (
                  <span className="grid h-28 w-[8.75rem] shrink-0 grid-cols-2 overflow-hidden rounded-2xl sm:h-32 sm:w-40">
                    <Image
                      src={pair.before}
                      alt=""
                      width={240}
                      height={300}
                      className="h-full w-full object-cover object-top"
                    />
                    <Image
                      src={pair.after}
                      alt=""
                      width={240}
                      height={300}
                      className="h-full w-full object-cover object-top"
                    />
                  </span>
                ) : (
                  <Image
                    src={post.cover}
                    alt=""
                    width={240}
                    height={300}
                    className="h-28 w-20 shrink-0 rounded-2xl object-cover object-top sm:h-32 sm:w-24"
                  />
                )}
                <div className="min-w-0 py-1">
                  <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
                  <h2 className="mt-1 font-display text-lg font-bold leading-snug sm:text-xl">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
