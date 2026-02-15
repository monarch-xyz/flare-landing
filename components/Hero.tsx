'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiRobot2Line, RiFlashlightLine, RiShieldCheckLine } from 'react-icons/ri';
import { Button } from './ui/Button';
import { SectionTag } from './ui/SectionTag';

const typingPhrases = [
  'Compose multi-condition alerts',
  'Track state changes, not raw events',
  'Filter noise before it hits your webhook',
  'Run dynamic queries across protocol data',
  'Alert only when conditions truly matter',
];

function TypingAnimation() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (text.length < currentPhrase.length) {
            setText(currentPhrase.slice(0, text.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (text.length > 0) {
            setText(text.slice(0, -1));
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
          }
        }
      },
      isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <span className="text-secondary">
      {text}
      <span className="animate-pulse text-[#ff6b35]">|</span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col pt-14 md:pt-16">
      {/* Background grid with fade */}
      <div
        className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 30% 40%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 30% 40%, black 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/4 right-0 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <SectionTag>The Event Layer for AI Agents</SectionTag>
            </motion.div>

            {/* Headline - no initial opacity:0 to avoid delaying LCP */}
            <h1 className="font-zen text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Dynamic Queries for
              <br />
              <span className="text-[#ff6b35]">High-Signal Alerts</span>
            </h1>

            {/* Typing subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl mb-6 h-8 sm:h-10"
            >
              <TypingAnimation />
            </motion.div>

            {/* Value prop */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-secondary text-lg mb-8 max-w-xl"
            >
              Compose flexible conditions in JSON, run dynamic queries instead of simple event
              listeners, and get notified only when alerts actually matter. No polling, no indexers,
              no alert noise.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a
                href="#onboarding"
                className="no-underline"
              >
                <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[180px] font-zen">
                  Get Started
                  <RiArrowRightLine className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a 
                href="https://github.com/monarch-xyz/sentinel/blob/main/docs/ARCHITECTURE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px] font-zen">
                  Read Docs
                </Button>
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-sm text-secondary"
            >
              <div className="flex items-center gap-2">
                <RiRobot2Line className="w-4 h-4 text-[#ff6b35]" />
                <span>Built for agents</span>
              </div>
              <div className="flex items-center gap-2">
                <RiFlashlightLine className="w-4 h-4 text-[#ff6b35]" />
                <span>Sub-minute latency</span>
              </div>
              <div className="flex items-center gap-2">
                <RiShieldCheckLine className="w-4 h-4 text-[#ff6b35]" />
                <span>Signed webhooks</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-secondary/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
