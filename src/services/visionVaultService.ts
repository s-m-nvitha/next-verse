const withTimeout = <T,>(promise: Promise<T>, ms: number) => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ])
}

export const DOMAIN_METADATA: Record<string, { name: string; description: string }> = {
  software_engineering: {
    name: 'Software Engineering & App Development',
    description: 'Design, code, and deploy modern software applications, cloud systems, and web architectures.'
  },
  data_science_ai: {
    name: 'Data Science & Artificial Intelligence',
    description: 'Leverage machine learning, neural networks, analytics, and big data to build intelligent systems.'
  },
  cyber_security: {
    name: 'Cyber Security & Ethical Hacking',
    description: 'Protect digital infrastructure, conduct penetration testing, and secure computer networks.'
  },
  electronics_embedded_systems: {
    name: 'Electronics & Embedded Systems',
    description: 'Design microcontrollers, IoT devices, robotics hardware, and electronic circuits.'
  },
  automobile_aeronautical: {
    name: 'Automobile & Aeronautical Engineering',
    description: 'Engineer advanced vehicle mechanics, aerodynamics, aircraft systems, and automotive robotics.'
  },
  doctor_medical_field: {
    name: 'Medical & Clinical Practice (MBBS / BDS)',
    description: 'Diagnose illnesses, perform clinical surgery, treat patients, and practice medical science.'
  },
  allied_health_sciences: {
    name: 'Allied Health Sciences & Nursing',
    description: 'Provide critical patient support, physiotherapy, medical lab diagnostics, and nursing care.'
  },
  pharmaceutical_sciences: {
    name: 'Pharmaceutical Sciences (Pharmacy)',
    description: 'Formulate drugs, research pharmaceutical compounds, and lead clinical drug testing.'
  },
  chartered_accountancy: {
    name: 'Chartered Accountancy & Auditing',
    description: 'Master financial auditing, corporate taxation, forensic accounting, and statutory compliance.'
  },
  business_management_domain: {
    name: 'Business Administration & Management',
    description: 'Lead organizations, drive corporate growth, manage operations, and launch startups.'
  },
  banking_financial_services: {
    name: 'Banking & Financial Services',
    description: 'Analyze capital markets, conduct investment banking, manage wealth, and evaluate fintech.'
  },
  legal_studies: {
    name: 'Law & Legal Studies',
    description: 'Practice corporate law, constitutional advocacy, judiciary litigation, and dispute resolution.'
  },
  psychology_counselling: {
    name: 'Psychology & Counselling',
    description: 'Understand human behavior, provide mental wellness therapy, and conduct psychological research.'
  },
  media_mass_communication: {
    name: 'Media & Mass Communication',
    description: 'Journalism, broadcast media, digital journalism, public relations, and content production.'
  },
  graphic_ui_ux_design: {
    name: 'Graphic Design & UI/UX',
    description: 'Create intuitive user experiences, digital product aesthetics, branding, and typography.'
  },
  animation_vfx_gaming: {
    name: 'Animation, VFX & Game Design',
    description: 'Develop interactive 3D video games, visual effects, CGI movies, and motion animations.'
  },
  fashion_design_domain: {
    name: 'Fashion & Apparel Design',
    description: 'Create clothing collections, textile engineering, fashion styling, and trend forecasting.'
  },
  defence_services: {
    name: 'Defence Services & Armed Forces',
    description: 'Serve as a commissioned officer in the Army, Navy, or Air Force with discipline and honor.'
  },
  public_administration: {
    name: 'Public Administration & Civil Services',
    description: 'Administer government departments, formulate public policy, and lead IAS / KAS services.'
  }
}

const getApiBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL
  return envUrl ? envUrl.replace(/\/$/, '') : 'http://127.0.0.1:8000'
}

export const checkVisionVaultHealth = async () => {
  try {
    const res = await withTimeout(fetch(`${getApiBaseUrl()}/health`), 3000)
    if (!res.ok) return false
    const data = await res.json()
    return data.status === 'healthy'
  } catch {
    return false
  }
}

export const getTopRecommendationsFromVV = async (args: {
  interestScores: Record<string, number>
  educationLevel: string
  state: string
  district?: string
  userId?: string
}) => {
  const allInterests = [
    "coding", "software_development", "technology", "computers", "ai_ml", "data_science", "analytics", "automation", "cyber_security", "ethical_hacking", "network_security", "robotics", "iot", "innovation", "cloud_computing", "devops", "electronics", "machines",
    "research", "science", "mathematics", "problem_solving",
    "medicine", "healthcare", "biology", "patient_care", "patient_support", "nursing", "rehabilitation",
    "business", "startup", "entrepreneurship", "management", "finance", "economics", "accounting", "stock_market", "investment", "banking",
    "law", "justice", "public_service", "governance", "policy", "administration",
    "design", "creativity", "ui_ux", "graphics", "product_design", "animation", "gaming", "media", "film_making", "storytelling", "content_creation", "writing",
    "leadership", "communication", "discipline", "national_service", "defence",
    "psychology", "global_education", "international_careers"
  ]

  const interests: Record<string, number> = {}
  
  // Normalize interest scores to the model's trained primary activation range (7.0 - 9.5).
  // Non-zero selections receive values between 7.0 and 9.5 based on relative preference weight.
  // Unselected interests remain 0.
  const positiveScores = Object.values(args.interestScores).filter((v) => v > 0)
  const maxScore = positiveScores.length > 0 ? Math.max(...positiveScores) : 1

  allInterests.forEach((id) => {
    const raw = args.interestScores[id] || 0
    if (raw > 0) {
      interests[id] = Math.round((7.0 + 2.5 * (raw / maxScore)) * 10) / 10
    } else {
      interests[id] = 0
    }
  })

  const payload = {
    user_id: args.userId,
    education_level: args.educationLevel,
    state: args.state,
    district: args.district,
    interests
  }

  const res = await withTimeout(fetch(`${getApiBaseUrl()}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }), 10000)

  if (!res.ok) {
    throw new Error('Failed to fetch recommendations from NEXT VERSE')
  }

  return await res.json()
}
