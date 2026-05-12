export type BillingPlanKey = 'pro_monthly';
export type BillingProvider = 'x402' | 'mpp';

const BILLING_PROVIDERS = new Set<BillingProvider>(['x402', 'mpp']);

export interface BillingCheckoutSession {
  checkoutId: string;
  provider: BillingProvider;
  sessionId: string;
  status: string;
  expiresAt: string | null;
  clientSecret: string | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const optionalStringOrNull = (value: unknown) =>
  typeof value === 'string' || value === null || value === undefined;

export function normalizeBillingCheckoutSession(payload: unknown): BillingCheckoutSession | null {
  if (!isRecord(payload)) {
    return null;
  }

  const { checkout_id, provider, session_id, status, expires_at, client_secret } = payload;
  if (
    typeof checkout_id !== 'string' ||
    typeof provider !== 'string' ||
    !BILLING_PROVIDERS.has(provider as BillingProvider) ||
    typeof session_id !== 'string' ||
    typeof status !== 'string' ||
    !optionalStringOrNull(expires_at) ||
    !optionalStringOrNull(client_secret)
  ) {
    return null;
  }

  return {
    checkoutId: checkout_id,
    provider: provider as BillingProvider,
    sessionId: session_id,
    status,
    expiresAt: typeof expires_at === 'string' ? expires_at : null,
    clientSecret: typeof client_secret === 'string' ? client_secret : null,
  };
}
