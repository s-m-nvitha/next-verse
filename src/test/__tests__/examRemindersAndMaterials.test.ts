import { describe, it, expect, beforeEach } from 'vitest'
import { useExamRemindersStore } from '@/store/examReminders'
import { useOfflineMaterialsStore, downloadMaterialForOffline } from '@/services/offlineMaterialsService'
import studyMaterialsData from '@/seed/studyMaterials/karnataka.json'
import type { SeedStudyMaterial } from '@/services/seedDataService'
import {
  filterAndRankMaterials,
  normalizeKeyword,
  extractProfileInterests,
  expandDomainKeywords,
  matchMaterialToContext,
} from '@/services/studyMaterialsPersonalization'
import type { UserProfile } from '@/lib/validators'

describe('Exam Tracker Reminders', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    const { reminders, removeReminder } = useExamRemindersStore.getState()
    for (const id of Object.keys(reminders)) {
      removeReminder(id)
    }
  })

  it('toggles reminder on for an exam with a real verified date', () => {
    const store = useExamRemindersStore.getState()
    const result = store.toggleReminder({
      examId: 'kcet_karnataka',
      examName: 'KCET 2025',
      examDate: '2025-04-18T09:00:00.000Z',
    })

    expect(result.active).toBe(true)
    expect(result.reminder).not.toBeNull()
    expect(result.reminder?.examId).toBe('kcet_karnataka')
    expect(result.reminder?.examDate).toBe('2025-04-18T09:00:00.000Z')
    expect(result.reminder?.isTba).toBe(false)
    expect(result.reminder?.reminderType).toBe('verified_date')
    expect(store.isReminderActive('kcet_karnataka')).toBe(true)
  })

  it('stores an announcement reminder for DATE TBA exams without inventing a fake date', () => {
    const store = useExamRemindersStore.getState()
    const result = store.toggleReminder({
      examId: 'neet_pg',
      examName: 'NEET PG 2025',
      examDate: null, // DATE TBA
    })

    expect(result.active).toBe(true)
    expect(result.reminder).not.toBeNull()
    expect(result.reminder?.examId).toBe('neet_pg')
    expect(result.reminder?.examDate).toBeNull()
    expect(result.reminder?.isTba).toBe(true)
    expect(result.reminder?.reminderType).toBe('announcement')
    expect(store.isReminderActive('neet_pg')).toBe(true)
  })

  it('clicking REMINDER ON again toggles it off', () => {
    const store = useExamRemindersStore.getState()
    // Turn ON
    store.toggleReminder({
      examId: 'comedk_uget',
      examName: 'COMEDK UGET',
      examDate: '2025-05-10T10:00:00.000Z',
    })
    expect(store.isReminderActive('comedk_uget')).toBe(true)

    // Turn OFF
    const resultOff = store.toggleReminder({
      examId: 'comedk_uget',
      examName: 'COMEDK UGET',
      examDate: '2025-05-10T10:00:00.000Z',
    })
    expect(resultOff.active).toBe(false)
    expect(resultOff.reminder).toBeNull()
    expect(store.isReminderActive('comedk_uget')).toBe(false)
  })
})

