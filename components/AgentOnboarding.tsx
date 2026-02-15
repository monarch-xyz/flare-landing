'use client';

import { motion } from 'framer-motion';
import { RiRobot2Line, RiNumber1, RiNumber2, RiNumber3, RiCheckLine, RiFileCopyLine } from 'react-icons/ri';
import { useState } from 'react';
import { CodeBlock } from './ui/CodeBlock';

const step1Code = `# sentinel-skill.md

You have access to Sentinel for blockchain monitoring.

## Capabilities
- Monitor DeFi positions for changes
- Track market conditions (utilization, rates)
- Receive webhooks when conditions trigger

## Quick Setup
To monitor a position, create a signal:

POST https://api.sentinel.monarchlend.xyz/signals
Authorization: Bearer YOUR_API_KEY

{
  "name": "Position Health Alert",
  "conditions": [{
    "type": "change",
    "metric": "Morpho.Position.supplyShares",
    "direction": "decrease",
    "by": { "percent": 10 }
  }],
  "webhook_url": "YOUR_WEBHOOK_URL"
}`;

const step2Code = `curl -X POST https://api.sentinel.monarchlend.xyz/signals \\
  -H "Authorization: Bearer $SENTINEL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Whale Movement Alert",
    "conditions": [{
      "type": "threshold",
      "metric": "Morpho.Position.supplyShares",
      "operator": "lt",
      "value": 1000000,
      "chain_id": 1,
      "market_id": "0xc54d7acf...",
      "address": "0x9eb7f2c4..."
    }],
    "webhook_url": "https://your-agent.com/webhook"
  }'`;

const step3Code = `# When Sentinel triggers, you receive:
{
  "signal_id": "sig_abc123",
  "triggered": true,
  "result": {
    "condition_met": true,
    "current_value": 850000,
    "threshold": 1000000
  }
}

# Your agent can then:
→ Alert the user via Telegram/Discord
→ Execute on-chain transactions
→ Log to monitoring systems
→ Trigger other automations`;

export function AgentOnboarding() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      number: 1,
      title: 'Add Sentinel to your agent skills',
      description: 'Include the Sentinel skill in your agent\'s capabilities. This teaches your agent how to create and manage blockchain monitors.',
      code: step1Code,
      language: 'markdown',
      filename: 'sentinel-skill.md',
    },
    {
      number: 2,
      title: 'Create your first signal',
      description: 'Your agent calls the Sentinel API to register a monitoring condition. One API call, and Sentinel handles the rest.',
      code: step2Code,
      language: 'bash',
      filename: 'create-signal.sh',
    },
    {
      number: 3,
      title: 'React to events',
      description: 'When conditions trigger, Sentinel sends a webhook to your agent. Take action automatically—no polling required.',
      code: step3Code,
      language: 'json',
      filename: 'webhook-response.md',
    },
  ];

  return (
    <section id="onboarding" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div
        className="absolute inset-0 bg-line-grid opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <RiRobot2Line className="w-6 h-6 text-[#ff6b35]" />
            <span className="text-sm font-medium text-[#ff6b35]">Agent Integration Guide</span>
          </div>
          <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Get Your Agent <span className="text-gradient-sentinel">Watching in Minutes</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Three steps to give your AI agent eyes on the blockchain. No infrastructure setup, no complex indexers.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step indicator */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-sentinel rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-zen text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-secondary mb-4">{step.description}</p>
                  
                  {/* Code block with copy button */}
                  <div className="relative group">
                    <button
                      onClick={() => copyToClipboard(step.code, step.number)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-md bg-background/50 hover:bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Copy code"
                    >
                      {copiedStep === step.number ? (
                        <RiCheckLine className="w-4 h-4 text-green-500" />
                      ) : (
                        <RiFileCopyLine className="w-4 h-4 text-secondary" />
                      )}
                    </button>
                    <CodeBlock 
                      code={step.code} 
                      language={step.language}
                      filename={step.filename}
                    />
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-[#ff6b35]/50 to-transparent -translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-secondary mb-4">Ready to give your agent superpowers?</p>
          <a
            href="https://github.com/monarch-xyz/sentinel/blob/main/docs/ARCHITECTURE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-sentinel text-white font-medium rounded-md hover:opacity-90 transition-opacity no-underline"
          >
            <RiRobot2Line className="w-5 h-5" />
            Read Full Agent Docs
          </a>
        </motion.div>
      </div>
    </section>
  );
}
