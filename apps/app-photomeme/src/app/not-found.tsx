import Link from 'next/link'

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-2 font-display text-2xl font-bold">This meme got away</h2>
      <p className="mt-2 text-muted-foreground">
        The link is wrong, or this meme was auto-deleted after 7 days.
      </p>
      <Link href="/#generator" className="btn-primary mt-8">
        Make a fresh one
      </Link>
    </div>
  )
}
