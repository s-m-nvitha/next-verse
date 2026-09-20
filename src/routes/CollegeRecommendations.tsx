import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { COLLEGES } from '@/data/colleges'
import { COURSES } from '@/data/courses'
import { recommendColleges } from '@/services/collegeRecommendationService'
import { usePipelineSelectionsStore } from '@/store/pipelineSelections'
import { PageShell } from '@/components/PageShell'
import { ArrowRight, ArrowLeft, BookmarkCheck } from 'lucide-react'

export default function CollegeRecommendations() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const { selectedCourseId, selectedExamIds, savedCollegeIds, toggleSavedCollegeId } = usePipelineSelectionsStore()

  const course = useMemo(() => COURSES.find((c) => c.id === selectedCourseId) ?? null, [selectedCourseId])

  const userLocation = useMemo(
    () => ({
      state: profile?.questionnaire?.location?.state,
      city: profile?.questionnaire?.location?.city,
    }),
    [profile]
  )

  const acceptedExamIds = selectedExamIds.length > 0 ? selectedExamIds : []

  const recs = useMemo(() => {
    if (!selectedCourseId) return []
    return recommendColleges({
      colleges: COLLEGES,
      courseId: selectedCourseId,
      acceptedExamIds,
      userLocation,
      affordabilityPreference: 'balanced',
      limit: 10,
    })
  }, [selectedCourseId, acceptedExamIds, userLocation])

  const items = useMemo(() => {
    const map = new Map(COLLEGES.map((c) => [c.id, c]))
    return recs.map((r) => ({ rec: r, college: map.get(r.collegeId) })).filter((x) => Boolean(x.college)) as Array<{
      rec: (typeof recs)[number]
      college: (typeof COLLEGES)[number]
    }>
  }, [recs])

  const handleFinish = () => {
    navigate('/dashboard')
  }

  if (!selectedCourseId || !course) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              STEP REQUIRED
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">Please Select a Course First</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Colleges are filtered by degree program offerings.
            </p>
            <Button
              onClick={() => navigate('/course-recommendations')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Courses <ArrowRight className="w-4 h-4 ml-2" />
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
            COLLEGE RECOMMENDATIONS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Recommended Colleges
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            For <span className="font-bold text-ink dark:text-cream">{course.title}</span>{userLocation.state ? ` • ${userLocation.state.replace(/_/g, ' ')}` : ''}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {items.map(({ college, rec }) => {
            const saved = savedCollegeIds.includes(college.id)
            return (
              <div
                key={college.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleSavedCollegeId(college.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleSavedCollegeId(college.id)
                }}
                className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 flex flex-col justify-between ${
                  saved
                    ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                    : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`font-mono text-xs uppercase px-2 py-0.5 border-2 border-ink shadow-[1.5px_1.5px_0px_#11110F] ${
                        college.type === 'government' ? 'bg-[#62E89B] text-ink' : 'bg-[#9DD9FF] text-ink'
                      }`}>
                        {college.type.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5">
                        {college.city}
                      </span>
                      <span className="font-mono text-xs uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        ₹{college.averageFeesInr.toLocaleString('en-IN')}/yr
                      </span>
                      <span className="font-mono text-xs uppercase bg-white dark:bg-[#11110F] text-ink dark:text-cream border-2 border-ink dark:border-white px-2 py-0.5">
                        ⭐ {college.rating}
                      </span>
                      {typeof rec.distanceKm === 'number' ? (
                        <span className="font-mono text-xs uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                          {rec.distanceKm} km
                        </span>
                      ) : null}
                    </div>

                    {saved ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#C8FF32] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        <BookmarkCheck className="w-3.5 h-3.5 stroke-[3]" /> SAVED
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-black font-display text-ink dark:text-cream mb-2 leading-snug">
                    {college.name}
                  </h3>

                  <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                    {rec.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${college.name} ${college.city} ${college.state}`
                        )}`,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }}
                  >
                    Open in Maps
                  </Button>
                  <Button
                    type="button"
                    className={`border-2 border-ink dark:border-white font-bold text-xs transition-all ${
                      saved
                        ? 'bg-[#C8FF32] text-ink shadow-[2px_2px_0px_#11110F]'
                        : 'bg-transparent text-ink dark:text-cream hover:bg-neutral-100 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#fff]'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSavedCollegeId(college.id)
                    }}
                  >
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/exam-recommendations')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            Finish & View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}
