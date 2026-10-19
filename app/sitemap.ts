import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

// Required for `output: 'export'` — the file is emitted at build time.
export const dynamic = 'force-static'

/**
 * Single-page site, so one entry. /blog is deliberately excluded until it has
 * posts — submitting an empty route invites a thin-content crawl.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
