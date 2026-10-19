'use client'

import { motion } from 'motion/react'
import { education, experience } from '@/lib/data'
import SectionHeading from './SectionHeading'

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-24 bg-bg-alt/40 py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading
          id="experience-heading"
          eyebrow="Experience"
          title="Where I've been building"
          lead="Platform work across workflow automation, B2B distribution, FinTech and internal enterprise tooling."
        />

        <div className="mt-14 space-y-12">
          {experience.map((role) => (
            <div key={role.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border-sub pb-5">
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    {role.title}
                    <span className="text-accent"> · {role.company}</span>
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">{role.summary}</p>
                </div>
                <p className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted">
                  {role.current && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  )}
                  <span>{role.period}</span>
                  <span aria-hidden="true">·</span>
                  <span>{role.location}</span>
                </p>
              </div>

              {/* Platforms worked on. Client names are intentionally omitted. */}
              <ol className="mt-8 space-y-7 border-l border-border-sub pl-6 md:pl-8">
                {role.projects.map((project, i) => (
                  <motion.li
                    key={project.name}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 -left-[1.9rem] h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg md:-left-[2.4rem]"
                    />
                    <h4 className="font-semibold text-ink">{project.name}</h4>
                    <p className="mt-0.5 text-xs font-medium tracking-wide text-accent uppercase">
                      {project.kind}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {project.points.map((point) => (
                        <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-3.5 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded border border-border-sub px-2 py-0.5 text-[0.68rem] font-medium text-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </ol>
            </div>
          ))}

          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-border-sub pt-8">
            <div>
              <h3 className="text-lg font-bold text-ink">{education.degree}</h3>
              <p className="mt-1 text-sm text-muted">
                {education.school} · {education.detail}
              </p>
            </div>
            <p className="text-sm font-medium text-muted">
              {education.year} · {education.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
