'use client'

import { EXAGGERATION_STYLES, type ExaggerationStyleId } from '@/lib/styles'
import { track } from '@/lib/analytics'

/** 点击后向生成器广播"预选该风格"的事件名。 */
export const SELECT_STYLE_EVENT = 'memego:select-style'

/** 悬停时给每张卡片一点自己的颜色，但用柔和长投影代替霓虹辉光。 */
const CARD_ACCENT: Record<ExaggerationStyleId, string> = {
  'gift-sketch':
    'group-hover:border-orange-700/55 group-hover:shadow-[0_14px_30px_-16px_rgba(194,65,12,0.45)]',
  'funny-meme':
    'group-hover:border-primary/60 group-hover:shadow-[0_14px_30px_-16px_hsl(12_62%_46%/0.55)]',
  dramatic:
    'group-hover:border-amber-600/55 group-hover:shadow-[0_14px_30px_-16px_rgba(176,116,20,0.5)]',
  absurd:
    'group-hover:border-accent/70 group-hover:shadow-[0_14px_30px_-16px_hsl(40_65%_45%/0.55)]',
  'pop-poster':
    'group-hover:border-teal-600/50 group-hover:shadow-[0_14px_30px_-16px_rgba(13,148,136,0.45)]',
  anime:
    'group-hover:border-rose-400/70 group-hover:shadow-[0_14px_30px_-16px_rgba(214,84,104,0.45)]',
  'cartoon-3d':
    'group-hover:border-violet-400/60 group-hover:shadow-[0_14px_30px_-16px_rgba(139,110,214,0.45)]',
}

interface StyleShowcaseProps {
  /**
   * 选中风格后的收尾动作。面板里用时传关闭函数 —— 先把面板收起来再滚动，
   * 否则 body 的滚动锁会把 scrollIntoView 吃掉。
   */
  onPick?: () => void
}

/**
 * 风格一览。
 *
 * 只在顶部导航的 Explore 面板里出现，点了就预选风格并回到生成器。
 */
export function StyleShowcase({ onPick }: StyleShowcaseProps): React.ReactElement {
  function pick(id: ExaggerationStyleId): void {
    track('showcase_style_clicked', { style: id })
    window.dispatchEvent(new CustomEvent(SELECT_STYLE_EVENT, { detail: { styleId: id } }))
    onPick?.()
    window.setTimeout(() => {
      document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <div>
      <div className="text-center">
        <p className="eyebrow">A look to suit them</p>
        <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight">
          Pick the one that <span className="text-gradient">fits them</span> best
        </h2>
        <p className="mx-auto mt-2.5 max-w-lg text-sm text-muted-foreground">
          Every generation you unlock is yours to keep — try a few looks and give the one that
          lands.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXAGGERATION_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => pick(style.id)}
            className={`group card card-hover flex flex-col gap-2 p-4 text-left active:scale-[0.98] ${CARD_ACCENT[style.id]}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none" aria-hidden="true">
                {style.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-foreground">{style.name}</h3>
                <p className="text-xs text-muted-foreground">{style.tagline}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              e.g. {style.ideas[0]}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
              Try this look →
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
