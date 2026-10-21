import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph } from '@/lib/schema'
import { projects } from '@/lib/data'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Projects by Krishan Kant Singh Gautam — a code review platform in React and Spring Boot, a Django marketplace backend, and Spring Boot APIs built around their data layer.',
  alternates: { canonical: '/work' },
  openGraph: {
    type: 'website',
    url: `${site.url}/work`,
    title: `Work — ${site.name}`,
    description: 'Case studies: code review platform, gift marketplace, Spring Boot APIs.',
  },
}

const statusStyle: Record<string, string> = {
  'In Progress': 'border-accent/45 text-accent',
  Live: 'border-emerald-500/45 text-emerald-400',
  Offline: 'border-border-sub text-muted',
  Archived: 'border-border-sub text-muted',
}

export default function WorkIndex() {
  const itemList = {
    '@type': 'ItemList',
    '@id': `${site.url}/work/#list`,
    name: `Work — ${site.name}`,
    itemListElement: projects.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: project.title,
      url: `${site.url}/work/${project.slug}`,
    })),
  }

  return (
    <>
      <Header />
      <JsonLd
        json={graph(
          itemList,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ])
        )}
      />

      <main id="main" className="container-page pt-32 pb-24 md:pt-40">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Work
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] leading-tight font-extrabold tracking-tight">
            Things I&apos;ve built
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Side projects in varying states of done, with a write-up on each about the decisions
            that were actually difficult. Images are placeholders until these are deployable.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-sub bg-surface/40 transition-colors hover:border-accent/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    width={1200}
                    height={750}
                    loading="lazy"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex grow flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-bold text-ink transition-colors group-hover:text-accent">
                      {project.title}
                    </h2>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${statusStyle[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-3 grow text-sm leading-relaxed text-muted">
                    {project.detail.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded border border-border-sub px-2 py-0.5 text-[0.68rem] font-medium text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Read the case study
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h14m0 0-6-6m6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-14 inline-flex items-center gap-2 rounded-full border border-border-sub px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
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
      </main>
      <Footer />
    </>
  )
}
