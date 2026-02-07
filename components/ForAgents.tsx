'use client';

import { motion } from 'framer-motion';
import { RiRobot2Line, RiArrowRightSLine, RiFlashlightLine, RiTerminalLine } from 'react-icons/ri';
import { CodeBlock } from './ui/CodeBlock';

const webhookPayloadCode = `{
  "signal_id": "sig_abc123",
  "name": "Whale Exit Alert",
  "triggered": true,
  "evaluated_at": "2024-01-15T12:00:00Z",
  "result": {
    "condition_met": true,
    "current_value": 245000,
    "previous_value": 350000,
    "change_percent": -30
  },
  "scope": {
    "chain_id": 1,
    "market_id": "0xc54d7acf...",
    "address": "0x9eb7f..."
  }
}`;

const agentActionCode = `// Your webhook handler
app.post('/flare-webhook', async (req, res) => {
  const { signal_id, result, scope } = req.body;
  
  if (result.condition_met) {
    // Analyze the trigger
    const severity = result.change_percent < -25 
      ? 'critical' 
      : 'warning';
    
    // Take action
    await notifyTeam(severity, result);
    await logToMonitoring(signal_id, result);
    
    // Optional: Trigger on-chain action
    if (severity === 'critical') {
      await rebalancePosition(scope);
    }
  }
  
  res.status(200).send('OK');
});`;

export function ForAgents() {
  return (
    <section id="for-agents" className="relative py-24 md:py-32 overflow-hidden">
      {/* Accent glow */}
      <div
        className="absolute -right-48 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-lg border border-border w-full sm:w-auto"
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 107, 53, 0.3)' }}
                transition={{ duration: 0.2 }}
              >
                <RiFlashlightLine className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm font-medium">Flare Signal</span>
              </motion.div>
              <RiArrowRightSLine className="w-6 h-6 text-secondary rotate-90 sm:rotate-0 self-center" />
              <motion.div 
                className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-lg border border-border w-full sm:w-auto"
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 107, 53, 0.3)' }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">🔔</span>
                <span className="text-sm font-medium">Webhook</span>
              </motion.div>
              <RiArrowRightSLine className="w-6 h-6 text-secondary rotate-90 sm:rotate-0 self-center" />
              <motion.div 
                className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-lg border border-border w-full sm:w-auto"
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 107, 53, 0.3)' }}
                transition={{ duration: 0.2 }}
              >
                <RiRobot2Line className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm font-medium">Agent Action</span>
              </motion.div>
            </div>

            {/* Features list */}
            <ul className="space-y-3 text-secondary">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                <span>Signed webhooks with HMAC verification</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                <span>Idempotency keys for reliable delivery</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                <span>Rich payload with evaluation context</span>
              </li>
            </ul>
          </motion.div>

          {/* Right - code examples */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Webhook payload */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiFlashlightLine className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-sm font-medium text-secondary">Webhook Payload</span>
              </div>
              <CodeBlock 
                code={webhookPayloadCode} 
                language="json"
                filename="webhook-payload.json"
                showLineNumbers
                highlightLines={[4, 7, 8, 9]}
              />
            </div>

            {/* Agent handler */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiTerminalLine className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-sm font-medium text-secondary">Handle in Your Agent</span>
              </div>
              <CodeBlock 
                code={agentActionCode} 
                language="javascript"
                filename="webhook-handler.js"
                showLineNumbers
                highlightLines={[5, 10, 11, 15]}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
