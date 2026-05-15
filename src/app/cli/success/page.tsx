import type { Metadata } from 'next';

import { CliSuccessPage } from '@/components/cli-auth/cli-success-page';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://sentinel.hackura.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Authentication Successful',
  description: 'CLI device authorization was confirmed successfully.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CliSuccessRoute() {
  return <CliSuccessPage />;
}