import type { SeedStudyMaterial } from '@/services/seedDataService'
import { DOMAIN_CLUSTERS } from '@/services/jobs'
import type { UserProfile } from '@/lib/validators'
import { useInterestAssessmentStore } from '@/store/interestAssessment'
import { usePipelineSelectionsStore } from '@/store/pipelineSelections'

export interface PersonalizationContext {
  domainId?: string | null
  careerDomain?: string | null
  courseId?: string | null
  examIds?: string[]
  interests?: unknown[]
  educationLevel?: string | null
}

/**
 * Safely normalizes any string, object, or identifier into a canonical lowercase keyword.
 * Handles strings, objects with id/name/title/key, and cleans up hyphens, spaces, and underscores.
 */
export const normalizeKeyword = (val: unknown): string => {
  if (typeof val === 'string') {
    return val.toLowerCase().trim().replace(/[-_\s]+/g, '_')
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>
    const str = obj.id ?? obj.name ?? obj.title ?? obj.key ?? obj.value ?? obj.topic ?? ''
    if (typeof str === 'string') {
      return str.toLowerCase().trim().replace(/[-_\s]+/g, '_')
    }
  }
  return ''
}

/**
 * Safely extracts an array of normalized interest strings from a user profile,
 * supporting both string arrays and object arrays (e.g. { id, weight }, { name }, etc.).
 */
export const extractProfileInterests = (profile: UserProfile | null | undefined): string[] => {
  const result: string[] = []
  if (!profile) return result

  // 1. From interestAssessment.topInterests
  const top = profile.interestAssessment?.topInterests
  if (Array.isArray(top)) {
    for (const item of top) {
      const norm = normalizeKeyword(item)
      if (norm) result.push(norm)
    }
  }

  // 2. From profile.interests (weightedInterestSchema or string)
  const interests = profile.interests as unknown
  if (Array.isArray(interests)) {
    for (const item of interests) {
      const norm = normalizeKeyword(item)
      if (norm) result.push(norm)
    }
  }

  // 3. Fallback from interest assessment store if profile has none
  if (result.length === 0 && typeof window !== 'undefined') {
    try {
      const storeTop = useInterestAssessmentStore.getState().topInterests
      if (Array.isArray(storeTop)) {
        for (const item of storeTop) {
          const norm = normalizeKeyword(item)
          if (norm) result.push(norm)
        }
      }
    } catch {
      // Ignore in non-browser environments
    }
  }

  return Array.from(new Set(result))
}

/**
 * Expands a set of normalized keywords using the project's canonical DOMAIN_CLUSTERS.
 */
export const expandDomainKeywords = (inputKeywords: string[]): Set<string> => {
  const set = new Set<string>()

  for (const k of inputKeywords) {
    if (!k) continue
    set.add(k)

    // Tokenize multi-word keywords (e.g. 'medical_healthcare' -> 'medical', 'healthcare')
    const tokens = k.split('_').filter(Boolean)
    for (const token of tokens) {
      set.add(token)
      if (token === 'medical') set.add('medicine')
      if (token === 'medicine') set.add('medical')
      if (token === 'law') set.add('legal')
      if (token === 'legal') set.add('law')
      if (token === 'coding') { set.add('programming'); set.add('software'); }
      if (token === 'software') { set.add('coding'); set.add('programming'); }
    }

    // Check cluster membership
    for (const [clusterKey, members] of Object.entries(DOMAIN_CLUSTERS)) {
      const normClusterKey = normalizeKeyword(clusterKey)
      const normMembers = members.map(normalizeKeyword)

      const isClusterDirect = k === normClusterKey || tokens.includes(normClusterKey)
      const isMemberDirect = normMembers.includes(k) || normMembers.some((m) => k.includes(m) || m.includes(k))

      if (isClusterDirect || isMemberDirect) {
        set.add(normClusterKey)
        for (const m of normMembers) {
          set.add(m)
          for (const tok of m.split('_').filter(Boolean)) {
            set.add(tok)
            if (tok === 'medical') set.add('medicine')
            if (tok === 'medicine') set.add('medical')
          }
        }
      }
    }
  }

  return set
}

/**
 * Extracts complete personalization context from user profile and active app stores.
 */
