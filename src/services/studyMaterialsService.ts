import type { EducationLevel } from '@/lib/validators'
import type { FirestoreStudyMaterial } from '@/lib/firestore-schemas'
import { StudyMaterialsAPI } from '@/services/api'
import { loadSeedStudyMaterialsKarnataka, type SeedStudyMaterial } from '@/services/seedDataService'

const toLevel = (level: EducationLevel): '10th' | '12th' | 'UG' | 'PG' => {
  if (level === '10th') return '10th'
  if (level === '12th') return '12th'
  if (level === 'UG') return 'UG'
  return 'PG'
}

const mapFirestoreToSeed = (m: FirestoreStudyMaterial): SeedStudyMaterial => {
  const format: SeedStudyMaterial['format'] =
    m.type === 'ebook' ? 'ebook' : m.type === 'video' ? 'video' : m.type === 'course' ? 'course' : 'notes'

  return {
    id: m.id,
    title: m.title,
    type: m.type,
    level: m.level,
    relatedDomains: m.subjects,
    provider: undefined,
    language: m.language === 'kn' ? ['Kannada'] : m.language === 'hi' ? ['Hindi'] : ['English'],
    format,
    difficultyLevel: undefined,
    url: m.url,
  }
}

/**
 * Loads the complete study materials catalog, merging verified seed data
 * with live Firestore entries when available. Does NOT discard materials of other levels.
 */
export const loadStudyMaterialsHybrid = async (level?: EducationLevel): Promise<SeedStudyMaterial[]> => {
  const seed = await loadSeedStudyMaterialsKarnataka()

  try {
    const byId = new Map<string, SeedStudyMaterial>()
    for (const item of seed) byId.set(item.id, item)

    if (level) {
      const res = await StudyMaterialsAPI.getStudyMaterialsByLevel(toLevel(level))
      const firestore = res.data ?? []
      for (const item of firestore.map(mapFirestoreToSeed)) {
        byId.set(item.id, item)
      }
    }

    return Array.from(byId.values())
  } catch {
    return seed
  }
}
