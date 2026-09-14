import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@repo/common'
import { verifyPassword } from '@repo/auth'
import { prisma } from '@/db/client'
import { setSessionCookie, signIn } from '@/lib/auth'

export const runtime = 'nodejs'

function toErrorRes(e: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: e.code, message: e.message } },
    { status: e.status },
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { email?: unknown; password?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return toErrorRes(new ApiError('BAD_REQUEST', 400, 'Invalid JSON body'))
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return toErrorRes(
      new ApiError('INVALID_CREDENTIALS', 401, 'Email or password missing'),
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    return toErrorRes(new ApiError('INVALID_CREDENTIALS', 401, 'Invalid email or password'))
  }

  const verifyResult = await verifyPassword(password, user.passwordHash)
  if (!verifyResult.ok) {
    return toErrorRes(new ApiError('INVALID_CREDENTIALS', 401, 'Invalid email or password'))
  }

  const signInResult = await signIn(user.id, user.email)
  if (!signInResult.ok) {
    return toErrorRes(
      new ApiError('SESSION_CREATE_FAILED', 500, 'Failed to create session'),
    )
  }

  const res = NextResponse.json({ userId: user.id, email: user.email })
  setSessionCookie(res, signInResult.value.token)
  return res
}
