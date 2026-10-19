/**
 * Build-time image optimisation.
 *
 * The static export has no image server, so `next/image` cannot optimise on
 * the fly. Everything is pre-processed here instead: resized to the dimensions
 * it is actually displayed at and re-encoded as WebP.
 *
 * Idempotent: safe to re-run. Reads originals from assets/originals (moving
 * them out of public/ on first run, so the export only ships optimised files)
 * and writes optimised output to public/img.
 *
 * Usage: npm run optimize:images
 */
import { mkdir, rename, stat, access } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const originals = path.join(root, 'assets', 'originals')
const tmp = path.join(root, '.tmp-img')
const out = path.join(pub, 'img')

/** [source, destination, width, height|null, fit] */
const JOBS = [
  // Hero + about + services photography
  ['hero.webp', 'hero.webp', 1000, null, 'inside'],
  ['kksg.png', 'about.webp', 820, null, 'inside'],
  ['people.webp', 'people.webp', 900, null, 'inside'],
  ['scroll.png', 'scroll.webp', 60, null, 'inside'],
  ['favicon.png', 'cursor.webp', 64, 64, 'cover'],

  // Parallax layers (kept at the user's request, just far lighter)
  ['mountains.png', 'parallax/mountains.webp', 1920, null, 'inside'],
  ['stars.png', 'parallax/stars.webp', 1920, null, 'inside'],
  ['planets.png', 'parallax/planets.webp', 700, null, 'inside'],
  ['sun.png', 'parallax/sun.webp', 700, null, 'inside'],

  // Project cards. The three Unsplash images are downloaded to .tmp-img by
  // scripts/fetch-project-images.sh so they are served locally, not hotlinked.
  ['giftstore.png', 'projects/giftstore.webp', 1200, 750, 'cover'],
  ['@tmp/proj-portfolio.jpg', 'projects/portfolio.webp', 1200, 750, 'cover'],
  ['@tmp/proj-codereview.jpg', 'projects/codereview.webp', 1200, 750, 'cover'],
  ['@tmp/proj-blog.jpg', 'projects/blog.webp', 1200, 750, 'cover'],
]

// Raster tech logos shown at 56-72px. Rendered at 160px for retina.
const LOGOS = [
  'js.png',
  'ts.png',
  'react.png',
  'css.png',
  'html.png',
  'mysql.png',
  'postger.png',
  'gitwhite.png',
  'tailwind.png',
  'mui.png',
  'docker.webp',
]

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** Move every original out of public/ once, so public/ holds only shipped assets. */
async function stashOriginals() {
  await mkdir(originals, { recursive: true })
  const wanted = new Set([...JOBS.map(([src]) => src), ...LOGOS].filter((s) => !s.startsWith('@tmp/')))
  for (const name of wanted) {
    const inPublic = path.join(pub, name)
    const stashed = path.join(originals, name)
    if (existsSync(inPublic) && !existsSync(stashed)) {
      await rename(inPublic, stashed)
    }
  }
}

function resolveSource(src) {
  if (src.startsWith('@tmp/')) return path.join(tmp, src.slice(5))
  const stashed = path.join(originals, src)
  return existsSync(stashed) ? stashed : path.join(pub, src)
}

async function run() {
  await stashOriginals()
  await mkdir(out, { recursive: true })
  await mkdir(path.join(out, 'parallax'), { recursive: true })
  await mkdir(path.join(out, 'projects'), { recursive: true })
  await mkdir(path.join(out, 'skills'), { recursive: true })

  let saved = 0
  const rows = []

  for (const [src, dest, w, h, fit] of JOBS) {
    const from = resolveSource(src)
    if (!(await exists(from))) {
      console.warn(`  skip (missing source): ${src}`)
      continue
    }
    const to = path.join(out, dest)
    const before = (await stat(from)).size
    await sharp(from)
      .resize({ width: w, height: h ?? undefined, fit, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(to)
    const after = (await stat(to)).size
    saved += before - after
    rows.push([dest, before, after])
  }

  for (const name of LOGOS) {
    const from = resolveSource(name)
    if (!(await exists(from))) {
      console.warn(`  skip (missing logo): ${name}`)
      continue
    }
    const dest = `skills/${name.replace(/\.(png|webp|jpg)$/, '')}.webp`
    const to = path.join(out, dest)
    const before = (await stat(from)).size
    await sharp(from)
      .resize({ width: 160, height: 160, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 85, effort: 5 })
      .toFile(to)
    const after = (await stat(to)).size
    saved += before - after
    rows.push([dest, before, after])
  }

  const kb = (n) => `${(n / 1024).toFixed(1)} kB`
  console.log('\n  optimised asset               before      after')
  console.log('  ' + '-'.repeat(52))
  for (const [name, before, after] of rows) {
    console.log(`  ${name.padEnd(30)}${kb(before).padStart(9)}${kb(after).padStart(11)}`)
  }
  console.log('  ' + '-'.repeat(52))
  console.log(`  ${rows.length} files, ${kb(saved)} saved\n`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
