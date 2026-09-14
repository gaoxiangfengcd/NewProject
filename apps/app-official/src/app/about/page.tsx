import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们',
  description: '菅等村是一个专注于 AI 创意工具开发的工作室，致力于让创意触手可及。',
}

const TIMELINE = [
  { date: '2024', title: '菅等村成立', desc: '一支热爱创意和技术的团队走到一起，开始了 AI 工具开发的旅程。' },
  { date: '2025', title: 'MeMeGo 上线', desc: '推出首款产品 MeMeGo 梗图生成器，让用户用一句话即可生成创意图片。' },
  { date: '2026', title: '持续迭代', desc: '不断优化产品体验，探索 AI 在创意领域的更多可能性。' },
]

export default function AboutPage(): React.ReactElement {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">关于菅等村</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        菅等村（jiandengcun.com）是一个专注于 AI 创意工具开发的工作室。
      </p>

      <div className="prose-content mt-8">
        <h2>我们的初衷</h2>
        <p>
          菅等村的成立，源于一个简单又固执的想法：创作不应该有门槛。我们见过太多人，
          明明脑海里有一个绝妙的画面，却因为不会画画、不会修图、不会用专业软件，
          只能让想法停在脑子里。而另一边，AI 图片生成技术已经突飞猛进，
          却仍被包裹在复杂的参数和昂贵的工具里。我们想做的，就是把这两端接通——
          让先进的技术变成人人可用、用得起的普通工具，让乡村小工作室里也能长出世界级的创意。
        </p>

        <h2>我们的使命</h2>
        <p>
          我们相信，每个人都有值得表达的想法。然而，将脑海中的画面变为现实，
          往往需要专业的设计技能和复杂的软件操作。菅等村的使命，就是用 AI 技术
          打破这堵墙——让创意不再被技术门槛束缚，让每一个想法都能被看见。
        </p>

        <h2>我们在做什么</h2>
        <p>
          我们开发简单好用的 AI 创意工具。目前的产品 MeMeGo 梗图生成器，
          让用户只需用自然语言描述画面，就能在几秒内获得 AI 生成的创意图片。
          支持写实、动漫、油画、赛博朋克等 9 种视觉风格，以及 7 种画幅比例，
          满足社交媒体分享、创意表达、灵感测试等多种场景需求。
        </p>
        <p>
          除了产品本身，我们也把开发过程中沉淀的经验写成博客文章分享出来——
          从提示词技巧、AI 模型选型对比，到隐私保护实践和团队工程化方法论。
          我们希望这些一手经验能帮到更多独立开发者和小团队，
          让"用技术做点小而美的事情"这条路不再孤单。
        </p>

        <h2>我们的团队</h2>
        <p>
          先说说"菅等村"这个名字——菅，是一种长在田间地头的草，朴素、好养活；
          而"村"嘛，就是一个小地方，几户人家，慢慢经营一起生活的地方。
          我们想做的，就是这样一间"长在农田边上的 AI 工作室"：没有大厂的排场，
          但有人情味，有人踏踏实实地把手上的工具一点一点打磨好用。
          名字可能不太起眼，但这里的东西，都是认真的。
        </p>
        <p>
          我们是一支小而精的团队，成员背景覆盖产品设计、全栈开发和 AI 工程，
          此前分别在互联网公司、开源社区和设计行业中摸爬滚打多年。
          团队采用远程协作模式，不受地理位置限制。我们推崇开源精神，
          注重产品打磨，不追求功能数量上的堆砌，而是把每一个功能做到极致。
          小团队的好处是决策快、没有会议马拉松，从想法到上线的路径可以短到几天。
        </p>

        <h2>我们的技术理念</h2>
        <p>在技术架构上，我们坚持以下原则：</p>
        <ul>
          <li>Provider 抽象模式：底层模型可随时切换，不被单一供应商绑定</li>
          <li>隐私优先：用户数据不长期存储，照片和生成结果自动定期清理</li>
          <li>自托管部署：使用自有服务器，掌控数据安全</li>
          <li>开源生态：共享技术方案，回馈社区</li>
        </ul>
      </div>

      {/* 时间线 */}
      <div className="mt-12">
        <h2 className="mb-6 font-serif text-2xl font-bold">发展历程</h2>
        <div className="space-y-6 border-l-2 border-border pl-6">
          {TIMELINE.map((item) => (
            <div key={item.date} className="relative">
              <span className="absolute -left-[1.7rem] flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <p className="text-sm font-semibold text-accent">{item.date}</p>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
