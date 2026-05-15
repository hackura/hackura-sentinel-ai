import type { Metadata } from 'next';

import { CliErrorPage } from '@/components/cli-auth/cli-error-page';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://sentinel.hackura.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Authentication Failed',
  description: 'CLI device authorization could not be completed.',
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    device_id?: string | string[];
    reason?: string | string[];
  }>;
};

export default async function CliErrorRoute({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const deviceId = Array.isArray(resolvedSearchParams.device_id)
    ? resolvedSearchParams.device_id[0]
    : resolvedSearchParams.device_id;

  return <CliErrorPage deviceId={deviceId} reason={resolvedSearchParams.reason} />;
}