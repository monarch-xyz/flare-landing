'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { RiCloseLine, RiQuestionLine, RiTelegram2Line } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { telegramBotLabel } from '@/lib/telegram/config';
import { buildTelegramStartPath } from '@/lib/telegram/setup-flow';

interface TelegramSetupGuideProps {
  triggerLabel?: string;
  triggerVariant?: 'primary' | 'secondary' | 'ghost';
  triggerSize?: 'sm' | 'md' | 'lg';
  className?: string;
  returnTo?: string | null;
}

const guideSteps = [
  {
    title: `Start from ${telegramBotLabel}`,
    body: 'Use the Open button here so Iruka can create a one-time challenge code.',
  },
  {
    title: 'Complete /start in Telegram',
    body: 'Telegram receives the command from the deep link. Send it to finish verification.',
  },
  {
    title: 'Return to this console',
    body: 'Refresh this page if needed. Telegram status updates after verification.',
  },
];

export function TelegramSetupGuide({
  triggerLabel = 'Telegram setup guide',
  triggerVariant = 'ghost',
  triggerSize = 'sm',
  className,
  returnTo,
}: TelegramSetupGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const openTelegramHref = buildTelegramStartPath(returnTo);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Button type="button" variant={triggerVariant} size={triggerSize} className={className} onClick={() => setIsOpen(true)}>
        <RiQuestionLine className="h-4 w-4" />
        {triggerLabel}
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="ui-panel w-full max-w-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-7">
              <div className="min-w-0">
                <p className="ui-stat-label">Telegram onboarding</p>
                <h2 id={titleId} className="mt-3 font-display text-[1.9rem] leading-none text-foreground">
                  Connect Telegram
                </h2>
              </div>

              <Button type="button" variant="ghost" size="sm" className="shrink-0" onClick={() => setIsOpen(false)}>
                <RiCloseLine className="h-4 w-4" />
                Close
              </Button>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-7">
              <div className="grid gap-3">
                {guideSteps.map((step, index) => (
                  <div key={step.title} className="ui-panel-ghost flex gap-4 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-telegram)_10%,var(--surface-inset))] text-sm text-[color:var(--signal-telegram)]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ui-panel-ghost p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-telegram)_10%,var(--surface-inset))] text-[color:var(--signal-telegram)]">
                    <RiTelegram2Line className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground">If the link fails</p>
                    <p className="mt-1 text-sm leading-relaxed text-secondary">
                      Open setup from this page again to generate a fresh challenge code and deep link.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-border/80 pt-5">
                <Link href={openTelegramHref} className="no-underline">
                  <Button type="button" className="gap-2" onClick={() => setIsOpen(false)}>
                    Open {telegramBotLabel}
                    <RiTelegram2Line className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
