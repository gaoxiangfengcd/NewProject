'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * Google AdSense 广告位组件。
 *
 * 用法（占位符，AdSense 审核通过后替换 ad-slot 参数）：
 *   <AdSlot slot="" format="auto" />
 *
 * 注意：审核期间 AdSense 会显示空白或"广告位不可用"，属正常现象。
 */
export function AdSlot({
  slot,
  format = 'auto',
  className = 'my-6',
}: {
  slot?: string
  format?: string
  className?: string
}): React.ReactElement {
  const insRef = useRef<HTMLModElement>(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    if (pushedRef.current) return
    if (!insRef.current) return

    ;(window.adsbygoogle ||= []).push({})
    pushedRef.current = true
  }, [])

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1830259629636903"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
