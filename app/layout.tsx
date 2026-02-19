import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, EB_Garamond } from 'next/font/google';
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

// EB Garamond for elegant headings - sovereignty/narrative vibe
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const siteUrl = 'https://sentinel.monarchlend.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sentinel - DeFi Signals That Matter',
    template: '%s | Sentinel',
  },
  description: 'Aggregate on-chain events into meaningful signals. Get Telegram alerts or trigger your agent via webhook. Follow the liquidity. Built by Monarch.',
  keywords: [
    'DeFi',
    'DeFi monitoring',
    'blockchain alerts',
    'crypto signals',
    'on-chain events',
    'Morpho',
    'smart money tracking',
    'whale alerts',
    'liquidity tracking',
    'position monitoring',
    'liquidation alerts',
    'DeFi notifications',
    'Web3 infrastructure',
    'blockchain signals',
  ],
  authors: [{ name: 'Monarch', url: 'https://monarchlend.xyz' }],
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
    title: 'Sentinel - DeFi Signals That Matter',
    description: 'Aggregate on-chain events into meaningful signals. Follow the liquidity. Built by Monarch.',
    url: siteUrl,
    siteName: 'Sentinel by Monarch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentinel - DeFi Signals That Matter',
    description: 'Aggregate on-chain events into meaningful signals. Follow the liquidity.',
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
  name: 'Sentinel',
  description: 'DeFi signal monitoring. Aggregate on-chain events into meaningful alerts. Follow the liquidity.',
  url: siteUrl,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Monarch',
    url: 'https://monarchlend.xyz',
  },
  keywords: 'DeFi, blockchain monitoring, signals, alerts, Morpho, liquidity tracking',
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${ebGaramond.variable} font-inter antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
