import type { ApiKeyMetadata, CreateApiKeyResponse } from '@/lib/auth/types';
import { ApiError } from '@/lib/api/client';
import { normalizeApiKeyMetadataList, normalizeCreateApiKeyResponse } from '@/lib/auth/api-keys';

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const toApiError = (status: number, payload: unknown, fallback: string) => {
  const details =
    payload && typeof payload === 'object' && 'details' in payload && typeof payload.details === 'string'
      ? payload.details
      : payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
      : fallback;

  return new ApiError(details, status, (payload as Record<string, unknown> | undefined) ?? undefined);
};

export const listApiKeys = async (): Promise<ApiKeyMetadata[]> => {
  const response = await fetch('/api/iruka/auth/api-keys', {
    method: 'GET',
    cache: 'no-store',
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw toApiError(response.status, payload, 'Unable to load API keys.');
  }

  return normalizeApiKeyMetadataList(payload);
};

export const createApiKey = async (): Promise<CreateApiKeyResponse> => {
  const response = await fetch('/api/iruka/auth/api-keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw toApiError(response.status, payload, 'Unable to create API key.');
  }

  const parsed = normalizeCreateApiKeyResponse(payload);
  if (!parsed) {
    throw new ApiError('API key response was not in the expected format.', 500, {});
  }

  return parsed;
};

export const revokeApiKey = async (id: string): Promise<void> => {
  const response = await fetch(`/api/iruka/auth/api-keys/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw toApiError(response.status, payload, 'Unable to revoke API key.');
  }
};
