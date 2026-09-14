import Link from 'next/link'
import { FACE_SHAPE_LABELS, type FaceShape } from '@/lib/hairstyles'

export interface StyleCardData {
  id: string
  name: string
  gender: string
  length: string
  description: string
  suitableFaceShapes: FaceShape[]
  gradient: string
}

/**
 * 发型占位卡片（MVP：设计过的渐变视觉，后续替换真实素材只需加 image 字段）。
 * variant:
 * - browse：发型库浏览，带 Try 按钮
 * - popular：首页热门，整卡链接
 * - recommend：分析页推荐，带理由 + Try This Style
 * - select：多选对比模式，可勾选
 */
export function StylePlaceholder({
  style,
  className = '',
}: {
  style: Pick<StyleCardData, 'name' | 'length' | 'gradient'>
  className?: string
}) {
  return (
    <div
      className={`relative flex aspect-[3/4] items-end overflow-hidden rounded-2xl ${className}`}
      style={{ background: style.gradient }}
    >
      {/* 高光线条，营造发丝层次 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)',
        }}
      />
      <div className="relative z-10 w-full p-4">
        <p className="eyebrow !text-white/75">{style.length}</p>
        <p className="font-display text-2xl font-semibold leading-tight text-white drop-shadow-sm">
          {style.name}
        </p>
      </div>
    </div>
  )
}

export function StyleCardBrowse({
  style,
  faceShape,
  selected,
  onSelect,
  href,
}: {
  style: StyleCardData
  faceShape?: FaceShape
  selected?: boolean
  onSelect?: (id: string) => void
  href?: string
}) {
  const suits = faceShape
    ? style.suitableFaceShapes.includes(faceShape)
    : false
  const body = (
    <>
      <div className="relative">
        <StylePlaceholder style={style} />
        {selected && (
          <div className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow">
            ✓
          </div>
        )}
        {suits && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-accent shadow-sm">
            Great for you
          </span>
        )}
      </div>
      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{style.name}</h3>
          <span className="eyebrow shrink-0">{style.length}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{style.description}</p>
      </div>
    </>
  )

  const wrapper = onSelect ? (
    <button
      type="button"
      onClick={() => onSelect(style.id)}
      className={`block w-full rounded-3xl border p-3 text-left transition-all ${
        selected
          ? 'border-accent bg-accent-soft/40 ring-1 ring-accent'
          : 'border-border bg-white hover:border-accent/40 hover:shadow-sm'
      }`}
    >
      {body}
    </button>
  ) : (
    <Link
      href={href ?? '#'}
      className="block rounded-3xl border border-border bg-white p-3 transition-all hover:border-accent/40 hover:shadow-sm"
    >
      {body}
    </Link>
  )
  return wrapper
}

export function StyleCardRecommend({
  style,
  reason,
  href,
  ctaLabel = 'Try This Style',
  onCta,
  disabled,
}: {
  style: StyleCardData
  reason: string
  href?: string
  ctaLabel?: string
  onCta?: () => void
  disabled?: boolean
}) {
  const cta = onCta ? (
    <button
      type="button"
      onClick={onCta}
      disabled={disabled}
      className="btn-primary mt-4 w-full text-sm"
    >
      {ctaLabel}
    </button>
  ) : (
    <Link href={href ?? '#'} className="btn-primary mt-4 block w-full text-center text-sm">
      {ctaLabel}
    </Link>
  )
  return (
    <div className="card flex h-full flex-col !p-4">
      <StylePlaceholder style={style} />
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-xl font-semibold">{style.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{reason}</p>
        {cta}
      </div>
    </div>
  )
}

export function faceShapeLabel(s: FaceShape): string {
  return FACE_SHAPE_LABELS[s]
}
