import axios from 'axios';
import { supabase } from './supabase';

const CLI_LOGIN_PATH = '/cli/login';
const CLI_SUCCESS_PATH = '/cli/success';
const CLI_ERROR_PATH = '/cli/error';
const CLI_CONFIRM_ENDPOINT = 'https://api.hackura.app/cli/auth/confirm';

export type CliAuthFailureReason =
  | 'invalid-device'
  | 'expired-session'
  | 'auth-failed'
  | 'confirm-failed';

export function isValidDeviceId(deviceId: string | undefined | null) {
  if (!deviceId) {
    return false;
  }

  return /^[A-Za-z0-9._:-]{8,256}$/.test(deviceId);
}

export function maskDeviceId(deviceId: string) {
  if (!deviceId) {
    return 'unknown-device';
  }

  if (deviceId.length <= 12) {
    return `${deviceId.slice(0, 4)}••••${deviceId.slice(-2)}`;
  }

  return `${deviceId.slice(0, 6)}••••••${deviceId.slice(-4)}`;
}

export function buildCliLoginUrl(deviceId: string) {
  const query = new URLSearchParams({ device_id: deviceId });
  return `${CLI_LOGIN_PATH}?${query.toString()}`;
}

export function buildCliErrorUrl(reason: CliAuthFailureReason, deviceId?: string) {
  const query = new URLSearchParams({ reason });

  if (deviceId) {
    query.set('device_id', deviceId);
  }

  return `${CLI_ERROR_PATH}?${query.toString()}`;
}

export function buildCliSuccessUrl() {
  return CLI_SUCCESS_PATH;
}

export function buildCliOAuthRedirect(deviceId: string) {
  if (typeof window === 'undefined') {
    return `${CLI_LOGIN_PATH}?device_id=${encodeURIComponent(deviceId)}`;
  }

  const url = new URL(CLI_LOGIN_PATH, window.location.origin);
  url.searchParams.set('device_id', deviceId);
  return url.toString();
}

/**
 * Confirms CLI authorization by linking the current Supabase session to the device.
 * Now connects DIRECTLY to Supabase to update the cli_device_sessions table.
 * 
 * Flow:
 * 1. Retrieves the access_token (JWT) from Supabase session
 * 2. Updates cli_device_sessions table directly with the token
 * 3. Falls back to backend API if Supabase update fails
 */
export async function confirmCliAuthorization(payload: {
  device_id: string;
  user_id: string;
  email: string;
}) {
  // Validate payload
  if (!isValidDeviceId(payload.device_id)) {
    throw new Error(`Invalid device ID format: ${payload.device_id}`);
  }

  if (!payload.email) {
    throw new Error('Email is required for CLI authorization');
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('No active Supabase session found. Please log in again.');
  }

  if (!session.access_token) {
    throw new Error('No access token found in session');
  }

  try {
    // Attempt direct Supabase update - this is the primary flow
    console.log(`[CLI Auth] Linking device session: ${maskDeviceId(payload.device_id)}`);
    
    const { error } = await supabase
      .from('cli_device_sessions')
      .update({
        // Do NOT set `user_id` here so the anonymous/CLI poll can still
        // read the token row. The CLI will poll unauthenticated and must
        // be able to see the `token` field while `user_id` remains NULL.
        email: payload.email,
        token: session.access_token,
        status: 'authenticated',
        authenticated_at: new Date().toISOString(),
      })
      .eq('device_id', payload.device_id)
      .eq('status', 'pending');

    if (error) {
      // Check if it's an RLS policy issue (most common with Supabase direct updates)
      if (error.code === 'PGRST116') {
        console.warn(
          `[CLI Auth] RLS policy denied update. This is expected if cli_device_sessions RLS is not configured. Device: ${maskDeviceId(payload.device_id)}`
        );
      } else {
        console.error(`[CLI Auth] Supabase update failed (${error.code}): ${error.message}`);
      }
      
      // Fallback to backend API if direct Supabase update fails
      console.log(`[CLI Auth] Attempting fallback to backend confirmation API...`);
      
      try {
        await axios.post(CLI_CONFIRM_ENDPOINT, {
          ...payload,
          token: session.access_token
        }, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        console.log(`[CLI Auth] Backend confirmation successful for device: ${maskDeviceId(payload.device_id)}`);
        return { success: true, method: 'backend' };
      } catch (backendError) {
        console.error(`[CLI Auth] Backend confirmation also failed:`, backendError);
        throw new Error(
          'Could not link device session. Please ensure your Supabase RLS policies are configured correctly.'
        );
      }
    }

    console.log(`[CLI Auth] Successfully linked device session: ${maskDeviceId(payload.device_id)}`);
    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error(`[CLI Auth] Authorization confirmation failed:`, error);
    throw error;
  }
}

export function getCliFailureMessage(reason?: string | string[]) {
  const value = Array.isArray(reason) ? reason[0] : reason;

  switch (value) {
    case 'expired-session':
      return 'Your authorization session expired before it could be confirmed.';
    case 'auth-failed':
      return 'Supabase authentication could not be completed.';
    case 'confirm-failed':
      return 'We could not bind this device session to your account.';
    case 'invalid-device':
    default:
      return 'Your CLI authentication session is invalid or expired.';
  }
}

export { CLI_ERROR_PATH, CLI_LOGIN_PATH, CLI_SUCCESS_PATH };