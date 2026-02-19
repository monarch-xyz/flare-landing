import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Story } from '@/components/Story';
import { Capabilities } from '@/components/Capabilities';
import { ForAgents } from '@/components/ForAgents';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-main min-h-screen relative">
      {/* Full page dot grid background with vertical fade */}
      <div
        className="fixed inset-0 bg-dot-grid pointer-events-none opacity-50"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }}
        aria-hidden="true"
      />

      <Header />
      <main className="relative z-10">
        <Hero />
        <Story />
        <Capabilities />
        <ForAgents />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
