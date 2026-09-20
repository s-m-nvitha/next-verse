import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PipelineSelectionsState {
  selectedCourseId: string | null
  selectedExamIds: string[]
  savedCollegeIds: string[]
  setSelectedCourseId: (courseId: string) => void
  toggleSelectedExamId: (examId: string) => void
  toggleSavedCollegeId: (collegeId: string) => void
  reset: () => void
}

export const usePipelineSelectionsStore = create<PipelineSelectionsState>()(
  persist(
    (set) => ({
      selectedCourseId: null,
      selectedExamIds: [],
      savedCollegeIds: [],
      setSelectedCourseId: (selectedCourseId) => set({ selectedCourseId }),
      toggleSelectedExamId: (examId) =>
        set((s) => ({
          selectedExamIds: s.selectedExamIds.includes(examId)
            ? s.selectedExamIds.filter((x) => x !== examId)
            : [...s.selectedExamIds, examId],
        })),
      toggleSavedCollegeId: (collegeId) =>
        set((s) => ({
          savedCollegeIds: s.savedCollegeIds.includes(collegeId)
            ? s.savedCollegeIds.filter((x) => x !== collegeId)
            : [...s.savedCollegeIds, collegeId],
        })),
      reset: () => set({ selectedCourseId: null, selectedExamIds: [], savedCollegeIds: [] }),
    }),
    { name: 'pipeline-selections' }
  )
)
