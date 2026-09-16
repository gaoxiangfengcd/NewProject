'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

export function SharePageTracker(): null {
  useEffect(() => {
    track('share_page_view')
  }, [])
  return null
}
