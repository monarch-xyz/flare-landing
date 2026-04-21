export type AuthProvider = 'wallet' | 'email' | 'google';
export type AuthMethod = 'session' | 'api_key';

export interface IrukaIdentity {
  id: string;
  provider: AuthProvider;
  provider_subject: string;
  created_at: string;
  metadata?: Record<string, unknown> | null;
}

export interface IrukaAuthenticatedUser {
  user_id: string;
  name: string | null;
  created_at: string;
  auth_method: AuthMethod;
  api_key_id: string | null;
  session_id: string | null;
  identities: IrukaIdentity[];
}

export interface AuthError {
  error: string;
  message?: string;
  details?: string;
  field?: string;
}

export interface SiweNonceResponse {
  provider: 'wallet';
  nonce: string;
  expires_at: string;
  domain: string;
  uri: string;
}

export interface SiweVerifyRequest {
  message: string;
  signature: string;
  name?: string;
}

export interface SiweVerifyResponse {
  user_id: string;
  session_id: string;
  session_token: string;
  expires_at: string;
  created: boolean;
  auth_method: 'session';
  identity: {
    provider: 'wallet';
    provider_subject: string;
  };
}

export interface LogoutResponse {
  success: boolean;
}

export interface TelegramStatusResponse {
  provider: 'telegram';
  linked: boolean;
  app_user_id: string;
  telegram_username?: string;
  linked_at?: string;
}
