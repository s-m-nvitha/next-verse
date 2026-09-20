import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { saveRecommendationSelections } from '@/services/profileService'
import { loadSeedCourses, loadSeedExams, type SeedCourse, type SeedExam } from '@/services/seedDataService'
import { filterExamsByCourse } from '@/services/recommendationService'
import { PageShell } from '@/components/PageShell'
import { Check, ArrowRight, ArrowLeft, ExternalLink, CheckSquare, Square } from 'lucide-react'

export default function Exams() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allExams, setAllExams] = useState<SeedExam[]>([])
  const [allCourses, setAllCourses] = useState<SeedCourse[]>([])

  const courseId = profile?.selectedCourseId
  const educationLevel = profile?.educationLevel

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const level = profile?.educationLevel
      if (!level) {
        if (mounted) setAllExams([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const list = await loadSeedExams(level)
        const courses = await loadSeedCourses(level)
        if (mounted) {
          setAllExams(list)
          setAllCourses(courses)
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

  const exams = useMemo(() => {
    if (!courseId) return []
    const filtered = filterExamsByCourse({ exams: allExams, courseId })
    if (filtered.length > 0) return filtered

    const course = allCourses.find((c) => c.id === courseId) ?? null
    const courseInterests = new Set(course?.relatedInterests ?? [])

    const scored = allExams
      .map((e) => {
        const linked = e.linkedCourses ?? []
        const isGeneral = linked.includes('any_course') || linked.includes('any_stream') || linked.includes('any_degree')
        const overlap = (e.relatedInterests ?? []).reduce((acc, k) => (courseInterests.has(k) ? acc + 1 : acc), 0)
        const score = (isGeneral ? 5 : 0) + overlap * 10
        return { exam: e, score }
      })
      .sort((a, b) => b.score - a.score || a.exam.name.localeCompare(b.exam.name))

    const best = scored.filter((x) => x.score > 0).map((x) => x.exam)
    if (best.length > 0) return best

    const general = allExams.filter((e) => {
      const linked = e.linkedCourses ?? []
      return linked.includes('any_course') || linked.includes('any_stream') || linked.includes('any_degree')
    })

    return general.length > 0 ? general : allExams
  }, [allCourses, allExams, courseId])

  const isFallbackList = useMemo(() => {
    if (!courseId) return false
    const filtered = filterExamsByCourse({ exams: allExams, courseId })
    return allExams.length > 0 && filtered.length === 0
  }, [allExams, courseId])

  const selectedExamIds = new Set(profile?.selectedExamIds ?? [])

  const toggleExam = (examId: string) => {
    if (!profile) return
    const next = new Set(profile.selectedExamIds ?? [])
    if (next.has(examId)) next.delete(examId)
    else next.add(examId)
    setProfile({
      ...profile,
      selectedExamIds: Array.from(next),
      updatedAt: new Date(),
    })
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="inline-block p-4 border-3 border-ink dark:border-white bg-[#FFD84D] shadow-[4px_4px_0px_#11110F] mb-4">
            <span className="font-mono text-sm font-bold text-ink uppercase animate-pulse">
              LOADING ADMISSION PATHWAYS...
            </span>
          </div>
        </div>
      </PageShell>
    )
  }

  const handleContinue = async () => {
    if (!profile?.uid) return

    setIsSaving(true)
    try {
      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveRecommendationSelections({ uid: profile.uid, selectedExamIds: profile.selectedExamIds ?? [] }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      navigate('/colleges')
    } finally {
      setIsSaving(false)
    }
  }

  if (!courseId) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              STEP REQUIRED
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Please Select a Course First</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Exams and admission pathways are filtered specifically by your chosen course.
            </p>
            <Button
              onClick={() => navigate('/courses')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </PageShell>
    )
  }

  if (!educationLevel) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              STEP REQUIRED
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Please Select Your Education Level</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Select your qualification standard so we can verify exam eligibility.
            </p>
            <Button
              onClick={() => navigate('/level')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Level <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
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
            STEP 5 OF 5 • ADMISSION PATHWAYS & EXAMS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Entrance Exams & Pathways
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Select competitive exams and state admission counseling channels to track deadlines and cutoffs.
          </p>
        </div>

        {isFallbackList ? (
          <div className="mb-6 border-2 border-ink dark:border-white bg-[#FFD84D]/30 p-4 shadow-[3px_3px_0px_#11110F]">
            <p className="text-xs font-mono text-ink dark:text-cream font-bold uppercase">
              Notice: Showing general admission tests for your qualification level.
            </p>
          </div>
        ) : null}

        {/* Exams Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {exams.map((exam) => {
            const checked = selectedExamIds.has(exam.id)
            return (
              <div
                key={exam.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleExam(exam.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleExam(exam.id)
                }}
                className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 flex flex-col justify-between ${
                  checked
                    ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                    : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                }`}
              >
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {exam.category ? (
                        <span className="font-mono text-xs uppercase bg-[#9DD9FF] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          {exam.category.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        <span className="font-mono text-xs uppercase bg-white text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          Admission / Exam
                        </span>
                      )}
                      {exam.category?.toLowerCase().includes('merit') && (
                        <span className="font-mono text-xs uppercase bg-[#62E89B] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          Direct Merit
                        </span>
                      )}
                      {(exam.category?.toLowerCase().includes('lateral') || exam.id.includes('dcet')) && (
                        <span className="font-mono text-xs uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          Lateral Entry
                        </span>
                      )}
                      {exam.duration ? (
                        <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5">
                          {exam.duration}
                        </span>
                      ) : null}
                    </div>

                    {checked ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        <Check className="w-3 h-3 stroke-[3]" /> TRACKED
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black font-display text-ink dark:text-cream mb-2 leading-snug">
                    {exam.name}
                  </h3>

                  {exam.eligibility ? (
                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-2 pb-2 border-b-2 border-ink/10 dark:border-white/10">
                      Eligibility: {exam.eligibility}
                    </p>
                  ) : null}

                  {exam.description ? (
                    <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                      {exam.description}
                    </p>
                  ) : null}
                </div>

                {/* Bottom interaction controls */}
                <div className="space-y-2 pt-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExam(exam.id)
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border-2 border-ink dark:border-white font-mono text-xs font-bold uppercase cursor-pointer select-none transition-all ${
                      checked
                        ? 'bg-[#C8FF32] text-ink shadow-[2px_2px_0px_#11110F]'
                        : 'bg-white dark:bg-[#11110F] text-ink dark:text-cream hover:bg-neutral-100 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]'
                    }`}
                  >
                    {checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    {checked ? 'Tracking this Exam' : 'Click to Track Exam'}
                  </div>

                  {exam.website ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(exam.website!, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Official Exam Portal
                    </Button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/courses')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            {isSaving ? 'Saving...' : 'Continue to Colleges'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}

