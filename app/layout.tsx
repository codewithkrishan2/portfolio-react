import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'
import { site } from '@/lib/site'
import { graph, personSchema, websiteSchema } from '@/lib/schema'
import JsonLd from '@/components/JsonLd'
import ThemeProvider from '@/components/ThemeProvider'
import Cursor from '@/components/Cursor'
import ViewGuard from '@/components/ViewGuard'

/*
  Fonts are committed to the repo and loaded locally rather than through
  next/font/google.

  next/font/google fetches from fonts.googleapis.com during `next build`, which
  makes the build fail without network access and puts a third party on the
  critical path of every deploy. These are the same variable-font latin subsets
  Google serves, so the rendered result is identical — just without the
  build-time dependency.

  Both files are variable fonts, hence a weight range rather than a list.
  The latin subset covers U+0000-00FF, so accented characters such as the
  e-acute in "resume" still render.
*/
const dmSans = localFont({
  src: './fonts/DMSans-Variable-latin.woff2',
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-dm-sans',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

// Script face for the hero signature.
const dancingScript = localFont({
  src: './fonts/DancingScript-Variable-latin.woff2',
  weight: '600 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-dancing-script',
  fallback: ['ui-serif', 'cursive'],
})

const pageTitle = `${site.name} — ${site.title}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  /*
    Google ignores the keywords meta tag for ranking. Kept deliberately short
    and honest anyway: Bing and several smaller engines still read it, and it
    costs nothing. The real targeting lives in the title, description, headings
    and body copy.
  */
  keywords: [
    site.name,
    site.handle,
    'Krishan Kant',
    'Full Stack Developer Pune',
    'Software Development Engineer Pune',
    'Java Spring Boot Developer',
    'Node.js Backend Developer',
    'React Developer India',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'profile',
    url: site.url,
    siteName: site.name,
    title: pageTitle,
    description: site.description,
    locale: 'en_IN',
    // Helps the handle resolve to this person on platforms that read OG profile.
    firstName: 'Krishan Kant',
    lastName: 'Singh Gautam',
    username: site.handle,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dancingScript.variable}`}
    >
      <head>
        {/*
          Person and WebSite live in the root layout so every page carries the
          identity graph; page-specific nodes (ProfilePage, BlogPosting,
          SoftwareSourceCode) are added by the routes and cross-reference these
          by @id.
        */}
        <JsonLd json={graph(personSchema(), websiteSchema())} />
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
