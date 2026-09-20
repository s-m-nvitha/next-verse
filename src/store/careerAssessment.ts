import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CareerAssessmentAnswers } from '@/models/careerAssessment'
import type { DomainScoreWithExplanation } from '@/services/careerAssessmentService'

interface CareerAssessmentState {
  answers: CareerAssessmentAnswers
  results: DomainScoreWithExplanation[] | null
  setAnswer: (questionId: string, optionId: string) => void
  setResults: (results: DomainScoreWithExplanation[]) => void
  reset: () => void
}

export const useCareerAssessmentStore = create<CareerAssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      results: null,
      setAnswer: (questionId, optionId) =>
        set((s) => ({
          answers: {
            ...s.answers,
            [questionId]: optionId as never,
          },
        })),
      setResults: (results) => set({ results }),
      reset: () => set({ answers: {}, results: null }),
    }),
    { name: 'career-assessment' }
  )
)
