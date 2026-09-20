import type {
  AssessmentDomainId,
  CareerAssessmentAnswers,
  CareerAssessmentQuestion,
  DomainWeights,
  LikertOptionId,
} from '@/models/careerAssessment'

export interface DomainScore {
  domainId: AssessmentDomainId
  rawScore: number
  maxScore: number
  percentage: number
}

export interface DomainScoreWithExplanation extends DomainScore {
  explanation: string
  topContributors: Array<{ questionId: string; points: number; reason: string }>
}

const DOMAIN_TITLES: Record<AssessmentDomainId, string> = {
  engineering_technology: 'Engineering & Technology',
  medical_healthcare: 'Medical & Healthcare',
  commerce_finance: 'Commerce & Finance',
  design_creative: 'Arts & Design',
  law: 'Law',
  agriculture: 'Agriculture',
  defense_services: 'Defense Services',
  it_software: 'IT & Software',
}

const optionWeightMultiplier: Record<LikertOptionId, number> = {
  strongly_agree: 1,
  agree: 0.7,
  neutral: 0.3,
  disagree: 0,
  strongly_disagree: 0,
}

const addWeights = (acc: Record<string, number>, weights: DomainWeights, mult: number) => {
  for (const [domainId, w] of Object.entries(weights)) {
    const d = domainId as AssessmentDomainId
    acc[d] = (acc[d] ?? 0) + (w ?? 0) * mult
  }
}

export const calculateDomainScores = (args: {
  questions: CareerAssessmentQuestion[]
  answers: CareerAssessmentAnswers
}): DomainScoreWithExplanation[] => {
  const domainRaw: Record<AssessmentDomainId, number> = {
    engineering_technology: 0,
    medical_healthcare: 0,
    commerce_finance: 0,
    design_creative: 0,
    law: 0,
    agriculture: 0,
    defense_services: 0,
    it_software: 0,
  }

  const domainMax: Record<AssessmentDomainId, number> = {
    engineering_technology: 0,
    medical_healthcare: 0,
    commerce_finance: 0,
    design_creative: 0,
    law: 0,
    agriculture: 0,
    defense_services: 0,
    it_software: 0,
  }

  const contributors: Record<AssessmentDomainId, Array<{ questionId: string; points: number; reason: string }>> = {
    engineering_technology: [],
    medical_healthcare: [],
    commerce_finance: [],
    design_creative: [],
    law: [],
    agriculture: [],
    defense_services: [],
    it_software: [],
  }

  for (const q of args.questions) {
    const chosen = args.answers[q.id]

    // max uses strongly_agree weights
    addWeights(domainMax as unknown as Record<string, number>, q.domainWeightsByOption.strongly_agree, 1)

    if (!chosen) continue

    const mult = optionWeightMultiplier[chosen]
    const weights = q.domainWeightsByOption[chosen]

    const before: Record<AssessmentDomainId, number> = { ...domainRaw }
    addWeights(domainRaw as unknown as Record<string, number>, weights, mult)

    // record contribution per domain
    for (const [d, newVal] of Object.entries(domainRaw)) {
      const domainId = d as AssessmentDomainId
      const delta = newVal - before[domainId]
      if (delta <= 0) continue
      contributors[domainId].push({
        questionId: q.id,
        points: Math.round(delta * 10) / 10,
        reason: q.text,
      })
    }
  }

  const scored: DomainScoreWithExplanation[] = (Object.keys(domainRaw) as AssessmentDomainId[]).map((domainId) => {
    const rawScore = domainRaw[domainId]
    const maxScore = domainMax[domainId]
    const percentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0

    const topContributors = contributors[domainId]
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)

    const explanation =
      topContributors.length > 0
        ? `${DOMAIN_TITLES[domainId]} matched because your answers showed: ${topContributors
            .map((c) => c.reason)
            .join(' ')}.`
        : `${DOMAIN_TITLES[domainId]} is suggested as a potential fit based on your overall pattern.`

    return {
      domainId,
      rawScore: Math.round(rawScore * 10) / 10,
      maxScore,
      percentage,
      explanation,
      topContributors,
    }
  })

  return scored.sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore
    return a.domainId.localeCompare(b.domainId)
  })
}

export const getTopDomains = (scores: DomainScoreWithExplanation[], limit = 3) => scores.slice(0, limit)

export const generateCareerSummary = (top: DomainScoreWithExplanation[]) => {
  return {
    headline: 'Your career domain recommendations',
    summary: top
      .map((d) => `${DOMAIN_TITLES[d.domainId]} (${d.percentage}%)`)
      .join(' • '),
    details: top.map((d) => ({
      domainId: d.domainId,
      title: DOMAIN_TITLES[d.domainId],
      confidence: d.percentage,
      reason: d.explanation,
    })),
  }
}
