'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiArrowRightUpLine, RiBookLine, RiDiscordFill, RiGithubFill, RiLoginCircleLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { IRUKA_DOCS_OVERVIEW_URL, IRUKA_GITHUB_URL } from '@/lib/iruka-links';

const navLinks = [
  { href: IRUKA_DOCS_OVERVIEW_URL, label: 'Docs', icon: RiBookLine, external: true },
  { href: IRUKA_GITHUB_URL, label: 'GitHub', icon: RiGithubFill, external: true },
  { href: 'https://discord.gg/Ur4dwN3aPS', label: 'Discord', icon: RiDiscordFill, external: true },
];

function BrandMark() {
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-[0.6rem] border border-border bg-[color:var(--surface-panel)]">
      <span className="absolute inset-[8px] rounded-full border border-[color:color-mix(in_oklch,var(--signal-copper)_36%,transparent)]" />
      <span className="h-2 w-2 rounded-full bg-[color:var(--signal-copper)]" />
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="page-gutter pt-3 md:pt-4">
        <div
          className={cn(
            'relative overflow-hidden rounded-[0.7rem] border px-4 py-3 transition-all duration-300 md:px-5',
            scrolled
              ? 'border-[color:color-mix(in_oklch,var(--stroke-strong)_70%,var(--stroke-soft))] bg-[color:color-mix(in_oklch,var(--surface-panel)_92%,white)] shadow-[0_16px_34px_-24px_rgba(57,42,28,0.16)]'
              : 'border-border bg-[color:color-mix(in_oklch,var(--surface-panel)_78%,white)]'
          )}
        >
          <div className="absolute inset-0 bg-line-grid opacity-20" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <BrandMark />
              <div className="min-w-0">
                <div className="font-display text-[1.45rem] leading-none text-foreground">Iruka</div>
                <div className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-[color:color-mix(in_oklch,var(--ink-primary)_88%,var(--signal-copper))]">
                  Open Data For Smarter Agents
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-link inline-flex items-center gap-2 rounded-[0.55rem] px-3 py-2 text-sm no-underline"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    <RiArrowRightUpLine className="h-3.5 w-3.5 text-[color:var(--ink-muted)]" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="ui-link inline-flex items-center gap-2 rounded-[0.55rem] px-3 py-2 text-sm no-underline"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              )}

              <Link href="/login" className="no-underline">
                <Button size="sm" className="gap-2">
                  <RiLoginCircleLine className="h-4 w-4" />
                  Open Console
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <Link href="/login" className="no-underline">
                <Button size="sm" variant="secondary" className="px-3">
                  <RiLoginCircleLine className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="px-3"
                aria-label="Toggle menu"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                {mobileMenuOpen ? <RiCloseLine className="h-4 w-4" /> : <RiMenuLine className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen ? (
            <nav className="relative mt-4 grid gap-2 border-t border-border pt-4 md:hidden">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-option flex items-center justify-between px-4 py-3 text-sm no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    <RiArrowRightUpLine className="h-4 w-4 text-[color:var(--ink-muted)]" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="ui-option flex items-center justify-between px-4 py-3 text-sm no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </span>
                  </Link>
                )
              )}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
