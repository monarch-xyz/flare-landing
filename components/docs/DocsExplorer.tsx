'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  SENTINEL_API_DOCS_URL,
  SENTINEL_ARCHITECTURE_DOCS_URL,
  SENTINEL_AUTH_DOCS_URL,
  SENTINEL_DSL_DOCS_URL,
  SENTINEL_GITHUB_URL,
  SENTINEL_SOURCES_DOCS_URL,
} from '@/lib/sentinel-links';
import { cn } from '@/lib/utils';
import { FamilyExamplesAccordion } from './FamilyExamplesAccordion';

type SectionId = 'contents' | 'sources' | 'logic' | 'auth' | 'delivery' | 'routes';

interface SourceLink {
  label: string;
  href: string;
  note: string;
}

const sections = [
  {
    id: 'contents',
    label: 'Contents',
    description:
      'A signal request is an HTTP wrapper around one `definition` object. Keep delivery, cooldown, and metadata outside the DSL itself.',
  },
  {
    id: 'sources',
    label: 'Source Families',
    description:
      'Sentinel exposes three source families: `state`, `indexed`, and `raw`. Providers are runtime details, not the product abstraction.',
  },
  {
    id: 'logic',
    label: 'Logic',
    description:
      'The public DSL supports boolean composition plus fixed condition types. Internal engine math is not a customer-authored DSL surface.',
  },
  {
    id: 'auth',
    label: 'Auth',
    description:
      'Use API keys for systems and SIWE sessions for operators. Protected product routes accept either valid API-key or session auth.',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    description:
      'Managed Telegram is the default first-party path. `webhook_url` is only for explicit destination override.',
  },
  {
    id: 'routes',
    label: 'Routes',
    description:
      'Health, CRUD, history, and simulation make up the operational API surface customers use day to day.',
  },
] as const satisfies ReadonlyArray<{
  id: SectionId;
  label: string;
  description: string;
}>;

const signalFields = [
  ['name', 'Human label for the signal.'],
  ['definition.scope', 'Chains, markets, addresses, and protocol.'],
  ['definition.window', 'Evaluation lookback window.'],
  ['definition.logic', 'Top-level `AND` or `OR` across conditions.'],
  ['definition.conditions[]', 'The actual checks Sentinel evaluates.'],
  ['delivery | webhook_url', 'Managed delivery or explicit override.'],
  ['cooldown_minutes', 'Minimum gap between repeat notifications.'],
] as const;

const sourceFamilies = [
  {
    name: 'State',
    dsl: '`metric` on `threshold`, `change`, or `aggregate`',
    note: 'RPC / archive-node backed state snapshots and computed state metrics.',
    refs: ['Morpho.Position.supplyShares', 'Morpho.Market.totalBorrowAssets', 'Morpho.Market.utilization'],
  },
  {
    name: 'Indexed',
    dsl: '`metric` on indexed event and flow refs',
    note: 'Protocol-aware indexed history, currently served by Envio.',
    refs: ['Morpho.Event.Supply.assets', 'Morpho.Event.Withdraw.count', 'Morpho.Flow.netSupply'],
  },
  {
    name: 'Raw',
    dsl: '`type: "raw-events"`',
    note: 'Decoded log scans, currently served by HyperSync.',
    refs: ['erc20_transfer', 'swap', 'contract_event'],
  },
] as const;

const logicRows = [
  ['`logic`', 'Top-level boolean composition with `AND` or `OR`.'],
  ['`threshold`', 'Compare one state or indexed metric to a fixed value.'],
  ['`change`', 'Compare current state to historical state. Publicly supported for state metrics.'],
  ['`aggregate`', 'Aggregate one state or indexed metric across the current scope.'],
  ['`group`', 'Evaluate inner conditions per address, then apply an N-of-M requirement.'],
  ['`raw-events`', 'Scan decoded logs directly instead of resolving a metric.'],
] as const;

const authRows = [
  ['API key', 'Create with `POST /api/v1/auth/register`, then send `X-API-Key`.'],
  ['Browser session', 'Use `POST /api/v1/auth/siwe/nonce` and `POST /api/v1/auth/siwe/verify`.'],
  ['Bearer token', 'The SIWE verify response also returns `session_token`.'],
] as const;

const deliveryRows = [
  ['Managed Telegram', 'Send `delivery: { provider: "telegram" }` and let Sentinel resolve the target server-side.'],
  ['Custom webhook', 'Send `webhook_url` only when you intentionally want your own endpoint.'],
] as const;

