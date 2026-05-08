import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { JetBrains_Mono, Zen_Kaku_Gothic_New } from 'next/font/google';
import '@daimo/sdk/web/theme.css';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';

const zenKakuGothic = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

const DEFAULT_SITE_URL = 'https://iruka.tech';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getRequestSiteUrl = async () => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');
  if (!host) {
    return DEFAULT_SITE_URL;
  }

  const forwardedProto = headerStore.get('x-forwarded-proto');
  const protocol =
    forwardedProto ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');

  return trimTrailingSlash(`${protocol}://${host}`);
};

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getRequestSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Iruka - Signal Layer for Autonomous Agents',
      template: '%s | Iruka',
    },
    description:
      'Iruka gives agent builders one API for durable conditions across onchain state, indexed history, raw events, simulation, and structured delivery.',
    keywords: [
      'open data agents',
      'agent signals',
      'autonomous agents',
      'onchain automation',
      'blockchain alerts',
      'state monitoring',
      'indexed history',
      'raw events',
      'archive rpc',
      'signal DSL',
      'state_ref',
      'agent intelligence',
      'webhook alerts',
      'telegram alerts',
      'blockchain signals',
    ],
    authors: [{ name: 'Iruka', url: DEFAULT_SITE_URL }],
    creator: 'Iruka',
    publisher: 'Iruka',
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
      title: 'Iruka - Signal Layer for Autonomous Agents',
      description: 'Build on top of a signal layer that only speaks when the pattern is real.',
      url: siteUrl,
      siteName: 'Iruka',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Iruka - Signal layer for autonomous agents',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Iruka - Signal Layer for Autonomous Agents',
      description: 'Build on top of a signal layer that only speaks when the pattern is real.',
      images: [
        {
          url: `${siteUrl}/twitter-image`,
          alt: 'Iruka - Signal layer for autonomous agents',
        },
      ],
    },
    alternates: {
      canonical: siteUrl,
    },
    category: 'technology',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = await getRequestSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Iruka',
    description: 'A sensing layer that turns open data across RPC state, indexed history, and raw events into structured agent signals.',
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
      name: 'Iruka',
      url: DEFAULT_SITE_URL,
    },
    keywords: 'open data agents, blockchain monitoring, signals, archive RPC, indexed history, raw events',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f7f6ef" />
        <meta name="color-scheme" content="light" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${zenKakuGothic.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
