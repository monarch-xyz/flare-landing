'use client';

import { motion } from 'framer-motion';
import { RiGitBranchLine, RiTimeLine, RiDatabase2Line, RiShieldCheckLine } from 'react-icons/ri';
import { Card } from './ui/Card';

const features = [
  {
    icon: RiGitBranchLine,
    title: 'Multi-Condition Logic',
    description: 'Combine conditions with AND/OR groups. Nest them as deep as you need. Build complex triggers from simple blocks.',
  },
  {
    icon: RiTimeLine,
    title: 'Time Windows',
    description: 'Track changes over 1 hour, 7 days, or 30 days. Compare current state to historical snapshots automatically.',
  },
  {
    icon: RiDatabase2Line,
    title: 'Protocol-Native Metrics',
    description: 'Access Morpho positions, market data, and events directly. No indexer setup required.',
  },
  {
    icon: RiShieldCheckLine,
    title: 'Battle-Tested',
    description: 'Built by the Monarch team. Production-grade reliability for critical DeFi monitoring.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Composable <span className="text-gradient-flare">Signal Primitives</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Everything you need to build sophisticated on-chain monitoring.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Card className="h-full group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#ff6b35]/10 rounded-lg transition-all duration-300 group-hover:bg-[#ff6b35]/20 group-hover:scale-110">
                    <feature.icon className="w-6 h-6 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h3 className="font-zen text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
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
