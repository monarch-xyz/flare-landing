'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/CodeBlock';

const examples = [
  {
    title: 'Whale Exit Alert',
    description: 'Detect when a large position decreases by 20% over 7 days',
    code: `{
  "name": "Whale Exit Alert",
  "window": { "duration": "7d" },
  "conditions": [{
    "type": "change",
    "metric": "Morpho.Position.supplyShares",
    "direction": "decrease",
    "by": { "percent": 20 },
    "chain_id": 1,
    "market_id": "0xc54d...",
    "address": "0xwhale..."
  }],
  "webhook_url": "https://your-agent.com/alerts"
}`,
  },
  {
    title: 'Utilization Spike',
    description: 'Alert when market utilization exceeds 95%',
    code: `{
  "name": "High Utilization Warning",
  "conditions": [{
    "type": "threshold",
    "metric": "Morpho.Market.utilization",
    "operator": "gt",
    "value": 0.95,
    "chain_id": 1,
    "market_id": "0xmarket..."
  }],
  "webhook_url": "https://your-agent.com/alerts"
}`,
  },
  {
    title: 'Multi-Condition',
    description: 'Combine conditions with AND/OR logic',
    code: `{
  "name": "Complex Signal",
  "conditions": [{
    "type": "group",
    "operator": "AND",
    "conditions": [
      {
        "type": "threshold",
        "metric": "Morpho.Market.utilization",
        "operator": "gt",
        "value": 0.90
      },
      {
        "type": "change",
        "metric": "Morpho.Market.totalBorrowAssets",
        "direction": "increase",
        "by": { "percent": 10 }
      }
    ]
  }]
}`,
  },
];

export function CodeExamples() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="examples" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div
        className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Real <span className="text-gradient-flare">Examples</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Copy, paste, deploy. It&apos;s that simple.
          </p>
        </motion.div>

        {/* Example tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Tab buttons - horizontal scroll on mobile */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {examples.map((example, index) => (
              <motion.button
                key={example.title}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                  activeIndex === index
                    ? 'bg-gradient-flare text-white shadow-lg shadow-[#ff6b35]/20'
                    : 'bg-background border border-border text-secondary hover:text-foreground hover:border-[#ff6b35]/30'
                )}
              >
                {example.title}
              </motion.button>
            ))}
          </div>

          {/* Active example with animated transition */}
          <motion.div 
            className="bg-background rounded-lg border border-border overflow-hidden"
            layout
          >
            <div className="px-4 sm:px-6 py-4 border-b border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-zen font-bold">{examples[activeIndex].title}</h3>
                  <p className="text-secondary text-sm">{examples[activeIndex].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CodeBlock code={examples[activeIndex].code} language="json" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
