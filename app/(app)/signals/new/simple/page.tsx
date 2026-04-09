import { redirect } from 'next/navigation';
import { MorphoSimpleSignalBuilder } from '@/components/app/MorphoSimpleSignalBuilder';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { buildTelegramPath, SIMPLE_TEMPLATE_PATH } from '@/lib/telegram/setup-flow';

export default async function SimpleSignalPage() {
  const user = await getAuthenticatedUser();
  const telegramStatus = user
    ? await getTelegramLinkStatus()
    : { linked: false, linkedAt: null, appUserId: null, telegramUsername: null };

  if (!telegramStatus.linked) {
    redirect(
      buildTelegramPath({
        status: 'required',
        returnTo: SIMPLE_TEMPLATE_PATH,
      })
    );
  }

  return <MorphoSimpleSignalBuilder />;
}
