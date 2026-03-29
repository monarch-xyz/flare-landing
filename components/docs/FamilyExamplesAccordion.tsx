'use client';

import { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { cn } from '@/lib/utils';

interface FamilyExampleItem {
  id: string;
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
    <div className="mt-3 divide-y divide-border border-y border-border">
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? '' : item.id)}
              className={cn(
                'flex w-full items-start justify-between gap-4 py-4 text-left transition-colors',
                isOpen ? 'text-foreground' : 'text-foreground hover:text-foreground'
              )}
            >
              <div>
                <p className="text-base text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-secondary">{item.description}</p>
              </div>
              <RiArrowRightSLine
                className={cn(
                  'mt-1 h-5 w-5 shrink-0 text-secondary transition-transform',
                  isOpen && 'rotate-90 text-foreground'
                )}
              />
            </button>

            {isOpen ? (
              <div className="pb-4">
                <CodeBlock
                  code={item.code}
                  language={item.language}
                  filename={item.filename}
                  tone="light"
                  showHeader={false}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
