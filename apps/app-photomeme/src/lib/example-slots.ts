/**
 * 首页信任区样图。ready 的才会渲染真实前后对比。
 * 后面补图：把 webp 放到 public/examples/，再把对应项的 ready 改成 true。
 * 卡片上不写分组名，只靠图本身说话。
 */
export type ExampleSlot = {
  id: string
  alt: string
  before: string
  after: string
  ready: boolean
}

export const EXAMPLE_SLOTS: ExampleSlot[] = [
  {
    id: 'couple',
    alt: 'A photo next to the funny cartoon made from it',
    before: '/examples/before.webp',
    after: '/examples/after.webp',
    ready: true,
  },
  {
    id: 'family',
    alt: 'A family photo next to the funny cartoon made from it',
    before: '/examples/family-before.webp',
    after: '/examples/family-after.webp',
    ready: true,
  },
  {
    id: 'friends',
    alt: 'Friends in a photo next to the funny cartoon made from it',
    before: '/examples/friends-before.webp',
    after: '/examples/friends-after.webp',
    ready: true,
  },
  {
    id: 'parents',
    alt: 'Two people in a photo next to the funny cartoon made from it',
    before: '/examples/parents-before.webp',
    after: '/examples/parents-after.webp',
    ready: true,
  },
  {
    id: 'pets',
    alt: 'Dogs in a photo next to the funny cartoon made from it',
    before: '/examples/pets-before.webp',
    after: '/examples/pets-after.webp',
    ready: true,
  },
  {
    id: 'group',
    alt: 'A group photo next to the funny cartoon made from it',
    before: '/examples/group-before.webp',
    after: '/examples/group-after.webp',
    ready: true,
  },
  {
    id: 'kids',
    alt: 'A child in a photo next to the funny cartoon made from it',
    before: '/examples/kids-before.webp',
    after: '/examples/kids-after.webp',
    ready: true,
  },
]
