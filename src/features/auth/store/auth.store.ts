import { create } from 'zustand';
import api from '@/shared/api/axios';
import type { User, ApiResponse } from '@/shared/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

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
              isLoading: false
            });
            return;
          }
        } catch {
          // User fetch failed, clear auth
        }
      }
    } catch {
      // Refresh token failed, user is guest
    }

    set({ isLoading: false });
  },
}));

// Make auth store accessible to axios interceptor
(window as unknown as { __authStore?: AuthState }).__authStore = useAuthStore.getState();

// Subscribe to store changes to update window reference
useAuthStore.subscribe((state) => {
  (window as unknown as { __authStore?: AuthState }).__authStore = state;
});
