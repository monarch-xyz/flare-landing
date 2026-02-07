'use client';

import { motion } from 'framer-motion';
import { RiCodeSSlashLine, RiCloudLine, RiNotification3Line } from 'react-icons/ri';

const steps = [
  {
    icon: RiCodeSSlashLine,
    title: 'Define',
    description: 'Write conditions in simple JSON DSL. Thresholds, changes, time windows — all composable.',
    codeLines: [
      { key: '"type"', value: '"change"' },
      { key: '"by"', value: '{ "percent": 20 }' },
    ],
  },
  {
    icon: RiCloudLine,
    title: 'Deploy',
    description: 'Register your signal via REST API. Flare handles the indexing and evaluation.',
    codeLines: [
      { method: 'POST', path: '/signals' },
      { key: null, value: '{ "name": "Whale Alert" }' },
    ],
  },
  {
    icon: RiNotification3Line,
    title: 'React',
    description: 'Receive webhooks when conditions trigger. Your agent takes action automatically.',
    codeLines: [
      { key: 'webhook_url', value: '"..."' },
      { arrow: true, value: '{ triggered: true }' },
    ],
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
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="relative"
            >
              {/* Step number */}
              <motion.div 
                className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-7 h-7 md:w-8 md:h-8 bg-gradient-flare rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg shadow-[#ff6b35]/30"
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>

              {/* Card */}
              <div className="bg-background rounded-lg p-5 md:p-6 border border-border h-full transition-all duration-300 hover:border-[#ff6b35]/30 hover:shadow-lg hover:shadow-[#ff6b35]/5">
                <step.icon className="w-8 h-8 md:w-10 md:h-10 text-[#ff6b35] mb-3 md:mb-4" />
                <h3 className="font-zen text-lg md:text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-secondary mb-4 text-sm leading-relaxed">{step.description}</p>
                
                {/* Mini code block with syntax highlighting */}
                <div className="text-xs bg-[#011627] dark:bg-[#011627] rounded-md p-3 overflow-x-auto font-mono custom-scrollbar">
                  {step.codeLines.map((line, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {'method' in line && line.method && (
                        <>
                          <span className="text-green-400">{line.method}</span>
                          <span className="text-gray-300"> {line.path}</span>
                        </>
                      )}
                      {'arrow' in line && line.arrow && (
                        <>
                          <span className="text-[#ff6b35]">→</span>
                          <span className="text-gray-300"> {line.value}</span>
                        </>
                      )}
                      {'key' in line && line.key && (
                        <>
                          <span className="text-[#7fdbca]">{line.key}</span>
                          <span className="text-gray-300">: </span>
                          <span className="text-[#ecc48d]">{line.value}</span>
                        </>
                      )}
                      {'key' in line && line.key === null && (
                        <span className="text-gray-300">{line.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector line - vertical on mobile, horizontal on desktop */}
              {index < steps.length - 1 && (
                <>
                  {/* Mobile connector (vertical) */}
                  <div className="md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-[#ff6b35]/50 to-transparent" />
                  {/* Desktop connector (horizontal) */}
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#ff6b35]/50 to-transparent" />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
