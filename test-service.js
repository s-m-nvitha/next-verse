// Test the education level service
const fs = require('fs');
const path = require('path');

// Mock fetch for Node.js
global.fetch = async (url) => {
  console.log('Fetching:', url);
  
  if (url.includes('/seed/interests-10th.json')) {
    try {
      const data = fs.readFileSync('public/seed/interests-10th.json', 'utf8');
      const parsed = JSON.parse(data);
      return {
        ok: true,
        json: () => Promise.resolve(parsed)
      };
    } catch (error) {
      return {
        ok: false,
        status: 404
      };
    }
  }
  
  return {
    ok: false,
    status: 404
  };
};

// Test the service
async function testService() {
  try {
    // Import the service
    const { educationLevelService } = await import('./src/services/education-level-service.ts');
    
    console.log('Testing education level service...');
    const data = await educationLevelService.getDataForLevel('10th');
    
    console.log('Data loaded successfully:');
    console.log('- Interests:', data.interests?.length || 0);
    console.log('- Courses:', data.courses?.length || 0);
    console.log('- Exams:', data.exams?.length || 0);
    
    if (data.interests && data.interests.length > 0) {
      console.log('First interest:', data.interests[0]);
    }
    
  } catch (error) {
    console.error('Error testing service:', error);
  }
}

testService();
