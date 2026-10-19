'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { site } from '@/lib/site'
import SectionHeading from './SectionHeading'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-xs lg:sticky lg:top-28 lg:max-w-none"
        >
          <div
            className="absolute -inset-3 rounded-[1.75rem] bg-accent/10 blur-xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-3xl border border-border-sub bg-bg-alt">
            <Image
              src="/img/about.webp"
              alt="Krishan Kant Singh Gautam"
              width={820}
              height={1024}
              loading="lazy"
              unoptimized
              sizes="(max-width: 1024px) 20rem, 30vw"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <div>
          <SectionHeading
            id="about-heading"
            eyebrow="About"
            title="Engineer first, but not only"
          />

          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted">
            <p>
              I&apos;m an MCA postgraduate who ended up spending most of my time where the hard
              problems live: backend systems. Workflow engines, async pipelines, access control,
              the parts that have to behave when traffic is uneven and a third-party API is having
              a bad day.
            </p>
            <p>
              That said, I&apos;ve never wanted to be the engineer who hands off at the API
              boundary. I build the front end too — React mostly, Angular when the project calls
              for it — because understanding both sides makes for better contracts between them.
              Most of what I ship ends up being end-to-end.
            </p>
            <p>
              Away from the editor I travel as often as I can manage. New places reset my thinking
              in a way another hour of debugging never does, and I come back with more ideas than I
              left with.
            </p>
            <p>
              I like working with people who care about the details. If that sounds like your team,
              I&apos;d be glad to hear from you.
            </p>
          </div>

          <dl className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                Based in
              </dt>
              <dd className="mt-1.5 text-sm text-ink">{site.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                Currently
              </dt>
              <dd className="mt-1.5 text-sm text-ink">
                Software Development Engineer at Asmadiya Technologies
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                Focus
              </dt>
              <dd className="mt-1.5 text-sm text-ink">
                Distributed backends, API design, full stack delivery
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                Outside work
              </dt>
              <dd className="mt-1.5 text-sm text-ink">Travel, photography, building side projects</dd>
            </div>
          </dl>

          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition hover:brightness-110"
          >
            View résumé
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17 17 7M17 7H9m8 0v8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
