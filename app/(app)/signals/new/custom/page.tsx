import { redirect } from 'next/navigation';
import { CreateFlowHeader } from '@/components/app/CreateFlowHeader';
import { SignalBuilderForm } from '@/components/app/SignalBuilderForm';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { IRUKA_ONE_LINER } from '@/lib/signals/create-flow-catalog';
import { SIGNAL_TEMPLATE_PRESETS, type SignalTemplateId } from '@/lib/signals/templates';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { buildTelegramPath, buildTemplatePath } from '@/lib/telegram/setup-flow';

interface CustomSignalPageProps {
  searchParams?: Promise<{ preset?: string }> | { preset?: string };
}

export default async function CustomSignalPage({ searchParams }: CustomSignalPageProps) {
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
      <CreateFlowHeader
        eyebrow="Custom builder"
        title="Customize your own signal inputs"
        summary={`${IRUKA_ONE_LINER} Enter the exact inputs you want it to watch.`}
      />

      <SignalBuilderForm initialPreset={initialPreset} telegramLinked={telegramStatus.linked} />
    </div>
  );
}
