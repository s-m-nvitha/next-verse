import { EducationLevel } from '@/lib/validators'

// Education level specific data interfaces
export type SeedInterest = {
  id: string
  labelKey: string
  descriptionKey: string
  level?: EducationLevel
  subjects?: string[]
  careerPaths?: string[]
  exams?: string[]
}

export type SeedCourse = {
  id: string
  name: string
  level: EducationLevel
  description?: string
  subjects?: string[]
  duration?: string
  careerPaths?: string[]
  nextSteps?: string[]
  branches?: string[]
  exams?: string[]
  colleges?: string[]
}

export type SeedExam = {
  id: string
  name: string
  level: EducationLevel
  description?: string
  subjects?: string[]
  eligibility?: string
}

export interface EducationLevelData {
  interests: SeedInterest[]
  courses: SeedCourse[]
  exams: SeedExam[]
  colleges: unknown[]
  timeline: unknown[]
}

// Service class for managing education level specific data
export class EducationLevelService {
  private static instance: EducationLevelService
  private dataCache: Map<EducationLevel, EducationLevelData> = new Map()

  private constructor() {}

  static getInstance(): EducationLevelService {
    if (!EducationLevelService.instance) {
      EducationLevelService.instance = new EducationLevelService()
    }
    return EducationLevelService.instance
  }

  // Get data for specific education level
  async getDataForLevel(level: EducationLevel): Promise<EducationLevelData> {
    if (this.dataCache.has(level)) {
      return this.dataCache.get(level)!
    }

    try {
      console.log(`Loading data for education level: ${level}`)
      
      const [interests, courses, exams] = await Promise.all([
        this.loadInterests(level),
        this.loadCourses(level),
        this.loadExams(level)
      ])

      const data: EducationLevelData = {
        interests,
        courses,
        exams,
        colleges: [], // Simplified for now
        timeline: [] // Simplified for now
      }

      console.log(`Loaded data for ${level}:`, {
        interests: interests.length,
        courses: courses.length,
        exams: exams.length
      })

      this.dataCache.set(level, data)
      return data
    } catch (error) {
      console.error(`Error loading data for level ${level}:`, error)
      // Return empty data structure instead of throwing
      const emptyData: EducationLevelData = {
        interests: [],
        courses: [],
        exams: [],
        colleges: [],
        timeline: []
      }
      return emptyData
    }
  }

  // Load interests for specific education level
  private async loadInterests(level: EducationLevel): Promise<SeedInterest[]> {
    try {
      const url = `/seed/interests-${level.toLowerCase()}.json`
      console.log(`🔍 DEBUG: Loading interests from: ${url}`)
      const response = await fetch(url)
      console.log(`🔍 DEBUG: Response status: ${response.status}, ok: ${response.ok}`)
      if (!response.ok) {
        throw new Error(`Failed to load interests for ${level}: ${response.status}`)
      }
      const data = await response.json()
      console.log(`🔍 DEBUG: Loaded ${data.length} interests for ${level}`)
      return data as SeedInterest[]
    } catch (error) {
      console.warn(`🔍 DEBUG: Using fallback interests for ${level}:`, error)
      return this.getFallbackInterests(level)
    }
  }

  // Load courses for specific education level
  private async loadCourses(level: EducationLevel): Promise<SeedCourse[]> {
    try {
      const response = await fetch(`/seed/courses-${level.toLowerCase()}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load courses for ${level}`)
      }
      return (await response.json()) as SeedCourse[]
    } catch (error) {
      console.warn(`Using fallback courses for ${level}`)
      return this.getFallbackCourses(level)
    }
  }

  // Load exams for specific education level
  private async loadExams(level: EducationLevel): Promise<SeedExam[]> {
    try {
      const response = await fetch(`/seed/exams-${level.toLowerCase()}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load exams for ${level}`)
      }
      return (await response.json()) as SeedExam[]
    } catch (error) {
      console.warn(`Using fallback exams for ${level}`)
      return this.getFallbackExams(level)
    }
  }

  // Clear cache for specific level
  clearCache(level: EducationLevel): void {
    this.dataCache.delete(level)
  }

  // Clear all cache
  clearAllCache(): void {
    this.dataCache.clear()
  }

  // Fallback data methods
  private getFallbackInterests(level: EducationLevel): SeedInterest[] {
    const baseInterests = [
      { id: 'science', labelKey: 'interests.science', descriptionKey: 'interests.scienceDescription', level },
      { id: 'mathematics', labelKey: 'interests.mathematics', descriptionKey: 'interests.mathematicsDescription', level },
      { id: 'technology', labelKey: 'interests.technology', descriptionKey: 'interests.technologyDescription', level },
      { id: 'arts', labelKey: 'interests.arts', descriptionKey: 'interests.artsDescription', level },
      { id: 'commerce', labelKey: 'interests.commerce', descriptionKey: 'interests.commerceDescription', level }
    ]
    return baseInterests
  }

  private getFallbackCourses(level: EducationLevel): SeedCourse[] {
    const baseCourses = [
      { id: `basic-${level}`, name: `Basic ${level} Course`, level, description: `Fundamental ${level} education` },
      { id: `advanced-${level}`, name: `Advanced ${level} Course`, level, description: `Advanced ${level} education` }
    ]
    return baseCourses
  }

  private getFallbackExams(level: EducationLevel): SeedExam[] {
    const baseExams = [
      { id: `board-${level}`, name: `${level} Board Exam`, level, description: `Official ${level} board examination` },
      { id: `competitive-${level}`, name: `Competitive ${level} Exam`, level, description: `Competitive examination for ${level}` }
    ]
    return baseExams
  }
}

// Export singleton instance
export const educationLevelService = EducationLevelService.getInstance()
