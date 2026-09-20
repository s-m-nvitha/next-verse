import type { SeedCollege } from '@/services/seedDataService'
import { haversineDistanceKm } from '@/utils/distance'

export interface UserGeoLocation {
  lat: number
  lon: number
}

export interface CollegeFilterArgs {
  colleges: SeedCollege[]
  courseId: string
  selectedExamIds?: string[]
  allowedTypes?: string[]
}

export interface CollegeGeoResolution {
  lat: number
  lon: number
  isApproximateDistrict: boolean
}

export interface RankedCollege {
  college: SeedCollege
  score: number
  distanceKm?: number
  explanation: string
  geo?: CollegeGeoResolution
}

const COURSE_ID_ALIASES: Record<string, string[]> = {
  // Generic / Umbrella course aliases
  btech: ['btech_cse', 'be_cse', 'be_ise', 'be_ece', 'be_mech', 'be_civil', 'btech_it', 'bca'],
  be: ['be_cse', 'btech_cse', 'be_ise', 'be_ece', 'be_mech', 'be_civil', 'btech_it', 'bca'],
  bsc_computer_science: ['bca', 'btech_cse', 'be_cse', 'bsc'],
  polytechnic_diploma_engineering: ['diploma_cse', 'diploma_ece', 'diploma_mechanical', 'diploma_civil', 'diploma_automobile'],
  iti_technical_trades: ['diploma_mechanical', 'diploma_ece', 'diploma_civil', 'diploma_automobile'],

  // Business, Commerce & Management
  bba: ['bba', 'mba', 'bcom'],
  bba_analytics: ['bba', 'bcom', 'mba'],
  bcom: ['bcom', 'bba'],
  ba_economics: ['ba', 'bcom', 'bba'],
  mba: ['mba', 'bba'],

  // Computer Science & IT
  be_cse: ['btech_cse', 'btech_it', 'bca'],
  btech_cse: ['btech_cse', 'be_cse', 'btech_it'],
  be_ise: ['btech_cse', 'btech_it', 'be_ise'],
  btech_ise: ['btech_cse', 'btech_it'],
  bca: ['btech_cse', 'btech_it', 'bsc', 'bba'],
  be_ai_ds: ['btech_ai', 'btech_cse'],
  btech_ai: ['btech_ai', 'btech_cse'],
  btech_ai_ds: ['btech_ai', 'btech_cse'],
  bsc_data_science: ['btech_ai', 'btech_cse', 'bsc'],

  // Electronics & Mechanical
  be_ece: ['btech_ece'],
  btech_ece: ['btech_ece', 'be_ece'],
  be_eee: ['btech_ece', 'btech_me'],
  be_rob: ['btech_me', 'btech_cse', 'btech_ece'],
  be_mech: ['btech_me'],
  btech_me: ['btech_me', 'be_mech'],
  btech_mech: ['btech_me', 'be_mech'],
  be_aeronautical: ['btech_me'],
  be_civil: ['btech_civil'],
  btech_civil: ['btech_civil', 'be_civil'],

  // Medical & Health
  mbbs: ['mbbs', 'md'],
  bds: ['mbbs', 'md'],
  bsc_nursing: ['mbbs', 'bsc'],
  bpt: ['mbbs', 'bsc'],
  bpharm: ['bsc', 'mbbs'],

  // Law, Humanities & Design
  llb: ['ba_llb', 'llm'],
  ba_llb: ['ba_llb', 'llm'],
  ba_psychology: ['ba'],
  ba_journalism: ['ba'],
  bdes: ['ba', 'bsc'],
  bsc_animation: ['bsc', 'btech_it'],
  any_degree: ['ba', 'bcom', 'bsc', 'bba'],

  // ── 10th Level: PUC Streams ──────────────────────────────────────────────
  // PUC Science (PCMB) → junior colleges offering PUC Science & related medical pathways
  puc_pcmb: ['puc_pcmc', 'puc_cbz', 'bsc', 'mbbs', 'bsc_nursing', 'bpt'],
  // PUC Science (PCMC) → junior colleges offering PUC Science & related tech pathways
  puc_pcmc: ['puc_pcmb', 'puc_pcme', 'puc_pcms', 'btech_cse', 'be_cse', 'bca', 'bsc'],
  // PUC Science (PCME) → junior colleges offering PCME/PCMC & electronics pathways
  puc_pcme: ['puc_pcmc', 'puc_pcmb', 'btech_ece', 'be_ece', 'be_eee'],
  // PUC Science (PCMS) → junior colleges offering PUC Science
  puc_pcms: ['puc_pcmc', 'puc_pcmb', 'bsc', 'btech_cse', 'bca'],
  // PUC Science (CBZ) → junior colleges offering PUC Science
  puc_cbz: ['puc_pcmb', 'bsc', 'bsc_nursing', 'mbbs', 'bpt'],
  // PUC Science (EBAC) → junior colleges offering Electronics/Commerce/Science
  puc_ebac: ['puc_pcme', 'puc_pcmc', 'commerce_ceba', 'be_eee', 'btech_ece', 'bca'],

  // PUC Commerce Streams → junior colleges offering Commerce combinations
  commerce_seba: ['commerce_ceba', 'commerce_heba', 'commerce_basm', 'bcom', 'bba', 'ba_economics'],
  commerce_ceba: ['commerce_seba', 'commerce_heba', 'bcom', 'bba', 'bca'],
  commerce_heba: ['commerce_seba', 'commerce_ceba', 'bcom', 'bba', 'ba_economics'],
  commerce_basm: ['commerce_seba', 'commerce_ceba', 'bcom', 'bba'],

  // PUC Arts Streams → junior colleges offering Arts combinations
  arts_heps: ['arts_heba', 'arts_psychology', 'arts_journalism', 'ba_economics', 'bcom'],
  arts_heba: ['arts_heps', 'arts_journalism', 'ba_economics', 'bcom'],
  arts_psychology: ['arts_heps', 'bcom', 'bba', 'bsc'],
  arts_journalism: ['arts_heps', 'arts_heba', 'bcom', 'ba_economics', 'bba'],

  // ── 10th Level: Polytechnic / Diploma ────────────────────────────────────
  // Diploma CSE/ISE → Polytechnic colleges offering Computer/Information diplomas
  diploma_cse: ['diploma_ise', 'btech_cse', 'be_cse', 'be_ise', 'bca'],
  diploma_ise: ['diploma_cse', 'btech_cse', 'be_ise', 'bca'],
  // Diploma ECE → Polytechnic colleges offering Electronics diplomas
  diploma_ece: ['diploma_mechatronics', 'btech_ece', 'be_ece', 'be_eee'],
  // Diploma Mechanical / Automobile → Polytechnic colleges offering Mechanical diplomas
  diploma_mechanical: ['diploma_automobile', 'diploma_mechatronics', 'btech_me', 'be_mech'],
  diploma_automobile: ['diploma_mechanical', 'btech_me', 'be_mech'],
  // Diploma Civil → Polytechnic colleges offering Civil diplomas
  diploma_civil: ['btech_civil', 'be_civil'],
  // Diploma Mechatronics → Polytechnic colleges offering Mechatronics/Robotics/Mechanical
  diploma_mechatronics: ['diploma_mechanical', 'diploma_ece', 'btech_me', 'btech_ece', 'be_rob'],
  // Diploma Aeronautical → Polytechnic colleges offering Aeronautical/Mechanical
  diploma_aeronautical: ['diploma_mechanical', 'diploma_automobile', 'btech_me', 'be_aeronautical'],
  // Healthcare diploma courses
  healthcare_diploma: ['bsc_nursing', 'bpt', 'bsc'],
}

