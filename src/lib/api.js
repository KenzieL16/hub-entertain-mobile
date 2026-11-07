import { Platform } from 'react-native';
import { getSecureToken, clearSecureToken } from './secureStore';

// Configure default API endpoint
// Defaults to the IP configured in hub-entertain-web (.env), or allows EXPO_PUBLIC_API_URL override
const DEFAULT_URL = Platform.select({
  android: 'http://192.168.1.203:5000/api', // or 10.0.2.2 for Android emulator
  ios: 'http://192.168.1.203:5000/api',
  default: 'http://192.168.1.203:5000/api',
});

const BASE = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL).replace(/\/$/, '');

// Global listener for auth expiration (session timeout / token invalidated)
const authListeners = new Set();
export function subscribeAuthExpired(listener) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function notifyAuthExpired() {
  clearSecureToken().finally(() => {
    authListeners.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  });
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Sanitizes headers and payload before any logging or diagnostics
 * Strict security: prevents accidental token or credential leakage in device logs
 */
function sanitizeForLogging(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = { ...obj };
  for (const key of Object.keys(clone)) {
    const lower = key.toLowerCase();
    if (lower.includes('password') || lower.includes('token') || lower === 'authorization') {
      clone[key] = '[REDACTED]';
    }
  }
  return clone;
}

async function request(method, path, { body, params, signal } = {}) {
  const query = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();

  const token = await getSecureToken();
  const url = `${BASE}${path}${query ? `?${query}` : ''}`;

  let res;
  try {
    const headers = {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    res = await fetch(url, {
      method,
      signal,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    if (__DEV__) {
      console.warn(`[Network Error] ${method} ${path}: Cannot reach the server.`);
    }
    throw new ApiError(0, 'Cannot reach the server. Please check your network and make sure backend is running.');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      notifyAuthExpired();
    }
    throw new ApiError(res.status, data?.message || res.statusText || 'Request failed', data?.errors);
  }

  return data;
}

export const api = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts),
  getBaseUrl: () => BASE,
};

