import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { saveRecommendationSelections } from '@/services/profileService'
import { PageShell } from '@/components/PageShell'
import { Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

const domainTitle = (id: string) => id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

type StoredDomainMatch = {
  domainId: string
  name?: string
  description?: string
  score: number
  percentage: number
  matchedInterestIds: string[]
  isMLPrediction?: boolean
}

export default function Domains() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)

  const [matches, setMatches] = useState<StoredDomainMatch[]>([])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('vv_domain_matches')
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredDomainMatch[]
      if (Array.isArray(parsed)) setMatches(parsed)
    } catch {
      // ignore
    }
  }, [])

  const top = useMemo(() => matches.slice(0, 8), [matches])

  const handleSelectDomain = (domainId: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      selectedDomainId: domainId,
      updatedAt: new Date(),
    })
  }

  const handleContinue = async () => {
    if (!profile?.uid) return
    const pick = profile.selectedDomainId ?? top[0]?.domainId
    if (!pick) return

    setIsSaving(true)
    try {
      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveRecommendationSelections({ uid: profile.uid, selectedDomainId: pick }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        selectedDomainId: pick,
        updatedAt: new Date(),
      })
      navigate('/courses')
    } finally {
      setIsSaving(false)
    }
  }

  if (top.length === 0) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-3 border-ink dark:border-white bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#fff] p-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-ink dark:border-white bg-[#FFD84D] text-ink px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#11110F]">
              MISSING INPUT
            </div>
            <h2 className="text-2xl font-black font-display text-ink dark:text-cream mb-3">No Domain Matches Found</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-sm mb-6 leading-relaxed">
              Please complete the 1-minute interest questionnaire first so our ML models can analyze your profile.
            </p>
            <Button
              onClick={() => navigate('/questionnaire')}
              className="bg-[#C8FF32] text-ink border-2 border-ink font-bold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] active:translate-y-0.5"
            >
              Go to Questionnaire <ArrowRight className="w-4 h-4 ml-2" />
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
            STEP 3 OF 5 • CAREER DOMAINS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-ink dark:text-cream mb-2">
            Recommended Domains
          </h1>
          <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Ranked by Random Forest inference based on your selected interests and career objectives.
          </p>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {top.map((d, index) => {
            const selected = profile?.selectedDomainId === d.domainId
            const rankStr = `#0${index + 1}`
            return (
              <div
                key={d.domainId}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectDomain(d.domainId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectDomain(d.domainId)
                }}
                className={`cursor-pointer text-left transition-all duration-150 border-2 border-ink dark:border-white p-6 ${
                  selected
                    ? 'bg-[#C8FF32]/15 dark:bg-[#C8FF32]/20 ring-2 ring-[#C8FF32] shadow-[6px_6px_0px_#11110F] dark:shadow-[6px_6px_0px_#C8FF32] -translate-y-1'
                    : 'bg-[#FDFBF7] dark:bg-[#1A1A18] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#11110F] dark:hover:shadow-[6px_6px_0px_#fff]'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    {rankStr}
                  </span>
                  <div className="flex items-center gap-2">
                    {d.isMLPrediction && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase bg-[#FFD84D] text-ink border-2 border-ink px-2 py-0.5 shadow-[1.5px_1.5px_0px_#11110F]">
                        <Sparkles className="w-3 h-3" /> ML Match
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
                <h3 className="text-xl font-black font-display text-ink dark:text-cream mb-3 leading-snug">
                  {d.name ?? domainTitle(d.domainId)}
                </h3>

                {/* Match percentage pill */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ink/10 dark:border-white/10">
                  <span className="inline-block bg-[#C8FF32] text-ink font-mono font-bold text-xs px-2.5 py-1 border-2 border-ink shadow-[2px_2px_0px_#11110F]">
                    {d.percentage}% MATCH
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
                    Confidence: High
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {d.description ?? 'Recommended based on your interest profile and market outlook.'}
                </p>
              </div>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t-2 border-ink/10 dark:border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/questionnaire')}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-transparent text-ink dark:text-cream font-bold hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="w-full sm:w-auto border-2 border-ink dark:border-white bg-[#C8FF32] text-ink font-extrabold hover:bg-[#b8f020] shadow-[4px_4px_0px_#11110F] dark:shadow-[4px_4px_0px_#fff] active:translate-y-0.5 px-8"
          >
            {isSaving ? 'Saving Selection...' : 'Continue to Courses'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </PageShell>
  )
}

