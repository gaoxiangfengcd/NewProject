import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { allSeoSlugs } from '@/lib/seo/pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const landing: MetadataRoute.Sitemap = allSeoSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...landing,
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/refund`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
