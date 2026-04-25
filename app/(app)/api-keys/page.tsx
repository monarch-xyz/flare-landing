import { ApiKeysPanel } from '@/components/app/ApiKeysPanel';
import { Card } from '@/components/ui/Card';
import { normalizeApiKeyMetadataList } from '@/lib/auth/api-keys';
import type { ApiKeyMetadata } from '@/lib/auth/types';
import { requestIruka, IrukaRequestError } from '@/lib/iruka/user-server';

export default async function ApiKeysPage() {
  let keys: ApiKeyMetadata[] = [];
  let apiKeysError: string | null = null;

  try {
    const payload = await requestIruka<unknown>('/auth/api-keys');
    keys = normalizeApiKeyMetadataList(payload);
  } catch (error) {
    apiKeysError =
      error instanceof IrukaRequestError
        ? `API key list is unavailable (${error.status}).`
        : error instanceof Error
          ? error.message
          : 'API key list is unavailable.';
  }

  return (
    <div className="space-y-6">
      <section className="ui-hero px-6 py-7 sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-3xl">
          <div className="ui-kicker">Settings</div>
          <h1 className="ui-page-title mt-4">API keys</h1>
          <p className="ui-copy mt-4">Create and revoke API keys for automation clients tied to your signed-in account.</p>
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap gap-3">
          <span className="ui-chip" data-tone="accent">
            {keys.length} key{keys.length === 1 ? '' : 's'}
          </span>
        </div>
      </section>

      {apiKeysError ? (
        <Card>
          <div className="ui-notice" data-tone="danger">
            {apiKeysError}
          </div>
        </Card>
      ) : null}

      <ApiKeysPanel initialApiKeys={keys} />
    </div>
  );
}
