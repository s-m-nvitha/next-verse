import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserProfile, TenthGrade, TwelfthGrade, Undergraduate, Postgraduate } from '@/lib/validators'
import { signOutUser } from '@/services/auth'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  educationData: TenthGrade | TwelfthGrade | Undergraduate | Postgraduate | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setEducationData: (data: TenthGrade | TwelfthGrade | Undergraduate | Postgraduate | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      educationData: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setEducationData: (educationData) => set({ educationData }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        void signOutUser()
        set({ user: null, profile: null, educationData: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        profile: state.profile,
        educationData: state.educationData,
      }),
    }
  )
)
