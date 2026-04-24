import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/shared/api/axios';
import type { User, ApiResponse } from '@/shared/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;

  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      _hasHydrated: false,


  setAuth: (user, accessToken) => {
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },

  initializeAuth: async () => {
    try {
      const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', {});
      const newToken = response.data.data?.accessToken;

      if (newToken) {
        set({ accessToken: newToken });

        // Fetch current user data
        try {
          const userResponse = await api.get<ApiResponse<User>>('/auth/me');
          if (userResponse.data.data) {
            set({
              user: userResponse.data.data,
              isAuthenticated: true,
            });
            return;
          }
        } catch {
          // User fetch failed, clear auth
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      } else {
        // No new token, clear any stale persisted state
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    } catch {
      // Refresh token failed, clear any stale persisted state
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },

    }
  )
);

// Make auth store accessible to axios interceptor
(window as unknown as { __authStore?: AuthState }).__authStore = useAuthStore.getState();

// Subscribe to store changes to update window reference
useAuthStore.subscribe((state) => {
  (window as unknown as { __authStore?: AuthState }).__authStore = state;
});
