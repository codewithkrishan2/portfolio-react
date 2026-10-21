import type { PostMeta } from '@/lib/posts'

export const meta: PostMeta = {
  slug: 'portfolio-rebuild-nextjs-seo',
  /**
   * Kept near 60 characters: Google truncates SERP titles around there, and
   * this one renders without the site-name suffix (see the route's
   * generateMetadata) so the whole thing survives.
   */
  title: 'Your React SPA is invisible to LinkedIn',
  /** Longer form, used as the on-page lede rather than in the title tag. */
  headline: 'Your React SPA is invisible to LinkedIn — and probably to half the crawlers too',
  description:
    'A Vite React SPA serves an empty root div. Googlebot copes; link-preview scrapers do not. Notes from rebuilding mine as a static Next.js export.',
  published: '2026-10-21',
  tags: ['Next.js', 'SEO', 'React', 'Static Export', 'Core Web Vitals'],
  readingMinutes: 7,
  published_: true,
}

export default function Body() {
  return (
    <>
      <p>
        My portfolio was a Vite + React single-page app for about three years. It looked fine, it
        worked fine, and every time I shared the link on LinkedIn the preview came back blank. I
        assumed LinkedIn was being flaky. It was not — the problem was mine, and it is worth
        explaining properly because the failure is invisible from inside the browser.
      </p>

      <h2>What a client-rendered SPA actually serves</h2>

      <p>
        A Vite React build produces an <code>index.html</code> whose body is, in full:
      </p>

      <pre>
        <code>{`<body>
  <div id="root"></div>
  <script type="module" src="/assets/index-SSehioEC.js"></script>
</body>`}</code>
      </pre>

      <p>
        Every word of content — my name, my job title, my project descriptions — existed only after
        299 kB of JavaScript downloaded, parsed and executed. In a browser that is imperceptible.
        To anything that reads HTML without running JavaScript, the page is empty.
      </p>

      <p>And a lot of important things read HTML without running JavaScript:</p>

      <ul>
        <li>
          <strong>Link-preview scrapers.</strong> LinkedIn, WhatsApp, Slack, Facebook, Discord and
          X all fetch the raw HTML and parse Open Graph tags. None of them execute JavaScript. This
          is not a grey area or a performance concern — they simply never see your content.
        </li>
        <li>
          <strong>Non-rendering crawlers.</strong> Googlebot does render JavaScript, in a deferred
          second pass. Bing renders less reliably. Smaller engines and most AI crawlers fetch raw
          HTML only.
        </li>
      </ul>

      <p>
        So the practical cost was this: the single highest-value thing I do with my portfolio —
        paste the URL into a LinkedIn message — produced a grey box with a bare name and no
        description. For three years.
      </p>

      <h2>The fix, and why static export rather than SSR</h2>

      <p>
        I moved to Next.js with <code>output: &apos;export&apos;</code>. A full static export, no
        Node server, deployable to the same Netlify site as before.
      </p>

      <pre>
        <code>{`// next.config.mjs
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}`}</code>
      </pre>

      <p>
        A portfolio has no per-request state. Nothing is personalised, nothing needs a session.
        Server-side rendering would buy me nothing and cost me a running server. Static export
        gives the thing that actually matters: the HTML in the response already contains the
        content. The homepage went from 1.4 kB of markup to 95 kB.
      </p>

      <p>
        The one wrinkle worth knowing: <code>output: &apos;export&apos;</code> disables the{' '}
        <code>next/image</code> optimiser, because that needs a server. You either supply a custom
        loader or set <code>unoptimized: true</code> and pre-process images yourself at build time.
        I went with a <code>sharp</code> script, which turned out to matter more than I expected
        (below).
      </p>

      <p>
        Route handlers for <code>sitemap.xml</code> and <code>robots.txt</code> also need an
        explicit opt-in under static export, or the build fails outright:
      </p>

      <pre>
        <code>{`// app/sitemap.ts
export const dynamic = 'force-static'`}</code>
      </pre>

      <h2>The part nobody mentions: images, not JavaScript</h2>

      <p>
        I expected JavaScript to be the performance problem. It was not. Measuring actual first-load
        transfer on the old site:
      </p>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Old site</th>
            <th>After</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Images</td>
            <td>1436 kB</td>
            <td>121 kB</td>
          </tr>
          <tr>
            <td>JavaScript (gzip)</td>
            <td>96.5 kB</td>
            <td>207.9 kB</td>
          </tr>
          <tr>
            <td>Fonts</td>
            <td>61 kB (third-party)</td>
            <td>36 kB (self-hosted)</td>
          </tr>
          <tr>
            <td>HTML (gzip)</td>
            <td>0.8 kB</td>
            <td>17.3 kB</td>
          </tr>
        </tbody>
      </table>

      <p>
        Images were <strong>93% of the payload</strong>. One PNG of me was 805 kB. A React logo was
        191 kB and rendered at 80×80 — roughly 2,400 times more bytes than the display size needed.
        Three project thumbnails were hotlinked straight from Unsplash, putting a third party on my
        critical render path.
      </p>

      <p>
        My JavaScript more than doubled, because the Next.js runtime plus React 19 is simply bigger
        than one Vite bundle. I am not going to pretend otherwise. But total first load still fell
        roughly 75%, from about 1.6 MB to about 390 kB, because the image payload dwarfed
        everything else. If you are optimising a portfolio and reaching for bundle analysis first,
        check your images first instead.
      </p>

      <h2>A bug I would not have found by reading code</h2>

      <p>The old site ran this, every second, for the lifetime of the session:</p>

      <pre>
        <code>{`const detectDevTools = () => {
  const start = new Date().getTime();
  debugger;
  const end = new Date().getTime();

  if (end - start > 100) {
    alert('Developer Tools detected!');
    document.write("Please disable developer tools.");
  }
};
setInterval(detectDevTools, 1000);`}</code>
      </pre>

      <p>
        The intent is a devtools deterrent: a <code>debugger</code> statement pauses only when
        devtools is open, so a large elapsed time implies someone is poking around.
      </p>

      <p>Two problems.</p>

      <p>
        First, <code>document.write()</code> after the document has loaded implicitly calls{' '}
        <code>document.open()</code>, which <strong>wipes the entire document</strong> and replaces
        it with that string. Second, the trigger is wall-clock time, not CPU time. Any thread
        preemption, garbage collection pause or CPU throttling between those two{' '}
        <code>getTime()</code> calls can exceed 100 ms with no devtools involved.
      </p>

      <p>
        Googlebot&apos;s rendering service runs throttled and under contention. If it had ever
        tripped that check, the indexed version of my portfolio would have become a single sentence:
        &ldquo;Please disable developer tools.&rdquo; I cannot prove it ever fired. The point is the
        downside was unbounded and the benefit was zero — the bundle is public either way, and{' '}
        <code>view-source:</code> never stopped working.
      </p>

      <p>
        I kept the right-click and F12 handlers, because I like them, and deleted the{' '}
        <code>document.write</code>, the <code>debugger</code> timing check and the interval.
      </p>

      <h2>Everything else that was quietly wrong</h2>

      <ul>
        <li>
          <strong>Nine <code>h1</code> elements.</strong> A reusable section component rendered one
          and was used twice, and several sections had their own. The only <code>h1</code> in the
          hero said &ldquo;Software Developer&rdquo; — my actual name was an <code>h2</code> above
          it.
        </li>
        <li>
          <strong>Two primary buttons were not links.</strong> I used{' '}
          <code>react-scroll</code>&apos;s <code>Link</code>, which strips its own props and renders
          a bare <code>&lt;a&gt;</code> with no <code>href</code>. An anchor without an href is not
          a link: not crawlable, not keyboard-focusable, no link role.
        </li>
        <li>
          <strong><code>target=&#123;&#123;_blank: true&#125;&#125;</code></strong> — an object
          literal where a string belonged, which React serialised to{' '}
          <code>target=&quot;[object Object]&quot;</code>. My project demo links had silently
          stopped opening in a new tab.
        </li>
        <li>
          <strong>No landmarks at all.</strong> No <code>main</code>, <code>nav</code>,{' '}
          <code>header</code> or <code>footer</code> anywhere.
        </li>
        <li>
          <strong>Twenty-nine images sharing the alt text</strong>{' '}
          <code>&quot;image of the skills&quot;</code>, and the per-item title was already in scope.
        </li>
        <li>
          <strong>A render-blocking Google Fonts request for 22 weight axes</strong> of a font I
          used five weights of.
        </li>
      </ul>

      <p>
        None of these are exotic. They are what accumulates in a side project you stop looking at,
        and nearly all of them are invisible unless you go looking.
      </p>

      <h2>What I would tell myself three years ago</h2>

      <p>
        Open <code>view-source:</code> on your own site. Not devtools — devtools shows you the
        rendered DOM, which is the thing that works. View-source shows you what you actually serve,
        which is what every scraper and half the crawlers get. If your name is not in there, your
        link previews are blank and you have no idea.
      </p>

      <p>
        Then paste your URL into a LinkedIn message box and look at the card. That one test would
        have saved me three years of blank previews.
      </p>
    </>
  )
}
