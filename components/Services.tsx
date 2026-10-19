'use client'

import { motion } from 'motion/react'
import { services } from '@/lib/data'
import SectionHeading from './SectionHeading'

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="services-heading"
          eyebrow="What I do"
          title="Systems that hold up under load"
          lead="Four areas where I do my best work. The common thread is caring about what happens on the unhappy path, not just the demo."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((service, i) => (
            <motion.li
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-sub bg-surface/40 p-7 transition-colors hover:border-accent/50"
            >
              <span
                aria-hidden="true"
                className="absolute -top-14 -right-10 text-[7rem] leading-none font-extrabold text-ink/[0.04] transition-transform duration-500 group-hover:scale-110"
              >
                0{i + 1}
              </span>
              <h3 className="relative text-lg font-bold text-ink">{service.title}</h3>
              <p className="relative mt-3 grow text-sm leading-relaxed text-muted">{service.body}</p>
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.7rem] font-semibold text-accent"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
