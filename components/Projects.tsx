'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { projects, type Project } from '@/lib/data'
import SectionHeading from './SectionHeading'

const statusStyle: Record<Project['status'], string> = {
  'In Progress': 'border-accent/45 text-accent',
  Live: 'border-emerald-500/45 text-emerald-400',
  Offline: 'border-border-sub text-muted',
  Archived: 'border-border-sub text-muted',
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M17 7H9m8 0v8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Projects() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="work-heading"
          eyebrow="Selected work"
          title="Things I've built on my own time"
          lead="Side projects, in varying states of done. The images are placeholders — I'll swap in real screenshots as these go live."
        />

        <div className="mt-14 space-y-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.2) }}
              className="group grid items-stretch gap-0 overflow-hidden rounded-2xl border border-border-sub bg-surface/40 transition-colors hover:border-accent/40 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className={`relative min-h-56 overflow-hidden ${i % 2 ? 'lg:order-2' : ''}`}>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={1200}
                  height={750}
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col p-7 md:p-9">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-ink md:text-2xl">{project.title}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${statusStyle[project.status]}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted">{project.blurb}</p>

                <ul className="mt-5 space-y-2">
                  {project.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span
                        className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

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

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
                    >
                      {link.label} — {project.title}
                      <ExternalIcon />
                    </a>
                  ))}
                  {project.note && (
                    <p className="text-xs text-muted italic">{project.note}</p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
