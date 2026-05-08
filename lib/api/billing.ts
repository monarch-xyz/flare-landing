import { createApiClient } from '@/lib/api/client';
import {
  BillingCheckoutSession,
  BillingPlanKey,
  normalizeBillingCheckoutSession,
} from '@/lib/billing/checkout';

const client = createApiClient({ baseUrl: '' });

export async function createBillingCheckoutSession(
  planKey: BillingPlanKey,
): Promise<BillingCheckoutSession> {
  const payload = await client.post<unknown, { plan_key: BillingPlanKey }>(
    '/api/iruka/billing/checkout-sessions',
    { plan_key: planKey },
  );
  const session = normalizeBillingCheckoutSession(payload);
  if (!session) {
    throw new Error('Iruka returned an invalid checkout session');
  }
  return session;
}
