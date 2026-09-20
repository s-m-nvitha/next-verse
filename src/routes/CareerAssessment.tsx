import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCareerAssessmentStore } from '@/store/careerAssessment'
import { CAREER_ASSESSMENT_QUESTIONS } from '@/data/careerAssessmentQuestions'
import type { LikertOptionId } from '@/models/careerAssessment'
import { calculateDomainScores } from '@/services/careerAssessmentService'
import PageShell from '@/components/PageShell'
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react'

const likertOptions: Array<{ id: LikertOptionId; label: string }> = [
  { id: 'strongly_agree', label: 'Strongly Agree' },
  { id: 'agree', label: 'Agree' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'disagree', label: 'Disagree' },
  { id: 'strongly_disagree', label: 'Strongly Disagree' },
]

const schema = z.object({
  answer: z.enum(['strongly_agree', 'agree', 'neutral', 'disagree', 'strongly_disagree']),
})

type FormValues = z.infer<typeof schema>

export default function CareerAssessment() {
  const navigate = useNavigate()
  const { answers, setAnswer, setResults } = useCareerAssessmentStore()
  const [index, setIndex] = useState(0)

  const total = CAREER_ASSESSMENT_QUESTIONS.length
  const current = CAREER_ASSESSMENT_QUESTIONS[index]

  const defaultAnswer = useMemo(() => {
    const a = answers[current.id]
    return a ?? 'neutral'
  }, [answers, current.id])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { answer: defaultAnswer as FormValues['answer'] },
    values: { answer: defaultAnswer as FormValues['answer'] },
  })

  const progress = Math.round(((index + 1) / total) * 100)

  const goNext = async () => {
    const ok = await form.trigger()
    if (!ok) return
    const v = form.getValues('answer')
    setAnswer(current.id, v)

    if (index < total - 1) {
      setIndex((i) => i + 1)
    } else {
      const results = calculateDomainScores({
        questions: CAREER_ASSESSMENT_QUESTIONS,
        answers: { ...answers, [current.id]: v as never },
      })
      setResults(results)
      navigate('/domain-analysis')
    }
  }

  const goBack = () => {
    const v = form.getValues('answer')
    setAnswer(current.id, v)
    if (index > 0) setIndex((i) => i - 1)
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8FF32] border-2 border-ink text-ink font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#11110F]">
              <Sparkles className="h-3.5 w-3.5" />
              QUESTION {index + 1} OF {total}
            </span>
            <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {progress}% COMPLETE
            </span>
          </div>

          <div className="w-full h-3 border-2 border-ink bg-white dark:bg-neutral-900 p-0.5 shadow-[2px_2px_0px_#11110F]">
            <div
              className="h-full bg-[#C8FF32] border border-ink transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="rounded-none border-2 border-ink shadow-[6px_6px_0px_#11110F] bg-card p-6 sm:p-8">
              <CardHeader className="p-0 pb-6 border-b border-ink/10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Aptitude Evaluation
                </span>
                <CardTitle className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink dark:text-cream">
                  Career Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-6 space-y-6">
                <p className="font-display font-bold text-lg sm:text-xl text-ink dark:text-cream leading-snug">
                  {current.text}
                </p>

                <div className="space-y-3">
                  {likertOptions.map((o) => {
                    const checked = form.watch('answer') === o.id
                    const inputId = `${current.id}__${o.id}`
                    return (
                      <label
                        key={o.id}
                        htmlFor={inputId}
                        className={`flex items-center gap-3 border-2 border-ink px-4 py-3.5 cursor-pointer transition-all ${
                          checked
                            ? 'bg-[#C8FF32] text-ink font-bold shadow-[4px_4px_0px_#11110F] -translate-y-0.5'
                            : 'bg-card text-card-foreground shadow-[2px_2px_0px_#11110F] dark:shadow-[2px_2px_0px_#222] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={current.id}
                          value={o.id}
                          checked={checked}
                          onChange={() => form.setValue('answer', o.id, { shouldValidate: true })}
                          className="h-4 w-4 accent-ink"
                        />
                        <span className="font-mono text-xs sm:text-sm tracking-wide uppercase">
                          {o.label}
                        </span>
                      </label>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-ink/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={index === 0}
                    className="btn-tactile bg-white dark:bg-neutral-800 text-ink dark:text-cream border-2 border-ink rounded-none font-mono uppercase text-xs font-bold shadow-[2px_2px_0px_#11110F]"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goNext}
                    className="btn-tactile bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90 border-2 border-ink rounded-none font-mono uppercase text-xs font-bold shadow-[3px_3px_0px_#11110F]"
                  >
                    {index === total - 1 ? 'See Results' : 'Next'}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>

                <p className="text-[11px] font-mono text-muted-foreground text-center">
                  This assessment estimates domain fit using your responses. Guidance, not a final decision.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  )
}
