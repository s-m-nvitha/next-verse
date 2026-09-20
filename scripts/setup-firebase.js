#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔥 Setting up Firebase for NEXTVERSE...\n')

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' })
  console.log('✅ Firebase CLI is installed')
} catch (error) {
  console.log('❌ Firebase CLI is not installed')
  console.log('Please install Firebase CLI: npm install -g firebase-tools')
  process.exit(1)
}

// Check if user is logged in
try {
  execSync('firebase projects:list', { stdio: 'ignore' })
  console.log('✅ Firebase CLI is authenticated')
} catch (error) {
  console.log('❌ Firebase CLI is not authenticated')
  console.log('Please run: firebase login')
  process.exit(1)
}

// Initialize Firebase project
try {
  console.log('\n📁 Initializing Firebase project...')
  
  // Check if firebase.json exists
  if (!fs.existsSync('firebase.json')) {
    execSync('firebase init', { stdio: 'inherit' })
  } else {
    console.log('✅ Firebase project already initialized')
  }
  
  console.log('✅ Firebase project initialized')
} catch (error) {
  console.log('❌ Error initializing Firebase project:', error.message)
  process.exit(1)
}

// Install Firebase emulator
try {
  console.log('\n🔧 Installing Firebase emulator...')
  execSync('firebase setup:emulators:firestore', { stdio: 'inherit' })
  execSync('firebase setup:emulators:auth', { stdio: 'inherit' })
  execSync('firebase setup:emulators:storage', { stdio: 'inherit' })
  execSync('firebase setup:emulators:functions', { stdio: 'inherit' })
  
  console.log('✅ Firebase emulator installed')
} catch (error) {
  console.log('❌ Error installing Firebase emulator:', error.message)
  process.exit(1)
}

// Create .env.local file if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env.local file...')
  
  const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Emulator (Development)
VITE_FIREBASE_EMULATOR_AUTH_PORT=9099
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=8080
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=5001
VITE_FIREBASE_EMULATOR_STORAGE_PORT=9199
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env.local file created')
  console.log('⚠️  Please update the Firebase configuration in .env.local')
} else {
  console.log('✅ .env.local file already exists')
}

// Create firebase.json if it doesn't exist
const firebaseJsonPath = path.join(process.cwd(), 'firebase.json')
if (!fs.existsSync(firebaseJsonPath)) {
  console.log('\n📄 Creating firebase.json...')
  
  const firebaseJson = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "storage": {
      "rules": "storage.rules"
    },
    "emulators": {
      "auth": {
        "port": 9099
      },
      "firestore": {
        "port": 8080
      },
      "storage": {
        "port": 9199
      },
      "functions": {
        "port": 5001
      },
      "ui": {
        "enabled": true,
        "port": 4000
      }
    }
  }
  
  fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2))
  console.log('✅ firebase.json created')
}

// Create firestore.indexes.json if it doesn't exist
const firestoreIndexesPath = path.join(process.cwd(), 'firestore.indexes.json')
if (!fs.existsSync(firestoreIndexesPath)) {
  console.log('\n📊 Creating firestore.indexes.json...')
  
  const firestoreIndexes = {
    "indexes": [
      {
        "collectionGroup": "interests",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "courses",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "exams",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "examDate",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "colleges",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "timeline",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "date",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "scholarships",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "eligibility.educationLevel",
            "arrayConfig": "CONTAINS"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "jobs",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "educationLevel",
            "arrayConfig": "CONTAINS"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "studyMaterials",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "level",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "isActive",
            "order": "ASCENDING"
          }
        ]
      }
    ],
    "fieldOverrides": []
  }
  
  fs.writeFileSync(firestoreIndexesPath, JSON.stringify(firestoreIndexes, null, 2))
  console.log('✅ firestore.indexes.json created')
}

console.log('\n🎉 Firebase setup completed!')
console.log('\n📋 Next steps:')
console.log('1. Update Firebase configuration in .env.local')
console.log('2. Run: npm run dev (to start development server)')
console.log('3. Run: firebase emulators:start (to start Firebase emulators)')
console.log('4. Run: npm run seed-data (to populate Firestore with initial data)')
console.log('\n🔗 Useful links:')
console.log('- Firebase Console: https://console.firebase.google.com')
console.log('- Firebase Emulator UI: http://localhost:4000')
console.log('- Firestore Emulator: http://localhost:8080')
console.log('- Auth Emulator: http://localhost:9099')
