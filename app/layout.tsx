import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Zen_Kaku_Gothic_New } from 'next/font/google';
import './globals.css';

// Self-hosted fonts via next/font (eliminates render-blocking requests)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

// Zen Kaku Gothic New for headings - subsetted to Latin only via next/font
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen',
  weight: '700',
});

const siteUrl = 'https://flare.monarch.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Flare - Event Triggers for DeFi Agents',
    template: '%s | Flare',
  },
  description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep. Define conditions in simple DSL, deploy via API, receive webhooks when triggered. Built by Monarch.',
  keywords: [
    'DeFi',
    'DeFi monitoring',
    'blockchain alerts',
    'crypto webhooks',
    'on-chain events',
    'Morpho',
    'AI agents',
    'signal monitoring',
    'position tracking',
    'whale alerts',
    'liquidation alerts',
    'DeFi automation',
    'Web3 infrastructure',
    'blockchain notifications',
    'smart contract events',
  ],
  authors: [{ name: 'Monarch', url: 'https://monarch.xyz' }],
  creator: 'Monarch',
  publisher: 'Monarch',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Flare - Event Triggers for DeFi Agents',
    description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep. Built by Monarch.',
    url: siteUrl,
    siteName: 'Flare by Monarch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flare - Event Triggers for DeFi Agents',
    description: 'Composable signal monitoring for DeFi. Watch the chain while you sleep.',
    creator: '@monarchxyz',
    site: '@monarchxyz',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Flare',
  description: 'Composable signal monitoring for DeFi. Event triggers for AI agents and automated workflows.',
  url: siteUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Monarch',
    url: 'https://monarch.xyz',
  },
  keywords: 'DeFi, blockchain monitoring, webhooks, alerts, Morpho, AI agents',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#16181a" />
        <meta name="color-scheme" content="dark" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${zenKakuGothicNew.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
