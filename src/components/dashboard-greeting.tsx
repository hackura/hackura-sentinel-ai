'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getUserProfile } from '@/lib/onboarding';
import { motion } from 'framer-motion';

interface DashboardGreetingProps {
  className?: string;
}

export function DashboardGreeting({ className = '' }: DashboardGreetingProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!user) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        if (isMounted) {
          setDisplayName(profile?.display_name || user.email?.split('@')[0] || 'User');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (isMounted) {
          setDisplayName(user.email?.split('@')[0] || 'User');
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-8 w-32 bg-zinc-800/50 rounded animate-pulse" />
      </div>
    );
  }

  const greetings = [
    `Welcome back, ${displayName}.`,
    `Threat intelligence systems operational.`,
  ];

  const selectedGreeting = greetings[0];
  const selectedSubtitle = greetings[1];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white">{selectedGreeting}</h1>
      <p className="text-zinc-400 text-sm mt-2">{selectedSubtitle}</p>
    </motion.div>
  );
}

export function DashboardGreetingInline({
  className = '',
}: DashboardGreetingProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!user) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        if (isMounted) {
          setDisplayName(profile?.display_name || user.email?.split('@')[0] || 'User');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (isMounted) {
          setDisplayName(user.email?.split('@')[0] || 'User');
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-6 w-40 bg-zinc-800/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Welcome, {displayName}
    </motion.span>
  );
}
