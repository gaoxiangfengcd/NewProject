import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AdSlot } from '@/components/AdSlot'

export const metadata: Metadata = {
  title: '博客',
  description: '菅等村团队博客 — AI 创意工具、技术实践和产品思考。',
}

export default function BlogPage(): React.ReactElement {
  const allPosts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">博客</h1>
      <p className="mt-3 text-muted-foreground">
        分享我们在 AI 创意工具开发中的技术实践、产品思考和行业观察。
      </p>

      <AdSlot className="mt-6" />

      <div className="mt-10 space-y-8">
        {allPosts.map((post) => (
          <article key={post.slug} className="border-b border-border pb-8">
            <Link href={`/blog/${post.slug}`} className="group block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt={post.coverAlt}
                loading="lazy"
                className="aspect-video w-full rounded-xl border border-border object-cover transition group-hover:opacity-90"
              />
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <time className="text-muted-foreground">{post.date}</time>
              </div>
              <h2 className="mt-3 font-serif text-xl font-bold group-hover:text-accent sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
