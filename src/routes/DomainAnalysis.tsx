import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCareerAssessmentStore } from '@/store/careerAssessment'
import { getTopDomains, generateCareerSummary } from '@/services/careerAssessmentService'
import { DOMAINS } from '@/data/domains'
import { useAuthStore } from '@/store/auth'
import PageShell from '@/components/PageShell'
import { Sparkles, ArrowRight, Compass } from 'lucide-react'

const domainTitle = (id: string) => DOMAINS.find((d) => d.id === id)?.title ?? id

export default function DomainAnalysis() {
  const navigate = useNavigate()
  const { results } = useCareerAssessmentStore()
  const { profile, setProfile } = useAuthStore()

  const top = useMemo(() => (results ? getTopDomains(results, 3) : []), [results])
  const summary = useMemo(() => generateCareerSummary(top), [top])

  const handleContinue = () => {
    const topDomainId = top[0]?.domainId
    if (profile && topDomainId) {
      setProfile({
        ...profile,
        selectedCareerDomain: topDomainId as never,
        updatedAt: new Date(),
      })
    }
    navigate('/course-recommendations')
  }

  if (!results || top.length === 0) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-16">
          <Card className="rounded-none border-2 border-ink shadow-[6px_6px_0px_#11110F] bg-card p-6 text-center">
            <div className="w-12 h-12 bg-[#FFD84D] border-2 border-ink flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#11110F]">
              <Compass className="h-6 w-6 text-ink" />
            </div>
            <h2 className="font-display font-black text-2xl tracking-tight mb-2">No Results Found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Please complete the career assessment to calculate your top domain fit.
            </p>
            <Button
              onClick={() => navigate('/career-assessment')}
              className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-bold font-mono uppercase tracking-wider shadow-[3px_3px_0px_#11110F]"
            >
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header pill & title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8FF32] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              <Sparkles className="h-3.5 w-3.5" />
              STEP 3 • DOMAIN FIT ANALYSIS
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2 text-ink dark:text-cream">
              DOMAIN ANALYSIS
            </h1>
            <p className="font-sans text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {summary.summary}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {top.map((d, idx) => (
              <Card
                key={d.domainId}
                className={`rounded-none border-2 border-ink flex flex-col justify-between ${
                  idx === 0
                    ? 'bg-[#C8FF32]/15 dark:bg-neutral-900 border-ink shadow-[6px_6px_0px_#11110F]'
                    : 'bg-card shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222]'
                }`}
              >
                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 border border-ink bg-white dark:bg-neutral-800 text-ink">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 border border-ink ${
                        idx === 0
                          ? 'bg-[#C8FF32] text-ink'
                          : idx === 1
                          ? 'bg-[#FFD84D] text-ink'
                          : 'bg-[#9DD9FF] text-ink'
                      }`}>
                        {d.percentage}% FIT
                      </span>
                    </div>
                    <CardTitle className="font-display font-black text-lg tracking-tight">
                      {domainTitle(d.domainId)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {d.explanation}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Continue button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-mono uppercase text-sm font-bold shadow-[4px_4px_0px_#11110F] px-8 py-3"
            >
              Continue to Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
