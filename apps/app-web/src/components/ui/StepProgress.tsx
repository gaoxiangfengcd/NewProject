'use client'

import { useEffect, useState } from 'react'

/**
 * 分阶段进度（分析/生成共用）。
 * 传入 steps 文案数组，自动按 interval 推进；done 时全部点亮。
 */
export function StepProgress({
  steps,
  done = false,
  intervalMs = 900,
}: {
  steps: string[]
  done?: boolean
  intervalMs?: number
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (done) {
      setCurrent(steps.length)
      return
    }
    const timer = setInterval(() => {
      setCurrent((c) => (c < steps.length - 1 ? c + 1 : c))
    }, intervalMs)
    return () => clearInterval(timer)
  }, [done, steps.length, intervalMs])

  return (
    <div className="space-y-4">
      {steps.map((label, i) => {
        const state = done || i < current ? 'done' : i === current ? 'active' : 'pending'
        return (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-all ${
                state === 'done'
                  ? 'border-success bg-success text-success-foreground'
                  : state === 'active'
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border bg-white text-muted-foreground'
              }`}
            >
              {state === 'done' ? '✓' : i + 1}
            </span>
            <div>
              <p
                className={`text-sm font-medium ${
                  state === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                }`}
              >
                {label}
              </p>
              {state === 'active' && (
                <p className="mt-0.5 text-xs text-accent">Working…</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
