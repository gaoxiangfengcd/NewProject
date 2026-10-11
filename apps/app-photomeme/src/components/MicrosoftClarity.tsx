'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

const PROJECT_ID =
  (process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? '').trim() || 'yvxydsfcfn'
const PROJECT_ID_RE = /^[A-Za-z0-9]{8,14}$/

/** Microsoft Clarity。未配置项目 ID 时不加载。/insights 不记入。 */
export function MicrosoftClarity(): React.ReactElement | null {
  const pathname = usePathname()
  if (!PROJECT_ID_RE.test(PROJECT_ID) || pathname === '/insights') return null

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${PROJECT_ID}");
      `}
    </Script>
  )
}
