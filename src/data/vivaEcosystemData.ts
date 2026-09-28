export interface VivaDomain {
  id: string;
  name: string;
  iconName: 'Landmark' | 'BookOpen' | 'Brain' | 'FlaskConical' | 'Languages' | 'Scale' | 'BookOpenText' | 'GraduationCap';
  badgeColor: string;
  gradientTheme: string;
  accentColor: string;
  topics: string[];
  questionCount: number;
  resourcesCount: number;
  description: string;
}

export interface VivaResourceItem {
  id: string;
  categoryId: string;
  type: 'link' | 'pdf';
  title: string;
  sourceName: string;
  sourceUrl?: string;
  fileName?: string;
  fileSize?: string;
  date: string;
  pagesCount?: number;
  aiIndexed: boolean;
  difficulty: 'Undergraduate' | 'Graduate' | 'Doctoral / Post-Doc';
  description: string;
  author: string;
  institution: string;
  keywords: string[];
}

export interface VivaQuestionItem {
  id: string;
  categoryId: string;
  questionNumber: number;
  question: string;
  subtopic: string;
  difficulty: 'Undergraduate' | 'Graduate' | 'Doctoral';
  timeLimitSec: number;
  expectedKeyPoints: string[];
  sources: string[];
  sampleStrongAnswer: string;
}

export interface VivaEvaluation {
  verdict: 'Strong answer' | 'Needs deeper evidence' | 'Satisfactory' | 'Exceptional Defense';
  overallScore: number;
  knowledgeScore: number;
  accuracyScore: number;
  relevanceScore: number;
  structureScore: number;
  evidenceScore: number;
  confidenceScore: number;
  missingPoints: string[];
  feedback: string;
  improvementTip: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  quizzes: number;
  accuracy: number;
  streak: number;
  level: string;
  avatar: string;
  institution: string;
  category: string;
  badge: string;
}