describe('Study Materials Data Quality & URL Reliability', () => {
  const materials = studyMaterialsData as SeedStudyMaterial[]

  it('contains no placeholder, fake, or example.com URLs', () => {
    for (const m of materials) {
      expect(m.url).toBeDefined()
      expect(m.url).not.toContain('example.com')
      expect(m.url).toMatch(/^https?:\/\//)
    }
  })

  it('contains no generic YouTube search query URLs', () => {
    for (const m of materials) {
      if (m.url?.includes('youtube.com')) {
        expect(m.url).not.toContain('search_query')
      }
    }
  })

  it('has verified status and lastVerified dates on checked resources', () => {
    for (const m of materials) {
      if (m.verified) {
        expect(m.lastVerified).toBeDefined()
        expect(m.provider).toBeDefined()
        expect(m.sourceType).toBeDefined()
      }
    }
  })

  it('covers canonical education levels (10th, 12th, UG, PG)', () => {
    const levels = new Set(materials.map((m) => m.level))
    expect(levels.has('10th')).toBe(true)
    expect(levels.has('12th')).toBe(true)
    expect(levels.has('UG')).toBe(true)
    expect(levels.has('PG')).toBe(true)
  })
})

describe('Study Materials Catalog & All Materials Count', () => {
  const materials = studyMaterialsData as SeedStudyMaterial[]

  it('ALL MATERIALS returns the complete valid catalog without depending on student domain or level', () => {
    const { allMaterials } = filterAndRankMaterials(materials, {})
    expect(allMaterials.length).toBe(materials.length)
    expect(allMaterials.length).toBeGreaterThanOrEqual(20)
    for (const item of allMaterials) {
      expect(item.title).toBeDefined()
      expect(item.url).toBeDefined()
    }
  })

  it('missing optional metadata does not remove a material from ALL MATERIALS', () => {
    const minimalMaterial: SeedStudyMaterial = {
      id: 'minimal_resource_1',
      title: 'Minimal Resource Sample',
      type: 'PDF',
      level: '12th',
      url: 'https://ncert.nic.in/',
      // No relatedDomains, relatedCourses, relatedExams, provider, format, etc.
    }

    const { allMaterials } = filterAndRankMaterials([...materials, minimalMaterial], {})
    expect(allMaterials.some((m) => m.id === 'minimal_resource_1')).toBe(true)
  })
})

describe('Study Materials Personalization & Domain Matching', () => {
  const materials = studyMaterialsData as SeedStudyMaterial[]

  it('personalizes resources for Technology / Computer Science / AI profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'it_software',
      careerDomain: 'engineering_technology',
      courseId: 'btech_cse',
      interests: ['coding', 'artificial_intelligence'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(
      titles.some(
        (t) =>
          t.includes('python') ||
          t.includes('data structures') ||
          t.includes('gate computer science') ||
          t.includes('machine learning')
      )
    ).toBe(true)
  })

  it('personalizes resources for Healthcare / Medical profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'medical_healthcare',
      careerDomain: 'medical_healthcare',
      courseId: 'mbbs',
      examIds: ['neet_ug'],
      interests: ['biology', 'medicine'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(titles.some((t) => t.includes('neet') || t.includes('biology'))).toBe(true)
  })

  it('personalizes resources for Law profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'law',
      careerDomain: 'law',
      courseId: 'ba_llb',
      examIds: ['clat_law'],
      interests: ['legal_studies', 'constitution'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(titles.some((t) => t.includes('clat') || t.includes('constitution'))).toBe(true)
  })

  it('personalizes resources for Commerce / Finance profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'commerce_finance',
      careerDomain: 'commerce_finance',
      courseId: 'bcom',
      examIds: ['ca_foundation_icai'],
      interests: ['accounting', 'finance'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(
      titles.some(
        (t) => t.includes('accountancy') || t.includes('ca foundation') || t.includes('cat')
      )
    ).toBe(true)
  })

  it('personalizes resources for Design / Creative profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'design_creative',
      careerDomain: 'design_creative',
      courseId: 'bdes',
      examIds: ['nid_dat'],
      interests: ['design', 'visual_arts'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(titles.some((t) => t.includes('design thinking') || t.includes('design'))).toBe(true)
  })

  it('personalizes resources for Engineering profile', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'engineering_technology',
      courseId: 'be_cse',
      examIds: ['kcet_karnataka'],
      interests: ['engineering', 'robotics'],
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(
      titles.some((t) => t.includes('kcet') || t.includes('gate') || t.includes('python'))
    ).toBe(true)
  })
})

