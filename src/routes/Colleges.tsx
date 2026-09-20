import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { saveRecommendationSelections } from '@/services/profileService'
import { MapWidget } from '@/components/MapWidget'
import { loadSeedCollegesKarnataka, type SeedCollege } from '@/services/seedDataService'
import { getNearbyColleges, resolveEffectiveGeo, resolveCollegeGeo, type CollegeGeoResolution } from '@/services/seedCollegeRecommendationService'

// Static map from domain ID → canonical course ID (used when selectedCourseId is absent).
// Derived directly from seed/domains/*.json `recommendedCourses[0]` per domain.
const DOMAIN_DEFAULT_COURSE: Record<string, string> = {
  // ── 12th / UG domains ──────────────────────────────────────────────────
  software_engineering: 'be_cse',
  data_science_ai: 'be_ai_ds',
  cyber_security: 'be_cse',
  electronics_embedded_systems: 'be_ece',
  automobile_aeronautical: 'be_mech',
  doctor_medical_field: 'mbbs',
  allied_health_sciences: 'bpt',
  pharmaceutical_sciences: 'bpharm',
  chartered_accountancy: 'bcom',
  business_management_domain: 'bba',
  banking_financial_services: 'bcom',
  legal_studies: 'llb',
  psychology_counselling: 'ba_psychology',
  media_mass_communication: 'ba_journalism',
  graphic_ui_ux_design: 'bdes',
  animation_vfx_gaming: 'bsc_animation',
  fashion_design_domain: 'bdes',
  defence_services: 'any_degree',
  public_administration: 'ba_public_administration',
  // ── 10th domains ───────────────────────────────────────────────────────
  computer_science: 'puc_pcmc',
  artificial_intelligence: 'puc_pcmc',
  robotics_automation: 'puc_pcme',
  electronics_communication: 'puc_pcme',
  mechanical_engineering: 'puc_pcmb',
  civil_architecture: 'puc_pcmb',
  medical_sciences: 'puc_pcmb',
  nursing_healthcare: 'puc_cbz',
  pharmacy_domain: 'puc_pcmb',
  finance_accounting: 'commerce_seba',
  business_management: 'commerce_ceba',
  banking_economics: 'commerce_heba',
  law_public_policy: 'arts_heps',
  psychology_human_behavior: 'arts_psychology',
  journalism_media: 'arts_journalism',
  ui_ux_design: 'diploma_cse',
  animation_multimedia: 'diploma_cse',
  fashion_interior_design: 'diploma_civil',
  armed_forces: 'puc_pcmb',
  civil_services: 'arts_heps',
}
import { PageShell } from '@/components/PageShell'
import { ArrowRight, ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Navigation } from 'lucide-react'

