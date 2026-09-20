import type { EntranceExam } from '@/models/exam'

export interface ExamRecommendation {
  examId: string
  score: number
  explanation: string
}

export const recommendExams = (args: {
  exams: EntranceExam[]
  courseId: string
  userState?: string
  limit?: number
}): ExamRecommendation[] => {
  const limit = args.limit ?? 6
  const state = args.userState?.toLowerCase()

  const relevant = args.exams.filter((e) => e.acceptedCourseIds.includes(args.courseId))

  const scored = relevant
    .map((e) => {
      const isStateMatch = state && e.supportedStates.includes(state)
      const score = e.level === 'national' ? 95 : isStateMatch ? 90 : 70
      const explanation =
        e.level === 'national'
          ? `National exam accepted for this course.`
          : isStateMatch
            ? `State-level exam for ${state?.replace(/_/g, ' ')} accepted for this course.`
            : `State/university exam accepted for this course.`
      return { examId: e.id, score, explanation }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}
