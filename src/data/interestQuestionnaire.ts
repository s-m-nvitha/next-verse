export type InterestId =
  | 'technology'
  | 'problem_solving'
  | 'creativity'
  | 'leadership'
  | 'communication'
  | 'helping_people'
  | 'mathematics'
  | 'biology'
  | 'research'
  | 'innovation'
  | 'business'
  | 'finance'
  | 'teaching'
  | 'environment'
  | 'sports'
  | 'public_service'
  | 'psychology'
  | 'writing'
  | 'media'
  | 'computers'
  | 'ai_robotics'
  | 'cybersecurity'
  | 'entrepreneurship'
  | 'law'
  | 'architecture'
  | 'animation'
  | 'gaming'
  | 'medicine'

export interface InterestQuestionOption {
  id: string
  label: string
  mappedInterests: InterestId[]
  weight: number
}

export interface InterestQuestion {
  id: string
  question: string
  options: InterestQuestionOption[]
  multiSelect: boolean
}

export const INTEREST_QUESTIONS: InterestQuestion[] = [
  {
    id: 'iq_1',
    question: 'Which activities do you enjoy the most?',
    multiSelect: true,
    options: [
      { id: 'iq_1_a', label: 'Building or fixing gadgets', mappedInterests: ['technology', 'problem_solving', 'innovation'], weight: 3 },
      { id: 'iq_1_b', label: 'Drawing/designing visuals', mappedInterests: ['creativity', 'animation', 'architecture'], weight: 3 },
      { id: 'iq_1_c', label: 'Helping people with health issues', mappedInterests: ['helping_people', 'medicine', 'biology'], weight: 3 },
      { id: 'iq_1_d', label: 'Organizing events/leading teams', mappedInterests: ['leadership', 'communication'], weight: 3 },
    ],
  },
  {
    id: 'iq_2',
    question: 'What type of problems excite you?',
    multiSelect: true,
    options: [
      { id: 'iq_2_a', label: 'Math/logic puzzles', mappedInterests: ['mathematics', 'problem_solving'], weight: 3 },
      { id: 'iq_2_b', label: 'Computer/software challenges', mappedInterests: ['computers', 'technology', 'problem_solving'], weight: 3 },
      { id: 'iq_2_c', label: 'Understanding human behavior', mappedInterests: ['psychology', 'research'], weight: 3 },
      { id: 'iq_2_d', label: 'Business/market decisions', mappedInterests: ['business', 'finance', 'entrepreneurship'], weight: 3 },
    ],
  },
  {
    id: 'iq_3',
    question: 'Which subjects do you find most interesting?',
    multiSelect: true,
    options: [
      { id: 'iq_3_a', label: 'Computer Science', mappedInterests: ['computers', 'technology'], weight: 3 },
      { id: 'iq_3_b', label: 'Biology', mappedInterests: ['biology', 'medicine'], weight: 3 },
      { id: 'iq_3_c', label: 'Mathematics', mappedInterests: ['mathematics', 'problem_solving'], weight: 3 },
      { id: 'iq_3_d', label: 'Economics/Commerce', mappedInterests: ['business', 'finance'], weight: 3 },
    ],
  },
  {
    id: 'iq_4',
    question: 'What kind of work environment do you prefer?',
    multiSelect: true,
    options: [
      { id: 'iq_4_a', label: 'Lab/hospital/clinical settings', mappedInterests: ['medicine', 'research', 'helping_people'], weight: 3 },
      { id: 'iq_4_b', label: 'Office with computers and tools', mappedInterests: ['computers', 'technology', 'cybersecurity'], weight: 3 },
      { id: 'iq_4_c', label: 'Outdoor/field work', mappedInterests: ['environment', 'sports'], weight: 3 },
      { id: 'iq_4_d', label: 'Client-facing/public speaking', mappedInterests: ['communication', 'media', 'law'], weight: 3 },
    ],
  },
  {
    id: 'iq_5',
    question: 'When working on a project, what role do you usually take?',
    multiSelect: true,
    options: [
      { id: 'iq_5_a', label: 'Planner/leader', mappedInterests: ['leadership', 'public_service'], weight: 3 },
      { id: 'iq_5_b', label: 'Technical implementer', mappedInterests: ['technology', 'computers', 'problem_solving'], weight: 3 },
      { id: 'iq_5_c', label: 'Creative designer', mappedInterests: ['creativity', 'animation', 'gaming'], weight: 3 },
      { id: 'iq_5_d', label: 'Researcher/analyst', mappedInterests: ['research', 'innovation', 'mathematics'], weight: 3 },
    ],
  },
  {
    id: 'iq_6',
    question: 'Which of these do you enjoy doing in your free time?',
    multiSelect: true,
    options: [
      { id: 'iq_6_a', label: 'Coding / exploring apps', mappedInterests: ['computers', 'technology', 'ai_robotics'], weight: 3 },
      { id: 'iq_6_b', label: 'Reading/writing stories or articles', mappedInterests: ['writing', 'media', 'communication'], weight: 3 },
      { id: 'iq_6_c', label: 'Playing sports/fitness', mappedInterests: ['sports', 'leadership'], weight: 3 },
      { id: 'iq_6_d', label: 'Learning about health/science', mappedInterests: ['biology', 'medicine', 'research'], weight: 3 },
    ],
  },
  {
    id: 'iq_7',
    question: 'Which statement fits you best?',
    multiSelect: true,
    options: [
      { id: 'iq_7_a', label: 'I like experimenting and finding new methods', mappedInterests: ['research', 'innovation'], weight: 3 },
      { id: 'iq_7_b', label: 'I like convincing people with logical arguments', mappedInterests: ['law', 'communication'], weight: 3 },
      { id: 'iq_7_c', label: 'I like creating visual experiences', mappedInterests: ['creativity', 'animation'], weight: 3 },
      { id: 'iq_7_d', label: 'I like planning money and resources', mappedInterests: ['finance', 'business'], weight: 3 },
    ],
  },
  {
    id: 'iq_8',
    question: 'Which career-related topics do you follow online?',
    multiSelect: true,
    options: [
      { id: 'iq_8_a', label: 'AI/Robotics', mappedInterests: ['ai_robotics', 'technology', 'innovation'], weight: 3 },
      { id: 'iq_8_b', label: 'Cybersecurity', mappedInterests: ['cybersecurity', 'computers', 'problem_solving'], weight: 3 },
      { id: 'iq_8_c', label: 'Medicine/health', mappedInterests: ['medicine', 'biology', 'helping_people'], weight: 3 },
      { id: 'iq_8_d', label: 'Media/content creation', mappedInterests: ['media', 'writing', 'creativity'], weight: 3 },
    ],
  },
  {
    id: 'iq_9',
    question: 'What motivates you the most?',
    multiSelect: true,
    options: [
      { id: 'iq_9_a', label: 'Solving tough problems', mappedInterests: ['problem_solving', 'mathematics'], weight: 3 },
      { id: 'iq_9_b', label: 'Helping society directly', mappedInterests: ['public_service', 'helping_people', 'teaching'], weight: 3 },
      { id: 'iq_9_c', label: 'Building something innovative', mappedInterests: ['innovation', 'entrepreneurship', 'technology'], weight: 3 },
      { id: 'iq_9_d', label: 'Expressing ideas creatively', mappedInterests: ['creativity', 'writing', 'animation'], weight: 3 },
    ],
  },
  {
    id: 'iq_10',
    question: 'Pick the tasks you would enjoy in a future job.',
    multiSelect: true,
    options: [
      { id: 'iq_10_a', label: 'Designing buildings/spaces', mappedInterests: ['architecture', 'creativity'], weight: 3 },
      { id: 'iq_10_b', label: 'Working with patients', mappedInterests: ['medicine', 'helping_people'], weight: 3 },
      { id: 'iq_10_c', label: 'Writing code/building software', mappedInterests: ['computers', 'technology'], weight: 3 },
      { id: 'iq_10_d', label: 'Managing business operations', mappedInterests: ['business', 'leadership', 'finance'], weight: 3 },
    ],
  },
  // 10 more questions (kept concise but production-usable)
  {
    id: 'iq_11',
    question: 'Which competitions would you prefer?',
    multiSelect: true,
    options: [
      { id: 'iq_11_a', label: 'Hackathons', mappedInterests: ['computers', 'innovation', 'technology'], weight: 3 },
      { id: 'iq_11_b', label: 'Debates / MUN', mappedInterests: ['communication', 'law', 'public_service'], weight: 3 },
      { id: 'iq_11_c', label: 'Science fairs', mappedInterests: ['research', 'biology', 'innovation'], weight: 3 },
      { id: 'iq_11_d', label: 'Business plan contests', mappedInterests: ['business', 'entrepreneurship', 'finance'], weight: 3 },
    ],
  },
  {
    id: 'iq_12',
    question: 'Which tools do you like using?',
    multiSelect: true,
    options: [
      { id: 'iq_12_a', label: 'Computers/software', mappedInterests: ['computers', 'technology', 'cybersecurity'], weight: 3 },
      { id: 'iq_12_b', label: 'Art/design tools', mappedInterests: ['creativity', 'animation', 'gaming'], weight: 3 },
      { id: 'iq_12_c', label: 'Lab kits/experiments', mappedInterests: ['research', 'biology', 'medicine'], weight: 3 },
      { id: 'iq_12_d', label: 'Spreadsheets/accounts', mappedInterests: ['finance', 'mathematics', 'business'], weight: 3 },
    ],
  },
  {
    id: 'iq_13',
    question: 'Which areas would you like to learn more about?',
    multiSelect: true,
    options: [
      { id: 'iq_13_a', label: 'AI/ML', mappedInterests: ['ai_robotics', 'computers', 'mathematics'], weight: 3 },
      { id: 'iq_13_b', label: 'Human mind/behavior', mappedInterests: ['psychology', 'research'], weight: 3 },
      { id: 'iq_13_c', label: 'Law and justice', mappedInterests: ['law', 'public_service'], weight: 3 },
      { id: 'iq_13_d', label: 'Health and medicine', mappedInterests: ['medicine', 'biology'], weight: 3 },
    ],
  },
  {
    id: 'iq_14',
    question: 'What do your friends ask help for?',
    multiSelect: true,
    options: [
      { id: 'iq_14_a', label: 'Explaining concepts/teaching', mappedInterests: ['teaching', 'communication'], weight: 3 },
      { id: 'iq_14_b', label: 'Fixing phone/laptop', mappedInterests: ['computers', 'technology', 'problem_solving'], weight: 3 },
      { id: 'iq_14_c', label: 'Creative edits/graphics', mappedInterests: ['creativity', 'media', 'animation'], weight: 3 },
      { id: 'iq_14_d', label: 'Handling money planning', mappedInterests: ['finance', 'mathematics'], weight: 3 },
    ],
  },
  {
    id: 'iq_15',
    question: 'Which type of reading do you prefer?',
    multiSelect: true,
    options: [
      { id: 'iq_15_a', label: 'Tech blogs', mappedInterests: ['technology', 'computers'], weight: 3 },
      { id: 'iq_15_b', label: 'Business/news', mappedInterests: ['business', 'finance', 'media'], weight: 3 },
      { id: 'iq_15_c', label: 'Science/medical articles', mappedInterests: ['biology', 'medicine', 'research'], weight: 3 },
      { id: 'iq_15_d', label: 'Stories/poems', mappedInterests: ['writing', 'creativity'], weight: 3 },
    ],
  },
  {
    id: 'iq_16',
    question: 'Which project would you pick?',
    multiSelect: true,
    options: [
      { id: 'iq_16_a', label: 'Create a simple game', mappedInterests: ['gaming', 'computers', 'creativity'], weight: 3 },
      { id: 'iq_16_b', label: 'Design a house plan', mappedInterests: ['architecture', 'mathematics', 'creativity'], weight: 3 },
      { id: 'iq_16_c', label: 'Study a disease and solutions', mappedInterests: ['medicine', 'research', 'biology'], weight: 3 },
      { id: 'iq_16_d', label: 'Start a small online business', mappedInterests: ['entrepreneurship', 'business', 'media'], weight: 3 },
    ],
  },
  {
    id: 'iq_17',
    question: 'Which skill do you want to master?',
    multiSelect: true,
    options: [
      { id: 'iq_17_a', label: 'Cyber safety', mappedInterests: ['cybersecurity', 'computers'], weight: 3 },
      { id: 'iq_17_b', label: 'Public speaking', mappedInterests: ['communication', 'leadership'], weight: 3 },
      { id: 'iq_17_c', label: 'Animation/visual storytelling', mappedInterests: ['animation', 'creativity', 'media'], weight: 3 },
      { id: 'iq_17_d', label: 'Medical basics', mappedInterests: ['medicine', 'biology'], weight: 3 },
    ],
  },
  {
    id: 'iq_18',
    question: 'Which goals matter to you?',
    multiSelect: true,
    options: [
      { id: 'iq_18_a', label: 'Make a positive impact', mappedInterests: ['public_service', 'helping_people', 'teaching'], weight: 3 },
      { id: 'iq_18_b', label: 'Innovate and build new products', mappedInterests: ['innovation', 'technology', 'entrepreneurship'], weight: 3 },
      { id: 'iq_18_c', label: 'Become financially strong', mappedInterests: ['finance', 'business'], weight: 3 },
      { id: 'iq_18_d', label: 'Create art and stories', mappedInterests: ['creativity', 'writing', 'media'], weight: 3 },
    ],
  },
  {
    id: 'iq_19',
    question: 'Which type of tasks do you prefer?',
    multiSelect: true,
    options: [
      { id: 'iq_19_a', label: 'Working with people', mappedInterests: ['communication', 'helping_people', 'psychology'], weight: 3 },
      { id: 'iq_19_b', label: 'Working with systems/logic', mappedInterests: ['problem_solving', 'computers', 'mathematics'], weight: 3 },
      { id: 'iq_19_c', label: 'Working with visuals/design', mappedInterests: ['creativity', 'architecture', 'animation'], weight: 3 },
      { id: 'iq_19_d', label: 'Working with money/business', mappedInterests: ['finance', 'business', 'entrepreneurship'], weight: 3 },
    ],
  },
  {
    id: 'iq_20',
    question: 'Which statement describes your future preference?',
    multiSelect: true,
    options: [
      { id: 'iq_20_a', label: 'I want to build tech solutions', mappedInterests: ['technology', 'computers', 'ai_robotics'], weight: 3 },
      { id: 'iq_20_b', label: 'I want to serve in public roles', mappedInterests: ['public_service', 'leadership', 'law'], weight: 3 },
      { id: 'iq_20_c', label: 'I want to work in healthcare', mappedInterests: ['medicine', 'helping_people'], weight: 3 },
      { id: 'iq_20_d', label: 'I want a creative career', mappedInterests: ['creativity', 'media', 'animation'], weight: 3 },
    ],
  },
]
