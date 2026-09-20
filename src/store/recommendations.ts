import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScoredRecommendation } from '@/services/aiRecommendationService'

interface RecommendationsState {
  recommendations: ScoredRecommendation[]
  setRecommendations: (recommendations: ScoredRecommendation[]) => void
  clearRecommendations: () => void
}

export const useRecommendationsStore = create<RecommendationsState>()(
  persist(
    (set) => ({
      recommendations: [],
      setRecommendations: (recommendations) => set({ recommendations }),
      clearRecommendations: () => set({ recommendations: [] }),
    }),
    {
      name: 'recommendations-storage',
      partialize: (state) => ({ recommendations: state.recommendations }),
    }
  )
)
