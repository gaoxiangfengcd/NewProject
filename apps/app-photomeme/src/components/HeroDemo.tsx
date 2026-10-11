'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'

/**
 * 首屏演示：同一张图上左右拖，左边原照片，右边铅笔卡通。
 * 比两张并排更省高度，手机上不用滚就能看懂产品。
 */
export function HeroDemo(): React.ReactElement {
  const [pos, setPos] = useState(52)
  const frameRef = useRef<HTMLDivElement>(null)

  const moveTo = useCallback((clientX: number) => {
    const box = frameRef.current?.getBoundingClientRect()
    if (!box || box.width < 1) return
    const next = ((clientX - box.left) / box.width) * 100
    setPos(Math.min(94, Math.max(6, next)))
  }, [])

  return (
    <figure className="photo-frame">
      <div
        ref={frameRef}
        className="photo-canvas aspect-[4/3] cursor-ew-resize touch-none select-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          moveTo(event.clientX)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX)
        }}
      >
        <Image
          src="/examples/after.webp"
          alt="Pencil cartoon gift drawn from the same couple photo"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 36vw, 92vw"
          draggable={false}
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src="/examples/before.webp"
            alt="Original photo of a couple, before it becomes a cartoon gift"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 36vw, 92vw"
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-paper shadow-soft"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-sm font-bold text-primary shadow-lift">
            ↔
          </span>
        </div>
        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-lg bg-paper/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-soft backdrop-blur-md">
          Their photo
        </span>
        <span className="absolute bottom-2.5 right-2.5 z-10 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
          The gift
        </span>
      </div>
      <figcaption className="photo-caption">Drag to see the same photo become the gift</figcaption>
    </figure>
  )
}
