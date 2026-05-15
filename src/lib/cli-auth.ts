import axios from 'axios';

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

export async function confirmCliAuthorization(payload: {
  device_id: string;
  user_id: string;
  email: string;
}) {
  return axios.post(CLI_CONFIRM_ENDPOINT, payload, {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
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