'use client'

interface GuardedImageProps {
  src: string
  alt: string
  className?: string
  locked: boolean
}

/** Unpaid previews cannot be dragged or saved from the image menu. */
export function GuardedImage({ src, alt, className, locked }: GuardedImageProps): React.ReactElement {
  return (
    <span
      className="relative block"
      onContextMenu={locked ? (event) => event.preventDefault() : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`select-none ${locked ? 'pointer-events-none' : ''} ${className ?? ''}`}
      />
      {locked ? <span className="absolute inset-0" aria-hidden="true" /> : null}
    </span>
  )
}
