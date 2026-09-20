export type EducationLevel = '10th' | '12th' | 'diploma' | 'UG' | 'PG'

export interface Course {
  id: string
  title: string
  duration: string
  eligibility: string
  domainId: string
  educationLevel: EducationLevel
  careerOutcomes: string[]
  averageFeesInr: number
  salaryPotentialLpa: {
    min: number
    max: number
  }
}
