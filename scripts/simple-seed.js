// Simple Firestore seeding script
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSYoSIbA96SGhHkIyeSeAn_FFy3BX-UFY",
  authDomain: "nextverse-ae7dd.firebaseapp.com",
  projectId: "nextverse-ae7dd",
  storageBucket: "nextverse-ae7dd.firebasestorage.app",
  messagingSenderId: "335967648801",
  appId: "1:335967648801:web:097e23431c015aa9bef760"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Basic data structure for your app
const basicData = {
  interests: [
    { id: 'science', name: 'Science', category: 'academic', level: '10th' },
    { id: 'mathematics', name: 'Mathematics', category: 'academic', level: '10th' },
    { id: 'engineering', name: 'Engineering', category: 'career', level: '12th' },
    { id: 'medicine', name: 'Medicine', category: 'career', level: '12th' }
  ],
  courses: [
    { id: 'class-10', name: 'Class 10 CBSE', level: '10th', subjects: ['Math', 'Science'] },
    { id: 'jee-prep', name: 'JEE Preparation', level: '12th', subjects: ['Physics', 'Chemistry', 'Math'] }
  ],
  exams: [
    { id: 'cbse-10', name: 'CBSE Class 10', level: '10th', date: '2024-03-15' },
    { id: 'jee-main', name: 'JEE Main', level: '12th', date: '2024-04-15' }
  ]
};

async function seedBasicData() {
  try {
    console.log('Seeding basic data to Firestore...');
    
    // Add interests
    for (const interest of basicData.interests) {
      await addDoc(collection(db, 'interests'), interest);
      console.log(`Added interest: ${interest.name}`);
    }
    
    // Add courses
    for (const course of basicData.courses) {
      await addDoc(collection(db, 'courses'), course);
      console.log(`Added course: ${course.name}`);
    }
    
    // Add exams
    for (const exam of basicData.exams) {
      await addDoc(collection(db, 'exams'), exam);
      console.log(`Added exam: ${exam.name}`);
    }
    
    console.log('✅ Basic data seeded successfully!');
    console.log('You can now view your data in the Firebase Console:');
    console.log('https://console.firebase.google.com/project/nextverse-ae7dd/firestore');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.log('This might be due to authentication requirements.');
    console.log('You can manually add data through the Firebase Console.');
  }
}

seedBasicData();
