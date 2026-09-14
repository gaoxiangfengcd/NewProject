'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import UploadDropzone from '@/components/upload/UploadDropzone'
import { startGeneration } from '@/lib/client-api'

const HAIR_COLORS = [
  { id: '', name: 'Natural', swatch: 'linear-gradient(135deg,#8B6F52,#C9A87C)' },
  { id: 'black', name: 'Black', swatch: '#1a1a1a' },
  { id: 'brown', name: 'Brown', swatch: '#6B4E37' },
  { id: 'dark-brown', name: 'Dark Brown', swatch: '#3B2417' },
  { id: 'blonde', name: 'Blonde', swatch: '#D4A856' },
  { id: 'ash-blonde', name: 'Ash Blonde', swatch: '#C0B096' },
  { id: 'red', name: 'Red', swatch: '#A0522D' },
  { id: 'copper', name: 'Copper', swatch: '#B0633A' },
  { id: 'silver', name: 'Silver', swatch: '#C0C0C0' },
]

export default function ReferencePage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Loading…</div>}>
      <ReferenceContent />
    </Suspense>
  )
}

function ReferenceContent(): React.ReactElement {
  const router = useRouter()
  const params = useSearchParams()
  // 支持 ?photoId= 从外部带进来（比如从 hairstyles 或其他页面跳过来）
  const prefilledPhotoId = params.get('photoId') ?? ''

  // 用户自己的照片（也可以从 URL 预填，或在本页内嵌上传）
  const [photoId, setPhotoId] = useState<string>(prefilledPhotoId)
  const [photoUrl, setPhotoUrl] = useState<string>('')
  // 参考图
  const [referencePhotoId, setReferencePhotoId] = useState<string | null>(null)
  const [referenceUrl, setReferenceUrl] = useState<string>('')
  const [hairColor, setHairColor] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!photoId || !referencePhotoId) return
    setBusy(true)
    setError('')
    try {
      const { generationIds } = await startGeneration({
        photoId,
        referencePhotoId,
        hairColor: hairColor || undefined,
      })
      router.push(`/result/${generationIds[0]}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setBusy(false)
    }
  }

  const canGenerate = !!photoId && !!referencePhotoId && !busy

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="eyebrow mb-3">Reference Hairstyle</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Bring a hairstyle you love
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Saw a hairstyle on Instagram, Pinterest or TikTok? Upload it here —
          our AI will apply that exact hairstyle to your photo, keeping your
          face and identity intact.
        </p>
      </div>

      {/* 双上传区：自己的照片 + 参考图 */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* 左边：自己的照片 */}
        <div>
          <p className="eyebrow mb-3">Your photo</p>
          {photoUrl ? (
            <div className="relative rounded-2xl border border-border overflow-hidden">
              <img
                src={photoUrl}
                alt="Your photo"
                className="w-full max-h-96 object-contain bg-muted/30"
              />
              <button
                type="button"
                onClick={() => { setPhotoId(''); setPhotoUrl('') }}
                className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-black/80"
              >
                Change
              </button>
            </div>
          ) : (
            <UploadDropzone
              onUploaded={(id, url) => { setPhotoId(id); setPhotoUrl(url) }}
            />
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            A clear front-facing photo of yourself. This is the face we&apos;ll preserve.
          </p>
        </div>

        {/* 右边：参考发型图 */}
        <div>
          <p className="eyebrow mb-3">Hairstyle reference image</p>
          {referenceUrl ? (
            <div className="relative rounded-2xl border border-border overflow-hidden">
              <img
                src={referenceUrl}
                alt="Reference hairstyle"
                className="w-full max-h-96 object-contain bg-muted/30"
              />
              <button
                type="button"
                onClick={() => { setReferencePhotoId(null); setReferenceUrl('') }}
                className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-black/80"
              >
                Change
              </button>
            </div>
          ) : (
            <UploadDropzone
              onUploaded={(id, url) => { setReferencePhotoId(id); setReferenceUrl(url) }}
            />
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Upload a photo of the hairstyle you want — a celebrity, model, or
            anyone whose hair you love.
          </p>
        </div>
      </div>

      {/* 分隔 + 发色 + 生成 */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="hidden lg:block" />

        <div>
          <p className="eyebrow mb-3">Hair color (optional)</p>
          <div className="flex flex-wrap gap-2">
            {HAIR_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setHairColor(c.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  hairColor === c.id
                    ? 'border-accent bg-accent-soft/60 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:border-accent/40'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ background: c.swatch }}
                />
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-accent-soft/40 p-5">
            <p className="text-sm font-medium">How it works</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-accent">1.</span>
                We detect the hairstyle structure in your reference image.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-accent">2.</span>
                AI transfers that hairstyle onto your photo.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-accent">3.</span>
                Your face, features and background stay exactly the same.
              </li>
            </ol>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={!canGenerate}
            onClick={() => void handleGenerate()}
            className="btn-primary mt-6 w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Generating…' : 'Apply This Hairstyle →'}
          </button>
          {!photoId && !referencePhotoId && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Upload both photos above to get started.
            </p>
          )}
          {photoId && !referencePhotoId && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Now upload a hairstyle reference image on the right.
            </p>
          )}
          {!photoId && referencePhotoId && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Now upload your own photo on the left.
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 text-center space-x-4">
        <Link href="/hairstyles" className="text-sm text-muted-foreground hover:text-accent">
          Or browse our hairstyle library →
        </Link>
      </div>
    </div>
  )
}
