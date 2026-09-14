import { redirect } from 'next/navigation'

// My Looks / 历史记录页已下线：为控制存储成本，用户照片与生成结果按 TTL 自动清理，
// 不再提供历史浏览入口。旧链接统一跳转发型库。
export default function HistoryPage(): never {
  redirect('/hairstyles')
}