const EXAM_ID_ALIASES: Record<string, string> = {
  kcet: 'kcet_karnataka',
  comedk: 'comedk_uget',
  neet: 'neet_ug',
}

const normalizeExamId = (raw: string) => {
  const id = raw.trim().toLowerCase()
  return EXAM_ID_ALIASES[id] ?? id
}

const normalizeText = (raw: string) => raw.trim().toLowerCase()

export const filterColleges = (args: CollegeFilterArgs): SeedCollege[] => {
  const allowedTypes = args.allowedTypes ? new Set(args.allowedTypes.map(normalizeText)) : null

  const targetCourseId = normalizeText(args.courseId)
  const allowedCourseIds = new Set([targetCourseId, ...(COURSE_ID_ALIASES[targetCourseId] ?? [])])
  const selectedExams = new Set((args.selectedExamIds ?? []).map(normalizeExamId))
  const requireExamMatch = selectedExams.size > 0

  const hasCourseMatch = (c: SeedCollege) => {
    const offered = (c.coursesOffered ?? []).map(normalizeText)
    return offered.some((id) => allowedCourseIds.has(id))
  }

  const hasExamMatch = (c: SeedCollege) => {
    if (!requireExamMatch) return true
    const accepted = (c.acceptedExams ?? []).map(normalizeText)
    if (
      accepted.length === 0 ||
      accepted.includes('entrance_test') ||
      accepted.includes('merit') ||
      accepted.includes('direct')
    ) {
      return true
    }
    return accepted.some((id) => selectedExams.has(normalizeExamId(id)))
  }

  return args.colleges
    .filter((c) => (allowedTypes ? allowedTypes.has(normalizeText(c.type)) : true))
    .filter(hasCourseMatch)
    .filter(hasExamMatch)
}

