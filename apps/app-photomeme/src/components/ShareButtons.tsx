'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

interface ShareButtonsProps {
  url: string
}

const SHARE_TEXT = "I turned my photo into an exaggerated meme with MeMeGo. Try yours:"

export function ShareButtons({ url }: ShareButtonsProps): React.ReactElement {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(SHARE_TEXT)

  async function copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    track('share_link_copied')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms: { id: string; label: string; bg: string; href: string }[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      bg: 'hover:border-[#25D366] hover:text-[#25D366]',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      id: 'x',
      label: 'X',
      bg: 'hover:border-foreground hover:text-foreground',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      bg: 'hover:border-[#1877F2] hover:text-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'messenger',
      label: 'Messenger',
      bg: 'hover:border-[#00B2FF] hover:text-[#00B2FF]',
      href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}`,
    },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      <button type="button" onClick={copyLink} className="btn-secondary w-full">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <div className="grid grid-cols-4 gap-2">
        {platforms.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('share_platform_clicked', { platform: p.id })}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-secondary px-1 py-2 text-[11px] font-semibold text-muted-foreground transition active:scale-95 ${p.bg}`}
          >
            {p.label}
          </a>
        ))}
      </div>
    </div>
  )
}
