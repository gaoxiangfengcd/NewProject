'use client'

import { useState, type ReactNode, type MouseEvent } from 'react'

export function ComingSoonToast({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}): React.ReactElement {
  const [show, setShow] = useState(false)

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    setShow(true)
    window.setTimeout(() => setShow(false), 3000)
  }

  return (
    <>
      <a href="#coming-soon" onClick={handleClick} className={className}>
        {children}
      </a>
      {show && (
        <div className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg">
          MeMeGo 即将上线，敬请期待！
        </div>
      )}
    </>
  )
}
