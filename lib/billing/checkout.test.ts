import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeBillingCheckoutSession } from './checkout.ts';

const paymentRequirements = {
  x402Version: 2,
  resource: {
    url: 'iruka://billing/checkout/550e8400-e29b-41d4-a716-446655440000',
    description: 'Iruka Pro monthly plan',
    mimeType: 'application/json',
  },
  accepts: [
    {
      scheme: 'exact',
      network: 'eip155:8453',
      asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913',
      amount: '10000000',
      payTo: '0xF4cABf9F20426177c2d74bFBB738919C28c2356e',
      maxTimeoutSeconds: 600,
      extra: {
        checkoutId: '550e8400-e29b-41d4-a716-446655440000',
        userId: 'user-1',
        planKey: 'pro_monthly',
        providerSessionId: 'x402_session_123',
      },
    },
  ],
};

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
    x402PaymentRequirements: null,
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
    x402PaymentRequirements: null,
  });
});

test('normalizeBillingCheckoutSession accepts x402 payment requirements envelope', () => {
  const session = normalizeBillingCheckoutSession({
    checkout_id: '550e8400-e29b-41d4-a716-446655440000',
    provider: 'x402',
    session_id: 'x402_session_123',
    status: 'requires_payment',
    expires_at: null,
    client_secret: null,
    payment_requirements: paymentRequirements,
  });

  assert.deepEqual(session?.x402PaymentRequirements, paymentRequirements);
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
  assert.equal(
    normalizeBillingCheckoutSession({
      checkout_id: 'checkout_1',
      provider: 'x402',
      session_id: 'x402_session_123',
      status: 'requires_payment',
      client_secret: null,
      payment_requirements: {
        x402Version: 2,
        resource: { url: 'iruka://billing/checkout/checkout_1' },
        accepts: [],
      },
    }),
    null,
  );
});
