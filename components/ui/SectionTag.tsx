'use client';

import { cn } from '@/lib/utils';

interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTag({ children, className }: SectionTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium',
        'bg-[#ff6b35]/10 text-[#ff6b35] rounded-full',
        'dark:bg-[#ff6b35]/20',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse" />
      {children}
    </span>
  );
}
