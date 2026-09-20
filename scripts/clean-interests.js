// Clean up interests data to make it more readable
import fs from 'fs'
import path from 'path'

const seedDir = './public/seed'
const educationLevels = ['10th', '12th', 'ug', 'pg']

function cleanInterestData(interests) {
  return interests.map(interest => {
    // Create a clean, readable name
    let cleanName = interest.labelKey || interest.id || 'Unknown Interest'
    
    // Remove prefixes and clean up
    cleanName = cleanName
      .replace(/^interests\./, '')
      .replace(/\([^)]*\)/g, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim()
    
    // Create a simple description
    const cleanDescription = `Explore ${cleanName.toLowerCase()} and related career paths`
    
    // Create clean subjects array
    const cleanSubjects = interest.subjects && interest.subjects.length > 0 
      ? interest.subjects 
      : getDefaultSubjects(cleanName)
    
    // Create clean career paths
    const cleanCareerPaths = interest.careerPaths && interest.careerPaths.length > 0
      ? interest.careerPaths
      : getDefaultCareerPaths(cleanName)
    
    return {
      id: interest.id,
      name: cleanName,
      description: cleanDescription,
      level: interest.level,
      subjects: cleanSubjects,
      careerPaths: cleanCareerPaths,
      // Keep original keys for compatibility
      labelKey: `interests.${cleanName.toLowerCase().replace(/\s+/g, '')}`,
      descriptionKey: `interests.${cleanName.toLowerCase().replace(/\s+/g, '')}Description`
    }
  })
}

function getDefaultSubjects(interestName) {
  const subjectMap = {
    'Science': ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
    'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    'Technology': ['Computer Science', 'Programming', 'Digital Skills'],
    'Arts': ['Literature', 'History', 'Languages', 'Creative Writing'],
    'Commerce': ['Business Studies', 'Economics', 'Accounting', 'Finance'],
    'Engineering': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
    'Medicine': ['Biology', 'Chemistry', 'Physics', 'Anatomy'],
    'Law': ['Political Science', 'History', 'English', 'Social Studies']
  }
  
  // Find matching subjects based on interest name
  for (const [key, subjects] of Object.entries(subjectMap)) {
    if (interestName.toLowerCase().includes(key.toLowerCase())) {
      return subjects
    }
  }
  
  return ['General Studies', 'Core Subjects']
}

function getDefaultCareerPaths(interestName) {
  const careerMap = {
    'Science': ['Research', 'Teaching', 'Laboratory Work', 'Scientific Writing'],
    'Mathematics': ['Data Analysis', 'Statistics', 'Actuarial Science', 'Research'],
    'Technology': ['Software Development', 'IT Support', 'Digital Marketing', 'Cybersecurity'],
    'Arts': ['Writing', 'Teaching', 'Media', 'Cultural Work'],
    'Commerce': ['Business', 'Finance', 'Accounting', 'Management'],
    'Engineering': ['Engineering', 'Research', 'Project Management', 'Consulting'],
    'Medicine': ['Healthcare', 'Research', 'Public Health', 'Medical Practice'],
    'Law': ['Legal Practice', 'Public Service', 'Corporate Law', 'Legal Research']
  }
  
  // Find matching career paths based on interest name
  for (const [key, careers] of Object.entries(careerMap)) {
    if (interestName.toLowerCase().includes(key.toLowerCase())) {
      return careers
    }
  }
  
  return ['Professional Development', 'Career Growth', 'Skill Building']
}

async function cleanAllInterests() {
  console.log('🧹 Cleaning up interests data...')
  
  for (const level of educationLevels) {
    const filePath = path.join(seedDir, `interests-${level}.json`)
    
    if (fs.existsSync(filePath)) {
      try {
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const cleanedData = cleanInterestData(rawData)
        
        // Create backup
        const backupPath = filePath.replace('.json', '-backup.json')
        fs.writeFileSync(backupPath, JSON.stringify(rawData, null, 2))
        console.log(`📁 Created backup: ${backupPath}`)
        
        // Write cleaned data
        fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2))
        console.log(`✅ Cleaned interests for ${level}: ${cleanedData.length} items`)
        
        // Show sample of cleaned data
        console.log(`📋 Sample cleaned interest:`, cleanedData[0])
        
      } catch (error) {
        console.error(`❌ Error cleaning interests for ${level}:`, error.message)
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`)
    }
  }
  
  console.log('\n🎉 Interests data cleaning completed!')
  console.log('Your interests should now display with clean, readable names.')
}

cleanAllInterests()
