import type { MetadataRoute } from 'next'
import { projects } from '@/lib/data'
import { site } from '@/lib/site'

// Required for `output: 'export'` — the file is emitted at build time.
export const dynamic = 'force-static'

/**
 * Every indexable route, derived from the content registries so a new post or
 * project cannot be forgotten here.
 *
 * Priorities are relative hints only, and Google largely ignores them. They are
 * set to reflect genuine importance rather than wishful thinking: the homepage
 * is the entity page, the case studies and posts are the content.
 */
/**
 * `trailingSlash: true` in next.config.mjs means /work/ is the real URL and the
 * canonical tags are emitted with the slash. Sitemap entries have to match
 * exactly, or the sitemap and the canonical are nominating different URLs for
 * the same page.
 */
const url = (path: string) => `${site.url}${path.endsWith('/') ? path : `${path}/`}`

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: url('/'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/work'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: url(`/work/${project.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
