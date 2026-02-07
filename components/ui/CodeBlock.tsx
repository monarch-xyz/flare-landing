'use client';

import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'json', className }: CodeBlockProps) {
  return (
    <div className={cn('relative group', className)}>
      {language && (
        <span className="absolute top-2 right-3 text-xs text-secondary opacity-60">
          {language}
        </span>
      )}
      <pre className="overflow-x-auto custom-scrollbar text-sm leading-relaxed">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  );
}
