'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createBillingCheckoutSession } from '@/lib/api/billing';

export function UpgradeProButton() {
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCheckout = async () => {
    setError(null);
    setIsCreating(true);
    try {
      await createBillingCheckoutSession('pro_monthly');
      setError('Payment provider is not available yet.');
    } catch (caught) {
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
      {error ? <p className="max-w-56 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
