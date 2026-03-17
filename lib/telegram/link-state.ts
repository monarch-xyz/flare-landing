import 'server-only';

import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getWalletAddressFromUser } from '@/lib/auth/session';

export const TELEGRAM_LINK_COOKIE = 'sentinel_telegram_link';

interface StoredTelegramLinkState {
  identityKey: string;
  linkedAt: string;
}

export interface TelegramLinkStatus {
  linked: boolean;
  linkedAt: string | null;
}

const buildIdentityKey = (user: User) => getWalletAddressFromUser(user) ?? user.id;

const parseTelegramLinkCookie = (rawValue: string): StoredTelegramLinkState | null => {
  try {
    const parsed = JSON.parse(Buffer.from(rawValue, 'base64url').toString('utf8')) as Partial<StoredTelegramLinkState>;
    if (typeof parsed.identityKey !== 'string' || typeof parsed.linkedAt !== 'string') {
      return null;
    }

    return {
      identityKey: parsed.identityKey,
      linkedAt: parsed.linkedAt,
    };
  } catch {
    return null;
  }
};

export const buildTelegramLinkCookieValue = (user: User, linkedAt = new Date().toISOString()) =>
  Buffer.from(
    JSON.stringify({
      identityKey: buildIdentityKey(user),
      linkedAt,
    }),
    'utf8'
  ).toString('base64url');

export const getTelegramLinkCookieOptions = (maxAge = 60 * 60 * 24 * 365) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});

export const getTelegramLinkStatus = async (user: User): Promise<TelegramLinkStatus> => {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(TELEGRAM_LINK_COOKIE)?.value;
  if (!rawValue) {
    return {
      linked: false,
      linkedAt: null,
    };
  }

  const parsed = parseTelegramLinkCookie(rawValue);
  if (!parsed || parsed.identityKey !== buildIdentityKey(user)) {
    return {
      linked: false,
      linkedAt: null,
    };
  }

  return {
    linked: true,
    linkedAt: parsed.linkedAt,
  };
};
