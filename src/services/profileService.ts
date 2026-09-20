import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import type { CareerDomainId, UserQuestionnaire, UserProfile } from '@/lib/validators'

const stripUndefined = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as T
  }

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue
      out[k] = stripUndefined(v)
    }
    return out as T
  }

  return value
}

export const saveUserQuestionnaire = async (args: {
  uid: string
  questionnaire: UserQuestionnaire
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  const questionnaire = stripUndefined(args.questionnaire)
  await setDoc(
    ref,
    {
      uid: args.uid,
      questionnaire,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const saveSelectedCareerDomain = async (args: {
  uid: string
  selectedCareerDomain: CareerDomainId
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  await setDoc(
    ref,
    {
      uid: args.uid,
      selectedCareerDomain: args.selectedCareerDomain,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const saveStudentDetails = async (args: {
  uid: string
  studentDetails: NonNullable<UserProfile['studentDetails']>
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  const studentDetails = stripUndefined(args.studentDetails)
  await setDoc(
    ref,
    {
      uid: args.uid,
      studentDetails,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const saveEducationInfo = async (args: {
  uid: string
  educationInfo: NonNullable<UserProfile['educationInfo']>
  educationLevel: NonNullable<UserProfile['educationLevel']>
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  const educationInfo = stripUndefined(args.educationInfo)
  await setDoc(
    ref,
    {
      uid: args.uid,
      educationLevel: args.educationLevel,
      educationInfo,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const saveInterestAssessment = async (args: {
  uid: string
  interestAssessment: NonNullable<UserProfile['interestAssessment']>
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  const interestAssessment = stripUndefined(args.interestAssessment)
  await setDoc(
    ref,
    {
      uid: args.uid,
      interestAssessment,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const saveRecommendationSelections = async (args: {
  uid: string
  selectedDomainId?: string
  selectedCourseId?: string
  selectedExamIds?: string[]
  savedCollegeIds?: string[]
}): Promise<void> => {
  const ref = doc(db, 'users', args.uid)
  await setDoc(
    ref,
    stripUndefined({
      uid: args.uid,
      selectedDomainId: args.selectedDomainId,
      selectedCourseId: args.selectedCourseId,
      selectedExamIds: args.selectedExamIds,
      savedCollegeIds: args.savedCollegeIds,
      updatedAt: serverTimestamp(),
    }),
    { merge: true }
  )
}
