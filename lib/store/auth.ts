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
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}))