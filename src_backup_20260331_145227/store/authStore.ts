/**
 * Auth Store - Zustand
 * Gestion de l'authentification avec persistance
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// API base URL - uses proxy in dev
const API_URL = '/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            set({ 
              isLoading: false, 
              error: data.error || 'Erreur de connexion',
              isAuthenticated: false 
            });
            return false;
          }
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            isLoading: false, 
            error: 'Erreur réseau. Vérifiez que le serveur est démarré.',
            isAuthenticated: false 
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }
        
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            // Token invalide ou expiré
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false 
            });
          }
        } catch (error) {
          console.error('Check auth error:', error);
          // Ne pas déconnecter en cas d'erreur réseau, garder le token
          set({ isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'alecia-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Export token getter for use in API calls
export const getAuthToken = () => useAuthStore.getState().token;
