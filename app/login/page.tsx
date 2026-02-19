'use client';

import { useRouter } from 'next/navigation';
import { RiWallet3Line, RiMailSendLine } from 'react-icons/ri';
import { AuthShell } from '@/components/auth/AuthShell';
import Link from 'next/link';
import { AuthOptionCard } from '@/components/auth/AuthOptionCard';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { SiwePanel } from '@/components/auth/SiwePanel';
import { Button } from '@/components/ui/Button';
import { requestMagicLink } from '@/lib/api/auth';
import { storeSession } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();

  const handleMagicLink = async (email: string) => {
    const session = await requestMagicLink({ email, redirectUrl: `${window.location.origin}/login` });
    storeSession(session);
  };

  const handleSiwe = async () => {
    router.push('/app');
  };

  return (
    <AuthShell
      title="Access Sentinel"
      description="Sign in with a wallet or email to manage signals, webhooks, and delivery settings."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AuthOptionCard
            title="Wallet login"
            description="Use Sign-In with Ethereum to authenticate instantly."
            icon={<RiWallet3Line className="w-5 h-5" />}
            footer={
              <Link
                href="https://github.com/monarch-xyz/sentinel"
                target="_blank"
                className="text-xs text-secondary hover:text-[#ff6b35] transition-colors"
              >
                Need help? View SIWE docs
              </Link>
            }
          >
            <SiwePanel onConnect={handleSiwe} />
          </AuthOptionCard>

          <AuthOptionCard
            title="Magic link"
            description="Receive a one-time login link to your inbox."
            icon={<RiMailSendLine className="w-5 h-5" />}
            footer={
              <Button
                variant="secondary"
                onClick={() => window.open('https://discord.gg/Ur4dwN3aPS', '_blank')}
                className="w-full"
              >
                Connect Telegram first
              </Button>
            }
          >
            <MagicLinkForm onSubmit={handleMagicLink} />
          </AuthOptionCard>
        </div>
      </div>
    </AuthShell>
  );
}
