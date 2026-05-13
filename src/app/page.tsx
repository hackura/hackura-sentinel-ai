import type { Metadata } from 'next';
import HomePageClient from '@/components/home-page';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://sentinel.hackura.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hackura Sentinel AI | AI-Powered Trust Intelligence',
    template: '%s | Hackura Sentinel AI',
  },
  description:
    'Detect phishing, scams, malicious infrastructure, and misinformation with AI-powered trust intelligence and graph analysis.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hackura Sentinel AI | AI-Powered Trust Intelligence',
    description:
      'Detect phishing, scams, malicious infrastructure, and misinformation with AI-powered trust intelligence and graph analysis.',
    url: siteUrl,
    siteName: 'Hackura Sentinel AI',
    type: 'website',
    images: [
      {
        url: new URL('/logo.svg', siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: 'Hackura Sentinel AI dashboard preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackura Sentinel AI | AI-Powered Trust Intelligence',
    description:
      'Detect phishing, scams, malicious infrastructure, and misinformation with AI-powered trust intelligence and graph analysis.',
    images: [new URL('/logo.svg', siteUrl).toString()],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hackura Sentinel AI',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    description:
      'AI-powered trust intelligence platform for phishing, scam, and malicious infrastructure detection.',
    url: siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return <HomePageClient structuredData={structuredData} />;
}
