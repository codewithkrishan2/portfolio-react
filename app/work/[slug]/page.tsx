import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, softwareSchema } from '@/lib/schema'
import { projects } from '@/lib/data'
import { site } from '@/lib/site'

/** Required for `output: 'export'` — every project URL is emitted at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

function find(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = find(slug)
  if (!project) return {}

  const title = `${project.title} — case study`

  return {
    /*
      Absolute, so the "— Krishan Kant Singh Gautam" template suffix is not
      appended: with it, the longer project names ran to 68 characters and
      Google truncates around 60. The homepage is what targets the name query;
      these pages target the project and its stack, and the brand is still
      carried by the Person schema, breadcrumbs and the header.
    */
    title: { absolute: title },
    description: project.detail.summary,
    keywords: [...project.stack, project.title, site.name],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      url: `${site.url}/work/${project.slug}`,
      title,
      description: project.detail.summary,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.detail.summary,
      images: ['/og-image.png'],
    },
  }
}

const statusStyle: Record<string, string> = {
  'In Progress': 'border-accent/45 text-accent',
  Live: 'border-emerald-500/45 text-emerald-400',
  Offline: 'border-border-sub text-muted',
  Archived: 'border-border-sub text-muted',
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = find(slug)
  if (!project) notFound()

  const repo = project.links.find((l) => l.href.includes('github.com'))?.href
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3)

  return (
    <>
      <Header />
      <JsonLd
        json={graph(
          softwareSchema({
            title: project.title,
            blurb: project.detail.summary,
            stack: project.stack,
            slug: project.slug,
            repo,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.title, path: `/work/${project.slug}` },
          ])
        )}
      />

      <main id="main" className="container-page pt-32 pb-24 md:pt-40">
        <article className="mx-auto max-w-3xl">
          <header>
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/work" className="hover:text-accent">
                    Work
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink">
                  {project.title}
                </li>
              </ol>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="text-[clamp(1.85rem,4.4vw,2.75rem)] leading-tight font-extrabold tracking-tight">
                {project.title}
              </h1>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${statusStyle[project.status]}`}
              >
                {project.status}
              </span>
            </div>

            <p className="mt-5 text-lg leading-relaxed text-muted">{project.blurb}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.7rem] font-semibold text-accent"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {project.links.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
                  >
                    {link.label}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 17 17 7M17 7H9m8 0v8"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            {project.note && <p className="mt-4 text-xs text-muted italic">{project.note}</p>}
          </header>

          <div className="relative mt-10 overflow-hidden rounded-2xl border border-border-sub">
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1200}
              height={750}
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-14 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            What it does
          </h2>
          <ul className="mt-5 space-y-2.5">
            {project.points.map((point) => (
              <li key={point} className="flex gap-3 text-base leading-relaxed text-muted">
                <span
                  className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="prose mt-6">
            {project.detail.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          {others.length > 0 && (
            <nav aria-label="Other projects" className="mt-16 border-t border-border-sub pt-10">
              <h2 className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Other work
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/work/${other.slug}`}
                      className="block h-full rounded-xl border border-border-sub bg-surface/40 p-5 transition-colors hover:border-accent/50"
                    >
                      <p className="text-sm font-bold text-ink">{other.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {other.stack.slice(0, 3).join(' · ')}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
