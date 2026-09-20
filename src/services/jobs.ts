import { ML_TO_10TH_DOMAIN_MAP } from '@/services/recommendationService'

// Job model interface with optional domain & interest matching metadata
export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min: number
    max: number
  }
  type: string
  experience: string
  skills: string[]
  description: string
  postedDate: Date
  applicationUrl: string
  relatedDomains?: string[]
  relatedInterests?: string[]
}

export interface JobFilters {
  search?: string
  type?: string
  experience?: string
  location?: string
  salaryMin?: number
  salaryMax?: number
}

// Canonical domain clusters grouping related 10th/12th/UG/PG domains
export const DOMAIN_CLUSTERS: Record<string, string[]> = {
  technology: [
    'software_engineering',
    'computer_science',
    'data_science_ai',
    'artificial_intelligence',
    'cyber_security',
    'artificial_intelligence_research',
    'advanced_data_science',
  ],
  engineering: [
    'automobile_aeronautical',
    'mechanical_engineering',
    'electronics_embedded_systems',
    'electronics_communication',
    'civil_architecture',
    'robotics_automation',
    'space_and_aerospace_research',
  ],
  healthcare: [
    'doctor_medical_field',
    'medical_sciences',
    'allied_health_sciences',
    'nursing_healthcare',
    'pharmaceutical_sciences',
    'pharmacy_domain',
    'medical_specialization_research',
    'public_health_and_epidemiology',
  ],
  business_finance: [
    'business_management_domain',
    'business_management',
    'banking_financial_services',
    'banking_economics',
    'chartered_accountancy',
    'finance_accounting',
    'corporate_leadership',
    'investment_banking_domain',
    'startup_and_innovation_management',
    'global_business_and_management',
  ],
  creative_design: [
    'graphic_ui_ux_design',
    'ui_ux_design',
    'animation_vfx_gaming',
    'animation_multimedia',
    'media_mass_communication',
    'journalism_media',
    'fashion_design_domain',
    'fashion_interior_design',
    'advanced_ui_ux_and_product_strategy',
    'digital_media_and_film_studies',
  ],
  law_public_services: [
    'legal_studies',
    'law_public_policy',
    'public_administration',
    'civil_services',
    'defence_services',
    'armed_forces',
    'psychology_counselling',
    'psychology_human_behavior',
    'constitutional_and_corporate_law',
    'judiciary_services',
    'policy_and_public_administration',
    'indian_administrative_services',
    'foreign_services_diplomacy',
    'armed_forces_command',
    'national_security_and_intelligence',
  ],
}