export default function Colleges() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [list, setList] = useState<SeedCollege[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setIsLoading(true)
      try {
        const data = await loadSeedCollegesKarnataka()
        if (mounted) setList(data)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation(null),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60_000,
      }
    )
  }, [])

  const userDistrict = profile?.studentDetails?.district
  const userCity = profile?.studentDetails?.city ?? profile?.questionnaire?.location?.city
  const userPincode = (profile?.studentDetails as { pincode?: string } | undefined)?.pincode

  // Resolve authentic origin coordinates from GPS, student's pincode, locality/city, district, or default
  const effectiveOrigin = useMemo(() => {
    return resolveEffectiveGeo({
      district: userDistrict,
      city: userCity,
      pincode: userPincode,
      geo: userLocation ? { lat: userLocation[0], lon: userLocation[1] } : undefined,
    })
  }, [userLocation, userDistrict, userCity, userPincode])

  // Derive the best available course ID using a three-tier fallback:
  // 1. Explicitly selected course on the Courses page (persisted in profile)
  // 2. First course recommendation from VisionVault stored in session storage
  // 3. Static default course for the user's selected domain
  // This mirrors the same pattern in recommendationPipeline.ts and studyMaterialsPersonalization.ts.
  const effectiveCourseId = useMemo(() => {
    if (profile?.selectedCourseId) return profile.selectedCourseId

    // Fallback 1: VisionVault course matches written to session storage by Questionnaire
    try {
      const raw = sessionStorage.getItem('vv_course_matches')
      if (raw) {
        const list = JSON.parse(raw) as Array<{ course_id?: string; courseId?: string; id?: string }>
        if (Array.isArray(list) && list.length > 0) {
          const first = list[0]
          const id = first?.course_id ?? first?.courseId ?? first?.id
          if (typeof id === 'string' && id.length > 0) return id
        }
      }
    } catch (_) { /* ignore parse errors */ }

    // Fallback 2: static domain → course default (covers all seed domain IDs)
    if (profile?.selectedDomainId) {
      const fallback = DOMAIN_DEFAULT_COURSE[profile.selectedDomainId]
      if (fallback) return fallback
    }

    return null
  }, [profile?.selectedCourseId, profile?.selectedDomainId])

  const filtered = useMemo(() => {
    const courseId = effectiveCourseId
    if (!courseId) return []

    const primary = getNearbyColleges({
      colleges: list,
      courseId,
      selectedExamIds: profile?.selectedExamIds ?? [],
      user: {
        district: userDistrict,
        city: userCity,
        pincode: userPincode,
        geo: effectiveOrigin,
      },
      limit: 50,
    })

    return primary.map((x) => ({
      ...x.college,
      __distanceKm: x.distanceKm,
      __score: x.score,
      __geo: x.geo,
    })) as Array<
      SeedCollege & { __distanceKm?: number; __score?: number; __geo?: CollegeGeoResolution }
    >
  }, [list, effectiveCourseId, profile?.selectedExamIds, userDistrict, userCity, userPincode, effectiveOrigin])

  const withDistance = useMemo(() => {
    return filtered.map((c) => {
      const dist = (c as SeedCollege & { __distanceKm?: number }).__distanceKm
      const geo = (c as SeedCollege & { __geo?: CollegeGeoResolution }).__geo
      return { college: c, distanceKm: typeof dist === 'number' ? dist : (null as number | null), geo }
    })
  }, [filtered])

  const mapColleges = useMemo(() => {
    return withDistance
      .map((x) => {
        const geo = x.geo ?? resolveCollegeGeo(x.college)
        if (!geo) return null
        return {
          id: x.college.id,
          name: x.college.name,
          lat: geo.lat,
          lon: geo.lon,
          website: x.college.website,
          courses: x.college.coursesOffered,
          type: x.college.type,
          distanceKm: x.distanceKm ?? undefined,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [withDistance])

  const savedCollegeIds = new Set(profile?.savedCollegeIds ?? [])

  const toggleSave = (collegeId: string) => {
    if (!profile) return
    const next = new Set(profile.savedCollegeIds ?? [])
    if (next.has(collegeId)) next.delete(collegeId)
    else next.add(collegeId)
    setProfile({ ...profile, savedCollegeIds: Array.from(next), updatedAt: new Date() })
  }

  const handleFinish = async () => {
    if (!profile?.uid) {
      navigate('/dashboard')
      return
    }

    setIsSaving(true)
    try {
      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveRecommendationSelections({ uid: profile.uid, savedCollegeIds: profile.savedCollegeIds ?? [] }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      navigate('/dashboard')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="inline-block p-4 border-3 border-ink dark:border-white bg-[#FFD84D] shadow-[4px_4px_0px_#11110F] mb-4">
            <span className="font-mono text-sm font-bold text-ink uppercase animate-pulse">
              LOADING NEARBY COLLEGES...
            </span>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
              STEP 6 OF 6 • INSTITUTION EXPLORER & MAPPING
            </span>
            <span className="border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
              12TH STANDARD
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Karnataka College Network
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Discover verified colleges offering your course with real-time geographic proximity and state fee tiers.
          </p>
        </div>


        {!isLoading && list.length === 0 ? (
          <div className="mb-8 border-3 border-ink dark:border-white bg-[#FFD84D] p-6 shadow-[4px_4px_0px_#11110F]">
            <h3 className="text-lg font-black font-display text-ink mb-2">College dataset initializing</h3>
            <p className="text-xs font-mono text-ink mb-4">
              Karnataka seed dataset is loading in background.
            </p>
            <Button
              onClick={handleFinish}
              className="bg-ink text-cream font-bold border-2 border-ink shadow-[2px_2px_0px_#fff]"
            >
              Skip for now → Dashboard
            </Button>
          </div>
        ) : null}

        <div className="space-y-8">
          {/* Interactive Map Section */}
          <div className="border-3 border-ink dark:border-white shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] overflow-hidden bg-white dark:bg-[#11110F]">
            <div className="bg-[#FFD84D] border-b-2 border-ink px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Navigation className="w-4 h-4" /> GEOGRAPHIC PINPOINT MAP • KARNATAKA REGION
              </span>
              <span className="font-mono text-xs font-bold text-ink">
                {mapColleges.length} Institutions Plotted
              </span>
            </div>
            <MapWidget userLocation={[effectiveOrigin.lat, effectiveOrigin.lon]} colleges={mapColleges} showList={false} />
          </div>

          {/* Colleges List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black font-display text-ink dark:text-cream">
                Nearby Institutions ({withDistance.length})
              </h2>
            </div>

            {withDistance.length === 0 ? (
              <div className="border-2 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] p-8 text-center shadow-[4px_4px_0px_#11110F]">
                <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                  No colleges found offering this specific course.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {withDistance.map(({ college: c, distanceKm, geo }) => {
                  const saved = savedCollegeIds.has(c.id)
                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleSave(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') toggleSave(c.id)
                      }}
                      className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 flex flex-col justify-between ${
                        saved
                          ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                          : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                      }`}
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`font-mono text-xs uppercase px-2 py-0.5 border-2 border-ink shadow-[1.5px_1.5px_0px_#11110F] ${
                              c.type === 'government' ? 'bg-[#62E89B] text-ink' : 'bg-[#9DD9FF] text-ink'
                            }`}>
                              {c.type.replace(/_/g, ' ')}
                            </span>
                            {c.city ? (
                              <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5">
                                {c.city}
                              </span>
                            ) : null}
                            {typeof distanceKm === 'number' ? (
                              <span className="font-mono text-xs uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                                {geo?.isApproximateDistrict ? `~${distanceKm.toFixed(0)} km (district)` : `${distanceKm.toFixed(1)} km`}
                              </span>
                            ) : null}
                          </div>

                          {saved ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                              <BookmarkCheck className="w-3.5 h-3.5 stroke-[3]" /> SAVED
                            </span>
                          ) : null}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-black font-display text-ink dark:text-cream mb-2 leading-snug">
                          {c.name}
                        </h3>

                        {typeof c.fees?.min === 'number' || typeof c.fees?.max === 'number' ? (
                          <div className="mb-4 pb-2 border-b-2 border-ink/10 dark:border-white/10">
                            <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                              Estimated Fees:{' '}
                              <strong className="text-ink dark:text-cream">
                                {c.fees?.min && c.fees?.max && c.fees.min !== c.fees.max
                                  ? `₹${c.fees.min.toLocaleString('en-IN')} - ₹${c.fees.max.toLocaleString('en-IN')}`
                                  : `₹${(c.fees?.min ?? c.fees?.max ?? 0).toLocaleString('en-IN')}`}
                              </strong>
                              /yr
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Bottom action controls */}
                      <div className="space-y-2 pt-2">
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSave(c.id)
                          }}
                          className={`flex items-center justify-center gap-2 py-2 px-3 border-2 border-ink dark:border-white font-mono text-xs font-bold uppercase cursor-pointer select-none transition-all ${
                            saved
                              ? 'bg-[#C8FF32] text-ink shadow-[2px_2px_0px_#11110F]'
                              : 'bg-white dark:bg-[#11110F] text-ink dark:text-cream hover:bg-neutral-100 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]'
                          }`}
                        >
                          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          {saved ? 'Saved in My College Target List' : 'Save to College List'}
                        </div>

                        {c.website ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(c.website!, '_blank', 'noopener,noreferrer')
                            }}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Institution Website
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/exams')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Exams
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={isSaving}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            {isSaving ? 'Saving Selection...' : 'Finish & View Dashboard'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}

