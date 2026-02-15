'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiGithubFill, RiDiscordFill, RiBookLine, RiMenuLine, RiCloseLine, RiMoonLine, RiSunLine, RiRocketLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    if (isDark !== darkMode) {
      setDarkMode(isDark);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { href: 'https://github.com/monarch-xyz/sentinel/blob/main/docs/ARCHITECTURE.md', label: 'Docs', icon: RiBookLine, external: true },
    { href: 'https://github.com/monarch-xyz/sentinel', label: 'GitHub', icon: RiGithubFill, external: true },
    { href: 'https://discord.gg/monarch', label: 'Discord', icon: RiDiscordFill, external: true },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🔥</span>
            <span className="font-zen text-xl font-bold text-foreground">Sentinel</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors no-underline"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
            
            {/* Get Started CTA */}
            <a
              href="#onboarding"
              className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity no-underline"
            >
              <RiRocketLine className="w-4 h-4" />
              Get Started
            </a>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-hovered transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <RiSunLine className="w-5 h-5" /> : <RiMoonLine className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-hovered transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <RiSunLine className="w-5 h-5" /> : <RiMoonLine className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-hovered transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenuLine className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {/* Get Started - prominent on mobile */}
              <a
                href="#onboarding"
                className="flex items-center gap-3 px-4 py-3 bg-[#ff6b35] text-white rounded-md no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RiRocketLine className="w-5 h-5" />
                <span className="font-medium">Get Started</span>
              </a>
              
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-hovered transition-colors no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5 text-secondary" />
                  <span className="text-foreground">{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
