import { AuthError } from '@/lib/auth/types';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export class ApiError extends Error {
  status: number;
  payload?: AuthError | Record<string, unknown>;

  constructor(message: string, status: number, payload?: AuthError | Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => string | null | undefined;
}

const getDefaultBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return 'https://api.sentinel.monarch.xyz';
};

export const createApiClient = (options: ApiClientOptions = {}) => {
  const baseUrl = options.baseUrl ?? getDefaultBaseUrl();

  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const token = options.getToken?.();
    const headers = {
      ...defaultHeaders,
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      let payload: AuthError | Record<string, unknown> | undefined;
      try {
        payload = await response.json();
      } catch {
        payload = undefined;
      }
      throw new ApiError(payload?.message?.toString() || response.statusText, response.status, payload);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  };

  return {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T, B = unknown>(path: string, body: B) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T, B = unknown>(path: string, body: B) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  };
};
