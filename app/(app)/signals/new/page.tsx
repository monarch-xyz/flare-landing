import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RiArrowRightLine, RiRobot2Line, RiUser3Line } from 'react-icons/ri';
import { CreateFlowHeader } from '@/components/app/CreateFlowHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HelpHint } from '@/components/ui/HelpHint';
import { getAuthenticatedUser } from '@/lib/auth/session';
import {
  AGENT_TEMPLATE_PATH,
  HUMAN_TEMPLATE_PATH,
  buildTemplateEntryPath,
  buildTemplatePath,
} from '@/lib/telegram/setup-flow';
import { getTelegramLinkStatus } from '@/lib/telegram/link-state';
import { MEGABAT_ONE_LINER, getCreateSignalPersona } from '@/lib/signals/create-flow-catalog';

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
  const humanPersona = getCreateSignalPersona('human');
  const agentPersona = getCreateSignalPersona('agent');

  return (
    <div className="space-y-6">
      <CreateFlowHeader
        eyebrow="Create"
        title="Choose who is creating the signal"
        summary={`${MEGABAT_ONE_LINER} Choose who is setting it up.`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#ff6b35]/10 text-[#ff6b35]">
                <RiUser3Line className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                  {humanPersona.eyebrow}
                </p>
                <h2 className="mt-1 font-zen text-2xl">{humanPersona.title}</h2>
              </div>
            </div>
            <HelpHint text={humanPersona.helpText} align="right" />
          </div>
          {!telegramStatus.linked ? (
            <p className="text-sm text-secondary">
              Telegram is still required for human-created managed alerts. The CTA below will route through Telegram setup first.
            </p>
          ) : null}
          <Link href={buildTemplateEntryPath(telegramStatus.linked, HUMAN_TEMPLATE_PATH)} className="no-underline">
            <Button className="gap-2">
              {humanPersona.cta}
              <RiArrowRightLine className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#ff6b35]/10 text-[#ff6b35]">
                <RiRobot2Line className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                  {agentPersona.eyebrow}
                </p>
                <h2 className="mt-1 font-zen text-2xl">{agentPersona.title}</h2>
              </div>
            </div>
            <HelpHint text={agentPersona.helpText} align="right" />
          </div>
          <Link href={AGENT_TEMPLATE_PATH} className="no-underline">
            <Button variant="secondary" className="gap-2">
              {agentPersona.cta}
              <RiArrowRightLine className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
