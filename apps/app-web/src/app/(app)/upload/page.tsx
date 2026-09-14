'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import UploadDropzone from '@/components/upload/UploadDropzone'

const tips = [
  'Face the camera directly, both ears visible',
  'Good, even lighting — no strong shadows',
  'Hair away from your face or styled naturally',
  'No heavy filters or sunglasses',
]

function UploadContent(): React.ReactElement {
  const router = useRouter()
  const params = useSearchParams()
  // returnTo 允许调用方指定上传完后去哪里
  //   /reference → 去 Reference 页面继续上传参考图
  //   /hairstyles → 去发型库选发型
  //   （空）→ 默认走 /analyze 主流程
  const returnTo = params.get('returnTo') ?? ''
  const [photoId, setPhotoId] = useState<string | null>(null)

  function handleContinue() {
    if (!photoId) return
    if (returnTo) {
      // 回到来源页面，并带上 photoId
      router.push(`${returnTo}?photoId=${photoId}`)
    } else {
      router.push(`/analyze?photoId=${photoId}`)
    }
  }

  const ctaText = returnTo
    ? (returnTo.startsWith('/reference') ? 'Continue to reference →' : 'Continue →')
    : 'Analyze My Photo →'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 来源提示条 */}
      {returnTo && (
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Link href={returnTo.startsWith('/reference') ? '/reference' : returnTo} className="hover:text-accent">
            ← Back
          </Link>
          <span>·</span>
          <span>Upload your photo, then we&apos;ll send you back.</span>
        </div>
      )}

      <div className="text-center">
        <p className="eyebrow mb-3">Step {returnTo ? '1' : '1'} of {returnTo ? '2' : '3'}</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Upload a clear
          <br />
          front-facing photo
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {returnTo
            ? 'We need your face photo to match it with the hairstyle you chose.'
            : 'We\'ll analyze your face shape and features, then recommend the hairstyles that suit you best.'}
        </p>
      </div>

      <div className="mt-10">
        <UploadDropzone onUploaded={(id) => setPhotoId(id)} />
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <p className="eyebrow mb-3 text-center">For the best results</p>
        <ul className="space-y-2">
          {tips.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] text-accent">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled={!photoId}
          onClick={handleContinue}
          className="btn-primary px-8 py-3.5 text-base"
        >
          {ctaText}
        </button>
        {!photoId && (
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP · up to 10MB · your photo stays private
          </p>
        )}
      </div>

      <div className="mt-10 flex justify-center gap-6 text-sm text-muted-foreground">
        <Link href="/hairstyles" className="hover:text-accent">
          Browse hairstyles first →
        </Link>
        <span className="text-border">|</span>
        <Link href="/reference" className="hover:text-accent">
          Bring your own reference →
        </Link>
      </div>
    </div>
  )
}

export default function UploadPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Loading…</div>}>
      <UploadContent />
    </Suspense>
  )
}