// 8 Visually Differentiated Academic Domains as strictly specified
export const VIVA_DOMAINS: VivaDomain[] = [
  {
    id: 'history',
    name: 'History',
    iconName: 'Landmark',
    badgeColor: 'bg-rose-500',
    accentColor: '#f43f5e',
    gradientTheme: 'from-rose-950 via-slate-900 to-zinc-950 border-rose-500/60 shadow-rose-900/30',
    topics: [
      'Islamic History',
      'Indian History',
      'World History',
      'Political History',
      'Civilization Studies'
    ],
    questionCount: 380,
    resourcesCount: 42,
    description: 'Oral examination and critical defense of historiography, archival methodologies, statecraft, and dynastic transformations.'
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    iconName: 'BookOpen',
    badgeColor: 'bg-emerald-500',
    accentColor: '#10b981',
    gradientTheme: 'from-emerald-950 via-slate-900 to-zinc-950 border-emerald-500/60 shadow-emerald-900/30',
    topics: [
      "Qur'an & Exegesis",
      'Hadith Sciences',
      'Fiqh (Jurisprudence)',
      'Usul al-Fiqh',
      'Aqaid & Kalam',
      'Seerah Nabawiyyah',
      'Islamic Civilization',
      'Comparative Religion'
    ],
    questionCount: 520,
    resourcesCount: 65,
    description: 'Scholarly oral viva assessing primary textual derivations, chain verification, legal hermeneutics, and theological dialectic.'
  },
  {
    id: 'logic-reasoning',
    name: 'Logic & Reasoning',
    iconName: 'Brain',
    badgeColor: 'bg-cyan-500',
    accentColor: '#06b6d4',
    gradientTheme: 'from-cyan-950 via-slate-900 to-zinc-950 border-cyan-500/60 shadow-cyan-900/30',
    topics: [
      'Critical Thinking',
      'Formal Logic',
      'Informal Fallacies',
      'Epistemology & Arguments',
      'Analytical Philosophy',
      'Deductive Proof Systems'
    ],
    questionCount: 290,
    resourcesCount: 31,
    description: 'Defense of truth-value matrices, modal propositions, analytical consistency, and structured argumentative rebuttal.'
  },
  {
    id: 'science',
    name: 'Science & Physics',
    iconName: 'FlaskConical',
    badgeColor: 'bg-sky-500',
    accentColor: '#0ea5e9',
    gradientTheme: 'from-sky-950 via-slate-900 to-zinc-950 border-sky-500/60 shadow-sky-900/30',
    topics: [
      'Quantum Mechanics',
      'Thermodynamics',
      'Molecular Biophysics',
      'Electromagnetism',
      'Neuroscience',
      'Astrophysics'
    ],
    questionCount: 440,
    resourcesCount: 48,
    description: 'Rigorous oral explanation of fundamental physical laws, experimental validations, mathematical models, and empirical proofs.'
  },
  {
    id: 'arabic',
    name: 'Arabic Linguistics',
    iconName: 'Languages',
    badgeColor: 'bg-amber-500',
    accentColor: '#f59e0b',
    gradientTheme: 'from-amber-950 via-slate-900 to-zinc-950 border-amber-500/60 shadow-amber-900/30',
    topics: [
      'Nahw (Syntax)',
      'Sarf (Morphology)',
      'Balagha (Rhetoric)',
      'Classical Jahiliyyah Poetry',
      'Lexicographical Etymology',
      'Semantics'
    ],
    questionCount: 310,
    resourcesCount: 38,
    description: 'Oral parsing (I’rab), inflectional patterns, metaphorical devices in classical prose, and linguistic structural analysis.'
  },
  {
    id: 'political-science',
    name: 'Political Science',
    iconName: 'Scale',
    badgeColor: 'bg-indigo-500',
    accentColor: '#6366f1',
    gradientTheme: 'from-indigo-950 via-slate-900 to-zinc-950 border-indigo-500/60 shadow-indigo-900/30',
    topics: [
      'Governance Models',
      'International Relations',
      'Constitutional Law',
      'Sovereignty Theories',
      'Comparative Politics',
      'Geopolitics'
    ],
    questionCount: 260,
    resourcesCount: 29,
    description: 'Oral evaluation on state authority, judicial oversight, treaty mechanics, balance of power, and systemic political theory.'
  },
  {
    id: 'literature',
    name: 'Literature & Rhetoric',
    iconName: 'BookOpenText',
    badgeColor: 'bg-purple-500',
    accentColor: '#a855f7',
    gradientTheme: 'from-purple-950 via-slate-900 to-zinc-950 border-purple-500/60 shadow-purple-900/30',
    topics: [
      'Comparative Literature',
      'Classical Epics',
      'Narrative Poetics',
      'Critical Theory',
      'Post-Colonial Hermeneutics',
      'Dramaturgy'
    ],
    questionCount: 220,
    resourcesCount: 27,
    description: 'Oral defense of thematic allegories, stylistic conventions, textual deconstruction, and world literary canons.'
  },
  {
    id: 'general-academic',
    name: 'General Academic Viva',
    iconName: 'GraduationCap',
    badgeColor: 'bg-teal-500',
    accentColor: '#14b8a6',
    gradientTheme: 'from-teal-950 via-slate-900 to-zinc-950 border-teal-500/60 shadow-teal-900/30',
    topics: [
      'Doctoral Thesis Defense',
      'Research Methodology',
      'Peer Review Ethics',
      'Epistemological Integrity',
      'Data Analysis Validation',
      'Academic Publishing'
    ],
    questionCount: 350,
    resourcesCount: 50,
    description: 'Comprehensive interdisciplinary oral defense simulation modeled on university dissertation and post-graduate viva boards.'
  }
];

