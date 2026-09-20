#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🌱 Seeding Firestore with initial data...\n')

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' })
  console.log('✅ Firebase CLI is installed')
} catch (error) {
  console.log('❌ Firebase CLI is not installed')
  console.log('Please install Firebase CLI: npm install -g firebase-tools')
  process.exit(1)
}

// Check if Firebase emulators are running
try {
  execSync('firebase emulators:start --only firestore --detach', { stdio: 'ignore' })
  console.log('✅ Firebase emulators started')
} catch (error) {
  console.log('⚠️  Firebase emulators may already be running')
}

// Create a temporary seeding script
const seedScript = `
import { seedAllData } from './src/services/seed-data.ts'

async function main() {
  try {
    console.log('🌱 Starting data seeding...')
    await seedAllData()
    console.log('✅ Data seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

main()
`

// Write temporary seeding script
const tempSeedPath = path.join(process.cwd(), 'temp-seed.js')
fs.writeFileSync(tempSeedPath, seedScript)

try {
  console.log('📊 Seeding Firestore collections...')
  
  // Run the seeding script
  execSync('node temp-seed.js', { stdio: 'inherit' })
  
  console.log('✅ Data seeding completed successfully!')
} catch (error) {
  console.log('❌ Error seeding data:', error.message)
  process.exit(1)
} finally {
  // Clean up temporary file
  if (fs.existsSync(tempSeedPath)) {
    fs.unlinkSync(tempSeedPath)
  }
}

console.log('\n🎉 Firestore has been seeded with initial data!')
console.log('\n📋 Seeded collections:')
console.log('- interests (by education level)')
console.log('- courses (by education level)')
console.log('- exams (by education level)')
console.log('- colleges (by education level)')
console.log('- timeline (by education level)')
console.log('- scholarships (by education level)')
console.log('- jobs (by education level)')
console.log('- studyMaterials (by education level)')
console.log('\n🔗 You can view the data in Firebase Emulator UI: http://localhost:4000')
