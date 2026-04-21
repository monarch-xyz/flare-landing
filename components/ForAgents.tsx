'use client';

import { motion } from 'framer-motion';
import { RiRobot2Line } from 'react-icons/ri';
import { SectionTag } from './ui/SectionTag';
import { CodeBlock } from './ui/CodeBlock';

const agentCode = `app.post('/iruka-webhook', async (req, res) => {
  const { signal_id, signal_name, context, conditions_met } = req.body;

  await routeSignal({
    signalId: signal_id,
    signalName: signal_name,
    chainId: context?.chain_id,
    marketId: context?.market_id,
    matchedConditions: conditions_met,
  });

  res.status(200).send('OK');
});`;

const agentNotes = [
  'One authoring surface across state, indexed, and raw sources.',
  'Structured webhook payloads with scope, context, and condition explanations.',
  'Continuous monitoring without custom polling loops or brittle event glue.',
];

export function ForAgents() {
  return (
    <section id="for-agents" className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="ui-panel p-6 sm:p-7"
          >
            <SectionTag>For Agents</SectionTag>
            <h2 className="ui-section-title mt-5">Give agents one durable detection surface instead of a pile of moving chain reads.</h2>
            <p className="ui-copy mt-4">
              Iruka works naturally with agents because the authoring model is structured enough for them to
              express intent, and the runtime is durable enough to keep evaluating after they stop polling.
            </p>

            <div className="mt-8 space-y-3">
              {agentNotes.map((note) => (
                <div key={note} className="ui-panel-ghost flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-copper)_10%,var(--surface-inset))] text-[color:var(--signal-copper)]">
                    <RiRobot2Line className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-secondary">{note}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="ui-panel p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="ui-kicker">Webhook Handler</div>
                <h3 className="mt-3 font-display text-[1.8rem] leading-none text-foreground">Route the signal, not the noise.</h3>
              </div>
              <span className="ui-chip" data-tone="accent">
                Runtime
              </span>
            </div>

            <div className="mt-6">
              <CodeBlock code={agentCode} language="javascript" filename="webhook-handler.js" tone="light" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
