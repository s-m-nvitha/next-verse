// Test Firebase configuration
import { auth, db } from './services/firebase'
import { collection, getDocs } from 'firebase/firestore'

console.log('Firebase Auth:', auth)
console.log('Firebase DB:', db)
console.log('Environment variables loaded:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

// Test Firestore connection
async function testFirestore() {
  try {
    const testCollection = collection(db, 'test')
    const snapshot = await getDocs(testCollection)
    console.log('Firestore connection successful!')
    console.log('Test collection documents:', snapshot.size)
  } catch (error) {
    console.error('Firestore connection failed:', error)
  }
}

testFirestore()
