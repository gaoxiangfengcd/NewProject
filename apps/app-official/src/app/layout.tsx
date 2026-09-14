import type { Metadata } from 'next'
import { Inter, Noto_Serif_SC } from 'next/font/google'
import Link from 'next/link'
import Script from 'next/script'
import { ComingSoonToast } from '@/components/ComingSoonToast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jiandengcun.com'),
  title: {
    default: '菅等村 — AI 创意工具工作室',
    template: '%s | 菅等村',
  },
  description:
    '菅等村是一个专注于 AI 创意工具开发的工作室，旗下产品包括 MeMeGo 梗图生成器等，致力于让创意触手可及。',
  keywords: ['AI 图片生成', '梗图制作', '创意工具', 'MeMeGo', '菅等村'],
  authors: [{ name: '菅等村' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://jiandengcun.com',
    siteName: '菅等村',
    title: '菅等村 — AI 创意工具工作室',
    description: '专注 AI 创意工具开发，旗下产品包括 MeMeGo 梗图生成器等。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '菅等村 — AI 创意工具工作室',
    description: '专注 AI 创意工具开发，让创意触手可及。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/blog', label: '博客' },
  { href: '/contact', label: '联系我们' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="zh-CN">
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1830259629636903"
        crossOrigin="anonymous"
      />
      <body className={`${inter.variable} ${notoSerifSC.variable} font-sans`}>
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold">菅等村</span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground sm:px-3"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <footer className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold">菅等村</span>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  AI 创意工具工作室，让创意触手可及。
                </p>
              </div>
              <div className="space-y-2">
                <p className="eyebrow text-primary-foreground/50">产品</p>
                <ComingSoonToast className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  MeMeGo 梗图生成器
                </ComingSoonToast>
              </div>
              <div className="space-y-2">
                <p className="eyebrow text-primary-foreground/50">公司</p>
                <Link href="/about" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  关于我们
                </Link>
                <Link href="/contact" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  联系我们
                </Link>
                <Link href="/blog" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  博客
                </Link>
              </div>
              <div className="space-y-2">
                <p className="eyebrow text-primary-foreground/50">法律</p>
                <Link href="/privacy" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  隐私政策
                </Link>
                <Link href="/terms" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground">
                  服务条款
                </Link>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 text-center text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} 菅等村 jiandengcun.com · 保留所有权利
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