const routes = [
  ['GET', '/health', 'Fast liveness plus source-family capability status.'],
  ['GET', '/ready', 'Readiness across DB, Redis, RPC, and configured providers.'],
  ['POST', '/api/v1/signals', 'Create one stored signal.'],
  ['PATCH', '/api/v1/signals/:id', 'Update definition, delivery, cooldown, or metadata.'],
  ['GET', '/api/v1/signals/:id/history', 'Read evaluations and notification attempts.'],
  ['POST', '/api/v1/simulate/:id/simulate', 'Replay a signal across a time range.'],
  ['POST', '/api/v1/simulate/:id/first-trigger', 'Find the earliest trigger in a time range.'],
] as const;

const familyExamples = [
  {
    id: 'state',
    title: 'State example',
    description: 'Threshold on a state metric.',
    code: `POST /api/v1/signals
Content-Type: application/json
X-API-Key: sentinel_...

{
  "name": "High Utilization",
  "definition": {
    "scope": {
      "chains": [1],
      "markets": ["0xM"],
      "protocol": "morpho"
    },
    "window": { "duration": "1h" },
    "conditions": [
      {
        "type": "threshold",
        "metric": "Morpho.Market.utilization",
        "operator": ">",
        "value": 0.9,
        "chain_id": 1,
        "market_id": "0xM"
      }
    ]
  },
  "delivery": { "provider": "telegram" },
  "cooldown_minutes": 5
}`,
    language: 'shell',
    filename: 'state.http',
  },
  {
    id: 'indexed',
    title: 'Indexed example',
    description: 'Threshold on a protocol-aware flow metric.',
    code: `{
  "name": "Net Supply Falls",
  "definition": {
    "scope": {
      "chains": [1],
      "markets": ["0xM"],
      "protocol": "morpho"
    },
    "window": { "duration": "6h" },
    "conditions": [
      {
        "type": "threshold",
        "metric": "Morpho.Flow.netSupply",
        "operator": "<",
        "value": -1000000,
        "chain_id": 1,
        "market_id": "0xM"
      }
    ]
  },
  "webhook_url": "https://your-webhook.example/alert",
  "cooldown_minutes": 15
}`,
    language: 'json',
    filename: 'indexed.json',
  },
  {
    id: 'raw',
    title: 'Raw example',
    description: 'Decoded ERC-20 transfer scan with filters.',
    code: `{
  "name": "USDC Transfer Burst",
  "definition": {
    "scope": {
      "chains": [1],
      "protocol": "all"
    },
    "window": { "duration": "30m" },
    "conditions": [
      {
        "type": "raw-events",
        "aggregation": "sum",
        "field": "value",
        "operator": ">",
        "value": 1000000,
        "chain_id": 1,
        "event": {
          "kind": "erc20_transfer",
          "contract_addresses": ["0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
        },
        "filters": [
          {
            "field": "to",
            "op": "eq",
            "value": "0xReceiver"
          }
        ]
      }
    ]
  },
  "webhook_url": "https://your-webhook.example/raw-events",
  "cooldown_minutes": 10
}`,
    language: 'json',
    filename: 'raw.json',
  },
] as const;

const contentsExample = `POST /api/v1/signals
Content-Type: application/json
X-API-Key: sentinel_...

{
  "name": "High Utilization",
  "definition": {
    "scope": {
      "chains": [1],
      "markets": ["0xM"],
      "protocol": "morpho"
    },
    "window": { "duration": "1h" },
    "logic": "AND",
    "conditions": [
      {
        "type": "threshold",
        "metric": "Morpho.Market.utilization",
        "operator": ">",
        "value": 0.9,
        "chain_id": 1,
        "market_id": "0xM"
      }
    ]
  },
  "delivery": { "provider": "telegram" },
  "cooldown_minutes": 5
}`;

const logicExample = `{
  "scope": {
    "chains": [1],
    "markets": ["0x..."],
    "addresses": ["0xA", "0xB", "0xC"],
    "protocol": "morpho"
  },
  "window": { "duration": "1h" },
  "logic": "OR",
  "conditions": [
    {
      "type": "change",
      "metric": "Morpho.Position.supplyShares",
      "direction": "decrease",
      "by": { "percent": 20 },
      "chain_id": 1,
      "market_id": "0x...",
      "address": "0xA"
    },
    {
      "type": "group",
      "addresses": ["0xA", "0xB", "0xC"],
      "requirement": { "count": 2, "of": 3 },
      "logic": "AND",
      "conditions": [
        {
          "type": "threshold",
          "metric": "Morpho.Position.collateral",
          "operator": "<",
          "value": 100,
          "chain_id": 1,
          "market_id": "0x..."
        }
      ]
    }
  ]
}`;

const authExample = `POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Acme Alerts",
  "key_name": "prod-key"
}

200 OK

{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "api_key_id": "2e4d1e12-3a0d-4b0c-9b54-7a1f4d8c3ed1",
  "api_key": "sentinel_..."
}`;

