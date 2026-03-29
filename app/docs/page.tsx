import type { Metadata } from 'next';
import Link from 'next/link';
import { RiArrowRightLine, RiExternalLinkLine, RiGithubFill } from 'react-icons/ri';
import { FamilyExamplesAccordion } from '@/components/docs/FamilyExamplesAccordion';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { SectionTag } from '@/components/ui/SectionTag';
import {
  SENTINEL_API_DOCS_URL,
  SENTINEL_ARCHITECTURE_DOCS_URL,
  SENTINEL_AUTH_DOCS_URL,
  SENTINEL_DSL_DOCS_URL,
  SENTINEL_GITHUB_URL,
  SENTINEL_SOURCES_DOCS_URL,
} from '@/lib/sentinel-links';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Customer-facing Sentinel docs: source families, auth, API shape, delivery contract, and canonical examples.',
};

const sourceFamilies = [
  {
    id: 'state',
    label: 'State',
    eyebrow: 'RPC / Archive Node',
    dsl: '`metric` on `threshold`, `change`, or `aggregate`',
    provider: 'RPC',
    availability: 'Enabled by default',
    description:
      'Use current and historical state snapshots for positions, markets, and computed metrics such as utilization.',
    examples: ['Morpho.Position.supplyShares', 'Morpho.Market.totalBorrowAssets', 'Morpho.Market.utilization'],
  },
  {
    id: 'indexed',
    label: 'Indexed',
    eyebrow: 'Semantic Event History',
    dsl: '`metric` on indexed event and flow metrics',
    provider: 'Envio',
    availability: 'Requires `ENVIO_ENDPOINT`',
    description:
      'Use protocol-aware indexed entities and derived event flows when you need semantic history rather than raw log scans.',
    examples: ['Morpho.Event.Supply.assets', 'Morpho.Event.Withdraw.count', 'Morpho.Flow.netSupply'],
  },
  {
    id: 'raw',
    label: 'Raw',
    eyebrow: 'Decoded Event Scans',
    dsl: '`type: "raw-events"`',
    provider: 'HyperSync',
    availability: 'Requires `ENVIO_API_TOKEN`',
    description:
      'Scan decoded logs directly when you need ERC-20 transfers, swap events, or custom contract events that have not been lifted into semantic metrics.',
    examples: ['erc20_transfer', 'swap', 'contract_event'],
  },
] as const;

const authModes = [
  {
    title: 'API Key',
    detail: 'Programmatic clients create an owner with `POST /api/v1/auth/register` and send `X-API-Key` on protected routes.',
  },
  {
    title: 'Browser Session',
    detail: 'Humans authenticate with SIWE through `POST /api/v1/auth/siwe/nonce` and `POST /api/v1/auth/siwe/verify`, then use the Sentinel session cookie.',
  },
  {
    title: 'Bearer Session Token',
    detail: 'The SIWE verify response also returns the session token for clients that prefer bearer-style auth instead of cookies.',
  },
] as const;

const routes = [
  { method: 'GET', path: '/health', note: 'Fast liveness plus source-family capability status.' },
  { method: 'GET', path: '/ready', note: 'Readiness probe across DB, Redis, RPC, and configured providers.' },
  { method: 'POST', path: '/api/v1/auth/register', note: 'Create an owner and issue an API key.' },
  { method: 'POST', path: '/api/v1/signals', note: 'Create a signal with either `delivery` or `webhook_url`.' },
  { method: 'PATCH', path: '/api/v1/signals/:id', note: 'Update definition, delivery, cooldown, or activation state.' },
  { method: 'GET', path: '/api/v1/signals/:id/history', note: 'Read evaluations and notification attempts.' },
  { method: 'POST', path: '/api/v1/simulate/:id/simulate', note: 'Run a time-range simulation before activation.' },
  { method: 'POST', path: '/api/v1/simulate/:id/first-trigger', note: 'Find the earliest trigger in a time range.' },
] as const;

const officialDocs = [
  { label: 'API Reference', href: SENTINEL_API_DOCS_URL, note: 'Routes, auth, health, delivery, and webhook payloads.' },
  { label: 'DSL Reference', href: SENTINEL_DSL_DOCS_URL, note: 'Condition shapes, metrics, raw-events, and canonical examples.' },
  { label: 'Source Model', href: SENTINEL_SOURCES_DOCS_URL, note: 'State, indexed, and raw family boundaries plus capability gating.' },
  { label: 'Auth Model', href: SENTINEL_AUTH_DOCS_URL, note: 'API keys, sessions, SIWE, and protected route rules.' },
  { label: 'Architecture', href: SENTINEL_ARCHITECTURE_DOCS_URL, note: 'Compiler, planner, evaluator, API, worker, and delivery boundaries.' },
  { label: 'GitHub', href: SENTINEL_GITHUB_URL, note: 'Upstream repository and source of truth for implementation details.' },
] as const;

const createSignalExample = `POST /api/v1/signals
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
}`;

const indexedExample = `{
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
}`;