export const DISTRICT_ALIASES: Record<string, string> = {
  'bangalore': 'bengaluru urban',
  'bangalore urban': 'bengaluru urban',
  'bengaluru': 'bengaluru urban',
  'bengaluru urban': 'bengaluru urban',
  'bengaluru north': 'bengaluru urban',
  'bengaluru south': 'bengaluru urban',
  'bengaluru central': 'bengaluru urban',
  'bangalore rural': 'bengaluru rural',
  'bengaluru rural': 'bengaluru rural',
  'mysore': 'mysuru',
  'mysuru': 'mysuru',
  'mangalore': 'dakshina kannada',
  'mangaluru': 'dakshina kannada',
  'dakshina kannada': 'dakshina kannada',
  'south canara': 'dakshina kannada',
  'udupi': 'udupi',
  'belgaum': 'belagavi',
  'belagavi': 'belagavi',
  'dharwad': 'dharwad',
  'hubli': 'dharwad',
  'hubballi': 'dharwad',
  'gulbarga': 'kalaburagi',
  'kalaburagi': 'kalaburagi',
  'tumkur': 'tumakuru',
  'tumakuru': 'tumakuru',
  'shimoga': 'shivamogga',
  'shivamogga': 'shivamogga',
  'davanagere': 'davanagere',
  'bellary': 'ballari',
  'ballari': 'ballari',
  'hassan': 'hassan',
  'mandya': 'mandya',
  'chikkamagaluru': 'chikkamagaluru',
  'chikmagalur': 'chikkamagaluru',
  'kolar': 'kolar',
  'chikkaballapura': 'chikkaballapura',
  'chikkaballapur': 'chikkaballapura',
  'ramanagara': 'ramanagara',
  'ramanagar': 'ramanagara',
  'bagalkote': 'bagalkote',
  'bagalkot': 'bagalkote',
  'bijapur': 'vijayapura',
  'vijayapura': 'vijayapura',
  'bidar': 'bidar',
  'raichur': 'raichur',
  'koppal': 'koppal',
  'gadag': 'gadag',
  'haveri': 'haveri',
  'uttara kannada': 'uttara kannada',
  'karwar': 'uttara kannada',
  'kodagu': 'kodagu',
  'coorg': 'kodagu',
  'chamarajanagar': 'chamarajanagar',
  'chitradurga': 'chitradurga',
  'yadgir': 'yadgir',
  'vijayanagara': 'vijayanagara',
}

