import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'hi' | 'kn'
  isOfflineMode: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: 'en' | 'hi' | 'kn') => void
  setOfflineMode: (isOffline: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      isOfflineMode: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setOfflineMode: (isOfflineMode) => set({ isOfflineMode }),
    }),
    {
      name: 'ui-storage',
    }
  )
)
