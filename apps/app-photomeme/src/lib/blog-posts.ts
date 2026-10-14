export type BlogPair = {
  before: string
  after: string
  beforeAlt: string
  afterAlt: string
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'pair'; pair: BlogPair }
  | { type: 'cta' }

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  cover: string
  coverAlt: string
  blocks: BlogBlock[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-memego',
    title: 'What is MeMeGo? A funny gift from a photo you already have',
    description:
      'MeMeGo turns a photo into a funny cartoon gift in about 30 seconds. Not a filter. Not a face swap. First preview is free.',
    date: '2026-10-14',
    cover: '/examples/friends-after.webp',
    coverAlt: 'A colored-pencil cartoon made from a photo of friends',
    blocks: [
      {
        type: 'p',
        text: 'MeMeGo is a digital gift. You upload a photo of someone you already have — a friend, a partner, family, even the dog — and it draws a funny cartoon from that photo. You download it and send it. There is no shipping and no account.',
      },
      {
        type: 'p',
        text: 'It is not a filter laid over their real face, and it is not a face swap. The cartoon is a new drawing. They should still look like themselves. The joke comes from exaggerating something already in the picture.',
      },
      { type: 'h2', text: 'Same photo, then the gift' },
      {
        type: 'p',
        text: 'Here is a real pair. Left is the photo. Right is the cartoon MeMeGo drew from it.',
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/friends-before.webp',
          after: '/examples/friends-after.webp',
          beforeAlt: 'Original photo of four friends hugging in a garden',
          afterAlt: 'Funny colored-pencil cartoon drawn from that friends photo',
        },
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/group-before.webp',
          after: '/examples/group-after.webp',
          beforeAlt: 'Original group photo',
          afterAlt: 'Funny colored-pencil cartoon drawn from that group photo',
        },
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/pets-before.webp',
          after: '/examples/pets-after.webp',
          beforeAlt: 'Original photo of two dogs in a living room',
          afterAlt: 'Funny colored-pencil cartoon drawn from that pet photo',
        },
      },
      { type: 'h2', text: 'How it works' },
      {
        type: 'p',
        text: 'Upload the photo. Write one line if you want — whose glasses, whose pose, what should get bigger. MeMeGo draws the cartoon in the original scene. Most gifts are ready in 10–20 seconds. The first preview each day is free, at a lighter resolution with a small MeMeGo mark. Unlocking HD gives you the full file with no watermark, ready to send or print.',
      },
      {
        type: 'p',
        text: 'Photos are kept only so the share link works, then deleted after 7 days. We do not sell images or use them to train models.',
      },
      { type: 'cta' },
    ],
  },
  {
    slug: 'last-minute-digital-gift-from-a-photo',
    title: 'A last-minute digital gift you can send tonight',
    description:
      'Forgot a birthday or anniversary? Turn a photo into a funny cartoon gift in 30 seconds. No shipping. First preview is free.',
    date: '2026-10-14',
    cover: '/examples/family-after.webp',
    coverAlt: 'A funny cartoon gift made from a family photo',
    blocks: [
      {
        type: 'p',
        text: 'Most last-minute gifts look last-minute: a gift card, a candle, a mug with a joke that expires by Tuesday. A photo you already have can become something they will actually open in the group chat.',
      },
      {
        type: 'p',
        text: 'MeMeGo draws a funny cartoon from that photo. You download it and send it in a message. There is no courier and no same-day delivery claim — because nothing is being shipped.',
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/family-before.webp',
          after: '/examples/family-after.webp',
          beforeAlt: 'Original family portrait',
          afterAlt: 'Funny cartoon drawn from that family photo',
        },
      },
      { type: 'h2', text: 'When this works' },
      {
        type: 'p',
        text: 'Birthdays you remembered at 9pm. Anniversaries. A Wednesday that needed a laugh. Anyone in the photo can be the gift: a partner, a parent, friends, the whole table, the dog.',
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/parents-before.webp',
          after: '/examples/parents-after.webp',
          beforeAlt: 'Original photo of two people standing together',
          afterAlt: 'Funny cartoon drawn from that photo',
        },
      },
      {
        type: 'p',
        text: 'The first preview is free. No account. If you like it, unlock HD and send the file the same evening.',
      },
      { type: 'cta' },
    ],
  },
  {
    slug: 'funny-gift-from-a-pet-photo',
    title: 'Turn a pet photo into a funny gift',
    description:
      'The dog is family too. Upload a photo you already have and MeMeGo draws a funny cartoon you can send today. First preview is free.',
    date: '2026-10-14',
    cover: '/examples/pets-after.webp',
    coverAlt: 'A funny cartoon of two dogs drawn from a living-room photo',
    blocks: [
      {
        type: 'p',
        text: 'Pet gifts go wrong when they could have been bought for any dog. This one starts from their photo: the bed, the floor, the way they actually flop.',
      },
      {
        type: 'pair',
        pair: {
          before: '/examples/pets-before.webp',
          after: '/examples/pets-after.webp',
          beforeAlt: 'Two dogs in a living room, original photo',
          afterAlt: 'Funny cartoon of those two dogs, drawn from the photo',
        },
      },
      {
        type: 'p',
        text: 'MeMeGo draws a cartoon character from the photo. It does not paste a human face onto the animal, and it does not add extra legs. The scene stays. The joke is already in the picture.',
      },
      {
        type: 'p',
        text: 'Use a clear, well-lit shot. You download the cartoon and send it — birthday, memorial, or just because. First preview is free. No account.',
      },
      { type: 'cta' },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function postExamplePair(post: BlogPost): BlogPair | undefined {
  const block = post.blocks.find(
    (item): item is Extract<BlogBlock, { type: 'pair' }> => item.type === 'pair',
  )
  return block?.pair
}

export function otherBlogPosts(slug: string): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== slug)
}

export function allBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug)
}
