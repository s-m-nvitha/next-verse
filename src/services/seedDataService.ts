import type { EducationLevel } from '@/lib/validators'

export interface SeedInterest {
  id: string
  name: string
}

export interface SeedInterestQuestionnaireOption {
  id: string
  label: string
  mappedInterests: string[]
}

export interface SeedInterestQuestionnaireQuestion {
  questionId: number
  question: string
  multiSelect: boolean
  options: SeedInterestQuestionnaireOption[]
}

export interface SeedDomain {
  id: string
  name: string
  relatedInterests: string[]
  description?: string
  recommendedCourses?: string[]
  recommendedExams?: string[]
}

export interface SeedCourse {
  id: string
  name: string
  domainId?: string
  description?: string
  duration?: string
  eligibility?: string
  relatedInterests?: string[]
  category?: string
  tags?: string[]
  educationLevel?: string
}

export interface SeedExam {
  id: string
  name: string
  courseId?: string
  linkedCourses?: string[]
  duration?: string
  eligibility?: string
  relatedInterests?: string[]
  relatedDomains?: string[]
  category?: string
  description?: string
  website?: string
  educationLevel?: string
}

export interface SeedCollege {
  id: string
  name: string
  district: string
  city: string
  type: string
  levels?: string[]
  domains?: string[]
  coursesOffered: string[]
  acceptedExams?: string[]
  fees?: { min?: number; max?: number }
  ranking?: number
  facilities?: string[]
  location?: { lat?: number; lng?: number }
  website?: string
}

export interface SeedScholarship {
  id: string
  name: string
  provider: string
  level: '10th' | '12th' | 'UG' | 'PG'
  eligibleCourses?: string[]
  eligibility?: {
    category?: string[]
    gender?: string[]
    specialCategory?: string[]
    minimumMarks?: string
    academicPerformance?: string
    qualification?: string
    requirement?: string
    incomeLimitInr?: number
    familyIncomeInr?: number
  }
  benefits?: string[]
  officialWebsite?: string
}

export interface SeedStudyMaterial {
  id: string
  title: string
  type: string
  level: '10th' | '12th' | 'UG' | 'PG'
  relatedDomains?: string[]
  relatedCourses?: string[]
  relatedExams?: string[]
  provider?: string
  language?: string[]
  format?: 'ebook' | 'notes' | 'video' | 'course'
  difficultyLevel?: string
  url?: string
  sourceType?: 'official_portal' | 'exam_authority' | 'open_education' | 'university' | 'government'
  verified?: boolean
  lastVerified?: string
}

const levelKey = (level: EducationLevel): '10th' | '12th' | 'ug' | 'pg' => {
  if (level === '10th') return '10th'
  if (level === '12th') return '12th'
  if (level === 'UG') return 'ug'
  return 'pg'
}

export const loadSeedInterests = async (level: EducationLevel): Promise<SeedInterest[]> => {
  const key = levelKey(level)
  if (key === '10th') return (await import('@/seed/interests/10th.json')).default
  if (key === '12th') return (await import('@/seed/interests/12th.json')).default
  if (key === 'ug') return (await import('@/seed/interests/ug.json')).default
  return (await import('@/seed/interests/pg.json')).default
}

export const loadSeedInterestQuestionnaire = async (level: EducationLevel): Promise<SeedInterestQuestionnaireQuestion[]> => {
  const key = levelKey(level)
  if (key === '10th') return (await import('@/seed/interestQuestionnaires/10th.json')).default
  if (key === '12th') return (await import('@/seed/interestQuestionnaires/12th.json')).default
  if (key === 'ug') return (await import('@/seed/interestQuestionnaires/ug.json')).default
  return (await import('@/seed/interestQuestionnaires/pg.json')).default
}

export const loadSeedDomains = async (level: EducationLevel): Promise<SeedDomain[]> => {
  const key = levelKey(level)
  if (key === '10th') return (await import('@/seed/domains/10th.json')).default
  if (key === '12th') return (await import('@/seed/domains/12th.json')).default
  if (key === 'ug') return (await import('@/seed/domains/ug.json')).default
  return (await import('@/seed/domains/pg.json')).default
}

export const loadSeedCourses = async (level: EducationLevel): Promise<SeedCourse[]> => {
  const key = levelKey(level)
  if (key === '10th') return (await import('@/seed/courses/10th.json')).default
  if (key === '12th') return (await import('@/seed/courses/12th.json')).default
  if (key === 'ug') return (await import('@/seed/courses/ug.json')).default
  return (await import('@/seed/courses/pg.json')).default
}

export const loadSeedExams = async (level: EducationLevel): Promise<SeedExam[]> => {
  const key = levelKey(level)
  if (key === '10th') return (await import('@/seed/exams/10th.json')).default
  if (key === '12th') return (await import('@/seed/exams/12th.json')).default
  if (key === 'ug') return (await import('@/seed/exams/ug.json')).default
  return (await import('@/seed/exams/pg.json')).default
}

export const loadSeedCollegesKarnataka = async (): Promise<SeedCollege[]> => {
  return (await import('@/seed/colleges/karnataka.json')).default
}

export const loadSeedScholarshipsKarnataka = async (): Promise<SeedScholarship[]> => {
  return (await import('@/seed/scholarships/karnataka.json')).default as SeedScholarship[]
}

export const loadSeedStudyMaterialsKarnataka = async (): Promise<SeedStudyMaterial[]> => {
  return (await import('@/seed/studyMaterials/karnataka.json')).default as SeedStudyMaterial[]
}
