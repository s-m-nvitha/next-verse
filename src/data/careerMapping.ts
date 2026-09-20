export type EducationLevelKey = '10th' | '12th' | 'UG' | 'PG'

export type WorkPreference = 'government_job' | 'private_job' | 'business' | 'research'

export type IncomeRangeKey =
  | 'below_1L'
  | '1L_3L'
  | '3L_6L'
  | '6L_10L'
  | '10L_plus'

export type CareerDomainId =
  | 'engineering_technology'
  | 'medical_healthcare'
  | 'commerce_finance'
  | 'arts_humanities'
  | 'law'
  | 'design_creative'
  | 'agriculture'
  | 'defense_civil_services'
  | 'sports_physical_education'
  | 'it_software'

export type IndiaStateKey =
  | 'andhra_pradesh'
  | 'telangana'
  | 'karnataka'
  | 'tamil_nadu'
  | 'kerala'
  | 'maharashtra'
  | 'delhi'
  | 'uttar_pradesh'
  | 'madhya_pradesh'
  | 'west_bengal'
  | 'gujarat'
  | 'rajasthan'
  | 'punjab'
  | 'haryana'
  | 'bihar'
  | 'odisha'
  | 'assam'
  | 'jharkhand'
  | 'chhattisgarh'
  | 'himachal_pradesh'
  | 'uttarakhand'
  | 'jammu_kashmir'
  | 'goa'

export type CareerDomain = {
  id: CareerDomainId
  title: string
  description: string
  skillsRequired: string[]
  typicalPaths: string[]
}

export type CareerPathStage = {
  forLevel: EducationLevelKey
  label: string
  nextStep: string
  streams?: Array<{ id: string; name: string; description: string }>
  courses?: Array<{ id: string; name: string }>
  exams?: Array<{ id: string; name: string }>
  pgOptions?: Array<{ id: string; name: string }>
  jobTracks?: Array<{ id: string; name: string }>
}

export type CareerPath = {
  domainId: CareerDomainId
  stages: CareerPathStage[]
}

export const CAREER_DOMAINS: CareerDomain[] = [
  {
    id: 'engineering_technology',
    title: 'Engineering & Technology',
    description:
      'Core engineering branches and emerging tech fields like AI, robotics, and electronics.',
    skillsRequired: ['Mathematics', 'Problem solving', 'Physics basics', 'Analytical thinking'],
    typicalPaths: ['10th → Science (PCM) → JEE → B.Tech → GATE → M.Tech / PSU'],
  },
  {
    id: 'medical_healthcare',
    title: 'Medical & Healthcare',
    description: 'Clinical medicine and allied health careers like nursing, pharmacy, and physiotherapy.',
    skillsRequired: ['Biology', 'Chemistry', 'Empathy', 'Attention to detail'],
    typicalPaths: ['10th → Science (PCB) → NEET → MBBS / BDS / BAMS'],
  },
  {
    id: 'commerce_finance',
    title: 'Commerce & Finance',
    description: 'Business, accounting, economics, banking, and finance careers.',
    skillsRequired: ['Numeracy', 'Communication', 'Business awareness', 'Decision making'],
    typicalPaths: ['10th → Commerce → B.Com / BBA → CA / MBA'],
  },
  {
    id: 'arts_humanities',
    title: 'Arts & Humanities',
    description: 'Social sciences, languages, history, psychology, journalism and public policy.',
    skillsRequired: ['Reading & writing', 'Critical thinking', 'Communication'],
    typicalPaths: ['10th → Arts → BA → MA → UGC NET / Civil Services'],
  },
  {
    id: 'law',
    title: 'Law',
    description: 'Legal education leading to litigation, corporate law, judiciary, and policy roles.',
    skillsRequired: ['Reading comprehension', 'Logical reasoning', 'Argumentation'],
    typicalPaths: ['12th → CLAT → 5-year LLB → Litigation / Corporate'],
  },
  {
    id: 'design_creative',
    title: 'Design & Creative',
    description: 'Fashion, product, UI/UX, animation, and creative media careers.',
    skillsRequired: ['Creativity', 'Visual thinking', 'Communication', 'Tool proficiency'],
    typicalPaths: ['12th → NIFT / NID → B.Des → Design roles'],
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    description: 'Agronomy, horticulture, agri-tech and food sciences, including govt and private roles.',
    skillsRequired: ['Biology basics', 'Field work interest', 'Data/Observation'],
    typicalPaths: ['12th (PCB/PCM) → ICAR → B.Sc Agriculture → Govt/Private/Agri-tech'],
  },
  {
    id: 'defense_civil_services',
    title: 'Defense & Civil Services',
    description: 'Careers in armed forces and civil services administration.',
    skillsRequired: ['Discipline', 'Leadership', 'Fitness', 'General awareness'],
    typicalPaths: ['12th → NDA → Armed Forces OR UG → UPSC CSE → IAS/IPS'],
  },
  {
    id: 'sports_physical_education',
    title: 'Sports & Physical Education',
    description: 'Athlete, coach, sports science, fitness and physical education careers.',
    skillsRequired: ['Fitness', 'Practice discipline', 'Teamwork'],
    typicalPaths: ['10th/12th → Sports academies → Certification → Coaching/Pro'],
  },
  {
    id: 'it_software',
    title: 'IT & Software',
    description: 'Software engineering and IT careers including development, cloud, cybersecurity.',
    skillsRequired: ['Logical thinking', 'Programming basics', 'Communication'],
    typicalPaths: ['12th (PCM) → B.Tech/BCA → Software roles → MS/MBA optional'],
  },
]

