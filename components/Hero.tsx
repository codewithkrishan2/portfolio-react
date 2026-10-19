'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { site } from '@/lib/site'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const facts = [
  { value: '2+', label: 'Years shipping production systems' },
  { value: '4', label: 'Enterprise platforms delivered' },
  { value: '200+', label: 'Tool integrations architected' },
]

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Oversized decorative word behind the content — the sliding text from
          the old hero, reworked as an outline so it is legible-by-design
          rather than near-invisible 2%-opacity text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-0 w-full select-none overflow-hidden"
      >
        <motion.p
          initial={{ x: '2%' }}
          animate={{ x: '-26%' }}
          transition={{ duration: 42, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
          className="ghost-text text-[22vw] leading-none font-extrabold whitespace-nowrap"
        >
          ENGINEER · BUILDER · TRAVELLER ·
        </motion.p>
      </div>

      <div className="container-page relative grid min-h-[100svh] items-center gap-12 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.p
            variants={rise}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-sub bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for new opportunities
          </motion.p>

          {/* The single h1 on the page, and it carries the name. Deliberately
              one text node with no <br>, so crawlers and screen readers get
              "Krishan Kant Singh Gautam" rather than two run-together lines. */}
          <motion.h1
            id="hero-heading"
            variants={rise}
            className="max-w-[11ch] text-[clamp(2.1rem,6.2vw,4.1rem)] leading-[1.04] font-extrabold tracking-tight"
          >
            Krishan Kant Singh Gautam
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-4 text-[clamp(1.05rem,2.4vw,1.5rem)] font-semibold text-accent"
          >
            Full Stack Software Engineer
          </motion.p>

          <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            I build the backend systems products depend on — event-driven services, workflow
            engines and REST APIs in Java, Spring Boot and Node.js — and the React interfaces that
            sit on top of them. Currently with Asmadiya Technologies in {site.location.split(',')[0]}.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition hover:brightness-110"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border-sub px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3 text-sm font-semibold text-muted underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
            >
              View résumé
            </a>
          </motion.div>

          <motion.dl variants={rise} className="mt-12 grid max-w-xl grid-cols-3 gap-5">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l border-border-sub pl-3.5">
                <dt className="text-xl font-extrabold text-ink sm:text-2xl">{fact.value}</dt>
                <dd className="mt-1 text-[0.68rem] leading-snug text-muted sm:text-xs">
                  {fact.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border-sub bg-bg-alt">
            <Image
              src="/img/hero.webp"
              alt="Krishan Kant Singh Gautam"
              width={1000}
              height={1000}
              priority
              fetchPriority="high"
              unoptimized
              sizes="(max-width: 1024px) 24rem, 40vw"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      <a
        href="#services"
        aria-label="Scroll to what I do"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <motion.span
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-border-sub p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-accent" />
        </motion.span>
      </a>
    </section>
  )
}
