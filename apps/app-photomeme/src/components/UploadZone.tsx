'use client'

import { useRef, useState } from 'react'
import { ACCEPT_ATTR, MAX_IMAGE_BYTES, validateImage } from '@/lib/validation'
import { track } from '@/lib/analytics'

interface UploadZoneProps {
  previewUrl: string | null
  onSelect: (file: File) => void
  onError: (message: string) => void
  disabled?: boolean
}

export function UploadZone({ previewUrl, onSelect, onError, disabled }: UploadZoneProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File | null | undefined): void {
    if (!file || disabled) return
    const result = validateImage(file)
    if (!result.ok) {
      onError(result.message)
      return
    }
    track('photo_selected', { mime: result.mime, sizeKb: Math.round(file.size / 1024) })
    onSelect(file)
  }

  if (previewUrl) {
    return (
      <div className="photo-frame animate-pop-in">
        <div className="photo-canvas">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Photo of the person you are making this for"
            className="aspect-square w-full object-cover"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 right-3 rounded-xl bg-paper/90 px-4 py-2 text-sm font-semibold text-foreground shadow-soft backdrop-blur-md transition hover:bg-paper"
          >
            Change photo
          </button>
        </div>
        <p className="photo-caption">Their photo</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
    )
  }

  // 空态也套一层相纸：右边结果位是相纸，这边若是普通虚线框，两列底部会差出一个标签的高度。
  return (
    <div className="photo-frame">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={`flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[2px] border-2 border-dashed p-6 text-center transition ${
          dragging
            ? 'border-primary bg-primary/10'
            : 'border-border bg-paper hover:border-primary/50 hover:bg-primary/5'
        }`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition ${dragging ? 'border-primary' : 'border-border'}`}
        >
          <svg
            className={`h-7 w-7 ${dragging ? 'text-primary' : 'text-muted-foreground'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5V21"
            />
          </svg>
        </div>
        <span className="font-display text-base font-bold">Drop their photo here</span>
        <span className="text-sm text-muted-foreground">
          or tap to browse · JPG, PNG, WebP · max {Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB
        </span>
      </button>
      <p className="photo-caption">Their photo</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
