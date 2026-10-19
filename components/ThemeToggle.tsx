'use client'

import { useTheme } from 'next-themes'

/**
 * Both icons are rendered and swapped by CSS keyed off the theme class on
 * <html>. That avoids a mounted-state flag — which would mean calling
 * setState inside an effect and triggering a cascading render — and keeps
 * server and client markup identical, so there is no hydration mismatch.
 *
 * The label is state-independent for the same reason.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle between light and dark theme"
      className="grid h-9 w-9 place-items-center rounded-full border border-border-sub bg-surface/60 text-ink transition hover:border-accent hover:text-accent"
    >
      {/* Moon — shown while the dark theme is active. */}
      <svg
        className="icon-when-dark"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Sun — shown while the light theme is active. */}
      <svg
        className="icon-when-light"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.6v2.1M12 19.3v2.1M4.2 12H2.1M21.9 12h-2.1M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
