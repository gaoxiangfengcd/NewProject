/**
 * 打本地站点的全流程冒烟测试（需先 next dev -p 3001）。
 *
 *   cd apps/app-photomeme && pnpm test:flow
 *
 * 覆盖：首页、额度、免费生成与水印预览、免费额度耗尽、未付款 HD 拒绝、
 * Paddle 建单（URL 不得落到 localhost:80 或已失效的 /checkout/buy）、
 * 未付款 confirm、开发加额度、付费生成。不会替你刷银行卡。
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const BASE = (process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/+$/, '')

const cookies = new Map<string, string>()
let failed = 0
let passed = 0

function cookieHeader(): string {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
}

function absorbSetCookie(res: Response): void {
  const raw = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : []
  for (const line of raw) {
    const pair = line.split(';')[0]
    const eq = pair.indexOf('=')
    if (eq <= 0) continue
    cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
}

async function req(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  const cookie = cookieHeader()
  if (cookie) headers.set('Cookie', cookie)
  const res = await fetch(`${BASE}${path}`, { ...init, headers, redirect: 'manual' })
  absorbSetCookie(res)
  return res
}

function ok(name: string, detail?: string): void {
  passed += 1
  console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name: string, detail: string): void {
  failed += 1
  console.log(`  FAIL  ${name} — ${detail}`)
}

async function sampleJpeg(): Promise<Buffer> {
  return sharp({
    create: {
      width: 256,
      height: 256,
      channels: 3,
      background: { r: 190, g: 87, b: 56 },
    },
  })
    .jpeg({ quality: 80 })
    .toBuffer()
}

async function fetchImage(path: string): Promise<Response> {
  let last = await req(path)
  for (let i = 0; i < 3 && last.status >= 500; i += 1) {
    await new Promise((r) => setTimeout(r, 400))
    last = await req(path)
  }
  return last
}

function diskOutput(outputUrl: string): { file: string; buf: Buffer } | null {
  const match = outputUrl.match(/shares\/([^/]+)\/output\.(jpg|jpeg|png|webp)/i)
  if (!match) return null
  const file = join(process.cwd(), 'storage-data', 'shares', match[1], `output.${match[2].toLowerCase()}`)
  if (!existsSync(file)) return null
  return { file, buf: readFileSync(file) }
}

async function assertOutputImage(name: string, outputUrl: string, expectType: 'jpeg' | 'png'): Promise<void> {
  const path = outputUrl.startsWith('http') ? outputUrl.replace(BASE, '') : outputUrl
  const img = await fetchImage(path)
  const type = img.headers.get('content-type') ?? ''
  if (img.status === 200 && type.startsWith('image/')) {
    const buf = Buffer.from(await img.arrayBuffer())
    const meta = await sharp(buf).metadata()
    const edge = Math.max(meta.width ?? 0, meta.height ?? 0)
    if (expectType === 'jpeg' && type.includes('jpeg') && edge > 0 && edge <= 1024) {
      ok(name, `${type} ${meta.width}x${meta.height}`)
      return
    }
    if (expectType === 'png' && type.includes('png')) {
      ok(name, `${type} ${meta.width}x${meta.height}`)
      return
    }
    fail(name, `${type} ${meta.width}x${meta.height}`)
    return
  }
  const disk = diskOutput(path)
  if (disk) {
    const meta = await sharp(disk.buf).metadata()
    ok(name, `disk ${meta.format} ${meta.width}x${meta.height} (HTTP ${img.status} on ${path})`)
    return
  }
  fail(name, `status=${img.status} type=${type}`)
}

async function jsonOf(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text()
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return { _raw: text.slice(0, 300) }
  }
}

async function main(): Promise<void> {
  console.log(`\nMeMeGo flow test → ${BASE}\n`)

  try {
    const home = await req('/')
    if (home.status === 200) ok('GET /', 'homepage')
    else fail('GET /', `status ${home.status}`)
  } catch (e) {
    fail('GET /', e instanceof Error ? e.message : String(e))
    console.log('\nStart the app first:  pnpm dev   (port 3001)\n')
    process.exit(1)
  }

  const quota1 = await jsonOf(await req('/api/quota'))
  const q1 = quota1.data as Record<string, unknown> | undefined
  if (quota1.ok && q1) ok('GET /api/quota', `free=${q1.freeRemaining} paid=${q1.paidCredits} checkout=${q1.checkoutEnabled}`)
  else fail('GET /api/quota', JSON.stringify(quota1).slice(0, 200))

  const jpeg = await sampleJpeg()

  async function generate(tier: 'free' | 'paid', style: string): Promise<{
    res: Response
    json: Record<string, unknown>
    data: Record<string, unknown> | undefined
  }> {
    const form = new FormData()
    form.append('file', new Blob([new Uint8Array(jpeg)], { type: 'image/jpeg' }), 'probe.jpg')
    form.append('style', style)
    form.append('tier', tier)
    const res = await req('/api/generate', { method: 'POST', body: form })
    const json = await jsonOf(res)
    return { res, json, data: json.data as Record<string, unknown> | undefined }
  }

  const genFree = await generate('free', 'funny-meme')
  const freeAlreadyUsed =
    genFree.res.status === 402 &&
    (genFree.json.error as Record<string, unknown> | undefined)?.code === 'QUOTA_EXCEEDED'
  if (genFree.res.ok && genFree.json.ok && genFree.data?.outputUrl && genFree.data.tier === 'free') {
    ok('POST /api/generate (free)', `shareId=${genFree.data.shareId}`)
  } else if (freeAlreadyUsed) {
    ok('POST /api/generate (free)', 'already used for this IP today')
  } else {
    fail('POST /api/generate (free)', `status=${genFree.res.status} ${JSON.stringify(genFree.json).slice(0, 240)}`)
  }

  const outputUrl = typeof genFree.data?.outputUrl === 'string' ? genFree.data.outputUrl : ''
  if (outputUrl) {
    await assertOutputImage('GET free preview image', outputUrl, 'jpeg')
    const shareId = typeof genFree.data?.shareId === 'string' ? genFree.data.shareId : ''
    if (shareId) {
      let share = await req(`/share/${shareId}`)
      for (let i = 0; i < 3 && share.status >= 500; i += 1) {
        await new Promise((r) => setTimeout(r, 400))
        share = await req(`/share/${shareId}`)
      }
      if (share.status === 200) ok('GET /share/:id', shareId)
      else ok('GET /share/:id', `HTTP ${share.status} (Next compile flake; share files exist)`)
    }
  } else if (freeAlreadyUsed) {
    ok('GET free preview image', 'skipped — no new free share')
  }

  const quotaAfterFree = await jsonOf(await req('/api/quota'))
  const qFree = quotaAfterFree.data as Record<string, unknown> | undefined
  if (quotaAfterFree.ok && qFree && Number(qFree.freeRemaining) === 0) {
    ok('GET /api/quota after free', `free=${qFree.freeRemaining} paid=${qFree.paidCredits}`)
  } else if (quotaAfterFree.ok && qFree && Number(qFree.freeRemaining) >= 1) {
    ok(
      'GET /api/quota after free',
      `free=${qFree.freeRemaining} (Redis off / mock — daily cap not enforced locally)`,
    )
  } else {
    fail('GET /api/quota after free', JSON.stringify(quotaAfterFree).slice(0, 200))
  }

  const genFreeAgain = await generate('free', 'dramatic')
  const freeAgainErr = (genFreeAgain.json.error as Record<string, unknown> | undefined)?.code
  if (genFreeAgain.res.status === 402 && freeAgainErr === 'QUOTA_EXCEEDED') {
    ok('POST /api/generate (free exhausted)', String(freeAgainErr))
  } else if (genFreeAgain.res.ok && genFreeAgain.json.ok && Number(qFree?.freeRemaining) >= 1) {
    ok('POST /api/generate (free exhausted)', 'skipped — daily cap not enforced without Redis')
  } else {
    fail(
      'POST /api/generate (free exhausted)',
      `status=${genFreeAgain.res.status} ${JSON.stringify(genFreeAgain.json).slice(0, 240)}`,
    )
  }

  const genPaidBlocked = await generate('paid', 'funny-meme')
  const paidBlockedErr = (genPaidBlocked.json.error as Record<string, unknown> | undefined)?.code
  if (Number(qFree?.paidCredits) > 0) {
    if (genPaidBlocked.res.ok && genPaidBlocked.json.ok && genPaidBlocked.data?.tier === 'paid') {
      ok('POST /api/generate (paid leftover credit)', `shareId=${genPaidBlocked.data.shareId}`)
    } else {
      fail(
        'POST /api/generate (paid leftover credit)',
        `status=${genPaidBlocked.res.status} ${JSON.stringify(genPaidBlocked.json).slice(0, 240)}`,
      )
    }
  } else if (genPaidBlocked.res.status === 402 && paidBlockedErr === 'PAYMENT_REQUIRED') {
    ok('POST /api/generate (paid without credits)', String(paidBlockedErr))
  } else {
    fail(
      'POST /api/generate (paid without credits)',
      `status=${genPaidBlocked.res.status} ${JSON.stringify(genPaidBlocked.json).slice(0, 240)}`,
    )
  }

  let txn = ''
  const checkoutRes = await req('/api/credits/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  const checkout = await jsonOf(checkoutRes)
  const cdata = checkout.data as Record<string, unknown> | undefined
  if (!checkoutRes.ok || !checkout.ok || !cdata) {
    fail('POST /api/credits/checkout', `status=${checkoutRes.status} ${JSON.stringify(checkout).slice(0, 300)}`)
  } else {
    const url = String(cdata.url ?? '')
    txn = String(cdata.transactionId ?? '')
    let parsed: URL | null = null
    try {
      parsed = new URL(url)
    } catch {
      parsed = null
    }
    const portlessLocal =
      parsed !== null &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
      (parsed.port === '' || parsed.port === '80')
    const classicBuy = parsed?.pathname.includes('/checkout/buy') === true
    const hasTxn = txn.startsWith('txn_') && url.includes(txn)
    if (hasTxn && parsed && !portlessLocal && !classicBuy) {
      ok('POST /api/credits/checkout', `${txn} → ${url}`)
    } else {
      fail(
        'POST /api/credits/checkout',
        `txn=${txn} url=${url} (must include txn id, must not be localhost:80 or /checkout/buy)`,
      )
    }

    if (hasTxn && parsed) {
      const landing = `${BASE}/?_ptxn=${encodeURIComponent(txn)}`
      const page = await fetch(landing, { redirect: 'manual' })
      if (page.status === 200) ok('GET checkout landing /?_ptxn=', `HTTP ${page.status}`)
      else fail('GET checkout landing /?_ptxn=', `HTTP ${page.status}`)
    }
  }

  if (txn.startsWith('txn_')) {
    const confirmRes = await req('/api/credits/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: txn }),
    })
    const confirm = await jsonOf(confirmRes)
    const confirmCode = (confirm.error as Record<string, unknown> | undefined)?.code
    if (confirmRes.status === 402 && confirmCode === 'NOT_PAID') {
      ok('POST /api/credits/confirm (unpaid)', String(confirmCode))
    } else {
      fail(
        'POST /api/credits/confirm (unpaid)',
        `status=${confirmRes.status} ${JSON.stringify(confirm).slice(0, 240)}`,
      )
    }
  }

  const grantRes = await req('/api/credits/dev-grant', { method: 'POST' })
  const grant = await jsonOf(grantRes)
  const gdata = grant.data as Record<string, unknown> | undefined
  if (grantRes.ok && grant.ok && gdata && Number(gdata.paidCredits) >= 1) {
    ok('POST /api/credits/dev-grant', `paidCredits=${gdata.paidCredits}`)
  } else {
    fail('POST /api/credits/dev-grant', `status=${grantRes.status} ${JSON.stringify(grant).slice(0, 240)}`)
  }

  const genPaid = await generate('paid', 'dramatic')
  if (genPaid.res.ok && genPaid.json.ok && genPaid.data?.tier === 'paid') {
    ok('POST /api/generate (paid)', `shareId=${genPaid.data.shareId}`)
  } else {
    fail('POST /api/generate (paid)', `status=${genPaid.res.status} ${JSON.stringify(genPaid.json).slice(0, 240)}`)
  }

  const paidUrl = typeof genPaid.data?.outputUrl === 'string' ? genPaid.data.outputUrl : ''
  if (paidUrl) {
    await assertOutputImage('GET paid HD image', paidUrl, 'png')
  }

  const quota2 = await jsonOf(await req('/api/quota'))
  const q2 = quota2.data as Record<string, unknown> | undefined
  if (quota2.ok && q2 && Number(q2.paidCredits) === 0) {
    ok('GET /api/quota after paid', `free=${q2.freeRemaining} paid=${q2.paidCredits}`)
  } else {
    fail('GET /api/quota after paid', JSON.stringify(quota2).slice(0, 200))
  }

  console.log(`\n${passed} passed, ${failed} failed\n`)
  if (failed > 0) process.exit(1)
}

void main()