export const CAREER_PATHS: CareerPath[] = [
  {
    domainId: 'engineering_technology',
    stages: [
      {
        forLevel: '10th',
        label: 'Choose a stream after 10th',
        nextStep: 'Pick Science (PCM) if you want Engineering & Technology.',
        streams: [
          {
            id: 'science_pcm',
            name: 'Science (PCM)',
            description: 'Physics + Chemistry + Mathematics (best for engineering).',
          },
          {
            id: 'science_pcb',
            name: 'Science (PCB)',
            description: 'Physics + Chemistry + Biology (more aligned to medical).',
          },
        ],
      },
      {
        forLevel: '12th',
        label: 'Core UG options after 12th',
        nextStep: 'Prepare for JEE for top engineering colleges.',
        courses: [
          { id: 'btech', name: 'B.Tech / B.E.' },
          { id: 'diploma_engineering', name: 'Diploma (Polytechnic) in Engineering' },
        ],
        exams: [
          { id: 'jee_main', name: 'JEE Main' },
          { id: 'jee_advanced', name: 'JEE Advanced' },
          { id: 'bitsat', name: 'BITSAT' },
          { id: 'viteee', name: 'VITEEE' },
        ],
      },
      {
        forLevel: 'UG',
        label: 'Higher studies & career progression',
        nextStep: 'Consider GATE for M.Tech/PSUs; internships for placements.',
        pgOptions: [
          { id: 'mtech', name: 'M.Tech' },
          { id: 'ms_abroad', name: 'MS (Abroad)' },
          { id: 'mba', name: 'MBA' },
        ],
        exams: [
          { id: 'gate', name: 'GATE' },
          { id: 'gre', name: 'GRE' },
          { id: 'cat', name: 'CAT' },
        ],
      },
      {
        forLevel: 'PG',
        label: 'Jobs / Research / Government exams',
        nextStep: 'Choose industry roles, PhD, or government exams based on preference.',
        jobTracks: [
          { id: 'industry', name: 'Private sector jobs' },
          { id: 'psu', name: 'PSU / Government jobs' },
          { id: 'research', name: 'Research / PhD' },
        ],
        exams: [
          { id: 'ugc_net', name: 'UGC NET' },
          { id: 'upsc', name: 'UPSC CSE' },
          { id: 'ssc', name: 'SSC CGL' },
        ],
      },
    ],
  },
  {
    domainId: 'medical_healthcare',
    stages: [
      {
        forLevel: '10th',
        label: 'Choose a stream after 10th',
        nextStep: 'Pick Science (PCB) for medical/healthcare.',
        streams: [
          { id: 'science_pcb', name: 'Science (PCB)', description: 'Physics + Chemistry + Biology.' },
          { id: 'science_pcm', name: 'Science (PCM)', description: 'PCM is less aligned to MBBS; good for biotech in some cases.' },
        ],
      },
      {
        forLevel: '12th',
        label: 'UG options after 12th (PCB)',
        nextStep: 'NEET is mandatory for MBBS/BDS in India.',
        courses: [
          { id: 'mbbs', name: 'MBBS' },
          { id: 'bds', name: 'BDS' },
          { id: 'bpharm', name: 'B.Pharm' },
          { id: 'bsc_nursing', name: 'B.Sc Nursing' },
          { id: 'bpt', name: 'BPT (Physiotherapy)' },
        ],
        exams: [{ id: 'neet', name: 'NEET (UG)' }],
      },
      {
        forLevel: 'UG',
        label: 'PG options & specializations',
        nextStep: 'Specialize or pursue allied master’s programs.',
        pgOptions: [
          { id: 'md_ms', name: 'MD/MS (after MBBS)' },
          { id: 'mph', name: 'MPH (Public Health)' },
        ],
        exams: [{ id: 'neet_pg', name: 'NEET PG' }],
      },
      {
        forLevel: 'PG',
        label: 'Jobs / Research / Government exams',
        nextStep: 'Practice, hospital roles, teaching, or research.',
        exams: [{ id: 'ugc_net', name: 'UGC NET' }],
        jobTracks: [
          { id: 'hospital', name: 'Hospital / Clinical roles' },
          { id: 'research', name: 'Research' },
          { id: 'govt', name: 'Government health services' },
        ],
      },
    ],
  },
  {
    domainId: 'commerce_finance',
    stages: [
      {
        forLevel: '10th',
        label: 'Choose a stream after 10th',
        nextStep: 'Commerce is the most direct path for finance and accounting.',
        streams: [{ id: 'commerce', name: 'Commerce', description: 'Accounts, Business Studies, Economics.' }],
      },
      {
        forLevel: '12th',
        label: 'UG options after 12th',
        nextStep: 'B.Com/BBA are common; CA is a professional path.',
        courses: [
          { id: 'bcom', name: 'B.Com' },
          { id: 'bba', name: 'BBA' },
          { id: 'ba_economics', name: 'BA Economics' },
        ],
        exams: [
          { id: 'cuet', name: 'CUET' },
          { id: 'ca_foundation', name: 'CA Foundation' },
        ],
      },
      {
        forLevel: 'UG',
        label: 'PG options & management',
        nextStep: 'MBA is common for corporate roles; finance certifications help.',
        pgOptions: [
          { id: 'mba', name: 'MBA' },
          { id: 'mcom', name: 'M.Com' },
        ],
        exams: [
          { id: 'cat', name: 'CAT' },
          { id: 'xat', name: 'XAT' },
        ],
      },
      {
        forLevel: 'PG',
        label: 'Jobs / Govt exams / Research',
        nextStep: 'Banking and govt exams are common options.',
        exams: [
          { id: 'ibps_po', name: 'IBPS PO' },
          { id: 'ssc', name: 'SSC CGL' },
          { id: 'upsc', name: 'UPSC CSE' },
        ],
        jobTracks: [
          { id: 'banking', name: 'Banking' },
          { id: 'corporate', name: 'Corporate finance' },
          { id: 'government', name: 'Government' },
        ],
      },
    ],
  },
]

export const getCareerDomainById = (id: CareerDomainId): CareerDomain | undefined =>
  CAREER_DOMAINS.find((d) => d.id === id)

export const getCareerPathForDomain = (domainId: CareerDomainId): CareerPath | undefined =>
  CAREER_PATHS.find((p) => p.domainId === domainId)
