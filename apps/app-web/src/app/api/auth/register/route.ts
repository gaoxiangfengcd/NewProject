import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@repo/common'
import { hashPassword } from '@repo/auth'
import { prisma } from '@/db/client'
import { setSessionCookie, signIn } from '@/lib/auth'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toErrorRes(e: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: e.code, message: e.message } },
    { status: e.status },
  )
}

function nextMonthStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { email?: unknown; password?: unknown; name?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return toErrorRes(new ApiError('BAD_REQUEST', 400, 'Invalid JSON body'))
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : undefined

  if (!EMAIL_RE.test(email)) {
    return toErrorRes(new ApiError('INVALID_EMAIL', 400, 'Invalid email format'))
  }
  if (password.length < 8) {
    return toErrorRes(new ApiError('WEAK_PASSWORD', 400, 'Password must be at least 8 characters'))
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return toErrorRes(new ApiError('EMAIL_EXISTS', 409, 'Email already registered'))
  }

  const hashResult = await hashPassword(password)
  if (!hashResult.ok) return toErrorRes(hashResult.error)
  const passwordHash = hashResult.value

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, name },
    })
    await tx.quota.create({
      data: {
        userId: user.id,
        freeUsedThisMonth: 0,
        freeResetAt: nextMonthStart(),
      },
    })
    return user
  })

  const signInResult = await signIn(created.id, created.email)
  if (!signInResult.ok) {
    return toErrorRes(
      new ApiError('SESSION_CREATE_FAILED', 500, 'Failed to create session'),
    )
  }

  const res = NextResponse.json(
    { userId: created.id, email: created.email },
    { status: 201 },
  )
  setSessionCookie(res, signInResult.value.token)
  return res
}
