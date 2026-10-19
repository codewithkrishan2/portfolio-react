'use client'

import { motion } from 'motion/react'

/**
 * Every section heading is an h2, with card titles below at h3 — the old site
 * had nine competing h1 elements.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = 'left',
}: {
  eyebrow: string
  title: string
  lead?: string
  id?: string
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
        {!centered && <span className="h-px w-8 bg-accent" aria-hidden="true" />}
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-extrabold tracking-tight text-balance"
      >
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed text-muted">{lead}</p>}
    </motion.div>
  )
}
