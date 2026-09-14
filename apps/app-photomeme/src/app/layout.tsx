import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'PhotoMeme — AI 创意图片生成器',
  description:
    '用一句话描述画面，AI 即刻为你生成创意图片。支持写实、动漫、油画、赛博朋克等多种风格与画幅比例。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--accent-soft)),transparent_100%)]" />
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                P
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                PhotoMeme
              </span>
            </Link>
            <nav className="flex items-center gap-3">
              <a href="#generator" className="btn-ghost hidden sm:inline-flex">
                开始创作
              </a>
              <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">
                功能
              </a>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} PhotoMeme · AI 创意图片生成器</p>
            <p>由图片大模型驱动 · 生成内容仅供创作参考</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
