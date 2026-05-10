'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setTimeout(() => router.push('/auth/login'), 3000);
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard');
        } else {
          // No session found
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.push('/auth/login'), 3000);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during authentication');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h1>
            <p className="text-zinc-400 mb-4">{error}</p>
            <p className="text-sm text-zinc-500">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <LoadingSpinner size="lg" />
            <h1 className="text-2xl font-bold text-white mt-6">Completing sign in...</h1>
            <p className="text-zinc-400 mt-2">Please wait while we authenticate your account</p>
          </div>
        )}
      </div>
    </div>
  );
}
