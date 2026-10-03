'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

const MEASUREMENT_ID =
  (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim() || 'G-1FG5XMGL2R'
const MEASUREMENT_ID_RE = /^G-[A-Z0-9]+$/

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** GA4。测量 ID 形如 G-XXXX，未配置时不加载。/insights 不记入。 */
export function GoogleAnalytics(): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const enabled = MEASUREMENT_ID_RE.test(MEASUREMENT_ID) && pathname !== '/insights'
  const firstView = useRef(true)

  useEffect(() => {
    if (!enabled) return
    if (firstView.current) {
      firstView.current = false
      return
    }
    if (!window.gtag) return
    const query = searchParams.toString()
    const page_path = query ? `${pathname}?${query}` : pathname
    window.gtag('event', 'page_view', {
      page_path,
      page_location: window.location.href,
    })
  }, [enabled, pathname, searchParams])

  if (!enabled) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
