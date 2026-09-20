import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageShell from '@/components/PageShell'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { loadSeedDomains, loadSeedInterestQuestionnaire } from '@/services/seedDataService'
import { checkVisionVaultHealth, getTopRecommendationsFromVV, DOMAIN_METADATA } from '@/services/visionVaultService'
import { getTopDomains } from '@/services/recommendationService'
import { saveInterestAssessment } from '@/services/profileService'

export default function Questionnaire() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<
    Array<{
      questionId: number
      question: string
      multiSelect: boolean
      options: Array<{ id: string; label: string; mappedInterests: string[] }>
    }>
  >([])
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<number, string[]>>({})

  const educationLevel = profile?.educationLevel

  // Per-question helper: returns the number of selected options for a given questionId
  const selectedCountForQuestion = (questionId: number): number => {
    const list = answersByQuestionId[questionId]
    return Array.isArray(list) ? list.length : 0
  }

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!educationLevel) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const list = await loadSeedInterestQuestionnaire(educationLevel)
        if (!mounted) return
        setQuestions(list)

        // Restore saved selections — cap at 2 PER QUESTION independently
        const savedAnswers: Record<number, string[]> = {}
        const rawAnswers = profile?.interestAssessment?.answers
        if (rawAnswers && typeof rawAnswers === 'object') {
          for (const [k, v] of Object.entries(rawAnswers)) {
            const qId = Number(k)
            if (!isNaN(qId) && Array.isArray(v)) {
              const kept = v.slice(0, 2) // max 2 per question
              if (kept.length > 0) savedAnswers[qId] = kept
            }
          }
        }
        setAnswersByQuestionId(savedAnswers)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [educationLevel])

  const toggleOption = (args: { questionId: number; optionId: string }) => {
    setAnswersByQuestionId((prev) => {
      const current = new Set(prev[args.questionId] ?? [])
      const isCurrentlySelected = current.has(args.optionId)

      // Deselecting an already-selected option is always permitted
      if (isCurrentlySelected) {
        current.delete(args.optionId)
        return { ...prev, [args.questionId]: Array.from(current) }
      }

      // Per-question limit: check ONLY the current question's selected count
      // Each question independently allows up to 2 selections.
      const currentQuestionCount = current.size
      if (currentQuestionCount >= 2) {
        return prev // block 3rd selection within this question only
      }

      current.add(args.optionId)
      return { ...prev, [args.questionId]: Array.from(current) }
    })
  }

  const computed = useMemo(() => {
    const interestScores: Record<string, number> = {}
    const answers: Record<string, string[]> = {}

    for (const q of questions) {
      const selectedOptionIds = answersByQuestionId[q.questionId] ?? []
      if (selectedOptionIds.length === 0) continue
      answers[String(q.questionId)] = selectedOptionIds

      for (const optionId of selectedOptionIds) {
        const opt = q.options.find((o) => o.id === optionId)
        if (!opt) continue
        for (const interestId of opt.mappedInterests ?? []) {
          const k = interestId.trim().toLowerCase()
          if (!k) continue
          interestScores[k] = (interestScores[k] ?? 0) + 1
        }
      }
    }

    const topInterests = Object.entries(interestScores)
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        return a[0].localeCompare(b[0])
      })
      .slice(0, 12)
      .map(([id]) => id)

    return { answers, interestScores, topInterests }
  }, [answersByQuestionId, questions])

  const handleContinue = async () => {
    if (!profile?.uid || !educationLevel) return
    if (computed.topInterests.length === 0) {
      alert('Please select at least one interest.')
      return
    }

    setIsSaving(true)
    try {
      let finalDomains = []
      const isVVHealthy = await checkVisionVaultHealth().catch(() => false)

      if (isVVHealthy) {
        try {
          const vvResult = await getTopRecommendationsFromVV({
            interestScores: computed.interestScores,
            educationLevel: profile.educationLevel ?? '12th',
            state: 'Karnataka',
            district: profile.studentDetails?.district
          })
          
          finalDomains = vvResult.domain_recommendations.map((d: any) => {
            const meta = DOMAIN_METADATA[d.domain]
            return {
              domainId: d.domain,
              name: meta?.name,
              description: meta?.description ?? 'Recommended by NEXT VERSE AI based on your profile.',
              score: d.probability,
              percentage: Math.max(1, Math.round(d.probability * 100)),
              matchedInterestIds: computed.topInterests,
              isMLPrediction: true
            }
          })

          sessionStorage.setItem('vv_full_recommendations', JSON.stringify(vvResult))
          if (vvResult.course_scores) {
            sessionStorage.setItem('vv_course_scores', JSON.stringify(vvResult.course_scores))
          }
          if (Array.isArray(vvResult.course_recommendations)) {
            sessionStorage.setItem('vv_course_matches', JSON.stringify(vvResult.course_recommendations))
          }
          if (Array.isArray(vvResult.career_recommendations)) {
            sessionStorage.setItem('vv_career_matches', JSON.stringify(vvResult.career_recommendations))
          }
          if (computed.interestScores) {
            sessionStorage.setItem('vv_interest_scores', JSON.stringify(computed.interestScores))
          }
        } catch (e) {
          console.error('VisionVault call failed, using fallback:', e)
        }
      }

      // Fallback to local calculation if ML is offline or fails
      if (finalDomains.length === 0) {
        const domains = await loadSeedDomains(educationLevel)
        finalDomains = getTopDomains({ domains, selectedInterestIds: computed.topInterests, limit: 6 })
      }

      const bestDomainId = finalDomains[0]?.domainId

      const isMockUid = profile.uid === 'mock-uid' || profile.uid === 'google-mock-uid'
      const shouldSkipFirestore = isOfflineMode || isMockUid

      const interestAssessment = {
        answers: computed.answers,
        interestScores: computed.interestScores,
        topInterests: computed.topInterests,
        updatedAt: new Date(),
      }

      if (!shouldSkipFirestore) {
        // Allow up to 5 seconds for Firestore to respond, then proceed anyway
        await Promise.race([
          saveInterestAssessment({ uid: profile.uid, interestAssessment }),
          new Promise((resolve) => setTimeout(resolve, 5000))
        ]).catch((err) => console.warn('Firestore save error:', err))
      }

      setProfile({
        ...profile,
        interestAssessment,
        selectedDomainId: bestDomainId,
        updatedAt: new Date(),
      })

      // store the ranking inside session storage for Domains screen to show results without adding schema changes
      sessionStorage.setItem('vv_domain_matches', JSON.stringify(finalDomains))

      navigate('/domains')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to compute recommendations'
      console.error(message)
      alert(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 bg-yellow-accent border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase text-ink shadow-[2px_2px_0px_#11110F]">
              STEP 2 OF 5 • INTEREST QUESTIONNAIRE
            </span>
            <span className="inline-flex items-center gap-2 bg-[#C8FF32] border-2 border-ink px-3 py-1 font-mono text-xs font-black uppercase text-ink shadow-[2px_2px_0px_#11110F]">
              SELECT UP TO 2 OPTIONS PER QUESTION
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-ink dark:text-[#F7F5EE]">
            WHAT SPARKS YOUR CURIOSITY?
          </h1>
          <p className="text-xs md:text-sm font-medium text-ink/75 dark:text-[#F7F5EE]/75 mt-2">
            Select up to 2 activities and subjects you genuinely enjoy. Our AI model maps this to high-fit career paths.
          </p>
        </div>

        <Card className="nb-card p-6 md:p-8 bg-white dark:bg-[#1A1A17]">
          <CardContent className="space-y-6 p-0">
            {!educationLevel ? (
              <div className="space-y-4 text-center py-6">
                <p className="text-sm font-mono text-ink/80 dark:text-[#F7F5EE]/80">Please select your education level first.</p>
                <Button onClick={() => navigate('/level')}>Go to Education Level →</Button>
              </div>
            ) : isLoading ? (
              <div className="text-center py-10 font-mono text-xs uppercase font-bold text-ink/70 dark:text-[#F7F5EE]/70 animate-pulse">
                ⚡ Loading personalized question catalog for {educationLevel}...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink dark:border-[#F7F5EE]/20 font-mono text-xs">
                  <span className="text-ink/70 dark:text-[#F7F5EE]/70">QUALIFICATION:</span>
                  <span className="bg-lime-accent border border-ink px-2 py-0.5 font-bold text-ink">{educationLevel}</span>
                </div>

                <div className="space-y-6">
                  {questions.map((q) => {
                    const selectedIds = new Set(answersByQuestionId[q.questionId] ?? [])
                    return (
                      <div key={q.questionId} className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-heading font-bold text-base text-ink dark:text-[#F7F5EE]">
                            {q.question}
                          </div>
                          <span className={`shrink-0 font-mono text-xs font-bold px-2 py-0.5 border-2 border-ink shadow-[1.5px_1.5px_0px_#11110F] ${
                            selectedCountForQuestion(q.questionId) >= 2
                              ? 'bg-[#C8FF32] text-ink'
                              : 'bg-white dark:bg-[#22221E] text-ink dark:text-[#F7F5EE]'
                          }`}>
                            {selectedCountForQuestion(q.questionId)}/2
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {q.options.map((opt) => {
                            const checked = selectedIds.has(opt.id)
                            const inputId = `q${q.questionId}_${opt.id}`
                            return (
                              <label
                                key={opt.id}
                                htmlFor={inputId}
                                className={`flex items-center gap-3 p-3.5 border-2 border-ink dark:border-[#F7F5EE] cursor-pointer transition-all select-none ${
                                  checked
                                    ? 'bg-lime-accent text-ink shadow-[4px_4px_0px_#11110F] font-bold'
                                    : 'bg-white dark:bg-[#22221E] text-ink dark:text-[#F7F5EE] hover:bg-yellow-accent/25 dark:hover:bg-yellow-accent/15 shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_rgba(247,245,238,0.3)]'
                                }`}
                              >
                                <input
                                  id={inputId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleOption({ questionId: q.questionId, optionId: opt.id })}
                                  className="w-4 h-4 accent-ink cursor-pointer"
                                />
                                <span className="text-xs md:text-sm leading-snug">{opt.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-ink dark:border-[#F7F5EE]/20">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => navigate('/level')} disabled={isSaving}>
                      ← Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAnswersByQuestionId({})}
                      disabled={isSaving || Object.keys(answersByQuestionId).length === 0}
                      className="text-xs font-mono font-bold"
                    >
                      Clear All
                    </Button>
                  </div>
                  <Button
                    onClick={handleContinue}
                    disabled={isSaving}
                    size="lg"
                    className="w-full sm:w-auto bg-lime-accent text-ink font-black hover:bg-lime-300"
                  >
                    {isSaving ? 'Calculating AI Matches...' : 'See Recommended Domains →'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </PageShell>
  )
}


