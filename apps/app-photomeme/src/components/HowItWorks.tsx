const STEPS = [
  {
    n: '01',
    emoji: '📸',
    title: 'Upload a photo',
    body: 'Any face works — selfie, friend, pet, that one awkward group shot. JPG, PNG or WebP up to 10 MB.',
  },
  {
    n: '02',
    emoji: '✍️',
    title: 'Add a twist',
    body: 'Optional. Type a scene or tap a suggestion — riding a giant rubber duck, forgetting your pants, whatever.',
  },
  {
    n: '03',
    emoji: '🤪',
    title: 'Get your meme',
    body: 'About 20 seconds later you get a watermarked preview. Unlock HD for the clean, full-quality version.',
  },
]

export function HowItWorks(): React.ReactElement {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="eyebrow">Three steps, twenty seconds</p>
        <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="card card-hover relative overflow-hidden p-6">
            <span
              aria-hidden="true"
              className="absolute right-4 top-3 font-display text-5xl font-black text-foreground/[0.04]"
            >
              {step.n}
            </span>
            <span className="text-3xl leading-none" aria-hidden="true">
              {step.emoji}
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-foreground">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