const rawExample = `{
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
}`;

const healthExample = `{
  "status": "ok",
  "capabilities": {
    "state": {
      "provider": "rpc",
      "enabled": true
    },
    "indexed": {
      "provider": "envio",
      "enabled": false,
      "requiredEnv": ["ENVIO_ENDPOINT"]
    },
    "raw": {
      "provider": "hypersync",
      "enabled": false,
      "requiredEnv": ["ENVIO_API_TOKEN"]
    }
  }
}`;

const webhookExample = `{
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

const familyExamples = [
  {
    id: 'state',
    eyebrow: 'State / Archive Node',
    title: 'Threshold on current state',
    description:
      'Use this family for current or historical state snapshots, including `change` conditions over a window.',
    code: createSignalExample,
    language: 'shell',
    filename: 'state-create.http',
  },
  {
    id: 'indexed',
    eyebrow: 'Indexed Events',
    title: 'Protocol-aware semantic history',
    description:
      'Use indexed metrics when Sentinel already understands the protocol event semantics and derived flows.',
    code: indexedExample,
    language: 'json',
    filename: 'indexed-net-supply.json',
  },
  {
    id: 'raw',
    eyebrow: 'Raw Events',
    title: 'Decoded log scans with filters',
    description:
      'Use raw events for ERC-20 transfers, swap presets, or custom ABI events when you need log-level control.',
    code: rawExample,
    language: 'json',
    filename: 'raw-erc20-transfer.json',
  },
] as const;

const getMethodClassName = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';
    case 'POST':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    case 'PATCH':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    default:
      return 'bg-red-500/10 text-red-600 dark:text-red-400';
  }
};

export default function DocsPage() {
  return (
    <div className="bg-main min-h-screen relative">
      <div
        className="fixed inset-0 bg-dot-grid pointer-events-none opacity-40"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.12) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.12) 100%)',
        }}
        aria-hidden="true"
      />

      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="page-gutter">
          <section className="space-y-10">
            <div className="max-w-4xl">
              <SectionTag>Sentinel Docs</SectionTag>
              <h1 className="mt-5 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
                API, DSL, and delivery
                <br />
                <span className="text-[#ff6b35]">without provider confusion</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base sm:text-lg text-secondary leading-relaxed">
                Sentinel is family-first, not vendor-first. You write signals against three source
                families, the engine binds them to the current providers, and the API enforces
                capability gating when a family is unavailable.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {sourceFamilies.map((family) => (
                <Card key={family.id} className="space-y-4 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-secondary">{family.eyebrow}</p>
                      <h2 className="mt-2 font-serif text-2xl text-foreground">{family.label}</h2>
                    </div>
                    <span className="rounded-sm border border-border bg-background px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-secondary">
                      {family.provider}
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{family.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">DSL Shape</p>
                    <p className="font-mono text-xs text-foreground">{family.dsl}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">Availability</p>
                    <p className="text-sm text-foreground">{family.availability}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">Common Refs</p>
                    <div className="flex flex-wrap gap-2">
                      {family.examples.map((example) => (
                        <span
                          key={example}
                          className="rounded-sm border border-border/80 bg-background px-2 py-1 font-mono text-[11px] text-secondary"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 h-fit space-y-4">
              <Card className="space-y-4 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-secondary">On This Page</p>
                <nav className="flex flex-col gap-2 text-sm">
                  <a href="#source-model" className="text-secondary hover:text-foreground transition-colors no-underline">
                    Three Families
                  </a>
                  <a href="#auth-api" className="text-secondary hover:text-foreground transition-colors no-underline">
                    Auth and API
                  </a>
                  <a href="#examples" className="text-secondary hover:text-foreground transition-colors no-underline">
                    Canonical Examples
                  </a>
                  <a href="#delivery" className="text-secondary hover:text-foreground transition-colors no-underline">
                    Delivery Model
                  </a>
                  <a href="#official-docs" className="text-secondary hover:text-foreground transition-colors no-underline">
                    Official Sources
                  </a>
                </nav>
              </Card>

              <Card className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-secondary">Upstream</p>
                <a
                  href={SENTINEL_GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 text-foreground no-underline hover:text-[#ff6b35] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <RiGithubFill className="h-4 w-4" />
                    GitHub
                  </span>
                  <RiExternalLinkLine className="h-4 w-4 text-secondary" />
                </a>
                <a
                  href={SENTINEL_API_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 text-foreground no-underline hover:text-[#ff6b35] transition-colors"
                >
                  <span>Raw API.md</span>
                  <RiExternalLinkLine className="h-4 w-4 text-secondary" />
                </a>
                <a
                  href={SENTINEL_DSL_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 text-foreground no-underline hover:text-[#ff6b35] transition-colors"
                >
                  <span>Raw DSL.md</span>
                  <RiExternalLinkLine className="h-4 w-4 text-secondary" />
                </a>
              </Card>
            </aside>

            <div className="space-y-8">
              <section id="source-model" className="scroll-mt-24">
                <Card className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary">Source Model</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">Three families, one signal language</h2>
                  </div>
                  <p className="text-secondary leading-relaxed">
                    Sentinel’s product abstraction is <span className="text-foreground">state</span>,{' '}
                    <span className="text-foreground">indexed</span>, and <span className="text-foreground">raw</span>.
                    Users do not configure providers directly. The planner decides whether a signal is
                    served by RPC, Envio, HyperSync, or a future replacement.
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {sourceFamilies.map((family) => (
                      <div key={family.id} className="rounded-md border border-border/80 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-secondary">{family.eyebrow}</p>
                        <p className="mt-2 text-base text-foreground">{family.label}</p>
                        <p className="mt-2 text-sm text-secondary leading-relaxed">{family.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-border/80 bg-background/60 p-4">
                    <p className="text-sm text-foreground">Capability gating matters</p>
                    <p className="mt-2 text-sm text-secondary leading-relaxed">
                      `GET /health` reports which families are enabled. If a signal uses a disabled
                      family, create, update, activation, and simulation routes return `409 Conflict`
                      instead of accepting a definition that cannot execute.
                    </p>
                  </div>
                  <CodeBlock code={healthExample} language="json" filename="health-response.json" />
                </Card>
              </section>

              <section id="auth-api" className="scroll-mt-24">
                <Card className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary">Auth and API</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">One HTTP surface, multiple client modes</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {authModes.map((mode) => (
                      <div key={mode.title} className="rounded-md border border-border/80 bg-background/60 p-4">
                        <p className="text-base text-foreground">{mode.title}</p>
                        <p className="mt-2 text-sm text-secondary leading-relaxed">{mode.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md border border-border/80 bg-background/60">
                    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 border-b border-border/80 px-4 py-3 text-xs uppercase tracking-[0.22em] text-secondary">
                      <span>Method</span>
                      <span>Route</span>
                    </div>
                    <div className="divide-y divide-border/80">
                      {routes.map((route) => (
                        <div key={route.path} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-4 py-4">
                          <div>
                            <span className={`inline-flex rounded-sm px-2 py-1 text-[11px] font-mono ${getMethodClassName(route.method)}`}>
                              {route.method}
                            </span>
                          </div>
                          <div>
                            <p className="font-mono text-sm text-foreground">{route.path}</p>
                            <p className="mt-1 text-sm text-secondary">{route.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CodeBlock code={createSignalExample} language="shell" filename="create-signal.http" />
                </Card>
              </section>

              <section id="examples" className="scroll-mt-24">
                <Card className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary">Canonical Examples</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">One example for each family</h2>
                  </div>
                  <FamilyExamplesAccordion items={[...familyExamples]} defaultOpenId="state" />
                </Card>
              </section>

              <section id="delivery" className="scroll-mt-24">
                <Card className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary">Delivery</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">Telegram-native or custom webhook</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-md border border-border/80 bg-background/60 p-5">
                      <p className="text-base text-foreground">Managed Telegram delivery</p>
                      <p className="mt-2 text-sm text-secondary leading-relaxed">
                        Send{' '}
                        <span className="font-mono text-foreground">
                          delivery: {'{'} &quot;provider&quot;: &quot;telegram&quot; {'}'}
                        </span>{' '}
                        when you want Sentinel to resolve the delivery target server-side. The
                        browser should not know the internal delivery hostname.
                      </p>
                    </div>
                    <div className="rounded-md border border-border/80 bg-background/60 p-5">
                      <p className="text-base text-foreground">Custom third-party webhook</p>
                      <p className="mt-2 text-sm text-secondary leading-relaxed">
                        Send `webhook_url` only when you actually want to override managed delivery
                        and post to your own automation endpoint.
                      </p>
                    </div>
                  </div>

                  <CodeBlock code={webhookExample} language="json" filename="webhook-payload.json" />
                </Card>
              </section>

              <section id="official-docs" className="scroll-mt-24">
                <Card className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary">Official Sources</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">Upstream docs and repo</h2>
                    <p className="mt-3 text-secondary leading-relaxed">
                      This page is a clean customer-facing overview. The source of truth remains the
                      upstream Sentinel docs and repository below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {officialDocs.map((doc) => (
                      <a
                        key={doc.label}
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-border/80 bg-background/60 p-4 text-foreground no-underline transition-colors hover:border-[#ff6b35]/30 hover:text-[#ff6b35]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base">{doc.label}</p>
                            <p className="mt-1 text-sm text-secondary">{doc.note}</p>
                          </div>
                          <RiExternalLinkLine className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-md bg-[#1f2328] px-5 py-3 text-sm text-white no-underline transition-colors hover:bg-[#15181b]"
                    >
                      Open Sentinel App
                    </Link>
                    <a
                      href={SENTINEL_GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm text-secondary no-underline transition-colors hover:border-[#ff6b35]/30 hover:text-foreground"
                    >
                      View GitHub
                      <RiArrowRightLine className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
