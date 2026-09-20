import { z } from 'zod'

export const incomeRangeSchema = z.enum(['below_1L', '1L_3L', '3L_6L', '6L_10L', '10L_plus'])

export const karnatakaDistrictSchema = z.enum([
  'bengaluru_urban',
  'bengaluru_rural',
  'ramanagara',
  'kolar',
  'chikkaballapur',
  'mysuru',
  'mandya',
  'hassan',
  'kodagu',
  'chamarajanagar',
  'dakshina_kannada',
  'udupi',
  'uttara_kannada',
  'chikkamagaluru',
  'belagavi',
  'bagalkote',
  'vijayanagara',
  'dharwad',
  'gadag',
  'haveri',
  'shivamogga',
  'tumakuru',
  'ballari',
  'vijayapura',
  'davanagere',
  'chitradurga',
  'koppal',
  'kalaburagi',
  'bidar',
  'raichur',
  'yadgir',
])

export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say'])

export const workPreferenceSchema = z.enum([
  'government_job',
  'private_job',
  'business',
  'research',
])

export const indiaStateSchema = z.enum([
  'andhra_pradesh',
  'telangana',
  'karnataka',
  'tamil_nadu',
  'kerala',
  'maharashtra',
  'delhi',
  'uttar_pradesh',
  'madhya_pradesh',
  'west_bengal',
  'gujarat',
  'rajasthan',
  'punjab',
  'haryana',
  'bihar',
  'odisha',
  'assam',
  'jharkhand',
  'chhattisgarh',
  'himachal_pradesh',
  'uttarakhand',
  'jammu_kashmir',
  'goa',
])

export const careerDomainIdSchema = z.enum([
  'engineering_technology',
  'medical_healthcare',
  'commerce_finance',
  'arts_humanities',
  'law',
  'design_creative',
  'agriculture',
  'defense_civil_services',
  'sports_physical_education',
  'it_software',
])

export const userQuestionnaireSchema = z.object({
  fullName: z.string().min(2),
  currentQualification: z.string().min(2),
  location: z.object({
    city: z.string().min(2),
    state: indiaStateSchema,
  }),
  preferredStudyLocation: z
    .object({
      city: z.string().min(2),
      state: indiaStateSchema,
    })
    .optional(),
  familyIncomeRange: incomeRangeSchema,
  interestedWorkTypes: z.array(workPreferenceSchema).min(1),
  preferredField: z.string().optional(),
  willingToRelocate: z.boolean(),
})

export const weightedInterestSchema = z.object({
  id: z.string(),
  weight: z.number().min(0),
})

