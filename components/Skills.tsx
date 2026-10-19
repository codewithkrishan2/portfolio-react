'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { coreStack, skillGroups } from '@/lib/data'
import SectionHeading from './SectionHeading'

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-24 bg-bg-alt/40 py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading
          id="skills-heading"
          eyebrow="Toolkit"
          title="What I work with"
          lead="Grouped by what it's for, rather than a wall of logos. Depth varies — the languages and backend rows are where I spend most days."
        />

        {/* Core stack logo strip. Only the tools with artwork on hand. */}
        <ul className="mt-12 flex flex-wrap gap-2.5">
          {coreStack.map((tech, i) => (
            <motion.li
              key={tech.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.4) }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 rounded-xl border border-border-sub bg-surface/50 px-3 py-2"
            >
              <Image
                src={tech.icon}
                alt=""
                width={22}
                height={22}
                loading="lazy"
                unoptimized
                className="h-[22px] w-[22px] object-contain"
              />
              <span className="text-xs font-semibold text-ink">{tech.name}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border-sub bg-border-sub sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              className="bg-bg p-6"
            >
              <h3 className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                {group.name}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border-sub px-2 py-1 text-xs font-medium text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
