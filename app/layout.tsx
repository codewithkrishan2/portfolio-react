import type { Metadata, Viewport } from 'next'
import { DM_Sans, Dancing_Script } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { site } from '@/lib/site'
import ThemeProvider from '@/components/ThemeProvider'
import Cursor from '@/components/Cursor'
import ViewGuard from '@/components/ViewGuard'

// Self-hosted at build time. Replaces the old render-blocking Google Fonts
// request that pulled 22 weight/style axes of DM Sans.
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
})

// Script face for the hero signature.
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700'],
  variable: '--font-dancing-script',
})

const pageTitle = `${site.name} — ${site.title}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Krishan Kant Singh Gautam',
    'Full Stack Developer',
    'Software Development Engineer',
    'Backend Developer Pune',
    'Java Spring Boot Developer',
    'Node.js Developer',
    'React Developer',
    'Distributed Systems',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: pageTitle,
    description: site.description,
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: site.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0c1d' },
    { media: '(prefers-color-scheme: light)', color: '#f6f6fb' },
  ],
}

/** schema.org Person — every field here already existed somewhere on the site. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  image: `${site.url}/img/about.webp`,
  jobTitle: site.title,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Kamla Nehru Institute of Technology',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Asmadiya Technologies',
  },
  knowsAbout: [
    'Java',
    'Spring Boot',
    'Node.js',
    'Express.js',
    'React',
    'Angular',
    'TypeScript',
    'PostgreSQL',
    'Redis',
    'Microservices',
    'Event-Driven Architecture',
    'REST API Design',
    'AWS',
  ],
  sameAs: [site.socials.github, site.socials.linkedin, site.socials.instagram],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dancingScript.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/*
          Entrance animations ship their starting state as inline
          `opacity:0`. With JavaScript disabled nothing ever animates in, so
          the content would be present in the DOM but invisible. This reveals
          everything for no-JS visitors and non-rendering crawlers. Inline
          styles need !important to be overridden.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>
[style*="opacity:0"], [style*="opacity: 0"] {
  opacity: 1 !important;
  transform: none !important;
}
</style>`,
          }}
        />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-on-accent"
          >
            Skip to content
          </a>
          <Cursor />
          <ViewGuard />
          {children}
        </ThemeProvider>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.analytics.ga4}');`}
        </Script>
        {/*
          Microsoft Clarity. The queue stub must exist as a *function* before
          the remote tag runs, otherwise the tag throws and never loads
          clarity.js at all. Declaring the stub and the tag as two ordered
          scripts is what makes that reliable here; the official one-liner
          snippet raced and left window.clarity as an object.
        */}
        <Script id="clarity-stub" strategy="afterInteractive">
          {`window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments) };`}
        </Script>
        <Script
          id="clarity-tag"
          src={`https://www.clarity.ms/tag/${site.analytics.clarity}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
