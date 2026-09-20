import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import { COLLECTIONS } from '@/lib/firestore-schemas'
import type {
  FirestoreInterest,
  FirestoreCourse,
  FirestoreExam,
  FirestoreCollege,
  FirestoreTimelineItem,
  FirestoreScholarship,
  FirestoreJob,
  FirestoreStudyMaterial,
} from '@/lib/firestore-schemas'

// Seed data for interests
export const seedInterests = async (): Promise<void> => {
  const interestsData: Omit<FirestoreInterest, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // 10th Grade Interests
    {
      labelKey: 'interests.science',
      descriptionKey: 'interests.scienceDescription',
      level: '10th',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
      careerPaths: ['Engineering', 'Medicine', 'Research', 'Teaching'],
      isActive: true,
    },
    {
      labelKey: 'interests.commerce',
      descriptionKey: 'interests.commerceDescription',
      level: '10th',
      subjects: ['Mathematics', 'Economics', 'Business Studies'],
      careerPaths: ['Business', 'Finance', 'Accounting', 'Management'],
      isActive: true,
    },
    {
      labelKey: 'interests.arts',
      descriptionKey: 'interests.artsDescription',
      level: '10th',
      subjects: ['History', 'Geography', 'Political Science', 'Literature'],
      careerPaths: ['Journalism', 'Law', 'Social Work', 'Public Administration'],
      isActive: true,
    },
    // 12th Grade Interests
    {
      labelKey: 'interests.sciencePCM',
      descriptionKey: 'interests.sciencePCMDescription',
      level: '12th',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      careerPaths: ['Engineering', 'Architecture', 'Defense', 'Research'],
      exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEE'],
      isActive: true,
    },
    {
      labelKey: 'interests.sciencePCB',
      descriptionKey: 'interests.sciencePCBDescription',
      level: '12th',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      careerPaths: ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Veterinary'],
      exams: ['NEET', 'AIIMS', 'JIPMER', 'AIIMS Nursing', 'BHU Nursing'],
      isActive: true,
    },
    // UG Interests
    {
      labelKey: 'interests.engineering',
      descriptionKey: 'interests.engineeringDescription',
      level: 'UG',
      subjects: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics'],
      careerPaths: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Research'],
      exams: ['GATE', 'CAT', 'GRE', 'TOEFL', 'IELTS'],
      isActive: true,
    },
    {
      labelKey: 'interests.medicine',
      descriptionKey: 'interests.medicineDescription',
      level: 'UG',
      subjects: ['MBBS', 'BDS', 'B.Pharm', 'B.Sc Nursing', 'Physiotherapy'],
      careerPaths: ['Doctor', 'Dentist', 'Pharmacist', 'Nurse', 'Physiotherapist'],
      exams: ['NEET PG', 'AIIMS PG', 'JIPMER PG', 'USMLE', 'PLAB'],
      isActive: true,
    },
    // PG Interests
    {
      labelKey: 'interests.engineering',
      descriptionKey: 'interests.engineeringDescription',
      level: 'PG',
      subjects: ['Computer Science', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud Computing'],
      careerPaths: ['Senior Software Engineer', 'Tech Lead', 'Data Scientist', 'Research Scientist', 'Entrepreneur'],
      exams: ['GATE', 'GRE', 'TOEFL', 'IELTS', 'GMAT'],
      isActive: true,
    },
    {
      labelKey: 'interests.medicine',
      descriptionKey: 'interests.medicineDescription',
      level: 'PG',
      subjects: ['MD', 'MS', 'MDS', 'M.Pharm', 'M.Sc Nursing'],
      careerPaths: ['Specialist Doctor', 'Surgeon', 'Researcher', 'Medical Professor', 'Healthcare Administrator'],
      exams: ['NEET PG', 'AIIMS PG', 'JIPMER PG', 'USMLE', 'PLAB'],
      isActive: true,
    },
  ]

  for (const interest of interestsData) {
    await addDoc(collection(db, COLLECTIONS.INTERESTS), {
      ...interest,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for courses
export const seedCourses = async (): Promise<void> => {
  const coursesData: Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // 10th Grade Courses
    {
      name: 'Science Foundation Course',
      description: 'Basic science concepts for 10th grade students',
      level: '10th',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
      duration: '1 year',
      careerPaths: ['11th Science', 'Polytechnic', 'ITI'],
      isActive: true,
    },
    {
      name: 'Commerce Foundation Course',
      description: 'Basic commerce concepts for 10th grade students',
      level: '10th',
      subjects: ['Mathematics', 'Economics', 'Business Studies'],
      duration: '1 year',
      careerPaths: ['11th Commerce', 'Diploma in Commerce', 'Banking'],
      isActive: true,
    },
    // 12th Grade Courses
    {
      name: 'Science (PCM) Stream',
      description: 'Physics, Chemistry, Mathematics stream for engineering aspirants',
      level: '12th',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      duration: '2 years',
      careerPaths: ['Engineering', 'Architecture', 'Defense', 'Research'],
      exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEE'],
      colleges: ['IITs', 'NITs', 'IIITs', 'Private Engineering Colleges'],
      isActive: true,
    },
    // UG Courses
    {
      name: 'Bachelor of Technology (B.Tech)',
      description: 'Undergraduate engineering program',
      level: 'UG',
      subjects: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Aerospace'],
      duration: '4 years',
      careerPaths: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Research', 'Entrepreneur'],
      exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEE'],
      colleges: ['IITs', 'NITs', 'IIITs', 'BITS', 'Private Engineering Colleges'],
      isActive: true,
    },
    {
      name: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
      description: 'Undergraduate medical program',
      level: 'UG',
      subjects: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      duration: '5.5 years',
      careerPaths: ['Doctor', 'Surgeon', 'Specialist', 'Researcher', 'Medical Professor'],
      exams: ['NEET', 'AIIMS', 'JIPMER', 'AIIMS Nursing', 'BHU Nursing'],
      colleges: ['AIIMS', 'JIPMER', 'Government Medical Colleges', 'Private Medical Colleges'],
      isActive: true,
    },
    // PG Courses
    {
      name: 'Master of Technology (M.Tech)',
      description: 'Postgraduate engineering program',
      level: 'PG',
      subjects: ['Computer Science', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud Computing', 'IoT'],
      duration: '2 years',
      careerPaths: ['Senior Software Engineer', 'Tech Lead', 'Data Scientist', 'Research Scientist', 'Entrepreneur'],
      exams: ['GATE', 'GRE', 'TOEFL', 'IELTS', 'GMAT'],
      colleges: ['IITs', 'NITs', 'IIITs', 'BITS', 'Private Engineering Colleges'],
      isActive: true,
    },
  ]

  for (const course of coursesData) {
    await addDoc(collection(db, COLLECTIONS.COURSES), {
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for exams
export const seedExams = async (): Promise<void> => {
  const examsData: Omit<FirestoreExam, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // 10th Grade Exams
    {
      name: '10th Board Examination',
      description: 'Secondary School Certificate examination',
      level: '10th',
      eligibility: 'Class 10th students',
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi/Regional Language'],
      applicationWindow: {
        start: new Date('2024-01-01'),
        end: new Date('2024-02-28'),
      },
      examDate: new Date('2024-03-15'),
      resultDate: new Date('2024-05-31'),
      website: 'https://cbse.gov.in',
      importance: 'high',
      isActive: true,
    },
    {
      name: 'National Talent Search Examination (NTSE)',
      description: 'National level scholarship examination for class 10th students',
      level: '10th',
      eligibility: 'Class 10th students with minimum 60% marks',
      subjects: ['Mental Ability Test', 'Scholastic Aptitude Test'],
      applicationWindow: {
        start: new Date('2024-01-01'),
        end: new Date('2024-02-15'),
      },
      examDate: new Date('2024-04-15'),
      resultDate: new Date('2024-06-30'),
      website: 'https://ncert.nic.in',
      importance: 'high',
      isActive: true,
    },
    // 12th Grade Exams
    {
      name: 'JEE Main',
      description: 'Joint Entrance Examination Main for engineering admissions',
      level: '12th',
      eligibility: 'Class 12th with Physics, Chemistry, Mathematics',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      applicationWindow: {
        start: new Date('2024-01-01'),
        end: new Date('2024-02-28'),
      },
      examDate: new Date('2024-04-15'),
      resultDate: new Date('2024-05-31'),
      website: 'https://jeemain.nta.ac.in',
      importance: 'high',
      isActive: true,
    },
    {
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test for medical admissions',
      level: '12th',
      eligibility: 'Class 12th with Physics, Chemistry, Biology',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      applicationWindow: {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      },
      examDate: new Date('2024-05-05'),
      resultDate: new Date('2024-06-15'),
      website: 'https://neet.nta.nic.in',
      importance: 'high',
      isActive: true,
    },
    // UG Exams
    {
      name: 'GATE',
      description: 'Graduate Aptitude Test in Engineering for postgraduate admissions',
      level: 'UG',
      eligibility: 'Bachelor\'s degree in Engineering/Technology',
      subjects: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics'],
      applicationWindow: {
        start: new Date('2024-08-01'),
        end: new Date('2024-09-30'),
      },
      examDate: new Date('2024-02-15'),
      resultDate: new Date('2024-03-15'),
      website: 'https://gate.iitk.ac.in',
      importance: 'high',
      isActive: true,
    },
    // PG Exams
    {
      name: 'NEET PG',
      description: 'National Eligibility cum Entrance Test for postgraduate medical admissions',
      level: 'PG',
      eligibility: 'MBBS degree with minimum 50% marks',
      subjects: ['Pre-Clinical', 'Para-Clinical', 'Clinical'],
      applicationWindow: {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      },
      examDate: new Date('2024-05-15'),
      resultDate: new Date('2024-06-30'),
      website: 'https://neetpg.nta.nic.in',
      importance: 'high',
      isActive: true,
    },
  ]

  for (const exam of examsData) {
    await addDoc(collection(db, COLLECTIONS.EXAMS), {
      ...exam,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for colleges
export const seedColleges = async (): Promise<void> => {
  const collegesData: Omit<FirestoreCollege, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Indian Institute of Technology Delhi',
      type: 'government',
      level: 'UG',
      location: {
        lat: 28.5454,
        lng: 77.1923,
        address: 'Hauz Khas, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
      },
      website: 'https://iitd.ac.in',
      courses: ['B.Tech', 'M.Tech', 'PhD'],
      exams: ['JEE Advanced', 'GATE'],
      facilities: ['Library', 'Hostel', 'Sports Complex', 'Research Labs'],
      fees: {
        min: 200000,
        max: 300000,
        currency: 'INR',
      },
      isActive: true,
    },
    {
      name: 'All India Institute of Medical Sciences',
      type: 'government',
      level: 'UG',
      location: {
        lat: 28.5679,
        lng: 77.2114,
        address: 'Ansari Nagar, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
      },
      website: 'https://aiims.edu',
      courses: ['MBBS', 'MD', 'MS', 'PhD'],
      exams: ['NEET', 'NEET PG'],
      facilities: ['Hospital', 'Library', 'Hostel', 'Research Labs'],
      fees: {
        min: 50000,
        max: 100000,
        currency: 'INR',
      },
      isActive: true,
    },
  ]

  for (const college of collegesData) {
    await addDoc(collection(db, COLLECTIONS.COLLEGES), {
      ...college,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for timeline
export const seedTimeline = async (): Promise<void> => {
  const timelineData: Omit<FirestoreTimelineItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      scope: 'national',
      title: 'JEE Main 2024 Registration',
      description: 'Registration for JEE Main 2024 begins',
      date: new Date('2024-01-01'),
      category: 'application',
      level: '12th',
      link: 'https://jeemain.nta.ac.in',
      isActive: true,
    },
    {
      scope: 'national',
      title: 'NEET 2024 Registration',
      description: 'Registration for NEET 2024 begins',
      date: new Date('2024-02-01'),
      category: 'application',
      level: '12th',
      link: 'https://neet.nta.nic.in',
      isActive: true,
    },
    {
      scope: 'national',
      title: 'GATE 2024 Registration',
      description: 'Registration for GATE 2024 begins',
      date: new Date('2024-08-01'),
      category: 'application',
      level: 'UG',
      link: 'https://gate.iitk.ac.in',
      isActive: true,
    },
  ]

  for (const item of timelineData) {
    await addDoc(collection(db, COLLECTIONS.TIMELINE), {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for scholarships
export const seedScholarships = async (): Promise<void> => {
  const scholarshipsData: Omit<FirestoreScholarship, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'National Scholarship Portal',
      description: 'Government scholarship for students from economically weaker sections',
      provider: 'Government of India',
      amount: {
        min: 10000,
        max: 50000,
        currency: 'INR',
      },
      eligibility: {
        educationLevel: ['10th', '12th', 'UG', 'PG'],
        incomeLimit: 250000,
        category: ['General', 'OBC', 'SC', 'ST'],
        location: ['All India'],
      },
      applicationDeadline: new Date('2024-12-31'),
      website: 'https://scholarships.gov.in',
      isActive: true,
    },
    {
      name: 'Merit Scholarship',
      description: 'Scholarship for meritorious students',
      provider: 'Private Foundation',
      amount: {
        min: 25000,
        max: 100000,
        currency: 'INR',
      },
      eligibility: {
        educationLevel: ['12th', 'UG', 'PG'],
        category: ['General'],
        location: ['All India'],
      },
      applicationDeadline: new Date('2024-11-30'),
      website: 'https://meritscholarship.org',
      isActive: true,
    },
  ]

  for (const scholarship of scholarshipsData) {
    await addDoc(collection(db, COLLECTIONS.SCHOLARSHIPS), {
      ...scholarship,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for jobs
export const seedJobs = async (): Promise<void> => {
  const jobsData: Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Full-stack development role',
      requirements: ['B.Tech in Computer Science', '2+ years experience', 'JavaScript, React, Node.js'],
      location: 'Bangalore',
      salary: {
        min: 600000,
        max: 1200000,
        currency: 'INR',
      },
      type: 'full-time',
      level: 'mid',
      educationLevel: ['UG', 'PG'],
      applicationDeadline: new Date('2024-12-31'),
      website: 'https://techcorp.com/careers',
      isActive: true,
    },
    {
      title: 'Data Science Intern',
      company: 'Data Analytics Inc',
      description: 'Internship in data science and machine learning',
      requirements: ['B.Tech/M.Tech in relevant field', 'Python, R, SQL', 'Machine Learning knowledge'],
      location: 'Mumbai',
      salary: {
        min: 15000,
        max: 25000,
        currency: 'INR',
      },
      type: 'internship',
      level: 'entry',
      educationLevel: ['UG', 'PG'],
      applicationDeadline: new Date('2024-11-30'),
      website: 'https://dataanalytics.com/careers',
      isActive: true,
    },
  ]

  for (const job of jobsData) {
    await addDoc(collection(db, COLLECTIONS.JOBS), {
      ...job,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Seed data for study materials
export const seedStudyMaterials = async (): Promise<void> => {
  const materialsData: Omit<FirestoreStudyMaterial, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'JEE Main Mathematics Complete Course',
      description: 'Comprehensive mathematics course for JEE Main preparation',
      type: 'course',
      level: '12th',
      subjects: ['Mathematics'],
      url: 'https://example.com/jee-math-course',
      fileSize: 1024000000, // 1GB
      duration: 1200, // 20 hours
      language: 'en',
      isFree: true,
      isActive: true,
    },
    {
      title: 'NEET Biology Study Guide',
      description: 'Complete biology study guide for NEET preparation',
      type: 'ebook',
      level: '12th',
      subjects: ['Biology'],
      url: 'https://example.com/neet-biology-guide',
      fileSize: 51200000, // 50MB
      language: 'en',
      isFree: true,
      isActive: true,
    },
    {
      title: 'GATE Computer Science Video Lectures',
      description: 'Video lectures for GATE Computer Science preparation',
      type: 'video',
      level: 'UG',
      subjects: ['Computer Science'],
      url: 'https://example.com/gate-cs-videos',
      duration: 1800, // 30 hours
      language: 'en',
      isFree: false,
      isActive: true,
    },
  ]

  for (const material of materialsData) {
    await addDoc(collection(db, COLLECTIONS.STUDY_MATERIALS), {
      ...material,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

// Main seeding function
export const seedAllData = async (): Promise<void> => {
  try {
    console.log('Starting data seeding...')
    
    await seedInterests()
    console.log('✓ Interests seeded')
    
    await seedCourses()
    console.log('✓ Courses seeded')
    
    await seedExams()
    console.log('✓ Exams seeded')
    
    await seedColleges()
    console.log('✓ Colleges seeded')
    
    await seedTimeline()
    console.log('✓ Timeline seeded')
    
    await seedScholarships()
    console.log('✓ Scholarships seeded')
    
    await seedJobs()
    console.log('✓ Jobs seeded')
    
    await seedStudyMaterials()
    console.log('✓ Study materials seeded')
    
    console.log('✅ All data seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}
