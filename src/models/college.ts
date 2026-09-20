export type CollegeType = 'government' | 'semi_government' | 'private'

export interface College {
  id: string
  name: string
  state: string
  city: string
  type: CollegeType
  courseIds: string[]
  averageFeesInr: number
  rating: number
  acceptedExamIds: string[]
  latitude: number
  longitude: number
}
