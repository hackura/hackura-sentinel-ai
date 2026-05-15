import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { CliLoginPage } from '@/components/cli-auth/cli-login-page';
import { buildCliErrorUrl, isValidDeviceId } from '@/lib/cli-auth';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://sentinel.hackura.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Authorize CLI Access',
  description: 'Secure device authorization gateway for Hackura Sentinel AI CLI access.',
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    device_id?: string | string[];
  }>;
};

export default async function CliLoginRoute({ searchParams }: PageProps) {
  const { device_id } = await searchParams;
  const deviceId = Array.isArray(device_id) ? device_id[0] : device_id;

  if (typeof deviceId !== 'string' || !isValidDeviceId(deviceId)) {
    redirect(buildCliErrorUrl('invalid-device', deviceId));
  }

  return <CliLoginPage deviceId={deviceId} />;
}