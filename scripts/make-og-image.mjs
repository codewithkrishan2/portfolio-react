/**
 * Generates the 1200x630 Open Graph / Twitter card image.
 *
 * This is what LinkedIn, WhatsApp, Slack and X render when the site is shared.
 * Those scrapers do not execute JavaScript, so this file plus the meta tags in
 * app/layout.tsx are the entire preview they ever see.
 *
 * Usage: node scripts/make-og-image.mjs
 */
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const dest = path.join(root, 'public', 'og-image.png')

const NAVY = '#0c0c1d'
const NAVY_2 = '#111132'
const AMBER = '#ffa500'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="55%" stop-color="${NAVY_2}"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="12%" r="55%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- amber rule, mirrors the accent used across the site -->
  <rect x="84" y="196" width="96" height="7" rx="3.5" fill="${AMBER}"/>

  <text x="84" y="300" font-family="DejaVu Sans, Verdana, sans-serif" font-size="68" font-weight="bold" fill="#f2f2f7" letter-spacing="-1">KRISHAN KANT</text>
  <text x="84" y="378" font-family="DejaVu Sans, Verdana, sans-serif" font-size="68" font-weight="bold" fill="#f2f2f7" letter-spacing="-1">SINGH GAUTAM</text>

  <text x="84" y="452" font-family="DejaVu Sans, Verdana, sans-serif" font-size="34" fill="${AMBER}">Full Stack Software Engineer</text>

  <text x="84" y="510" font-family="DejaVu Sans, Verdana, sans-serif" font-size="25" fill="#9b9bb0">Java &#183; Spring Boot &#183; Node.js &#183; React &#183; PostgreSQL &#183; AWS</text>

  <text x="84" y="572" font-family="DejaVu Sans, Verdana, sans-serif" font-size="22" fill="#6e6e85">codewithkrishan.netlify.app</text>

  <!-- decorative bracket, bottom right -->
  <g stroke="${AMBER}" stroke-opacity="0.55" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 1010 430 L 960 500 L 1010 570"/>
    <path d="M 1086 430 L 1136 500 L 1086 570"/>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(dest)
console.log(`Wrote ${dest}`)
