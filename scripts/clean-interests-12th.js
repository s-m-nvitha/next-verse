import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current 12th grade interests data
const interestsPath = path.join(__dirname, '../public/seed/interests-12th.json');
const interestsData = JSON.parse(fs.readFileSync(interestsPath, 'utf8'));

console.log(`Processing ${interestsData.length} interests for 12th grade...`);

// Clean and process the interests
const cleanedInterests = interestsData
  .filter(interest => {
    // Filter out invalid entries
    const labelKey = interest.labelKey || '';
    return labelKey.length > 0 && 
           !labelKey.includes('gotit') && 
           !labelKey.includes('---') &&
           !labelKey.includes('##') &&
           !labelKey.includes('interests.') &&
           labelKey.length < 100; // Remove extremely long keys
  })
  .map((interest, index) => {
    const labelKey = interest.labelKey || '';
    
    // Extract clean name from labelKey
    let name = labelKey
      .replace(/^interests\./, '') // Remove "interests." prefix
      .replace(/[🔬🧬💻🎨📚🏥⚖️🏗️💰📊🎭🎵🏃‍♂️🌱🔧💡]/g, '') // Remove emojis
      .replace(/[()]/g, '') // Remove parentheses
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // If name is still too long or unclear, create a better one
    if (name.length > 50 || name.length < 3) {
      // Try to extract meaningful words
      const words = labelKey.split(/[^a-zA-Z]/).filter(word => word.length > 2);
      if (words.length > 0) {
        name = words.slice(0, 3).join(' ').toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
      } else {
        name = `Interest ${index + 1}`;
      }
    }
    
    // Create description
    const description = `Explore ${name.toLowerCase()} and related fields. Perfect for students interested in this area.`;
    
    // Determine subjects based on interest type
    let subjects = [];
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('science') || lowerName.includes('pcm') || lowerName.includes('pcb')) {
      subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
    } else if (lowerName.includes('commerce')) {
      subjects = ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'];
    } else if (lowerName.includes('arts') || lowerName.includes('humanities')) {
      subjects = ['History', 'Political Science', 'Geography', 'Literature'];
    } else if (lowerName.includes('computer') || lowerName.includes('technology')) {
      subjects = ['Computer Science', 'Mathematics', 'Physics'];
    } else if (lowerName.includes('medical') || lowerName.includes('health')) {
      subjects = ['Biology', 'Chemistry', 'Physics'];
    } else if (lowerName.includes('engineering')) {
      subjects = ['Mathematics', 'Physics', 'Chemistry'];
    } else {
      subjects = ['Core Subjects', 'Elective Subjects'];
    }
    
    // Determine career paths
    let careerPaths = [];
    
    if (lowerName.includes('science') || lowerName.includes('pcm')) {
      careerPaths = ['Engineering', 'Medicine', 'Research', 'Technology'];
    } else if (lowerName.includes('commerce')) {
      careerPaths = ['Business', 'Finance', 'Accounting', 'Management'];
    } else if (lowerName.includes('arts')) {
      careerPaths = ['Journalism', 'Teaching', 'Public Service', 'Creative Arts'];
    } else if (lowerName.includes('computer')) {
      careerPaths = ['Software Development', 'Data Science', 'Cybersecurity', 'IT Management'];
    } else if (lowerName.includes('medical')) {
      careerPaths = ['Doctor', 'Nurse', 'Pharmacist', 'Medical Research'];
    } else {
      careerPaths = ['Professional Career', 'Higher Education', 'Specialized Training'];
    }
    
    return {
      id: `interest-12th-${index + 1}`,
      name: name,
      description: description,
      level: '12th',
      subjects: subjects,
      careerPaths: careerPaths
    };
  })
  .filter(interest => interest.name.length > 0); // Remove any empty entries

console.log(`Cleaned to ${cleanedInterests.length} interests`);

// Create backup of original file
const backupPath = path.join(__dirname, '../public/seed/interests-12th-backup.json');
fs.writeFileSync(backupPath, JSON.stringify(interestsData, null, 2));
console.log('Backup created at:', backupPath);

// Write cleaned data
fs.writeFileSync(interestsPath, JSON.stringify(cleanedInterests, null, 2));
console.log('Cleaned interests written to:', interestsPath);

// Show sample of cleaned data
console.log('\nSample of cleaned interests:');
cleanedInterests.slice(0, 5).forEach(interest => {
  console.log(`- ${interest.name}: ${interest.description.substring(0, 50)}...`);
});
