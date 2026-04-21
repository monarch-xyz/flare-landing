import 'server-only';

import { cookies } from 'next/headers';
import { getSessionCookie } from '@/lib/auth/constants';
import type { IrukaAuthenticatedUser } from '@/lib/auth/types';
import { fetchIruka } from '@/lib/iruka/server';

export const getWalletAddressFromUser = (user: IrukaAuthenticatedUser): string | null => {
  const walletIdentity = user.identities.find((identity) => identity.provider === 'wallet');
  if (!walletIdentity) {
    return null;
  }

  const metadataAddress = walletIdentity.metadata?.address;
  if (typeof metadataAddress === 'string' && metadataAddress.length > 0) {
    return metadataAddress.toLowerCase();
  }

  return walletIdentity.provider_subject.toLowerCase();
};

export const getAuthenticatedUser = async (): Promise<IrukaAuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = getSessionCookie(cookieStore);
  if (!sessionCookie?.value) {
    return null;
  }

  const response = await fetchIruka('/auth/me');
  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Iruka auth bootstrap failed (${response.status})`);
  }

  return (await response.json()) as IrukaAuthenticatedUser;
};
