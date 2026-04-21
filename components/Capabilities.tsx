'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionTag } from './ui/SectionTag';
import { CodeBlock } from './ui/CodeBlock';

type UseCase = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  code: string;
};

const useCases: UseCase[] = [
  {
    id: 'vault-withdrawal-cluster',
    title: 'Vault withdrawal cluster',
    summary: 'Contract-scoped state monitoring for coordinated ERC-4626 share withdrawals.',
    details: [
      'Watch 3 of 5 tracked owners over one window.',
      'Use stable state aliases instead of rebuilding plumbing.',
      'Author large integer thresholds as decimal strings when needed.',
    ],
    code: `{
  "name": "Vault withdrawal cluster",
  "definition": {
    "scope": { "chains": [1], "protocol": "all" },
    "conditions": [
      {
        "type": "group",
        "requirement": { "count": 3, "of": 5 },
        "conditions": [
          {
            "type": "change",
            "metric": "ERC4626.Position.shares",
            "direction": "decrease",
            "by": { "absolute": "1000000000000000000" }
          }
        ]
      }
    ],
    "window": { "duration": "7d" }
  }
}`,
  },
  {
    id: 'treasury-outflow',
    title: 'Treasury outflow',
    summary: 'Raw-event monitoring for large ERC-20 movement out of one treasury or vault.',
    details: [
      'Read decoded Transfer logs directly.',
      'Filter to one sender and one token.',
      'Trigger only when gross outflow crosses the threshold.',
    ],
    code: `{
  "name": "Treasury outflow",
  "definition": {
    "scope": { "chains": [1], "protocol": "all" },
    "conditions": [
      {
        "type": "raw-events",
        "aggregation": "sum",
        "field": "value",
        "operator": ">=",
        "value": 5000000,
        "filters": [{ "field": "from", "op": "eq", "value": "0xTreasury" }]
      }
    ],
    "window": { "duration": "2h" }
  }
}`,
  },
];

export function Capabilities() {
  const [activeUseCaseId, setActiveUseCaseId] = useState(useCases[0].id);
  const activeUseCase = useCases.find((useCase) => useCase.id === activeUseCaseId) ?? useCases[0];

  return (
    <section className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
          <div className="ui-panel p-6 sm:p-7">
            <SectionTag>Detection Patterns</SectionTag>
            <h2 className="ui-section-title mt-5">Iruka can watch subtle movement without collapsing back to one-off infra.</h2>
            <p className="ui-copy mt-4">
              Pick a concrete pattern to inspect how the DSL turns a noisy chain surface into one durable watch.
            </p>

            <div className="mt-8 space-y-3">
              {useCases.map((useCase, index) => {
                const isActive = useCase.id === activeUseCaseId;

                return (
                  <motion.button
                    key={useCase.id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    onClick={() => setActiveUseCaseId(useCase.id)}
                    data-active={isActive}
                    className={cn('ui-option w-full px-4 py-4 text-left', isActive && 'text-foreground')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="ui-kicker">{isActive ? 'Selected Pattern' : 'Pattern'}</div>
                        <p className="mt-3 font-display text-[1.35rem] leading-none text-foreground">
                          {useCase.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-primary)]">{useCase.summary}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeUseCase.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="ui-panel p-6 sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="ui-chip" data-tone="accent">
                {activeUseCase.title}
              </span>
              <span className="ui-chip">DSL Preview</span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.64fr)_minmax(0,1fr)]">
              <div className="space-y-3">
                {activeUseCase.details.map((detail) => (
                  <div key={detail} className="ui-panel-ghost px-4 py-3">
                    <p className="text-sm leading-relaxed text-[color:var(--ink-primary)]">{detail}</p>
                  </div>
                ))}
              </div>

              <CodeBlock
                code={activeUseCase.code}
                language="json"
                filename={`${activeUseCase.id}.json`}
                showLineNumbers
                tone="light"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
