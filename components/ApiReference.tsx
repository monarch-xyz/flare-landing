'use client';

import { motion } from 'framer-motion';
import { RiArrowRightLine } from 'react-icons/ri';
import { Button } from './ui/Button';
import { IRUKA_API_DOCS_URL } from '@/lib/iruka-links';

const endpoints = [
  ['GET', '/health', 'Fast liveness plus source-family capability status.'],
  ['GET', '/chains', 'Configured chain allowlist and archive RPC runtime config.'],
  ['GET', '/api/v1/catalog', 'Backend-supported raw-event catalog for builder UX.'],
  ['POST', '/api/v1/signals', 'Create one stored signal from the current DSL.'],
  ['POST', '/api/v1/simulate/:id/simulate', 'Replay a signal across a time range.'],
] as const;

export function ApiReference() {
  return (
    <section id="api" className="relative py-16 md:py-24">
      <div className="page-gutter">
        <div className="mx-auto max-w-3xl text-center">
          <div className="ui-kicker justify-center">API</div>
          <h2 className="ui-section-title mt-5">A restrained API surface with a clear operational core.</h2>
          <p className="ui-copy mx-auto mt-4">
            The API references the same design posture as the UI: explicit routes, direct language, no decorative clutter.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="ui-panel mt-10 p-6"
        >
          <div className="space-y-3">
            {endpoints.map(([method, path, description]) => (
              <div key={path} className="ui-panel-ghost grid gap-3 px-4 py-4 md:grid-cols-[88px_minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start">
                <span className="ui-chip" data-tone={method === 'GET' ? 'success' : 'accent'}>
                  {method}
                </span>
                <code className="text-sm text-foreground">{path}</code>
                <p className="text-sm leading-relaxed text-secondary">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <a href={IRUKA_API_DOCS_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
              <Button size="lg" className="gap-2">
                Full API Documentation
                <RiArrowRightLine className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
