import { navItems, site } from '@/lib/site'
import Social from './Social'

export default function Footer() {
  return (
    <footer className="border-t border-border-sub bg-bg-alt/40">
      <div className="container-page flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-extrabold tracking-tight">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {site.title} based in {site.location}. Building backend systems and the interfaces
              that use them.
            </p>
            <Social className="mt-5" />
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              Sections
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-muted transition hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted transition hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-muted transition hover:text-accent"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-accent"
                >
                  View résumé
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 border-t border-border-sub pt-7 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Made with <span aria-label="love">💖</span> by {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
