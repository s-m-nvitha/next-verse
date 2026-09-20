import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { COLLECTIONS } from '@/lib/firestore-schemas'

export const DOMAIN_KEYS = [
  'science',
  'technology',
  'medicine',
  'arts',
  'commerce',
  'law',
  'sports',
] as const

export type DomainKey = (typeof DOMAIN_KEYS)[number]
export type EducationLevelKey = '10th' | '12th' | 'UG' | 'PG'

export type Interest = {
  id: DomainKey
  weight: number
}

export type Course = {
  id: string
  name: string
  domains: DomainKey[]
  requiredLevel: EducationLevelKey[]
  exams: string[]
  tags: string[]
}

export type UserProfile = {
  uid: string
  educationLevel: EducationLevelKey
  interests: Interest[]
  preferences?: string[]
}

export type UserCourseInteractionType = 'click' | 'save'

export type UserCourseInteraction = {
  uid: string
  courseId: string
  type: UserCourseInteractionType
  createdAt: Date
}

export type RecommendationReason = {
  becauseYouLike: string[]
  matchedDomains: DomainKey[]
  matchedTags: string[]
}

export type ScoredRecommendation = {
  course: Course
  score: number
  scoreBreakdown: {
    interestScore: number
    similarityScore: number
    levelMatchScore: number
    tagMatchScore: number
    interactionBoost: number
  }
  matchPercent: number
  tags: string[]
  reason: RecommendationReason
}

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n))

const safeCosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

const normalizeString = (v: string): string => v.trim().toLowerCase()

const unique = <T,>(items: T[]): T[] => Array.from(new Set(items))

const parseDomain = (raw: string): DomainKey | null => {
  const v = normalizeString(raw)

  if (v.includes('tech') || v.includes('computer') || v.includes('it') || v.includes('engineering') || v.includes('software')) {
    return 'technology'
  }
  if (v.includes('med') || v.includes('mbbs') || v.includes('nursing') || v.includes('pharma') || v.includes('health')) {
    return 'medicine'
  }
  if (v.includes('commerce') || v.includes('account') || v.includes('finance') || v.includes('bank')) {
    return 'commerce'
  }
  if (v.includes('law') || v.includes('llb') || v.includes('clat') || v.includes('legal')) {
    return 'law'
  }
  if (v.includes('sport') || v.includes('athlet') || v.includes('fitness') || v.includes('bped')) {
    return 'sports'
  }
  if (v.includes('art') || v.includes('humanit') || v.includes('design') || v.includes('music') || v.includes('dance') || v.includes('journal')) {
    return 'arts'
  }
  if (v.includes('science') || v.includes('physics') || v.includes('chem') || v.includes('bio') || v.includes('math') || v.includes('research')) {
    return 'science'
  }

  return null
}

const buildVector = (domainWeights: Partial<Record<DomainKey, number>>): number[] => {
  return DOMAIN_KEYS.map((k) => domainWeights[k] ?? 0)
}

export const buildUserVector = (profile: UserProfile): number[] => {
  const weights: Partial<Record<DomainKey, number>> = {}
  for (const interest of profile.interests) {
    weights[interest.id] = (weights[interest.id] ?? 0) + interest.weight
  }
  return buildVector(weights)
}

export const buildCourseVector = (course: Course): number[] => {
  const weights: Partial<Record<DomainKey, number>> = {}
  for (const d of course.domains) {
    weights[d] = (weights[d] ?? 0) + 1
  }
  return buildVector(weights)
}

const computeInterestScore = (profile: UserProfile, course: Course): number => {
  const domainSet = new Set(course.domains)
  const totalUserWeight = profile.interests.reduce((sum, i) => sum + i.weight, 0)
  if (totalUserWeight <= 0) return 0

  const matched = profile.interests
    .filter((i) => domainSet.has(i.id))
    .reduce((sum, i) => sum + i.weight, 0)

  return clamp01(matched / totalUserWeight)
}

const computeLevelMatchScore = (profile: UserProfile, course: Course): number => {
  return course.requiredLevel.includes(profile.educationLevel) ? 1 : -1
}

const computeTagMatchScore = (profile: UserProfile, course: Course): number => {
  if (!profile.preferences || profile.preferences.length === 0) return 0

  const pref = new Set(profile.preferences.map(normalizeString))
  const matches = course.tags.filter((t) => pref.has(normalizeString(t))).length

  // normalize: cap at 5 tags max
  return Math.min(matches / 5, 1)
}

