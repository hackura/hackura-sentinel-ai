'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getUserProfile, createUserProfile } from '@/lib/onboarding';

const DEFAULT_PUBLIC_ROUTES = ['/onboarding', '/auth/callback'];

interface OnboardingState {
  needsOnboarding: boolean;
  isChecking: boolean;
  userProfile: any | null;
}

/**
 * Hook to detect onboarding status and handle redirects
 * Should be used in layouts that need to protect against incomplete onboarding
 */
export function useOnboardingRedirect(
  publicRoutes: string[] = DEFAULT_PUBLIC_ROUTES
) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    needsOnboarding: false,
    isChecking: true,
    userProfile: null,
  });
  const checkedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkOnboarding() {
      if (user?.id && checkedUserIdRef.current === user.id && !isLoading) {
        return;
      }

      if (!user) {
        if (!isLoading) {
          setState({
            needsOnboarding: false,
            isChecking: false,
            userProfile: null,
          });
        }
        return;
      }

      try {
        // Get or create profile
        let profile = await getUserProfile(user.id);

        // If profile doesn't exist, create it
        if (!profile) {
          profile = await createUserProfile(user.id, user.email || '');
        }

        if (isMounted) {
          checkedUserIdRef.current = user.id;
          const needsOnboarding = !profile?.onboarding_completed;

          setState({
            needsOnboarding,
            isChecking: false,
            userProfile: profile,
          });

          // Redirect to onboarding if needed and not already there
          if (
            needsOnboarding &&
            !publicRoutes.includes(window.location.pathname)
          ) {
            router.push('/onboarding');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (isMounted) {
          checkedUserIdRef.current = user?.id ?? null;
          setState({
            needsOnboarding: false,
            isChecking: false,
            userProfile: null,
          });
        }
      }
    }

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router, publicRoutes]);

  return state;
}
