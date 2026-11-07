import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, subscribeAuthExpired } from '../lib/api';
import { clearSecureToken, getSecureToken, setSecureToken } from '../lib/secureStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing session safely on startup
  useEffect(() => {
    let active = true;

    async function initAuth() {
      try {
        const token = await getSecureToken();
        if (!token) {
          if (active) setLoading(false);
          return;
        }

        const data = await api.get('/auth/me');
        if (active && data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        // If token is invalid or expired, clear it
        await clearSecureToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth expiration events (e.g. 401 from any API call)
    const unsubscribe = subscribeAuthExpired(() => {
      setUser(null);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = async ({ email, password, rememberMe = true }) => {
    const data = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
      rememberMe,
    });

    if (data?.token) {
      await setSecureToken(data.token, rememberMe);
      setUser(data.user);
    }
    return data;
  };

  const register = async (form) => {
    const data = await api.post('/auth/register', {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (data?.token) {
      await setSecureToken(data.token, false);
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await clearSecureToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

