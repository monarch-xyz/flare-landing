'use client';

import { motion } from 'framer-motion';
import { RiCloudLine, RiCodeSSlashLine, RiNotification3Line } from 'react-icons/ri';
import { CodeBlock } from './ui/CodeBlock';

const steps = [
  {
    icon: RiCodeSSlashLine,
    title: 'Define',
    description: 'Compose the condition with metric sugar, raw state refs, or raw-event scans.',
    code: `{
  "logic": "AND",
  "window": { "duration": "7d" },
  "conditions": [{ "...": "..." }]
}`,
  },
  {
    icon: RiCloudLine,
    title: 'Register',
    description: 'Post the signal once. Iruka owns the continuous evaluation loop from there.',
    code: `POST /api/v1/signals
X-API-Key: iruka_...
{ "name": "High-Signal Watch" }`,
  },
  {
    icon: RiNotification3Line,
    title: 'React',
    description: 'Receive the structured alert only when the full pattern actually resolves.',
    code: `{
  "triggered": true,
  "conditions_met": [],
  "context": { "chain_id": 1 }
}`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="mx-auto max-w-3xl text-center">
          <div className="ui-kicker justify-center">Flow</div>
          <h2 className="ui-section-title mt-5">Three disciplined steps from watch definition to structured delivery.</h2>
          <p className="ui-copy mx-auto mt-4">
            The product flow should read like the monitoring model itself: define the condition, let Iruka keep watch, then react only when signal arrives.
          </p>
        </div>

        <motion.div
          className="mt-10 grid gap-4 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
              className="ui-panel p-5"
            >
              <div className="flex items-center justify-between">
                <span className="ui-chip" data-tone="accent">
                  0{index + 1}
                </span>
                <step.icon className="h-5 w-5 text-[color:var(--signal-copper)]" />
              </div>
              <h3 className="mt-5 font-display text-[1.55rem] leading-none text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{step.description}</p>
              <div className="mt-5">
                <CodeBlock code={step.code} tone="light" showHeader={false} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