// Initial Reference Links and Uploaded Documents partitioned by category
export const SAMPLE_VIVA_RESOURCES: VivaResourceItem[] = [
  // History Links
  {
    id: 'res-link-1',
    categoryId: 'history',
    type: 'link',
    title: 'Wikipedia — Ottoman Empire Administrative Reforms',
    sourceName: 'Wikipedia Academic Edition',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tanzimat',
    date: 'Sep 22, 2026',
    aiIndexed: true,
    difficulty: 'Undergraduate',
    author: 'Wikimedia Collaborative Archive',
    institution: 'Global Open Knowledge',
    keywords: ['Tanzimat', 'Gulhane Edict', 'Sublime Porte', 'Modernization'],
    description: 'Historical overview of the 1839–1876 Tanzimat period, detailing the transition toward centralized bureaucracy, military conscription, and civic equality.'
  },
  {
    id: 'res-link-2',
    categoryId: 'history',
    type: 'link',
    title: 'JSTOR — Ottoman Political History & Fiscal Centralization',
    sourceName: 'JSTOR Archive of Scholarly Journals',
    sourceUrl: 'https://www.jstor.org/stable/2006 ottoman tanzimat fiscal',
    date: 'Sep 18, 2026',
    aiIndexed: true,
    difficulty: 'Graduate',
    author: 'Prof. Halil Inalcik & Donald Quataert',
    institution: 'Cambridge University Press / JSTOR',
    keywords: ['Iltizam Tax Farming', 'Nizam-i Cedid', 'Meclis-i Vala', 'Bureaucracy'],
    description: 'Deep archival monograph analyzing the abolition of the Iltizam tax-farming apparatus and the restructuring of the Supreme Council for Judicial Ordinances.'
  },
  {
    id: 'res-link-3',
    categoryId: 'history',
    type: 'link',
    title: 'Britannica — Abbasid Caliphate & Administrative Machinery',
    sourceName: 'Encyclopaedia Britannica Academic',
    sourceUrl: 'https://www.britannica.com/topic/Abbasid-caliphate',
    date: 'Sep 14, 2026',
    aiIndexed: true,
    difficulty: 'Undergraduate',
    author: 'Britannica Senior Editorial Board',
    institution: 'Encyclopaedia Britannica',
    keywords: ['Diwan System', 'Wazirate', 'Bayt al-Hikmah', 'Bureau of Posts (Barid)'],
    description: 'Comprehensive study of Baghdad’s 8th–10th century administrative departments (Diwans), state intelligence courier services (Barid), and the emergence of the Grand Vizier.'
  },
  {
    id: 'res-link-4',
    categoryId: 'history',
    type: 'link',
    title: 'University Lecture — Mughal Administration & Mansabdari Framework',
    sourceName: 'Oxford Academic Video & Manuscript Repository',
    sourceUrl: 'https://ox.ac.uk/lectures/history-mughal-mansab-rank',
    date: 'Sep 10, 2026',
    aiIndexed: true,
    difficulty: 'Doctoral / Post-Doc',
    author: 'Prof. Irfan Habib',
    institution: 'Oxford Center for Asian History',
    keywords: ['Mansabdari', 'Zat & Sawar', 'Jagirdari Crisis', 'Ain-i Akbari'],
    description: 'Lecture transcripts breaking down Akbar’s military-bureaucratic grading system, revenue assessments, and the structural friction between central treasuries and provincial Subahdars.'
  },

  // History PDFs
  {
    id: 'res-pdf-1',
    categoryId: 'history',
    type: 'pdf',
    title: 'History of Ottoman Empire — Tanzimat to Constitutional Era.pdf',
    sourceName: 'University Press Library',
    fileName: 'History_Ottoman_Tanzimat_Reforms.pdf',
    fileSize: '4.8 MB',
    date: 'Sep 23, 2026',
    pagesCount: 32,
    aiIndexed: true,
    difficulty: 'Graduate',
    author: 'Dr. Selim Deringil',
    institution: 'Bogazici University Historiography',
    keywords: ['Sultans Abdulmejid', 'Hatt-i Sharif', 'Provincial Vilayets', 'Code of Commerce'],
    description: 'Rigorous peer-reviewed chapter dissecting the transformation of the Ottoman millet framework, penal codes, and judicial syncretism under Sultan Abdülmecid I.'
  },
  {
    id: 'res-pdf-2',
    categoryId: 'history',
    type: 'pdf',
    title: 'Historiography of Mughal Agrarian Systems & Revenue Codes.pdf',
    sourceName: 'Aligarh Historiographical Press',
    fileName: 'Mughal_Agrarian_Revenue_Zabt.pdf',
    fileSize: '6.2 MB',
    date: 'Sep 21, 2026',
    pagesCount: 46,
    aiIndexed: true,
    difficulty: 'Doctoral / Post-Doc',
    author: 'Prof. Nurul Hasan',
    institution: 'Centre of Advanced Study in History',
    keywords: ['Zabt System', 'Todar Mal Bandobast', 'Pargana', 'Amil'],
    description: 'Original survey of land measurement formulas (Bigha), gazetted crop schedules (Dastur), and the socioeconomic stratification of the Zamindari class.'
  },
  {
    id: 'res-pdf-3',
    categoryId: 'history',
    type: 'pdf',
    title: 'Caliphal Governance & Diwan Administration Under the Umayyads.pdf',
    sourceName: 'DHIU Archival Department',
    fileName: 'Umayyad_Diwan_Arabization_Paper.pdf',
    fileSize: '3.1 MB',
    date: 'Sep 19, 2026',
    pagesCount: 24,
    aiIndexed: true,
    difficulty: 'Undergraduate',
    author: 'Dr. Tariq Al-Bishri',
    institution: 'DHIU Historical Institute',
    keywords: ['Arabization of Diwans', 'Abd al-Malik', 'Diwan al-Kharaj', 'Damascus Chancellery'],
    description: 'Monograph investigating Caliph Abd al-Malik’s linguistic transition of fiscal registers from Greek and Persian into Arabic, and the minting of epigraphic Islamic coinage.'
  },

  // Islamic Studies Links & PDFs
  {
    id: 'res-link-is-1',
    categoryId: 'islamic-studies',
    type: 'link',
    title: 'Al-Mustasfa min Ilm al-Usul — Digital Manuscript Reference',
    sourceName: 'Dar al-Kutub al-Ilmiyyah Digitized',
    sourceUrl: 'https://al-maktaba.org/book/mustasfa-ghazali',
    date: 'Sep 21, 2026',
    aiIndexed: true,
    difficulty: 'Doctoral / Post-Doc',
    author: 'Imam Abu Hamid al-Ghazali (d. 505 AH)',
    institution: 'Nizamiyya Academy of Baghdad',
    keywords: ['Maqasid', 'Qat’i Dalalah', 'Hadd & Burhan', 'Istislah'],
    description: 'Primary text exploration into the methodology of legal theory, epistemological premises (Muqaddimah Mantiqiyyah), and the five preservation necessities of Shari’ah.'
  },
  {
    id: 'res-pdf-is-1',
    categoryId: 'islamic-studies',
    type: 'pdf',
    title: 'Classical Usul al-Fiqh Hermeneutics & Qiyas Dialectics.pdf',
    sourceName: 'DHIU Curriculum Series',
    fileName: 'Usul_Fiqh_Qiyas_Epistemology.pdf',
    fileSize: '5.5 MB',
    date: 'Sep 22, 2026',
    pagesCount: 38,
    aiIndexed: true,
    difficulty: 'Graduate',
    author: 'Dr. Faisal Al-Husseini',
    institution: 'DHIU Supreme Academic Council',
    keywords: ['Asl', 'Far’', 'Illah Ratio Legis', 'Takhrij al-Manat'],
    description: 'Systematic pedagogical treatise detailing the 4 components of analogical deduction, testing the soundness of legal causes, and preventing invalid extensions.'
  }
];

