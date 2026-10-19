import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-[100svh] items-center py-32">
      <div className="max-w-xl">
        <p className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">Error 404</p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-tight font-extrabold tracking-tight">
          That page doesn&apos;t exist
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition hover:brightness-110"
        >
          Back to the homepage
        </Link>
      </div>
    </main>
  )
}
