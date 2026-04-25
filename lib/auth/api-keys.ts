import type { ApiKeyMetadata, CreateApiKeyResponse } from '@/lib/auth/types';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const asString = (value: unknown): string | null => (typeof value === 'string' && value.length > 0 ? value : null);

const pickString = (record: Record<string, unknown>, keys: string[]): string | null => {
  for (const key of keys) {
    const value = asString(record[key]);
    if (value) {
      return value;
    }
  }

  return null;
};

const normalizeApiKeyMetadata = (value: unknown): ApiKeyMetadata | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const id = pickString(record, ['id', 'api_key_id']);
  if (!id) {
    return null;
  }

  const isActive = record.is_active === false ? false : true;
  const revokedAt = pickString(record, ['revoked_at']) ?? (isActive ? null : pickString(record, ['updated_at']) ?? 'revoked');

  return {
    id,
    label: pickString(record, ['label', 'name']),
    prefix: pickString(record, ['prefix', 'key_prefix']) ?? id,
    created_at: pickString(record, ['created_at']) ?? new Date(0).toISOString(),
    last_used_at: pickString(record, ['last_used_at']),
    revoked_at: revokedAt,
  };
};

const getMetadataCollection = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  const keys = ['api_keys', 'items', 'data'];
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

export const normalizeApiKeyMetadataList = (payload: unknown): ApiKeyMetadata[] => {
  const collection = getMetadataCollection(payload)
    .map((value) => normalizeApiKeyMetadata(value))
    .filter((value): value is ApiKeyMetadata => Boolean(value));

  return collection.sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
};

export const normalizeCreateApiKeyResponse = (payload: unknown): CreateApiKeyResponse | null => {
  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const apiKey = pickString(record, ['api_key', 'key', 'token']);
  if (!apiKey) {
    return null;
  }

  const metadata = normalizeApiKeyMetadata(record.metadata) ?? normalizeApiKeyMetadata(record);
  if (!metadata) {
    return null;
  }

  return {
    api_key: apiKey,
    metadata,
  };
};
