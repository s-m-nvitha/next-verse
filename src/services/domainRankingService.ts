import type { CareerDomain } from '@/models/domain'

export interface DomainMatchResult {
  domainId: string
  score: number
  percentage: number
  matchedInterestIds: string[]
  explanation: string
}

export const calculateDomainMatch = (args: {
  domain: CareerDomain
  selectedInterestIds: string[]
  interestWeights?: Record<string, number>
}): DomainMatchResult => {
  const weights = args.interestWeights ?? {}
  const selected = new Set(args.selectedInterestIds)

  const matched = args.domain.relatedInterests.filter((id) => selected.has(id))

  const maxScore = args.domain.relatedInterests.reduce((sum, id) => sum + (weights[id] ?? 1), 0)
  const rawScore = matched.reduce((sum, id) => sum + (weights[id] ?? 1), 0)

  const percentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0

  const explanation =
    matched.length === 0
      ? `${args.domain.title} is suggested based on overall fit for your profile.`
      : `${args.domain.title} was recommended because you selected: ${matched
          .map((x) => x.replace(/_/g, ' '))
          .join(', ')}.`

  return {
    domainId: args.domain.id,
    score: rawScore,
    percentage,
    matchedInterestIds: matched,
    explanation,
  }
}

export const getTopDomains = (args: {
  domains: CareerDomain[]
  selectedInterestIds: string[]
  limit?: number
  interestWeights?: Record<string, number>
}): DomainMatchResult[] => {
  const limit = args.limit ?? 5

  const ranked = args.domains
    .map((d) =>
      calculateDomainMatch({
        domain: d,
        selectedInterestIds: args.selectedInterestIds,
        interestWeights: args.interestWeights,
      })
    )
    .sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage
      if (b.score !== a.score) return b.score - a.score
      return a.domainId.localeCompare(b.domainId)
    })

  return ranked.slice(0, limit)
}
