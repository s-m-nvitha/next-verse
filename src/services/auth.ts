import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { COLLECTIONS } from '@/lib/firestore-schemas'
import type { FirestoreUserProfile } from '@/lib/firestore-schemas'

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

// Auth error types
export interface AuthError {
  code: string
  message: string
}

// Auth result interface
export interface AuthResult {
  user: User | null
  error: AuthError | null
  success: boolean
}

// Google provider
const googleProvider = new GoogleAuthProvider()

// Email/Password Authentication
export class EmailAuth {
  static async signUp(email: string, password: string, displayName?: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName })
      }

      // Create user profile in Firestore
      await this.createUserProfile(user, { displayName })

      return {
        user,
        error: null,
        success: true,
      }
    } catch (error: any) {
      return {
        user: null,
        error: {
          code: error.code,
          message: error.message,
        },
        success: false,
      }
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update last login time — fire-and-forget, never block auth flow
      this.updateLastLogin(user.uid).catch(() => {})

      return {
        user,
        error: null,
        success: true,
      }
    } catch (error: any) {
      return {
        user: null,
        error: {
          code: error.code,
          message: error.message,
        },
        success: false,
      }
    }
  }

  static async resetPassword(email: string): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      await sendPasswordResetEmail(auth, email)
      return {
        success: true,
        error: null,
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          code: 'profile-creation-failed',
          message: error instanceof Error ? error.message : 'Failed to create user profile',
        },
      }
    }
  }

  static async createUserProfile(user: User, additionalData?: any) {
    const safeAdditional = stripUndefined(additionalData ?? {}) as Record<string, unknown>
    const displayName = user.displayName || (typeof safeAdditional.displayName === 'string' ? safeAdditional.displayName : '') || ''

    const userProfile = stripUndefined({
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      ...safeAdditional,
      // Keep computed displayName last so it can't be overwritten by undefined
      displayName,
    })
    
    await setDoc(doc(db, 'users', user.uid), userProfile)
    return userProfile
  }

  static async updateLastLogin(uid: string) {
    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        lastLoginAt: new Date(),
      },
      { merge: true }
    )
  }
}

// Google Authentication
export class GoogleAuth {
  static async signIn(): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, googleProvider)
      const user = userCredential.user

      // Check if user profile exists, create if not
      const userProfile = await this.getUserProfile(user.uid)
      if (!userProfile) {
        await this.createUserProfile(user)
      } else {
        await this.updateLastLogin(user.uid)
      }

      return {
        user,
        error: null,
        success: true,
      }
    } catch (error: any) {
      return {
        user: null,
        error: {
          code: error.code,
          message: error.message,
        },
        success: false,
      }
    }
  }

  static async getUserProfile(uid: string) {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  }

  static async createUserProfile(user: User) {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }
    
    await setDoc(doc(db, 'users', user.uid), userProfile)
    return userProfile
  }

  static async updateLastLogin(uid: string) {
    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        lastLoginAt: new Date(),
      },
      { merge: true }
    )
  }
}

// Phone Authentication (for future implementation)
export class PhoneAuth {
  static async sendOTP(_phoneNumber: string): Promise<{ success: boolean; error: AuthError | null }> {
    // Implementation for phone authentication
    // This would require additional setup with Firebase Phone Auth
    return {
      success: false,
      error: {
        code: 'not-implemented',
        message: 'Phone authentication not implemented yet',
      },
    }
  }
}

// User Profile Management
export class UserProfileService {
  static async createUserProfile(user: User, additionalData?: { displayName?: string }): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      const userProfile: Omit<FirestoreUserProfile, 'createdAt' | 'updatedAt'> = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData?.displayName || '',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || '',
        role: 'student', // Default role
        language: 'en', // Default language
        isActive: true,
      }

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return {
        success: true,
        error: null,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  static async getUserProfile(uid: string): Promise<{ data: FirestoreUserProfile | null; error: AuthError | null }> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          data: docSnap.data() as FirestoreUserProfile,
          error: null,
        }
      } else {
        return {
          data: null,
          error: {
            code: 'not-found',
            message: 'User profile not found',
          },
        }
      }
    } catch (error: any) {
      return {
        data: null,
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  static async updateUserProfile(uid: string, data: Partial<FirestoreUserProfile>): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      }, { merge: true })

      return {
        success: true,
        error: null,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  static async updateLastLogin(uid: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      await setDoc(docRef, {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }
}

// Sign Out
export async function signOutUser(): Promise<{ success: boolean; error: AuthError | null }> {
  try {
    await signOut(auth)
    return {
      success: true,
      error: null,
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

// Auth state listener
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback)
}

// Classes are already exported above
