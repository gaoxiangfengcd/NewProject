export interface SeoFaq {
  q: string
  a: string
}

export interface SeoLandingPage {
  slug: string
  title: string
  metaDescription: string
  h1: string
  eyebrow: string
  intro: string[]
  primaryKeyword: string
  secondaryKeywords: string[]
  whyDifferent: string[]
  whoFor: string
  whenToGive: string
  photoTips: string
  faqs: SeoFaq[]
  related: string[]
  heroAlt: string
}