export const resolvePersonalizationContext = (profile: UserProfile | null | undefined): PersonalizationContext => {
  const storeInterestDomain = typeof window !== 'undefined'
    ? useInterestAssessmentStore.getState().selectedDomainId
    : null

  const storeCourseId = typeof window !== 'undefined'
    ? usePipelineSelectionsStore.getState().selectedCourseId
    : null

  const storeExamIds = typeof window !== 'undefined'
    ? usePipelineSelectionsStore.getState().selectedExamIds
    : []

  const domainId = profile?.selectedDomainId ?? storeInterestDomain ?? null
  const careerDomain = profile?.selectedCareerDomain ?? null
  const courseId = profile?.selectedCourseId ?? storeCourseId ?? null

  const examIds = profile?.selectedExamIds?.length
    ? profile.selectedExamIds
    : storeExamIds

  const interests = extractProfileInterests(profile)

  const educationLevel =
    profile?.educationLevel ??
    (profile?.educationInfo as { level?: string } | undefined)?.level ??
    null

  return {
    domainId,
    careerDomain,
    courseId,
    examIds,
    interests,
    educationLevel,
  }
}

/**
 * Determines whether a material matches the student's profile context and calculates a relevance score.
 */
export const matchMaterialToContext = (
  material: SeedStudyMaterial,
  context: PersonalizationContext
): { isMatch: boolean; score: number } => {
  // Validate that material is usable
  if (!material.title || !material.url) {
    return { isMatch: false, score: 0 }
  }

  // Collect all keywords from profile signals
  const profileTokens: string[] = []
  if (context.domainId) profileTokens.push(normalizeKeyword(context.domainId))
  if (context.careerDomain) profileTokens.push(normalizeKeyword(context.careerDomain))
  for (const i of context.interests ?? []) {
    profileTokens.push(normalizeKeyword(i))
  }

  const expandedProfileKeywords = expandDomainKeywords(profileTokens)
  const examSet = new Set((context.examIds ?? []).map(normalizeKeyword))
  const normalizedCourseId = context.courseId ? normalizeKeyword(context.courseId) : null

  // Material metadata normalized
  const materialDomains = (material.relatedDomains ?? []).map(normalizeKeyword)
  const materialCourses = (material.relatedCourses ?? []).map(normalizeKeyword)
  const materialExams = (material.relatedExams ?? []).map(normalizeKeyword)
  const materialTitle = normalizeKeyword(material.title)

  let isMatch = false
  let score = 0

  // 1. Direct course match (highest specificity)
  if (normalizedCourseId && materialCourses.includes(normalizedCourseId)) {
    isMatch = true
    score += 60
  }

  // 2. Exam match
  const examHits = materialExams.filter((e) => examSet.has(e)).length
  if (examHits > 0) {
    isMatch = true
    score += examHits * 45
  }

  // 3. Domain cluster match
  const domainHits = materialDomains.filter((d) => {
    if (expandedProfileKeywords.has(d)) return true
    // Also check token substring
    const tokens = d.split('_').filter(Boolean)
    return tokens.some((t) => expandedProfileKeywords.has(t))
  }).length

  if (domainHits > 0) {
    isMatch = true
    score += domainHits * 30
  }

  // 4. Title / interest keyword match
  for (const kw of Array.from(expandedProfileKeywords)) {
    if (kw.length >= 3 && materialTitle.includes(kw)) {
      isMatch = true
      score += 20
      break
    }
  }

  // 5. Education level alignment boost
  if (context.educationLevel && material.level === context.educationLevel) {
    score += 15
  }

  // 6. Quality & Verification boost
  if (material.verified) {
    score += 10
  }

  return { isMatch, score }
}

/**
 * Filters and ranks materials into Personalized and All sets.
 */
export const filterAndRankMaterials = (
  catalog: SeedStudyMaterial[],
  context: PersonalizationContext
): {
  allMaterials: SeedStudyMaterial[]
  personalizedMaterials: SeedStudyMaterial[]
} => {
  // 1. All valid materials (must have a title and url)
  const allMaterials = catalog.filter((m) => Boolean(m.title && m.url))

  // 2. Has meaningful profile signals?
  const hasSignals = Boolean(
    context.domainId ||
    context.careerDomain ||
    context.courseId ||
    (context.examIds && context.examIds.length > 0) ||
    (context.interests && context.interests.length > 0)
  )

  if (!hasSignals) {
    // If no signals, personalized returns the top foundational materials
    return {
      allMaterials,
      personalizedMaterials: allMaterials,
    }
  }

  // Score each material
  const scored = allMaterials.map((m) => ({
    material: m,
    ...matchMaterialToContext(m, context),
  }))

  const matched = scored
    .filter((x) => x.isMatch)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.material.title.localeCompare(b.material.title)
    })
    .map((x) => x.material)

  return {
    allMaterials,
    personalizedMaterials: matched,
  }
}
