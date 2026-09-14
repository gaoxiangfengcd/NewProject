import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: '文章不存在' }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}): React.ReactElement {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2)

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* 文章头部 */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            {post.category}
          </span>
          <time className="text-muted-foreground">{post.date}</time>
          <span className="text-muted-foreground">· {post.author}</span>
        </div>
        <h1 className="mt-4 font-serif text-2xl font-bold leading-tight sm:text-3xl">
          {post.title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 文章正文 */}
      <div className="prose-content mt-8">
        {post.body.map((block, i) => {
          if (block.type === 'h2') {
            return <h2 key={i}>{block.content as string}</h2>
          }
          if (block.type === 'h3') {
            return <h3 key={i}>{block.content as string}</h3>
          }
          if (block.type === 'ul') {
            return (
              <ul key={i}>
                {(block.content as string[]).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )
          }
          return <p key={i}>{block.content as string}</p>
        })}
      </div>

      {/* 相关文章 */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-serif text-lg font-bold">相关文章</h2>
          <div className="space-y-4">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="block rounded-lg border border-border p-4 transition hover:border-accent hover:shadow-sm"
              >
                <p className="text-xs text-muted-foreground">{rp.date} · {rp.category}</p>
                <h3 className="mt-1 font-semibold hover:text-accent">{rp.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/blog" className="text-sm text-accent hover:underline">
          ← 返回博客列表
        </Link>
      </div>
    </article>
  )
}
