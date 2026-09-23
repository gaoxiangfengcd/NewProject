import { FREE_PER_DAY } from '@/lib/billing'
import { RETENTION_DAYS, SITE_NAME } from '@/lib/site'
import type { SeoFaq } from '@/lib/seo/types'
import { JsonLd } from '@/components/JsonLd'
import { faqJsonLd } from '@/lib/seo/metadata'

const FAQS = [
  {
    q: `How much does ${SITE_NAME} cost?`,
    a: `You get ${FREE_PER_DAY} free preview${FREE_PER_DAY === 1 ? '' : 's'} a day on a lighter model — lower resolution, a small ${SITE_NAME} mark, and a milder look — so you can see the idea before spending anything. Unlocking a gift runs a stronger, funnier HD model at full resolution with no watermark. Unused generations never expire.`,
  },
  {
    q: 'What is the difference between free and HD?',
    a: 'We look for one distinctive, non-sensitive visual feature — hair, glasses, pose, a hat — then imagine an absurd consequence in the original place. That becomes the gift. The free preview uses a lighter model; HD commits harder to the same joke, sharper and without a watermark.',
  },
  {
    q: 'Why is the number of generations limited?',
    a: 'Every generation runs a real AI model, so each one costs compute — that is the honest reason. It also helps you finish: with a set number of tries you pick a photo and a style you actually like, instead of tweaking forever and never sending anything.',
  },
  {
    q: 'Do unused generations expire?',
    a: 'No. When you buy a pack, leftover HD generations stay in your wallet until you use them. They do not expire after a year.',
  },
  {
    q: 'Can I give it as a gift?',
    a: 'That is what it is built for. Upload a photo of a partner, a parent, or a friend, and MeMeGo draws a cartoon character you can send. It does not change their real face. Every unlocked cartoon is full resolution, so you can print it or send it on the day.',
  },
  {
    q: 'Do I need an account?',
    a: 'Nope. No sign-up, no password, no email. Upload a photo and see your preview in seconds.',
  },
  {
    q: 'What happens to my photos?',
    a: `Your photo and the generated image are stored only so your share link works. Everything is automatically deleted after ${RETENTION_DAYS} days. We never sell your images.`,
  },
  {
    q: 'What kind of photo works best?',
    a: 'A clear, well-lit shot of one person gives the best cartoon. Group photos and heavy sunglasses make it harder to tell who the character should be.',
  },
  {
    q: 'How long does it take?',
    a: 'Most gifts are ready in 10–20 seconds. If the generator is busy it can take a bit longer, and the countdown on screen shows how long yours has been running.',
  },
  {
    q: 'Why does the result depend on what I write?',
    a: 'This is a meme, so the picture follows the scene you describe. A specific line — the hat, the side-eye, the Hello Kitty shirt — is what gets exaggerated. A vague line comes back as a plain pencil portrait. We suggest one from the photo; edit it until the joke is obvious.',
  },
]

export function Faq({ extras = [] }: { extras?: SeoFaq[] } = {}): React.ReactElement {
  const items = [...extras, ...FAQS]
  const jsonLd = faqJsonLd(items)

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Questions
      </h2>

      <div className="mt-7 flex flex-col gap-2.5">
        {items.map((item) => (
          <details
            key={item.q}
            className="group card overflow-hidden px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
              {item.q}
              <span className="details-arrow group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>

      <JsonLd data={jsonLd} />
    </section>
  )
}