const deliveryExample = `{
  "signal_id": "550e8400-e29b-41d4-a716-446655440000",
  "signal_name": "My Alert",
  "triggered_at": "2026-02-02T15:30:00Z",
  "scope": {
    "chains": [1],
    "markets": ["0x..."],
    "addresses": ["0x..."]
  },
  "conditions_met": [],
  "context": {
    "app_user_id": "550e8400-e29b-41d4-a716-446655440000",
    "address": "0x...",
    "market_id": "0x...",
    "chain_id": 1
  }
}`;

const routesExample = `POST /api/v1/simulate/:id/simulate
Content-Type: application/json
X-API-Key: sentinel_...

{
  "start_time": "2026-01-01T00:00:00Z",
  "end_time": "2026-02-01T00:00:00Z",
  "interval_ms": 3600000,
  "compact": true
}`;

function SubsectionTitle({ children }: { children: string }) {
  return <h3 className="text-lg tracking-tight text-foreground">{children}</h3>;
}

function SourceLinks({ links }: { links: SourceLink[] }) {
  return (
    <div className="border-t border-border pt-6">
      <SubsectionTitle>Source of truth</SubsectionTitle>
      <div className="mt-4 divide-y divide-border border-b border-border">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-4 py-3 text-foreground no-underline transition-colors hover:text-foreground"
          >
            <div>
              <p className="text-sm">{link.label}</p>
              <p className="mt-1 text-sm text-secondary">{link.note}</p>
            </div>
            <RiExternalLinkLine className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ExampleBlock({
  title,
  code,
  language,
  filename,
}: {
  title: string;
  code: string;
  language: string;
  filename: string;
}) {
  return (
    <div className="border-t border-border pt-6">
      <SubsectionTitle>{title}</SubsectionTitle>
      <CodeBlock code={code} language={language} filename={filename} tone="light" showHeader={false} className="mt-3" />
    </div>
  );
}

function RowList({
  rows,
  columns = 'default',
}: {
  rows: readonly (readonly string[])[];
  columns?: 'default' | 'method';
}) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {rows.map((row) => (
        <div
          key={row[0]}
          className={cn(
            'py-4',
            columns === 'method' ? 'grid gap-2 md:grid-cols-[84px_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-4' : 'md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-4'
          )}
        >
          <p className={cn('text-sm text-foreground', columns === 'method' && 'font-mono text-xs uppercase tracking-[0.16em] text-secondary md:pt-0.5')}>
            {row[0]}
          </p>
          {columns === 'method' ? (
            <>
              <p className="font-mono text-sm text-foreground">{row[1]}</p>
              <p className="text-sm leading-relaxed text-secondary">{row[2]}</p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-secondary">{row[1]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function DocsExplorer() {
  const [activeId, setActiveId] = useState<SectionId>('contents');
  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];

  const renderContent = () => {
    switch (activeId) {
      case 'contents':
        return (
          <>
            <RowList rows={signalFields} />
            <SourceLinks
              links={[
                {
                  label: 'API.md',
                  href: SENTINEL_API_DOCS_URL,
                  note: 'Request wrapper for `POST /api/v1/signals` and protected route behavior.',
                },
                {
                  label: 'DSL.md',
                  href: SENTINEL_DSL_DOCS_URL,
                  note: 'Canonical `definition` shape, condition types, and examples.',
                },
              ]}
            />
            <ExampleBlock title="Example request" code={contentsExample} language="shell" filename="create-signal.http" />
          </>
        );
      case 'sources':
        return (
          <>
            <div className="divide-y divide-border border-y border-border">
              {sourceFamilies.map((family) => (
                <div key={family.name} className="py-4">
                  <div className="md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-4">
                    <p className="text-sm text-foreground">{family.name}</p>
                    <div>
                      <p className="font-mono text-xs text-foreground">{family.dsl}</p>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{family.note}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {family.refs.map((ref) => (
                          <span key={ref} className="font-mono text-[11px] text-secondary">
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-secondary">
              `GET /health` reports which families are enabled. If a signal depends on a disabled
              family, create, update, activation, and simulation routes return `409 Conflict`.
            </p>

            <div className="mt-6">
              <SubsectionTitle>Examples</SubsectionTitle>
              <FamilyExamplesAccordion items={[...familyExamples]} defaultOpenId="state" />
            </div>

            <SourceLinks
              links={[
                {
                  label: 'SOURCES.md',
                  href: SENTINEL_SOURCES_DOCS_URL,
                  note: 'Canonical source-family contract and capability gating.',
                },
                {
                  label: 'DSL.md',
                  href: SENTINEL_DSL_DOCS_URL,
                  note: 'Which condition types belong to state, indexed, and raw.',
                },
              ]}
            />
          </>
        );
      case 'logic':
        return (
          <>
            <RowList rows={logicRows} />
            <p className="mt-6 text-sm leading-relaxed text-secondary">
              Sentinel has internal arithmetic in the engine AST, but customers do not author free-form
              `add` or `sub` expressions in the public DSL today.
            </p>
            <SourceLinks
              links={[
                {
                  label: 'DSL.md',
                  href: SENTINEL_DSL_DOCS_URL,
                  note: 'Public `logic`, `group`, and condition-type contract.',
                },
                {
                  label: 'SOURCES.md',
                  href: SENTINEL_SOURCES_DOCS_URL,
                  note: 'Mixed-source planning belongs in the engine and metric registry.',
                },
                {
                  label: 'ARCHITECTURE.md',
                  href: SENTINEL_ARCHITECTURE_DOCS_URL,
                  note: 'Compiler, planner, and evaluator boundaries.',
                },
              ]}
            />
            <ExampleBlock title="Example definition" code={logicExample} language="json" filename="logic.json" />
          </>
        );
      case 'auth':
        return (
          <>
            <RowList rows={authRows} />
            <p className="mt-6 text-sm leading-relaxed text-secondary">
              Public routes are `GET /health`, `GET /ready`, `POST /api/v1/auth/register`,
              `POST /api/v1/auth/siwe/nonce`, and `POST /api/v1/auth/siwe/verify`.
            </p>
            <SourceLinks
              links={[
                {
                  label: 'AUTH.md',
                  href: SENTINEL_AUTH_DOCS_URL,
                  note: 'API key lifecycle, SIWE session flow, and protected route rules.',
                },
                {
                  label: 'API.md',
                  href: SENTINEL_API_DOCS_URL,
                  note: 'Register, SIWE nonce, and SIWE verify endpoints.',
                },
              ]}
            />
            <ExampleBlock title="Register for API-key access" code={authExample} language="shell" filename="auth.http" />
          </>
        );
      case 'delivery':
        return (
          <>
            <RowList rows={deliveryRows} />
            <p className="mt-6 text-sm leading-relaxed text-secondary">
              For direct Telegram delivery, `context.app_user_id` in the outbound payload should
              match the Telegram link mapping used by the delivery service.
            </p>
            <SourceLinks
              links={[
                {
                  label: 'API.md',
                  href: SENTINEL_API_DOCS_URL,
                  note: 'Signal delivery contract and outbound webhook payload shape.',
                },
                {
                  label: 'GitHub',
                  href: SENTINEL_GITHUB_URL,
                  note: 'Repository source of truth for implementation details.',
                },
              ]}
            />
            <ExampleBlock title="Outbound webhook payload" code={deliveryExample} language="json" filename="webhook-payload.json" />
          </>
        );
      case 'routes':
        return (
          <>
            <RowList rows={routes} columns="method" />
            <p className="mt-6 text-sm leading-relaxed text-secondary">
              `GET /health` is liveness. `GET /ready` checks live dependencies. Simulation returns
              `409 Conflict` when the stored signal depends on a disabled source family.
            </p>
            <SourceLinks
              links={[
                {
                  label: 'API.md',
                  href: SENTINEL_API_DOCS_URL,
                  note: 'Health, readiness, signal CRUD, history, and simulation endpoints.',
                },
                {
                  label: 'SOURCES.md',
                  href: SENTINEL_SOURCES_DOCS_URL,
                  note: 'Capability gating behavior for disabled families.',
                },
              ]}
            />
            <ExampleBlock title="Simulation request" code={routesExample} language="shell" filename="simulate.http" />
          </>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="max-w-3xl">
        <h1 className="text-4xl tracking-tight text-foreground sm:text-5xl">Sentinel Docs</h1>
        <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
          Simple reference for sources, logic, auth, delivery, and routes.
        </p>
      </header>

      <div className="mt-10 lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
        <aside className="border-b border-border pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <nav className="flex gap-5 overflow-x-auto lg:flex-col lg:gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(section.id)}
                className={cn(
                  'border-b-2 border-transparent py-2 text-left text-sm text-secondary transition-colors lg:border-b-0 lg:border-l-2 lg:py-3 lg:pl-3',
                  activeId === section.id && 'border-foreground text-foreground',
                  activeId !== section.id && 'hover:text-foreground'
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="pt-8 lg:pt-0">
          <div className="border-b border-border pb-6">
            <h2 className="text-3xl tracking-tight text-foreground">{activeSection.label}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-secondary">
              {activeSection.description}
            </p>
          </div>

          <div className="space-y-6 pt-8">{renderContent()}</div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
        <Link href="/login" className="text-foreground no-underline transition-colors hover:text-[#ff6b35]">
          Open app
        </Link>
        <a
          href={SENTINEL_GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground no-underline transition-colors hover:text-[#ff6b35]"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