// Curated multi-domain seed dataset covering all project domains with realistic details
export const SEED_JOBS: Job[] = [
  // --- Technology / Software / AI ---
  {
    id: 'job-tech-1',
    title: 'Junior Software Engineer',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    salary: { min: 650000, max: 950000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    description: 'Build and optimize modern cloud-native web applications and backend microservices',
    postedDate: new Date('2025-01-15'),
    applicationUrl: 'https://www.naukri.com/software-engineer-jobs-in-bangalore',
    relatedDomains: ['software_engineering', 'computer_science'],
    relatedInterests: ['coding', 'software_development', 'technology', 'computers'],
  },
  {
    id: 'job-tech-2',
    title: 'Associate Data Scientist & Analyst',
    company: 'Analytics Pro Solutions',
    location: 'Bangalore, Karnataka',
    salary: { min: 600000, max: 900000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Python', 'SQL', 'Tableau', 'Statistical Modeling'],
    description: 'Extract actionable intelligence from large-scale student and enterprise data sets',
    postedDate: new Date('2025-01-12'),
    applicationUrl: 'https://www.naukri.com/data-analyst-jobs-in-bangalore',
    relatedDomains: ['data_science_ai', 'artificial_intelligence', 'advanced_data_science'],
    relatedInterests: ['data_science', 'ai_ml', 'analytics', 'mathematics'],
  },
  {
    id: 'job-tech-3',
    title: 'AI/ML Systems Trainee',
    company: 'Cognitive Innovations Lab',
    location: 'Hyderabad, Telangana',
    salary: { min: 700000, max: 1100000 },
    type: 'Full-time',
    experience: '0-1 years',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
    description: 'Train, evaluate, and deploy predictive machine learning and generative AI models',
    postedDate: new Date('2025-01-10'),
    applicationUrl: 'https://www.naukri.com/machine-learning-engineer-jobs-in-hyderabad',
    relatedDomains: ['data_science_ai', 'artificial_intelligence_research', 'artificial_intelligence'],
    relatedInterests: ['ai_ml', 'robotics', 'coding', 'technology'],
  },
  {
    id: 'job-tech-4',
    title: 'Junior Cyber Security Analyst',
    company: 'ShieldNet Cyber Solutions',
    location: 'Bangalore, Karnataka',
    salary: { min: 550000, max: 850000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Network Security', 'Vulnerability Assessment', 'Linux', 'SIEM'],
    description: 'Monitor enterprise infrastructure, perform threat detection, and enforce cybersecurity protocols',
    postedDate: new Date('2025-01-08'),
    applicationUrl: 'https://www.naukri.com/cyber-security-jobs-in-bangalore',
    relatedDomains: ['cyber_security', 'software_engineering', 'computer_science'],
    relatedInterests: ['cyber_security', 'networking', 'ethical_hacking', 'technology'],
  },
  {
    id: 'job-tech-5',
    title: 'Cloud DevOps Intern',
    company: 'Nexus Cloud Systems',
    location: 'Pune, Maharashtra',
    salary: { min: 250000, max: 400000 },
    type: 'Internship',
    experience: '0-1 years',
    skills: ['AWS', 'Docker', 'Linux', 'CI/CD Pipelines'],
    description: 'Automate build workflows, monitor cloud infrastructure, and manage container deployments',
    postedDate: new Date('2025-01-14'),
    applicationUrl: 'https://www.naukri.com/devops-jobs-in-pune',
    relatedDomains: ['software_engineering', 'computer_science'],
    relatedInterests: ['technology', 'software_development', 'coding'],
  },

  // --- Core Engineering ---
  {
    id: 'job-eng-1',
    title: 'Graduate Engineer Trainee - Mechanical',
    company: 'Apex Heavy Engineering',
    location: 'Bangalore, Karnataka',
    salary: { min: 450000, max: 700000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['AutoCAD', 'SolidWorks', 'GD&T', 'Manufacturing Processes'],
    description: 'Design mechanical components, oversee prototype assembly, and assist in production quality checks',
    postedDate: new Date('2025-01-11'),
    applicationUrl: 'https://www.naukri.com/mechanical-engineer-jobs-in-bangalore',
    relatedDomains: ['automobile_aeronautical', 'mechanical_engineering'],
    relatedInterests: ['machines', 'mechanical_interest', 'manufacturing', 'innovation'],
  },
  {
    id: 'job-eng-2',
    title: 'Embedded Systems & Firmware Engineer',
    company: 'Silicon Embed Technologies',
    location: 'Bangalore, Karnataka',
    salary: { min: 600000, max: 950000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Embedded C', 'Microcontrollers', 'RTOS', 'PCB Design'],
    description: 'Develop low-level device firmware and hardware integration tests for IoT embedded systems',
    postedDate: new Date('2025-01-13'),
    applicationUrl: 'https://www.naukri.com/embedded-systems-jobs-in-bangalore',
    relatedDomains: ['electronics_embedded_systems', 'electronics_communication'],
    relatedInterests: ['electronics', 'circuits', 'iot', 'innovation'],
  },
  {
    id: 'job-eng-3',
    title: 'Junior Site Engineer - Civil',
    company: 'National Infrastructure Corp',
    location: 'Bangalore, Karnataka',
    salary: { min: 400000, max: 650000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Structural Design', 'AutoCAD Civil', 'Site Supervision', 'Surveying'],
    description: 'Supervise infrastructure site activities, inspect material standards, and track project construction schedules',
    postedDate: new Date('2025-01-09'),
    applicationUrl: 'https://www.naukri.com/civil-engineer-jobs-in-bangalore',
    relatedDomains: ['civil_architecture'],
    relatedInterests: ['architecture', 'construction', 'design_thinking'],
  },
  {
    id: 'job-eng-4',
    title: 'Robotics & Automation Trainee',
    company: 'RoboMech Systems',
    location: 'Pune, Maharashtra',
    salary: { min: 500000, max: 800000 },
    type: 'Full-time',
    experience: '0-1 years',
    skills: ['PLC Programming', 'ROS', 'Python', 'Sensors & Actuators'],
    description: 'Program industrial robotic arms, calibrate automated sensors, and troubleshoot manufacturing automation',
    postedDate: new Date('2025-01-07'),
    applicationUrl: 'https://www.naukri.com/robotics-engineer-jobs-in-pune',
    relatedDomains: ['robotics_automation', 'electronics_embedded_systems', 'mechanical_engineering'],
    relatedInterests: ['robotics', 'automation', 'electronics', 'machines'],
  },
  {
    id: 'job-eng-5',
    title: 'Aeronautical Engineering Analyst',
    company: 'AeroDynamics India',
    location: 'Bangalore, Karnataka',
    salary: { min: 600000, max: 900000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Aerodynamics', 'ANSYS Fluent', 'CATIA', 'Flight Dynamics'],
    description: 'Perform computational fluid dynamics simulations and structural stress analysis for aerospace components',
    postedDate: new Date('2025-01-05'),
    applicationUrl: 'https://www.naukri.com/aerospace-engineer-jobs-in-bangalore',
    relatedDomains: ['automobile_aeronautical', 'space_and_aerospace_research'],
    relatedInterests: ['aviation', 'machines', 'innovation'],
  },

  // --- Healthcare & Life Sciences ---
  {
    id: 'job-health-1',
    title: 'Clinical Research Coordinator',
    company: 'Karnataka Health Science Foundation',
    location: 'Bangalore, Karnataka',
    salary: { min: 450000, max: 700000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Clinical Trials', 'GCP Guidelines', 'Patient Documentation', 'Medical Data'],
    description: 'Coordinate clinical research trials, monitor protocol adherence, and record medical trial observations',
    postedDate: new Date('2025-01-14'),
    applicationUrl: 'https://www.naukri.com/clinical-research-jobs-in-bangalore',
    relatedDomains: ['doctor_medical_field', 'medical_sciences', 'allied_health_sciences', 'medical_specialization_research'],
    relatedInterests: ['medicine', 'biology', 'healthcare', 'human_body'],
  },
  {
    id: 'job-health-2',
    title: 'Medical Laboratory Technologist',
    company: 'Metro Diagnostic Care',
    location: 'Mangalore, Karnataka',
    salary: { min: 350000, max: 550000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Biochemistry', 'Hematology', 'Diagnostic Equipment', 'Sample Processing'],
    description: 'Perform diagnostic clinical tests, maintain laboratory equipment, and ensure precise pathology test records',
    postedDate: new Date('2025-01-11'),
    applicationUrl: 'https://www.naukri.com/lab-technician-jobs-in-mangalore',
    relatedDomains: ['allied_health_sciences', 'nursing_healthcare', 'medical_sciences'],
    relatedInterests: ['healthcare', 'patient_care', 'biology'],
  },
  {
    id: 'job-health-3',
    title: 'Pharmaceutical Quality Control Trainee',
    company: 'BioPharma India Ltd',
    location: 'Mysore, Karnataka',
    salary: { min: 380000, max: 600000 },
    type: 'Full-time',
    experience: '0-1 years',
    skills: ['HPLC', 'GMP Compliance', 'Titration', 'Pharmacology'],
    description: 'Conduct quality tests on drug formulations, verify raw materials, and document standard pharmaceutical compliance',
    postedDate: new Date('2025-01-08'),
    applicationUrl: 'https://www.naukri.com/pharma-jobs-in-mysore',
    relatedDomains: ['pharmaceutical_sciences', 'pharmacy_domain'],
    relatedInterests: ['medicine', 'chemistry', 'biology', 'healthcare'],
  },
  {
    id: 'job-health-4',
    title: 'Public Health Research Assistant',
    company: 'Community Health Initiative',
    location: 'Bangalore, Karnataka',
    salary: { min: 400000, max: 620000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Epidemiology', 'Health Surveys', 'Biostatistics', 'Community Outreach'],
    description: 'Collect public health field data, evaluate immunization programs, and analyze community healthcare trends',
    postedDate: new Date('2025-01-10'),
    applicationUrl: 'https://www.naukri.com/public-health-jobs-in-bangalore',
    relatedDomains: ['public_health_and_epidemiology', 'allied_health_sciences', 'doctor_medical_field'],
    relatedInterests: ['healthcare', 'helping_people', 'biology'],
  },
  {
    id: 'job-health-5',
    title: 'Staff Nurse Trainee',
    company: 'Apex Multi-Specialty Hospital',
    location: 'Bangalore, Karnataka',
    salary: { min: 320000, max: 500000 },
    type: 'Full-time',
    experience: '0-1 years',
    skills: ['Patient Care', 'Vital Signs Monitoring', 'Medication Administration', 'Emergency Support'],
    description: 'Deliver patient-centered inpatient care, assist doctors during procedures, and maintain clinical charts',
    postedDate: new Date('2025-01-12'),
    applicationUrl: 'https://www.naukri.com/nursing-jobs-in-bangalore',
    relatedDomains: ['nursing_healthcare', 'allied_health_sciences'],
    relatedInterests: ['nursing', 'patient_care', 'healthcare', 'helping_people'],
  },

  // --- Business, Finance & Management ---
  {
    id: 'job-biz-1',
    title: 'Financial Analyst',
    company: 'FinServe Advisory Partners',
    location: 'Bangalore, Karnataka',
    salary: { min: 600000, max: 950000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Financial Modeling', 'Excel / PowerBI', 'Valuation', 'Accounting Principles'],
    description: 'Build cash flow projection models, prepare quarterly earnings briefs, and analyze sector performance',
    postedDate: new Date('2025-01-13'),
    applicationUrl: 'https://www.naukri.com/financial-analyst-jobs-in-bangalore',
    relatedDomains: ['banking_financial_services', 'banking_economics', 'chartered_accountancy', 'finance_accounting', 'investment_banking_domain'],
    relatedInterests: ['finance', 'accounting', 'economics', 'analysis'],
  },
  {
    id: 'job-biz-2',
    title: 'Junior Audit & Taxation Associate',
    company: 'Apex Chartered Advisory',
    location: 'Bangalore, Karnataka',
    salary: { min: 450000, max: 700000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Statutory Audit', 'GST Filings', 'Direct Taxation', 'Tally Prime'],
    description: 'Review corporate balance sheets, audit ledger transactions, and prepare tax compliance schedules',
    postedDate: new Date('2025-01-09'),
    applicationUrl: 'https://www.naukri.com/audit-associate-jobs-in-bangalore',
    relatedDomains: ['chartered_accountancy', 'finance_accounting', 'banking_financial_services'],
    relatedInterests: ['accounting', 'finance', 'business'],
  },
  {
    id: 'job-biz-3',
    title: 'Business Development Associate',
    company: 'Growth Ventures India',
    location: 'Hyderabad, Telangana',
    salary: { min: 500000, max: 800000 },
    type: 'Full-time',
    experience: '1-2 years',
    skills: ['B2B Sales', 'Client Engagement', 'Market Research', 'CRM'],
    description: 'Drive business expansion across southern regions through B2B client acquisition and strategic partnerships',
    postedDate: new Date('2025-01-11'),
    applicationUrl: 'https://www.naukri.com/business-development-associate-jobs-in-hyderabad',
    relatedDomains: ['business_management_domain', 'business_management', 'corporate_leadership', 'startup_and_innovation_management'],
    relatedInterests: ['business', 'entrepreneurship', 'leadership', 'communication'],
  },
  {
    id: 'job-biz-4',
    title: 'Marketing & Brand Strategy Intern',
    company: 'Digital Marketing Co.',
    location: 'Delhi, NCR',
    salary: { min: 200000, max: 350000 },
    type: 'Internship',
    experience: '0-1 years',
    skills: ['Digital Marketing', 'SEO / SEM', 'Campaign Analytics', 'Copywriting'],
    description: 'Assist in planning social media marketing campaigns, track ROI metrics, and curate customer growth newsletters',
    postedDate: new Date('2025-01-14'),
    applicationUrl: 'https://www.naukri.com/marketing-intern-jobs-in-delhi-ncr',
    relatedDomains: ['business_management_domain', 'business_management', 'media_mass_communication'],
    relatedInterests: ['business', 'entrepreneurship', 'communication'],
  },
  {
    id: 'job-biz-5',
    title: 'Banking Operations Associate',
    company: 'Karnataka Regional Commercial Bank',
    location: 'Bangalore, Karnataka',
    salary: { min: 420000, max: 650000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Banking Procedures', 'KYC Compliance', 'Retail Credit', 'Customer Service'],
    description: 'Process customer trade finance and loan documentation, ensure KYC compliance, and reconcile daily branch accounts',
    postedDate: new Date('2025-01-06'),
    applicationUrl: 'https://www.naukri.com/banking-jobs-in-bangalore',
    relatedDomains: ['banking_financial_services', 'banking_economics'],
    relatedInterests: ['banking', 'finance', 'economics'],
  },

  // --- Creative, UI/UX & Media ---
  {
    id: 'job-creative-1',
    title: 'Junior UI/UX Designer',
    company: 'DesignCraft Studios',
    location: 'Pune, Maharashtra',
    salary: { min: 550000, max: 850000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Figma', 'Wireframing', 'User Research', 'Design Systems'],
    description: 'Craft responsive web/mobile user journeys, conduct usability testing, and maintain interactive component libraries',
    postedDate: new Date('2025-01-15'),
    applicationUrl: 'https://www.naukri.com/ux-designer-jobs-in-pune',
    relatedDomains: ['graphic_ui_ux_design', 'ui_ux_design', 'advanced_ui_ux_and_product_strategy'],
    relatedInterests: ['design_thinking', 'technology', 'innovation', 'computers'],
  },
  {
    id: 'job-creative-2',
    title: 'Motion Graphics & 3D Animator',
    company: 'PixelCraft Digital Media',
    location: 'Bangalore, Karnataka',
    salary: { min: 480000, max: 750000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['After Effects', 'Blender', 'Premiere Pro', 'Storyboarding'],
    description: 'Produce 3D animation assets, visual effects, and educational motion graphics for digital platforms',
    postedDate: new Date('2025-01-10'),
    applicationUrl: 'https://www.naukri.com/animator-jobs-in-bangalore',
    relatedDomains: ['animation_vfx_gaming', 'animation_multimedia'],
    relatedInterests: ['drawing', 'creativity', 'video_editing', 'design_thinking'],
  },
  {
    id: 'job-creative-3',
    title: 'Digital Media & Journalism Intern',
    company: 'MediaPulse Communications',
    location: 'Bangalore, Karnataka',
    salary: { min: 220000, max: 360000 },
    type: 'Internship',
    experience: '0-1 years',
    skills: ['News Reporting', 'Digital Editing', 'Social Media Journalism', 'Content Strategy'],
    description: 'Research public interest news stories, conduct interviews, and publish digital news features',
    postedDate: new Date('2025-01-12'),
    applicationUrl: 'https://www.naukri.com/journalism-jobs-in-bangalore',
    relatedDomains: ['media_mass_communication', 'journalism_media', 'digital_media_and_film_studies'],
    relatedInterests: ['writing', 'public_speaking', 'communication', 'debate'],
  },
  {
    id: 'job-creative-4',
    title: 'Assistant Fashion & Textile Designer',
    company: 'Vogue Craft Studio',
    location: 'Bangalore, Karnataka',
    salary: { min: 380000, max: 600000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Fabric Sourcing', 'Fashion Illustration', 'Pattern Making', 'Trend Forecasting'],
    description: 'Assist in developing seasonal apparel collections, draft garment sketches, and coordinate sample fabrication',
    postedDate: new Date('2025-01-08'),
    applicationUrl: 'https://www.naukri.com/fashion-designer-jobs-in-bangalore',
    relatedDomains: ['fashion_design_domain', 'fashion_interior_design'],
    relatedInterests: ['fashion', 'creativity', 'drawing'],
  },

  // --- Law, Public Administration & Defence ---
  {
    id: 'job-law-1',
    title: 'Legal Research Associate',
    company: 'Apex Legal Chambers',
    location: 'Bangalore, Karnataka',
    salary: { min: 500000, max: 800000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Legal Research', 'Drafting Contracts', 'Case Law Analysis', 'Civil Procedure'],
    description: 'Conduct legal precedents research, draft legal briefs, and assist senior advocates with case preparation',
    postedDate: new Date('2025-01-14'),
    applicationUrl: 'https://www.naukri.com/legal-associate-jobs-in-bangalore',
    relatedDomains: ['legal_studies', 'law_public_policy', 'constitutional_and_corporate_law', 'judiciary_services'],
    relatedInterests: ['law', 'justice', 'debate', 'public_policy'],
  },
  {
    id: 'job-law-2',
    title: 'Corporate Compliance & Governance Analyst',
    company: 'Global Governance Partners',
    location: 'Bangalore, Karnataka',
    salary: { min: 520000, max: 820000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Corporate Law', 'Regulatory Compliance', 'Risk Assessment', 'Due Diligence'],
    description: 'Monitor corporate governance mandates, perform regulatory audits, and ensure compliance filings',
    postedDate: new Date('2025-01-09'),
    applicationUrl: 'https://www.naukri.com/compliance-jobs-in-bangalore',
    relatedDomains: ['legal_studies', 'law_public_policy', 'business_management_domain'],
    relatedInterests: ['law', 'justice', 'business'],
  },
  {
    id: 'job-law-3',
    title: 'Public Policy Research Fellow',
    company: 'Centre for Public Policy & Governance',
    location: 'Delhi, NCR',
    salary: { min: 450000, max: 720000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Policy Analysis', 'Legislative Briefs', 'Stakeholder Interviews', 'Data Synthesis'],
    description: 'Analyze government policy bills, draft whitepapers on administrative reforms, and engage public stakeholders',
    postedDate: new Date('2025-01-11'),
    applicationUrl: 'https://www.naukri.com/public-policy-jobs-in-delhi',
    relatedDomains: ['public_administration', 'civil_services', 'policy_and_public_administration', 'indian_administrative_services'],
    relatedInterests: ['public_policy', 'law', 'justice', 'debate'],
  },
  {
    id: 'job-law-4',
    title: 'Counseling & Mental Health Intern',
    company: 'MindCare Counseling Services',
    location: 'Bangalore, Karnataka',
    salary: { min: 240000, max: 380000 },
    type: 'Internship',
    experience: '0-1 years',
    skills: ['Psychological Assessment', 'Empathetic Listening', 'Case History Documentation', 'Workshops'],
    description: 'Support certified psychologists with student counseling sessions, record case notes, and organize wellness webinars',
    postedDate: new Date('2025-01-13'),
    applicationUrl: 'https://www.naukri.com/psychology-jobs-in-bangalore',
    relatedDomains: ['psychology_counselling', 'psychology_human_behavior'],
    relatedInterests: ['psychology', 'helping_people', 'human_behavior', 'communication'],
  },
  {
    id: 'job-law-5',
    title: 'Defense Logistics & Operations Assistant',
    company: 'National Security Supply Hub',
    location: 'Belgaum, Karnataka',
    salary: { min: 400000, max: 650000 },
    type: 'Full-time',
    experience: '0-2 years',
    skills: ['Supply Chain Security', 'Inventory Verification', 'Logistics Management', 'SOP Compliance'],
    description: 'Coordinate critical defense inventory workflows, verify supply chain compliance, and maintain dispatch records',
    postedDate: new Date('2025-01-07'),
    applicationUrl: 'https://www.naukri.com/defence-jobs-in-karnataka',
    relatedDomains: ['defence_services', 'armed_forces', 'armed_forces_command', 'national_security_and_intelligence'],
    relatedInterests: ['armed_forces', 'discipline', 'leadership'],
  },
]

// Scoring and hierarchical matching logic
export function scoreJobForStudent(
  job: Job,
  options: {
    selectedDomainId?: string | null
    topInterests?: string[]
  }
): number {
  const { selectedDomainId, topInterests = [] } = options
  let score = 0

  if (!selectedDomainId) {
    // Graceful baseline when no domain is chosen yet
    return 10
  }

  const normalizedDomain = selectedDomainId.toLowerCase()
  const domainJobMatches = (job.relatedDomains ?? []).map(d => d.toLowerCase())

  // Tier 1: Exact domain match (direct ID match or ML-to-10th alias)
  const alias10th = ML_TO_10TH_DOMAIN_MAP[normalizedDomain]
  const isExactDomain =
    domainJobMatches.includes(normalizedDomain) ||
    (Boolean(alias10th) && domainJobMatches.includes(alias10th.toLowerCase()))

  if (isExactDomain) {
    score += 100
  }

  // Tier 2: Interest match (secondary signal)
  if (topInterests.length > 0) {
    const jobInterests = (job.relatedInterests ?? []).map(i => i.toLowerCase())
    const jobSkills = job.skills.map(s => s.toLowerCase())
    for (const interest of topInterests) {
      const lower = interest.toLowerCase()
      if (jobInterests.includes(lower)) {
        score += 25
      }
      if (jobSkills.some(skill => skill.includes(lower) || lower.includes(skill))) {
        score += 15
      }
    }
  }

  // Tier 3: Category / Cluster match
  let studentCluster: string | null = null
  for (const [clusterKey, domainList] of Object.entries(DOMAIN_CLUSTERS)) {
    if (
      domainList.includes(normalizedDomain) ||
      (Boolean(alias10th) && domainList.includes(alias10th.toLowerCase()))
    ) {
      studentCluster = clusterKey
      break
    }
  }

  if (studentCluster && !isExactDomain) {
    const clusterDomains = DOMAIN_CLUSTERS[studentCluster] || []
    const isClusterMatch = domainJobMatches.some(d => clusterDomains.includes(d))
    if (isClusterMatch) {
      score += 40
    }
  }

  // Slight boost for entry-friendly roles (0-1 / 0-2 yrs)
  if (job.experience.includes('0-1') || job.experience.includes('0-2')) {
    score += 5
  }

  return score
}

// Returns all jobs sorted by relevance score for the student
export function getDomainPersonalizedJobs(
  jobs: Job[],
  options: {
    selectedDomainId?: string | null
    topInterests?: string[]
  }
): Job[] {
  return [...jobs]
    .map(job => ({ job, score: scoreJobForStudent(job, options) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.job.postedDate.getTime() - a.job.postedDate.getTime()
    })
    .map(x => x.job)
}

// Fetch jobs with simulated API delay & filters
export async function fetchJobs(filters: JobFilters = {}): Promise<Job[]> {
  await new Promise(resolve => setTimeout(resolve, 300))

  let filteredJobs = SEED_JOBS

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredJobs = filteredJobs.filter(
      job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    )
  }

  if (filters.type && filters.type !== 'All') {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type)
  }

  if (filters.experience && filters.experience !== 'All') {
    filteredJobs = filteredJobs.filter(job => job.experience === filters.experience)
  }

  if (filters.location && filters.location !== 'All') {
    filteredJobs = filteredJobs.filter(job => job.location.includes(filters.location!))
  }

  if (filters.salaryMin) {
    filteredJobs = filteredJobs.filter(job => job.salary.min >= filters.salaryMin!)
  }

  if (filters.salaryMax) {
    filteredJobs = filteredJobs.filter(job => job.salary.max <= filters.salaryMax!)
  }

  return filteredJobs
}

export async function fetchJobById(id: string): Promise<Job | null> {
  const jobs = await fetchJobs()
  return jobs.find(job => job.id === id) || null
}

export async function fetchJobStats(): Promise<{
  totalJobs: number
  averageSalary: number
  topSkills: string[]
  locations: string[]
}> {
  const jobs = await fetchJobs()
  const totalJobs = jobs.length
  const averageSalary =
    jobs.reduce((sum, job) => sum + (job.salary.min + job.salary.max) / 2, 0) / (totalJobs || 1)

  const skillCounts: Record<string, number> = {}
  jobs.forEach(job => {
    job.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([skill]) => skill)

  const locations = [...new Set(jobs.map(job => job.location.split(',')[0].trim()))]

  return {
    totalJobs,
    averageSalary,
    topSkills,
    locations,
  }
}
