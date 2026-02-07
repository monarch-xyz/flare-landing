'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg p-6',
        'border border-border',
        'transition-all duration-200',
        'hover:border-[#ff6b35]/30 hover:shadow-lg hover:shadow-[#ff6b35]/5',
        className
      )}
    >
      {children}
    </div>
  );
}
