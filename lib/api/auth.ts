import { createApiClient } from '@/lib/api/client';
import {
  LogoutResponse,
  IrukaAuthenticatedUser,
  SiweNonceResponse,
  SiweVerifyRequest,
  SiweVerifyResponse,
} from '@/lib/auth/types';

const localClient = createApiClient({ baseUrl: '' });

export const requestSiweNonce = () =>
  localClient.post<SiweNonceResponse, Record<string, never>>('/api/auth/siwe/nonce', {});

export const verifySiwe = (payload: SiweVerifyRequest) =>
  localClient.post<SiweVerifyResponse, SiweVerifyRequest>('/api/auth/siwe/verify', payload);

export const getCurrentUser = () => localClient.get<IrukaAuthenticatedUser>('/api/auth/me');

export const logout = () => localClient.post<LogoutResponse, Record<string, never>>('/api/auth/logout', {});
