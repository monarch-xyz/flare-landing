'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DaimoModal } from '@daimo/sdk/web';
import { Button } from '@/components/ui/Button';
import { createBillingCheckoutSession } from '@/lib/api/billing';
import type { BillingCheckoutSession } from '@/lib/billing/checkout';

export function UpgradeProButton() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<BillingCheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCheckout = async () => {
    setError(null);
    setIsCreating(true);
    try {
      setCheckout(await createBillingCheckoutSession('pro_monthly'));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not start checkout');
    } finally {
      setIsCreating(false);
    }
  };

  const returnUrl = typeof window === 'undefined' ? undefined : window.location.origin + window.location.pathname;

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button type="button" variant="secondary" size="sm" onClick={startCheckout} disabled={isCreating}>
        {isCreating ? 'Starting…' : 'Upgrade'}
      </Button>
      {error ? <p className="max-w-56 text-xs text-red-700">{error}</p> : null}
      {checkout ? (
        <DaimoModal
          key={checkout.sessionId}
          sessionId={checkout.sessionId}
          clientSecret={checkout.clientSecret}
          returnUrl={returnUrl}
          returnLabel="Back to Iruka"
          onClose={() => {
            setCheckout(null);
            router.refresh();
          }}
          onPaymentCompleted={() => router.refresh()}
        />
      ) : null}
    </div>
  );
}
