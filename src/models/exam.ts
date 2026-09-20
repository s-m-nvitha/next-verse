export type ExamLevel = 'national' | 'state' | 'university'

export interface EntranceExam {
  id: string
  name: string
  conductingBody: string
  eligibility: string
  acceptedCourseIds: string[]
  level: ExamLevel
  officialWebsite: string
  supportedStates: string[]
}