export const DISTRICT_DEFAULT_COORDS: Record<string, { lat: number; lon: number }> = {
  'bengaluru urban': { lat: 12.9716, lon: 77.5946 },
  'bengaluru rural': { lat: 13.2847, lon: 77.5544 },
  'mysuru': { lat: 12.2958, lon: 76.6394 },
  'dakshina kannada': { lat: 12.9141, lon: 74.8560 },
  'udupi': { lat: 13.3409, lon: 74.7421 },
  'belagavi': { lat: 15.8497, lon: 74.4977 },
  'dharwad': { lat: 15.4589, lon: 75.0078 },
  'kalaburagi': { lat: 17.3297, lon: 76.8343 },
  'tumakuru': { lat: 13.3379, lon: 77.1173 },
  'shivamogga': { lat: 13.9299, lon: 75.5681 },
  'davanagere': { lat: 14.4644, lon: 75.9218 },
  'ballari': { lat: 15.1394, lon: 76.9214 },
  'hassan': { lat: 13.0033, lon: 76.1004 },
  'mandya': { lat: 12.5244, lon: 76.8958 },
  'chikkamagaluru': { lat: 13.3161, lon: 75.7720 },
  'kolar': { lat: 13.1367, lon: 78.1291 },
  'chikkaballapura': { lat: 13.4355, lon: 77.7275 },
  'ramanagara': { lat: 12.7150, lon: 77.2810 },
  'bagalkote': { lat: 16.1691, lon: 75.6615 },
  'vijayapura': { lat: 16.8302, lon: 75.7100 },
  'bidar': { lat: 17.9104, lon: 77.5199 },
  'raichur': { lat: 16.2120, lon: 77.3439 },
  'koppal': { lat: 15.3456, lon: 76.1558 },
  'gadag': { lat: 15.4312, lon: 75.6358 },
  'haveri': { lat: 14.7954, lon: 75.3991 },
  'uttara kannada': { lat: 14.8185, lon: 74.1416 },
  'kodagu': { lat: 12.4244, lon: 75.7382 },
  'chamarajanagar': { lat: 11.9261, lon: 76.9437 },
  'chitradurga': { lat: 14.2251, lon: 76.3980 },
  'yadgir': { lat: 16.7628, lon: 77.1442 },
  'vijayanagara': { lat: 15.2757, lon: 76.3888 },
}

