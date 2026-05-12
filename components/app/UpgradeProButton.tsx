'use client';

import { x402Client } from '@x402/core/client';
import type { PaymentRequired } from '@x402/core/types';
import { ExactEvmScheme } from '@x402/evm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { base } from 'viem/chains';
import { useConnection, useSwitchChain, useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api/client';
import { createBillingCheckoutSession, finalizeBillingCheckoutSession } from '@/lib/api/billing';
import { X402PaymentPayload } from '@/lib/billing/checkout';

export function UpgradeProButton() {
  const router = useRouter();
  const { address, chainId } = useConnection();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCheckout = async () => {
    setError(null);
    setIsCreating(true);
    try {
      if (!address || !walletClient) {
        throw new Error('Connect your wallet to pay with Base USDC.');
      }
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      const session = await createBillingCheckoutSession('pro_monthly', 'x402');
      if (session.provider !== 'x402') {
        throw new Error('Unexpected payment provider');
      }
      if (session.status === 'succeeded') {
        router.refresh();
        return;
      }
      if (session.status !== 'requires_payment' || !session.x402PaymentRequirements) {
        setError('Payment is temporarily unavailable.');
        return;
      }

      const signer = {
        address,
        signTypedData: (message: Parameters<typeof walletClient.signTypedData>[0]) =>
          walletClient.signTypedData(message),
      };
      const paymentClient = new x402Client().register('eip155:8453', new ExactEvmScheme(signer));
      const paymentPayload = (await paymentClient.createPaymentPayload(
        session.x402PaymentRequirements as PaymentRequired,
      )) as X402PaymentPayload;
      const finalized = await finalizeBillingCheckoutSession({
        checkoutId: session.checkoutId,
        sessionId: session.sessionId,
        paymentPayload,
      });
      if (finalized.status !== 'succeeded') {
        throw new Error('Payment did not complete.');
      }
      router.refresh();
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 501) {
        setError('Payment is temporarily unavailable.');
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Could not start checkout');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button type="button" variant="secondary" size="sm" onClick={startCheckout} disabled={isCreating}>
        {isCreating ? 'Starting…' : 'Upgrade'}
      </Button>
      {error ? <p className="max-w-56 text-xs text-secondary">{error}</p> : null}
    </div>
  );
}
