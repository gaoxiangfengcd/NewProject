import { promises as fs, createReadStream, type Dirent } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { Readable } from 'node:stream'
import { err, ok } from '@repo/common'

import type { AsyncResult } from '@repo/common'
import type {
  Content,
  StorageProvider,
  UploadOpts,
  UploadResult,
} from '../index'
import { toApiError, toBuffer } from '../util'

// Development-only storage provider that persists objects to the local
// filesystem under process.env.LOCAL_STORAGE_DIR.
export class LocalProvider implements StorageProvider {
  private readonly root: string

  constructor(root: string) {
    // resolve 成绝对路径，保证 listObjects 截取相对 key 时长度计算正确
    this.root = resolve(root)
  }

  async upload(
    key: string,
    content: Content,
    opts?: UploadOpts,
  ): AsyncResult<UploadResult> {
    try {
      const fullPath = join(this.root, key)
      await fs.mkdir(dirname(fullPath), { recursive: true })
      const body = await toBuffer(content)
      await fs.writeFile(fullPath, body)
      const url = opts?.public ? `/${key}` : undefined
      return ok<UploadResult>({ key, url })
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async download(key: string): AsyncResult<ReadableStream> {
    try {
      const fullPath = join(this.root, key)
      await fs.access(fullPath)
      const nodeStream = createReadStream(fullPath)
      return ok(Readable.toWeb(nodeStream) as ReadableStream)
    } catch (e) {
      return err(toApiError(e, 'NOT_FOUND', 404))
    }
  }

  async delete(key: string): AsyncResult<void> {
    try {
      await fs.rm(join(this.root, key))
      return ok(undefined)
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async listObjects(prefix?: string): AsyncResult<{ key: string; lastModified?: Date }[]> {
    try {
      const baseDir = prefix ? join(this.root, prefix) : this.root
      const out: { key: string; lastModified?: Date }[] = []

      const walk = async (dir: string): Promise<void> => {
        let entries: Dirent[]
        try {
          entries = await fs.readdir(dir, { withFileTypes: true })
        } catch (e) {
          if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') return
          throw e
        }
        for (const entry of entries) {
          const full = join(dir, entry.name)
          if (entry.isDirectory()) {
            await walk(full)
          } else if (entry.isFile()) {
            const key = full.slice(this.root.length + 1).split(join('/')).join('/')
            const stat = await fs.stat(full)
            out.push({ key, lastModified: stat.mtime })
          }
        }
      }
      await walk(baseDir)
      return ok(out)
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async deleteByOwner(ownerId: string): AsyncResult<{ deleted: number }> {
    try {
      const targets: string[] = []
      await this.collectOwnerFiles(this.root, ownerId, targets)
      let deleted = 0
      for (const file of targets) {
        await fs.rm(file, { force: true })
        deleted++
      }
      return ok({ deleted })
    } catch (e) {
      return err(toApiError(e))
    }
  }

  async getSignedUrl(
    key: string,
    opts: { expiresInSec: number; action: 'get' | 'put' },
  ): AsyncResult<string> {
    const base = process.env.PUBLIC_BASE_URL ?? ''
    const expires = Date.now() + opts.expiresInSec * 1000
    return ok(`${base}/${key}?expires=${expires}`)
  }

  async exists(key: string): AsyncResult<boolean> {
    try {
      await fs.access(join(this.root, key))
      return ok(true)
    } catch (e) {
      const code = (e as NodeJS.ErrnoException)?.code
      if (code === 'ENOENT') return ok(false)
      return err(toApiError(e))
    }
  }

  // Recursively walk `dir` and collect file paths stored under any directory
  // named `ownerId` (the per-owner subtree produced by buildKey's layout).
  private async collectOwnerFiles(
    dir: string,
    ownerId: string,
    out: string[],
  ): Promise<void> {
    let entries: Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === ownerId) {
          await this.collectAllFiles(fullPath, out)
        } else {
          await this.collectOwnerFiles(fullPath, ownerId, out)
        }
      }
    }
  }

  private async collectAllFiles(dir: string, out: string[]): Promise<void> {
    let entries: Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await this.collectAllFiles(fullPath, out)
      } else {
        out.push(fullPath)
      }
    }
  }
}
