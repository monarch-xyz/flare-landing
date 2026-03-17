'use client';

import { useEffect, useId, useState } from 'react';
import { RiCloseLine, RiQuestionLine, RiTelegram2Line } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { telegramBotLabel, telegramBotUrl } from '@/lib/telegram/config';

interface TelegramSetupGuideProps {
  triggerLabel?: string;
  triggerVariant?: 'primary' | 'secondary' | 'ghost';
  triggerSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const guideSteps = [
  {
    title: `Open ${telegramBotLabel}`,
    body: 'This is the only bot you need to message.',
  },
  {
    title: 'Send /start',
    body: 'The bot returns a one-time pairing code.',
  },
  {
    title: 'Paste the code here',
    body: 'Once connected, Telegram will show as ready for this account.',
  },
];

export function TelegramSetupGuide({
  triggerLabel = 'Telegram setup guide',
  triggerVariant = 'ghost',
  triggerSize = 'sm',
  className,
}: TelegramSetupGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

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
            className="w-full max-w-2xl rounded-[16px] border border-border bg-background shadow-2xl shadow-slate-950/20"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/80 px-6 py-5 sm:px-7">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary">Telegram onboarding</p>
                <h2 id={titleId} className="mt-2 font-zen text-2xl text-foreground">
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
                  <div key={step.title} className="flex gap-4 rounded-md border border-border/80 bg-surface p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#229ED9]/10 text-sm text-[#229ED9]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border/80 bg-surface p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#229ED9]/10 text-[#229ED9]">
                    <RiTelegram2Line className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground">After setup</p>
                    <p className="mt-1 text-sm leading-relaxed text-secondary">
                      Once the green check appears, you are done unless you want to relink Telegram.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-border/80 pt-5">
                <a href={telegramBotUrl} target="_blank" rel="noreferrer" className="no-underline">
                  <Button type="button" className="gap-2" onClick={() => setIsOpen(false)}>
                    Open {telegramBotLabel}
                    <RiTelegram2Line className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
