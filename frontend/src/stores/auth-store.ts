import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface StoreInfo {
  id: string
  slug: string
  name: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  store: StoreInfo | null
  login: (token: string, user: User, store?: StoreInfo | null) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setStore: (store: StoreInfo | null) => void
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      store: null,

      login: (token, user, store = null) =>
        set({ token, user, isAuthenticated: true, store }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false, store: null }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setStore: (store) => set({ store }),

      hasRole: (role) => get().user?.role === role,
    }),
    { name: 'auth-storage' },
  ),
)
