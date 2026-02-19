'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
}

export function MagicLinkForm({ onSubmit }: MagicLinkFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setStatus('loading');

    try {
      await onSubmit(email.trim());
      setStatus('sent');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send magic link.');
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="text-sm text-secondary">Email address</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@domain.xyz"
        required
        className="w-full rounded-md border border-border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/40"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {status === 'sent' && (
        <p className="text-sm text-[#ff6b35]">Magic link sent. Check your inbox.</p>
      )}
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send magic link'}
      </Button>
    </form>
  );
}
