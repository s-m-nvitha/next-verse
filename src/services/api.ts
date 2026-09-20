import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { COLLECTIONS } from '@/lib/firestore-schemas'
import type {
  FirestoreUserProfile,
  FirestoreEducationData,
  FirestoreInterest,
  FirestoreCourse,
  FirestoreExam,
  FirestoreCollege,
  FirestoreRecommendation,
  FirestoreTimelineItem,
  FirestoreSavedItem,
  FirestoreScholarship,
  FirestoreJob,
  FirestoreStudyMaterial,
} from '@/lib/firestore-schemas'

// Generic API response type
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Pagination options
export interface PaginationOptions {
  limit?: number
  startAfter?: any
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// User API
export class UserAPI {
  static async getUserProfile(uid: string): Promise<ApiResponse<FirestoreUserProfile>> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          data: docSnap.data() as FirestoreUserProfile,
          error: null,
          success: true,
        }
      } else {
        return {
          data: null,
          error: 'User profile not found',
          success: false,
        }
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async updateUserProfile(uid: string, data: Partial<FirestoreUserProfile>): Promise<ApiResponse<FirestoreUserProfile>> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      
      const updatedDoc = await getDoc(docRef)
      return {
        data: updatedDoc.data() as FirestoreUserProfile,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Education Data API
export class EducationDataAPI {
  static async getEducationData(uid: string): Promise<ApiResponse<FirestoreEducationData>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.EDUCATION_DATA),
        where('uid', '==', uid)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return {
          data: doc.data() as FirestoreEducationData,
          error: null,
          success: true,
        }
      } else {
        return {
          data: null,
          error: 'Education data not found',
          success: false,
        }
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async saveEducationData(data: Omit<FirestoreEducationData, 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FirestoreEducationData>> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.EDUCATION_DATA), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      const newDoc = await getDoc(docRef)
      return {
        data: newDoc.data() as FirestoreEducationData,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Interests API
export class InterestsAPI {
  static async getInterestsByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreInterest[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.INTERESTS),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const interests = querySnapshot.docs.map(doc => doc.data() as FirestoreInterest)
      return {
        data: interests,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Courses API
export class CoursesAPI {
  static async getCoursesByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreCourse[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COURSES),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const courses = querySnapshot.docs.map(doc => doc.data() as FirestoreCourse)
      return {
        data: courses,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async getCoursesByInterests(interests: string[]): Promise<ApiResponse<FirestoreCourse[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COURSES),
        where('subjects', 'array-contains-any', interests),
        where('isActive', '==', true),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const courses = querySnapshot.docs.map(doc => doc.data() as FirestoreCourse)
      return {
        data: courses,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Exams API
export class ExamsAPI {
  static async getExamsByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreExam[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.EXAMS),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('examDate', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const exams = querySnapshot.docs.map(doc => doc.data() as FirestoreExam)
      return {
        data: exams,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async getUpcomingExams(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreExam[]>> {
    try {
      const now = new Date()
      const q = query(
        collection(db, COLLECTIONS.EXAMS),
        where('level', '==', level),
        where('isActive', '==', true),
        where('examDate', '>=', now),
        orderBy('examDate', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const exams = querySnapshot.docs.map(doc => doc.data() as FirestoreExam)
      return {
        data: exams,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Colleges API
export class CollegesAPI {
  static async getCollegesByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreCollege[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COLLEGES),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const colleges = querySnapshot.docs.map(doc => doc.data() as FirestoreCollege)
      return {
        data: colleges,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async getCollegesByLocation(lat: number, lng: number, radius: number = 50): Promise<ApiResponse<FirestoreCollege[]>> {
    try {
      // Note: This is a simplified implementation
      // For production, you'd want to use GeoFirestore or similar
      const q = query(
        collection(db, COLLECTIONS.COLLEGES),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const colleges = querySnapshot.docs.map(doc => doc.data() as FirestoreCollege)
      // Filter by distance (simplified)
      const nearbyColleges = colleges.filter(college => {
        const distance = calculateDistance(lat, lng, college.location.lat, college.location.lng)
        return distance <= radius
      })
      
      return {
        data: nearbyColleges,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Recommendations API
export class RecommendationsAPI {
  static async getRecommendations(uid: string): Promise<ApiResponse<FirestoreRecommendation[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.RECOMMENDATIONS),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      const recommendations = querySnapshot.docs.map(doc => doc.data() as FirestoreRecommendation)
      return {
        data: recommendations,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async saveRecommendation(data: Omit<FirestoreRecommendation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FirestoreRecommendation>> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.RECOMMENDATIONS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      const newDoc = await getDoc(docRef)
      return {
        data: newDoc.data() as FirestoreRecommendation,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Timeline API
export class TimelineAPI {
  static async getTimelineByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreTimelineItem[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.TIMELINE),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('date', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const timeline = querySnapshot.docs.map(doc => doc.data() as FirestoreTimelineItem)
      return {
        data: timeline,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async getUpcomingTimeline(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreTimelineItem[]>> {
    try {
      const now = new Date()
      const q = query(
        collection(db, COLLECTIONS.TIMELINE),
        where('level', '==', level),
        where('isActive', '==', true),
        where('date', '>=', now),
        orderBy('date', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const timeline = querySnapshot.docs.map(doc => doc.data() as FirestoreTimelineItem)
      return {
        data: timeline,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async createUserReminder(args: {
    title: string
    date: Date
    level: '10th' | '12th' | 'UG' | 'PG'
    description?: string
    link?: string
  }): Promise<ApiResponse<FirestoreTimelineItem>> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TIMELINE), {
        scope: 'user',
        title: args.title,
        description: args.description,
        date: args.date,
        category: 'exam',
        level: args.level,
        link: args.link,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      await updateDoc(docRef, { id: docRef.id })
      const newDoc = await getDoc(docRef)

      return {
        data: newDoc.data() as FirestoreTimelineItem,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Saved Items API
export class SavedItemsAPI {
  static async getSavedItems(uid: string, type?: string): Promise<ApiResponse<FirestoreSavedItem[]>> {
    try {
      let q = query(
        collection(db, COLLECTIONS.SAVED_ITEMS),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      )
      
      if (type) {
        q = query(q, where('type', '==', type))
      }
      
      const querySnapshot = await getDocs(q)
      const savedItems = querySnapshot.docs.map(doc => doc.data() as FirestoreSavedItem)
      
      return {
        data: savedItems,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async saveItem(data: Omit<FirestoreSavedItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FirestoreSavedItem>> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SAVED_ITEMS), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      const newDoc = await getDoc(docRef)
      return {
        data: newDoc.data() as FirestoreSavedItem,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  static async removeSavedItem(itemId: string): Promise<ApiResponse<boolean>> {
    try {
      const docRef = doc(db, COLLECTIONS.SAVED_ITEMS, itemId)
      await deleteDoc(docRef)
      
      return {
        data: true,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Scholarships API
export class ScholarshipsAPI {
  static async getScholarshipsByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreScholarship[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.SCHOLARSHIPS),
        where('eligibility.educationLevel', 'array-contains', level),
        where('isActive', '==', true),
        orderBy('applicationDeadline', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      const scholarships = querySnapshot.docs.map(doc => doc.data() as FirestoreScholarship)
      return {
        data: scholarships,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Jobs API
export class JobsAPI {
  static async getJobsByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreJob[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.JOBS),
        where('educationLevel', 'array-contains', level),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      const jobs = querySnapshot.docs.map(doc => doc.data() as FirestoreJob)
      return {
        data: jobs,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Study Materials API
export class StudyMaterialsAPI {
  static async getStudyMaterialsByLevel(level: '10th' | '12th' | 'UG' | 'PG'): Promise<ApiResponse<FirestoreStudyMaterial[]>> {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDY_MATERIALS),
        where('level', '==', level),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      const materials = querySnapshot.docs.map(doc => doc.data() as FirestoreStudyMaterial)
      return {
        data: materials,
        error: null,
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// Utility function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return distance
}
