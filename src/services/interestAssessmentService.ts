import type { InterestId, InterestQuestion } from '@/data/interestQuestionnaire'

export type InterestAnswers = Record<string, string[]>

export interface InterestScoreResult {
  interestId: InterestId
  score: number
  percentage: number
}

export const calculateInterestScores = (args: {
  questions: InterestQuestion[]
  answers: InterestAnswers
}): {
  scores: InterestScoreResult[]
  interestScores: Record<string, number>
  topInterests: InterestId[]
} => {
  const raw: Record<InterestId, number> = {
    technology: 0,
    problem_solving: 0,
    creativity: 0,
    leadership: 0,
    communication: 0,
    helping_people: 0,
    mathematics: 0,
    biology: 0,
    research: 0,
    innovation: 0,
    business: 0,
    finance: 0,
    teaching: 0,
    environment: 0,
    sports: 0,
    public_service: 0,
    psychology: 0,
    writing: 0,
    media: 0,
    computers: 0,
    ai_robotics: 0,
    cybersecurity: 0,
    entrepreneurship: 0,
    law: 0,
    architecture: 0,
    animation: 0,
    gaming: 0,
    medicine: 0,
  }

  for (const q of args.questions) {
    const selectedOptionIds = new Set(args.answers[q.id] ?? [])
    for (const opt of q.options) {
      if (!selectedOptionIds.has(opt.id)) continue
      for (const interest of opt.mappedInterests) {
        raw[interest] += opt.weight
      }
    }
  }

  const max = Math.max(1, ...Object.values(raw))

  const scores: InterestScoreResult[] = (Object.keys(raw) as InterestId[])
    .map((interestId) => {
      const score = raw[interestId]
      const percentage = Math.round((score / max) * 100)
      return { interestId, score, percentage }
    })
    .sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage
      if (b.score !== a.score) return b.score - a.score
      return a.interestId.localeCompare(b.interestId)
    })

  const topInterests = scores.slice(0, 5).map((s) => s.interestId)

  const interestScores: Record<string, number> = {}
  for (const s of scores) {
    interestScores[s.interestId] = s.percentage
  }

  return { scores, interestScores, topInterests }
}

export type DomainId =
  | 'engineering_technology'
  | 'computer_science_it'
  | 'ai_data_science'
  | 'cybersecurity'
  | 'robotics'
  | 'medical_healthcare'
  | 'commerce_finance'
  | 'law'
  | 'design_animation'
  | 'architecture'
  | 'agriculture'
  | 'teaching'
  | 'psychology'
  | 'journalism_media'
  | 'hotel_management'
  | 'civil_services'
  | 'defense_services'
  | 'sports_science'
  | 'research_academia'

const DOMAIN_INTEREST_WEIGHTS: Record<DomainId, Partial<Record<InterestId, number>>> = {
  engineering_technology: { technology: 3, problem_solving: 3, mathematics: 2, innovation: 2, computers: 1 },
  computer_science_it: { computers: 3, technology: 2, problem_solving: 2, cybersecurity: 1, ai_robotics: 1 },
  ai_data_science: { ai_robotics: 3, mathematics: 2, computers: 2, research: 2, problem_solving: 1 },
  cybersecurity: { cybersecurity: 3, computers: 2, problem_solving: 2, technology: 1 },
  robotics: { ai_robotics: 3, technology: 2, mathematics: 2, innovation: 2, problem_solving: 1 },
  medical_healthcare: { medicine: 3, biology: 2, helping_people: 2, research: 1 },
  commerce_finance: { finance: 3, business: 2, mathematics: 1, leadership: 1, communication: 1 },
  law: { law: 3, communication: 2, public_service: 1, leadership: 1, writing: 1 },
  design_animation: { creativity: 3, animation: 2, media: 1, gaming: 1 },
  architecture: { architecture: 3, creativity: 2, mathematics: 1 },
  agriculture: { environment: 3, research: 1, business: 1 },
  teaching: { teaching: 3, communication: 2, public_service: 1 },
  psychology: { psychology: 3, helping_people: 1, research: 1 },
  journalism_media: { media: 3, writing: 2, communication: 1 },
  hotel_management: { communication: 2, leadership: 1, business: 1 },
  civil_services: { public_service: 3, leadership: 2, communication: 1 },
  defense_services: { leadership: 2, public_service: 2, sports: 1 },
  sports_science: { sports: 3, biology: 1, helping_people: 1 },
  research_academia: { research: 3, innovation: 1, mathematics: 1, biology: 1 },
}

export interface DomainMatch {
  domainId: DomainId
  score: number
  percentage: number
  explanation: string
}

const DOMAIN_TITLES: Record<DomainId, string> = {
  engineering_technology: 'Engineering & Technology',
  computer_science_it: 'Computer Science & IT',
  ai_data_science: 'AI & Data Science',
  cybersecurity: 'Cybersecurity',
  robotics: 'Robotics',
  medical_healthcare: 'Medical & Healthcare',
  commerce_finance: 'Commerce & Finance',
  law: 'Law',
  design_animation: 'Design & Animation',
  architecture: 'Architecture',
  agriculture: 'Agriculture',
  teaching: 'Teaching',
  psychology: 'Psychology',
  journalism_media: 'Journalism & Media',
  hotel_management: 'Hotel Management',
  civil_services: 'Civil Services',
  defense_services: 'Defense Services',
  sports_science: 'Sports Science',
  research_academia: 'Research & Academia',
}

export const calculateDomainMatchesFromInterests = (interestPercentages: Record<string, number>): DomainMatch[] => {
  const matches: DomainMatch[] = (Object.keys(DOMAIN_INTEREST_WEIGHTS) as DomainId[]).map((domainId) => {
    const weights = DOMAIN_INTEREST_WEIGHTS[domainId]
    const max = Object.values(weights).reduce((s, w) => s + (w ?? 0), 0) || 1

    let score = 0
    const contributing: Array<{ interest: string; value: number }> = []

    for (const [interestId, w] of Object.entries(weights)) {
      const v = interestPercentages[interestId] ?? 0
      score += v * (w ?? 0)
      contributing.push({ interest: interestId, value: v })
    }

    const percentage = Math.round(score / (max * 100) * 100)

    const top = contributing
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((x) => x.interest.replace(/_/g, ' '))
      .join(', ')

    return {
      domainId,
      score,
      percentage,
      explanation: `${DOMAIN_TITLES[domainId]} matched mainly due to: ${top}.`,
    }
  })

  return matches.sort((a, b) => b.percentage - a.percentage).slice(0, 6)
}
