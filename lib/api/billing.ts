import { createApiClient } from '@/lib/api/client';
import {
  BillingCheckoutSession,
  BillingPlanKey,
  BillingProvider,
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