export const PINCODE_COORDS: Record<string, { lat: number; lon: number }> = {
  // Bengaluru Urban PIN codes
  '560001': { lat: 12.9784, lon: 77.6006 }, // GPO / MG Road / Central
  '560002': { lat: 12.9634, lon: 77.5792 }, // City Market / Chickpet
  '560003': { lat: 13.0031, lon: 77.5701 }, // Malleshwaram
  '560004': { lat: 12.9406, lon: 77.5746 }, // Basavanagudi
  '560005': { lat: 12.9972, lon: 77.6142 }, // Frazer Town / Pulakeshinagar
  '560006': { lat: 13.0182, lon: 77.5954 }, // RT Nagar / JC Nagar
  '560007': { lat: 12.9567, lon: 77.6254 }, // Austin Town / Victoria Layout
  '560008': { lat: 12.9812, lon: 77.6245 }, // Ulsoor / Halasuru
  '560009': { lat: 12.9772, lon: 77.5732 }, // Majestic / Gandhinagar
  '560010': { lat: 12.9902, lon: 77.5527 }, // Rajajinagar
  '560011': { lat: 12.9308, lon: 77.5838 }, // Jayanagar
  '560012': { lat: 13.0082, lon: 77.5694 }, // Malleshwaram 18th Cross
  '560013': { lat: 13.0482, lon: 77.5442 }, // Jalahalli
  '560014': { lat: 13.0531, lon: 77.5602 }, // Jalahalli East
  '560015': { lat: 13.0432, lon: 77.5254 }, // Jalahalli West
  '560016': { lat: 13.0085, lon: 77.6742 }, // Ramamurthy Nagar
  '560017': { lat: 12.9567, lon: 77.6654 }, // Vimanapura / HAL
  '560018': { lat: 12.9572, lon: 77.5621 }, // Chamrajpet
  '560019': { lat: 12.9412, lon: 77.5655 }, // Gavipuram / Basavanagudi
  '560020': { lat: 12.9882, lon: 77.5784 }, // Seshadripuram
  '560021': { lat: 12.9921, lon: 77.5642 }, // Srirampuram
  '560022': { lat: 13.0232, lon: 77.5492 }, // Yeshwanthpur
  '560023': { lat: 12.9818, lon: 77.5482 }, // Magadi Road
  '560024': { lat: 13.0358, lon: 77.5970 }, // Hebbal
  '560025': { lat: 12.9667, lon: 77.6067 }, // Richmond Town / Museum Road
  '560026': { lat: 12.9542, lon: 77.5382 }, // Deepanjali Nagar / Mysore Road
  '560027': { lat: 12.9531, lon: 77.5954 }, // Shanthinagar / Wilson Garden
  '560028': { lat: 12.9342, lon: 77.5654 }, // Tyagarajanagar
  '560029': { lat: 12.9344, lon: 77.6061 }, // Dairy Circle / Dharmaram / BTM
  '560030': { lat: 12.9412, lon: 77.6125 }, // Adugodi
  '560032': { lat: 13.0212, lon: 77.5892 }, // Ganganagar
  '560034': { lat: 12.9352, lon: 77.6245 }, // Koramangala
  '560037': { lat: 12.9591, lon: 77.6974 }, // Marathahalli
  '560038': { lat: 12.9784, lon: 77.6408 }, // Indiranagar
  '560040': { lat: 12.9719, lon: 77.5342 }, // Vijayanagar
  '560041': { lat: 12.9212, lon: 77.5954 }, // Jayanagar 9th Block
  '560043': { lat: 13.0182, lon: 77.6482 }, // Banaswadi / Kalyan Nagar
  '560045': { lat: 13.0232, lon: 77.6203 }, // Kadugondanahalli
  '560047': { lat: 12.9602, lon: 77.6402 }, // Domlur
  '560048': { lat: 12.9934, lon: 77.7125 }, // Hoodi / Mahadevapura
  '560049': { lat: 13.0182, lon: 77.7125 }, // KR Puram / Bhattarahalli
  '560050': { lat: 12.9412, lon: 77.5558 }, // Banashankari 1st Stage
  '560052': { lat: 12.9912, lon: 77.5928 }, // Vasanth Nagar
  '560053': { lat: 12.9702, lon: 77.5792 }, // Chickpet
  '560054': { lat: 13.0306, lon: 77.5649 }, // Mathikere / MSR Nagar
  '560058': { lat: 13.0285, lon: 77.5197 }, // Peenya
  '560059': { lat: 12.9237, lon: 77.4987 }, // RVCE / Mysore Road
  '560060': { lat: 12.9081, lon: 77.4831 }, // Kengeri
  '560064': { lat: 13.1007, lon: 77.5963 }, // Yelahanka
  '560066': { lat: 12.9698, lon: 77.7499 }, // Whitefield / Immadihalli
  '560067': { lat: 12.9982, lon: 77.7602 }, // Kadugodi
  '560068': { lat: 12.8988, lon: 77.6322 }, // Bommanahalli
  '560070': { lat: 12.9212, lon: 77.5654 }, // Banashankari 2nd Stage
  '560072': { lat: 12.9612, lon: 77.5092 }, // Nagarbhavi
  '560075': { lat: 12.9682, lon: 77.6602 }, // HAL 3rd Stage
  '560076': { lat: 12.8797, lon: 77.5982 }, // Bannerghatta Road / Hulimavu
  '560078': { lat: 12.9063, lon: 77.5857 }, // JP Nagar
  '560079': { lat: 12.9882, lon: 77.5382 }, // Basaveshwaranagar
  '560085': { lat: 12.9344, lon: 77.5345 }, // Banashankari 3rd Stage
  '560086': { lat: 13.0132, lon: 77.5454 }, // Mahalakshmi Layout
  '560091': { lat: 12.9818, lon: 77.4892 }, // Vishwaneedam
  '560092': { lat: 13.0612, lon: 77.5912 }, // Sahakara Nagar
  '560094': { lat: 13.0367, lon: 77.5784 }, // Sanjay Nagar
  '560100': { lat: 12.8452, lon: 77.6602 }, // Electronic City
  '560102': { lat: 12.9121, lon: 77.6446 }, // HSR Layout
  '560103': { lat: 12.9304, lon: 77.6784 }, // Bellandur
  '560107': { lat: 13.0838, lon: 77.4851 }, // Soldevanahalli / Acharya

  // Major Karnataka District Headquarters PIN codes
  '570001': { lat: 12.3168, lon: 76.6433 }, // Mysuru
  '575001': { lat: 12.8731, lon: 74.8462 }, // Mangaluru
  '572101': { lat: 13.3421, lon: 77.1012 }, // Tumakuru
  '580001': { lat: 15.4589, lon: 75.0078 }, // Dharwad
  '580020': { lat: 15.3582, lon: 75.1324 }, // Hubballi
  '590001': { lat: 15.8524, lon: 74.5042 }, // Belagavi
  '585101': { lat: 17.3325, lon: 76.8392 }, // Kalaburagi
  '576101': { lat: 13.3395, lon: 74.7451 }, // Udupi
  '571401': { lat: 12.5244, lon: 76.8958 }, // Mandya
  '573201': { lat: 13.0033, lon: 76.1004 }, // Hassan
  '577201': { lat: 13.9299, lon: 75.5681 }, // Shivamogga
  '577001': { lat: 14.4644, lon: 75.9218 }, // Davanagere
  '583101': { lat: 15.1394, lon: 76.9214 }, // Ballari
  '563101': { lat: 13.1367, lon: 78.1291 }, // Kolar
  '562159': { lat: 12.7150, lon: 77.2810 }, // Ramanagara
  '562101': { lat: 13.4355, lon: 77.7275 }, // Chikkaballapura
}

