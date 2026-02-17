import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { CodeExamples } from '@/components/CodeExamples';
import { ForAgents } from '@/components/ForAgents';
import { AgentOnboarding } from '@/components/AgentOnboarding';
import { ApiReference } from '@/components/ApiReference';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-main min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <CodeExamples />
        <ForAgents />
        <AgentOnboarding />
        <ApiReference />
        <div className="text-center py-16">
          <p className="text-secondary mb-4">Join our Discord for early access</p>
          <a
            href="https://discord.gg/Ur4dwN3aPS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-medium rounded-lg hover:opacity-90 transition-opacity no-underline"
          >
            Join Discord
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
