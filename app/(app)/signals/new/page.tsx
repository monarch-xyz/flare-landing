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
import { IRUKA_ONE_LINER, getCreateSignalPersona } from '@/lib/signals/create-flow-catalog';

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
        summary={`${IRUKA_ONE_LINER} Choose who is setting it up.`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-copper)_10%,var(--surface-inset))] text-[color:var(--signal-copper)]">
                <RiUser3Line className="h-5 w-5" />
              </div>
              <div>
                <p className="ui-stat-label">
                  {humanPersona.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-[1.75rem] leading-none text-foreground">{humanPersona.title}</h2>
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
              <div className="flex h-11 w-11 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-copper)_10%,var(--surface-inset))] text-[color:var(--signal-copper)]">
                <RiRobot2Line className="h-5 w-5" />
              </div>
              <div>
                <p className="ui-stat-label">
                  {agentPersona.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-[1.75rem] leading-none text-foreground">{agentPersona.title}</h2>
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
