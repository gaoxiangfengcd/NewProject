// 浏览器端
export interface BrowserErrorReporter {
  capture(
    error: Error | string,
    context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }
  ): void
  setUser(id?: string, traits?: Record<string, unknown>): void
}

export function initBrowserReporter(opts: {
  dsn: string
  environment: string
  tracesSampleRate?: number
}): BrowserErrorReporter {
  throw new Error('Not implemented')
}

export function captureException(
  error: Error | string,
  context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }
): void {
  throw new Error('Not implemented')
}
