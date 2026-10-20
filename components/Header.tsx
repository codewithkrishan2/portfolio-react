'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { navItems, site } from '@/lib/site'
import Social from './Social'
import ThemeToggle from './ThemeToggle'

export default function Header({
  /**
   * On the homepage the cinematic hero carries its own frosted nav pill, so the
   * site header stays hidden until the hero has scrolled past. Two navigation
   * bars stacked at the top would otherwise collide.
   */
  revealAfterHero = false,
}: {
  revealAfterHero?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(!revealAfterHero)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (revealAfterHero) {
        const shouldShow = y > window.innerHeight * 0.8
        setVisible(shouldShow)
        // Collapse the mobile menu if the header slides away beneath it.
        if (!shouldShow) setOpen(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [revealAfterHero])



  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-[400] transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${!visible ? 'pointer-events-none' : ''} ${
        open
          ? 'bg-bg'
          : scrolled
            ? 'border-b border-border-sub bg-bg/85 backdrop-blur-md'
            : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <a href="#home" className="group flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight">{site.shortName}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition group-hover:scale-150" />
        </a>

        {/* Desktop navigation: real anchors with real hrefs, so each section is
            a crawlable link target. */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="relative text-sm font-medium text-muted transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Social className="hidden sm:flex" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-9 w-9 place-items-center rounded-full border border-border-sub bg-surface/60 text-ink transition hover:border-accent hover:text-accent lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
              <motion.path
                strokeWidth="2.4"
                stroke="currentColor"
                strokeLinecap="round"
                animate={open ? { d: 'M 3 16.5 L 17 2.5' } : { d: 'M 2 3.5 L 20 3.5' }}
              />
              <motion.path
                strokeWidth="2.4"
                stroke="currentColor"
                strokeLinecap="round"
                d="M 2 9.423 L 20 9.423"
                animate={{ opacity: open ? 0 : 1 }}
              />
              <motion.path
                strokeWidth="2.4"
                stroke="currentColor"
                strokeLinecap="round"
                animate={open ? { d: 'M 3 2.5 L 17 16.346' } : { d: 'M 2 15.346 L 20 15.346' }}
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-border-sub bg-bg lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-muted transition hover:bg-surface hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="px-3 pt-3">
                <Social className="sm:hidden" />
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
