import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeBillingCheckoutSession } from './checkout.ts';

test('normalizeBillingCheckoutSession accepts backend checkout payload', () => {
  const session = normalizeBillingCheckoutSession({
    checkout_id: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'daimo',
    session_id: 'dp_session_123',
    status: 'requires_payment_method',
    expires_at: '2026-05-05T12:00:00.000Z',
    client_secret: 'dp_client_secret',
  });

  assert.deepEqual(session, {
    checkoutId: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'daimo',
    sessionId: 'dp_session_123',
    status: 'requires_payment_method',
    expiresAt: '2026-05-05T12:00:00.000Z',
    clientSecret: 'dp_client_secret',
  });
});

test('normalizeBillingCheckoutSession rejects unusable checkout payloads', () => {
  assert.equal(normalizeBillingCheckoutSession({ provider: 'daimo', session_id: 'dp_session_123' }), null);
  assert.equal(
    normalizeBillingCheckoutSession({
      checkout_id: 'checkout_1',
      provider: 'stripe',
      session_id: 'dp_session_123',
      client_secret: 'secret',
    }),
    null,
  );
});
