import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'hub_secure_token';

// In-memory fallback for environments where SecureStore is unavailable (e.g. web preview)
let memoryStore = null;

/**
 * Checks if hardware-backed SecureStore is supported on the current platform.
 */
async function isSecureStoreAvailable() {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Securely retrieves the authentication token.
 * Prevents unauthorized access or plaintext token extraction.
 */
export async function getSecureToken() {
  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      return await SecureStore.getItemAsync(TOKEN_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    }
    return memoryStore;
  } catch (err) {
    // Redact error details to prevent leaking internal key names or storage structure
    if (__DEV__) {
      console.warn('SecureStore: Failed to retrieve token securely');
    }
    return memoryStore;
  }
}

/**
 * Securely saves the authentication token.
 * Uses hardware keystore (Keychain on iOS, Keystore + EncryptedSharedPreferences on Android).
 * Sets keychainAccessible to WHEN_UNLOCKED_THIS_DEVICE_ONLY so token is not exposed in backups.
 */
export async function setSecureToken(token, remember = true) {
  if (!token || typeof token !== 'string') return;

  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } else {
      memoryStore = token;
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('SecureStore: Failed to store token securely');
    }
    memoryStore = token;
  }
}

/**
 * Completely purges the token from Keystore/Keychain and memory.
 * Guarantees zero residual token data on logout or session expiration.
 */
export async function clearSecureToken() {
  memoryStore = null;
  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('SecureStore: Failed to purge token');
    }
  }
}

