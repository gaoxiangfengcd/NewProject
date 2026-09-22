import type { Metadata } from 'next'
import { InsightsBoard } from '@/components/InsightsBoard'

export const metadata: Metadata = {
  title: 'Insights',
  robots: { index: false, follow: false },
}

export default function InsightsPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">访问情况</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        看人从哪进来、打开了哪一页、点了什么。地址不公开，打开后填一次读取密钥。
      </p>
      <InsightsBoard />
    </div>
  )
}
