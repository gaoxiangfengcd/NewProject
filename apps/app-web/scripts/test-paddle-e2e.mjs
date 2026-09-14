#!/usr/bin/env node
/**
 * Paddle 支付链路完整 E2E 测试
 *
 * 走一遍：注册用户 → 查初始 credits → 模拟 Paddle.js 传 customData 完成支付
 *       → 模拟 Paddle webhook 回调（带 HMAC 签名 + custom_data）→ 验证 credits +6
 *       → 重发同一 webhook → 验证幂等（credits 不再增加）
 *
 * 运行：
 *   pnpm --filter app-web exec node scripts/test-paddle-e2e.mjs
 *
 * 依赖：
 *   - dev server 在 http://localhost:3000 运行
 *   - .env.local 里 PADDLE_WEBHOOK_SECRET 已填
 */

import crypto from 'node:crypto'
import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// 读 .env.local
const envContent = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
for (const line of envContent.split('\n')) {
  const m = line.match(/^(\w+)="?(.*?)"?$/)
  if (m) process.env[m[1]] = m[2]
}

const BASE = 'http://localhost:3000'
const SECRET = process.env.PADDLE_WEBHOOK_SECRET
const DB_PATH = path.join(ROOT, 'src/db/prisma/dev.db')

let pass = 0, fail = 0
function t(name, cond, detail = '') {
  if (cond) { console.log(`  ✅ ${name}`); pass++ }
  else { console.log(`  ❌ ${name}  ${detail}`); fail++ }
}

// ——— HTTP helpers ———
function httpReq(url, opts = {}, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const mod = u.protocol === 'https:' ? https : http
    const req = mod.request({
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method: opts.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
    }, (res) => {
      let data = '', cookies = res.headers['set-cookie'] ?? []
      res.on('data', c => data += c)
      res.on('end', () => {
        try { data = JSON.parse(data) } catch {}
        resolve({ status: res.statusCode, data, cookies })
      })
    })
    req.on('error', reject)
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body))
    req.end()
  })
}

