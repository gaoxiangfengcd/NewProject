import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '隐私政策',
  description: '菅等村隐私政策 — 我们如何收集、使用和保护您的个人信息。',
}

export default function PrivacyPage(): React.ReactElement {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">隐私政策</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        最后更新日期：2026 年 9 月 14 日
      </p>

      <div className="prose-content mt-8">
        <p>
          菅等村（jiandengcun.com）非常重视用户隐私。本隐私政策说明我们在您使用
          本网站及其旗下产品（包括 MeMeGo 梗图生成器，memego.jiandengcun.com）
          时，如何收集、使用、存储和保护您的个人信息。
        </p>

        <h2>1. 我们收集的信息</h2>
        <p>我们收集以下类型的信息：</p>
        <h3>1.1 您主动提供的信息</h3>
        <ul>
          <li>注册账户时提供的电子邮箱地址</li>
          <li>使用 AI 图片生成功能时输入的文字描述（prompt）</li>
          <li>上传的照片（仅用于 AI 生成，不长期存储）</li>
          <li>联系我们时提供的姓名和邮件内容</li>
        </ul>
        <h3>1.2 自动收集的信息</h3>
        <ul>
          <li>IP 地址（用于限流和安全防护，不长期保留）</li>
          <li>浏览器类型、操作系统、访问时间等技术信息</li>
          <li>页面访问记录和交互数据（用于产品优化）</li>
        </ul>

        <h2>2. 我们如何使用信息</h2>
        <p>我们收集的信息仅用于以下目的：</p>
        <ul>
          <li>提供 AI 图片生成服务及账户管理</li>
          <li>维护服务安全，防止滥用和欺诈行为</li>
          <li>处理支付和订单（通过第三方支付平台 Paddle）</li>
          <li>分析使用数据，改进产品体验</li>
          <li>回复您的咨询和反馈</li>
        </ul>

        <h2>3. 信息存储与清理</h2>
        <p>
          我们采取自动清理策略来保护您的数据：用户上传的照片和 AI 生成结果
          会在 7 天后自动删除。我们不长期保留用户创意内容，以降低数据泄露风险。
          清理任务每日自动执行，确保过期数据被及时移除。
        </p>

        <h2>4. 第三方服务</h2>
        <p>我们的服务依赖以下第三方平台，它们有各自独立的隐私政策：</p>
        <ul>
          <li><strong>Cloudflare</strong>：提供 CDN、DDoS 防护和 DNS 解析</li>
          <li><strong>Replicate</strong>：提供 AI 图片生成模型 API</li>
          <li><strong>Paddle</strong>：处理支付交易（不接触完整卡号）</li>
          <li><strong>Google AdSense</strong>：在本网站展示广告（详见下方第 5 条）</li>
          <li><strong>Cloudflare R2</strong>：存储用户上传的照片和生成结果（7 天自动清理）</li>
        </ul>

        <h2>5. Google AdSense 与 Cookie</h2>
        <p>
          本网站使用 Google AdSense 展示广告。Google 可能使用 Cookie（包括
          DoubleClick DART Cookie）根据您在本网站及互联网上的访问记录投放广告。
        </p>
        <ul>
          <li>Google 及其供应商使用 Cookie 投放与您兴趣相关的广告</li>
          <li>您可以通过 Google 广告设置页面（google.com/settings/ads）选择退出个性化广告</li>
          <li>第三方供应商可能使用 Cookie 测量广告效果</li>
          <li>如需禁用 Cookie，可在浏览器设置中关闭</li>
        </ul>
        <p>
          有关 Google 如何使用数据的更多信息，请参阅
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Google 隐私与条款</a>。
        </p>

        <h2>6. GDPR 与数据权利</h2>
        <p>根据 GDPR（通用数据保护条例），您享有以下权利：</p>
        <ul>
          <li><strong>访问权</strong>：请求获取我们持有的关于您的个人数据副本</li>
          <li><strong>更正权</strong>：要求更正不准确的个人数据</li>
          <li><strong>删除权</strong>：要求删除您的个人数据</li>
          <li><strong>限制处理权</strong>：要求限制对您数据的处理</li>
          <li><strong>数据可携权</strong>：以结构化格式接收您的数据</li>
          <li><strong>反对权</strong>：反对我们以特定方式处理您的数据</li>
        </ul>
        <p>
          如需行使上述权利，请通过 gaoxiangfengcd@gmail.com 联系我们。
          删除请求会触发级联删除，涵盖账户认证、存储文件、使用记录和通知数据。
        </p>

        <h2>7. 儿童隐私</h2>
        <p>
          我们的服务不面向 13 岁以下儿童。我们不会故意收集儿童的个人信息。
          如果您认为我们无意中收集了儿童数据，请立即联系我们以便删除。
        </p>

        <h2>8. 政策更新</h2>
        <p>
          本隐私政策可能不时更新。更新后，我们会在本页面修改"最后更新日期"。
          建议您定期查阅本页面以了解最新政策。
        </p>

        <h2>9. 联系我们</h2>
        <p>
          如对本隐私政策有任何疑问，请通过以下方式联系我们：
        </p>
        <ul>
          <li>邮箱：gaoxiangfengcd@gmail.com</li>
        </ul>
      </div>
    </article>
  )
}
