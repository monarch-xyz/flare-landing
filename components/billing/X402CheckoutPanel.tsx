'use client';

import { x402Client } from '@x402/core/client';
import type { PaymentRequired } from '@x402/core/types';
import { ExactEvmSchemeV1 } from '@x402/evm/v1';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { base } from 'viem/chains';
import { useConnection, useSwitchChain, useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api/client';
import { createBillingCheckoutSession, finalizeBillingCheckoutSession } from '@/lib/api/billing';
import { BillingCheckoutSession, X402PaymentPayload, getX402RequirementAmount } from '@/lib/billing/checkout';

const usdcAddress = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
const treasuryAddress = '0xF4cABf9F20426177c2d74bFBB738919C28c2356e';

const formatUsdcAmount = (atomicAmount: string | undefined) => {
  if (!atomicAmount || !/^\d+$/.test(atomicAmount)) {
    return '1.00';
  }
  const padded = atomicAmount.padStart(7, '0');
  const whole = padded.slice(0, -6) || '0';
  const fraction = padded.slice(-6).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole;
};

const getFailureMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status === 402) {
      return 'Payment was not verified or settled. Do not pay again; retry verification first.';
    }
    if (error.status >= 500) {
      return 'Iruka could not verify the payment right now. Do not pay again; retry verification first.';
    }
  }
  return error instanceof Error ? error.message : 'Checkout failed';
};

export function X402CheckoutPanel() {
  const router = useRouter();
  const { address, chainId } = useConnection();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const [session, setSession] = useState<BillingCheckoutSession | null>(null);
  const [paymentPayload, setPaymentPayload] = useState<X402PaymentPayload | null>(null);
  const [status, setStatus] = useState<'idle' | 'creating' | 'signing' | 'finalizing' | 'succeeded'>('idle');
  const [error, setError] = useState<string | null>(null);

  const requirement = session?.x402PaymentRequirements?.accepts[0];
  const amount = useMemo(() => formatUsdcAmount(getX402RequirementAmount(requirement)), [requirement]);
  const isBusy = status === 'creating' || status === 'signing' || status === 'finalizing';
  const primaryLabel = paymentPayload
    ? 'Retry verification'
    : status === 'creating'
      ? 'Preparing checkout…'
      : status === 'signing'
        ? 'Waiting for wallet…'
        : status === 'finalizing'
          ? 'Verifying payment…'
          : 'Pay with Base USDC';

  const ensureBase = async () => {
    if (chainId !== base.id) {
      await switchChainAsync({ chainId: base.id });
    }
  };

  const createSession = async () => {
    const created = await createBillingCheckoutSession('pro_monthly', 'x402');
    if (created.provider !== 'x402' || created.status !== 'requires_payment' || !created.x402PaymentRequirements) {
      throw new Error('Payment is temporarily unavailable.');
    }
    setSession(created);
    return created;
  };

  const signPayment = async (checkoutSession: BillingCheckoutSession) => {
    if (!address || !walletClient) {
      throw new Error('Connect your wallet to pay with Base USDC.');
    }
    await ensureBase();

    const signer = {
      address,
      signTypedData: (message: Parameters<typeof walletClient.signTypedData>[0]) =>
        walletClient.signTypedData(message),
    };
    const paymentClient = new x402Client().registerV1('base', new ExactEvmSchemeV1(signer));
    const signedPayload = (await paymentClient.createPaymentPayload(
      checkoutSession.x402PaymentRequirements as PaymentRequired,
    )) as X402PaymentPayload;
    setPaymentPayload(signedPayload);
    return signedPayload;
  };

  const finalizePayment = async (checkoutSession: BillingCheckoutSession, signedPayload: X402PaymentPayload) => {
    const finalized = await finalizeBillingCheckoutSession({
      checkoutId: checkoutSession.checkoutId,
      sessionId: checkoutSession.sessionId,
      paymentPayload: signedPayload,
    });
    if (finalized.status !== 'succeeded') {
      throw new Error('Payment did not complete.');
    }
    setStatus('succeeded');
    setError(null);
    router.refresh();
  };

  const startCheckout = async () => {
    setError(null);
    try {
      setStatus('creating');
      const checkoutSession = session ?? (await createSession());
      setStatus('signing');
      const signedPayload = paymentPayload ?? (await signPayment(checkoutSession));
      setStatus('finalizing');
      await finalizePayment(checkoutSession, signedPayload);
    } catch (caught) {
      setStatus('idle');
      setError(getFailureMessage(caught));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="ui-panel p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div>
            <p className="ui-stat-label">Iruka Pro checkout</p>
            <h1 className="mt-3 font-display text-3xl text-foreground">Upgrade with Base USDC</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
              Review the payment details first. After wallet approval, Iruka verifies settlement server-side before granting Pro.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="ui-panel-ghost p-4">
              <p className="ui-stat-label">Plan</p>
              <p className="mt-2 text-lg text-foreground">Pro · 30 days</p>
            </div>
            <div className="ui-panel-ghost p-4">
              <p className="ui-stat-label">Amount</p>
              <p className="mt-2 text-lg text-foreground">{amount} USDC</p>
            </div>
            <div className="ui-panel-ghost p-4">
              <p className="ui-stat-label">Network</p>
              <p className="mt-2 text-sm text-foreground">Base mainnet</p>
            </div>
            <div className="ui-panel-ghost p-4">
              <p className="ui-stat-label">Token</p>
              <p className="mt-2 break-all font-mono text-xs text-secondary">{requirement?.asset ?? usdcAddress}</p>
            </div>
          </div>

          <div className="ui-panel-ghost p-4">
            <p className="ui-stat-label">Recipient</p>
            <p className="mt-2 break-all font-mono text-xs text-secondary">{requirement?.payTo ?? treasuryAddress}</p>
          </div>

          <div className="rounded-[0.35rem] border border-[color:color-mix(in_oklch,var(--signal-copper)_26%,var(--stroke-subtle))] bg-[color:color-mix(in_oklch,var(--signal-copper)_8%,var(--surface-panel))] p-4 text-sm leading-relaxed text-secondary">
            If verification fails after wallet approval, do not pay again. Keep this page open and use Retry verification.
          </div>

          {error ? (
            <div className="ui-notice text-sm" data-tone="danger">
              {error}
            </div>
          ) : null}

          {status === 'succeeded' ? (
            <div className="ui-notice text-sm" data-tone="success">
              Pro is active. You can return to the dashboard.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" onClick={startCheckout} disabled={isBusy || status === 'succeeded'}>
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
