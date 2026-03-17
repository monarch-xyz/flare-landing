import { SignalBuilderForm } from '@/components/app/SignalBuilderForm';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { SIGNAL_TEMPLATE_PRESETS, type SignalTemplateId } from '@/lib/signals/templates';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';

interface NewSignalPageProps {
  searchParams?: Promise<{ preset?: string }> | { preset?: string };
}

export default async function NewSignalPage({ searchParams }: NewSignalPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const presetParam = resolvedSearchParams?.preset;
  const user = await getAuthenticatedUser();
  const telegramStatus = user ? await getTelegramLinkStatus(user) : { linked: false, linkedAt: null };
  const hasPreset = (value: string): value is SignalTemplateId =>
    SIGNAL_TEMPLATE_PRESETS.some((preset) => preset.id === value);
  const initialPreset =
    typeof presetParam === 'string' && hasPreset(presetParam) ? presetParam : undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Create</p>
        <h1 className="font-zen text-3xl sm:text-4xl">New whale signal</h1>
        <p className="text-secondary mt-2 max-w-2xl">
          Start with a Morpho whale movement template, paste the supplier wallets you care about, and let Sentinel register the full JSON definition for you.
        </p>
        <p className="mt-3 text-sm text-secondary">
          {telegramStatus.linked ? 'Telegram is connected.' : 'Telegram can be connected later in settings.'}
        </p>
      </div>

      <SignalBuilderForm initialPreset={initialPreset} />
    </div>
  );
}