// Sample Viva Questions for Live Oral Defense Arena
export const SAMPLE_VIVA_QUESTIONS: Record<string, VivaQuestionItem[]> = {
  history: [
    {
      id: 'vq-hist-1',
      categoryId: 'history',
      questionNumber: 1,
      question: 'What were the major administrative and fiscal reforms introduced during the Ottoman Tanzimat period, and how did they reshape the balance of power between the Sublime Porte and provincial governors?',
      subtopic: 'Ottoman Empire & Modern Statecraft (1839–1876)',
      difficulty: 'Graduate',
      timeLimitSec: 90,
      expectedKeyPoints: [
        'Promulgation of the 1839 Hatt-i Sharif of Gülhane and 1856 Hatt-i Hümayun establishing civic equality regardless of religion.',
        'Abolition of the decentralized Iltizam (tax-farming) apparatus in favor of direct salary-based imperial civil servants (Muhassils).',
        'Establishment of the Council of State (Şûrâ-yı Devlet) and specialized bureaucratic ministries directly answering to the Grand Vizier.',
        'The Vilayet Law of 1864 reorganizing provincial governorships into hierarchical administrative tiers (Vilayet, Sanjak, Kaza, Nahiye) curbing autonomy of local ayans.',
        'Codification of secular and commercial laws (Mecelle) harmonizing Hanafi jurisprudence with European procedural norms.'
      ],
      sources: [
        'Selim Deringil, The Well-Protected Domains (1998)',
        'Halil Inalcik, Studies in Ottoman Social and Economic History (1980)',
        'JSTOR Archive: Ottoman Centralization Monograph 2006'
      ],
      sampleStrongAnswer: 'The Ottoman Tanzimat began fundamentally with the 1839 Edict of Gülhane, introducing guaranteed security of life, honor, and property. Fiscally, the Porte sought to dismantle the parasitic Iltizam tax-farming mechanism, replacing it with salaried provincial collectors. Administratively, the 1864 Vilayet Law established structured hierarchical divisions from the governor-general (Vali) down to the district council, drastically curtailing the feudal autonomy of local notables (Ayans) while anchoring legal codification under the Mecelle and Supreme Council.'
    },
    {
      id: 'vq-hist-2',
      categoryId: 'history',
      questionNumber: 2,
      question: 'Analyze Akbar’s Mansabdari military-administrative framework: How did the dual metrics of Zat and Sawar resolve internal tribal factions and guarantee imperial revenue discipline?',
      subtopic: 'Mughal Empire & Agrarian Bureaucracy (1570–1605)',
      difficulty: 'Doctoral',
      timeLimitSec: 90,
      expectedKeyPoints: [
        'Definition of Zat: Personal rank determining individual seniority, salary entitlements, and court protocol.',
        'Definition of Sawar: Cavalry quota specifying the exact number of mounted troopers and warhorses the officer was mandated to maintain for imperial service.',
        'The Dagho-Chehra system (horse branding and descriptive biometric rolls) preventing phantom cavalry fraud.',
        'The integration of Rajput chieftains, Persian bureaucrats, and Turani commanders into a single meritocratic imperial hierarchy.'
      ],
      sources: ['Irfan Habib, Agrarian System of Mughal India', 'Ain-i Akbari by Abu’l-Fazl'],
      sampleStrongAnswer: 'Akbar decoupled social caste from military command through the Mansabdari matrix. Zat established the nobleman’s personal salary and precedence, while Sawar was a strictly audited operational requirement dictating combat readiness. By mandating regular inspections with horse-branding (Dagh), Akbar eradicated mercenary ghost-detachments and welded disparate Rajput and Turani factions into a centralized, salaried aristocracy.'
    },
    {
      id: 'vq-hist-3',
      categoryId: 'history',
      questionNumber: 3,
      question: 'Critique the Arabization of the Umayyad chancelleries under Caliph Abd al-Malik ibn Marwan: What sociopolitical catalysts necessitated the transition from Greek and Persian registers?',
      subtopic: 'Early Islamic Caliphate & Epigraphic Reform (685–705 CE)',
      difficulty: 'Graduate',
      timeLimitSec: 90,
      expectedKeyPoints: [
        'Consolidation of imperial identity following the turmoil of the Second Fitna.',
        'Replacement of Byzantine Greek in Damascus and Middle Persian (Pahlavi) in Kufa and Basra with classical Arabic administrative registries.',
        'Coinage reform replacing Sasanian-style fire altars and Byzantine royal portraits with purely epigraphic Quranic inscriptions.',
        'Breakdown of hereditary non-Muslim bureaucratic monopolies in the fiscal Diwans.'
      ],
      sources: ['Tariq Al-Bishri, Arabization of the Umayyad Registries', 'C.E. Bosworth, Islamic Administration'],
      sampleStrongAnswer: 'Following the fragmentation of the Second Fitna, Caliph Abd al-Malik recognized that state sovereignty required administrative unification. By decreeing Arabic as the exclusive medium of the fiscal Diwan al-Kharaj, he transferred institutional power from provincial Byzantine and Persian scribal guilds into the hands of the emerging bilingual Arab-Muslim elite, culminating in the minting of non-iconic, Quranic epigraphic dinars.'
    }
  ],
  'islamic-studies': [
    {
      id: 'vq-is-1',
      categoryId: 'islamic-studies',
      questionNumber: 1,
      question: 'Explain the four foundational pillars (Arkan) of Qiyas (analogical deduction) in Usul al-Fiqh, and defend how the extraction of the ‘Illah (Ratio Legis) prevents subjective whim in legal derivation.',
      subtopic: 'Usul al-Fiqh & Legal Hermeneutics',
      difficulty: 'Doctoral',
      timeLimitSec: 90,
      expectedKeyPoints: [
        'The 4 Pillars: Asl (original case), Far’ (new branch case), Hukm al-Asl (established textual ruling), and ‘Illah (common effective cause).',
        'Criteria for an effective cause: Must be apparent (Zahir), regulated/disciplined (Mundabit), and suitable/rational (Munasib).',
        'Methodologies of discovering the cause: Takhrij al-Manat (extracting the cause), Tanqih al-Manat (refining the cause), and Tahqiq al-Manat (verifying the presence in the new case).',
        'Protection against personal desire (Hawa) through strict linguistic and empirical verification.'
      ],
      sources: [
        'Al-Ghazali, Al-Mustasfa min Ilm al-Usul',
        'Al-Amidi, Al-Ihkam fi Usul al-Ahkam',
        'DHIU Master Syllabus on Jurisprudence'
      ],
      sampleStrongAnswer: 'Qiyas operates on four interconnected pillars: the Asl anchored in text, the Far’ presenting a novel dilemma, the Hukm of the original, and the ‘Illah which bridges them. Crucially, the ‘Illah cannot be arbitrary; it must be Zahir (discernible) and Mundabit (systematically measured). Through rigorous Tanqih al-Manat, extraneous attributes are stripped away until the exact legal rationale is isolated, ensuring that extrapolation is mathematically bound by textual intent rather than discretionary conjecture.'
    }
  ]
};

