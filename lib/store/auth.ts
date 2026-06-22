import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name: string
  role: 'client' | 'provider' | 'admin'
  is_verified: boolean
}

interface AuthStore {
  token: string | null
  user: User | null
  isLoading: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  setLoading: (val: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  setAuth: (token, user) => set({ token, user, isLoading: false }),
  clearAuth: () => set({ token: null, user: null, isLoading: false }),
  setLoading: (val) => set({ isLoading: val }),
}))