'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiCheckLine, RiFileCopyLine, RiRobot2Line } from 'react-icons/ri';
import { CodeBlock } from './ui/CodeBlock';
import { IRUKA_ARCHITECTURE_DOCS_URL } from '@/lib/iruka-links';

const steps = [
  {
    number: 1,
    title: 'Teach the agent the surface',
    description: 'Give the agent the Iruka primitives and DSL shape it can author against.',
    code: `## Capabilities
- Monitor open data sources for changes
- Track market state aliases
- Query raw event presets
- Receive structured webhooks`,
    language: 'markdown',
    filename: 'iruka-skill.md',
  },
  {
    number: 2,
    title: 'Create the signal',
    description: 'Post one definition to Iruka instead of building bespoke watcher loops.',
    code: `curl -X POST https://your-iruka-host/api/v1/signals \\
  -H "X-API-Key: $IRUKA_API_KEY" \\
  -H "Content-Type: application/json"`,
    language: 'bash',
    filename: 'create-signal.sh',
  },
  {
    number: 3,
    title: 'React to delivery',
    description: 'Use the webhook payload as the execution surface for downstream automation.',
    code: `{
  "signal_id": "sig_abc123",
  "conditions_met": [],
  "context": { "chain_id": 1 }
}`,
    language: 'json',
    filename: 'webhook-response.json',
  },
];

export function AgentOnboarding() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <section id="onboarding" className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="mx-auto max-w-3xl text-center">
          <div className="ui-kicker justify-center">Agent Integration</div>
          <h2 className="ui-section-title mt-5">Three clear handoff steps for agent-based monitoring.</h2>
          <p className="ui-copy mx-auto mt-4">
            The integration flow should be teachable, inspectable, and deliberate. No extra ornamental onboarding layer is needed.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="ui-panel grid gap-5 px-5 py-5 lg:grid-cols-[84px_minmax(0,0.72fr)_minmax(0,1fr)] lg:items-start"
            >
              <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                <span className="ui-chip" data-tone="accent">
                  0{step.number}
                </span>
                <RiRobot2Line className="h-5 w-5 text-[color:var(--signal-copper)]" />
              </div>

              <div>
                <h3 className="font-display text-[1.5rem] leading-none text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{step.description}</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => copyToClipboard(step.code, step.number)}
                  className="ui-button absolute right-3 top-3 z-10 px-3 py-2"
                  data-variant="secondary"
                  aria-label="Copy code"
                  type="button"
                >
                  {copiedStep === step.number ? <RiCheckLine className="h-4 w-4" /> : <RiFileCopyLine className="h-4 w-4" />}
                </button>
                <CodeBlock code={step.code} language={step.language} filename={step.filename} tone="light" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href={IRUKA_ARCHITECTURE_DOCS_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
            <span className="ui-button px-5 py-3.5" data-variant="primary">
              <RiRobot2Line className="h-5 w-5" />
              Read Full Agent Docs
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