export const LOCALITY_COORDS: Record<string, { lat: number; lon: number }> = {
  'whitefield': { lat: 12.9698, lon: 77.7499 },
  'immadihalli': { lat: 12.9698, lon: 77.7499 },
  'rajajinagar': { lat: 12.9902, lon: 77.5527 },
  'malleshwaram': { lat: 13.0031, lon: 77.5701 },
  'malleswaram': { lat: 13.0031, lon: 77.5701 },
  'basavanagudi': { lat: 12.9406, lon: 77.5746 },
  'jayanagar': { lat: 12.9308, lon: 77.5838 },
  'yelahanka': { lat: 13.1007, lon: 77.5963 },
  'kengeri': { lat: 12.9081, lon: 77.4831 },
  'hebbal': { lat: 13.0358, lon: 77.5970 },
  'koramangala': { lat: 12.9352, lon: 77.6245 },
  'indiranagar': { lat: 12.9784, lon: 77.6408 },
  'soldevanahalli': { lat: 13.0838, lon: 77.4851 },
  'electronic city': { lat: 12.8452, lon: 77.6602 },
  'marathahalli': { lat: 12.9591, lon: 77.6974 },
  'bommanahalli': { lat: 12.8988, lon: 77.6322 },
  'mathikere': { lat: 13.0306, lon: 77.5649 },
  'vasanth nagar': { lat: 12.9912, lon: 77.5928 },
  'kumaraswamy layout': { lat: 12.9094, lon: 77.5666 },
  'banashankari': { lat: 12.9304, lon: 77.5558 },
  'btm layout': { lat: 12.9166, lon: 77.6101 },
  'hsr layout': { lat: 12.9121, lon: 77.6446 },
  'vijayanagar': { lat: 12.9719, lon: 77.5342 },
  'peenya': { lat: 13.0285, lon: 77.5197 },
  'bengaluru': { lat: 12.9784, lon: 77.6006 },
  'bangalore': { lat: 12.9784, lon: 77.6006 },
  'mysuru': { lat: 12.3168, lon: 76.6433 },
  'mysore': { lat: 12.3168, lon: 76.6433 },
  'mangaluru': { lat: 12.8731, lon: 74.8462 },
  'mangalore': { lat: 12.8731, lon: 74.8462 },
  'tumakuru': { lat: 13.3421, lon: 77.1012 },
  'tumkur': { lat: 13.3421, lon: 77.1012 },
  'belagavi': { lat: 15.8524, lon: 74.5042 },
  'belgaum': { lat: 15.8524, lon: 74.5042 },
  'hubballi': { lat: 15.3582, lon: 75.1324 },
  'hubli': { lat: 15.3582, lon: 75.1324 },
  'dharwad': { lat: 15.4589, lon: 75.0078 },
  'kalaburagi': { lat: 17.3325, lon: 76.8392 },
  'gulbarga': { lat: 17.3325, lon: 76.8392 },
}

