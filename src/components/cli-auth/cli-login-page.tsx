'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { supabase, signInWithGitHub, signInWithGoogle, signInWithEmail } from '@/lib/supabase';
import {
  buildCliErrorUrl,
  buildCliOAuthRedirect,
  buildCliSuccessUrl,
  confirmCliAuthorization,
  isValidDeviceId,
} from '@/lib/cli-auth';
import { AuthCard } from './auth-card';
import { DeviceInfoPanel } from './device-info-panel';
import { LoginButtons } from './login-buttons';

type CliLoginPageProps = {
  deviceId: string;
};

export function CliLoginPage({ deviceId }: CliLoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasConfirmedRef = useRef(false);
  const isConfirmingRef = useRef(false);

  function getErrorMessage(failure: unknown, fallback: string) {
    if (failure instanceof Error) {
      return failure.message;
    }

    if (typeof failure === 'string') {
      return failure;
    }

    return fallback;
  }

  useEffect(() => {
    if (!isValidDeviceId(deviceId) || hasConfirmedRef.current || isConfirmingRef.current) {
      return;
    }

    const confirmBoundSession = async () => {
      try {
        isConfirmingRef.current = true;
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user || !user.email) {
          return;
        }

        await confirmCliAuthorization({
          device_id: deviceId,
          user_id: user.id,
          email: user.email,
        });

        hasConfirmedRef.current = true;
        router.replace(buildCliSuccessUrl());
      } catch (confirmError: unknown) {
        console.error('CLI authorization confirm failed:', confirmError);
        router.replace(buildCliErrorUrl('confirm-failed', deviceId));
      } finally {
        isConfirmingRef.current = false;
      }
    };

    void confirmBoundSession();
  }, [deviceId, router]);

  const submitEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidDeviceId(deviceId)) {
      router.replace(buildCliErrorUrl('invalid-device'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      isConfirmingRef.current = true;

      const { error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        throw signInError;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Unable to verify your Supabase session.');
      }

      await confirmCliAuthorization({
        device_id: deviceId,
        user_id: user.id,
        email: user.email,
      });

      hasConfirmedRef.current = true;

      router.replace(buildCliSuccessUrl());
    } catch (loginError: unknown) {
      console.error('CLI login failed:', loginError);
      setError(getErrorMessage(loginError, 'Authentication failed.'));
      router.replace(buildCliErrorUrl('auth-failed', deviceId));
    } finally {
      isConfirmingRef.current = false;
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    if (!isValidDeviceId(deviceId)) {
      router.replace(buildCliErrorUrl('invalid-device'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await signInWithGitHub(buildCliOAuthRedirect(deviceId));

      if (oauthError) {
        throw oauthError;
      }
    } catch (oauthError: unknown) {
      console.error('GitHub OAuth failed:', oauthError);
      setError(getErrorMessage(oauthError, 'GitHub authentication failed.'));
      router.replace(buildCliErrorUrl('auth-failed', deviceId));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isValidDeviceId(deviceId)) {
      router.replace(buildCliErrorUrl('invalid-device'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await signInWithGoogle(buildCliOAuthRedirect(deviceId));

      if (oauthError) {
        throw oauthError;
      }
    } catch (oauthError: unknown) {
      console.error('Google OAuth failed:', oauthError);
      setError(getErrorMessage(oauthError, 'Google authentication failed.'));
      router.replace(buildCliErrorUrl('auth-failed', deviceId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020205] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#020205_0%,#050816_48%,#020205_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute bottom-10 right-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl"
        >
          <div className="mb-6 text-center sm:mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.36em] text-fuchsia-300/80">
              Hackura Sentinel AI CLI
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Secure Device Authorization Gateway
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Authenticate once in the browser so your CLI device can receive a short-lived session link.
            </p>
          </div>

          <AuthCard
            eyebrow="Device Authorization Portal"
            title="Authorize CLI Access"
            subtitle="Terminal tool is requesting secure access to your account. Authenticate only if you initiated this flow from the Hackura Sentinel AI CLI."
            footer={
              <p className="text-xs leading-5 text-zinc-500">
                Your browser session is verified through Supabase first, then the backend binds the device request.
              </p>
            }
          >
            <DeviceInfoPanel deviceId={deviceId} isValid={isValidDeviceId(deviceId)} />
            <LoginButtons
              email={email}
              password={password}
              loading={loading}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={submitEmailLogin}
              onGitHubLogin={handleGitHubLogin}
              onGoogleLogin={handleGoogleLogin}
            />
          </AuthCard>
        </motion.div>
      </div>
    </div>
  );
}