'use client';

import { motion } from 'framer-motion';
import { SectionTag } from './ui/SectionTag';
import { GridDivider } from './ui/GridDivider';

const capabilities = [
  {
    title: 'Aggregate, don\'t react',
    description: 'Net flows, rolling windows, holder percentiles. Turn hundreds of events into one meaningful signal.',
  },
  {
    title: 'Watch across time',
    description: '"Net deposits dropped 20% over 7 days from top holders." Compare trends, not snapshots.',
  },
  {
    title: 'Composable conditions',
    description: 'Combine thresholds with AND/OR logic. Alert on complex patterns, not simple triggers.',
  },
  {
    title: 'Context in every alert',
    description: 'Know exactly what triggered: actual values, thresholds crossed, addresses that moved.',
  },
];

export function Capabilities() {
  return (
    <section className="relative">
      {/* Grid divider */}
      <GridDivider rows={4} />

      {/* Section with line grid background */}
      <div className="relative py-16 md:py-24 bg-surface">
        <div
          className="absolute inset-0 bg-line-grid opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <SectionTag>Capabilities</SectionTag>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mt-4 mb-3">
              What Sentinel <span className="text-[#ff6b35]">enables</span>
            </h2>
            <p className="text-secondary max-w-xl">
              A query engine that runs continuously, evaluating conditions against live blockchain state.
            </p>
          </motion.div>

          {/* Capabilities grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-5 bg-background rounded-lg border border-border hover:border-[#ff6b35]/20 transition-colors"
              >
                <h3 className="font-medium mb-2">{cap.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
