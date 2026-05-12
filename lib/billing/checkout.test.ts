import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeBillingCheckoutSession } from './checkout.ts';

test('normalizeBillingCheckoutSession accepts planned x402 checkout payload', () => {
  const session = normalizeBillingCheckoutSession({
    checkout_id: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'x402',
    session_id: 'x402_session_123',
    status: 'requires_payment',
    expires_at: null,
    client_secret: null,
  });

  assert.deepEqual(session, {
    checkoutId: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'x402',
    sessionId: 'x402_session_123',
    status: 'requires_payment',
    expiresAt: null,
    clientSecret: null,
  });
});

test('normalizeBillingCheckoutSession accepts planned MPP checkout payload', () => {
  const session = normalizeBillingCheckoutSession({
    checkout_id: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'mpp',
    session_id: 'mpp_session_123',
    status: 'requires_payment',
    expires_at: '2026-05-05T12:00:00.000Z',
    client_secret: null,
  });

  assert.deepEqual(session, {
    checkoutId: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'mpp',
    sessionId: 'mpp_session_123',
    status: 'requires_payment',
    expiresAt: '2026-05-05T12:00:00.000Z',
    clientSecret: null,
  });
});

test('normalizeBillingCheckoutSession rejects unusable checkout payloads', () => {
  assert.equal(normalizeBillingCheckoutSession({ provider: 'x402', session_id: 'x402_session_123' }), null);
  assert.equal(
    normalizeBillingCheckoutSession({
      checkout_id: 'checkout_1',
      provider: 'paypal',
      session_id: 'paypal_session_123',
      status: 'requires_payment',
      client_secret: 'secret',
    }),
    null,
  );
  assert.equal(
    normalizeBillingCheckoutSession({
      checkout_id: 'checkout_1',
      provider: 'stripe',
      session_id: 'stripe_session_123',
      status: 'requires_payment',
      client_secret: 'secret',
    }),
    null,
  );
});
