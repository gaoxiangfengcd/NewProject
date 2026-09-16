/**
 * 分享图片清理脚本（无数据库版）：删除超过保留期的 shares/{id}/ 目录。
 *
 * 运行方式（在 apps/app-photomeme 目录下）：
 *   pnpm cleanup:shares              # 实际删除（默认保留 7 天）
 *   pnpm cleanup:shares -- --dry-run # 只打印，不删除
 *
 * 环境变量：
 *   STORAGE_RETENTION_DAYS  保留天数，默认 7
 *   LOCAL_STORAGE_DIR / R2_* 从环境或 .env.local 读取
 *
 * 生产 cron（容器内）：
 *   30 4 * * * cd /app/apps/app-photomeme && pnpm cleanup:shares >> /var/log/memego-cleanup.log 2>&1
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getProvider } from '@repo/storage'

function loadEnvLocal(): void {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const envPath = path.resolve(here, '..', '.env.local')
  let raw: string
  try {
    raw = readFileSync(envPath, 'utf8')
  } catch {
    return
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvLocal()

const RETENTION_DAYS = Number(process.env.STORAGE_RETENTION_DAYS ?? '7')
const DRY_RUN = process.argv.includes('--dry-run')

async function main(): Promise<void> {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000
  console.log(
    `[cleanup-shares] retention: ${RETENTION_DAYS} days · dry-run: ${DRY_RUN} · cutoff: ${new Date(cutoff).toISOString()}`,
  )

  const storage = getProvider()
  const list = await storage.listObjects('shares')
  if (!list.ok) {
    console.error(`[cleanup-shares] list failed: ${list.error.message}`)
    process.exitCode = 1
    return
  }

  // 按 shareId 分组，取目录内最早 mtime 作为生成时间（对象创建后不可变）
  const dirs = new Map<string, { keys: string[]; oldest: number }>()
  for (const obj of list.value) {
    const rest = obj.key.slice('shares/'.length)
    const slash = rest.indexOf('/')
    if (slash === -1) continue // 非目录结构，跳过
    const id = rest.slice(0, slash)
    if (!/^[A-Za-z0-9_-]{8,32}$/.test(id)) continue
    const ts = obj.lastModified?.getTime() ?? Date.now()
    const entry = dirs.get(id)
    if (entry) {
      entry.keys.push(obj.key)
      entry.oldest = Math.min(entry.oldest, ts)
    } else {
      dirs.set(id, { keys: [obj.key], oldest: ts })
    }
  }

  let expired = 0
  let deletedFiles = 0
  let failedFiles = 0

  for (const [id, group] of dirs) {
    if (group.oldest > cutoff) continue
    expired += 1
    for (const key of group.keys) {
      if (DRY_RUN) {
        console.log(`  [dry-run] would delete ${key}`)
        continue
      }
      const r = await storage.delete(key)
      if (r.ok) {
        deletedFiles += 1
      } else {
        failedFiles += 1
        console.warn(`  ! failed to delete ${key}: ${r.error.message}`)
      }
    }
    console.log(`[cleanup-shares] ${DRY_RUN ? 'would remove' : 'removed'} share ${id} (${group.keys.length} files)`)
  }

  console.log(
    `[cleanup-shares] done. shares: ${dirs.size} · expired: ${expired} · files deleted: ${deletedFiles} · failures: ${failedFiles}`,
  )
}

main().catch((e) => {
  console.error('[cleanup-shares] failed:', e)
  process.exit(1)
})
