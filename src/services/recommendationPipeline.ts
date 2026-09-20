import type { StudentProfile } from '@/models/userProfile'
import type { CareerDomain } from '@/models/domain'
import type { Course } from '@/models/course'
import type { EntranceExam } from '@/models/exam'
import type { College } from '@/models/college'
import { getTopDomains } from '@/services/domainRankingService'
import { recommendCourses } from '@/services/courseRecommendationService'
import { recommendExams } from '@/services/examRecommendationService'
import { recommendColleges } from '@/services/collegeRecommendationService'
import { buildRoadmap } from '@/services/roadmapService'

export interface FullRecommendationOutput {
  topDomains: ReturnType<typeof getTopDomains>
  courseRecommendations: ReturnType<typeof recommendCourses>
  examRecommendations: ReturnType<typeof recommendExams>
  collegeRecommendations: ReturnType<typeof recommendColleges>
  roadmap?: ReturnType<typeof buildRoadmap>
}

export const runRecommendationPipeline = (args: {
  profile: StudentProfile
  domains: CareerDomain[]
  courses: Course[]
  exams: EntranceExam[]
  colleges: College[]
}): FullRecommendationOutput => {
  const topDomains = getTopDomains({
    domains: args.domains,
    selectedInterestIds: args.profile.selectedInterests,
    limit: 5,
  })

  const bestDomainId = topDomains[0]?.domainId

  const courseRecommendations = bestDomainId
    ? recommendCourses({
        courses: args.courses,
        domainId: bestDomainId,
        educationLevel: args.profile.educationLevel,
        limit: 6,
      })
    : []

  const selectedCourseId = args.profile.selectedCourseId ?? courseRecommendations[0]?.courseId

  const examRecommendations = selectedCourseId
    ? recommendExams({
        exams: args.exams,
        courseId: selectedCourseId,
        userState: args.profile.state,
        limit: 6,
      })
    : []

  const acceptedExamIds = examRecommendations.map((x) => x.examId)

  const collegeRecommendations = selectedCourseId
    ? recommendColleges({
        colleges: args.colleges,
        courseId: selectedCourseId,
        acceptedExamIds,
        userLocation: {
          state: args.profile.state,
          city: args.profile.city,
        },
        affordabilityPreference: args.profile.affordabilityPreference,
        preferredCollegeType: args.profile.preferredCollegeType,
        limit: 10,
      })
    : []

  const roadmap = selectedCourseId
    ? buildRoadmap(args.courses.find((c) => c.id === selectedCourseId) ?? args.courses[0])
    : undefined

  return {
    topDomains,
    courseRecommendations,
    examRecommendations,
    collegeRecommendations,
    roadmap,
  }
}
