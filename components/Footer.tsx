'use client';

import { RiArrowRightUpLine, RiBookLine, RiDiscordFill, RiExternalLinkLine, RiGithubFill } from 'react-icons/ri';
import { MEGABAT_DOCS_OVERVIEW_URL, MEGABAT_GITHUB_URL } from '@/lib/megabat-links';

const links = [
  { href: MEGABAT_DOCS_OVERVIEW_URL, label: 'Docs', icon: RiBookLine, external: true },
  { href: MEGABAT_GITHUB_URL, label: 'GitHub', icon: RiGithubFill, external: true },
  { href: 'https://discord.gg/Ur4dwN3aPS', label: 'Discord', icon: RiDiscordFill, external: true },
];

export function Footer() {
  return (
    <footer className="relative pb-10 pt-14">
      <div className="page-gutter">
        <div className="ui-panel px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div className="space-y-4">
              <div className="ui-kicker">Megabat</div>
              <div>
                <h2 className="ui-section-title max-w-xl">A signal layer that helps agents get smarter from open data.</h2>
                <p className="ui-copy mt-4">
                  Define the condition once. Let Megabat keep listening across state, indexed history,
                  and raw events until open data resolves into something your agent can actually use.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-option flex items-center justify-between px-4 py-3 no-underline"
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <link.icon className="h-4 w-4 text-[color:var(--signal-copper)]" />
                    {link.label}
                  </span>
                  <RiArrowRightUpLine className="h-4 w-4 text-[color:var(--ink-muted)]" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-sm text-secondary md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Monarch. Megabat turns open data into agent-ready signal.</p>
            <a
              href="https://monarchlend.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="ui-link inline-flex items-center gap-2 no-underline"
            >
              Built by Monarch
              <RiExternalLinkLine className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
