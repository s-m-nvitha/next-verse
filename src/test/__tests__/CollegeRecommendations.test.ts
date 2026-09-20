import { describe, it, expect } from 'vitest'
import { loadSeedCollegesKarnataka } from '@/services/seedDataService'
import { getNearbyColleges, resolveCollegeGeo } from '@/services/seedCollegeRecommendationService'

describe('College Recommendation and Results Fix', () => {
  it('loads seed colleges dataset with thousands of colleges', async () => {
    const colleges = await loadSeedCollegesKarnataka()
    expect(colleges.length).toBeGreaterThan(4000)
  })

  it('preserves exact coordinates when college has them and provides district fallback when absent', async () => {
    const colleges = await loadSeedCollegesKarnataka()
    const collegeWithExact = colleges.find((c) => typeof c.location?.lat === 'number' && typeof c.location?.lng === 'number')
    expect(collegeWithExact).toBeDefined()
    if (collegeWithExact) {
      const geo = resolveCollegeGeo(collegeWithExact)
      expect(geo).not.toBeNull()
      expect(geo?.isApproximateDistrict).toBe(false)
      expect(geo?.lat).toBe(collegeWithExact.location?.lat)
    }

    const collegeWithoutExact = colleges.find((c) => !c.location?.lat && Boolean(c.district))
    expect(collegeWithoutExact).toBeDefined()
    if (collegeWithoutExact) {
      const geo = resolveCollegeGeo(collegeWithoutExact)
      expect(geo).not.toBeNull()
      expect(geo?.isApproximateDistrict).toBe(true)
      expect(typeof geo?.lat).toBe('number')
      expect(typeof geo?.lon).toBe('number')
    }
  })

  it('returns multiple colleges for previously affected courses in Bengaluru Urban', async () => {
    const colleges = await loadSeedCollegesKarnataka()
    const testCourses = ['be_ai_ds', 'be_cse', 'llb', 'mbbs', 'bcom', 'bba']

    for (const courseId of testCourses) {
      const results = getNearbyColleges({
        colleges,
        courseId,
        user: { district: 'Bengaluru Urban', city: 'Bengaluru' },
        radiusKm: 100,
        limit: 50,
      })

      // Must return multiple colleges, not just 1!
      expect(results.length).toBeGreaterThan(1)
      expect(results.length).toBeLessThanOrEqual(50)

      // All returned colleges must have a valid numeric distance
      for (const item of results) {
        expect(typeof item.distanceKm).toBe('number')
        expect(item.distanceKm).toBeLessThanOrEqual(100)
      }
    }
  })

  it('returns valid local colleges for users in different Karnataka districts', async () => {
    const colleges = await loadSeedCollegesKarnataka()
    const testDistricts = ['Mysuru', 'Dakshina Kannada', 'Belagavi', 'Kalaburagi', 'Tumakuru']

    for (const district of testDistricts) {
      const results = getNearbyColleges({
        colleges,
        courseId: 'be_cse',
        user: { district },
        radiusKm: 100,
        limit: 50,
      })

      expect(results.length).toBeGreaterThan(1)
      expect(results[0].distanceKm).toBeLessThanOrEqual(100)
    }
  })
})
