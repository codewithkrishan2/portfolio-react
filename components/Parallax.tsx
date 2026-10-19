'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/**
 * The space/mountains scroll divider from the original site, kept at the
 * owner's request. Layer artwork is now WebP (mountains went 696 kB -> 58 kB)
 * and the oversized caption is decorative, so it no longer competes with the
 * real section headings for the document outline.
 */
export default function Parallax({ variant }: { variant: 'services' | 'work' }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Caption travel is deliberately modest: the original moved 400%, which
  // carried the text down onto the dark mountain artwork where it lost all
  // contrast — especially in the light theme, where the caption is dark.
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '120%'])
  const yLayer = useTransform(scrollYProgress, [0, 1], ['0%', '180%'])
  const xStars = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])

  const caption = variant === 'services' ? 'What I do?' : 'What I built?'
  const orb = variant === 'services' ? '/img/parallax/planets.webp' : '/img/parallax/sun.webp'

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-[65vh] w-full overflow-hidden md:h-[80vh]"
      style={{
        background:
          variant === 'services'
            ? 'linear-gradient(180deg, var(--c-bg-alt), var(--c-bg))'
            : 'linear-gradient(180deg, var(--c-bg-alt), #3a3a55)',
      }}
    >
      <motion.p
        style={{
          y: yText,
          // Halo in the current background colour, so the caption stays
          // readable at any scroll offset and in either theme.
          textShadow: '0 2px 18px var(--c-bg), 0 0 6px var(--c-bg)',
        }}
        className="absolute inset-x-0 top-[38%] z-10 text-center text-[clamp(2.25rem,7vw,5rem)] font-extrabold tracking-tight text-ink"
      >
        {caption}
      </motion.p>

      <motion.div
        style={{ x: xStars, backgroundImage: 'url(/img/parallax/stars.webp)' }}
        className="absolute inset-0 z-[1] bg-cover bg-bottom opacity-70"
      />
      <motion.div
        style={{ y: yLayer, backgroundImage: `url(${orb})` }}
        className="absolute inset-0 z-[2] bg-contain bg-[center_top_18%] bg-no-repeat"
      />
      <div
        style={{ backgroundImage: 'url(/img/parallax/mountains.webp)' }}
        className="absolute inset-x-0 bottom-0 z-[3] h-full bg-cover bg-bottom"
      />
    </div>
  )
}
