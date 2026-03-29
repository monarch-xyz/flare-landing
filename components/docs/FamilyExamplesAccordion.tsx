'use client';

import { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { cn } from '@/lib/utils';

interface FamilyExampleItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  code: string;
  language: string;
  filename: string;
}

interface FamilyExamplesAccordionProps {
  items: FamilyExampleItem[];
  defaultOpenId?: string;
}

export function FamilyExamplesAccordion({
  items,
  defaultOpenId,
}: FamilyExamplesAccordionProps) {
  const [openId, setOpenId] = useState<string>(defaultOpenId ?? items[0]?.id ?? '');

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-md border bg-background/60 transition-colors',
              isOpen ? 'border-[#1f2328]' : 'border-border/80'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? '' : item.id)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-secondary">{item.eyebrow}</p>
                <p className="mt-2 text-base text-foreground">{item.title}</p>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{item.description}</p>
              </div>
              <RiArrowRightSLine
                className={cn(
                  'mt-1 h-5 w-5 shrink-0 text-secondary transition-transform',
                  isOpen && 'rotate-90 text-foreground'
                )}
              />
            </button>

            {isOpen ? (
              <div className="border-t border-border/80 px-5 py-5">
                <CodeBlock code={item.code} language={item.language} filename={item.filename} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
