'use client'

import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'

/**
 * The trailing avatar cursor from the original site, kept at the owner's
 * request. Two changes: it follows a spring instead of re-rendering React on
 * every mousemove, and it is hidden from assistive tech and on touch devices.
 */
export default function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 })

  useEffect(() => {
    // Pointer-coarse devices have no cursor to decorate.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX + 18)
      y.set(event.clientY + 24)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[500] hidden h-[42px] w-[42px] overflow-hidden rounded-full border-2 border-accent/70 shadow-lg md:block"
    >
      <Image
        src="/img/cursor.webp"
        alt=""
        width={42}
        height={42}
        priority
        unoptimized
        className="h-full w-full object-cover"
      />
    </motion.div>
  )
}
