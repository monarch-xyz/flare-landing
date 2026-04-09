import { redirect } from 'next/navigation';
import { SignalBuilderForm } from '@/components/app/SignalBuilderForm';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { SIGNAL_TEMPLATE_PRESETS, type SignalTemplateId } from '@/lib/signals/templates';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { buildTelegramPath, buildTemplatePath } from '@/lib/telegram/setup-flow';

interface AdvancedSignalPageProps {
  searchParams?: Promise<{ preset?: string }> | { preset?: string };
}

export default async function AdvancedSignalPage({ searchParams }: AdvancedSignalPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const presetParam = resolvedSearchParams?.preset;
  const user = await getAuthenticatedUser();
  const telegramStatus = user
    ? await getTelegramLinkStatus()
    : { linked: false, linkedAt: null, appUserId: null, telegramUsername: null };
  const hasPreset = (value: string): value is SignalTemplateId =>
    SIGNAL_TEMPLATE_PRESETS.some((preset) => preset.id === value);
  const initialPreset =
    typeof presetParam === 'string' && hasPreset(presetParam) ? presetParam : undefined;
  const templatePath = buildTemplatePath(initialPreset);

  if (!telegramStatus.linked) {
    redirect(
      buildTelegramPath({
        status: 'required',
        returnTo: templatePath,
      })
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Advanced</p>
        <h1 className="font-zen text-3xl sm:text-4xl">Manual signal templates</h1>
        <p className="text-secondary mt-2 max-w-2xl">
          Choose a template, fill in the market, vault, or address inputs yourself, and let Sentinel register the full JSON definition for you.
        </p>
      </div>

      <SignalBuilderForm initialPreset={initialPreset} telegramLinked={telegramStatus.linked} />
    </div>
  );
}
