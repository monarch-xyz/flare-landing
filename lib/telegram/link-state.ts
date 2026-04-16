import 'server-only';

import type { TelegramStatusResponse } from '@/lib/auth/types';
import { fetchMegabat } from '@/lib/megabat/server';

export interface TelegramLinkStatus {
  linked: boolean;
  linkedAt: string | null;
  appUserId: string | null;
  telegramUsername: string | null;
}

export const getTelegramLinkStatus = async (): Promise<TelegramLinkStatus> => {
  const response = await fetchMegabat('/me/integrations/telegram');
  if (!response.ok) {
    throw new Error(`Telegram status request failed (${response.status})`);
  }

  const payload = (await response.json()) as TelegramStatusResponse;

  return {
    linked: payload.linked,
    linkedAt: payload.linked_at ?? null,
    appUserId: payload.app_user_id ?? null,
    telegramUsername: payload.telegram_username ?? null,
  };
};
