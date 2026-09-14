import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我们',
  description: '联系菅等村团队，邮箱 gaoxiangfengcd@gmail.com',
}

const CHANNELS = [
  {
    icon: '✉️',
    title: '电子邮箱',
    value: 'gaoxiangfengcd@gmail.com',
    desc: '商务合作、产品咨询、媒体联系',
  },
  {
    icon: '🐛',
    title: '问题反馈',
    value: 'gaoxiangfengcd@gmail.com',
    desc: 'Bug 报告、问题咨询、功能建议',
  },
]

export default function ContactPage(): React.ReactElement {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">联系我们</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        我们很乐意听到你的声音。无论是产品建议、合作意向还是技术反馈，都欢迎与我们联系。
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((ch) => (
          <div key={ch.title} className="card">
            <div className="text-2xl">{ch.icon}</div>
            <h2 className="mt-3 font-semibold">{ch.title}</h2>
            <p className="mt-1 break-all text-sm font-medium text-accent">{ch.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{ch.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/50 p-6">
        <h2 className="font-semibold">常见问题</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">MeMeGo 生成的图片可以商用吗？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              请参考我们的服务条款了解图片使用权限。如有商业授权需求，请通过邮箱联系我们。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">我的数据安全吗？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              我们高度重视用户隐私。上传的照片和生成结果会在 7 天后自动清理，不会长期存储。
              详情请参阅隐私政策。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">支持哪些支付方式？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              我们通过 Paddle 支付平台处理付款，支持主流国际信用卡。如遇支付问题，
              请通过邮箱联系我们。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground">
        <h2 className="font-serif text-lg font-semibold">商务合作</h2>
        <p className="mt-2 text-sm text-primary-foreground/80">
          如果你有品牌合作、API 接入、定制开发等需求，请发送邮件至
          gaoxiangfengcd@gmail.com，我们会在 2 个工作日内回复。
        </p>
      </div>
    </article>
  )
}
