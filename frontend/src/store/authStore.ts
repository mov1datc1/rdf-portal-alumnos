import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isTeacher: boolean;
  role: string | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  isTeacher: false,
  role: null,
  setSession: (session) => set({ session }),
  setUser: (user) => {
    const role = user?.user_metadata?.role || null;
    set({
      user,
      role,
      isAdmin: role === 'ADMIN',
      isTeacher: role === 'TEACHER',
    });
  },
}));
