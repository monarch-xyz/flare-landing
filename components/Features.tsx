'use client';

import { motion } from 'framer-motion';
import { RiGitBranchLine, RiTimeLine, RiDatabase2Line, RiShieldCheckLine } from 'react-icons/ri';
import { Card } from './ui/Card';

const features = [
  {
    icon: RiGitBranchLine,
    title: 'Flexible Composable Logic',
    description: 'Combine conditions with nested AND/OR groups and reusable blocks to model how real strategies behave.',
  },
  {
    icon: RiTimeLine,
    title: 'No-Noise Alerting',
    description: 'Apply time windows and threshold logic so low-signal churn is filtered out before webhook delivery.',
  },
  {
    icon: RiDatabase2Line,
    title: 'Dynamic Query Engine',
    description: 'Query protocol state and changes continuously instead of wiring one-off event listeners.',
  },
  {
    icon: RiShieldCheckLine,
    title: 'Smart Signal Filtering',
    description: 'Trigger only when combined conditions are met, not just when any single event happens.',
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
            Flexible <span className="text-[#ff6b35]">Conditions That Compose</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Build dynamic, high-signal monitoring logic without drowning your agent in noisy alerts.
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
