import type { Metadata } from 'next';
import { DocsShell } from '@/components/docs/docs-shell';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Hackura Sentinel AI documentation portal for developers, operators, and security teams.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
