/**
 * Visual verification. Serves the static export and captures full-page
 * screenshots at desktop, tablet and mobile widths, plus the mobile nav in its
 * open state and the light theme.
 *
 * Usage:
 *   npm run build && npm run shots
 */
import { spawn } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, '.agents', 'screenshots')
const PORT = 4321
const BASE = `http://127.0.0.1:${PORT}`

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

function serve() {
  const proc = spawn('npx', ['--yes', 'serve', 'out', '-l', String(PORT), '--no-clipboard'], {
    cwd: root,
    stdio: 'ignore',
  })
  return proc
}

async function waitForServer(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE)
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(`Static server never came up on ${BASE}`)
}

/**
 * Scrolls the full height so every scroll-triggered animation has fired.
 *
 * `scroll-behavior: smooth` is disabled first: with it on, window.scrollTo
 * animates and short waits between steps mean the page never actually reaches
 * the bottom, leaving later sections stuck at their initial opacity:0 and
 * producing blank regions in the screenshot.
 */
async function revealAll(page) {
  await page.evaluate(async () => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    const step = Math.round(window.innerHeight * 0.6)
    let y = 0
    while (y < html.scrollHeight) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 260))
      y += step
    }

    // Settle at the bottom, then return to the top for the viewport shot.
    window.scrollTo(0, html.scrollHeight)
    await new Promise((r) => setTimeout(r, 700))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 600))

    html.style.scrollBehavior = previous
  })

  // Any lazily-decoded images that just entered view.
  await page.waitForLoadState('networkidle')
}

const server = serve()
let browser

try {
  await waitForServer()
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  browser = await chromium.launch()
  const consoleErrors = []

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`[${vp.name}] ${msg.text()}`)
    })
    page.on('pageerror', (err) => consoleErrors.push(`[${vp.name}] pageerror: ${err.message}`))

    await page.goto(BASE, { waitUntil: 'networkidle' })
    await revealAll(page)
    await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true })
    await page.screenshot({ path: path.join(outDir, `${vp.name}-hero.png`) })

    // Mobile nav, opened.
    if (vp.name === 'mobile') {
      await page.getByRole('button', { name: /open navigation menu/i }).click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(outDir, 'mobile-nav-open.png') })
    }

    // Light theme.
    if (vp.name === 'desktop') {
      await page.getByRole('button', { name: /toggle between light and dark/i }).click()
      await page.waitForTimeout(600)
      await page.screenshot({ path: path.join(outDir, 'desktop-light-full.png'), fullPage: true })
    }

    await context.close()
  }

  // Blog route.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(`${BASE}/blog/`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outDir, 'blog.png'), fullPage: true })
  await context.close()

  console.log(`\nScreenshots written to ${outDir}`)
  if (consoleErrors.length) {
    console.log('\nBrowser console errors:')
    for (const e of consoleErrors) console.log('  ' + e)
    process.exitCode = 1
  } else {
    console.log('No browser console errors.')
  }
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
