import { randomBytes } from 'node:crypto'
import { Readable } from 'node:stream'
import { ApiError } from '@repo/common'

import type { Content } from './index'

// nanoid-compatible URL-safe id generator backed by node:crypto.
// Avoids the external `nanoid` dependency (not installed in this workspace).
export function nanoid(size = 21): string {
  return randomBytes(size).toString('base64url').slice(0, size)
}

// Convert a Buffer or web ReadableStream into a Buffer for S3 PutObject.
export async function toBuffer(content: Content): Promise<Buffer> {
  if (Buffer.isBuffer(content)) return content
  return Buffer.from(await new Response(content).arrayBuffer())
}

interface SdkStreamLike {
  transformToWebStream(): ReadableStream
}

// Normalize an S3 SDK GetObject Body (a Node Readable with SdkStream mixin at
// runtime, but typed loosely as StreamingBlobTypes) into a web ReadableStream.
export function toWebStream(body: unknown): ReadableStream {
  const sdk = body as SdkStreamLike
  if (sdk && typeof sdk.transformToWebStream === 'function') {
    return sdk.transformToWebStream()
  }
  if (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream) {
    return body
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body.stream()
  }
  return Readable.toWeb(body as Readable) as ReadableStream
}

// Wrap arbitrary thrown values into an ApiError so providers always return a
// consistent error shape via err().
export function toApiError(
  e: unknown,
  code = 'STORAGE_ERROR',
  status = 500,
): ApiError {
  if (e instanceof ApiError) return e
  const message = e instanceof Error ? e.message : String(e)
  return new ApiError(code, status, message)
}
