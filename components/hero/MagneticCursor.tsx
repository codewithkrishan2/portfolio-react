'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Glowing dot with a trailing aura ring that swells over interactive elements.
 *
 * Only 2D translate is used. No `perspective`, `rotateX` or `rotateY` anywhere —
 * a 3D transform here would promote an ancestor layer and risk shifting the
 * character canvas, which has to stay pixel-stable.
 *
 * The dot tracks at near-zero latency; the ring trails on a softer spring,
 * which is what reads as "magnetic".
 *
 * Scoped, not global: it only shows while the pointer is inside an element
 * marked `data-cursor-scope`. That keeps it to the cinematic hero and leaves
 * the avatar-trailing cursor to the rest of the page.
 */
export default function MagneticCursor() {
  // No `enabled` state: touch devices and reduced-motion users are excluded in
  // CSS via `.cursor-layer` in globals.css. Setting state from the effect body
  // to decide that would trigger a cascading render on every mount.
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [inScope, setInScope] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Tight spring for the dot, loose one for the aura.
  const dotX = useSpring(x, { stiffness: 1400, damping: 60, mass: 0.22 })
  const dotY = useSpring(y, { stiffness: 1400, damping: 60, mass: 0.22 })
  const auraX = useSpring(x, { stiffness: 190, damping: 22, mass: 0.6 })
  const auraY = useSpring(y, { stiffness: 190, damping: 22, mass: 0.6 })

  useEffect(() => {
    // Pointer-coarse devices have no cursor to replace, so skip the listeners
    // entirely. The layers are hidden in CSS for these cases too.
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interactive = 'a, button, input, textarea, select, [role="button"], label'

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      const scoped = Boolean(target?.closest?.('[data-cursor-scope]'))
      setInScope(scoped)
      if (!scoped) return

      x.set(event.clientX)
      y.set(event.clientY)
      setHovering(Boolean(target?.closest?.(interactive)))
    }

    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => {
      x.set(-100)
      y.set(-100)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  return (
    <>
      {/* Trailing aura */}
      <motion.div
        aria-hidden="true"
        style={{ x: auraX, y: auraY }}
        className="cursor-layer pointer-events-none fixed top-0 left-0 z-[600] hidden md:block"
      >
        <motion.span
          animate={{
            width: hovering ? 62 : 34,
            height: hovering ? 62 : 34,
            opacity: inScope ? (hovering ? 0.5 : 0.28) : 0,
            borderWidth: hovering ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="block -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
          style={{ boxShadow: '0 0 22px rgba(255,255,255,0.22)' }}
        />
      </motion.div>

      {/* Core dot */}
      <motion.div
        aria-hidden="true"
        style={{ x: dotX, y: dotY }}
        className="cursor-layer pointer-events-none fixed top-0 left-0 z-[601] hidden md:block"
      >
        <motion.span
          animate={{
            width: pressed ? 5 : hovering ? 7 : 6,
            height: pressed ? 5 : hovering ? 7 : 6,
            opacity: inScope ? (pressed ? 0.7 : 1) : 0,
          }}
          transition={{ type: 'spring', stiffness: 520, damping: 30 }}
          className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ boxShadow: '0 0 12px rgba(255,255,255,0.9), 0 0 26px rgba(255,255,255,0.4)' }}
        />
      </motion.div>
    </>
  )
}
