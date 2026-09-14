import Link from 'next/link';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import { StylePlaceholder } from '@/components/hairstyles/StyleCard';
import { getPopularHairstyles } from '@/lib/hairstyles';

const comparePairs = [
  {
    before: '/styles/before-frenchbob.svg',
    after: '/styles/frenchbob.svg',
    label: 'French Bob',
  },
  {
    before: '/styles/before-twoblock.svg',
    after: '/styles/twoblock.svg',
    label: 'Two Block',
  },
  {
    before: '/styles/before-buzz.svg',
    after: '/styles/buzz.svg',
    label: 'Buzz Cut',
  },
];

const steps = [
  {
    n: '01',
    title: 'Upload your photo',
    desc: 'A clear, front-facing selfie is all it takes. JPG, PNG or WebP.',
  },
  {
    n: '02',
    title: 'Get AI recommendations',
    desc: 'We analyze your face shape, hair texture and features to find your most flattering styles.',
  },
  {
    n: '03',
    title: 'Try on and compare',
    desc: 'See multiple hairstyles on your own face with realistic before/after — before you ever cut.',
  },
];

export default function HomePage(): React.ReactElement {
  const popular = getPopularHairstyles(8);

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(168,91,107,0.08) 0%, rgba(250,247,242,0) 70%)',
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <p className="eyebrow mb-5">AI Hairstyle Try-On</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Find Your Perfect
            <br />
            <span className="italic text-accent">Hairstyle</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            See how different hairstyles look on you before you cut your hair.
            AI face analysis, personalized recommendations, and realistic try-on.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/upload" className="btn-primary px-8 py-3.5 text-base">
              Try Your Hairstyle
            </Link>
            <a href="#popular" className="btn-outline px-8 py-3.5 text-base">
              Explore Hairstyles
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free to try · No card required · Your photo stays private
          </p>
        </div>
      </section>

      {/* ===== Before / After showcase ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Real Results</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Drag to see the difference
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Your face stays exactly yours. Only the hair changes — with a natural,
            believable hairline.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {comparePairs.map((pair) => (
            <div key={pair.label}>
              <BeforeAfterSlider
                beforeSrc={pair.before}
                afterSrc={pair.after}
                beforeLabel="Before"
                afterLabel="After"
              />
              <p className="mt-3 text-center font-display text-lg font-medium">
                {pair.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Popular styles ===== */}
      <section id="popular" className="border-y border-border/60 bg-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">The Library</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Popular hairstyles
              </h2>
            </div>
            <Link href="/hairstyles" className="btn-outline text-sm">
              Browse all styles
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {popular.map((style) => (
              <Link
                key={style.id}
                href="/upload"
                className="group block transition-transform hover:-translate-y-1"
              >
                <StylePlaceholder style={style} />
                <p className="mt-2.5 text-sm font-medium">{style.name}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {style.length}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">How It Works</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Your new look in three steps
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t-2 border-foreground pt-5">
              <p className="font-display text-4xl font-semibold text-accent/60">{s.n}</p>
              <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/upload" className="btn-primary px-8 py-3.5 text-base">
            Try Your Hairstyle
          </Link>
        </div>
      </section>

      {/* ===== SEO content ===== */}
      <section className="border-t border-border/60 bg-white/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            The AI hairstyle simulator that keeps it <span className="italic text-accent">you</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Unlike generic AI image generators, Haircut AI is built as a virtual hairstyle
            try-on tool: upload a selfie, get recommendations for your face shape — oval,
            round, square, heart, oblong or diamond — and try bobs, layers, pixies, fades,
            wolf cuts and more on your own face. A realistic virtual haircut before you
            ever visit the salon.
          </p>
        </div>
      </section>
    </div>
  );
}
