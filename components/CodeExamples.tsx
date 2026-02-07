'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {examples.map((example, index) => (
              <button
                key={example.title}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  activeIndex === index
                    ? 'bg-gradient-flare text-white'
                    : 'bg-background border border-border text-secondary hover:text-foreground hover:border-[#ff6b35]/30'
                )}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Active example */}
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-zen font-bold">{examples[activeIndex].title}</h3>
              <p className="text-secondary text-sm">{examples[activeIndex].description}</p>
            </div>
            <pre className="p-6 overflow-x-auto custom-scrollbar text-sm">
              <code className="text-foreground">{examples[activeIndex].code}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
