import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@repo/common'
import { requireAuth } from '@/lib/auth'
import { getQuota } from '@/lib/quota'

export const runtime = 'nodejs'

function toErrorRes(e: ApiError): NextResponse {
  return NextResponse.json(
    { error: { code: e.code, message: e.message } },
    { status: e.status },
  )
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authResult = await requireAuth(req)
  if (!authResult.ok) return toErrorRes(authResult.error)
  const { userId, email } = authResult.value
  const quotaRes = await getQuota(userId)
  return NextResponse.json({
    userId,
    email,
    quota: quotaRes.ok
      ? quotaRes.value
      : { freeUsedThisMonth: 0, freeLimit: 3, paidCredits: 0, subscriptionStatus: 'none' },
  })
}