// Initial Leaderboard Data
export const INITIAL_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Dr. Zayd Scholar',
    points: 9840,
    quizzes: 48,
    accuracy: 97.4,
    streak: 14,
    level: 'Doctoral Fellow',
    avatar: '🎓',
    institution: 'Oxford Islamic Studies',
    category: 'History',
    badge: '👑 Master Historian'
  },
  {
    rank: 2,
    name: 'Maryam Oxford',
    points: 9120,
    quizzes: 42,
    accuracy: 94.8,
    streak: 9,
    level: 'Senior Researcher',
    avatar: '🔬',
    institution: 'Cambridge Historiography',
    category: 'History',
    badge: '⭐ Archive Specialist'
  },
  {
    rank: 3,
    name: 'Ahmad DHIU',
    points: 8750,
    quizzes: 39,
    accuracy: 93.1,
    streak: 8,
    level: 'Graduate Scholar',
    avatar: '📚',
    institution: 'Darul Huda Islamic University',
    category: 'Islamic Studies',
    badge: '🛡️ Jurisprudence Chair'
  },
  {
    rank: 4,
    name: 'Prof. Kenji Takahashi',
    points: 8430,
    quizzes: 36,
    accuracy: 91.5,
    streak: 7,
    level: 'Faculty Chair',
    avatar: '⚡',
    institution: 'Tokyo Tech & Acoustics',
    category: 'Science',
    badge: '🌌 Acoustic Master'
  },
  {
    rank: 5,
    name: 'Dr. Sarah Lin',
    points: 8100,
    quizzes: 33,
    accuracy: 89.9,
    streak: 6,
    level: 'Post-Doc Fellow',
    avatar: '🧠',
    institution: 'MIT Cognitive Lab',
    category: 'Logic & Reasoning',
    badge: '💡 Analytical Proof'
  },
  {
    rank: 6,
    name: 'Tariq Al-Andalusi',
    points: 7890,
    quizzes: 31,
    accuracy: 88.5,
    streak: 5,
    level: 'Senior Candidate',
    avatar: '🖋️',
    institution: 'Sorbonne Arabic Dept',
    category: 'Arabic',
    badge: '📜 Balagha Scholar'
  },
  {
    rank: 7,
    name: 'Elena Rostova',
    points: 7650,
    quizzes: 29,
    accuracy: 87.2,
    streak: 4,
    level: 'Doctoral Candidate',
    avatar: '🎻',
    institution: 'Vienna Comparative Lit',
    category: 'Literature',
    badge: '📖 Narrative Theorist'
  },
  {
    rank: 8,
    name: 'Bilal Al-Qurashi',
    points: 7320,
    quizzes: 27,
    accuracy: 86.0,
    streak: 4,
    level: 'Research Fellow',
    avatar: '🏛️',
    institution: 'Al-Azhar University',
    category: 'Islamic Studies',
    badge: '⚖️ Hadith Critic'
  }
];
