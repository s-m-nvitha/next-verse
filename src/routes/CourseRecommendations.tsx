import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { DOMAINS } from '@/data/domains'
import { COURSES } from '@/data/courses'
import { recommendCourses } from '@/services/courseRecommendationService'
import { usePipelineSelectionsStore } from '@/store/pipelineSelections'
import { PageShell } from '@/components/PageShell'
import { Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

export default function CourseRecommendations() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const { selectedCourseId, setSelectedCourseId } = usePipelineSelectionsStore()

  const educationLevel = profile?.educationLevel
  const domainId = profile?.selectedCareerDomain

  const domainTitle = useMemo(() => DOMAINS.find((d) => d.id === domainId)?.title ?? 'Your Domain', [domainId])

  const recs = useMemo(() => {
    if (!educationLevel || !domainId) return []
    return recommendCourses({ courses: COURSES, domainId, educationLevel, limit: 6 })
  }, [educationLevel, domainId])

  const items = useMemo(() => {
    const map = new Map(COURSES.map((c) => [c.id, c]))
    return recs.map((r) => ({ rec: r, course: map.get(r.courseId) })).filter((x) => Boolean(x.course)) as Array<{
      rec: (typeof recs)[number]
      course: (typeof COURSES)[number]
    }>
  }, [recs])

  const domainMatch = useMemo(() => {
    try {
      const rawMatches = sessionStorage.getItem('vv_domain_matches')
      if (rawMatches) {
        const parsed = JSON.parse(rawMatches) as Array<{ domainId: string; percentage: number; isMLPrediction?: boolean }>
        const found = parsed.find((m) => m.domainId === domainId)
        if (found) return found
      }
    } catch (e) {
      console.error('Error reading domain match:', e)
    }
    return null
  }, [domainId])

  const handleContinue = () => {
    const pick = selectedCourseId ?? items[0]?.course.id
    if (pick) setSelectedCourseId(pick)
    navigate('/exam-recommendations')
  }

  if (!educationLevel || !domainId) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              STEP REQUIRED
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Assessment Incomplete</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Please complete the assessment and choose your education level first.
            </p>
            <Button
              onClick={() => navigate('/level')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Education Level <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#C8FF32] text-ink px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]">
            COURSE RECOMMENDATIONS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Recommended Courses
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Based on <span className="font-bold text-ink dark:text-cream">{domainTitle}</span> and qualification level ({educationLevel}).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map(({ course, rec }) => {
            const selected = selectedCourseId === course.id
            return (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedCourseId(course.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedCourseId(course.id)
                }}
                className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 flex flex-col justify-between ${
                  selected
                    ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                    : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="font-mono text-xs uppercase bg-[#9DD9FF] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        {course.duration}
                      </span>
                      <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        ₹{course.averageFeesInr.toLocaleString('en-IN')}/yr
                      </span>
                      <span className="font-mono text-xs uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        {course.salaryPotentialLpa.min}-{course.salaryPotentialLpa.max} LPA
                      </span>
                    </div>
                    {selected ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        <Check className="w-3 h-3 stroke-[3]" /> SELECTED
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-black font-display text-ink dark:text-cream mb-2 leading-snug">
                    {course.title}
                  </h3>

                  {domainMatch && (
                    <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-ink/10 dark:border-white/10">
                      <span className="inline-block bg-[#C8FF32] text-ink font-mono font-bold text-xs px-2.5 py-0.5 border-2 border-ink shadow-[1.5px_1.5px_0px_#11110F]">
                        {domainMatch.percentage}% Match
                      </span>
                      {domainMatch.isMLPrediction !== false && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          <Sparkles className="w-3 h-3" /> AI Model
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                    Eligibility: {course.eligibility}
                  </p>
                  <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                    {rec.explanation}
                  </p>
                </div>

                <Button
                  type="button"
                  className={`w-full border-2 border-ink dark:border-white font-bold transition-all ${
                    selected
                      ? 'bg-[#C8FF32] text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]'
                      : 'bg-transparent text-ink dark:text-cream hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCourseId(course.id)
                  }}
                >
                  {selected ? 'Selected' : 'Select this course →'}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/domain-analysis')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={items.length === 0}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            Continue to Exams <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}
