import type { EducationLevel } from './course'
import type { CollegeType } from './college'

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type AffordabilityPreference = 'low_fees_first' | 'balanced' | 'best_fit_first'

export interface StudentProfile {
  id: string
  fullName: string
  age: number
  gender: Gender
  state: string
  city: string
  educationLevel: EducationLevel
  selectedInterests: string[]
  recommendedDomains: string[]
  selectedCourseId?: string
  preferredCollegeType?: CollegeType
  affordabilityPreference?: AffordabilityPreference
  preferredLocation?: {
    state?: string
    city?: string
  }
  completedExamIds: string[]
  savedCollegeIds: string[]
}
