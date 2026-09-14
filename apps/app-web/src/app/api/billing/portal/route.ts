import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createCustomerPortalSession } from '@/lib/billing'

export const runtime = 'nodejs'

// Stripe 客户门户：鉴权 → 创建 portal session → 返回跳转 URL
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. requireAuth(req) → userId
  // 2. returnUrl = new URL('/account', process.env.NEXT_PUBLIC_APP_URL).toString()
  // 3. createCustomerPortalSession({ userId, returnUrl }) → { url }
  // 4. return NextResponse.json({ url })
  throw new Error('Not implemented')
}
