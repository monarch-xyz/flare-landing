import Link from 'next/link';
import { RiAddLine } from 'react-icons/ri';
import { SignalRow } from '@/components/app/SignalRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { requestMegabat, MegabatRequestError } from '@/lib/megabat/user-server';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { buildTemplateEntryPath } from '@/lib/telegram/setup-flow';
import type { SignalRecord } from '@/lib/types/signal';

const byUpdatedAtDesc = (left: SignalRecord, right: SignalRecord) =>
  new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();

export default async function SignalsPage() {
  const user = await getAuthenticatedUser();
  let signals: SignalRecord[] = [];
  let signalsError: { message: string; status?: number } | null = null;

  if (user) {
    try {
      signals = await requestMegabat<SignalRecord[]>('/signals');
    } catch (error) {
      signalsError =
        error instanceof MegabatRequestError
          ? { message: error.message, status: error.status }
          : { message: error instanceof Error ? error.message : 'Unable to load signals.' };
    }
  }

  const orderedSignals = [...signals].sort(byUpdatedAtDesc);
  const hasSignals = orderedSignals.length > 0;
  const telegramStatus = user
    ? await getTelegramLinkStatus()
    : { linked: false, linkedAt: null, appUserId: null, telegramUsername: null };
  const createSignalHref = buildTemplateEntryPath(telegramStatus.linked);
  const createSignalLabel = hasSignals
    ? telegramStatus.linked
      ? 'Add new signal'
      : 'Set up Telegram'
    : telegramStatus.linked
      ? 'Create first signal'
      : 'Set up Telegram';
  const description = hasSignals
    ? telegramStatus.linked
      ? 'Review the signals you already run and add a new one when needed.'
      : 'Review the signals you already run. Finish Telegram setup before adding another.'
    : telegramStatus.linked
      ? 'You do not have any signals yet. Create one first, then this page becomes the inventory.'
      : 'Connect Telegram first, then return here to start your first signal template.';

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Signals</p>
          <h1 className="mt-3 font-zen text-3xl sm:text-4xl">Signal workspace</h1>
          <p className="mt-3 text-secondary">{description}</p>
        </div>

        <div className="mt-6">
          <Link href={createSignalHref} className="no-underline">
            <Button size="lg" className="gap-2">
              <RiAddLine className="h-5 w-5" />
              {createSignalLabel}
            </Button>
          </Link>
        </div>
      </section>

      {signalsError ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <p className="text-foreground">Signal inventory is unavailable.</p>
          <p className="mt-2 text-sm text-secondary">{signalsError.message}</p>
        </Card>
      ) : hasSignals ? (
        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Inventory</p>
            <h2 className="mt-2 font-zen text-2xl">Registered signals</h2>
          </div>
          <div className="divide-y divide-border/70">
            {orderedSignals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="rounded-[16px] border-dashed text-center">
          <p className="font-zen text-2xl text-foreground">{telegramStatus.linked ? 'No signals yet' : 'Telegram required first'}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-secondary">
            {telegramStatus.linked
              ? 'Create a signal first. Template choices and configuration live in the builder, not on this inventory page.'
              : 'Connect Telegram first, then return here to choose a template and create your first signal.'}
          </p>
          <div className="mt-6">
            <Link href={createSignalHref} className="no-underline">
              <Button>{telegramStatus.linked ? 'Create first signal' : 'Set up Telegram'}</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
