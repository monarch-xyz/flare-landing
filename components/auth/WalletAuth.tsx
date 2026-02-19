'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { requestSiweNonce, verifySiwe } from '@/lib/api/auth';
import { buildSiweMessage } from '@/lib/auth/siwe';
import { storeSession } from '@/lib/auth/session';

interface WalletAuthProps {
  onSuccess?: () => void;
}

export function WalletAuth({ onSuccess }: WalletAuthProps) {
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const connector = connectors[0];

  const handleConnect = async () => {
    setError(null);
    setStatus('loading');
    try {
      await connectAsync({ connector });
      setStatus('idle');
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : 'Unable to connect wallet.');
      setStatus('error');
    }
  };

  const handleSignIn = async () => {
    if (!address || !chainId) {
      setError('Connect a wallet to continue.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const nonceResponse = await requestSiweNonce();
      const message = buildSiweMessage({
        address,
        chainId,
        nonce: nonceResponse.nonce,
      });
      const signature = await signMessageAsync({ message });
      const session = await verifySiwe({ message, signature, address });
      storeSession(session);
      onSuccess?.();
      setStatus('idle');
    } catch (signError) {
      setError(signError instanceof Error ? signError.message : 'Unable to sign in with wallet.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-border bg-[#ff6b35]/5 px-4 py-3 text-sm text-secondary">
        Connect your wallet to authenticate using Sign-In with Ethereum.
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleConnect} disabled={isConnecting || status === 'loading'}>
          {isConnecting || status === 'loading' ? 'Connecting...' : isConnected ? 'Wallet connected' : 'Connect wallet'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleSignIn}
          disabled={!isConnected || status === 'loading'}
        >
          {status === 'loading' ? 'Signing...' : 'Sign in with wallet'}
        </Button>
        {isConnected && (
          <Button variant="ghost" onClick={() => disconnect()}>
            Disconnect
          </Button>
        )}
      </div>
      {address && (
        <p className="text-xs text-secondary">Connected as {address}</p>
      )}
    </div>
  );
}
