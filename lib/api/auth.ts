import { createApiClient } from '@/lib/api/client';
import {
  AuthSession,
  MagicLinkRequest,
  SiweNonceResponse,
  SiweVerifyRequest,
} from '@/lib/auth/types';

const client = createApiClient();

export const requestMagicLink = (payload: MagicLinkRequest) =>
  client.post<AuthSession, MagicLinkRequest>('/auth/magic-link', payload);

export const requestSiweNonce = () => client.get<SiweNonceResponse>('/auth/siwe/nonce');

export const verifySiwe = (payload: SiweVerifyRequest) =>
  client.post<AuthSession, SiweVerifyRequest>('/auth/siwe/verify', payload);

export const logout = () => client.post<void, Record<string, never>>('/auth/logout', {});