// 简单 SQLite 查询（直接 spawn sqlite3）
function db(sql) {
  return new Promise((resolve, reject) => {
    const p = spawn('sqlite3', [DB_PATH, sql])
    let out = '', err = ''
    p.stdout.on('data', c => out += c)
    p.stderr.on('data', c => err += c)
    p.on('close', code => code === 0 ? resolve(out.trim()) : reject(new Error(err)))
  })
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  Paddle 支付链路 E2E 测试')
  console.log('═══════════════════════════════════════════\n')

  // 0. 前置检查
  console.log('【0. 前置检查】')
  t('SECRET 已配置', !!SECRET, SECRET ? `len=${SECRET.length}` : 'MISSING')
  try {
    const h = await httpReq(`${BASE}/api/webhook/paddle`)
    t('dev server 可达（GET /webhook 返回 200）', h.status === 200, `status=${h.status}`)
  } catch (e) {
    t('dev server 可达', false, String(e.message))
    console.log('\n❌ dev server 没跑，先 `pnpm --filter app-web dev`')
    process.exit(1)
  }

  // 1. 注册测试用户
  console.log('\n【1. 注册测试用户】')
  const email = `paddle-test-${Date.now()}@test.com`
  const pw = 'Test123456!'
  const reg = await httpReq(`${BASE}/api/auth/register`, { method: 'POST' }, { email, password: pw })
  t('注册成功', reg.status === 201 || reg.status === 200, `status=${reg.status}`)

  // 2. 登录 → 拿 cookie + userId
  const login = await httpReq(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { Cookie: (reg.cookies ?? []).join('; ') }
  }, { email, password: pw })
  const cookies = (reg.cookies ?? []).concat(login.cookies ?? [])
  t('登录成功', login.status === 200, `status=${login.status}`)

  const me = await httpReq(`${BASE}/api/auth/me`, { headers: { Cookie: cookies.join('; ') } })
  const userId = me.data?.userId
  t('拿到 userId', !!userId, userId ?? 'MISSING')

  // 3. 查初始 credits
  console.log('\n【2. 初始状态】')
  const initialCredits = Number(await db(`SELECT paidCredits FROM Quota WHERE userId='${userId}'`)) || 0
  console.log(`  paidCredits = ${initialCredits}`)

  // 4. 模拟真实 Paddle webhook：transaction.completed + custom_data（Paddle.js v2 格式）
  console.log('\n【3. 模拟 Paddle webhook — transaction.completed】')
  const eventId = `evt-e2e-${Date.now()}`
  const txId = `txn-e2e-${Date.now()}`
  const payload = {
    event_id: eventId,
    event_name: 'transaction.completed',
    data: {
      id: txId,
      // ✅ 这才是 Paddle.js v2 的正确格式：custom_data 是对象，不是字符串
      custom_data: { userId, credits: 6, packId: 'credit-6' },
    },
  }
  const rawBody = JSON.stringify(payload)
  const ts = Math.floor(Date.now() / 1000).toString()
  const h1 = crypto.createHmac('sha256', SECRET).update(`${ts}:${rawBody}`).digest('hex')
  const signature = `ts=${ts};h1=${h1}`
  console.log(`  event_id = ${eventId}`)
  console.log(`  signature = ${signature.slice(0, 40)}…`)

  const wh = await httpReq(`${BASE}/api/webhook/paddle`, {
    method: 'POST',
    headers: { 'paddle-signature': signature },
  }, rawBody)

  t('HTTP 200', wh.status === 200, `status=${wh.status}`)
  t('handled=true', wh.data?.handled === true, JSON.stringify(wh.data))
  t('credits=6', wh.data?.credits === 6)
  t('userId 匹配', wh.data?.userId === userId)

  // 5. 验证 credits 到账
  console.log('\n【4. credits 到账验证】')
  const afterCredits = Number(await db(`SELECT paidCredits FROM Quota WHERE userId='${userId}'`))
  console.log(`  paidCredits  ${initialCredits} → ${afterCredits}`)
  t('+6 credits', afterCredits === initialCredits + 6, `expected ${initialCredits + 6}, got ${afterCredits}`)

  // 6. 幂等测试：重发同一 event_id
  console.log('\n【5. 幂等测试 — 重发同一 event_id】')
  const h2 = crypto.createHmac('sha256', SECRET).update(`${ts}:${rawBody}`).digest('hex')
  const sig2 = `ts=${ts};h1=${h2}`
  const wh2 = await httpReq(`${BASE}/api/webhook/paddle`, {
    method: 'POST',
    headers: { 'paddle-signature': sig2 },
  }, rawBody)
  t('HTTP 200（重复也返回 200）', wh2.status === 200, `status=${wh2.status}`)
  t('skipped=true', wh2.data?.skipped === true || wh2.data?.handled === false, JSON.stringify(wh2.data))

  const afterReplay = Number(await db(`SELECT paidCredits FROM Quota WHERE userId='${userId}'`))
  console.log(`  paidCredits  ${afterCredits} → ${afterReplay}（应该不变）`)
  t('credits 不再增加', afterReplay === afterCredits, `should stay ${afterCredits}, got ${afterReplay}`)

  // 7. 审计表
  console.log('\n【6. PaddleEvent 审计表】')
  const evtCount = await db(`SELECT COUNT(*) FROM PaddleEvent WHERE userId='${userId}'`)
  const successCount = await db(`SELECT COUNT(*) FROM PaddleEvent WHERE userId='${userId}' AND success=1`)
  console.log(`  记录数: ${evtCount}  成功: ${successCount}`)
  t('有审计记录', Number(evtCount) >= 1)
  t('标记 success=1', Number(successCount) >= 1)

  // 8. 坏签名 → 401
  console.log('\n【7. 安全 — 坏签名拒绝】')
  const badPayload = JSON.stringify({ event_id: 'evt-bad', event_name: 'transaction.completed', data: { id: 'txn-bad', custom_data: { userId, credits: 6 } } })
  const badSig = 'ts=1234567890;h1=deadbeef'
  const wh3 = await httpReq(`${BASE}/api/webhook/paddle`, {
    method: 'POST',
    headers: { 'paddle-signature': badSig },
  }, badPayload)
  t('HTTP 401', wh3.status === 401, `status=${wh3.status}`)

  // 结果
  console.log('\n═══════════════════════════════════════════')
  console.log(`  结果：${pass}/${pass + fail} passed`)
  console.log(fail ? '  ❌ 有失败项，请检查上方输出' : '  ✅ 全通过！')
  console.log('═══════════════════════════════════════════\n')

  process.exit(fail ? 1 : 0)
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
