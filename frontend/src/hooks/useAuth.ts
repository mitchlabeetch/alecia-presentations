import { useState, useCallback } from 'react';
import type { AuthState } from '@/types';

const STORAGE_KEY = 'alecia_auth';
const GALLERY_PIN = '1234';
const MASTER_PIN = 'master123';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          isAuthenticated: false,
          userTag: null,
          hasMasterAccess: false,
        };
      }
    }
    return {
      isAuthenticated: false,
      userTag: null,
      hasMasterAccess: false,
    };
  });

  const authenticate = useCallback(async (pin: string, userTag?: string): Promise<boolean> => {
    if (pin === GALLERY_PIN || pin === MASTER_PIN) {
      const newState: AuthState = {
        isAuthenticated: true,
        userTag: userTag || null,
        hasMasterAccess: pin === MASTER_PIN,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setAuthState(newState);
      return true;
    }
    return false;
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
