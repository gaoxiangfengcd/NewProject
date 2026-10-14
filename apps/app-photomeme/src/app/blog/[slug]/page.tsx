import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogPair } from '@/components/BlogPair'
import { JsonLd } from '@/components/JsonLd'
import { allBlogSlugs, getBlogPost, otherBlogPosts } from '@/lib/blog-posts'
import { breadcrumbJsonLd } from '@/lib/seo/metadata'
import { SITE_NAME, SITE_URL } from '@/lib/site'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams(): { slug: string }[] {
  return allBlogSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug)
  if (!post) return { title: 'Not found', robots: { index: false, follow: false } }
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      images: [{ url: post.cover, width: 960, height: 1200, alt: post.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  }
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function BlogPostPage({ params }: PageProps): React.ReactElement {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            image: `${SITE_URL}${post.cover}`,
            author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
          </li>
        </ol>
      </nav>

      <p className="eyebrow mt-5">Blog</p>
      <h1 className="mt-2 font-display text-[1.75rem] font-bold leading-[1.2] tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{formatDate(post.date)}</p>

      <div className="prose-app mt-8">
        {post.blocks.map((block, index) => {
          if (block.type === 'p') {
            return <p key={index}>{block.text}</p>
          }
          if (block.type === 'h2') {
            return (
              <h2 key={index} className="font-display">
                {block.text}
              </h2>
            )
          }
          if (block.type === 'pair') {
            return <BlogPair key={index} pair={block.pair} />
          }
          return null
        })}
      </div>

      {post.blocks.some((block) => block.type === 'cta') ? (
        <div className="mt-10 flex justify-center">
          <Link href="/#generator" className="btn-primary">
            Create Your Free Preview
          </Link>
        </div>
      ) : null}

      <nav aria-label="More from the blog" className="mt-14 border-t border-border/70 pt-8">
        <p className="eyebrow">More from the blog</p>
        <ul className="mt-3 space-y-2">
          {otherBlogPosts(post.slug).map((item) => (
            <li key={item.slug}>
              <Link
                href={`/blog/${item.slug}`}
                className="text-sm font-semibold text-foreground transition hover:text-primary"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  )
}
