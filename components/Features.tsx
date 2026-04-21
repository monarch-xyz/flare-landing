'use client';

import { motion } from 'framer-motion';
import { RiDatabase2Line, RiGitBranchLine, RiShieldCheckLine, RiTimeLine } from 'react-icons/ri';
import { Card } from './ui/Card';

const features = [
  {
    icon: RiGitBranchLine,
    title: 'Composable logic',
    description: 'Model conditions with nested groups and reusable threshold patterns that mirror real strategy logic.',
  },
  {
    icon: RiTimeLine,
    title: 'Window-aware alerting',
    description: 'Use time windows and repeat policy to suppress churn before it ever reaches operators or agents.',
  },
  {
    icon: RiDatabase2Line,
    title: 'Multiple source families',
    description: 'Author one watch across current state, indexed history, and raw event scans without splitting tools.',
  },
  {
    icon: RiShieldCheckLine,
    title: 'Structured delivery',
    description: 'Deliver matched conditions and scope context instead of a noisy event stream that still needs interpretation.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="mx-auto max-w-3xl text-center">
          <div className="ui-kicker justify-center">System Traits</div>
          <h2 className="ui-section-title mt-5">Iruka stays focused on disciplined detection instead of ornamental dashboard clutter.</h2>
          <p className="ui-copy mx-auto mt-4">
            The design system should reflect the same posture as the product: quiet where it can be, explicit when it matters.
          </p>
        </div>

        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
            >
              <Card className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[0.45rem] border border-border bg-[color:color-mix(in_oklch,var(--signal-copper)_10%,var(--surface-inset))] text-[color:var(--signal-copper)]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-[1.35rem] leading-none text-foreground">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-secondary">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
