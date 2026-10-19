'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import emailjs from '@emailjs/browser'
import { site } from '@/lib/site'
import SectionHeading from './SectionHeading'

/**
 * EmailJS identifiers. These are browser-side values by design (the public key
 * is meant to be exposed), but they are read from env first so they can be
 * rotated without a code change. The fallbacks keep an unconfigured deploy
 * working exactly as the previous site did.
 */
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'service_c1zbveh'
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'template_r3qqy8d'
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? 'AhQ7M1kBPQAgRsv_Z'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const details = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'Phone', value: site.phone, href: `tel:${site.phoneHref}` },
  { label: 'Location', value: site.location, href: null },
]

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formRef.current) return

    setStatus('sending')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus('sent')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Let's work together"
            lead="Open to full-time roles, interesting freelance work, or just talking shop about distributed systems."
          />

          <dl className="mt-10 space-y-6">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-base text-ink">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="underline decoration-border-sub decoration-2 underline-offset-4 transition hover:text-accent hover:decoration-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border-sub bg-surface/40 p-7 md:p-9"
        >
          <h3 className="text-lg font-bold text-ink">Send me a message</h3>

          <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="from_name" className="mb-1.5 block text-sm font-medium text-ink">
                Name
              </label>
              <input
                id="from_name"
                name="from_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-lg border border-border-sub bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="from_email" className="mb-1.5 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="from_email"
                name="from_email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border-sub bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="What would you like to build?"
                className="w-full resize-y rounded-lg border border-border-sub bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-on-accent transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            {/* Announced to screen readers when it changes. */}
            <p
              role="status"
              aria-live="polite"
              className={`min-h-5 text-sm ${status === 'error' ? 'text-red-400' : 'text-accent'}`}
            >
              {status === 'sent' && 'Thanks — your message is on its way.'}
              {status === 'error' &&
                `Something went wrong. Email me directly at ${site.email}.`}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
