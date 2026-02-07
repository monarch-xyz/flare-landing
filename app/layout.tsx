import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flare - Event Triggers for DeFi Agents',
  description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep. Built by Monarch.',
  keywords: ['DeFi', 'blockchain', 'monitoring', 'alerts', 'webhooks', 'Morpho', 'agents', 'AI'],
  authors: [{ name: 'Monarch' }],
  openGraph: {
    title: 'Flare - Event Triggers for DeFi Agents',
    description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flare - Event Triggers for DeFi Agents',
    description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
