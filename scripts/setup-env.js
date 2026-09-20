#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up environment variables...\n')

const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDSYoSIbA96SGhHkIyeSeAn_FFy3BX-UFY
VITE_FIREBASE_AUTH_DOMAIN=nextverse-ae7dd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nextverse-ae7dd
VITE_FIREBASE_STORAGE_BUCKET=nextverse-ae7dd.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=335967648801
VITE_FIREBASE_APP_ID=1:335967648801:web:097e23431c015aa9bef760
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Emulator (Development)
VITE_FIREBASE_EMULATOR_AUTH_PORT=9099
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=8080
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=5001
VITE_FIREBASE_EMULATOR_STORAGE_PORT=9199

# Optional: Firebase Functions URL (if using custom functions)
VITE_FUNCTIONS_URL=https://your-region-nextverse-ae7dd.cloudfunctions.net

# Optional: Analytics and other services
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
`

const envPath = path.join(process.cwd(), '.env.local')

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists')
    console.log('📝 Please update it manually with the Firebase configuration above')
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env.local file created successfully!')
  }
  
  console.log('\n📋 Firebase Configuration:')
  console.log('Project ID: nextverse-ae7dd')
  console.log('Auth Domain: nextverse-ae7dd.firebaseapp.com')
  console.log('Storage Bucket: nextverse-ae7dd.firebasestorage.app')
  
  console.log('\n🚀 Next steps:')
  console.log('1. Install Firebase CLI: npm install -g firebase-tools')
  console.log('2. Login to Firebase: firebase login')
  console.log('3. Start emulators: npm run firebase:emulators')
  console.log('4. Start development: npm run dev')
  console.log('5. Seed data: npm run seed:all')
  
  console.log('\n🔗 Useful links:')
  console.log('- Firebase Console: https://console.firebase.google.com/project/nextverse-ae7dd')
  console.log('- Firebase Emulator UI: http://localhost:4000')
  console.log('- Your App: http://localhost:3000')
  
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message)
  console.log('\n📝 Please create .env.local manually with the following content:')
  console.log(envContent)
}

