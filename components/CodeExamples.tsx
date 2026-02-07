'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/CodeBlock';
import { RiFlashlightLine, RiShieldLine, RiStackLine } from 'react-icons/ri';

const examples = [
  {
    id: 'whale-exit',
    icon: RiFlashlightLine,
    title: 'Whale Exit Alert',
    description: 'Detect when a large position decreases by 20% over 7 days',
    filename: 'whale-alert.json',
    highlightLines: [4, 5, 6, 7],
    code: `{
  "name": "Whale Exit Alert",
  "window": { "duration": "7d" },
  "conditions": [{
    "type": "change",
    "metric": "Morpho.Position.supplyShares",
    "direction": "decrease",
    "by": { "percent": 20 },
    "chain_id": 1,
    "market_id": "0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41",
    "address": "0x9eb7f..."
  }],
  "webhook_url": "https://your-agent.com/alerts"
}`,
  },
  {
    id: 'utilization',
    icon: RiShieldLine,
    title: 'Utilization Spike',
    description: 'Alert when market utilization exceeds 95%',
    filename: 'utilization-alert.json',
    highlightLines: [4, 5, 6],
    code: `{
  "name": "High Utilization Warning",
  "conditions": [{
    "type": "threshold",
    "metric": "Morpho.Market.utilization",
    "operator": "gt",
    "value": 0.95,
    "chain_id": 1,
    "market_id": "0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc"
  }],
  "webhook_url": "https://your-agent.com/alerts",
  "cooldown": "1h"
}`,
  },
  {
    id: 'multi-condition',
    icon: RiStackLine,
    title: 'Multi-Condition',
    description: 'Combine conditions with AND/OR logic',
    filename: 'complex-signal.json',
    highlightLines: [4, 5],
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
        "value": 0.90,
        "chain_id": 1,
        "market_id": "0x..."
      },
      {
        "type": "change",
        "metric": "Morpho.Market.totalBorrowAssets",
        "direction": "increase",
        "by": { "percent": 10 },
        "window": { "duration": "24h" }
      }
    ]
  }],
  "webhook_url": "https://your-agent.com/alerts"
}`,
  },
];

export function CodeExamples() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExample = examples[activeIndex];

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
                key={example.id}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                  activeIndex === index
                    ? 'bg-gradient-flare text-white shadow-lg shadow-[#ff6b35]/25'
                    : 'bg-background border border-border text-secondary hover:text-foreground hover:border-[#ff6b35]/30'
                )}
              >
                <example.icon className={cn(
                  'w-4 h-4',
                  activeIndex === index ? 'text-white' : 'text-[#ff6b35]'
                )} />
                {example.title}
              </motion.button>
            ))}
          </div>

          {/* Active example card */}
          <motion.div 
            className="bg-background rounded-xl border border-border overflow-hidden shadow-lg"
            layout
          >
            {/* Example description header */}
            <div className="px-5 sm:px-6 py-4 border-b border-border bg-gradient-to-r from-[#ff6b35]/5 to-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-flare flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff6b35]/20">
                    <activeExample.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-zen font-bold text-lg">{activeExample.title}</h3>
                    <p className="text-secondary text-sm">{activeExample.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Code block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CodeBlock 
                  code={activeExample.code} 
                  language="json"
                  filename={activeExample.filename}
                  showLineNumbers
                  highlightLines={activeExample.highlightLines}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Tip below */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-secondary text-sm mt-6"
          >
            <span className="text-[#ff6b35]">Pro tip:</span> Highlighted lines show the key configuration for each signal type.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
