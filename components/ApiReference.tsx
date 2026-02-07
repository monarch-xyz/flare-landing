'use client';

import { motion } from 'framer-motion';
import { RiArrowRightLine } from 'react-icons/ri';
import { Button } from './ui/Button';

const endpoints = [
  {
    method: 'POST',
    path: '/signals',
    description: 'Create a new signal with conditions and webhook URL',
  },
  {
    method: 'GET',
    path: '/signals/:id',
    description: 'Get signal status, last evaluation, and history',
  },
  {
    method: 'POST',
    path: '/simulate',
    description: 'Test your signal definition without deploying',
  },
  {
    method: 'DELETE',
    path: '/signals/:id',
    description: 'Remove a signal and stop monitoring',
  },
];

export function ApiReference() {
  return (
    <section id="api" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-zen text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Simple <span className="text-gradient-flare">REST API</span>
            </h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Everything you need in four endpoints.
            </p>
          </motion.div>

          {/* API table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-background rounded-lg border border-border overflow-hidden mb-8"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary">Method</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary">Endpoint</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-secondary hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((endpoint, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-hovered transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-mono font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' :
                          endpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono text-[#ff6b35]">{endpoint.path}</code>
                      </td>
                      <td className="px-6 py-4 text-secondary text-sm hidden sm:table-cell">
                        {endpoint.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <a
              href="https://github.com/monarch-xyz/flare/blob/main/docs/API.md"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline inline-block"
            >
              <Button variant="primary" size="lg" className="font-zen">
                Full API Documentation
                <RiArrowRightLine className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
