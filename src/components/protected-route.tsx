'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LoadingSpinner } from '@/components/ui';
import { useOnboardingRedirect } from '@/hooks/useOnboardingRedirect';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuth();
  const { isChecking } = useOnboardingRedirect(['/onboarding', '/auth/callback', '/auth/login', '/auth/signup']);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
