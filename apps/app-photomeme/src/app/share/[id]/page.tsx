import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProvider } from '@repo/storage'
import { readShareMeta, type ShareMeta } from '@/lib/share'
import { getStyle } from '@/lib/styles'
import { ShareButtons } from '@/components/ShareButtons'
import { SharePageTracker } from '@/components/SharePageTracker'
import { GuardedImage } from '@/components/GuardedImage'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'

const loadMeta = cache(async (id: string): Promise<ShareMeta | null> => {
  try {
    return await readShareMeta(getProvider(), id)
  } catch {
    return null
  }
})

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = await loadMeta(params.id)
  if (!meta) return { title: 'Gift not found', robots: { index: false, follow: false } }

  const style = getStyle(meta.style)
  const title = `Look what ${SITE_NAME} made${style ? ` — ${style.name} vibe` : ''}`
  const description = meta.twist
    ? `"${meta.twist}" — I turned a photo into a funny personalized digital gift with ${SITE_NAME}. Try yours:`
    : `I turned a photo into a funny personalized digital gift with ${SITE_NAME}. Try yours:`
  const images = [`${SITE_URL}${meta.outputUrl}`]

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/share/${meta.id}` },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: `${SITE_URL}/share/${meta.id}`,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export default async function SharePage({ params }: PageProps): Promise<React.ReactElement> {
  const meta = await loadMeta(params.id)
  if (!meta) notFound()

  const style = getStyle(meta.style)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <SharePageTracker />

      <div className="text-center">
        <p className="eyebrow">Shared meme</p>
        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
          Look what {SITE_NAME} made
        </h1>
        {style && (
          <span className="chip chip-active mt-3 cursor-default">
            {style.emoji} {style.name}
          </span>
        )}
        {meta.twist && (
          <p className="mt-3 text-sm italic text-muted-foreground">&ldquo;{meta.twist}&rdquo;</p>
        )}
      </div>

      {/* 左右两栏 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="photo-frame">
          <div className="photo-canvas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.inputUrl}
              alt="Original"
              className="aspect-square w-full object-cover"
            />
            <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-paper/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-soft backdrop-blur-md">
              Original
            </span>
          </div>
          <p className="photo-caption">The photo they sent</p>
        </div>
        <div className="photo-frame">
          <div className="photo-canvas">
            <GuardedImage
              src={meta.outputUrl}
              alt="Result"
              locked={meta.tier !== 'paid'}
              className="aspect-square w-full object-cover"
            />
            <span className="absolute left-2.5 top-2.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              Their gift
            </span>
          </div>
          <p className="photo-caption">{style ? style.name : 'Made for them'}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2.5">
        {meta.tier === 'paid' ? (
          <a href={meta.outputUrl} download="memego.png" className="btn-primary flex-1">
            Download
          </a>
        ) : (
          <Link href="/#generator" className="btn-primary flex-1 text-center">
            Unlock print-ready to download
          </Link>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-center text-sm font-semibold text-muted-foreground">
          Share it on
        </p>
        <ShareButtons url={`${SITE_URL}/share/${meta.id}`} />
      </div>

      <div className="card mt-8 border-primary/30 p-6 text-center">
        <h2 className="font-display text-xl font-bold">Want one of your own?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Upload a photo and get a funny meme in about 20 seconds. Free, no sign-up.
        </p>
        <Link href="/#generator" className="btn-primary mt-4">
          Make my meme
        </Link>
      </div>
    </div>
  )
}
