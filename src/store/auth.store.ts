import { create } from "zustand"
import type { User } from "@/types"
import type { Session } from "@supabase/supabase-js"

interface AuthStore {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),
  setSession: (session) =>
    set({ session, isAuthenticated: !!session }),
  setLoading: (isLoading) =>
    set({ isLoading }),
  reset: () =>
    set({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}))
