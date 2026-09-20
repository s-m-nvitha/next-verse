import { z } from 'zod'

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  EDUCATION_DATA: 'educationData',
  INTERESTS: 'interests',
  COURSES: 'courses',
  EXAMS: 'exams',
  COLLEGES: 'colleges',
  RECOMMENDATIONS: 'recommendations',
  USER_BEHAVIOR: 'userBehavior',
  TIMELINE: 'timeline',
  SAVED_ITEMS: 'savedItems',
  SCHOLARSHIPS: 'scholarships',
  JOBS: 'jobs',
  STUDY_MATERIALS: 'studyMaterials',
} as const

// User profile schema for Firestore
export const firestoreUserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['student', 'parent']),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
  educationLevel: z.enum(['10th', '12th', 'UG', 'PG']).optional(),
  studentDetails: z
    .object({
      name: z.string(),
      age: z.number().optional(),
      dob: z.string().optional(),
      gender: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
      district: z.string(),
      city: z.string(),
    })
    .optional(),
  educationInfo: z
    .object({
      level: z.string(),
      tenth: z
        .object({
          school: z.string(),
          board: z.string(),
          percentage: z.number(),
        })
        .optional(),
      twelfth: z
        .object({
          stream: z.string(),
          percentage: z.number(),
        })
        .optional(),
      ug: z
        .object({
          degree: z.string(),
          branch: z.string(),
          cgpa: z.number(),
        })
        .optional(),
      pg: z
        .object({
          degree: z.string(),
          specialization: z.string(),
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
  questionnaire: z
    .object({
      fullName: z.string(),
      currentQualification: z.string(),
      location: z.object({
        city: z.string(),
        state: z.string(),
      }),
      preferredStudyLocation: z
        .object({
          city: z.string(),
          state: z.string(),
        })
        .optional(),
      familyIncomeRange: z.string(),
      interestedWorkTypes: z.array(z.string()),
      preferredField: z.string().optional(),
      willingToRelocate: z.boolean(),
    })
    .optional(),
  selectedCareerDomain: z.string().optional(),
  interests: z.array(z.object({
    id: z.string(),
    weight: z.number().min(0),
  })).optional(),
  preferences: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  isActive: z.boolean().default(true),
})

// Education data schema for Firestore
export const firestoreEducationDataSchema = z.object({
  uid: z.string(),
  educationLevel: z.enum(['10th', '12th', 'UG', 'PG']),
  data: z.union([
    z.object({
      level: z.literal('10th'),
      subjects: z.array(z.string()),
      board: z.string().optional(),
      stream: z.enum(['science', 'commerce', 'arts']).optional(),
      interests: z.array(z.string()),
      careerGoals: z.array(z.string()).optional(),
    }),
    z.object({
      level: z.literal('12th'),
      subjects: z.array(z.string()),
      board: z.string().optional(),
      stream: z.enum(['science', 'commerce', 'arts']),
      interests: z.array(z.string()),
      careerGoals: z.array(z.string()).optional(),
      preferredExams: z.array(z.string()).optional(),
    }),
    z.object({
      level: z.literal('UG'),
      currentCourse: z.string().optional(),
      year: z.number().min(1).max(4).optional(),
      subjects: z.array(z.string()),
      interests: z.array(z.string()),
      careerGoals: z.array(z.string()).optional(),
      preferredExams: z.array(z.string()).optional(),
      specialization: z.string().optional(),
    }),
    z.object({
      level: z.literal('PG'),
      currentCourse: z.string().optional(),
      year: z.number().min(1).max(2).optional(),
      subjects: z.array(z.string()),
      interests: z.array(z.string()),
      careerGoals: z.array(z.string()).optional(),
      preferredExams: z.array(z.string()).optional(),
      specialization: z.string().optional(),
      researchInterests: z.array(z.string()).optional(),
    }),
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Interest schema for Firestore
export const firestoreInterestSchema = z.object({
  id: z.string(),
  labelKey: z.string(),
  descriptionKey: z.string(),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  subjects: z.array(z.string()).optional(),
  careerPaths: z.array(z.string()).optional(),
  exams: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Course schema for Firestore
export const firestoreCourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  domains: z.array(z.string()).optional(),
  requiredLevel: z.array(z.enum(['10th', '12th', 'UG', 'PG'])).optional(),
  subjects: z.array(z.string()).optional(),
  duration: z.string().optional(),
  careerPaths: z.array(z.string()).optional(),
  exams: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  colleges: z.array(z.string()).optional(),
  syllabusUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Exam schema for Firestore
export const firestoreExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  eligibility: z.string(),
  subjects: z.array(z.string()).optional(),
  applicationWindow: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  examDate: z.date().optional(),
  resultDate: z.date().optional(),
  website: z.string().url().optional(),
  syllabusUrl: z.string().url().optional(),
  importance: z.enum(['high', 'medium', 'low']).default('medium'),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// College schema for Firestore
export const firestoreCollegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['government', 'private', 'autonomous']),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  website: z.string().url().optional(),
  courses: z.array(z.string()).optional(),
  exams: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  fees: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('INR'),
  }).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Recommendation schema for Firestore
export const firestoreRecommendationSchema = z.object({
  id: z.string(),
  uid: z.string(),
  educationLevel: z.enum(['10th', '12th', 'UG', 'PG']),
  interests: z.array(z.string()),
  courses: z.array(z.string()),
  exams: z.array(z.string()),
  colleges: z.array(z.string()).optional(),
  rationale: z.string(),
  confidence: z.number().min(0).max(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Timeline item schema for Firestore
export const firestoreTimelineItemSchema = z.object({
  id: z.string(),
  scope: z.enum(['national', 'user']),
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  category: z.enum(['exam', 'application', 'counselling', 'result']),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  link: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Saved item schema for Firestore
export const firestoreSavedItemSchema = z.object({
  id: z.string(),
  uid: z.string(),
  type: z.enum(['course', 'exam', 'college', 'scholarship', 'job', 'material']),
  itemId: z.string(),
  itemData: z.record(z.any()),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Scholarship schema for Firestore
export const firestoreScholarshipSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  amount: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('INR'),
  }),
  eligibility: z.object({
    educationLevel: z.array(z.enum(['10th', '12th', 'UG', 'PG'])),
    incomeLimit: z.number().optional(),
    category: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
  }),
  applicationDeadline: z.date(),
  website: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Job schema for Firestore
export const firestoreJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  location: z.string(),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('INR'),
  }).optional(),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract']),
  level: z.enum(['entry', 'mid', 'senior', 'executive']),
  educationLevel: z.array(z.enum(['10th', '12th', 'UG', 'PG'])),
  applicationDeadline: z.date().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Study material schema for Firestore
export const firestoreStudyMaterialSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['ebook', 'course', 'video', 'document']),
  level: z.enum(['10th', '12th', 'UG', 'PG']),
  subjects: z.array(z.string()),
  url: z.string().url(),
  fileSize: z.number().optional(),
  duration: z.number().optional(), // in minutes
  language: z.enum(['en', 'hi', 'kn']).default('en'),
  isFree: z.boolean().default(true),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Export types
export type FirestoreUserProfile = z.infer<typeof firestoreUserProfileSchema>
export type FirestoreEducationData = z.infer<typeof firestoreEducationDataSchema>
export type FirestoreInterest = z.infer<typeof firestoreInterestSchema>
export type FirestoreCourse = z.infer<typeof firestoreCourseSchema>
export type FirestoreExam = z.infer<typeof firestoreExamSchema>
export type FirestoreCollege = z.infer<typeof firestoreCollegeSchema>
export type FirestoreRecommendation = z.infer<typeof firestoreRecommendationSchema>
export type FirestoreTimelineItem = z.infer<typeof firestoreTimelineItemSchema>
export type FirestoreSavedItem = z.infer<typeof firestoreSavedItemSchema>
export type FirestoreScholarship = z.infer<typeof firestoreScholarshipSchema>
export type FirestoreJob = z.infer<typeof firestoreJobSchema>
export type FirestoreStudyMaterial = z.infer<typeof firestoreStudyMaterialSchema>
