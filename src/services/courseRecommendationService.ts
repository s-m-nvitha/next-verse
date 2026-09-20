import type { Course, EducationLevel } from '@/models/course'

export interface CourseRecommendation {
  courseId: string
  score: number
  explanation: string
}

const levelOrder: Record<EducationLevel, number> = {
  '10th': 1,
  '12th': 2,
  diploma: 3,
  UG: 4,
  PG: 5,
}

export const recommendCourses = (args: {
  courses: Course[]
  domainId: string
  educationLevel: EducationLevel
  limit?: number
}): CourseRecommendation[] => {
  const limit = args.limit ?? 6

  const filtered = args.courses.filter(
    (c) => c.domainId === args.domainId && c.educationLevel === args.educationLevel
  )

  const scored = filtered
    .map((c) => {
      const score = 100
      const explanation = `Recommended because it matches ${args.domainId.replace(/_/g, ' ')} for ${args.educationLevel}.`
      return { courseId: c.id, score, explanation }
    })
    .sort((a, b) => b.score - a.score)

  if (scored.length > 0) return scored.slice(0, limit)

  const fallback = args.courses
    .filter((c) => c.domainId === args.domainId)
    .map((c) => ({
      courseId: c.id,
      score: Math.max(10, 70 - Math.abs(levelOrder[c.educationLevel] - levelOrder[args.educationLevel]) * 10),
      explanation: `Suggested as an alternative within ${args.domainId.replace(/_/g, ' ')}.`,
    }))
    .sort((a, b) => b.score - a.score)

  return fallback.slice(0, limit)
}
