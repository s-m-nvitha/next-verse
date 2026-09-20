import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { saveRecommendationSelections } from '@/services/profileService'
import { loadSeedCourses, loadSeedDomains, type SeedCourse, type SeedDomain } from '@/services/seedDataService'
import { filterCoursesByDomain, ML_TO_10TH_DOMAIN_MAP } from '@/services/recommendationService'
import { PageShell } from '@/components/PageShell'
import { Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

export default function Courses() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allCourses, setAllCourses] = useState<SeedCourse[]>([])
  const [domains, setDomains] = useState<SeedDomain[]>([])

  const selectedDomainId = profile?.selectedDomainId

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const level = profile?.educationLevel
      if (!level) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const list = await loadSeedCourses(level)
        const domainList = await loadSeedDomains(level)
        if (mounted) {
          setAllCourses(list)
          setDomains(domainList)
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [profile?.educationLevel])

  const domainMatch = useMemo(() => {
    try {
      const rawMatches = sessionStorage.getItem('vv_domain_matches')
      if (rawMatches) {
        const parsed = JSON.parse(rawMatches) as Array<{ domainId: string; percentage: number; score?: number; isMLPrediction?: boolean; matchedInterestIds?: string[] }>
        const found = parsed.find((m) => m.domainId === selectedDomainId)
        if (found) return found
      }

      const rawFull = sessionStorage.getItem('vv_full_recommendations')
      if (rawFull) {
        const full = JSON.parse(rawFull)
        const dRec = full.domain_recommendations?.find((d: any) => d.domain === selectedDomainId)
        if (dRec) {
          return {
            domainId: selectedDomainId,
            percentage: Math.max(1, Math.round(dRec.probability * 100)),
            score: dRec.probability,
            isMLPrediction: true
          }
        }
      }
    } catch (e) {
      console.error('Error reading domain match for courses:', e)
    }
    return null
  }, [selectedDomainId])

  const scoredCourses = useMemo(() => {
    if (!selectedDomainId) return []
    const filtered = filterCoursesByDomain({ courses: allCourses, domains, domainId: selectedDomainId })
    
    // Read backend course scores and recommendations from session storage
    let courseScoresMap: Record<string, { percentage: number; is_ml_prediction?: boolean }> = {}
    let interestScoresMap: Record<string, number> = {}

    try {
      const rawScores = sessionStorage.getItem('vv_course_scores')
      if (rawScores) courseScoresMap = JSON.parse(rawScores)

      const rawFull = sessionStorage.getItem('vv_full_recommendations')
      if (rawFull) {
        const full = JSON.parse(rawFull)
        if (full.course_scores) {
          courseScoresMap = { ...full.course_scores, ...courseScoresMap }
        }
        if (Array.isArray(full.course_recommendations)) {
          for (const item of full.course_recommendations) {
            if (item.course_id && !courseScoresMap[item.course_id]) {
              courseScoresMap[item.course_id] = {
                percentage: item.percentage,
                is_ml_prediction: item.is_ml_prediction ?? true
              }
            }
          }
        }
      }

      const rawMatches = sessionStorage.getItem('vv_course_matches')
      if (rawMatches) {
        const list = JSON.parse(rawMatches)
        if (Array.isArray(list)) {
          for (const item of list) {
            if (item.course_id && !courseScoresMap[item.course_id]) {
              courseScoresMap[item.course_id] = {
                percentage: item.percentage,
                is_ml_prediction: item.is_ml_prediction ?? true
              }
            }
          }
        }
      }

      const rawInterests = sessionStorage.getItem('vv_interest_scores')
      if (rawInterests) interestScoresMap = JSON.parse(rawInterests)
    } catch (e) {
      console.error('Error loading course scores maps:', e)
    }

    const alias10th = selectedDomainId ? ML_TO_10TH_DOMAIN_MAP[selectedDomainId] : undefined
    const currentDomain =
      domains.find((d) => d.id === selectedDomainId) ??
      (alias10th ? domains.find((d) => d.id === alias10th) : undefined)

    let coursesToScore = filtered
    if (coursesToScore.length === 0 && currentDomain?.recommendedCourses?.length) {
      const recSet = new Set(currentDomain.recommendedCourses)
      coursesToScore = allCourses.filter((c) => recSet.has(c.id))
    }

    const domainInterests = new Set(currentDomain?.relatedInterests ?? [])
    const userInterests = new Set(profile?.interestAssessment?.topInterests ?? (domainMatch as any)?.matchedInterestIds ?? [])

    const domainProb = domainMatch?.score !== undefined 
      ? domainMatch.score 
      : (domainMatch?.percentage ? domainMatch.percentage / 100 : 0)

    const rawDomainPct = domainMatch?.percentage ?? Math.round(domainProb * 100)
    const domainBaseline = rawDomainPct > 0 && rawDomainPct < 100 ? rawDomainPct : 88

    const scored = coursesToScore.map((c) => {
      const mlScore = courseScoresMap[c.id]?.percentage
      const hasValidML = typeof mlScore === 'number' && mlScore > 0 && mlScore !== 35 && mlScore !== 100

      if (hasValidML) {
        return {
          ...c,
          matchPercentage: Math.min(95, mlScore),
          isML: true
        }
      }

      // Domain Recommendations alignment formula: match course interests against user & domain interests
      const rel = c.relatedInterests || []
      const userMatched = rel.filter((x) => userInterests.has(x)).length
      const userRatio = rel.length > 0 ? userMatched / rel.length : 0

      const domainMatched = rel.filter((x) => domainInterests.has(x)).length
      const domainRatio = rel.length > 0 ? domainMatched / rel.length : 0

      const scoreWeight = rel.reduce((sum, x) => sum + (interestScoresMap[x] || (userInterests.has(x) ? 3 : 0)), 0)
      const weightRatio = rel.length > 0 ? Math.min(1.0, scoreWeight / (rel.length * 5)) : 0

      const alignment = userMatched > 0 || weightRatio > 0
        ? 0.5 * Math.max(userRatio, weightRatio) + 0.5 * domainRatio
        : domainRatio

      // Scale relative to the domain recommendation baseline (e.g. 50% - 94%)
      const percentage = Math.max(35, Math.min(94, Math.round(domainBaseline * (0.50 + 0.45 * alignment))))

      return {
        ...c,
        matchPercentage: percentage,
        isML: true
      }
    })

    // Sort courses by their individual match percentage descending
    const sorted = scored.sort((a, b) => b.matchPercentage - a.matchPercentage)

    // Ensure distinct relative percentages across courses (no ties or clamps at 100%)
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].matchPercentage >= sorted[i - 1].matchPercentage) {
        sorted[i].matchPercentage = Math.max(30, sorted[i - 1].matchPercentage - 3)
      }
    }

    return sorted
  }, [allCourses, domains, selectedDomainId, domainMatch, profile?.interestAssessment])

  const selectedCourseId = profile?.selectedCourseId

  const handleContinue = async () => {
    if (!profile?.uid) return
    const pick = selectedCourseId ?? scoredCourses[0]?.id
    if (!pick) return

    setIsSaving(true)
    try {
      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveRecommendationSelections({ uid: profile.uid, selectedCourseId: pick }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        selectedCourseId: pick,
        updatedAt: new Date(),
      })

      navigate('/exams')
    } finally {
      setIsSaving(false)
    }
  }

  if (!selectedDomainId) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              STEP REQUIRED
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Please Select a Domain First</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Course recommendations are specifically tailored to your domain choice.
            </p>
            <Button
              onClick={() => navigate('/domains')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Domains <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </PageShell>
    )
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="inline-block p-4 border-3 border-ink dark:border-white bg-[#FFD84D] shadow-[4px_4px_0px_#11110F] mb-4">
            <span className="font-mono text-sm font-bold text-ink uppercase animate-pulse">
              LOADING RECOMMENDED COURSES...
            </span>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            STEP 4 OF 5 • RECOMMENDED COURSES
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Curated Academic Tracks
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Choose a course to unlock aligned competitive exams, government college eligibility, and career outcomes.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {scoredCourses.map((c) => {
            const selected = selectedCourseId === c.id
            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setProfile(profile ? { ...profile, selectedCourseId: c.id, updatedAt: new Date() } : null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setProfile(profile ? { ...profile, selectedCourseId: c.id, updatedAt: new Date() } : null)
                  }
                }}
                className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 flex flex-col justify-between ${
                  selected
                    ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                    : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                }`}
              >
                <div>
                  {/* Top metadata badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {c.category ? (
                        <span className="font-mono text-xs uppercase bg-[#9DD9FF] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          {c.category}
                        </span>
                      ) : null}
                      {c.duration ? (
                        <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          {c.duration}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {c.isML && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          <Sparkles className="w-3 h-3" /> AI Model
                        </span>
                      )}
                      {selected ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          <Check className="w-3 h-3 stroke-[3]" /> SELECTED
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black font-display text-ink dark:text-cream mb-2 leading-snug">
                    {c.name}
                  </h3>

                  {/* Match score */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ink/10 dark:border-white/10">
                    <span className="inline-block bg-[#C8FF32] text-ink font-mono font-bold text-xs px-2.5 py-1 border-2 border-ink shadow-[2px_2px_0px_#11110F]">
                      {c.matchPercentage}% MATCH
                    </span>
                    {c.eligibility ? (
                      <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                        Req: {c.eligibility}
                      </span>
                    ) : null}
                  </div>

                  {/* Description */}
                  {c.description ? (
                    <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                      {c.description}
                    </p>
                  ) : null}
                </div>

                {/* Select button inside card */}
                <Button
                  type="button"
                  className={`w-full border-2 border-ink dark:border-white font-bold transition-all ${
                    selected
                      ? 'bg-[#C8FF32] text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]'
                      : 'bg-transparent text-ink dark:text-cream hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!profile) return
                    setProfile({ ...profile, selectedCourseId: c.id, updatedAt: new Date() })
                  }}
                >
                  {selected ? 'Selected Course' : 'Select Course →'}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/domains')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Domains
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isSaving || scoredCourses.length === 0}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            {isSaving ? 'Saving Selection...' : 'Continue to Exams'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}

