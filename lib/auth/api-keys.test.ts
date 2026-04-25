import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeApiKeyMetadataList, normalizeCreateApiKeyResponse } from './api-keys.ts';

test('normalizeApiKeyMetadataList supports direct arrays and keeps newest first', () => {
  const normalized = normalizeApiKeyMetadataList([
    {
      id: 'older',
      prefix: 'iruka_old',
      label: 'Old key',
      created_at: '2026-01-01T00:00:00.000Z',
      last_used_at: null,
      revoked_at: null,
    },
    {
      id: 'newer',
      key_prefix: 'iruka_new',
      name: 'New key',
      created_at: '2026-02-01T00:00:00.000Z',
      last_used_at: '2026-02-10T00:00:00.000Z',
      revoked_at: null,
    },
  ]);

  assert.equal(normalized.length, 2);
  assert.equal(normalized[0]?.id, 'newer');
  assert.equal(normalized[0]?.prefix, 'iruka_new');
  assert.equal(normalized[0]?.label, 'New key');
  assert.equal(normalized[1]?.id, 'older');
});

test('normalizeApiKeyMetadataList supports wrapped payloads and filters invalid rows', () => {
  const normalized = normalizeApiKeyMetadataList({
    api_keys: [
      {
        id: 'valid',
        prefix: 'iruka_valid',
        created_at: '2026-02-01T00:00:00.000Z',
        last_used_at: null,
        revoked_at: null,
      },
      {
        prefix: 'missing_id',
      },
    ],
  });

  assert.equal(normalized.length, 1);
  assert.equal(normalized[0]?.id, 'valid');
});

test('normalizeCreateApiKeyResponse accepts backend create payload shape', () => {
  const response = normalizeCreateApiKeyResponse({
    api_key: 'iruka_live_secret',
    api_key_id: 'key_1',
    name: 'Primary key',
    created_at: '2026-03-01T00:00:00.000Z',
  });

  assert.deepEqual(response, {
    api_key: 'iruka_live_secret',
    metadata: {
      id: 'key_1',
      label: 'Primary key',
      prefix: 'key_1',
      created_at: '2026-03-01T00:00:00.000Z',
      last_used_at: null,
      revoked_at: null,
    },
  });
});

test('normalizeCreateApiKeyResponse accepts nested metadata payload shape', () => {
  const response = normalizeCreateApiKeyResponse({
    api_key: 'iruka_live_secret',
    metadata: {
      id: 'key_2',
      prefix: 'iruka_live',
      label: 'Nested key',
      created_at: '2026-04-01T00:00:00.000Z',
      last_used_at: null,
      revoked_at: null,
    },
  });

  assert.deepEqual(response, {
    api_key: 'iruka_live_secret',
    metadata: {
      id: 'key_2',
      label: 'Nested key',
      prefix: 'iruka_live',
      created_at: '2026-04-01T00:00:00.000Z',
      last_used_at: null,
      revoked_at: null,
    },
  });
});
