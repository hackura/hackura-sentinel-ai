import { createClient, type User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Auth will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Sign up with email
export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign in with GitHub
export async function signInWithGitHub(redirectTo?: string) {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo:
        redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });
}

// Sign in with Google
export async function signInWithGoogle(redirectTo?: string) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo:
        redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}

// Get session
export async function getSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}
