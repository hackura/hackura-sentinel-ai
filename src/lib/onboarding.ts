import { supabase } from './supabase';

export interface ProfileData {
  id?: string;
  email?: string;
  full_name?: string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  discovery_source?: string;
  interest_reason?: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get user's profile from Supabase
 */
export async function getUserProfile(userId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Row not found - this is expected for new users
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create a new user profile (called on first signup/login)
 */
export async function createUserProfile(
  userId: string,
  email: string,
  displayName?: string
): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        full_name: displayName || email.split('@')[0],
        display_name: displayName || email.split('@')[0],
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

/**
 * Update user profile during onboarding
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<ProfileData>
): Promise<ProfileData | null> {
  try {
    // Map display_name to full_name if needed
    const updateData = {
      ...updates,
      ...(updates.display_name && !updates.full_name && { full_name: updates.display_name }),
      updated_at: new Date().toISOString(),
    };

    console.log('Updating profile with data:', updateData);

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', {
      message: error?.message || 'Unknown error',
      code: error?.code,
      details: error?.details,
      fullError: error,
    });
    return null;
  }
}

/**
 * Check if onboarding is complete
 */
export async function isOnboardingComplete(userId: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.onboarding_completed ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return false;
  }
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // No matching row means username is available
      return true;
    }

    return !data;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
}
