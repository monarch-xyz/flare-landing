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
      </main>
      <Footer />
    </div>
  );
}
