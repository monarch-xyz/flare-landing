'use client';

import { motion } from 'framer-motion';
import { RiCodeSSlashLine, RiCloudLine, RiNotification3Line } from 'react-icons/ri';

const steps = [
  {
    icon: RiCodeSSlashLine,
    title: 'Define',
    description: 'Write conditions in simple JSON DSL. Thresholds, changes, time windows — all composable.',
    code: `"type": "change"
"by": { "percent": 20 }`,
  },
  {
    icon: RiCloudLine,
    title: 'Deploy',
    description: 'Register your signal via REST API. Flare handles the indexing and evaluation.',
    code: `POST /signals
{ "name": "Whale Alert" }`,
  },
  {
    icon: RiNotification3Line,
    title: 'React',
    description: 'Receive webhooks when conditions trigger. Your agent takes action automatically.',
    code: `webhook_url: "..."
→ { triggered: true }`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div
        className="absolute inset-0 bg-line-grid opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Three Steps to <span className="text-gradient-flare">Automation</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            From definition to action in minutes, not hours.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-flare rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-background rounded-lg p-6 border border-border h-full">
                <step.icon className="w-10 h-10 text-[#ff6b35] mb-4" />
                <h3 className="font-zen text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-secondary mb-4 text-sm leading-relaxed">{step.description}</p>
                
                {/* Mini code block */}
                <pre className="text-xs bg-surface rounded-md p-3 overflow-x-auto">
                  <code className="text-[#ff6b35]/80">{step.code}</code>
                </pre>
              </div>

              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#ff6b35]/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
