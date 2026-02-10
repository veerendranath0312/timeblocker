import { create } from 'zustand';

// Mock user for offline mode
const MOCK_USER = {
  id: 'local-user',
  name: 'Local User',
  email: 'local@example.com',
};

export const useAuthStore = create((set) => ({
  user: MOCK_USER,
  isAuthenticated: true,
  isLoading: false,

  // Initialize auth state (always authenticated)
  init: async () => {
    // Check if we have a persisted user logic if needed, but for now just mock it
    // set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
    // Keep it simple
  },

  // Mock Signup
  signup: async (name, email, password) => {
    set({ user: { name, email, id: 'local-user' }, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  // Mock Login
  login: async (email, password) => {
    set({ user: { name: 'Local User', email, id: 'local-user' }, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  // Mock Logout
  logout: async () => {
    // In local mode, maybe just reset to login screen or do nothing? 
    // For now, let's just simulate logout but `init` will log them back in if refreshed.
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
