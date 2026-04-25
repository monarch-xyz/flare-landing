import Link from 'next/link';
import { RiCheckboxCircleLine, RiSettings3Line, RiTelegram2Line } from 'react-icons/ri';
import { TelegramSetupGuide } from '@/components/app/TelegramSetupGuide';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { telegramBotLabel, telegramBotUrl } from '@/lib/telegram/config';
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
  const setupTelegramHref = buildTelegramStartPath(returnTo);
  const isTemplateFlow = Boolean(returnTo?.startsWith(DEFAULT_TEMPLATE_PATH));

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="ui-kicker">Telegram</div>
          <h2 className="mt-4 font-display text-[1.85rem] leading-none text-foreground">Telegram settings</h2>
          <p className="mt-3 text-sm text-secondary">
            {isLinked
              ? 'Telegram is ready.'
              : isTemplateFlow
                ? 'Create a one-time challenge and finish /start in Telegram before you build a signal.'
                : 'Create a one-time challenge, then complete /start in Telegram to link this account.'}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[0.45rem] border border-border ${
            isLinked
              ? 'bg-[color:color-mix(in_oklch,var(--signal-success)_10%,var(--surface-inset))] text-[color:var(--signal-success)]'
              : 'bg-[color:color-mix(in_oklch,var(--signal-telegram)_10%,var(--surface-inset))] text-[color:var(--signal-telegram)]'
          }`}
        >
          {isLinked ? <RiCheckboxCircleLine className="h-5 w-5" /> : <RiSettings3Line className="h-5 w-5" />}
        </div>
      </div>

      {isLinked ? (
        <>
          <div className="ui-notice" data-tone="success">
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
            <a href={telegramBotUrl} className="inline-flex w-fit no-underline" target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="secondary" className="gap-2">
                Open {telegramBotLabel}
                <RiTelegram2Line className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="ui-panel-ghost p-3 text-sm text-secondary">
            Iruka will create a one-time challenge and open {telegramBotLabel}. Complete <span className="font-mono text-foreground">/start</span>{' '}
            in Telegram to link this account.
          </div>

          <Link href={setupTelegramHref} className="inline-flex w-fit no-underline">
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
