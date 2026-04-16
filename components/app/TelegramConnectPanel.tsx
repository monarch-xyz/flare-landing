import Link from 'next/link';
import { RiCheckboxCircleLine, RiSettings3Line, RiTelegram2Line } from 'react-icons/ri';
import { TelegramSetupGuide } from '@/components/app/TelegramSetupGuide';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { telegramBotLabel } from '@/lib/telegram/config';
import { buildTelegramStartPath, DEFAULT_TEMPLATE_PATH } from '@/lib/telegram/setup-flow';

interface TelegramConnectPanelProps {
  initialStatus: {
    linked: boolean;
    linkedAt: string | null;
    telegramUsername: string | null;
  };
  returnTo?: string | null;
}

const formatLinkedAt = (value: string | null) => {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString();
};

export function TelegramConnectPanel({ initialStatus, returnTo }: TelegramConnectPanelProps) {
  const linkedDate = formatLinkedAt(initialStatus.linkedAt);
  const isLinked = initialStatus.linked;
  const openTelegramHref = buildTelegramStartPath(returnTo);
  const isTemplateFlow = Boolean(returnTo?.startsWith(DEFAULT_TEMPLATE_PATH));

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Telegram</p>
          <h2 className="mt-2 font-zen text-2xl">Telegram settings</h2>
          <p className="mt-2 text-sm text-secondary">
            {isLinked
              ? 'Telegram is ready.'
              : isTemplateFlow
                ? 'Open the bot once and finish Telegram before you start building a signal.'
                : 'Open the bot once and Megabat will connect this account when you return.'}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-sm ${
            isLinked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#229ED9]/10 text-[#229ED9]'
          }`}
        >
          {isLinked ? <RiCheckboxCircleLine className="h-5 w-5" /> : <RiSettings3Line className="h-5 w-5" />}
        </div>
      </div>

      {isLinked ? (
        <>
          <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-foreground">Telegram is connected</p>
                <p className="mt-1 text-sm text-secondary">
                  {initialStatus.telegramUsername
                    ? `Connected as @${initialStatus.telegramUsername}${linkedDate ? ` on ${linkedDate}` : ''}.`
                    : linkedDate
                      ? `Connected on ${linkedDate}.`
                      : 'Telegram is ready for alerts.'}
                </p>
              </div>
              <RiCheckboxCircleLine className="mt-0.5 h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={openTelegramHref} className="inline-flex w-fit no-underline">
              <Button type="button" variant="secondary" className="gap-2">
                Open {telegramBotLabel}
                <RiTelegram2Line className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-sm border border-border/80 bg-background/50 p-3 text-sm text-secondary">
            Open {telegramBotLabel}, send <span className="font-mono text-foreground">/start</span>, then tap the connect button in Telegram. If you need to sign in first, Megabat will finish the link when you return.
          </div>

          <Link href={openTelegramHref} className="inline-flex w-fit no-underline">
            <Button type="button" variant="secondary" className="gap-2">
              Open {telegramBotLabel}
              <RiTelegram2Line className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <TelegramSetupGuide triggerLabel="Need help" triggerVariant="ghost" returnTo={returnTo} />
          </div>
        </>
      )}
    </Card>
  );
}
