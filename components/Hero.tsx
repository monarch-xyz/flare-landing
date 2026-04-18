'use client';

import { motion } from 'framer-motion';
import { RiArrowDownLine, RiArrowRightLine, RiArrowRightUpLine } from 'react-icons/ri';
import { CodeBlock } from './ui/CodeBlock';
import { SectionTag } from './ui/SectionTag';
import { MEGABAT_DOCS_OVERVIEW_URL } from '@/lib/megabat-links';

const previewSignals = [
  { label: 'State', value: 'Vault shares dropped 22% across 3 of 5 addresses', tone: 'accent' },
  { label: 'Indexed', value: 'Net supply turned negative over the last 6h', tone: 'default' },
  { label: 'Raw', value: 'USDC transfer burst crossed the 1M threshold', tone: 'telegram' },
] as const;

const previewCode = `signal.when({
  state: "ERC4626.Position.shares",
  indexed: "Morpho.Flow.netSupply",
  raw: "erc20_transfer",
  logic: "AND",
  window: "6h"
});`;

export function Hero() {
  const scrollToSection = () => {
    const element = document.getElementById('story');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-18 md:pt-34 md:pb-24">
      <div className="absolute inset-0 bg-dot-grid opacity-[0.1]" aria-hidden="true" />
      <div className="absolute inset-0 grid-radial-fade bg-line-grid opacity-[0.08]" aria-hidden="true" />

      <div className="page-gutter relative z-10">
        <div className="ui-hero px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="relative z-10 grid items-end gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <SectionTag>Continuous Detection</SectionTag>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="mt-6 ui-kicker"
              >
                Built For Operators And Agent Builders
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14 }}
                className="ui-display mt-5"
              >
                Let Megabat listen through the noise until a real signal resolves.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="ui-copy mt-6 text-base sm:text-lg"
              >
                Megabat watches archive RPC state, indexed history, and raw events in one loop.
                You describe the condition that matters. Megabat keeps watch until it becomes true.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.26 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <button onClick={scrollToSection} className="w-fit">
                  <span className="ui-button px-5 py-3.5" data-variant="primary">
                    Watch The Flow
                    <RiArrowDownLine className="h-4 w-4" />
                  </span>
                </button>
                <a href={MEGABAT_DOCS_OVERVIEW_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <span className="ui-button px-5 py-3.5" data-variant="secondary">
                    Read The Docs
                    <RiArrowRightUpLine className="h-4 w-4" />
                  </span>
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="ui-panel space-y-6 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="ui-kicker">Watch Loop</div>
                  <h2 className="mt-3 font-display text-[1.8rem] leading-none text-foreground">
                    One signal surface.
                  </h2>
                </div>
                <span className="ui-chip" data-tone="accent">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                {previewSignals.map((signal, index) => (
                  <motion.div
                    key={signal.value}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.32, delay: 0.34 + index * 0.08 }}
                    className="ui-panel-ghost px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="ui-chip" data-tone={signal.tone}>
                        {signal.label}
                      </span>
                      <span className="text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
                        Listening
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-secondary">{signal.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="ui-panel-ghost p-4">
                <div className="ui-kicker">Definition</div>
                <div className="mt-4">
                  <CodeBlock code={previewCode} language="typescript" showHeader={false} tone="light" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
