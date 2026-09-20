// Export data from JSON files to a single file
import fs from 'fs'
import path from 'path'

const seedDir = './public/seed'
const outputFile = './exported-data.json'

const educationLevels = ['10th', '12th', 'ug', 'pg']

async function exportData() {
  const allData = {
    interests: {},
    courses: {},
    exams: {},
    colleges: {},
    timeline: {}
  }

  // Export interests
  for (const level of educationLevels) {
    try {
      const filePath = path.join(seedDir, `interests-${level}.json`)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        allData.interests[level] = data
        console.log(`✅ Exported interests for ${level}: ${data.length} items`)
      }
    } catch (error) {
      console.log(`❌ Error exporting interests for ${level}:`, error.message)
    }
  }

  // Export courses
  for (const level of educationLevels) {
    try {
      const filePath = path.join(seedDir, `courses-${level}.json`)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        allData.courses[level] = data
        console.log(`✅ Exported courses for ${level}: ${data.length} items`)
      }
    } catch (error) {
      console.log(`❌ Error exporting courses for ${level}:`, error.message)
    }
  }

  // Export exams
  for (const level of educationLevels) {
    try {
      const filePath = path.join(seedDir, `exams-${level}.json`)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        allData.exams[level] = data
        console.log(`✅ Exported exams for ${level}: ${data.length} items`)
      }
    } catch (error) {
      console.log(`❌ Error exporting exams for ${level}:`, error.message)
    }
  }

  // Export other data
  try {
    const collegesPath = path.join(seedDir, 'colleges.json')
    if (fs.existsSync(collegesPath)) {
      allData.colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'))
      console.log(`✅ Exported colleges: ${allData.colleges.length} items`)
    }
  } catch (error) {
    console.log(`❌ Error exporting colleges:`, error.message)
  }

  try {
    const timelinePath = path.join(seedDir, 'timeline.json')
    if (fs.existsSync(timelinePath)) {
      allData.timeline = JSON.parse(fs.readFileSync(timelinePath, 'utf8'))
      console.log(`✅ Exported timeline: ${allData.timeline.length} items`)
    }
  } catch (error) {
    console.log(`❌ Error exporting timeline:`, error.message)
  }

  // Write to output file
  fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2))
  console.log(`\n🎉 All data exported to ${outputFile}`)
  console.log('You can now edit this file and import it back using import-data.js')
}

exportData()
