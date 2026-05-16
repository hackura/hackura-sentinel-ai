import Link from 'next/link';
import { GlassCard, Button } from '@/components/ui';
import { BrandLogo } from '@/components/brand-logo';
import { PublicNavbar } from '@/components/public-navbar';

type Props = {
  searchParams?: { email?: string };
};

export default function ConfirmEmailPage({ searchParams }: Props) {
  const email = (searchParams && searchParams.email) || '';

  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar showHomeButton />
      <div className="bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BrandLogo size="lg" subtitle={false} />
            </div>
            <p className="text-zinc-400">Confirm your email to continue</p>
          </div>

          <GlassCard>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Check your email</h2>

              <p className="text-zinc-300 text-sm mb-4">
                We sent a confirmation link to <span className="font-medium text-white">{email || 'your email'}</span>.
                Please open the message and click the link to confirm your account.
              </p>

              <p className="text-zinc-500 text-sm mb-6">
                If you don't see the email, check your spam folder or try again in a few minutes.
              </p>

              <div className="flex gap-3">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="secondary" className="w-full">Back to Login</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button variant="secondary" className="w-full">Edit Email</Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
