/**
 * 首页信任区样图。ready 的才会渲染真实前后对比。
 * 后面补图：把 webp 放到 public/examples/，再把对应项的 ready 改成 true。
 */
export type ExampleSlot = {
  id: string
  label: string
  before: string
  after: string
  ready: boolean
}

export const EXAMPLE_SLOTS: ExampleSlot[] = [
  {
    id: 'couple',
    label: 'Couples',
    before: '/examples/before.webp',
    after: '/examples/after.webp',
    ready: true,
  },
  {
    id: 'family',
    label: 'Family',
    before: '/examples/family-before.webp',
    after: '/examples/family-after.webp',
    ready: true,
  },
  {
    id: 'friends',
    label: 'Friends',
    before: '/examples/friends-before.webp',
    after: '/examples/friends-after.webp',
    ready: true,
  },
  {
    id: 'parents',
    label: 'Parents',
    before: '/examples/parents-before.webp',
    after: '/examples/parents-after.webp',
    ready: true,
  },
  {
    id: 'pets',
    label: 'Pets',
    before: '/examples/pets-before.webp',
    after: '/examples/pets-after.webp',
    ready: true,
  },
  {
    id: 'group',
    label: 'The whole group',
    before: '/examples/group-before.webp',
    after: '/examples/group-after.webp',
    ready: true,
  },
  {
    id: 'kids',
    label: 'Kids',
    before: '/examples/kids-before.webp',
    after: '/examples/kids-after.webp',
    ready: true,
  },
]
