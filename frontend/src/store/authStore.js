import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: '',
      setSession: ({ user, accessToken }) => {
        set({
          user: user || null,
          accessToken: accessToken || '',
        })
      },
      setUser: (user) => {
        set({
          user: user || null,
        })
      },
      setAccessToken: (accessToken) => {
        set({
          accessToken: accessToken || '',
        })
      },
      clearSession: () => {
        set({
          user: null,
          accessToken: '',
        })
      },
    }),
    {
      name: 'alumniconnect-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
)
