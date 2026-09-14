import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { verifyToken } from '@repo/auth';
import { SESSION_COOKIE } from '@/lib/auth';
import { prisma } from '@/db/client';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Haircut AI — Find Your Perfect Hairstyle',
  description:
    'See how different hairstyles look on you before you cut your hair. AI face analysis, personalized hairstyle recommendations, and realistic try-on.',
};

async function isLoggedIn(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    const result = await verifyToken(token);
    return result.ok;
  } catch {
    return false;
  }
}

async function getNavCredits(): Promise<{
  freeRemaining: number;
  paidCredits: number;
} | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const result = await verifyToken(token);
    if (!result.ok) return null;
    const quota = await prisma.quota.findUnique({ where: { userId: result.value.userId } });
    const freeLimit = Number(process.env.FREE_QUOTA_PER_MONTH ?? '3');
    const freeUsed = quota?.freeUsedThisMonth ?? 0;
    return {
      freeRemaining: Math.max(0, freeLimit - freeUsed),
      paidCredits: quota?.paidCredits ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const loggedIn = await isLoggedIn();
  const credits = await getNavCredits();

  const paidCredits = credits?.paidCredits ?? 0;

  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-semibold tracking-tight">
                Haircut
              </span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                AI
              </span>
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              <Link
                href="/hairstyles"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Hairstyles
              </Link>
              <Link
                href="/reference"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Reference
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              {loggedIn && (
                <Link
                  href="/account"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Account
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2">
              {loggedIn && credits !== null && (
                <Link
                  href="/pricing"
                  className="hidden items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground sm:flex"
                  title={`${credits.paidCredits} paid credits · ${credits.freeRemaining} free this month`}
                >
                  {paidCredits === 0 ? (
                    <span className="text-xs">No credits</span>
                  ) : (
                    <>
                      <span className="font-semibold text-accent">{paidCredits}</span>
                      <span className="text-xs">paid</span>
                    </>
                  )}
                  {credits.paidCredits === 0 && (
                    <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      Buy
                    </span>
                  )}
                </Link>
              )}
              {loggedIn ? (
                <Link href="/upload" className="btn-primary !px-5 !py-2 text-sm">
                  Try Your Hairstyle
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-ghost text-sm">
                    Log in
                  </Link>
                  <Link href="/auth/register" className="btn-primary !px-5 !py-2 text-sm">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-border/60 bg-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-semibold">Haircut AI</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Find the hairstyle that actually suits you — before you cut it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-4">
              <div className="space-y-2">
                <p className="eyebrow">Product</p>
                <Link href="/upload" className="block text-muted-foreground hover:text-foreground">
                  Try-on
                </Link>
                <Link href="/hairstyles" className="block text-muted-foreground hover:text-foreground">
                  Hairstyle Library
                </Link>
                <Link href="/reference" className="block text-muted-foreground hover:text-foreground">
                  Reference Image
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </div>
              <div className="space-y-2">
                <p className="eyebrow">Guides</p>
                <Link href="/best-hairstyle-for-face-shape" className="block text-muted-foreground hover:text-foreground">
                  Best hairstyle for your face
                </Link>
                <Link href="/virtual-haircut-simulator" className="block text-muted-foreground hover:text-foreground">
                  Virtual haircut simulator
                </Link>
                <Link href="/ai-hairstyle-try-on" className="block text-muted-foreground hover:text-foreground">
                  AI hairstyle try-on
                </Link>
              </div>
              <div className="space-y-2">
                <p className="eyebrow">Legal</p>
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                  Terms &amp; Conditions
                </Link>
                <Link href="/refund" className="block text-muted-foreground hover:text-foreground">
                  Refund Policy
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </div>
              <div className="space-y-2">
                <p className="eyebrow">Account</p>
                <Link href="/auth/login" className="block text-muted-foreground hover:text-foreground">
                  Log in
                </Link>
                <Link href="/auth/register" className="block text-muted-foreground hover:text-foreground">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
