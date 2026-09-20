import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DomainMatch, DomainId } from '@/services/interestAssessmentService'
import type { InterestAnswers } from '@/services/interestAssessmentService'

interface InterestAssessmentState {
  answers: InterestAnswers
  interestScores: Record<string, number>
  topInterests: string[]
  domainMatches: DomainMatch[]
  selectedDomainId: DomainId | null
  setAnswer: (questionId: string, optionIds: string[]) => void
  setResults: (args: { interestScores: Record<string, number>; topInterests: string[]; domainMatches: DomainMatch[] }) => void
  setSelectedDomainId: (domainId: DomainId) => void
  reset: () => void
}

export const useInterestAssessmentStore = create<InterestAssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      interestScores: {},
      topInterests: [],
      domainMatches: [],
      selectedDomainId: null,
      setAnswer: (questionId, optionIds) =>
        set((s) => ({
          answers: {
            ...s.answers,
            [questionId]: optionIds,
          },
        })),
      setResults: ({ interestScores, topInterests, domainMatches }) => set({ interestScores, topInterests, domainMatches }),
      setSelectedDomainId: (selectedDomainId) => set({ selectedDomainId }),
      reset: () => set({ answers: {}, interestScores: {}, topInterests: [], domainMatches: [], selectedDomainId: null }),
    }),
    { name: 'interest-assessment' }
  )
)
