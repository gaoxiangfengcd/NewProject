export interface CaptureContext {
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  user?: { id?: string; [k: string]: unknown }
}

export interface ErrorReporter {
  capture(error: Error | string, context?: CaptureContext): Promise<void>
  setUser(id?: string, traits?: Record<string, unknown>): void
  setTag(key: string, value: string): void
  withScope<T>(fn: () => Promise<T>): Promise<T>
  flush(): Promise<void>
}

export function getReporter(): ErrorReporter {
  throw new Error('Not implemented')
}

// 中间件/包装器
export function wrapHandler<T extends Function>(handler: T): T {
  throw new Error('Not implemented')
}

export interface ExpressErrorHandler {
  (err: unknown, req: unknown, res: unknown, next: unknown): void
}

export function expressErrorHandler(): ExpressErrorHandler {
  throw new Error('Not implemented')
}