describe('Interest Structure Normalization & Edge Cases', () => {
  const materials = studyMaterialsData as SeedStudyMaterial[]

  it('normalizes string keywords with spaces, dashes, or uppercase', () => {
    expect(normalizeKeyword('Computer Science')).toBe('computer_science')
    expect(normalizeKeyword('Data-Science-AI')).toBe('data_science_ai')
    expect(normalizeKeyword('  Medical Healthcare  ')).toBe('medical_healthcare')
  })

  it('expands domain keywords into canonical cluster tokens', () => {
    const expanded = expandDomainKeywords(['software_engineering', 'doctor_medical_field'])
    expect(expanded.has('technology')).toBe(true)
    expect(expanded.has('computer_science')).toBe(true)
    expect(expanded.has('healthcare')).toBe(true)
    expect(expanded.has('medicine')).toBe(true)
  })

  it('matches individual material directly using matchMaterialToContext', () => {
    const pythonMaterial = materials.find((m) => m.id === 'basic_coding_course')!
    const match = matchMaterialToContext(pythonMaterial, {
      domainId: 'it_software',
      interests: ['coding'],
    })
    expect(match.isMatch).toBe(true)
    expect(match.score).toBeGreaterThan(0)
  })

  it('safely extracts interests from object arrays (e.g. { id, weight } or { name })', () => {
    const mockProfile = {
      interestAssessment: {
        topInterests: [
          { id: 'artificial_intelligence', weight: 5 },
          { name: 'Computer Science' },
          'coding',
        ],
      },
      interests: [
        { id: 'data_science_ai', weight: 10 },
      ],
    } as unknown as UserProfile

    const extracted = extractProfileInterests(mockProfile)
    expect(extracted).toContain('artificial_intelligence')
    expect(extracted).toContain('computer_science')
    expect(extracted).toContain('coding')
    expect(extracted).toContain('data_science_ai')
  })

  it('matches resources based on object-extracted interests', () => {
    const interests = [
      { id: 'artificial_intelligence', weight: 10 },
      { name: 'Deep Learning' },
    ]

    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      interests,
    })

    expect(personalizedMaterials.length).toBeGreaterThan(0)
    const titles = personalizedMaterials.map((m) => m.title.toLowerCase())
    expect(titles.some((t) => t.includes('machine learning') || t.includes('ai') || t.includes('python'))).toBe(true)
  })

  it('fallback provides foundational catalog when profile has no domain or signals', () => {
    const { personalizedMaterials, allMaterials } = filterAndRankMaterials(materials, {})
    expect(personalizedMaterials.length).toBe(allMaterials.length)
    expect(personalizedMaterials.length).toBeGreaterThanOrEqual(20)
  })

  it('returns empty personalized array only for completely unmapped / fictional domain to trigger empty state', () => {
    const { personalizedMaterials } = filterAndRankMaterials(materials, {
      domainId: 'fictional_unmapped_discipline_9999',
      courseId: 'non_existent_course_abc',
      examIds: ['fantasy_exam_xyz'],
      interests: ['extraterrestrial_navigation_777'],
    })

    expect(personalizedMaterials.length).toBe(0)
  })
})

describe('Offline Materials Caching', () => {
  beforeEach(() => {
    const { cachedMaterials, removeCachedMaterial } = useOfflineMaterialsStore.getState()
    for (const id of Object.keys(cachedMaterials)) {
      removeCachedMaterial(id)
    }
  })

  it('caches material and persists to offline store', async () => {
    const store = useOfflineMaterialsStore.getState()
    expect(store.isCached('sslc_science_notes')).toBe(false)

    const mockMaterial: SeedStudyMaterial = {
      id: 'sslc_science_notes',
      title: 'Karnataka SSLC Science Complete Notes',
      type: 'PDF',
      level: '10th',
      url: 'https://textbooks.karnataka.gov.in/',
      provider: 'KSEAB',
      format: 'ebook',
    }

    const res = await downloadMaterialForOffline(mockMaterial)
    expect(res.success).toBe(true)
    expect(store.isCached('sslc_science_notes')).toBe(true)
  })
})
