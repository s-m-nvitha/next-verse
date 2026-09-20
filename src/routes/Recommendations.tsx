import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRecommendationsStore } from '@/store/recommendations'
import { ArrowRight, ArrowLeft, Sparkles, Brain, CheckCircle2 } from 'lucide-react'
import PageShell from '@/components/PageShell'

interface CareerRecommendationItem {
  career_name: string
  domain: string
  domain_name?: string
  probability: number
  percentage: number
  description: string
  is_ml_prediction?: boolean
}

export default function Recommendations() {
  const navigate = useNavigate()
  const { recommendations: legacyRecommendations } = useRecommendationsStore()
  const [careers, setCareers] = useState<CareerRecommendationItem[]>([])

  useEffect(() => {
    try {
      // 1. Try loading dedicated career matches from sessionStorage
      const rawCareers = sessionStorage.getItem('vv_career_matches')
      if (rawCareers) {
        const parsed = JSON.parse(rawCareers) as CareerRecommendationItem[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCareers(parsed)
          return
        }
      }

      // 2. Try loading from full recommendations object in sessionStorage
      const rawFull = sessionStorage.getItem('vv_full_recommendations')
      if (rawFull) {
        const parsedFull = JSON.parse(rawFull)
        if (Array.isArray(parsedFull?.career_recommendations) && parsedFull.career_recommendations.length > 0) {
          setCareers(parsedFull.career_recommendations)
          return
        }
      }

      // 3. Fallback to legacy store if available
      if (legacyRecommendations && legacyRecommendations.length > 0) {
        const fallbackCareers: CareerRecommendationItem[] = legacyRecommendations.map((rec) => ({
          career_name: rec.course.name,
          domain: rec.course.domains?.[0] || 'general',
          domain_name: rec.course.domains?.[0]?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          probability: (rec.matchPercent || 0) / 100,
          percentage: rec.matchPercent || 0,
          description: rec.reason.becauseYouLike.length
            ? `Recommended based on your interest in ${rec.reason.becauseYouLike.join(', ')}.`
            : 'Personalized career recommendation based on your profile and preferences.',
          is_ml_prediction: false,
        }))
        setCareers(fallbackCareers)
      }
    } catch (e) {
      console.error('Error loading career recommendations:', e)
    }
  }, [legacyRecommendations])

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  if (careers.length === 0) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-16">
          <Card className="rounded-none border-2 border-ink shadow-[6px_6px_0px_#11110F] bg-card p-6 text-center">
            <div className="w-12 h-12 bg-[#FFD84D] border-2 border-ink flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#11110F]">
              <Brain className="h-6 w-6 text-ink" />
            </div>
            <h2 className="font-display font-black text-2xl tracking-tight mb-2">No Recommendations Yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Please complete the aptitude questionnaire first so our ML models can analyze your career domain matches.
            </p>
            <Button
              onClick={() => navigate('/questionnaire')}
              className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-bold font-mono uppercase tracking-wider shadow-[3px_3px_0px_#11110F]"
            >
              Start Questionnaire
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header pill & title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8FF32] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#11110F]">
              <Sparkles className="h-3.5 w-3.5" />
              STEP 3 • AI CAREER MATCHES
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2 text-ink dark:text-cream">
              CAREER RECOMMENDATIONS
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground uppercase tracking-widest max-w-xl mx-auto">
              Random Forest ML model ranked pathways based on your aptitude profile
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {careers.map((career, index) => (
              <motion.div
                key={`${career.career_name}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full rounded-none border-2 border-ink shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#222] bg-card hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] transition-all flex flex-col justify-between">
                  <div>
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="font-mono text-[11px] font-bold text-muted-foreground mb-1 block">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <CardTitle className="font-display font-black text-xl tracking-tight leading-tight">
                            {career.career_name}
                          </CardTitle>
                        </div>
                        {career.is_ml_prediction && (
                          <span className="shrink-0 px-2 py-0.5 bg-[#FFD84D] text-ink font-mono text-[10px] font-bold uppercase tracking-wider border border-ink shadow-[1px_1px_0px_#11110F]">
                            AI MODEL
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-5 pt-0 space-y-4">
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-ink/10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C8FF32] text-ink font-mono font-bold text-xs border border-ink shadow-[2px_2px_0px_#11110F]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {career.percentage}% MATCH
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                          RF Confidence
                        </span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {career.description}
                      </p>
                      
                      {career.domain_name && (
                        <div className="pt-2">
                          <span className="inline-block px-2 py-0.5 border border-ink/40 font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted/40">
                            {career.domain_name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Next steps CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <div className="border-2 border-ink shadow-[6px_6px_0px_#11110F] bg-[#C8FF32]/20 dark:bg-neutral-900 p-8 text-center max-w-2xl mx-auto">
              <h3 className="font-display font-black text-2xl tracking-tight mb-2 text-ink dark:text-cream">
                READY TO CHART YOUR COURSE?
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
                Explore affiliated colleges, exam deadlines, and study roadmaps tailored to your recommended pathway.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGoToDashboard}
                  className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-bold font-mono uppercase tracking-wider px-6 py-2.5 shadow-[3px_3px_0px_#11110F]"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/colleges')}
                  className="btn-tactile bg-white dark:bg-neutral-800 text-ink dark:text-cream border-2 border-ink rounded-none font-bold font-mono uppercase tracking-wider px-6 py-2.5 shadow-[3px_3px_0px_#11110F]"
                >
                  Explore Institutions
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="btn-tactile bg-white dark:bg-neutral-800 text-ink dark:text-cream border-2 border-ink rounded-none font-bold font-mono uppercase text-xs shadow-[2px_2px_0px_#11110F]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={handleGoToDashboard}
              className="font-mono text-xs uppercase font-bold text-muted-foreground hover:text-ink underline"
            >
              Skip to Dashboard →
            </Button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
