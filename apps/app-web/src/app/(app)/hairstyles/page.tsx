'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { StyleCardBrowse } from '@/components/hairstyles/StyleCard'
import UploadDropzone from '@/components/upload/UploadDropzone'
import { HAIRSTYLES, type FaceShape, type Gender, type HairLength } from '@/lib/hairstyles'
import { startGeneration } from '@/lib/client-api'

const MAX_COMPARE = 5
const CUSTOM_EXAMPLES = [
  'Short fade with textured top, natural black, matte finish',
  'Long wavy layers, warm brown highlights, glossy',
  'French bob with curtain bangs, chin length',
  'Curly fade, tight sides, volume on top',
  'Two-block cut, soft bangs, dark brown',
]

type LengthFilter = HairLength | 'all'

export default function HairstylesPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Loading…</div>}>
      <HairstylesContent />
    </Suspense>
  )
}

function HairstylesContent(): React.ReactElement {
  const router = useRouter()
  const params = useSearchParams()
  // photoId 既可以从 URL 带进来（Analyze 流程跳过来），也可以在本页内嵌上传
  const [photoId, setPhotoId] = useState<string>(params.get('photoId') ?? '')
  const [photoUrl, setPhotoUrl] = useState<string>('')

  const [gender, setGender] = useState<Gender>('women')
  const [length, setLength] = useState<LengthFilter>('all')
  const [query, setQuery] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState<string | 'batch' | null>(null)
  const [error, setError] = useState('')
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  useEffect(() => {
    if (!photoId) return
    fetch(`/api/analyze?photoId=${photoId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.analyzed) setFaceShape(d.faceShape as FaceShape)
      })
      .catch(() => undefined)
  }, [photoId])

  const styles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HAIRSTYLES.filter((h) => {
      if (h.gender !== gender) return false
      if (length !== 'all' && h.length !== length) return false
      if (q && !`${h.name} ${h.slug} ${h.description}`.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [gender, length, query])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  async function trySingle(styleId: string) {
    if (!photoId) {
      // 不跳页：滚动到本页内嵌上传区
      document.getElementById('photo-upload-zone')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setBusy(styleId)
    setError('')
    try {
      const { generationIds } = await startGeneration({ photoId, styleIds: [styleId] })
      router.push(`/result/${generationIds[0]}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setBusy(null)
    }
  }

  async function startCompare() {
    if (!photoId || selected.length === 0) return
    setBusy('batch')
    setError('')
    try {
      const { batchId } = await startGeneration({ photoId, styleIds: selected })
      router.push(`/compare/${batchId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setBusy(null)
    }
  }

  async function startCustom() {
    if (!photoId) {
      document.getElementById('photo-upload-zone')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (customPrompt.trim().length < 3) return
    setBusy('custom')
    setError('')
    try {
      const { generationIds } = await startGeneration({ photoId, customPrompt: customPrompt.trim() })
      router.push(`/result/${generationIds[0]}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Step 3 of 3</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Hairstyle Library
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick a style to try on — or compare up to {MAX_COMPARE} at once.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCompareMode((v) => !v)}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
            compareMode
              ? 'border-accent bg-accent text-white'
              : 'border-input bg-white hover:border-accent/50'
          }`}
        >
          {compareMode ? '✓ Compare mode' : 'Compare styles'}
        </button>
      </div>

      {/* 照片状态区：没照片就内嵌上传，有照片显示就绪条 */}
      <div id="photo-upload-zone" className="mt-6">
        {photoId ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex items-center gap-3">
              {photoUrl && (
                <img src={photoUrl} alt="Your photo" className="h-12 w-12 rounded-xl object-cover" />
              )}
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Your photo is ready ✓
                </p>
                <p className="text-xs text-emerald-700/70">
                  Tap any style below to try it on.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setPhotoId(''); setPhotoUrl('') }}
              className="rounded-full border border-emerald-300 px-4 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Change photo
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Upload your photo to try styles on</p>
                <p className="text-xs text-muted-foreground">
                  Drag a photo here — no page jump, you&apos;ll stay right in the library.
                </p>
              </div>
              <Link href="/upload" className="hidden text-xs text-accent hover:underline sm:block">
                Full upload guide →
              </Link>
            </div>
            <UploadDropzone
              onUploaded={(id, url) => { setPhotoId(id); setPhotoUrl(url) }}
            />
          </div>
        )}
      </div>

      {/* 搜索 */}
      <div className="mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hairstyle — e.g. curtain bangs, fade, wolf cut"
          className="input !py-3"
        />
      </div>

      {/* 性别 Tabs */}
      <div className="mt-6 flex gap-2">
        {(['women', 'men'] as Gender[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            className={`rounded-full px-6 py-2 text-sm font-medium capitalize transition-all ${
              gender === g
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* 长度 Segmented */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(['all', 'short', 'medium', 'long'] as LengthFilter[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLength(l)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition-all ${
              length === l
                ? 'bg-accent-soft text-accent font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {l === 'all' ? 'All lengths' : l}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* 卡片网格 */}
      <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
        {compareMode
          ? `Tap up to ${MAX_COMPARE} styles to compare`
          : styles.length > 0
            ? 'Click a style to try it on'
            : ''}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {styles.map((style) => (
          <StyleCardBrowse
            key={style.id}
            style={style}
            faceShape={faceShape ?? undefined}
            selected={compareMode && selected.includes(style.id)}
            onSelect={
              compareMode
                ? toggleSelect
                : () => void trySingle(style.id)
            }
          />
        ))}
      </div>

      {styles.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-display text-2xl">No styles found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different search or filter.</p>
        </div>
      )}

      {/* Custom 折叠入口 */}
      <div className="mt-14 rounded-3xl border border-border bg-white">
        <button
          type="button"
          onClick={() => setCustomOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <div>
            <p className="font-display text-xl font-semibold">Describe a custom hairstyle</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Looking for something specific? Describe it in your own words.
            </p>
          </div>
          <span className="text-2xl text-muted-foreground">{customOpen ? '−' : '+'}</span>
        </button>
        {customOpen && (
          <div className="border-t border-border px-6 py-6">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="e.g. Short textured crop with faded sides, natural black, matte finish"
              className="input resize-none"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {CUSTOM_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setCustomPrompt(ex)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {ex.length > 42 ? `${ex.slice(0, 42)}…` : ex}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{customPrompt.length}/500</span>
              <button
                type="button"
                disabled={busy !== null || customPrompt.trim().length < 3}
                onClick={() => void startCustom()}
                className="btn-primary text-sm"
              >
                {busy === 'custom' ? 'Starting…' : 'Generate custom look'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compare 底部条 */}
      {compareMode && selected.length > 0 && (
        <div className="sticky bottom-4 z-30 mt-10">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-full border border-border bg-white px-6 py-3 shadow-lg">
            <p className="text-sm font-medium">
              {selected.length} style{selected.length > 1 ? 's' : ''} selected
            </p>
            <button
              type="button"
              disabled={busy === 'batch'}
              onClick={() => void startCompare()}
              className="btn-accent !px-6 !py-2 text-sm"
            >
              {busy === 'batch' ? 'Starting…' : `Generate ${selected.length} looks`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
