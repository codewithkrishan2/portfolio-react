import { expertise, site } from './site'

/**
 * JSON-LD builders.
 *
 * These exist to make the site legible as an *entity* rather than as a page of
 * text. For name queries ("Krishan Kant Singh Gautam", "codewithkrishan") the
 * goal is for Google to connect this site, the GitHub account, the LinkedIn
 * profile and the Instagram account to one person — which is the prerequisite
 * for a knowledge panel. `sameAs` is what carries that.
 *
 * Every claim here is also stated in visible page text. Structured data that
 * contradicts the page is worse than none.
 */

const PERSON_ID = `${site.url}/#person`
const WEBSITE_ID = `${site.url}/#website`

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: [site.handle, site.shortName],
    url: site.url,
    image: `${site.url}/img/about.webp`,
    jobTitle: site.title,
    description: site.description,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.country,
      },
    },
    worksFor: {
      '@type': 'Organization',
      name: site.employer.name,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: site.education.name,
    },
    knowsAbout: [...expertise],
    knowsLanguage: ['en', 'hi'],
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.instagram],
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: `${site.name} — ${site.title}`,
    alternateName: site.handle,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

/**
 * ProfilePage is Google's documented type for a page that *is* somebody's
 * profile, which is exactly what the homepage is. It wraps the Person rather
 * than duplicating it, hence the @id reference.
 */
export function profilePageSchema() {
  return {
    '@type': 'ProfilePage',
    '@id': `${site.url}/#profilepage`,
    url: site.url,
    name: `${site.name} — ${site.title}`,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
    inLanguage: 'en',
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}

export function softwareSchema(project: {
  title: string
  blurb: string
  stack: readonly string[]
  slug: string
  repo?: string
}) {
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${site.url}/work/${project.slug}/#software`,
    name: project.title,
    description: project.blurb,
    url: `${site.url}/work/${project.slug}`,
    ...(project.repo ? { codeRepository: project.repo } : {}),
    programmingLanguage: [...project.stack],
    author: { '@id': PERSON_ID },
    maintainer: { '@id': PERSON_ID },
  }
}

/** Wraps nodes in a single @graph, which is the cleanest way to cross-reference by @id. */
export function graph(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
}
