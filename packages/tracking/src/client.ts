// 浏览器端 SDK
export interface BrowserTrackerOpts {
  provider?: 'posthog'
  endpoint?: string
  flushAt?: number
  flushIntervalMs?: number
  disableAutoTracking?: boolean
}

export interface BrowserTracker {
  track(event: string, props?: Record<string, unknown>): void
  page(url: string, props?: Record<string, unknown>): void
  identify(userId: string, traits?: Record<string, unknown>): void
  startAutoTracking(): void // 自动埋点：click、pageview、form submit
  stopAutoTracking(): void
  flush(): Promise<void>
}

export function createBrowserTracker(opts: BrowserTrackerOpts): BrowserTracker {
  void opts
  throw new Error('Not implemented')
}
