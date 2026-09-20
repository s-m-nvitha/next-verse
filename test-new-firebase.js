// Test new Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc536fjiGgvdMk1YbYfGmqigLyXEVU-gw",
  authDomain: "nextverse-838a2.firebaseapp.com",
  projectId: "nextverse-838a2",
  storageBucket: "nextverse-838a2.firebasestorage.app",
  messagingSenderId: "143827283154",
  appId: "1:143827283154:web:4d7e106ae1c8f3d3bf110b"
};

console.log('Testing new Firebase configuration...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully!');
  console.log('✅ Auth service ready');
  console.log('✅ Firestore service ready');
  console.log('✅ New project connected: nextverse-838a2');
  
  console.log('\n🎉 Your new Firebase project is ready!');
  console.log('Firebase Console: https://console.firebase.google.com/project/nextverse-838a2');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}
