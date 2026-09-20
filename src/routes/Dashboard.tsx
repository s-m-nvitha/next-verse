import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { MapWidget } from '@/components/MapWidget'
import { ExamCountdownWidget } from '@/components/ExamCountdownWidget'
import { StudyMaterialsWidget } from '@/components/StudyMaterialsWidget'
import { ScholarshipsWidget } from '@/components/ScholarshipsWidget'
import { JobsWidget } from '@/components/JobsWidget'
import { useAuthStore } from '@/store/auth'
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  BookOpen,
  Award,
  Briefcase,
  Calendar,
  Compass,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { loadSeedCollegesKarnataka, type SeedCollege } from '@/services/seedDataService'
import {
  getNearbyColleges,
  resolveCollegeGeo,
  resolveEffectiveGeo,
  calculateDistanceKm,
} from '@/services/seedCollegeRecommendationService'
import { PageShell } from '@/components/PageShell'

export default function Dashboard() {
  const { t } = useTranslation()
  const { profile, setProfile } = useAuthStore()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    colleges: true,
    exams: true,
    materials: false,
    scholarships: false,
    jobs: false,
  })

  const [collegeSeed, setCollegeSeed] = useState<SeedCollege[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const data = await loadSeedCollegesKarnataka()
      if (mounted) setCollegeSeed(data)
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
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 }
    )
  }, [])

  const effectiveOrigin = useMemo(() => {
    return resolveEffectiveGeo({
      district: profile?.studentDetails?.district,
      city: profile?.studentDetails?.city ?? profile?.questionnaire?.location?.city,
      pincode: (profile?.studentDetails as { pincode?: string } | undefined)?.pincode,
      geo: userLocation ? { lat: userLocation[0], lon: userLocation[1] } : undefined,
    })
  }, [profile?.studentDetails, profile?.questionnaire?.location?.city, userLocation])

  const savedColleges = useMemo(() => {
    const savedIds = profile?.savedCollegeIds ?? []
    if (savedIds.length === 0 || collegeSeed.length === 0) return []
    const map = new Map(collegeSeed.map((c) => [c.id, c]))

    return savedIds
      .map((id) => map.get(id))
      .filter((c): c is SeedCollege => Boolean(c))
      .map((c) => {
        const geo = resolveCollegeGeo(c)
        const dist = geo ? calculateDistanceKm({ user: effectiveOrigin, college: c }) : null
        return { college: c, distanceKm: dist, geo: geo ?? undefined }
      })
  }, [collegeSeed, profile?.savedCollegeIds, effectiveOrigin])

  const nearbyColleges = useMemo(() => {
    const courseId = profile?.selectedCourseId
    if (!courseId) return []

    const ranked = getNearbyColleges({
      colleges: collegeSeed,
      courseId,
      selectedExamIds: profile?.selectedExamIds ?? [],
      user: {
        district: profile?.studentDetails?.district,
        city: profile?.studentDetails?.city ?? profile?.questionnaire?.location?.city,
        pincode: (profile?.studentDetails as { pincode?: string } | undefined)?.pincode,
        geo: effectiveOrigin,
      },
      radiusKm: 150,
      limit: 6,
    })

    return ranked.map((x) => ({ college: x.college, distanceKm: x.distanceKm, geo: x.geo }))
  }, [collegeSeed, profile?.selectedCourseId, profile?.selectedExamIds, profile?.studentDetails, profile?.questionnaire?.location?.city, effectiveOrigin])

  const hasSavedColleges = savedColleges.length > 0
  const collegesToDisplay = hasSavedColleges ? savedColleges : nearbyColleges

  const mapColleges = useMemo(() => {
    return collegesToDisplay
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
  }, [collegesToDisplay])

  const savedCollegeIds = new Set(profile?.savedCollegeIds ?? [])

  const toggleSave = (collegeId: string) => {
    if (!profile) return
    const next = new Set(profile.savedCollegeIds ?? [])
    if (next.has(collegeId)) next.delete(collegeId)
    else next.add(collegeId)
    setProfile({ ...profile, savedCollegeIds: Array.from(next), updatedAt: new Date() })
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isParent = profile?.role === 'parent'

  if (isParent) {
    return (
      <PageShell>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto py-12"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              PARENT PORTAL
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
              Parent Dashboard
            </h1>
            <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400">
              Track your child's educational milestone roadmap and verified career selections.
            </p>
          </div>

          <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-8 text-center">
            <div className="mx-auto mb-6 p-4 border-2 border-ink bg-[#FFD84D] w-fit shadow-[3px_3px_0px_#11110F]">
              <Briefcase className="h-10 w-10 text-ink" />
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Portal Under Active Development</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Parent dashboard features are rolling out. You will be able to review verified cutoffs, scholarship alerts, and student counseling summaries here.
            </p>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-bold shadow-[3px_3px_0px_#11110F]"
            >
              Return to Previous Screen
            </Button>
          </div>
        </motion.div>
      </PageShell>
    )
  }

  const selectedDomainName = (profile?.selectedDomainId ?? profile?.selectedCareerDomain ?? 'General Track')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const selectedCourseName = (profile?.selectedCourseId ?? 'Exploring Options')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const trackedExamsCount = profile?.selectedExamIds?.length ?? 0
  const savedCollegesCount = profile?.savedCollegeIds?.length ?? 0

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        {/* Top Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            STUDENT HUB • ACADEMIC COMMAND CENTER
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Welcome, {profile?.displayName || 'Student'}!
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Here is your live educational hub with nearby government colleges, tracked entrance tests, free course materials, and scholarships.
          </p>
        </div>

        {/* Bento Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="border-2 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] p-5 shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400">
                CHOSEN DOMAIN
              </span>
              <div className="w-6 h-6 border border-ink bg-[#9DD9FF] flex items-center justify-center shadow-[1px_1px_0px_#11110F]">
                <Compass className="w-3.5 h-3.5 text-ink" />
              </div>
            </div>
            <p className="text-lg font-black font-display text-ink dark:text-cream truncate">
              {selectedDomainName}
            </p>
            <span className="font-mono text-[11px] text-[#62E89B] dark:text-[#62E89B] font-bold">
              • Recommendation Active
            </span>
          </div>

          <div className="border-2 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] p-5 shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400">
                TARGET DEGREE
              </span>
              <div className="w-6 h-6 border border-ink bg-[#C8FF32] flex items-center justify-center shadow-[1px_1px_0px_#11110F]">
                <GraduationCap className="w-3.5 h-3.5 text-ink" />
              </div>
            </div>
            <p className="text-lg font-black font-display text-ink dark:text-cream truncate">
              {selectedCourseName}
            </p>
            <span className="font-mono text-[11px] text-neutral-500 uppercase">
              • Academic Track
            </span>
          </div>

          <div className="border-2 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] p-5 shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400">
                EXAM TRACKER
              </span>
              <div className="w-6 h-6 border border-ink bg-[#FFD84D] flex items-center justify-center shadow-[1px_1px_0px_#11110F]">
                <Calendar className="w-3.5 h-3.5 text-ink" />
              </div>
            </div>
            <p className="text-lg font-black font-display text-ink dark:text-cream">
              {trackedExamsCount} {trackedExamsCount === 1 ? 'Exam' : 'Exams'} Tracked
            </p>
            <span className="font-mono text-[11px] text-neutral-500 uppercase">
              • Deadlines monitored
            </span>
          </div>

          <div className="border-2 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] p-5 shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400">
                TARGET COLLEGES
              </span>
              <div className="w-6 h-6 border border-ink bg-[#62E89B] flex items-center justify-center shadow-[1px_1px_0px_#11110F]">
                <MapPin className="w-3.5 h-3.5 text-ink" />
              </div>
            </div>
            <p className="text-lg font-black font-display text-ink dark:text-cream">
              {savedCollegesCount} {savedCollegesCount === 1 ? 'College' : 'Colleges'} Saved
            </p>
            <span className="font-mono text-[11px] text-neutral-500 uppercase">
              • Karnataka Network
            </span>
          </div>
        </div>

        {/* Collapsible Tool Sections */}
        <div className="space-y-6">
          {/* Your Colleges Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff]">
              <Collapsible
                open={openSections.colleges}
                onOpenChange={() => toggleSection('colleges')}
              >
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer p-5 flex items-center justify-between border-b-2 border-ink/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border-2 border-ink bg-[#9DD9FF] shadow-[2px_2px_0px_#11110F]">
                        <MapPin className="h-5 w-5 text-ink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black font-display text-ink dark:text-cream">
                            YOUR COLLEGES
                          </h2>
                          <span className={`inline-block font-mono text-[11px] font-bold uppercase border border-ink px-1.5 py-0.2 ${
                            hasSavedColleges ? 'bg-[#C8FF32] text-ink' : 'bg-[#62E89B] text-ink'
                          }`}>
                            {hasSavedColleges ? `${savedColleges.length} SAVED` : 'RECOMMENDED FOR YOU'}
                          </span>
                        </div>
                        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {hasSavedColleges
                            ? 'Your shortlisted target institutions with geographic pinpoint and campus details'
                            : 'Discover nearby verified colleges and institutions matching your selected track'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase text-neutral-500">
                        {openSections.colleges ? '[ COLLAPSE ]' : '[ EXPAND ]'}
                      </span>
                      {openSections.colleges ? (
                        <ChevronUp className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-5 space-y-6">
                    {collegesToDisplay.length === 0 ? (
                      <div className="border-2 border-ink dark:border-white bg-white dark:bg-[#11110F] p-8 text-center shadow-[3px_3px_0px_#11110F]">
                        <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                          No colleges shortlisted yet. Explore the Karnataka college network to view and save target campuses.
                        </p>
                        <Link
                          to="/colleges"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8FF32] text-ink font-mono text-xs font-bold uppercase border-2 border-ink shadow-[2px_2px_0px_#11110F] hover:-translate-y-0.5 transition-all"
                        >
                          Explore Karnataka Colleges <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        <MapWidget colleges={mapColleges} userLocation={userLocation} showList={false} />

                        {/* Institution Cards Grid */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                              {hasSavedColleges ? 'SHORTLISTED TARGETS' : 'RECOMMENDED CAMPUSES'} ({collegesToDisplay.length})
                            </span>
                            <Link
                              to="/colleges"
                              className="font-mono text-xs font-bold uppercase text-ink dark:text-cream hover:underline flex items-center gap-1"
                            >
                              Explore Network <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {collegesToDisplay.map(({ college: c, distanceKm, geo }) => {
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
                                  className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-5 flex flex-col justify-between ${
                                    saved
                                      ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#C8FF32] -translate-y-1'
                                      : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                                  }`}
                                >
                                  <div>
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3">
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
                                    <h3 className="text-base sm:text-lg font-black font-display text-ink dark:text-cream mb-2 leading-snug line-clamp-2">
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
                        </div>
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>

          {/* Exams */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff]">
              <Collapsible open={openSections.exams} onOpenChange={() => toggleSection('exams')}>
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer p-5 flex items-center justify-between border-b-2 border-ink/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border-2 border-ink bg-[#FFD84D] shadow-[2px_2px_0px_#11110F]">
                        <Calendar className="h-5 w-5 text-ink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black font-display text-ink dark:text-cream">
                            Exam Tracker & Countdown
                          </h2>
                          <span className="hidden sm:inline-block font-mono text-[11px] font-bold uppercase bg-[#FFD84D] text-ink border border-ink px-1.5 py-0.2">
                            DEADLINES
                          </span>
                        </div>
                        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Selected entrance exams and test registration dates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase text-neutral-500">
                        {openSections.exams ? '[ COLLAPSE ]' : '[ EXPAND ]'}
                      </span>
                      {openSections.exams ? (
                        <ChevronUp className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-5">
                    <ExamCountdownWidget />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>

          {/* Study Materials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff]">
              <Collapsible
                open={openSections.materials}
                onOpenChange={() => toggleSection('materials')}
              >
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer p-5 flex items-center justify-between border-b-2 border-ink/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border-2 border-ink bg-[#62E89B] shadow-[2px_2px_0px_#11110F]">
                        <BookOpen className="h-5 w-5 text-ink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black font-display text-ink dark:text-cream">
                            {t('dashboard.studyMaterials')}
                          </h2>
                          <span className="hidden sm:inline-block font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border border-ink px-1.5 py-0.2">
                            FREE RESOURCES
                          </span>
                        </div>
                        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Access free syllabus notes, test blueprints, and official PDFs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase text-neutral-500">
                        {openSections.materials ? '[ COLLAPSE ]' : '[ EXPAND ]'}
                      </span>
                      {openSections.materials ? (
                        <ChevronUp className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-5">
                    <StudyMaterialsWidget />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>

          {/* Scholarships */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff]">
              <Collapsible
                open={openSections.scholarships}
                onOpenChange={() => toggleSection('scholarships')}
              >
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer p-5 flex items-center justify-between border-b-2 border-ink/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border-2 border-ink bg-[#FFD84D] shadow-[2px_2px_0px_#11110F]">
                        <Award className="h-5 w-5 text-ink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black font-display text-ink dark:text-cream">
                            {t('dashboard.scholarships')}
                          </h2>
                          <span className="hidden sm:inline-block font-mono text-[11px] font-bold uppercase bg-[#FFD84D] text-ink border border-ink px-1.5 py-0.2">
                            FINANCIAL AID
                          </span>
                        </div>
                        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Find state, central, and merit-based scholarship portals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase text-neutral-500">
                        {openSections.scholarships ? '[ COLLAPSE ]' : '[ EXPAND ]'}
                      </span>
                      {openSections.scholarships ? (
                        <ChevronUp className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-5">
                    <ScholarshipsWidget />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>

          {/* Jobs & Career Services */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[5px_5px_0px_#11110F] dark:shadow-[5px_5px_0px_#fff]">
              <Collapsible
                open={openSections.jobs}
                onOpenChange={() => toggleSection('jobs')}
              >
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer p-5 flex items-center justify-between border-b-2 border-ink/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border-2 border-ink bg-[#C8FF32] shadow-[2px_2px_0px_#11110F]">
                        <Briefcase className="h-5 w-5 text-ink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black font-display text-ink dark:text-cream">
                            {t('dashboard.jobs')}
                          </h2>
                          <span className="hidden sm:inline-block font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border border-ink px-1.5 py-0.2">
                            CAREER PATHWAYS
                          </span>
                        </div>
                        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Explore industry roles, average compensation brackets, and top recruiters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase text-neutral-500">
                        {openSections.jobs ? '[ COLLAPSE ]' : '[ EXPAND ]'}
                      </span>
                      {openSections.jobs ? (
                        <ChevronUp className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-ink dark:text-cream stroke-[3]" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-5">
                    <JobsWidget />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageShell>
  )
}
