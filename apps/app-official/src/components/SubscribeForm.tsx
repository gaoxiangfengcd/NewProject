'use client'

import { useState, type FormEvent } from 'react'

/**
 * 邮箱订阅表单（目前仅前端展示，提交后显示成功状态）。
 * 后续接入邮件服务时，把 handleSubscribe 里的模拟逻辑替换为真实 API 调用即可。
 */
export function SubscribeForm(): React.ReactElement {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: 接入邮件订阅服务（如 Resend / Mailchimp）
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-muted/50 px-6 py-5 text-center">
        <p className="text-sm font-medium">订阅成功！</p>
        <p className="mt-1 text-sm text-muted-foreground">
          MeMeGo 上线时，我们会第一时间通知 <span className="text-accent">{email}</span>。
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="输入你的邮箱地址"
        aria-label="邮箱地址"
        className="h-11 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-accent"
      />
      <button type="submit" className="btn-accent h-11 shrink-0">
        订阅通知
      </button>
    </form>
  )
}
