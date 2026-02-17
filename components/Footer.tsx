'use client';

import Link from 'next/link';
import { RiGithubFill, RiDiscordFill, RiBookLine, RiExternalLinkLine } from 'react-icons/ri';

const links = [
  { href: 'https://github.com/monarch-xyz/sentinel/blob/main/docs/ARCHITECTURE.md', label: 'Docs', icon: RiBookLine },
  { href: 'https://github.com/monarch-xyz/sentinel', label: 'GitHub', icon: RiGithubFill },
  { href: 'https://discord.gg/Ur4dwN3aPS', label: 'Discord', icon: RiDiscordFill },
];

export function Footer() {
  return (
    <footer className="relative py-12 border-t border-border">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="text-2xl">🔥</span>
              <span className="font-zen text-xl font-bold text-foreground">Sentinel</span>
            </Link>
            <p className="text-secondary text-sm">Event infrastructure for DeFi agents</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors no-underline"
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm hidden sm:inline">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Built by Monarch */}
          <a
            href="https://monarchlend.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-border hover:border-[#ff6b35]/30 transition-colors no-underline group"
          >
            <span className="text-sm text-secondary group-hover:text-foreground">Built by</span>
            <span className="font-zen font-bold text-[#f45f2d]">Monarch</span>
            <RiExternalLinkLine className="w-4 h-4 text-secondary" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Monarch. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