export const canonicalDistrict = (raw?: string): string => {
  if (!raw) return ''
  const clean = raw.trim().toLowerCase()
  return DISTRICT_ALIASES[clean] ?? clean
}

export const resolveCollegeGeo = (college: SeedCollege): CollegeGeoResolution | null => {
  // 1. Preserve exact lat/lng when a college already has real verified coordinates
  if (typeof college.location?.lat === 'number' && typeof college.location?.lng === 'number') {
    return {
      lat: college.location.lat,
      lon: college.location.lng,
      isApproximateDistrict: false,
    }
  }

  // 2. Fallback to district coordinates for distance calculation and map display
  const districtKey = canonicalDistrict(college.district ?? college.city)
  if (districtKey && DISTRICT_DEFAULT_COORDS[districtKey]) {
    const coords = DISTRICT_DEFAULT_COORDS[districtKey]
    // Deterministic micro-jitter based on college ID/name hash to prevent map pin stacking
    const seed = (college.id || college.name).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    const jitterLat = ((seed % 100) - 50) * 0.0003
    const jitterLng = (((seed * 7) % 100) - 50) * 0.0003
    return {
      lat: Math.round((coords.lat + jitterLat) * 10000) / 10000,
      lon: Math.round((coords.lon + jitterLng) * 10000) / 10000,
      isApproximateDistrict: true,
    }
  }

  return null
}

export const calculateDistanceKm = (args: {
  user: UserGeoLocation
  college: SeedCollege
}): number | null => {
  const geo = resolveCollegeGeo(args.college)
  if (!geo) return null

  return Math.round(haversineDistanceKm({ lat: args.user.lat, lon: args.user.lon }, { lat: geo.lat, lon: geo.lon }) * 10) / 10
}

export interface UserLocationInput {
  district?: string
  city?: string
  pincode?: string
  geo?: UserGeoLocation
}

