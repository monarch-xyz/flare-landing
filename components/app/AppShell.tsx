import { ReactNode } from 'react';
import Link from 'next/link';
import { RiLogoutCircleRLine, RiNotification3Line, RiPulseLine } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { href: '/app', label: 'Signals', icon: RiNotification3Line },
  { href: '/app/signals/new', label: 'New Signal', icon: RiPulseLine },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-main">
      <div className="absolute inset-0 bg-line-grid opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        <header className="border-b border-border/80 bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/app" className="flex items-center gap-2 no-underline">
                  <span className="text-xl">🔥</span>
                  <span className="font-zen text-lg text-foreground">Sentinel</span>
                </Link>
                <span className="text-xs text-secondary uppercase tracking-[0.3em] hidden sm:block">Console</span>
              </div>
              <Button variant="secondary" size="sm" className="gap-2">
                <RiLogoutCircleRLine className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            <aside className="bg-surface border border-border rounded-lg p-4 h-fit">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">Navigate</p>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-secondary hover:text-foreground hover:bg-hovered transition-colors no-underline"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
