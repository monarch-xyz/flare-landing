'use client';

import { useMemo, useState } from 'react';
import { RiFileCopyLine, RiKey2Line } from 'react-icons/ri';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api/api-keys';
import type { ApiKeyMetadata } from '@/lib/auth/types';

interface ApiKeysPanelProps {
  initialApiKeys: ApiKeyMetadata[];
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleString();
};

const sortApiKeys = (keys: ApiKeyMetadata[]) =>
  [...keys].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());

export function ApiKeysPanel({ initialApiKeys }: ApiKeysPanelProps) {
  const [apiKeys, setApiKeys] = useState<ApiKeyMetadata[]>(initialApiKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const orderedKeys = useMemo(() => sortApiKeys(apiKeys), [apiKeys]);

  const refreshApiKeys = async () => {
    setIsRefreshing(true);
    try {
      const next = await listApiKeys();
      setApiKeys(next);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreate = async () => {
    if (isCreating) {
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      const created = await createApiKey();
      setCreatedApiKey(created.api_key);
      setApiKeys((current) => sortApiKeys([created.metadata, ...current.filter((item) => item.id !== created.metadata.id)]));
      await refreshApiKeys();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create API key.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (revokeTargetId) {
      return;
    }

    const confirmed = window.confirm('Revoke this API key? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setError(null);
    setRevokeTargetId(id);

    try {
      await revokeApiKey(id);
      await refreshApiKeys();
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : 'Unable to revoke API key.');
    } finally {
      setRevokeTargetId(null);
    }
  };

  const handleCopy = async () => {
    if (!createdApiKey || isCopying) {
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setError('Clipboard is not available in this browser.');
      return;
    }

    setError(null);
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(createdApiKey);
    } catch {
      setError('Unable to copy API key.');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="space-y-4">
      {createdApiKey ? (
        <Card className="space-y-4">
          <div className="ui-notice" data-tone="info">
            New API key created. This plaintext value is only shown once.
          </div>
          <div className="ui-panel-ghost overflow-x-auto p-3 font-mono text-sm text-foreground">{createdApiKey}</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" size="sm" className="gap-2" onClick={handleCopy} disabled={isCopying}>
              <RiFileCopyLine className="h-4 w-4" />
              {isCopying ? 'Copying...' : 'Copy key'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCreatedApiKey(null)}>
              Dismiss
            </Button>
          </div>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <div className="ui-notice" data-tone="danger">
            {error}
          </div>
        </Card>
      ) : null}

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="ui-kicker">Authentication</div>
            <h2 className="mt-4 font-display text-[1.85rem] leading-none text-foreground">API keys</h2>
            <p className="mt-3 text-sm text-secondary">Use API keys for service-to-service calls. Revoke keys immediately if exposed.</p>
          </div>
          <Button type="button" onClick={handleCreate} disabled={isCreating || isRefreshing} className="gap-2">
            <RiKey2Line className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Create API key'}
          </Button>
        </div>

        {orderedKeys.length === 0 ? (
          <div className="ui-panel-ghost p-4 text-sm text-secondary">No API keys created yet.</div>
        ) : (
          <div className="divide-y divide-border/70">
            {orderedKeys.map((item) => {
              const isRevoked = Boolean(item.revoked_at);
              const isRevoking = revokeTargetId === item.id;

              return (
                <div key={item.id} className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-[minmax(0,1.7fr)_0.9fr_1fr_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="text-foreground">{item.label ?? 'Untitled key'}</p>
                    <p className="mt-1 font-mono text-xs text-secondary">{item.prefix}</p>
                    <p className="mt-2 text-xs text-secondary">Created {formatDateTime(item.created_at)}</p>
                  </div>
                  <div>
                    <p className="ui-stat-label">Status</p>
                    <span className="mt-2 inline-flex">
                      <span className="ui-chip" data-tone={isRevoked ? 'danger' : 'accent'}>
                        {isRevoked ? 'Revoked' : 'Active'}
                      </span>
                    </span>
                  </div>
                  <div>
                    <p className="ui-stat-label">Last Used</p>
                    <p className="mt-2 text-sm text-secondary">{formatDateTime(item.last_used_at)}</p>
                  </div>
                  <div className="sm:justify-self-end">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isRevoked || isRevoking || Boolean(revokeTargetId)}
                      onClick={() => handleRevoke(item.id)}
                    >
                      {isRevoking ? 'Revoking...' : isRevoked ? 'Revoked' : 'Revoke'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
