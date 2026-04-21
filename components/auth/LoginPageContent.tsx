'use client';

import { RiWallet3Line } from 'react-icons/ri';
import { AuthOptionCard } from '@/components/auth/AuthOptionCard';
import { AuthShell } from '@/components/auth/AuthShell';
import { SiwePanel } from '@/components/auth/SiwePanel';

interface LoginPageContentProps {
  returnTo: string;
  isReturningToProtectedPage: boolean;
}

export function LoginPageContent({ returnTo, isReturningToProtectedPage }: LoginPageContentProps) {
  return (
    <AuthShell
      title="Access Iruka"
      description={
        isReturningToProtectedPage
          ? 'Sign in with your wallet to continue where you left off.'
          : 'Sign in with your wallet to start managing signals.'
      }
    >
      <AuthOptionCard
        title="Wallet login"
        description="Sign in with Ethereum to connect your wallet identity."
        icon={<RiWallet3Line className="w-5 h-5" />}
        footer={
          isReturningToProtectedPage ? (
            <p className="text-xs text-secondary">After authentication, you will be returned to your original page.</p>
          ) : null
        }
      >
        <SiwePanel returnTo={returnTo} />
      </AuthOptionCard>
    </AuthShell>
  );
}