export const userProfileSchema = z.object({
  uid: z.string(),
  role: z.enum(['student', 'parent']),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
  educationLevel: z.enum(['10th', '12th', 'UG', 'PG']).optional(),
  questionnaire: userQuestionnaireSchema.optional(),
  selectedCareerDomain: careerDomainIdSchema.optional(),
  interests: z.array(weightedInterestSchema).optional(),
  preferences: z.array(z.string()).optional(),
  studentDetails: z
    .object({
      name: z.string().min(2),
      age: z.number().min(5).max(100).optional(),
      dob: z.string().optional(),
      gender: genderSchema,
      phone: z.string().min(10).optional(),
      email: z.string().email().optional(),
      district: karnatakaDistrictSchema,
      city: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/),
    })
    .optional(),
  educationInfo: z
    .object({
      level: z.enum(['10th', '12th', 'UG', 'PG']),
      tenth: z
        .object({
          school: z.string().min(2),
          board: z.string().min(2),
          percentage: z.number().min(0).max(100),
        })
        .optional(),
      twelfth: z
        .object({
          stream: z.enum(['PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'Vocational']),
          percentage: z.number().min(0).max(100),
        })
        .optional(),
      ug: z
        .object({
          degree: z.string().min(2),
          branch: z.string().min(2),
          cgpa: z.number().min(0).max(10),
        })
        .optional(),
      pg: z
        .object({
          degree: z.string().min(2),
          specialization: z.string().min(2),
        })
        .optional(),
    })
    .optional(),
  interestAssessment: z
    .object({
      answers: z.record(z.string(), z.array(z.string())),
      interestScores: z.record(z.string(), z.number()),
      topInterests: z.array(z.string()),
      updatedAt: z.date(),
    })
    .optional(),
  selectedDomainId: z.string().optional(),
  selectedCourseId: z.string().optional(),
  selectedExamIds: z.array(z.string()).optional(),
  savedCollegeIds: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Education level specific schemas
export const educationLevelSchema = z.enum(['10th', '12th', 'UG', 'PG'])

export const tenthGradeSchema = z.object({
  level: z.literal('10th'),
  subjects: z.array(z.string()),
  board: z.string().optional(),
  stream: z.enum(['science', 'commerce', 'arts']).optional(),
  interests: z.array(z.string()),
  careerGoals: z.array(z.string()).optional(),
})

export const twelfthGradeSchema = z.object({
  level: z.literal('12th'),
  subjects: z.array(z.string()),
  board: z.string().optional(),
  stream: z.enum(['science', 'commerce', 'arts']),
  interests: z.array(z.string()),
  careerGoals: z.array(z.string()).optional(),
  preferredExams: z.array(z.string()).optional(),
})

export const undergraduateSchema = z.object({
  level: z.literal('UG'),
  currentCourse: z.string().optional(),
  year: z.number().min(1).max(4).optional(),
  subjects: z.array(z.string()),
  interests: z.array(z.string()),
  careerGoals: z.array(z.string()).optional(),
  preferredExams: z.array(z.string()).optional(),
  specialization: z.string().optional(),
})

export const postgraduateSchema = z.object({
  level: z.literal('PG'),
  currentCourse: z.string().optional(),
  year: z.number().min(1).max(2).optional(),
  subjects: z.array(z.string()),
  interests: z.array(z.string()),
  careerGoals: z.array(z.string()).optional(),
  preferredExams: z.array(z.string()).optional(),
  specialization: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
})

export const interestOptionSchema = z.object({
  id: z.string(),
  labelKey: z.string(),
  descriptionKey: z.string(),
})

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  domains: z.array(z.string()),
  requiredLevel: z.array(z.enum(['10th', '12th', 'UG', 'PG'])),
  exams: z.array(z.string()),
  tags: z.array(z.string()),
})

export const examSchema = z.object({
  id: z.string(),
  courseId: z.string().optional(),
  domainId: z.string().optional(),
  name: z.string(),
  eligibility: z.string(),
  syllabusUrl: z.string().url().optional(),
  applicationWindow: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
})

export const recommendationSchema = z.object({
  id: z.string(),
  uid: z.string(),
  createdAt: z.date(),
  courses: z.array(z.string()),
  rationale: z.string(),
})

export const timelineItemSchema = z.object({
  id: z.string(),
  scope: z.enum(['national', 'user']),
  title: z.string(),
  date: z.date(),
  category: z.enum(['exam', 'application', 'counselling']),
  link: z.string().url().optional(),
  description: z.string().optional(),
})

export const savedCollegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('govt'),
  distanceKm: z.number().optional(),
  website: z.string().url().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

export const savedMaterialSchema = z.object({
  id: z.string(),
  title: z.string(),
  kind: z.enum(['ebook', 'course', 'video']),
  url: z.string().url(),
  cached: z.boolean().default(false),
})

export type UserProfile = z.infer<typeof userProfileSchema>
export type EducationLevel = z.infer<typeof educationLevelSchema>
export type TenthGrade = z.infer<typeof tenthGradeSchema>
export type TwelfthGrade = z.infer<typeof twelfthGradeSchema>
export type Undergraduate = z.infer<typeof undergraduateSchema>
export type Postgraduate = z.infer<typeof postgraduateSchema>
export type UserQuestionnaire = z.infer<typeof userQuestionnaireSchema>
export type CareerDomainId = z.infer<typeof careerDomainIdSchema>
export type IncomeRange = z.infer<typeof incomeRangeSchema>
export type WorkPreference = z.infer<typeof workPreferenceSchema>
export type IndiaState = z.infer<typeof indiaStateSchema>
export type Interest = z.infer<typeof weightedInterestSchema>
export type InterestOption = z.infer<typeof interestOptionSchema>
export type Course = z.infer<typeof courseSchema>
export type Exam = z.infer<typeof examSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
export type TimelineItem = z.infer<typeof timelineItemSchema>
export type SavedCollege = z.infer<typeof savedCollegeSchema>
export type SavedMaterial = z.infer<typeof savedMaterialSchema>
