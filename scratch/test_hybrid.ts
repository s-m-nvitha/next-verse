import { loadStudyMaterialsHybrid } from '../src/services/studyMaterialsService';

async function test() {
  console.log("Loading study materials hybrid...");
  const materials = await loadStudyMaterialsHybrid();
  console.log(`Total materials returned: ${materials.length}`);
  
  if (materials.length > 0) {
    console.log("First material:", materials[0].title, materials[0].domain);
  }
}

test().catch(console.error);
