'use client';

import { useAuth } from '@/context/auth-context';
import { OnboardingFlow } from '@/components/onboarding-flow';
import { LoadingSpinner } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (mounted && !isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <OnboardingFlow />;
}
