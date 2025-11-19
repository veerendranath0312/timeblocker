import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state
  init: async () => {
    try {
      const token = api.getToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const { user } = await api.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      api.setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Signup
  signup: async (name, email, password) => {
    try {
      const { user } = await api.signup(name, email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const { user } = await api.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
