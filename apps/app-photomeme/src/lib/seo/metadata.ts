import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import type { SeoLandingPage } from './types'

export const HOME_SEO = {
  title: `Funny Personalized Digital Gifts From Photos | ${SITE_NAME}`,
  description:
    'Turn a photo of a friend, partner, or family member into a funny personalized digital gift. MeMeGo finds what makes them unique and exaggerates it into something unforgettable.',
  h1: "Turn a Photo Into a Gift They'll Actually Laugh At",
  support:
    'Upload a photo. MeMeGo finds what makes them unmistakably them — then takes it way too far.',
} as const

const OG_IMAGE = {
  url: '/examples/after.webp',
  width: 960,
  height: 720,
  alt: 'Funny personalized digital gift created from a photo',
}

export function landingMetadata(page: SeoLandingPage): Metadata {
  const url = `${SITE_URL}/${page.slug}`
  const title = page.title.includes(SITE_NAME) ? page.title : `${page.title} | ${SITE_NAME}`
  return {
    title: page.title.replace(` | ${SITE_NAME}`, ''),
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description: page.metaDescription,
      url,
      locale: 'en_US',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.metaDescription,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  }
}

export function homeMetadata(): Metadata {
  return {
    title: { absolute: HOME_SEO.title },
    description: HOME_SEO.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      url: SITE_URL,
      locale: 'en_US',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  }
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    description: HOME_SEO.description,
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_SEO.description,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function webpageJsonLd(page: SeoLandingPage): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    description: page.metaDescription,
    url: `${SITE_URL}/${page.slug}`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    about: page.primaryKeyword,
  }
}
