import { useState, useCallback } from 'react';
import type { AuthState } from '@/types';

const STORAGE_KEY = 'alecia_auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      isAuthenticated: false,
      userTag: null,
      hasMasterAccess: false,
    };
  });

  const authenticate = useCallback(async (pin: string, userTag?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      const newState: AuthState = {
        isAuthenticated: true,
        userTag: userTag || null,
        hasMasterAccess: data.hasMasterAccess || false,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setAuthState(newState);
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      userTag: null,
      hasMasterAccess: false,
    });
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
  };
}
