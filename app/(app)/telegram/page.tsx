import Link from 'next/link';
import { TelegramConnectPanel } from '@/components/app/TelegramConnectPanel';
import { TelegramSetupGuide } from '@/components/app/TelegramSetupGuide';
import { Button } from '@/components/ui/Button';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { telegramBotLabel, telegramBotUrl } from '@/lib/telegram/config';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';

export default async function TelegramPage() {
  const user = await getAuthenticatedUser();
  const telegramStatus = user ? await getTelegramLinkStatus(user) : { linked: false, linkedAt: null };

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Telegram</p>
          <h1 className="mt-3 font-zen text-3xl sm:text-4xl">Telegram settings</h1>
          <p className="mt-3 text-secondary">
            {telegramStatus.linked ? 'Telegram is linked for this account.' : 'Link Telegram once to receive alerts.'}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center rounded-sm border px-3 py-1.5 text-sm ${
              telegramStatus.linked
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700'
                : 'border-border bg-background text-secondary'
            }`}
          >
            {telegramStatus.linked ? 'Telegram connected' : 'Not connected yet'}
          </div>
          {!telegramStatus.linked ? (
            <a href={telegramBotUrl} target="_blank" rel="noreferrer" className="no-underline">
              <Button size="lg">Open {telegramBotLabel}</Button>
            </a>
          ) : null}
          <Link href="/signals/new" className="no-underline">
            <Button size="lg" variant="secondary">
              Create signal
            </Button>
          </Link>
          {!telegramStatus.linked ? (
            <TelegramSetupGuide triggerLabel="Need help" triggerVariant="ghost" triggerSize="lg" />
          ) : null}
        </div>
      </section>

      <TelegramConnectPanel initialStatus={telegramStatus} />
    </div>
  );
}
