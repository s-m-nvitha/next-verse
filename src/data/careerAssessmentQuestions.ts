import type { CareerAssessmentQuestion, LikertOptionId } from '@/models/careerAssessment'

const SA: LikertOptionId = 'strongly_agree'
const A: LikertOptionId = 'agree'
const N: LikertOptionId = 'neutral'
const D: LikertOptionId = 'disagree'
const SD: LikertOptionId = 'strongly_disagree'

export const CAREER_ASSESSMENT_QUESTIONS: CareerAssessmentQuestion[] = [
  {
    id: 'q_tech_problem_solving',
    text: 'I enjoy solving technical problems and understanding how things work.',
    domainWeightsByOption: {
      [SA]: { engineering_technology: 5, it_software: 5 },
      [A]: { engineering_technology: 3, it_software: 3 },
      [N]: { engineering_technology: 1, it_software: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_math_logic',
    text: 'I like mathematics, logic, and working with numbers.',
    domainWeightsByOption: {
      [SA]: { engineering_technology: 5, it_software: 4, commerce_finance: 3 },
      [A]: { engineering_technology: 3, it_software: 2, commerce_finance: 2 },
      [N]: { engineering_technology: 1, commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_care_helping',
    text: 'I feel satisfied when I help people with their health or wellbeing.',
    domainWeightsByOption: {
      [SA]: { medical_healthcare: 5 },
      [A]: { medical_healthcare: 3 },
      [N]: { medical_healthcare: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_biology_interest',
    text: 'I am curious about biology, the human body, and how diseases are treated.',
    domainWeightsByOption: {
      [SA]: { medical_healthcare: 5 },
      [A]: { medical_healthcare: 3 },
      [N]: { medical_healthcare: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_business_money',
    text: 'I am interested in business, money management, markets, and entrepreneurship.',
    domainWeightsByOption: {
      [SA]: { commerce_finance: 5 },
      [A]: { commerce_finance: 3 },
      [N]: { commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_analysis_data',
    text: 'I enjoy analyzing data and making decisions based on facts and patterns.',
    domainWeightsByOption: {
      [SA]: { it_software: 5, commerce_finance: 3, engineering_technology: 3 },
      [A]: { it_software: 3, commerce_finance: 2, engineering_technology: 2 },
      [N]: { it_software: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_creativity_design',
    text: 'I enjoy creative work like design, art, visuals, or building user experiences.',
    domainWeightsByOption: {
      [SA]: { design_creative: 5 },
      [A]: { design_creative: 3 },
      [N]: { design_creative: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_user_empathy',
    text: 'I like understanding user needs and improving products/services for people.',
    domainWeightsByOption: {
      [SA]: { design_creative: 4, it_software: 2, commerce_finance: 2 },
      [A]: { design_creative: 2, it_software: 1 },
      [N]: { design_creative: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_communication',
    text: 'I am confident in communication (speaking, presenting, writing).',
    domainWeightsByOption: {
      [SA]: { law: 4, commerce_finance: 3 },
      [A]: { law: 2, commerce_finance: 2 },
      [N]: { commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_argument',
    text: 'I enjoy debating, forming arguments, and convincing others with logic.',
    domainWeightsByOption: {
      [SA]: { law: 5 },
      [A]: { law: 3 },
      [N]: { law: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_leadership',
    text: 'I like taking responsibility and leading teams to achieve goals.',
    domainWeightsByOption: {
      [SA]: { defense_services: 4, commerce_finance: 3 },
      [A]: { defense_services: 2, commerce_finance: 2 },
      [N]: { defense_services: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_discipline',
    text: 'I prefer a disciplined lifestyle and can follow strict routines.',
    domainWeightsByOption: {
      [SA]: { defense_services: 5 },
      [A]: { defense_services: 3 },
      [N]: { defense_services: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_outdoor',
    text: 'I enjoy outdoor activities and working in the field rather than only in an office.',
    domainWeightsByOption: {
      [SA]: { agriculture: 4, defense_services: 2 },
      [A]: { agriculture: 2, defense_services: 1 },
      [N]: { agriculture: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_environment',
    text: 'I care about nature, sustainability, food systems, and the environment.',
    domainWeightsByOption: {
      [SA]: { agriculture: 5 },
      [A]: { agriculture: 3 },
      [N]: { agriculture: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_research',
    text: 'I like researching topics deeply and experimenting to find answers.',
    domainWeightsByOption: {
      [SA]: { engineering_technology: 3, it_software: 3, medical_healthcare: 2 },
      [A]: { engineering_technology: 2, it_software: 2 },
      [N]: { engineering_technology: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_attention_detail',
    text: 'I pay attention to details and prefer accuracy over speed.',
    domainWeightsByOption: {
      [SA]: { medical_healthcare: 3, law: 2, commerce_finance: 2 },
      [A]: { medical_healthcare: 2, commerce_finance: 1 },
      [N]: { medical_healthcare: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_coding',
    text: 'I am curious about coding, apps, websites, or how software is built.',
    domainWeightsByOption: {
      [SA]: { it_software: 5, engineering_technology: 3 },
      [A]: { it_software: 3, engineering_technology: 2 },
      [N]: { it_software: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_systems',
    text: 'I like building systems/processes and improving efficiency.',
    domainWeightsByOption: {
      [SA]: { engineering_technology: 4, it_software: 3, commerce_finance: 2 },
      [A]: { engineering_technology: 2, it_software: 2 },
      [N]: { engineering_technology: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_service_mindset',
    text: 'I feel motivated by service to society and contributing to the nation.',
    domainWeightsByOption: {
      [SA]: { defense_services: 4, medical_healthcare: 2, law: 2 },
      [A]: { defense_services: 2, medical_healthcare: 1 },
      [N]: { defense_services: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_risk_reward',
    text: 'I am comfortable taking calculated risks to achieve bigger outcomes.',
    domainWeightsByOption: {
      [SA]: { commerce_finance: 4 },
      [A]: { commerce_finance: 2 },
      [N]: { commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_public_speaking',
    text: 'I enjoy public speaking or representing my team/school.',
    domainWeightsByOption: {
      [SA]: { law: 3, commerce_finance: 3 },
      [A]: { law: 2, commerce_finance: 2 },
      [N]: { commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_organize',
    text: 'I like planning, organizing tasks, and managing responsibilities.',
    domainWeightsByOption: {
      [SA]: { commerce_finance: 3, engineering_technology: 2 },
      [A]: { commerce_finance: 2 },
      [N]: { commerce_finance: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_health_pressure',
    text: 'I can stay calm and responsible in stressful situations involving people.',
    domainWeightsByOption: {
      [SA]: { medical_healthcare: 4, defense_services: 2 },
      [A]: { medical_healthcare: 2, defense_services: 1 },
      [N]: { medical_healthcare: 1 },
      [D]: {},
      [SD]: {},
    },
  },
  {
    id: 'q_design_aesthetics',
    text: 'Aesthetics and visual quality matter to me when creating something.',
    domainWeightsByOption: {
      [SA]: { design_creative: 4 },
      [A]: { design_creative: 2 },
      [N]: { design_creative: 1 },
      [D]: {},
      [SD]: {},
    },
  },
]
