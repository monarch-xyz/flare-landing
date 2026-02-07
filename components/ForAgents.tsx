'use client';

import { motion } from 'framer-motion';
import { RiRobot2Line, RiArrowRightSLine, RiFlashlightLine } from 'react-icons/ri';
import { CodeBlock } from './ui/CodeBlock';

const agentSkillCode = `# Flare Monitoring Skill

## Setup
Register signals for your monitored positions:
\`\`\`bash
curl -X POST https://api.flare.monarch.xyz/signals \\
  -H "Authorization: Bearer $API_KEY" \\
  -d @signal.json
\`\`\`

## Webhook Handler
When triggered, your agent receives:
\`\`\`json
{
  "signal_id": "sig_abc123",
  "triggered": true,
  "condition": "Whale position dropped 25%",
  "timestamp": "2024-01-15T12:00:00Z"
}
\`\`\`

## Agent Response
→ Analyze the trigger event
→ Decide on action (alert, rebalance, exit)
→ Execute or notify human`;

export function ForAgents() {
  return (
    <section id="for-agents" className="relative py-24 md:py-32 overflow-hidden">
      {/* Accent glow */}
      <div
        className="absolute -right-48 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <RiRobot2Line className="w-6 h-6 text-[#ff6b35]" />
              <span className="text-sm font-medium text-[#ff6b35]">Built for AI Agents</span>
            </div>

            <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Your Agent&apos;s <span className="text-gradient-flare">Event Source</span>
            </h2>

            <p className="text-secondary text-lg mb-8 leading-relaxed">
              AI agents need reliable blockchain data triggers. Flare provides the event layer that 
              connects on-chain activity to your agent&apos;s actions. No polling, no infrastructure — 
              just webhooks when it matters.
            </p>

            {/* Flow diagram */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-border">
                <RiFlashlightLine className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm font-medium">Flare Signal</span>
              </div>
              <RiArrowRightSLine className="w-6 h-6 text-secondary" />
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-border">
                <span className="text-lg">🔔</span>
                <span className="text-sm font-medium">Webhook</span>
              </div>
              <RiArrowRightSLine className="w-6 h-6 text-secondary" />
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-border">
                <RiRobot2Line className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm font-medium">Agent Action</span>
              </div>
            </div>
          </motion.div>

          {/* Right - code example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm font-mono text-secondary ml-2">agent-skill.md</span>
              </div>
              <CodeBlock code={agentSkillCode} language="markdown" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
