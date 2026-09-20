export type LikertOptionId = 'strongly_agree' | 'agree' | 'neutral' | 'disagree' | 'strongly_disagree'

export interface LikertOption {
  id: LikertOptionId
  label: string
}

export type AssessmentDomainId =
  | 'engineering_technology'
  | 'medical_healthcare'
  | 'commerce_finance'
  | 'design_creative'
  | 'law'
  | 'agriculture'
  | 'defense_services'
  | 'it_software'

export type DomainWeights = Partial<Record<AssessmentDomainId, number>>

export interface CareerAssessmentQuestion {
  id: string
  text: string
  domainWeightsByOption: Record<LikertOptionId, DomainWeights>
}

export type CareerAssessmentAnswers = Record<string, LikertOptionId>
