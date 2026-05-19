import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ 
    user, 
    isAdmin: user?.user_metadata?.role === 'ADMIN' 
  }),
}));
