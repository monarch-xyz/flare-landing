import { createApiClient } from '@/lib/api/client';
import {
  BillingCheckoutSession,
  BillingPlanKey,
  BillingProvider,
  X402PaymentPayload,
  normalizeBillingCheckoutSession,
} from '@/lib/billing/checkout';

const client = createApiClient({ baseUrl: '' });

export async function createBillingCheckoutSession(
  planKey: BillingPlanKey,
  provider?: BillingProvider,
): Promise<BillingCheckoutSession> {
  const requestBody = provider ? { plan_key: planKey, provider } : { plan_key: planKey };
  const payload = await client.post<unknown, { plan_key: BillingPlanKey; provider?: BillingProvider }>(
    '/api/iruka/billing/checkout-sessions',
    requestBody,
  );
  const session = normalizeBillingCheckoutSession(payload);
  if (!session) {
    throw new Error('Iruka returned an invalid checkout session');
  }
  return session;
}

export async function finalizeBillingCheckoutSession(input: {
  checkoutId: string;
  sessionId: string;
  paymentPayload: X402PaymentPayload;
}): Promise<BillingCheckoutSession> {
  const payload = await client.post<unknown, { provider: 'x402'; session_id: string; payment_payload: X402PaymentPayload }>(
    `/api/iruka/billing/checkout-sessions/${input.checkoutId}/finalize`,
    {
      provider: 'x402',
      session_id: input.sessionId,
      payment_payload: input.paymentPayload,
    },
  );
  const session = normalizeBillingCheckoutSession(payload);
  if (!session) {
    throw new Error('Iruka returned an invalid checkout result');
  }
  return session;
}
