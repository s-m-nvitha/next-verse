import type { College, CollegeType } from '@/models/college'
import { haversineDistanceKm } from '@/utils/distance'

export interface CollegeRecommendation {
  collegeId: string
  score: number
  distanceKm?: number
  explanation: string
}

export const recommendColleges = (args: {
  colleges: College[]
  courseId: string
  acceptedExamIds: string[]
  userLocation?: { state?: string; city?: string; lat?: number; lon?: number }
  affordabilityPreference?: 'low_fees_first' | 'balanced' | 'best_fit_first'
  preferredCollegeType?: CollegeType
  limit?: number
}): CollegeRecommendation[] => {
  const limit = args.limit ?? 10
  const state = args.userLocation?.state?.toLowerCase()
  const city = args.userLocation?.city?.toLowerCase()

  const filteredByCourse = args.colleges.filter((c) => c.courseIds.includes(args.courseId))

  const filteredByState = state ? filteredByCourse.filter((c) => c.state.toLowerCase() === state) : filteredByCourse

  const filteredByCity = city ? filteredByState.filter((c) => c.city.toLowerCase() === city || c.city.toLowerCase().includes(city)) : filteredByState

  const base = filteredByCity.length > 0 ? filteredByCity : filteredByState

  const scored = base
    .map((c) => {
      const examMatch = c.acceptedExamIds.some((id) => args.acceptedExamIds.includes(id))
      const typeBonus = args.preferredCollegeType && c.type === args.preferredCollegeType ? 12 : 0
      const govtBonus = c.type === 'government' ? 10 : c.type === 'semi_government' ? 6 : 0
      const ratingBonus = Math.round(Math.max(0, c.rating - 3) * 6)

      const distanceKm =
        typeof args.userLocation?.lat === 'number' && typeof args.userLocation?.lon === 'number'
          ? Math.round(
              haversineDistanceKm(
                { lat: args.userLocation.lat, lon: args.userLocation.lon },
                { lat: c.latitude, lon: c.longitude }
              ) * 10
            ) / 10
          : undefined

      const distancePenalty = typeof distanceKm === 'number' ? Math.min(20, Math.round(distanceKm / 15)) : 0

      const affordabilityWeight = args.affordabilityPreference === 'low_fees_first' ? 1.2 : args.affordabilityPreference === 'best_fit_first' ? 0.8 : 1
      const feeScore = Math.max(0, 35 - Math.round((c.averageFeesInr / 50000) * 3))
      const feeComponent = Math.round(feeScore * affordabilityWeight)

      const score =
        (examMatch ? 30 : 10) +
        feeComponent +
        govtBonus +
        typeBonus +
        ratingBonus -
        distancePenalty

      const explanation = `${c.name} was ranked using course availability, accepted exams, fees, rating, and distance.`

      return { collegeId: c.id, score, distanceKm, explanation }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if ((a.distanceKm ?? Infinity) !== (b.distanceKm ?? Infinity)) return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
      return a.collegeId.localeCompare(b.collegeId)
    })

  return scored.slice(0, limit)
}
