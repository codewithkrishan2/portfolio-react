/**
 * Renders a JSON-LD block.
 *
 * Server component, so the script is present in the static HTML rather than
 * injected after hydration — which matters because the crawlers that read
 * structured data do not all execute JavaScript.
 */
export default function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // Build-time constant assembled in lib/schema.ts. No user input reaches it.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
