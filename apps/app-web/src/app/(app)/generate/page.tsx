import { redirect } from 'next/navigation'

// 旧版 prompt 生成页已被 Upload → Analyze → Library 链路取代
export default function GenerateRedirect(): never {
  redirect('/upload')
}
