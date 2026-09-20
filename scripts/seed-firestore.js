import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSYoSIbA96SGhHkIyeSeAn_FFy3BX-UFY",
  authDomain: "nextverse-ae7dd.firebaseapp.com",
  projectId: "nextverse-ae7dd",
  storageBucket: "nextverse-ae7dd.firebasestorage.app",
  messagingSenderId: "335967648801",
  appId: "1:335967648801:web:097e23431c015aa9bef760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sample data for seeding
const sampleInterests = [
  {
    id: 'science',
    labelKey: 'interests.science',
    descriptionKey: 'interests.science.description',
    category: 'academic',
    level: '10th'
  },
  {
    id: 'mathematics',
    labelKey: 'interests.mathematics',
    descriptionKey: 'interests.mathematics.description',
    category: 'academic',
    level: '10th'
  },
  {
    id: 'engineering',
    labelKey: 'interests.engineering',
    descriptionKey: 'interests.engineering.description',
    category: 'career',
    level: '12th'
  },
  {
    id: 'medicine',
    labelKey: 'interests.medicine',
    descriptionKey: 'interests.medicine.description',
    category: 'career',
    level: '12th'
  }
];

const sampleCourses = [
  {
    id: 'class-10-cbse',
    name: 'Class 10 CBSE',
    description: 'Complete CBSE Class 10 curriculum',
    level: '10th',
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies'],
    duration: '1 year',
    difficulty: 'beginner'
  },
  {
    id: 'jee-preparation',
    name: 'JEE Main Preparation',
    description: 'Comprehensive JEE Main preparation course',
    level: '12th',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    duration: '2 years',
    difficulty: 'advanced'
  }
];

const sampleExams = [
  {
    id: 'cbse-10th',
    name: 'CBSE Class 10 Board Exam',
    description: 'Central Board of Secondary Education Class 10 examination',
    level: '10th',
    eligibility: 'Class 10 students',
    applicationWindow: {
      start: new Date('2024-01-01'),
      end: new Date('2024-02-28')
    },
    examDate: new Date('2024-03-15')
  },
  {
    id: 'jee-main',
    name: 'JEE Main',
    description: 'Joint Entrance Examination Main',
    level: '12th',
    eligibility: 'Class 12 passed students',
    applicationWindow: {
      start: new Date('2024-11-01'),
      end: new Date('2024-12-31')
    },
    examDate: new Date('2025-01-15')
  }
];

async function seedData() {
  try {
    console.log('Starting data seeding...');
    
    // Sign in anonymously for seeding
    await signInAnonymously(auth);
    console.log('Authenticated for seeding');

    // Seed interests
    console.log('Seeding interests...');
    for (const interest of sampleInterests) {
      await addDoc(collection(db, 'catalogs/interests/items'), interest);
    }

    // Seed courses
    console.log('Seeding courses...');
    for (const course of sampleCourses) {
      await addDoc(collection(db, 'catalogs/courses/items'), course);
    }

    // Seed exams
    console.log('Seeding exams...');
    for (const exam of sampleExams) {
      await addDoc(collection(db, 'catalogs/exams/items'), exam);
    }

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
