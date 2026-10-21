'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { site } from '@/lib/site'
import CharacterCanvas from './CharacterCanvas'
import MagneticCursor from './MagneticCursor'

/**
 * Full-viewport hero: the cursor-tracking character fills the screen, with a
 * frosted navigation pill floating at the top and the introduction anchored
 * bottom-left so it never crowds the character's face.
 *
 * No 3D transforms are used anywhere in this subtree. Entrance animations are
 * 2D opacity and translate only, so the canvas never gets promoted into a
 * transformed ancestor layer and the character stays pixel-stable.
 */

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function CinematicHero() {
  // Seeded dark until the real video background colour is known, so there is
  // never a flash of a mismatched colour behind the canvas.
  const [backgroundHex, setBackgroundHex] = useState('#0c0c1d')
  const [characterFailed, setCharacterFailed] = useState(false)

  return (
    <section
      id="home"
      data-cursor-scope
      aria-label="Introduction"
      className="relative h-[100svh] w-full overflow-hidden md:cursor-none"
      // Matches the detected video background so the canvas edges are seamless.
      style={{ backgroundColor: backgroundHex }}
    >
      {/* Character. Fills the viewport, cover-fitted inside the canvas. */}
      <CharacterCanvas
        className="absolute inset-0 h-full w-full"
        onReady={setBackgroundHex}
        onError={() => setCharacterFailed(true)}
      />

      {/* Fallback backdrop if the frames are missing or fail to load. The hero
          still has to look deliberate — the copy below never depends on the
          character rendering. */}
      {characterFailed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,165,0,0.16),transparent_55%)]"
        />
      )}

      {/* Legibility scrims. Plain gradients, no blend modes, so the character
          underneath stays colour-accurate. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/75 via-black/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent"
      />

      <MagneticCursor />

      {/* Frosted navigation pill */}
      <motion.nav
        aria-label="Primary"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 left-1/2 z-20 -translate-x-1/2"
      >
        <ul
          className="flex items-center gap-1 rounded-full border border-white/20 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.10)' }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-full px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-white/85 uppercase transition hover:bg-white/15 hover:text-white md:cursor-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Introduction, bottom-left. Animates on mount and is deliberately NOT
          gated on the character loading — copy must never wait on decoration. */}
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.11, delayChildren: 0.15 }}
        className="absolute bottom-10 left-6 z-20 max-w-[22rem] md:bottom-16 md:left-14"
      >
        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.7rem] font-medium tracking-[0.42em] text-white/70 uppercase"
        >
          Hi, I&apos;m
        </motion.p>

        {/*
          Still the page's only h1, and it still carries the full name — the
          signature shows "Krishan" while the rest of the name stays in the
          accessible text, so the heading reads "Krishan Kant Singh Gautam" to
          crawlers and screen readers. That was the fix the SEO audit called
          for; losing it to a one-word signature would undo it.
        */}
        <motion.h1
          variants={rise}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-script mt-1 text-[clamp(3.6rem,9vw,6rem)] leading-[0.92] text-white"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.35)' }}
        >
          Krishan
          <span className="sr-only"> Kant Singh Gautam — Full Stack Software Engineer</span>
        </motion.h1>

        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-[21rem] text-[0.95rem] leading-relaxed text-white/80"
        >
          Full stack engineer. I build event-driven backends in Java, Spring Boot and Node.js —
          and the React interfaces on top.
        </motion.p>

        <motion.div
          variants={rise}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition hover:bg-white/90 md:cursor-none"
          >
            Resume
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M5 12h14m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-white/45 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 md:cursor-none"
            style={{ backdropFilter: 'blur(14px)', backgroundColor: 'rgba(255,255,255,0.07)' }}
          >
            Let&apos;s Talk
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint, bottom-right so it stays clear of the copy */}
      <motion.a
        href="#services"
        aria-label="Scroll to what I do"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute right-6 bottom-10 z-20 hidden items-center gap-3 text-[0.65rem] font-medium tracking-[0.3em] text-white/60 uppercase transition hover:text-white md:flex md:right-14 md:bottom-16 md:cursor-none"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-white/45"
        />
      </motion.a>
    </section>
  )
}