export const computeScore = (args: {
  profile: UserProfile
  course: Course
  interactionBoost?: number
}): ScoredRecommendation => {
  const { profile, course } = args
  const interactionBoost = args.interactionBoost ?? 0

  const userVector = buildUserVector(profile)
  const courseVector = buildCourseVector(course)

  const interestScore = computeInterestScore(profile, course)
  const similarityScore = clamp01(safeCosineSimilarity(userVector, courseVector))
  const levelMatchScore = computeLevelMatchScore(profile, course)
  const tagMatchScore = computeTagMatchScore(profile, course)

  const rawScore =
    interestScore * 0.5 +
    similarityScore * 0.3 +
    levelMatchScore * 0.1 +
    tagMatchScore * 0.1 +
    interactionBoost

  // Convert raw score to a stable 0..1
  const score01 = clamp01((rawScore + 0.1) / 1.2)
  const matchPercent = Math.round(score01 * 100)

  const matchedDomains = course.domains.filter((d) => profile.interests.some((i) => i.id === d))
  const matchedTags = (profile.preferences ?? []).filter((p) => course.tags.map(normalizeString).includes(normalizeString(p)))

  const tags: string[] = []
  if (matchPercent >= 80) tags.push('High match')
  if (interactionBoost > 0) tags.push('Best for you')

  return {
    course,
    score: score01,
    matchPercent,
    tags,
    scoreBreakdown: {
      interestScore,
      similarityScore,
      levelMatchScore,
      tagMatchScore,
      interactionBoost,
    },
    reason: {
      becauseYouLike: unique(matchedDomains).map((d) => d),
      matchedDomains: unique(matchedDomains),
      matchedTags: unique(matchedTags),
    },
  }
}

const interactionBoostFromHistory = (courseId: string, interactions: UserCourseInteraction[]): number => {
  const clicks = interactions.filter((i) => i.courseId === courseId && i.type === 'click').length
  const saves = interactions.filter((i) => i.courseId === courseId && i.type === 'save').length

  // small, bounded boost
  const clickBoost = Math.min(clicks * 0.02, 0.08)
  const saveBoost = Math.min(saves * 0.05, 0.15)
  return clickBoost + saveBoost
}

export const getTopRecommendations = async (args: {
  profile: UserProfile
  courses: Course[]
  limit?: number
  includeBehaviorBoost?: boolean
}): Promise<ScoredRecommendation[]> => {
  const { profile, courses } = args
  const topN = args.limit ?? 10
  const includeBehaviorBoost = args.includeBehaviorBoost ?? true

  const interactions = includeBehaviorBoost
    ? await getUserInteractions({ uid: profile.uid, limit: 200 })
    : ([] as UserCourseInteraction[])

  const scored = courses
    .map((course) => {
      const interactionBoost = interactionBoostFromHistory(course.id, interactions)
      return computeScore({ profile, course, interactionBoost })
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return scored
}

export const getExamsForCourses = (courses: Course[]): string[] => {
  return unique(courses.flatMap((c) => c.exams)).sort((a, b) => a.localeCompare(b))
}

export const inferCourseFromSeed = (seedCourse: {
  id: string
  name: string
  level: EducationLevelKey
  exams?: string[]
}): Course => {
  const domains = unique([
    parseDomain(seedCourse.id),
    parseDomain(seedCourse.name),
  ].filter((v): v is DomainKey => v !== null))

  const tags: string[] = []
  if (domains.includes('technology')) tags.push('Problem Solving')
  if (domains.includes('medicine')) tags.push('Service')
  if (domains.includes('commerce')) tags.push('Business')
  if (domains.includes('arts')) tags.push('Creative')
  if (domains.includes('law')) tags.push('Government job')

  return {
    id: seedCourse.id,
    name: seedCourse.name,
    domains: domains.length > 0 ? domains : ['science'],
    requiredLevel: [seedCourse.level],
    exams: seedCourse.exams ?? [],
    tags: unique(tags),
  }
}

export const saveRecommendationSnapshot = async (args: {
  uid: string
  educationLevel: EducationLevelKey
  interests: Interest[]
  recommendations: ScoredRecommendation[]
}): Promise<void> => {
  const topCourses = args.recommendations.map((r) => r.course.id)
  const topExams = getExamsForCourses(args.recommendations.map((r) => r.course))

  const rationale = args.recommendations[0]
    ? `Because you like ${args.recommendations[0].reason.becauseYouLike.join(' + ')}`
    : 'Personalized recommendations'

  await addDoc(collection(db, COLLECTIONS.RECOMMENDATIONS), {
    uid: args.uid,
    educationLevel: args.educationLevel,
    interests: args.interests.map((i) => i.id),
    courses: topCourses,
    exams: topExams,
    rationale,
    confidence: args.recommendations[0]?.score ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const saveUserInteraction = async (interaction: Omit<UserCourseInteraction, 'createdAt'>): Promise<void> => {
  await addDoc(collection(db, COLLECTIONS.USER_BEHAVIOR), {
    ...interaction,
    createdAt: serverTimestamp(),
  })
}

export const getUserInteractions = async (args: { uid: string; limit: number }): Promise<UserCourseInteraction[]> => {
  const q = query(
    collection(db, COLLECTIONS.USER_BEHAVIOR),
    where('uid', '==', args.uid),
    orderBy('createdAt', 'desc'),
    limit(args.limit)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs
    .map((d) => {
      const data = d.data() as {
        uid: string
        courseId: string
        type: UserCourseInteractionType
        createdAt?: { toDate: () => Date }
      }

      return {
        uid: data.uid,
        courseId: data.courseId,
        type: data.type,
        createdAt: data.createdAt?.toDate() ?? new Date(0),
      }
    })
}
