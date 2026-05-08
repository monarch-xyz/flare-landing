export type BillingPlanKey = 'pro_monthly';
export type BillingProvider = 'daimo';

export interface BillingCheckoutSession {
  checkoutId: string;
  provider: BillingProvider;
  sessionId: string;
  status: string;
  expiresAt: string | null;
  clientSecret: string;
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
    provider !== 'daimo' ||
    typeof session_id !== 'string' ||
    typeof status !== 'string' ||
    !optionalStringOrNull(expires_at) ||
    typeof client_secret !== 'string'
  ) {
    return null;
  }

  return {
    checkoutId: checkout_id,
    provider,
    sessionId: session_id,
    status,
    expiresAt: expires_at ?? null,
    clientSecret: client_secret,
  };
}
