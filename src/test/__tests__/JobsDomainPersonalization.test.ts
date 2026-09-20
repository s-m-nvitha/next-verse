import { describe, it, expect } from 'vitest'
import { SEED_JOBS, getDomainPersonalizedJobs, scoreJobForStudent } from '@/services/jobs'

describe('Jobs & Career Services Domain Personalization', () => {
  it('contains comprehensive seed jobs across all canonical domains', () => {
    expect(SEED_JOBS.length).toBeGreaterThanOrEqual(25)
    
    // Check coverage across key clusters
    const techJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('software') || d.includes('data') || d.includes('cyber')))
    expect(techJobs.length).toBeGreaterThanOrEqual(4)

    const healthJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('medical') || d.includes('health') || d.includes('pharm')))
    expect(healthJobs.length).toBeGreaterThanOrEqual(4)

    const engJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('mechanical') || d.includes('electronics') || d.includes('civil') || d.includes('robotics')))
    expect(engJobs.length).toBeGreaterThanOrEqual(4)

    const lawJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('legal') || d.includes('law') || d.includes('public_admin') || d.includes('defence')))
    expect(lawJobs.length).toBeGreaterThanOrEqual(4)

    const bizJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('business') || d.includes('banking') || d.includes('finance') || d.includes('accountancy')))
    expect(bizJobs.length).toBeGreaterThanOrEqual(4)

    const designJobs = SEED_JOBS.filter(j => j.relatedDomains?.some(d => d.includes('design') || d.includes('media') || d.includes('animation')))
    expect(designJobs.length).toBeGreaterThanOrEqual(4)
  })

  it('Test Domain 1: Technology & Software Engineering gives tech jobs as primary visible results', () => {
    const personalized = getDomainPersonalizedJobs(SEED_JOBS, {
      selectedDomainId: 'software_engineering',
      topInterests: ['coding', 'software_development'],
    })

    const top3 = personalized.slice(0, 3)
    // Every single one of top 3 must be a software / tech role
    for (const job of top3) {
      const isTech = job.relatedDomains?.some(d => ['software_engineering', 'computer_science', 'cyber_security'].includes(d))
      expect(isTech).toBe(true)
    }

    // Top job must be Software Engineer
    expect(top3[0].title).toContain('Software')
  })

  it('Test Domain 2: Healthcare & Medical Field gives healthcare jobs as primary visible results', () => {
    const personalized = getDomainPersonalizedJobs(SEED_JOBS, {
      selectedDomainId: 'doctor_medical_field',
      topInterests: ['medicine', 'biology', 'healthcare'],
    })

    const top3 = personalized.slice(0, 3)
    for (const job of top3) {
      const isHealthcare = job.relatedDomains?.some(d => 
        ['doctor_medical_field', 'medical_sciences', 'allied_health_sciences', 'public_health_and_epidemiology', 'nursing_healthcare'].includes(d)
      )
      expect(isHealthcare).toBe(true)
    }

    // No software or finance jobs in top 3
    expect(top3.some(j => j.title.includes('Software'))).toBe(false)
    expect(top3.some(j => j.title.includes('Financial'))).toBe(false)
  })

  it('Test Domain 3: Law & Legal Studies gives legal and compliance jobs as primary visible results', () => {
    const personalized = getDomainPersonalizedJobs(SEED_JOBS, {
      selectedDomainId: 'legal_studies',
      topInterests: ['law', 'justice', 'debate'],
    })

    const top3 = personalized.slice(0, 3)
    for (const job of top3) {
      const isLegal = job.relatedDomains?.some(d => 
        ['legal_studies', 'law_public_policy', 'constitutional_and_corporate_law', 'public_administration'].includes(d)
      )
      expect(isLegal).toBe(true)
    }

    expect(top3[0].title).toMatch(/Legal|Compliance/i)
  })

  it('Test Domain 4: Core Mechanical / Aeronautical Engineering gives engineering jobs as primary visible results', () => {
    const personalized = getDomainPersonalizedJobs(SEED_JOBS, {
      selectedDomainId: 'automobile_aeronautical',
      topInterests: ['machines', 'manufacturing'],
    })

    const top3 = personalized.slice(0, 3)
    for (const job of top3) {
      const isEngineering = job.relatedDomains?.some(d => 
        ['automobile_aeronautical', 'mechanical_engineering', 'space_and_aerospace_research', 'electronics_embedded_systems', 'robotics_automation'].includes(d)
      )
      expect(isEngineering).toBe(true)
    }
  })

  it('changing domain dynamically alters the ranking of jobs', () => {
    const techJobs = getDomainPersonalizedJobs(SEED_JOBS, { selectedDomainId: 'software_engineering' })
    const healthJobs = getDomainPersonalizedJobs(SEED_JOBS, { selectedDomainId: 'doctor_medical_field' })
    const lawJobs = getDomainPersonalizedJobs(SEED_JOBS, { selectedDomainId: 'legal_studies' })

    expect(techJobs[0].id).not.toEqual(healthJobs[0].id)
    expect(techJobs[0].id).not.toEqual(lawJobs[0].id)
    expect(healthJobs[0].id).not.toEqual(lawJobs[0].id)
  })

  it('supports 10th grade alias domain IDs (e.g. computer_science, medical_sciences)', () => {
    const tech10th = getDomainPersonalizedJobs(SEED_JOBS, { selectedDomainId: 'computer_science' })
    expect(tech10th[0].title).toContain('Software')

    const med10th = getDomainPersonalizedJobs(SEED_JOBS, { selectedDomainId: 'medical_sciences' })
    expect(med10th[0].title).toMatch(/Clinical|Medical|Health/i)
  })

  it('gracefully falls back when no domain is selected', () => {
    const noDomain = getDomainPersonalizedJobs(SEED_JOBS, {})
    expect(noDomain.length).toBe(SEED_JOBS.length)
    for (const job of noDomain) {
      const score = scoreJobForStudent(job, {})
      expect(score).toBeGreaterThanOrEqual(10)
    }
  })

  it('JobsWidget renders correctly in DOM and reflects auth-store domain changes', async () => {
    const { render, screen } = await import('@testing-library/react')
    const { JobsWidget } = await import('@/components/JobsWidget')
    const { useAuthStore } = await import('@/store/auth')

    // 1. Set Tech Profile
    useAuthStore.setState({
      profile: {
        uid: 'test-user',
        email: 'test@example.com',
        displayName: 'Tech Student',
        role: 'student',
        selectedDomainId: 'software_engineering',
        interestAssessment: { topInterests: ['coding', 'software_development'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })

    const React = await import('react')
    const { unmount } = render(React.createElement(JobsWidget))
    expect(screen.getByText('Junior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('TechCorp India')).toBeInTheDocument()

    // 2. Set Healthcare Profile
    useAuthStore.setState({
      profile: {
        uid: 'test-user',
        email: 'test@example.com',
        displayName: 'Health Student',
        role: 'student',
        selectedDomainId: 'doctor_medical_field',
        interestAssessment: { topInterests: ['medicine', 'healthcare'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })

    unmount()
    const { unmount: unmount2 } = render(React.createElement(JobsWidget))
    expect(screen.getByText('Clinical Research Coordinator')).toBeInTheDocument()
    expect(screen.getByText('Karnataka Health Science Foundation')).toBeInTheDocument()

    // 3. Set Law Profile
    useAuthStore.setState({
      profile: {
        uid: 'test-user',
        email: 'test@example.com',
        displayName: 'Law Student',
        role: 'student',
        selectedDomainId: 'legal_studies',
        interestAssessment: { topInterests: ['law', 'justice'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })

    unmount2()
    render(React.createElement(JobsWidget))
    expect(screen.getByText('Legal Research Associate')).toBeInTheDocument()
    expect(screen.getByText('Apex Legal Chambers')).toBeInTheDocument()
  })
})

