/**
 * 存储清理脚本：删除超过 TTL 的用户照片与生成结果，控制存储成本。
 *
 * 运行方式（在 apps/app-web 目录下）：
 *   pnpm cleanup:storage              # 实际删除（默认保留 7 天）
 *   pnpm cleanup:storage -- --dry-run # 只打印将要删除的内容，不实际删除
 *
 * 环境变量：
 *   STORAGE_RETENTION_DAYS  保留天数，默认 7
 *   （其余 DATABASE_URL / LOCAL_STORAGE_DIR / R2_* 从 .env.local 读取）
 *
 * 建议：生产环境用 cron 每天跑一次，例如
 *   0 4 * * * cd /app/apps/app-web && pnpm cleanup:storage >> /var/log/cleanup.log 2>&1
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getProvider } from '@repo/storage'
import { prisma } from '../src/db/client'

// ---------- .env.local 手动加载（tsx 独立进程不会自动加载 Next 的 env） ----------
function loadEnvLocal(): void {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const envPath = path.resolve(here, '..', '.env.local')
  let raw: string
  try {
    raw = readFileSync(envPath, 'utf8')
  } catch {
    return // 没有 .env.local 就依赖进程环境变量
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
const BATCH = 200

function isStorageKey(key: string | null | undefined): key is string {
  return !!key && !key.startsWith('data:')
}

async function main(): Promise<void> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  console.log(`[cleanup] retention: ${RETENTION_DAYS} days · cutoff: ${cutoff.toISOString()} · dry-run: ${DRY_RUN}`)

  const storage = getProvider()
  let deletedFiles = 0
  let failedFiles = 0

  // ---------- 1. 清理过期 Generation 的结果文件 ----------
  console.log('[cleanup] scanning old generations…')
  let genCursor: string | undefined
  let oldGenIds: string[] = []
  for (;;) {
    const gens = await prisma.generation.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true, resultR2Key: true },
      take: BATCH,
      ...(genCursor ? { cursor: { id: genCursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
    })
    if (gens.length === 0) break
    for (const g of gens) {
      oldGenIds.push(g.id)
      if (isStorageKey(g.resultR2Key)) {
        if (DRY_RUN) {
          console.log(`  [dry-run] would delete result: ${g.resultR2Key}`)
        } else {
          const r = await storage.delete(g.resultR2Key)
          if (r.ok) deletedFiles += 1
          else { failedFiles += 1; console.warn(`  ! failed to delete ${g.resultR2Key}: ${r.error.message}`) }
        }
      }
    }
    genCursor = gens[gens.length - 1].id
    if (gens.length < BATCH) break
  }
  console.log(`[cleanup] old generations found: ${oldGenIds.length}`)

  // ---------- 2. 清理过期 Photo 的源文件 ----------
  console.log('[cleanup] scanning old photos…')
  let photoCursor: string | undefined
  let oldPhotoIds: string[] = []
  for (;;) {
    const photos = await prisma.photo.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true, r2Key: true },
      take: BATCH,
      ...(photoCursor ? { cursor: { id: photoCursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
    })
    if (photos.length === 0) break
    for (const p of photos) {
      oldPhotoIds.push(p.id)
      if (isStorageKey(p.r2Key)) {
        if (DRY_RUN) {
          console.log(`  [dry-run] would delete photo: ${p.r2Key}`)
        } else {
          const r = await storage.delete(p.r2Key)
          if (r.ok) deletedFiles += 1
          else { failedFiles += 1; console.warn(`  ! failed to delete ${p.r2Key}: ${r.error.message}`) }
        }
      }
    }
    photoCursor = photos[photos.length - 1].id
    if (photos.length < BATCH) break
  }
  console.log(`[cleanup] old photos found: ${oldPhotoIds.length}`)

  // ---------- 3. 删除数据库记录 ----------
  // Photo 删除会级联删除其 Generation 和 FaceAnalysis（schema onDelete: Cascade）。
  // 额外显式删除孤立的旧 Generation（理论上不存在，兜底）。
  if (!DRY_RUN) {
    if (oldGenIds.length > 0) {
      // 分批 deleteMany，避免单次参数过多
      for (let i = 0; i < oldGenIds.length; i += BATCH) {
        await prisma.generation.deleteMany({ where: { id: { in: oldGenIds.slice(i, i + BATCH) } } })
      }
    }
    if (oldPhotoIds.length > 0) {
      for (let i = 0; i < oldPhotoIds.length; i += BATCH) {
        await prisma.photo.deleteMany({ where: { id: { in: oldPhotoIds.slice(i, i + BATCH) } } })
      }
    }
  }

  console.log(
    `[cleanup] done. ${DRY_RUN ? '[dry-run] no changes made.' : ''} ` +
      `photos: ${oldPhotoIds.length} · generations: ${oldGenIds.length} · files deleted: ${deletedFiles} · file failures: ${failedFiles}`,
  )

  // ---------- 4. 孤儿文件扫描：存储中存在但 DB 无引用的文件 ----------
  // 保护 24 小时内的新文件（可能是正在进行中的上传/生成）。
  console.log('[cleanup] scanning orphan files…')
  const [livePhotos, liveGens] = await Promise.all([
    prisma.photo.findMany({ select: { r2Key: true } }),
    prisma.generation.findMany({ select: { resultR2Key: true } }),
  ])
  const referenced = new Set<string>()
  for (const p of livePhotos) {
    if (isStorageKey(p.r2Key)) referenced.add(p.r2Key)
  }
  for (const g of liveGens) {
    if (isStorageKey(g.resultR2Key)) referenced.add(g.resultR2Key)
  }

  const listRes = await storage.listObjects()
  if (!listRes.ok) {
    console.warn(`[cleanup] orphan scan skipped: ${listRes.error.message}`)
  } else {
    const orphanGrace = Date.now() - 24 * 60 * 60 * 1000
    let orphanMatched = 0
    let orphanDeleted = 0
    for (const obj of listRes.value) {
      if (referenced.has(obj.key)) continue
      // 只清理 photos/ 与 results/ 作用域下的文件，避免误删其他内容
      if (!obj.key.startsWith('photos/') && !obj.key.startsWith('results/')) continue
      if (obj.lastModified && obj.lastModified.getTime() > orphanGrace) continue
      orphanMatched += 1
      if (DRY_RUN) {
        console.log(`  [dry-run] would delete orphan: ${obj.key}`)
      } else {
        const r = await storage.delete(obj.key)
        if (r.ok) {
          orphanDeleted += 1
        } else {
          failedFiles += 1
          console.warn(`  ! failed to delete orphan ${obj.key}: ${r.error.message}`)
        }
      }
    }
    console.log(
      `[cleanup] orphan files ${DRY_RUN ? 'matched' : 'deleted'}: ${DRY_RUN ? orphanMatched : orphanDeleted}`,
    )
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('[cleanup] failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
