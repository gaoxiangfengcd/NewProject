import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeoLanding } from '@/components/SeoLanding'
import { landingMetadata } from '@/lib/seo/metadata'
import { allSeoSlugs, getSeoPage } from '@/lib/seo/pages'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams(): { slug: string }[] {
  return allSeoSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getSeoPage(params.slug)
  if (!page) return { title: 'Not found', robots: { index: false, follow: false } }
  return landingMetadata(page)
}

export default function GiftLandingPage({ params }: PageProps): React.ReactElement {
  const page = getSeoPage(params.slug)
  if (!page) notFound()
  return <SeoLanding page={page} />
}
