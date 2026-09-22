/** 站点级常量。SITE_URL 同时用于服务端 canonical 与客户端分享链接。 */
export const SITE_NAME = 'MeMeGo'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
).replace(/\/+$/, '')

export const SITE_DESCRIPTION =
  'Turn a photo of a friend, partner, or family member into a funny personalized digital gift. MeMeGo finds what makes them unique and exaggerates it into something unforgettable.'

export const SITE_TAGLINE = 'Funny personalized digital gifts from photos'

export const CONTACT_EMAIL = 'gaoxiangfengcd@gmail.com'

/** 生成结果与原始照片在对象存储中的保留天数 */
export const RETENTION_DAYS = Number(process.env.STORAGE_RETENTION_DAYS ?? '7')
