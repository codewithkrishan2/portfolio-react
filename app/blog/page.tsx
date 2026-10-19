import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Notes on backend engineering, distributed systems and the things I learn building them.',
  alternates: { canonical: '/blog' },
  // Nothing published yet, so keep it out of the index rather than offering
  // a thin page for crawlers to judge the site by.
  robots: { index: false, follow: true },
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page flex min-h-[100svh] items-center py-32">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Writing
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] leading-tight font-extrabold tracking-tight">
            Notes, soon
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            I&apos;m planning to write up some of what I&apos;ve learned building workflow engines,
            event-driven services and access-control systems — the decisions that only look obvious
            afterwards. Nothing published yet.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            In the meantime, the code is on{' '}
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
            >
              GitHub
            </a>
            , or say hello on{' '}
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
            >
              LinkedIn
            </a>
            .
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border-sub px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 12H5m0 0 6-6m-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to portfolio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
