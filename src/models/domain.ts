export type DomainGrowthOutlook = 'low' | 'medium' | 'high'

export interface SalaryRange {
  minLpa: number
  maxLpa: number
}

export interface CareerDomain {
  id: string
  title: string
  description: string
  futureScope: string
  relatedInterests: string[]
  trendingCareers: string[]
  salaryRange: SalaryRange
  growthOutlook: DomainGrowthOutlook
}
