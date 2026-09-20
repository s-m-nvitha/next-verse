import type { SeedCourse, SeedDomain, SeedExam } from '@/services/seedDataService'

export interface DomainScore {
  domainId: string
  name: string
  description: string
  score: number
  percentage: number
  matchedInterestIds: string[]
}

export const calculateDomainScores = (args: {
  domains: SeedDomain[]
  selectedInterestIds: string[]
}): DomainScore[] => {
  const selected = new Set(args.selectedInterestIds)

  const scored = args.domains.map((d) => {
    const matched = d.relatedInterests.filter((x) => selected.has(x))
    const score = matched.length
    const max = Math.max(1, d.relatedInterests.length)
    const percentage = Math.round((score / max) * 100)

    return {
      domainId: d.id,
      name: d.name,
      description: d.description ?? '',
      score,
      percentage,
      matchedInterestIds: matched,
    }
  })

  return scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.percentage !== a.percentage) return b.percentage - a.percentage
    return a.domainId.localeCompare(b.domainId)
  })
}

export const getTopDomains = (args: {
  domains: SeedDomain[]
  selectedInterestIds: string[]
  limit?: number
}): DomainScore[] => {
  const limit = args.limit ?? 5
  return calculateDomainScores({ domains: args.domains, selectedInterestIds: args.selectedInterestIds }).slice(0, limit)
}

export interface CourseMatch {
  course: SeedCourse
  score: number
  percentage: number
  matchedInterestIds: string[]
}

export const ML_TO_10TH_DOMAIN_MAP: Record<string, string> = {
  software_engineering: 'computer_science',
  data_science_ai: 'artificial_intelligence',
  cyber_security: 'computer_science',
  electronics_embedded_systems: 'electronics_communication',
  automobile_aeronautical: 'mechanical_engineering',
  doctor_medical_field: 'medical_sciences',
  allied_health_sciences: 'nursing_healthcare',
  pharmaceutical_sciences: 'pharmacy_domain',
  chartered_accountancy: 'finance_accounting',
  business_management_domain: 'business_management',
  banking_financial_services: 'banking_economics',
  legal_studies: 'law_public_policy',
  psychology_counselling: 'psychology_human_behavior',
  media_mass_communication: 'journalism_media',
  graphic_ui_ux_design: 'ui_ux_design',
  animation_vfx_gaming: 'animation_multimedia',
  fashion_design_domain: 'fashion_interior_design',
  defence_services: 'armed_forces',
  public_administration: 'civil_services',
}

export const filterCoursesByDomain = (args: {
  courses: SeedCourse[]
  domainId: string
  domains?: SeedDomain[]
  domain?: SeedDomain
  limit?: number
}): SeedCourse[] => {
  const limit = args.limit
  const alias10th = ML_TO_10TH_DOMAIN_MAP[args.domainId]
  const domain =
    args.domain ??
    args.domains?.find((d) => d.id === args.domainId) ??
    (alias10th ? args.domains?.find((d) => d.id === alias10th) : undefined)

  // If dataset explicitly maps domainId on course objects, keep that path working.
  const explicitlyMapped = args.courses.filter(
    (c) => c.domainId === args.domainId || (alias10th && c.domainId === alias10th)
  )
  if (explicitlyMapped.length > 0) return typeof limit === 'number' ? explicitlyMapped.slice(0, limit) : explicitlyMapped

  if (!domain) return []

  const recommendedCourseIds = new Set(domain.recommendedCourses ?? [])
  const selected = new Set(domain.relatedInterests)

  const ranked: CourseMatch[] = args.courses.map((c) => {
    const isDirectlyRecommended = recommendedCourseIds.has(c.id)
    const rel = c.relatedInterests ?? []
    const matched = rel.filter((x) => selected.has(x))
    let score = matched.length
    if (isDirectlyRecommended) score += 100

    const max = Math.max(1, rel.length)
    const percentage = isDirectlyRecommended ? 95 : Math.round((matched.length / max) * 100)
    return { course: c, score, percentage, matchedInterestIds: matched }
  })

  const sorted = ranked
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.percentage !== a.percentage) return b.percentage - a.percentage
      return a.course.id.localeCompare(b.course.id)
    })
    .filter((x) => x.score > 0)
    .map((x) => x.course)

  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export const filterExamsByCourse = (args: { exams: SeedExam[]; courseId: string }): SeedExam[] => {
  return args.exams.filter((e) => {
    if (e.courseId && e.courseId === args.courseId) return true

    const linked = e.linkedCourses ?? []
    if (linked.length === 0) return false
    if (linked.includes(args.courseId)) return true

    // Support dataset wildcards.
    if (linked.includes('any_course')) return true
    if (linked.includes('any_stream')) return true
    if (linked.includes('any_degree')) return true

    return false
  })
}
