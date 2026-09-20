// Test Firestore connection
import { db } from './services/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

console.log('Testing Firestore connection...')

async function testFirestoreConnection() {
  try {
    // Test reading from a collection
    const testCollection = collection(db, 'test')
    const snapshot = await getDocs(testCollection)
    console.log('✅ Firestore connection successful!')
    console.log(`Found ${snapshot.size} documents in test collection`)

    // Test writing a document
    const testDoc = {
      message: 'Hello from NEXT VERSE!',
      timestamp: new Date(),
      test: true
    }

    const docRef = await addDoc(collection(db, 'test'), testDoc)
    console.log('✅ Document written successfully!')
    console.log('Document ID:', docRef.id)

    return true
  } catch (error) {
    console.error('❌ Firestore connection failed:', error)
    return false
  }
}

// Run the test
testFirestoreConnection().then(success => {
  if (success) {
    console.log('\n🎉 Firestore is ready for your NEXT VERSE app!')
    console.log('You can now:')
    console.log('- Store user profiles')
    console.log('- Save quiz results')
    console.log('- Manage education data')
    console.log('- Track user progress')
  } else {
    console.log('\n⚠️  Please check your Firebase configuration')
    console.log('Make sure your Firestore database is created and accessible')
  }
})
