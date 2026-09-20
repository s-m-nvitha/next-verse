import type { Course } from '@/models/course'

export interface CareerRoadmap {
  courseId: string
  possibleJobRoles: string[]
  futureSkills: string[]
  salaryGrowth: string
  industryDemand: string
  higherEducationOptions: string[]
}

export const buildRoadmap = (course: Course): CareerRoadmap => {
  const title = course.title.toLowerCase()

  if (title.includes('b.tech') || title.includes('btech') || title.includes('computer')) {
    return {
      courseId: course.id,
      possibleJobRoles: ['Software Engineer', 'AI Engineer', 'Data Scientist', 'Cybersecurity Analyst'],
      futureSkills: ['DSA', 'System Design', 'Cloud', 'AI/ML basics', 'Cybersecurity fundamentals'],
      salaryGrowth: 'Typically grows significantly with experience, skills, and product/company tier.',
      industryDemand: 'High demand across IT services, startups, and product companies.',
      higherEducationOptions: ['M.Tech', 'MS', 'MBA', 'Specialized certifications (cloud, security, AI)'],
    }
  }

  if (title.includes('mbbs') || title.includes('nursing')) {
    return {
      courseId: course.id,
      possibleJobRoles: ['Medical Officer', 'Resident Doctor', 'Registered Nurse', 'Clinical Specialist'],
      futureSkills: ['Clinical practice', 'Patient communication', 'Diagnostics', 'Ethics'],
      salaryGrowth: 'Growth improves with specialization, experience, and location.',
      industryDemand: 'Consistently high demand in hospitals and public health.',
      higherEducationOptions: ['MD/MS', 'Specializations', 'Public Health (MPH)'],
    }
  }

  if (title.includes('llb')) {
    return {
      courseId: course.id,
      possibleJobRoles: ['Advocate', 'Legal Associate', 'Compliance Officer'],
      futureSkills: ['Legal research', 'Drafting', 'Negotiation', 'Court procedures'],
      salaryGrowth: 'Grows with practice area, reputation, and corporate experience.',
      industryDemand: 'Steady demand in litigation, corporate, and compliance roles.',
      higherEducationOptions: ['LLM', 'Judicial services preparation'],
    }
  }

  return {
    courseId: course.id,
    possibleJobRoles: course.careerOutcomes,
    futureSkills: ['Communication', 'Domain expertise', 'Digital skills'],
    salaryGrowth: 'Improves with skills, internships, and performance.',
    industryDemand: 'Depends on specialization and region.',
    higherEducationOptions: ['PG specialization', 'Professional certifications'],
  }
}