export const resolveEffectiveGeo = (user?: UserLocationInput): UserGeoLocation => {
  // 1. Live GPS coordinates from device (highest priority)
  if (user?.geo && typeof user.geo.lat === 'number' && typeof user.geo.lon === 'number') {
    return user.geo
  }

  // 2. Specific PIN code coordinates
  if (user?.pincode) {
    const cleanPin = user.pincode.trim()
    if (PINCODE_COORDS[cleanPin]) {
      return PINCODE_COORDS[cleanPin]
    }
  }

  // 3. Specific Locality / City coordinates
  if (user?.city) {
    const cleanCity = user.city.trim().toLowerCase()
    if (LOCALITY_COORDS[cleanCity]) {
      return LOCALITY_COORDS[cleanCity]
    }
    for (const [key, coords] of Object.entries(LOCALITY_COORDS)) {
      if (cleanCity.includes(key)) {
        return coords
      }
    }
  }

  // 4. District headquarters coordinates (fallback)
  const userCanonDistrict = canonicalDistrict(user?.district ?? user?.city)
  if (userCanonDistrict && DISTRICT_DEFAULT_COORDS[userCanonDistrict]) {
    return DISTRICT_DEFAULT_COORDS[userCanonDistrict]
  }

  // 5. Default Karnataka center (Vidhana Soudha / MG Road)
  return { lat: 12.9784, lon: 77.6006 }
}

export const rankColleges = (args: {
  colleges: SeedCollege[]
  user?: UserLocationInput
}): RankedCollege[] => {
  const effectiveGeo: UserGeoLocation = resolveEffectiveGeo(args.user)
  const userCanonDistrict = canonicalDistrict(args.user?.district ?? args.user?.city)
  const userCity = args.user?.city ? normalizeText(args.user.city) : null

  return args.colleges
    .map((c) => {
      const collegeCanonDistrict = canonicalDistrict(c.district)
      const sameDistrict = userCanonDistrict ? collegeCanonDistrict === userCanonDistrict : false
      const sameCity = userCity ? normalizeText(c.city) === userCity : false

      const geo = resolveCollegeGeo(c) ?? undefined
      const distanceKm = geo ? calculateDistanceKm({ user: effectiveGeo, college: c }) ?? undefined : undefined

      // Ranking priority:
      // 1. Same District (+200 pts)
      // 2. Same City (+60 pts)
      // 3. Government / Aided (+20 / +10 pts)
      // 4. Closer distance (+bonus)
      let score = 0
      if (sameDistrict) score += 200
      if (sameCity) score += 60

      const typeLower = normalizeText(c.type)
      const govtBonus = (typeLower.includes('government') || typeLower.includes('govt')) ? 20 : typeLower.includes('aided') ? 10 : 0
      score += govtBonus

      if (typeof c.ranking === 'number') {
        const rankBonus = Math.max(0, 25 - Math.min(25, c.ranking))
        score += rankBonus
      }

      if (typeof distanceKm === 'number') {
        // Colleges closer to the student get higher distance score bonus
        const distanceBonus = Math.max(0, 200 - Math.round(distanceKm))
        score += distanceBonus
      }

      const approxNote = geo?.isApproximateDistrict ? ' (approx)' : ''
      const explanation = `${c.name} ranked by district match (${c.district}), distance (${distanceKm ? distanceKm + ' km' + approxNote : 'N/A'}), and type.`

      return { college: c, score, distanceKm, explanation, geo }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if ((a.distanceKm ?? Infinity) !== (b.distanceKm ?? Infinity)) return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
      return a.college.id.localeCompare(b.college.id)
    })
}

export const getNearbyColleges = (args: {
  colleges: SeedCollege[]
  courseId: string
  selectedExamIds?: string[]
  user?: UserLocationInput
  radiusKm?: number
  limit?: number
}): RankedCollege[] => {
  const filtered = filterColleges({
    colleges: args.colleges,
    courseId: args.courseId,
    selectedExamIds: args.selectedExamIds,
  })

  const ranked = rankColleges({ colleges: filtered, user: args.user })

  const radiusKm = args.radiusKm
  const withinRadius =
    typeof radiusKm === 'number'
      ? ranked.filter((x) => typeof x.distanceKm === 'number' && x.distanceKm <= radiusKm)
      : ranked

  const limit = args.limit
  return typeof limit === 'number' ? withinRadius.slice(0, limit) : withinRadius
}
