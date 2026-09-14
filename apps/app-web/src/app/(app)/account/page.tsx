import { cookies } from 'next/headers'
import Link from 'next/link'
import { verifyToken } from '@repo/auth'
import { prisma } from '@/db/client'

export const dynamic = 'force-dynamic'

export default async function AccountPage(): Promise<React.ReactElement> {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  const verifyRes = token ? await verifyToken(token) : null

  if (!verifyRes || !verifyRes.ok) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="eyebrow mb-2">Account</p>
        <h1 className="font-display text-4xl font-semibold">Log in to view your account</h1>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Log in
        </Link>
      </div>
    )
  }

  const { userId } = verifyRes.value
  const quota = await prisma.quota.findUnique({ where: { userId } })
  const sub = await prisma.subscription.findUnique({ where: { userId } })

  const freeLimit = Number(process.env.FREE_QUOTA_PER_MONTH ?? '3')
  const freeUsed = quota?.freeUsedThisMonth ?? 0
  const freeRemaining = Math.max(0, freeLimit - freeUsed)
  const paidCredits = quota?.paidCredits ?? 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-2">Account</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Your account</h1>

      {/* 额度概览 */}
      <div className="card mt-8">
        <p className="eyebrow mb-4">Credits</p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-semibold">{paidCredits}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Paid credits</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buy more on the <Link href="/pricing" className="text-accent hover:underline">Pricing page</Link>.
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold">{freeRemaining}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Free this month</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {freeUsed}/{freeLimit} used. Resets monthly.
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold">
              {sub?.status === 'active' ? 'Pro' : 'Free'}
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Plan</p>
            {sub?.status === 'active' && sub.currentPeriodEnd && (
              <p className="mt-1 text-xs text-muted-foreground">
                Renews {sub.currentPeriodEnd.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 最近生成 */}
      <div className="card mt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">Settings</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Subscription and billing management coming soon.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/hairstyles" className="btn-outline text-sm">Try a hairstyle</Link>
          <Link href="/pricing" className="btn-primary text-sm">Buy credits</Link>
        </div>
      </div>
    </div>
  )
}
