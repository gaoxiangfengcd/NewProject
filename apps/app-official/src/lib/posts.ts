/**
 * 博客文章数据。
 * AdSense 要求网站有足够的原创文字内容，这里维护多篇文章。
 * 每篇文章 body 使用分段字符串（SSR 渲染为 <p> 标签），保持类型安全。
 */

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  cover: string
  coverAlt: string
  body: { type: 'p' | 'h2' | 'h3' | 'ul'; content: string | string[] }[]
}

export const posts: BlogPost[] = [
  {
    slug: 'ai-meme-generation-guide',
    title: 'AI 梗图生成完全指南：从入门到精通',
    description:
      '详细介绍如何使用 AI 生成创意梗图，包括提示词技巧、风格选择和画幅比例的最佳实践。',
    date: '2026-09-10',
    author: '菅等村团队',
    category: 'AI 教程',
    tags: ['AI 生成', '教程', 'MeMeGo', '梗图'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Colorful%20flat%20illustration%20of%20a%20meme%20creator%20workspace%2C%20computer%20screen%20showing%20a%20funny%20cat%20meme%20with%20caption%20bubbles%2C%20creative%20social%20media%20content%20design%2C%20vibrant%20colors%2C%20modern%20digital%20art%20style&image_size=landscape_16_9',
    coverAlt: 'AI 梗图创作工作台插画',
    body: [
      { type: 'p', content: '在社交媒体时代，梗图（meme）已成为一种独特的表达语言。一个好的梗图可以在几秒钟内传递复杂的信息，引发共鸣甚至病毒传播。随着 AI 图片生成技术的成熟，创作梗图不再需要设计技能——你只需要一个好想法和一句话。' },
      { type: 'h2', content: '什么是 AI 梗图生成' },
      { type: 'p', content: 'AI 梗图生成是指利用人工智能模型，根据用户提供的文字描述自动生成图片。与传统梗图制作工具不同，AI 生成不依赖现有模板和素材，而是从零创作全新的图像。这意味着每一张生成的图片都是独一无二的。' },
      { type: 'p', content: 'MeMeGo 梗图生成器采用了 Flux Schnell 模型，这是一个在速度和质量之间取得良好平衡的图片生成模型。从输入描述到获得图片，通常只需几秒钟。' },
      { type: 'h2', content: '提示词技巧：如何描述画面' },
      { type: 'p', content: 'AI 梗图生成的核心在于提示词（prompt）。一个好的提示词应该包含以下要素：' },
      { type: 'ul', content: [
        '主体对象：画面中最重要的元素是什么？比如"一只穿着西装的猫"、"城市天际线"等',
        '场景环境：主体处于什么样的环境？室内、户外、太空还是抽象空间',
        '风格关键词：指定视觉风格，如"赛博朋克"、"水彩画"、"复古海报"',
        '情绪氛围：画面的整体感受，如"温馨"、"紧张"、"梦幻"',
        '构图细节：视角、比例、光影等可选细节',
      ] },
      { type: 'h2', content: '风格选择策略' },
      { type: 'p', content: 'MeMeGo 提供了 9 种视觉风格，选择合适的风格可以让梗图效果倍增：' },
      { type: 'h3', content: '写实风格' },
      { type: 'p', content: '适合需要真实感的场景，比如模拟新闻照片、生活场景。生成的图片接近真实摄影效果，细节丰富。' },
      { type: 'h3', content: '动漫风格' },
      { type: 'p', content: '日式动漫风格适合表达夸张的情感和戏剧性的场景。角色大眼睛、色彩鲜艳，自带"中二"气质。' },
      { type: 'h3', content: '赛博朋克' },
      { type: 'p', content: '霓虹灯、雨夜、科技感——赛博朋克风格非常适合科技相关的梗图，视觉冲击力强。' },
      { type: 'h2', content: '画幅比例的选择' },
      { type: 'p', content: '不同的社交平台对图片尺寸有不同的偏好。MeMeGo 提供 7 种画幅比例：' },
      { type: 'ul', content: [
        '1:1 正方形：Instagram 经典比例，适合多平台通用',
        '4:3 横版：传统照片比例，适合博客和文章配图',
        '16:9 宽屏：YouTube 缩略图和桌面端横幅的黄金比例',
        '9:16 竖版：TikTok、Instagram Stories 和手机端全屏',
        '3:4 竖版：Pinterest 和部分社交媒体推荐比例',
      ] },
      { type: 'p', content: '选择画幅时，考虑目标平台的展示方式和用户浏览习惯。例如，移动端为主的平台更适合竖版比例。' },
      { type: 'h2', content: '实战案例：三步生成爆款梗图' },
      { type: 'p', content: '让我们通过一个实际案例来演示完整流程。假设我们想做一个关于"程序员周一早上的心情"的梗图。' },
      { type: 'p', content: '第一步：确定画面主体。描述一个疲惫的程序员坐在电脑前，桌上堆满咖啡杯。第二步：选择风格。动漫风格可以增加趣味性和夸张效果。第三步：选择画幅。1:1 正方形适合多平台分享。' },
      { type: 'p', content: '最终提示词示例："一个疲惫的程序员坐在多屏电脑前，桌上堆着五个咖啡杯，眼神呆滞地看着屏幕上的报错信息，办公室窗外是灰蒙蒙的天空。"' },
      { type: 'h2', content: '总结' },
      { type: 'p', content: 'AI 梗图生成的魅力在于，它将创意从技术门槛中解放出来。你不需要懂 Photoshop，不需要会画画，只需要有一个有趣的想法。MeMeGo 就是将这个想法变为现实的工具。试试看，也许你的下一张梗图就会成为下一个病毒传播的内容。' },
    ],
  },
  {
    slug: 'ai-image-models-comparison',
    title: '2026 年主流 AI 图片生成模型对比',
    description:
      '对比 Flux、Stable Diffusion、DALL-E 等主流 AI 图片模型的优缺点，帮助你选择最适合的工具。',
    date: '2026-09-05',
    author: '菅等村团队',
    category: '技术分析',
    tags: ['AI 模型', 'Flux', '对比', '技术'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Futuristic%20technology%20comparison%20concept%20art%2C%20multiple%20AI%20processor%20chips%20in%20a%20grid%20layout%20with%20neural%20network%20visualization%20lines%2C%20blue%20and%20purple%20gradient%2C%20clean%20modern%20infographic%20digital%20illustration&image_size=landscape_16_9',
    coverAlt: 'AI 图片模型对比概念插画',
    body: [
      { type: 'p', content: 'AI 图片生成领域在 2026 年迎来了爆发式增长。从开源到闭源，从通用到垂直，各种模型层出不穷。作为用户或开发者，如何在这场技术洪流中做出正确选择？本文将从速度、质量、成本和可定制性四个维度对比主流模型。' },
      { type: 'h2', content: 'Flux 系列（Black Forest Labs）' },
      { type: 'p', content: 'Flux 是由 Stable Diffusion 原始团队成员创立的 Black Forest Labs 推出的模型系列。其中 Flux Schnell 是速度优化版本，Flux Dev 是质量优先版本。' },
      { type: 'p', content: 'Flux 的优势在于出色的提示词理解能力和图像质量。Schnell 版本在保持高质量的同时实现了极快的生成速度（1-2 秒），是目前速度和质量的最佳平衡点之一。MeMeGo 默认采用 Flux Schnell 正是出于这个原因。' },
      { type: 'h2', content: 'Stable Diffusion 3.5（Stability AI）' },
      { type: 'p', content: 'Stable Diffusion 系列是开源 AI 图片生成的标杆。3.5 版本在文本渲染和人体结构方面有显著进步。最大的优势是完全开源，可以本地部署、微调和定制。' },
      { type: 'p', content: '缺点是对硬件要求较高，生成速度中等，且需要一定的技术门槛来部署和调优。对于需要深度定制的专业用户，SD 3.5 仍然是首选。' },
      { type: 'h2', content: 'DALL-E 3（OpenAI）' },
      { type: 'p', content: 'DALL-E 3 的最大优势是与 ChatGPT 深度集成。用户可以用自然语言描述需求，ChatGPT 会自动优化提示词。图片质量高，尤其在文字渲染方面表现出色。' },
      { type: 'p', content: '但 DALL-E 3 是闭源 API，成本相对较高，且对内容审核非常严格，有时会影响创意表达的自由度。' },
      { type: 'h2', content: 'Google Imagen 系列' },
      { type: 'p', content: 'Google 的 Imagen 系列在照片级真实感方面表现突出。最新版本在人物面部、皮肤纹理和光影效果上达到了很高的逼真度。' },
      { type: 'p', content: '不过 Google 的 API 可用性和地区覆盖不如其他厂商广泛，对于面向国际用户的独立产品来说，可能不是最优选择。' },
      { type: 'h2', content: '选择建议' },
      { type: 'p', content: '不同场景适合不同模型：' },
      { type: 'ul', content: [
        '面向消费者的快速生成应用：Flux Schnell（速度+质量平衡，API 稳定）',
        '需要本地部署或深度定制：Stable Diffusion 3.5（开源可控）',
        '需要文字渲染和复杂对话式生成：DALL-E 3（ChatGPT 集成）',
        '追求极致真实感：Google Imagen（照片级质量）',
      ] },
      { type: 'p', content: '对于独立开发者和小团队，我们推荐采用 Provider 抽象模式构建产品——底层模型可随时切换，不被单一供应商绑定。这也是菅等村在 MeMeGo 中采用的架构方案。' },
    ],
  },
  {
    slug: 'why-we-built-memego',
    title: '我们为什么做 MeMeGo：从想法到产品',
    description:
      '菅等村团队分享 MeMeGo 梗图生成器的诞生故事，以及背后的产品理念和技术选择。',
    date: '2026-08-28',
    author: '菅等村团队',
    category: '产品故事',
    tags: ['MeMeGo', '创业', '产品理念', '故事'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cozy%20countryside%20creative%20workshop%20with%20computers%20and%20colorful%20posters%20on%20walls%2C%20warm%20sunset%20light%20through%20window%2C%20small%20friendly%20studio%20atmosphere%2C%20heartwarming%20illustration%20style&image_size=landscape_16_9',
    coverAlt: '乡村创意工作室插画',
    body: [
      { type: 'p', content: '每一个产品的诞生都源于一个问题。MeMeGo 的问题很简单：为什么创作一张有趣的图片，需要学 Photoshop？' },
      { type: 'h2', content: '起点：一个朴素的观察' },
      { type: 'p', content: '我们注意到，社交媒体上最受欢迎的内容往往是那些简单的、有共鸣的图片——一个有趣的画面配上一句戳心的文字。但制作这样的图片，要么需要设计技能，要么被现有模板工具限制了创意。' },
      { type: 'p', content: 'AI 图片生成技术的成熟让我们看到了另一种可能：如果每个人都能用一句话描述，就生成自己想要的画面呢？不需要模板，不需要素材库，只需要想法。' },
      { type: 'h2', content: '设计原则：简单但不简陋' },
      { type: 'p', content: '在产品定义阶段，我们定下了三条核心原则：' },
      { type: 'ul', content: [
        '零学习成本：打开就能用，不需要看教程',
        '即时反馈：输入后几秒内出图，不让人等待',
        '隐私安全：用户数据不长期留存，用完即走',
      ] },
      { type: 'p', content: '这三条原则决定了 MeMeGo 的每一个设计决策。从极简的单页界面，到选择 Flux Schnell 模型（速度优先），再到 7 天自动清理策略——都是这些原则的直接体现。' },
      { type: 'h2', content: '技术架构：为未来留好退路' },
      { type: 'p', content: '在技术选型上，我们做了一个重要的架构决策：Provider 抽象模式。图片生成、存储、支付等核心功能都通过接口抽象，底层实现可以随时切换。' },
      { type: 'p', content: '这意味着什么？今天我们用 Flux Schnell，明天如果有更好的模型，改一行配置就能切换。今天用 Cloudflare R2 存储，明天可以换 AWS S3。今天用 Paddle 收款，明天可以接入 Stripe。' },
      { type: 'p', content: '这个架构让我们不被任何供应商绑定，始终保持技术灵活性。对于小团队来说，这是生存的关键。' },
      { type: 'h2', content: '隐私为什么是核心功能' },
      { type: 'p', content: '很多产品把隐私当口号，我们把它当功能来设计。MeMeGo 的数据清理机制是自动的、不可关闭的：用户上传的照片和生成的结果，7 天后必定删除。' },
      { type: 'p', content: '这不是因为存储成本（虽然也是原因之一），而是因为我们认为：创意工具不应该变成用户的数据负担。用完即走，不留存、不追踪、不画像。这是对用户最基本的尊重。' },
      { type: 'h2', content: '下一步' },
      { type: 'p', content: 'MeMeGo 只是一个开始。我们的愿景是构建一套 AI 创意工具链，覆盖从图片到视频、从文字到声音的多种创作场景。但无论做什么产品，核心原则不会变：简单、快速、尊重用户。' },
      { type: 'p', content: '如果你也有创意想要表达，不妨试试 MeMeGo。也许你的下一张作品，就会成为下一个让人会心一笑的瞬间。' },
    ],
  },
  {
    slug: 'protect-user-privacy-in-ai-apps',
    title: 'AI 应用如何保护用户隐私：我们的实践方案',
    description:
      '分享菅等村在 AI 产品中保护用户隐私的具体技术方案，包括自动清理、数据最小化和 GDPR 合规。',
    date: '2026-08-20',
    author: '菅等村团队',
    category: '技术实践',
    tags: ['隐私', 'GDPR', '安全', '技术'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Digital%20privacy%20protection%20concept%20illustration%2C%20glowing%20shield%20icon%20over%20a%20smartphone%20with%20padlock%20symbols%2C%20abstract%20data%20streams%20in%20background%2C%20blue%20tones%2C%20minimalist%20flat%20design&image_size=landscape_16_9',
    coverAlt: '数据隐私保护概念插画',
    body: [
      { type: 'p', content: '在 AI 应用中，用户隐私保护常常被当作"写进隐私政策就行"的合规问题。但我们认为，隐私保护应该是工程问题——需要用代码来落实，而不只是用文字来承诺。' },
      { type: 'h2', content: '数据最小化原则' },
      { type: 'p', content: '数据最小化是 GDPR 的核心原则之一：只收集实现目的所必需的数据，不多收一分。在 MeMeGo 中，我们的实践是：' },
      { type: 'ul', content: [
        '不要求实名注册，邮箱即可使用',
        '不收集设备指纹、不追踪浏览行为',
        'AI 生成输入的提示词不长期存储',
        'IP 地址仅用于限流，不关联用户身份',
      ] },
      { type: 'h2', content: '自动清理机制' },
      { type: 'p', content: '我们将"数据不长期留存"作为系统级功能实现，而非依赖人工操作。具体方案包括：' },
      { type: 'p', content: '后台运行定时清理任务，每日扫描存储系统，自动删除超过 7 天的照片和生成记录。清理范围不仅包括生成结果文件，还包括数据库中的关联记录和存储桶中的孤立文件。' },
      { type: 'p', content: '这套机制是自动的、不可配置的、不可关闭的。即使运营人员也无法手动关闭清理——这是设计层面的硬约束。' },
      { type: 'h2', content: '级联删除与 GDPR 合规' },
      { type: 'p', content: '当用户行使 GDPR 赋予的删除权时，我们的系统会执行级联删除操作：' },
      { type: 'ul', content: [
        '认证数据：删除账户凭证和会话信息',
        '存储文件：删除用户上传的所有照片和生成结果',
        '使用记录：删除生成历史、积分记录和交易记录',
        '通知数据：删除与用户关联的所有通知和消息',
      ] },
      { type: 'p', content: '级联删除确保用户数据被彻底清除，不存在"删除了账户但数据还在后台"的情况。' },
      { type: 'h2', content: '第三方数据边界' },
      { type: 'p', content: '我们的服务依赖几个第三方平台，但我们在设计时严格划定了数据边界：' },
      { type: 'p', content: 'AI 模型 API：仅传输用户输入的提示词，不传递用户身份信息。生成完成后，API 侧不保留任何数据（取决于供应商的数据保留政策）。' },
      { type: 'p', content: '支付平台：使用 Paddle 处理支付，我们从不接触完整卡号。Paddle 的 webhook 仅传递交易 ID 和积分数量，不传递多余信息。' },
      { type: 'p', content: 'CDN 服务：Cloudflare 作为反代和 CDN，可访问 IP 地址等传输层数据，但我们不在应用层将 IP 关联到用户身份。' },
      { type: 'h2', content: '自托管部署的优势' },
      { type: 'p', content: '与使用 SaaS 平台不同，我们选择自托管部署（Docker + 自有 VPS）。这意味着：' },
      { type: 'ul', content: [
        '数据完全在自有服务器上，不经过第三方云平台的应用层',
        '数据库、Redis 等中间件完全自管，不依赖云数据库',
        '可以随时审计数据存储情况，物理掌控数据',
      ] },
      { type: 'p', content: '自托管确实增加了运维成本，但对于隐私优先的产品来说，这是值得的代价。掌控数据，就是掌控信任。' },
    ],
  },
  {
    slug: 'prompt-engineering-for-creatives',
    title: '创意人的提示词工程：不用写代码也能掌控 AI',
    description:
      '提示词工程不只是技术活。本文从创意人的角度，分享如何用自然语言驱动 AI 生成理想画面。',
    date: '2026-08-15',
    author: '菅等村团队',
    category: 'AI 教程',
    tags: ['提示词', 'AI 教程', '创意', 'MeMeGo'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Creative%20person%20typing%20on%20a%20laptop%20with%20colorful%20imagination%20bubbles%20floating%20above%20the%20screen%2C%20art%20supplies%20and%20digital%20drawing%20tablet%20on%20desk%2C%20inspiring%20creative%20workspace%2C%20warm%20modern%20illustration%20style&image_size=landscape_16_9',
    coverAlt: '创意提示词工作场景插画',
    body: [
      { type: 'p', content: '"提示词工程"听起来像是一门技术学科，但实际上它更像是与 AI 对话的艺术。你不需要会写代码，不需要懂模型架构——你只需要会说话，会描述，会表达你想要的画面。' },
      { type: 'h2', content: '为什么提示词很重要' },
      { type: 'p', content: 'AI 图片生成模型的工作方式是：接收一段文字描述，然后在 latent 空间中寻找与这段文字最匹配的图像。这意味着，你的描述越精准，AI 找到的图像就越接近你的预期。' },
      { type: 'p', content: '但"精准"不等于"冗长"。一个 200 字的提示词不一定比 20 字的效果好。关键在于信息的有效密度——每一句话都在为画面增添新的有效信息。' },
      { type: 'h2', content: '创意人的提示词框架' },
      { type: 'p', content: '我们总结了一个适合创意人的提示词框架，叫做"主体-环境-风格-情绪"四步法：' },
      { type: 'h3', content: '第一步：主体（谁/什么）' },
      { type: 'p', content: '画面中最重要的对象是什么？这个对象可以是人、动物、物品，甚至抽象概念。描述要具体——不是"一个人"，而是"一个穿红色风衣的年轻女性"。' },
      { type: 'h3', content: '第二步：环境（在哪里）' },
      { type: 'p', content: '主体处于什么场景中？环境为画面提供背景和氛围。不是简单的"在室内"，而是"在一间布满灰尘的旧书店里，阳光从百叶窗缝隙射入"。' },
      { type: 'h3', content: '第三步：风格（什么视觉语言）' },
      { type: 'p', content: '你希望画面呈现什么视觉风格？这是创意表达的关键选择。MeMeGo 提供了 9 种预设风格，从写实到动漫，从油画到赛博朋克，每种风格都有其适用的表达场景。' },
      { type: 'h3', content: '第四步：情绪（什么感受）' },
      { type: 'p', content: '画面应该唤起什么情绪？虽然 AI 不直接理解"情绪"这个词，但情绪相关的描述词会影响整体画面的色调、构图和氛围。"温馨的"、"紧张的"、"孤独的"——这些词会影响 AI 的生成方向。' },
      { type: 'h2', content: '常见误区' },
      { type: 'p', content: '在使用 AI 图片生成工具时，以下是一些常见误区：' },
      { type: 'ul', content: [
        '提示词过长：超过 100 词后，AI 对后面内容的关注度会递减。保持精炼。',
        '矛盾描述："白天"同时又说"星空"会让 AI 困惑，选择一个确定方向。',
        '忽略风格选择：即使提示词写了"水彩画"，但如果风格选了"写实"，两者会冲突。让提示词和风格选择保持一致。',
        '过度细节：不必描述每一个细节，给 AI 留一些创造空间，往往会有惊喜。',
      ] },
      { type: 'h2', content: '从好到优：迭代优化' },
      { type: 'p', content: 'AI 图片生成是一个迭代过程。第一张图通常不会是最终满意的结果。关键在于：基于生成结果调整提示词，然后再次生成。' },
      { type: 'p', content: '比如，如果生成的图片色调偏冷但你想要温暖的感觉，就在提示词中加强"温暖的阳光"、"金色光晕"等描述。如果人物位置不对，就调整"站在画面左侧"等构图描述。' },
      { type: 'p', content: 'MeMeGo 的快速生成（几秒出图）让这个迭代过程变得流畅自然。不要怕试错——在 AI 的世界里，试错就是创作的一部分。' },
      { type: 'h2', content: '开始你的创作' },
      { type: 'p', content: '提示词工程最好的学习方式就是实践。打开 MeMeGo，用"主体-环境-风格-情绪"框架试着描述一个画面。你会发现，当你学会用语言表达画面，AI 就是你最忠实的画笔。' },
    ],
  },
  {
    slug: 'monorepo-architecture-for-startups',
    title: '初创团队为什么应该用 Monorepo：我们的实践',
    description:
      'Monorepo 不只是大公司的专利。分享菅等村团队用 pnpm workspace 构建 monorepo 的实践经验。',
    date: '2026-08-08',
    author: '菅等村团队',
    category: '技术实践',
    tags: ['Monorepo', '架构', 'pnpm', '工程化'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Organized%20code%20repository%20concept%20illustration%2C%20interconnected%20building%20blocks%20and%20folders%20in%20a%20clean%20structure%2C%20software%20engineering%20workspace%20with%20multiple%20screens%2C%20teal%20and%20indigo%20color%20palette%2C%20isometric%20flat%20design&image_size=landscape_16_9',
    coverAlt: 'Monorepo 工程结构插画',
    body: [
      { type: 'p', content: '当团队只有几个人甚至一个人时，代码组织方式看起来不是一个紧迫的问题。但经验告诉我们：项目组织方式在第一天就决定了未来迭代的顺滑度。' },
      { type: 'h2', content: '什么是 Monorepo' },
      { type: 'p', content: 'Monorepo（单体仓库）是指将多个项目放在同一个代码仓库中管理。与之相对的是 Polyrepo（多仓库），即每个项目一个独立仓库。' },
      { type: 'p', content: '菅等村的 monorepo 结构包含：多个应用（apps/）和多个共享包（packages/），通过 pnpm workspace 管理。' },
      { type: 'h2', content: '为什么选择 Monorepo' },
      { type: 'p', content: '对于小团队，monorepo 有几个显著优势：' },
      { type: 'h3', content: '1. 代码复用零成本' },
      { type: 'p', content: '共享的逻辑提取为 packages 中的包，所有应用可直接引用。类型定义、工具函数、API 客户端等公共代码，一处修改、全处生效。不需要发包、不需要更新依赖版本。' },
      { type: 'h3', content: '2. 原子化提交' },
      { type: 'p', content: '当你修改了一个共享函数的签名，可以在同一个 commit 中更新所有调用方。不存在"仓库 A 改了接口，仓库 B 还在用旧版"的问题。这对小团队快速迭代非常重要。' },
      { type: 'h3', content: '3. 统一工具链' },
      { type: 'p', content: 'ESLint、TypeScript、Prettier 等工具的配置只需维护一套。所有项目遵循相同的代码风格和质量标准。' },
      { type: 'h3', content: '4. 依赖管理简化' },
      { type: 'p', content: 'pnpm workspace 使用硬链接方式安装依赖，磁盘占用极低。所有项目共享一个 lockfile，依赖版本统一管理，不会出现版本不一致的问题。' },
      { type: 'h2', content: '我们的 Monorepo 结构' },
      { type: 'p', content: '菅等村的 monorepo 包含以下结构：' },
      { type: 'ul', content: [
        'apps/app-web：发型试穿应用（Next.js）',
        'apps/app-photomeme：梗图生成器（Next.js）',
        'apps/app-official：品牌官网（本网站，Next.js）',
        'packages/common：共享类型、工具函数',
        'packages/storage：存储抽象层（Local/R2）',
        'packages/payment：支付抽象层（Paddle/Mock）',
        'packages/image-gen：图片生成抽象层（Replicate/Mock）',
      ] },
      { type: 'h2', content: 'Provider 抽象模式' },
      { type: 'p', content: '在 monorepo 中，我们采用 Provider 抽象模式构建共享包。以图片生成为例：定义一个 ImageGenProvider 接口，不同 AI 模型作为实现。工厂函数根据环境变量决定使用哪个实现。' },
      { type: 'p', content: '这种模式的好处是：应用代码只依赖接口，不依赖具体实现。切换 AI 模型、存储方案或支付渠道时，只需要改环境变量，不需要改应用代码。' },
      { type: 'h2', content: '部署独立性' },
      { type: 'p', content: 'Monorepo 不意味着所有应用必须一起部署。我们为每个应用准备了独立的 Dockerfile 和 docker-compose 文件。可以单独构建、单独部署，按需上线。' },
      { type: 'p', content: '这种"代码集中管理、部署各自独立"的模式，既保持了开发效率，又不影响部署灵活性。对小团队来说，这是最实用的平衡点。' },
      { type: 'h2', content: '总结' },
      { type: 'p', content: 'Monorepo 不是大公司的专利。恰恰相反，小团队更需要代码复用和工具链统一带来的效率提升。pnpm workspace 让 monorepo 的搭建和维护成本极低，而收益是持续和复利的。如果你的团队正在做多产品线，强烈建议从第一天就用 monorepo。' },
    ],
  },
  {
    slug: 'ai-creative-workflow-efficiency',
    title: '从灵感到成品：AI 时代的高效创意工作流',
    description:
      '灵感易逝，执行昂贵。分享一套把 AI 工具嵌入创意流程的实践方法，让好点子以更低成本快速落地。',
    date: '2026-08-01',
    author: '菅等村团队',
    category: '设计灵感',
    tags: ['工作流', '效率', '设计灵感', 'AI 工具'],
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Creative%20workflow%20journey%20from%20rough%20sketch%20to%20finished%20digital%20artwork%2C%20step%20by%20step%20transformation%20stages%20shown%20left%20to%20right%2C%20artist%20desk%20with%20drawing%20tablet%20and%20colorful%20artwork%20evolution%2C%20vibrant%20modern%20flat%20illustration&image_size=landscape_16_9',
    coverAlt: '从草图到成品的创意工作流插画',
    body: [
      { type: 'p', content: '每个创意工作者都经历过这样的时刻：洗澡时、通勤路上、睡前刷手机的一瞬间，一个好点子突然冒出来。但等到你坐到电脑前准备执行时，热情已经冷却了一半——因为从"想法"到"成品"之间，隔着重重工具和流程的阻力。AI 时代的创意工作流，要解决的核心问题就是这个：如何让执行的成本降到足够低，让灵感趁热落地。' },
      { type: 'h2', content: '传统创意流程的三个断点' },
      { type: 'p', content: '回顾传统的视觉创作流程，最常见的三个断点分别是：' },
      { type: 'ul', content: [
        '技能断点：想法很好，但不会画画、不会修图，想法只能停留在脑子里',
        '工具断点：打开专业软件要建文件、找素材、调参数，仪式感太重，启动成本太高',
        '反馈断点：改一版要等很久，修改成本高导致不敢试错，第一版往往就是最终版',
      ] },
      { type: 'p', content: '这三个断点的共同点是：它们消耗的不是创造力，而是热情。很多好点子不是被否定的，而是在繁琐的执行过程中被自己放弃的。' },
      { type: 'h2', content: 'AI 工具如何缝合这些断点' },
      { type: 'p', content: 'AI 生成工具的价值，不在于"替代设计师"，而在于把执行成本压缩到想法可以即兴验证的程度。以视觉创意为例，现在的工作流可以是：想到一个画面，用一句话描述，几秒钟看到结果；不满意，调整描述再生成；方向对了，再精修细节。' },
      { type: 'p', content: '这个"描述—生成—迭代"的小循环，把过去以小时计的反馈周期压缩到了秒级。当试错变得廉价，你会自然地探索更多方向——而更多的方向，意味着更高的出好作品的概率。这不是偷懒，这是扩大了创意的搜索空间。' },
      { type: 'h2', content: '我们推荐的四步工作流' },
      { type: 'p', content: '结合自己团队做 MeMeGo 和日常创作的经验，我们总结了一套轻量但完整的四步工作流：' },
      { type: 'h3', content: '第一步：极速记录灵感' },
      { type: 'p', content: '灵感出现时，不要相信自己的记忆力。用手机备忘录或语音输入，把画面用一两句话写下来。重点是记录"画面感"：谁、在哪里、在做什么、什么氛围。这个习惯坚持下来，你会发现自己的灵感库比想象中丰富得多。' },
      { type: 'h3', content: '第二步：批量生成方向' },
      { type: 'p', content: '把灵感描述喂给 AI 工具，一次生成多个风格方向。比如同一个画面，分别用写实、动漫、油画风格各生成一版。这个阶段不要追求完美，追求的是"看到可能性"。视觉化的选项摆在一起，判断会变得非常快。' },
      { type: 'h3', content: '第三步：聚焦迭代' },
      { type: 'p', content: '从生成的方向中挑出一个最有感觉的，围绕它做定向迭代：调整构图、光线、情绪词。此时的迭代是有锚点的，每一次修改都是向着明确的 target 逼近，而不是漫无目的地碰运气。' },
      { type: 'h3', content: '第四步：必要时精修' },
      { type: 'p', content: '如果作品要正式发布，可以在 AI 生成的底稿上做人工精修——统一色调、加文字、调细节。AI 负责完成 80% 的基础工作，人负责最后 20% 决定品质的部分。这是目前人机协作性价比最高的分工方式。' },
      { type: 'h2', content: '效率的真正含义' },
      { type: 'p', content: '谈效率，很多人第一反应是"做得更快"。但对创意工作来说，效率的真正含义是"在热情消失之前完成验证"。一个需要两周才能看到成品的点子，和一个十秒钟就能看到雏形的点子，后者被做出来的概率要大得多。' },
      { type: 'p', content: '工具的进步从来不是为了让人更忙碌，而是为了让表达更自由。当执行不再是瓶颈，创造才回归它本来的样子——一个纯粹关于想法和品味的游戏。这也是我们做 MeMeGo 的初衷：把"从灵感到成品"的距离，缩短到一句话。' },
      { type: 'h2', content: '现在就开始' },
      { type: 'p', content: '不用等到准备好，今天就可以用这套工作流做一次完整尝试：从你的灵感库里挑一条记录，用 AI 生成三个风格方向，选一个迭代两轮。整个过程不会超过十分钟，但你大概率会得到一张愿意分享出去的作品。创作的快感，就藏在这个即时反馈的循环里。' },
    ],
  },
]

/** 按 slug 查找文章 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

/** 按日期倒序获取所有文章 */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}
