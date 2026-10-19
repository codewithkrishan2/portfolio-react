/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static HTML export. This is the core SEO fix: every page ships
  // real, crawler-visible markup instead of an empty root div.
  output: 'export',

  // `next/image` optimisation requires a server, which a static export has
  // none of. Images are pre-optimised at build time instead — see
  // scripts/optimize-images.mjs — and still carry width/height so there is
  // no layout shift.
  images: {
    unoptimized: true,
  },

  // Netlify serves /about/ style paths more predictably with trailing slashes.
  trailingSlash: true,

  reactStrictMode: true,
}

export default nextConfig
