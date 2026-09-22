'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { GiftOccasions } from './GiftOccasions'
import { HowItWorks } from './HowItWorks'
import { StyleShowcase } from './StyleShowcase'
import { track } from '@/lib/analytics'

/**
 * 顶部导航右侧的 Explore 面板。
 *
 * 首页只留给「上传 → 生成」这一条主线，流程说明、风格一览、送礼场景
 * 这些偏营销的内容收进这里 —— 想了解的人点一下就看得到，不挡在
 * 用户动手的路上。
 */
const TABS = [
  { id: 'how', label: 'How it works' },
  { id: 'styles', label: 'Styles' },
  { id: 'occasions', label: "Who it's for" },
] as const

type TabId = (typeof TABS)[number]['id']

export function ExploreMenu(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<TabId>('how')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // 面板打开时锁住页面滚动，并支持 Esc 关闭
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const panel = (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-foreground/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Explore MeMeGo"
        className="animate-fade-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-lift sm:max-h-[85vh] sm:max-w-3xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3.5 sm:px-5">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={`chip ${tab === item.id ? 'chip-active' : 'chip-idle'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
          {tab === 'how' && <HowItWorks />}
          {tab === 'styles' && <StyleShowcase onPick={() => setOpen(false)} />}
          {tab === 'occasions' && <GiftOccasions />}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          track('explore_opened')
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-[38px] items-center rounded-full border border-border bg-paper px-4 text-sm font-semibold text-foreground shadow-soft transition hover:border-primary/50 hover:text-primary active:scale-[0.98]"
      >
        Explore
      </button>

      {/*
       * 必须挂到 body 上。header 有 backdrop-blur，backdrop-filter 会创建
       * containing block，导致面板里的 position:fixed 变成相对 header 定位
       * —— 面板会被顶到视口上方，顶部内容直接看不见。
       */}
      {open && mounted ? createPortal(panel, document.body) : null}
    </>
  )
}
