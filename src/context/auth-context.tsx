'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
