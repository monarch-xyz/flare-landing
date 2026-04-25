import Link from 'next/link';
import { TelegramConnectPanel } from '@/components/app/TelegramConnectPanel';
import { TelegramSetupGuide } from '@/components/app/TelegramSetupGuide';
import { Button } from '@/components/ui/Button';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { telegramBotLabel } from '@/lib/telegram/config';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { buildTelegramStartPath, DEFAULT_TEMPLATE_PATH, resolveTelegramReturnTo } from '@/lib/telegram/setup-flow';

interface TelegramPageProps {
  searchParams?: Promise<{ telegram?: string; returnTo?: string }> | { telegram?: string; returnTo?: string };
}

const telegramNotice = (value: string | undefined) => {
  switch (value) {
    case 'required':
      return {
        tone: 'info' as const,
        message: 'Connect Telegram before you open a signal template.',
      };
    case 'challenge-failed':
      return {
        tone: 'danger' as const,
        message: 'Iruka could not create a Telegram challenge right now. Try again in a moment.',
      };
    default:
      return null;
  }
};

export default async function TelegramPage({ searchParams }: TelegramPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const user = await getAuthenticatedUser();
  const telegramStatus = user
    ? await getTelegramLinkStatus()
    : { linked: false, linkedAt: null, appUserId: null, telegramUsername: null };
  const notice = telegramNotice(resolvedSearchParams?.telegram);
  const returnTo = resolveTelegramReturnTo(resolvedSearchParams?.returnTo);
  const openTelegramHref = buildTelegramStartPath(returnTo);
  const continueHref = returnTo ?? DEFAULT_TEMPLATE_PATH;
  const isTemplateFlow = Boolean(returnTo?.startsWith(DEFAULT_TEMPLATE_PATH));
  const heading = telegramStatus.linked
    ? 'Telegram settings'
    : isTemplateFlow
      ? 'Set up Telegram first'
      : 'Telegram settings';
  const description = telegramStatus.linked
    ? isTemplateFlow
      ? 'Telegram is linked. Continue to the signal builder when you are ready.'
      : 'Telegram is linked for this account and ready for managed delivery.'
    : isTemplateFlow
      ? 'Template signals deliver through Telegram. Create a one-time challenge and complete /start in Telegram.'
      : 'Generate a one-time challenge, open the bot, and complete /start in Telegram.';
  const primaryLabel = telegramStatus.linked
    ? isTemplateFlow
      ? 'Continue to signal builder'
      : 'Create signal'
    : `Open ${telegramBotLabel}`;
  const showSecondaryCreateButton = telegramStatus.linked && isTemplateFlow;

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="ui-notice" data-tone={notice.tone}>
          {notice.message}
        </div>
      ) : null}

      <section className="ui-hero px-6 py-7 sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-3xl">
          <div className="ui-kicker">Telegram</div>
          <h1 className="ui-page-title mt-4">{heading}</h1>
          <p className="ui-copy mt-4">{description}</p>
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap items-center gap-3">
          <span className="ui-chip" data-tone={telegramStatus.linked ? 'success' : 'telegram'}>
            {telegramStatus.linked ? 'Telegram connected' : 'Not connected yet'}
          </span>

          {telegramStatus.linked ? (
            <Link href={continueHref} className="no-underline">
              <Button size="lg">{primaryLabel}</Button>
            </Link>
          ) : (
            <Link href={openTelegramHref} className="no-underline">
              <Button size="lg">{primaryLabel}</Button>
            </Link>
          )}

          {showSecondaryCreateButton ? (
            <Link href={DEFAULT_TEMPLATE_PATH} className="no-underline">
              <Button size="lg" variant="secondary">
                Create signal
              </Button>
            </Link>
          ) : (
            <TelegramSetupGuide triggerLabel="Need help" triggerVariant="ghost" triggerSize="lg" returnTo={returnTo} />
          )}
        </div>
      </section>

      <TelegramConnectPanel
        initialStatus={{
          linked: telegramStatus.linked,
          linkedAt: telegramStatus.linkedAt,
          telegramUsername: telegramStatus.telegramUsername,
        }}
        returnTo={returnTo}
      />
    </div>
  );
}
