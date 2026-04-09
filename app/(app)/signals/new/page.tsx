import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RiArrowRightLine, RiCompass3Line, RiSlideshowLine } from 'react-icons/ri';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAuthenticatedUser } from '@/lib/auth/session';
import {
  ADVANCED_TEMPLATE_PATH,
  buildTelegramPath,
  buildTemplatePath,
  SIMPLE_TEMPLATE_PATH,
} from '@/lib/telegram/setup-flow';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';

interface NewSignalPageProps {
  searchParams?: Promise<{ preset?: string }> | { preset?: string };
}

export default async function NewSignalPage({ searchParams }: NewSignalPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const presetParam = resolvedSearchParams?.preset;

  if (typeof presetParam === 'string' && presetParam.trim()) {
    redirect(buildTemplatePath(presetParam));
  }

  const user = await getAuthenticatedUser();
  const telegramStatus = user
    ? await getTelegramLinkStatus()
    : { linked: false, linkedAt: null, appUserId: null, telegramUsername: null };

  if (!telegramStatus.linked) {
    redirect(
      buildTelegramPath({
        status: 'required',
        returnTo: '/signals/new',
      })
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Create</p>
          <h1 className="mt-3 font-zen text-3xl sm:text-4xl">Choose an entry mode</h1>
          <p className="mt-3 text-secondary">
            Start with Morpho-assisted search when you want vaults, markets, and holder lists filled in for you. Use advanced mode when you want full manual control over templates and raw inputs.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#ff6b35]/10 text-[#ff6b35]">
              <RiCompass3Line className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Simple</p>
              <h2 className="mt-1 font-zen text-2xl">Morpho-assisted</h2>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Search Morpho vaults or markets, pull top holders from the official Morpho API, and create signals by selecting addresses instead of collecting them manually.
          </p>
          <div className="space-y-2 text-sm text-secondary">
            <p>Supports today:</p>
            <p>Morpho vault holder withdrawals</p>
            <p>Morpho market supplier exits</p>
          </div>
          <Link href={SIMPLE_TEMPLATE_PATH} className="no-underline">
            <Button className="gap-2">
              Open simple mode
              <RiArrowRightLine className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#ff6b35]/10 text-[#ff6b35]">
              <RiSlideshowLine className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">Advanced</p>
              <h2 className="mt-1 font-zen text-2xl">Manual templates</h2>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Fill in market ids, vault contracts, owners, wallets, and thresholds yourself. This is the right path when you already know the exact inputs or want to work ahead of future simple integrations.
          </p>
          <div className="space-y-2 text-sm text-secondary">
            <p>Includes today:</p>
            <p>Morpho whale templates</p>
            <p>ERC-4626 percentage withdrawal template</p>
            <p>ERC-20 raw-event templates</p>
          </div>
          <Link href={ADVANCED_TEMPLATE_PATH} className="no-underline">
            <Button variant="secondary" className="gap-2">
              Open advanced mode
              <RiArrowRightLine className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
