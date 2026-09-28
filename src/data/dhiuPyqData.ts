import { DhiuClassInfo, DhiuSemesterInfo, DhiuSubjectInfo, DhiuQuestionPaper, DhiuSubjectName } from '../types';

export const DHIU_CLASSES: DhiuClassInfo[] = [
  { id: 1, name: 'Class 1', level: 'Junior Basic', subjectCount: 12, totalPapers: 57, description: 'Foundational Islamic & Modern Primary Studies' },
  { id: 2, name: 'Class 2', level: 'Junior Basic', subjectCount: 12, totalPapers: 62, description: 'Elementary Arabic Grammar, Hadith & General Science' },
  { id: 3, name: 'Class 3', level: 'Upper Primary', subjectCount: 12, totalPapers: 59, description: 'Intermediate Fiqh, Swarf & Mathematics' },
  { id: 4, name: 'Class 4', level: 'Upper Primary', subjectCount: 12, totalPapers: 65, description: 'Classical Literature, Seerah & Environmental Studies' },
  { id: 5, name: 'Class 5', level: 'Secondary', subjectCount: 12, totalPapers: 71, description: 'Advanced Nahv, Islamic Jurisprudence & English Prose' },
  { id: 6, name: 'Class 6', level: 'Secondary', subjectCount: 12, totalPapers: 68, description: 'Comparative Fiqh, World History & Physical Sciences' },
  { id: 7, name: 'Class 7', level: 'Senior Secondary', subjectCount: 12, totalPapers: 74, description: 'Kalam, Tasawwuf, Rhetoric & Advanced Mathematics' },
  { id: 8, name: 'Class 8', level: 'Senior Secondary', subjectCount: 12, totalPapers: 70, description: 'Hadith Principles, Usul al-Fiqh & Social Sciences' },
  { id: 9, name: 'Class 9', level: 'Degree Prep', subjectCount: 12, totalPapers: 78, description: 'Balaghah, Comprehensive Islamic History & Literature' },
  { id: 10, name: 'Class 10', level: 'Degree Prep', subjectCount: 12, totalPapers: 82, description: 'Graduation Synthesis, Board Exams & Capstone' },
];

export const DHIU_SEMESTERS: DhiuSemesterInfo[] = [
  {
    id: 1,
    name: 'Semester 1',
    termLabel: 'Term 1',
    description: 'First half-yearly cycle encompassing mid-term syllabus units, formative milestones, and half-yearly board examinations.',
    badgeColor: 'emerald',
  },
  {
    id: 2,
    name: 'Semester 2',
    termLabel: 'Term 2',
    description: 'Second annual cycle covering advanced term modules, comprehensive revision syllabi, and final annual promotional examinations.',
    badgeColor: 'teal',
  },
];

export const DHIU_SUBJECTS: DhiuSubjectInfo[] = [
  {
    id: 'aqeeda',
    name: 'Aqeeda',
    arabicName: 'العقيدة الإسلامية وعلم الكلام',
    code: 'AQD-100',
    paperCount: 0,
    category: 'Shari’ah Sciences',
    description: 'Islamic creed, scholastic theology (Ilm al-Kalam), classical treatises (Tahawiyyah, Sanusiyyah), and doctrinal refutations.',
    colorAccent: 'amber',
  },
  {
    id: 'adab',
    name: 'Adab',
    arabicName: 'الأدب العربي والبلاغة',
    code: 'ADB-101',
    paperCount: 48,
    category: 'Linguistic Studies',
    description: 'Classical and modern Arabic poetry, prose comprehension, literary critique, and rhetorical analysis.',
    colorAccent: 'amber',
  },
  {
    id: 'english',
    name: 'English',
    arabicName: 'اللغة الإنجليزية وآدابها',
    code: 'ENG-102',
    paperCount: 57,
    category: 'General Academics',
    description: 'Communicative syntax, reading comprehension, descriptive essay writing, phonetics, and academic prose.',
    colorAccent: 'sky',
  },
  {
    id: 'fiqh',
    name: 'Fiqh',
    arabicName: 'الفقه الإسلامي وأصوله',
    code: 'FQH-103',
    paperCount: 64,
    category: 'Shari’ah Sciences',
    description: 'Shafi’i and Hanafi jurisprudence, Taharah, Salah, Zakah, transactions (Mu’amalat), and contemporary legal issues.',
    colorAccent: 'emerald',
  },
  {
    id: 'hadith',
    name: 'Hadith',
    arabicName: 'الحديث الشريف ومصطلحه',
    code: 'HDT-104',
    paperCount: 52,
    category: 'Shari’ah Sciences',
    description: 'Prophetic traditions, text analysis, chain of narration (Isnad), Matn comprehension, and ethical maxims.',
    colorAccent: 'teal',
  },
  {
    id: 'maths',
    name: 'Maths',
    arabicName: 'الرياضيات والهندسة',
    code: 'MTH-105',
    paperCount: 46,
    category: 'General Academics',
    description: 'Algebraic equations, Euclidean geometry, rational numbers, statistical reasoning, and applied problem solving.',
    colorAccent: 'indigo',
  },
  {
    id: 'nahv',
    name: 'Nahv',
    arabicName: 'علم النحو والإعراب',
    code: 'NHV-106',
    paperCount: 60,
    category: 'Linguistic Studies',
    description: 'Arabic syntax, sentence analysis, structural parsing (I’rab), nominal and verbal constructions, and grammatical governance.',
    colorAccent: 'rose',
  },
  {
    id: 'science',
    name: 'Science',
    arabicName: 'العلوم العامة والطبيعية',
    code: 'SCI-107',
    paperCount: 44,
    category: 'General Academics',
    description: 'Biological ecosystems, physical laws of motion, energy transformation, chemical reactions, and environmental conservation.',
    colorAccent: 'cyan',
  },
  {
    id: 'social-science',
    name: 'Social Science',
    arabicName: 'الدراسات الاجتماعية والجغرافيا',
    code: 'SOC-108',
    paperCount: 42,
    category: 'General Academics',
    description: 'Global topography, constitutional civics, economic developments, human rights, and regional geography.',
    colorAccent: 'orange',
  },
  {
    id: 'swarf',
    name: 'Swarf',
    arabicName: 'علم الصرف والاشتقاق',
    code: 'SRF-109',
    paperCount: 50,
    category: 'Linguistic Studies',
    description: 'Arabic morphological derivation, verbal root patterns (Abwab), conjugation paradigms (Tasreef), and phonetic mutations.',
    colorAccent: 'purple',
  },
  {
    id: 'tareekh',
    name: 'Tareekh',
    arabicName: 'التاريخ والحضارة الإسلامية',
    code: 'TRK-110',
    paperCount: 45,
    category: 'Historical Studies',
    description: 'Prophetic biography (Seerah), Rightly Guided Caliphs, Umayyad & Abbasid eras, and Islamic scholarship chronicles.',
    colorAccent: 'yellow',
  },
  {
    id: 'tasawwuf',
    name: 'Tasawwuf',
    arabicName: 'التصوف والتزكية والأخلاق',
    code: 'TSW-111',
    paperCount: 38,
    category: 'Shari’ah Sciences',
    description: 'Spiritual purification (Tazkiyat an-Nafs), classical ethical treatises (Ihya Ulum ad-Din), Ihsan, and character cultivation.',
    colorAccent: 'emerald',
  },
  {
    id: 'urdu',
    name: 'Urdu',
    arabicName: 'اردو ادب اور قواعد',
    code: 'URD-112',
    paperCount: 41,
    category: 'Linguistic Studies',
    description: 'Classical Urdu poetry (Nazm & Ghazal), prose translations, essay compositions, and epistolary rhetoric.',
    colorAccent: 'pink',
  },
];

// Available Examination Cycles from 2000 to 2026
export const DHIU_YEARS: number[] = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
  2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  2006, 2005, 2004, 2003, 2002, 2001, 2000
];

// Helper to generate realistic subject questions
export function generateExamQuestions(subject: DhiuSubjectName, year: number, classId: number, semesterId: number) {
  const termName = semesterId === 1 ? 'Half-Yearly' : 'Annual';
  
  if (subject === 'English') {
    return [
      {
        sectionTitle: 'SECTION A: READING COMPREHENSION & VOCABULARY',
        instructions: 'Read the following passage carefully and answer all questions in full sentences. (Marks: 20)',
        marksPerQuestion: 4,
        items: [
          {
            qNum: 1,
            text: 'Based on the academic treatise on scholar ethics, explain the primary duty of an aspiring seeker of knowledge.',
            marks: 4,
          },
          {
            qNum: 2,
            text: 'Identify the contextual antonym for "ephemeral" in paragraph 2 and use it in a grammatically sound sentence.',
            marks: 4,
          },
          {
            qNum: 3,
            text: 'How does the author distinguish between superficial information gathering and profound intellectual wisdom?',
            marks: 4,
          },
          {
            qNum: 4,
            text: 'Provide a concise précis (summary) of lines 14–28 in not more than 45 words.',
            marks: 4,
          },
          {
            qNum: 5,
            text: 'Choose the correct preposition: "The lecturer expounded _____ the philosophical dimensions of ethics." (A) into (B) upon (C) with (D) toward',
            marks: 4,
            options: ['(A) into', '(B) upon', '(C) with', '(D) toward']
          }
        ]
      },
      {
        sectionTitle: 'SECTION B: GRAMMAR, SYNTAX & TRANSLATION',
        instructions: 'Attempt all questions. Pay careful attention to grammatical agreement and punctuation. (Marks: 35)',
        marksPerQuestion: 7,
        items: [
          {
            qNum: 6,
            text: 'Transform the following sentence into Reported Indirect Speech: "The Dean announced, \'The submission deadline for the research dissertations will not be extended under any circumstance.\'"',
            marks: 7,
          },
          {
            qNum: 7,
            text: 'Identify the error in tense consistency: "When the scholar had arrived at the library, the students are already assembling the manuscripts."',
            marks: 7,
          },
          {
            qNum: 8,
            text: 'Combine the clauses using an appropriate relative pronoun: "The research repository contains ancient scrolls. The scholars digitized them last winter."',
            marks: 7,
          },
          {
            qNum: 9,
            text: 'Translate the following sentence into accurate literary English: "إنّ التحلّي بالأخلاق الفاضلة يرفع من شأن الباحث في المحافل العلمية."',
            arabicText: 'إنّ التحلّي بالأخلاق الفاضلة يرفع من شأن الباحث في المحافل العلمية.',
            marks: 7,
          },
          {
            qNum: 10,
            text: 'Change the voice from Passive to Active: "The keynote symposium address was eloquently delivered by the visiting professor."',
            marks: 7,
          }
        ]
      },
      {
        sectionTitle: 'SECTION C: DESCRIPTIVE ESSAY & ACADEMIC WRITING',
        instructions: 'Write a comprehensive analytical essay on ONE of the following topics (approx. 250–300 words). (Marks: 45)',
        marksPerQuestion: 45,
        items: [
          {
            qNum: 11,
            text: 'Draft an editorial essay discussing "The Harmonious Integration of Traditional Islamic Disciplines with Contemporary Scientific Inquiry in Higher Education".',
            marks: 45,
          },
          {
            qNum: 12,
            text: 'Write an official formal letter to the Examination Board Registrar requesting certified copies of previous term assessment evaluations and archival transcripts.',
            marks: 45,
          }
        ]
      }
    ];
  }

  if (subject === 'Fiqh') {
    return [
      {
        sectionTitle: 'القسم الأول: الأسئلة الموضوعية والمصطلحات الفقهية (Section A)',
        instructions: 'أجب عن جميع الأسئلة الآتية بدقة وإيجاز. (الدرجات: ٢٥)',
        marksPerQuestion: 5,
        items: [
          {
            qNum: 1,
            text: 'عرّف "الماء المستعمل" في المذهب الشافعي وبيّن حكم الطهارة به في رفع الحدث وإزالة النجس.',
            arabicText: 'عرّف "الماء المستعمل" في المذهب الشافعي وبيّن حكم الطهارة به.',
            marks: 5,
          },
          {
            qNum: 2,
            text: 'اذكر ثلاثة من فروض الوضوء المتفق عليها مع الدليل من القرآن الكريم.',
            arabicText: 'اذكر ثلاثة من فروض الوضوء المتفق عليها مع الدليل من القرآن الكريم.',
            marks: 5,
          },
          {
            qNum: 3,
            text: 'ما الفرق الجوهري بين صلاة القصر وصلاة الجمع في أحكام السفر المباح؟',
            arabicText: 'ما الفرق الجوهري بين صلاة القصر وصلاة الجمع في أحكام السفر المباح؟',
            marks: 5,
          },
          {
            qNum: 4,
            text: 'بيّن الحكم الفقهي في مسألة سجود السهو إذا شك المصلي في عدد الركعات التي صلاها.',
            arabicText: 'بيّن الحكم الفقهي في مسألة سجود السهو إذا شك المصلي في عدد الركعات.',
            marks: 5,
          },
          {
            qNum: 5,
            text: 'حدد نصاب زكاة الذهب والفضة ومقدار الواجب إخراجه شرعاً عند تمام الحول.',
            arabicText: 'حدد نصاب زكاة الذهب والفضة ومقدار الواجب إخراجه شرعاً عند تمام الحول.',
            marks: 5,
          }
        ]
      },
      {
        sectionTitle: 'القسم الثاني: المسائل التطبيقية والاستدلال الفقهي (Section B)',
        instructions: 'بيّن العلة الفقهية والدليل من نصوص الشريعة لكل مسألة مما يلي. (الدرجات: ٤٠)',
        marksPerQuestion: 10,
        items: [
          {
            qNum: 6,
            text: 'رجل تيمم لفريضة الظهر لعدم وجود الماء، ثم حضر وقت العصر ولم يجد ماءً؛ هل يلزمه تيمم جديد؟ وضّح بالدليل.',
            arabicText: 'مسألة: تكرار التيمم لكل فريضة عند الشافعية ومأخذ الخلاف.',
            marks: 10,
          },
          {
            qNum: 7,
            text: 'ما هي شروط صحة عقد البيع في باب المعاملات المالية، وما حكم بيع الغرر والجهالة مع التعليل؟',
            arabicText: 'شروط صحة عقد البيع وحكم بيع الغرر مع التمثيل والتعليل الفقهي.',
            marks: 10,
          },
          {
            qNum: 8,
            text: 'اشرح بإيجاب مبطلات الصيام التي توجب القضاء فقط دون الكفارة الكبرى.',
            arabicText: 'مبطلات الصيام الموجبة للقضاء فقط دون الكفارة المغلظة.',
            marks: 10,
          },
          {
            qNum: 9,
            text: 'فصّل القول في أحكام النكاح وشروطه الخمسة وأركان العقد المعتبرة شرعاً.',
            arabicText: 'أركان عقد النكاح وشروط الولي والشهود في الفقه الإسلامي.',
            marks: 10,
          }
        ]
      },
      {
        sectionTitle: 'القسم الثالث: البحث والتحليل الفقهي المقارن (Section C)',
        instructions: 'اكتب بحثاً فقهياً مستفيضاً في أحد الموضوعين التاليين. (الدرجات: ٣٥)',
        marksPerQuestion: 35,
        items: [
          {
            qNum: 10,
            text: 'ناقش أثر القواعد الفقهية الكلية (مثل: "المشقة تجلب التيسير" و"اليقين لا يزول بالشك") في تخريج الفروع والمستجدات المعاصرة.',
            arabicText: 'أثر القواعد الفقهية الكلية في الاجتهاد المعاصر وتخريج النوازل.',
            marks: 35,
          }
        ]
      }
    ];
  }

  // Default rich examination paper structure for other subjects
  return [
    {
      sectionTitle: `SECTION A: FUNDAMENTAL PRINCIPLES & CORE CONCEPTS (${subject.toUpperCase()})`,
      instructions: 'Answer all foundational questions clearly. Each question carries equal weight. (Marks: 30)',
      marksPerQuestion: 6,
      items: [
        {
          qNum: 1,
          text: `Define the primary scholastic domain and foundational terminology of ${subject} according to the DHIU curriculum.`,
          marks: 6,
        },
        {
          qNum: 2,
          text: `List the major classical authorities and canonical texts referenced in Class ${classId} for ${subject}.`,
          marks: 6,
        },
        {
          qNum: 3,
          text: `Explain how the principles learned in Semester ${semesterId} contribute to the holistic intellectual development of a scholar.`,
          marks: 6,
        },
        {
          qNum: 4,
          text: `Identify three key methodological paradigms utilized by traditional scholars when analyzing ${subject}.`,
          marks: 6,
        },
        {
          qNum: 5,
          text: `Differentiate between fundamental axioms and variable interpretive applications in this topic.`,
          marks: 6,
        }
      ]
    },
    {
      sectionTitle: 'SECTION B: ANALYTICAL APPLICATION & PROBLEMATIC SCENARIOS',
      instructions: 'Provide structured, evidence-backed answers to the following analytical problems. (Marks: 40)',
      marksPerQuestion: 10,
      items: [
        {
          qNum: 6,
          text: `Analyze the critical thesis presented in chapter 4 regarding the evolution of ${subject} across early Islamic centuries.`,
          marks: 10,
        },
        {
          qNum: 7,
          text: `Construct a comprehensive conceptual map detailing the sub-disciplines and practical outcomes of this curriculum unit.`,
          marks: 10,
        },
        {
          qNum: 8,
          text: `Evaluate a contemporary case study through the lens of classical ${subject} methodology.`,
          marks: 10,
        },
        {
          qNum: 9,
          text: `Synthesize the primary objections raised by historic critics and outline the orthodox rebuttal documented in classical treatises.`,
          marks: 10,
        }
      ]
    },
    {
      sectionTitle: 'SECTION C: SYNTHESIS ESSAY & RESEARCH COMPOSITION',
      instructions: 'Draft an in-depth academic essay addressing the specified research prompt. (Marks: 30)',
      marksPerQuestion: 30,
      items: [
        {
          qNum: 10,
          text: `Discuss the modern revitalisation of ${subject} pedagogy at Darul Huda Islamic University and its role in fostering global academic excellence.`,
          marks: 30,
        }
      ]
    }
  ];
}

// Helper to generate realistic Viva Voce oral examination papers
export function generateVivaExamQuestions(year: number) {
  return [
    {
      sectionTitle: 'PART I: QUR’ANIC RECITATION, TAJWEED & HIFZ ASSESSMENT (Oral Board)',
      instructions: 'Candidate will recite assigned passages in front of the external board without notes. Tajweed rules will be queried orally. (Marks: 25)',
      marksPerQuestion: 5,
      items: [
        {
          qNum: 1,
          text: 'Recite from Surah Al-Hujurat (Verses 10–13) with precise application of Ahkam Nun Sakinah, Meem Sakinah, and Madd Munfasil.',
          arabicText: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
          marks: 7,
        },
        {
          qNum: 2,
          text: 'Demonstrate orally the precise anatomical difference between the articulation point (Makhraj) of ض (Dad) and ظ (Za).',
          marks: 6,
        },
        {
          qNum: 3,
          text: 'Oral Hifz Prompt: Continue recitation without hesitation starting from "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا" (Surah Fussilat).',
          arabicText: 'إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ...',
          marks: 7,
        },
        {
          qNum: 4,
          text: 'Define the rules of Sifat al-Huroof (Hams, Jahr, Shiddah, Rakhawah) with practical oral phonetic examples.',
          marks: 5,
        }
      ]
    },
    {
      sectionTitle: 'PART II: CLASSICAL ARABIC DISCOURSE, BALAGHAH & SPONTANEOUS MAQALAH',
      instructions: 'The external board will assign an impromptu Arabic topic for a 4-minute continuous classical discourse. (Marks: 25)',
      marksPerQuestion: 8,
      items: [
        {
          qNum: 5,
          text: 'Deliver a spontaneous 3-minute oral address in eloquent classical Arabic (Fusha) on: "أهمية الجمع بين الأصالة والمعاصرة في مناهج التعليم الإسلامي".',
          arabicText: 'خطبة شفهية مرتجلة: أهمية الجمع بين الأصالة والمعاصرة في مناهج التعليم الإسلامي.',
          marks: 10,
        },
        {
          qNum: 6,
          text: 'Oral I’rab & Rhetorical Analysis: Parse the structural syntax and identify the Isti’arah (metaphor) in the assigned Bayt from Al-Mutanabbi.',
          arabicText: 'أَعَزُّ مَكانٍ في الدُنى سَرجُ سابِحٍ ... وَخَيرُ جَليسٍ في الزَمانِ كِتابُ',
          marks: 8,
        },
        {
          qNum: 7,
          text: "Distinguish orally between Majaz 'Aqli and Majaz Lughawi with immediate Quranic instances.",
          marks: 7,
        }
      ]
    },
    {
      sectionTitle: 'PART III: SHARI’AH JURISPRUDENCE & USUL AL-FIQH ORAL DEFENSE',
      instructions: 'The examiners will present complex contemporary scenarios for immediate oral resolution and textual deduction. (Marks: 25)',
      marksPerQuestion: 8,
      items: [
        {
          qNum: 8,
          text: 'Contemporary Fiqh Problem: Provide the Shafi’i jurisprudence rulings on digital currency transactions (Cryptocurrency & E-wallets) with reference to Riba and Gharar principles.',
          marks: 9,
        },
        {
          qNum: 9,
          text: 'Defend the application of the legal maxim "الضرورات تبيح المحظورات" against the constraint "الضرورة تقدر بقدرها" in medical ethics.',
          arabicText: 'قاعدة: الضرر يزال، وما جاز لعذر بطل بزواله.',
          marks: 8,
        },
        {
          qNum: 10,
          text: "Explain the hierarchy of Shari’ah evidences (Adillah Shari’iyyah) when Istihsan or 'Urf appears in apparent tension with Qiyas.",
          marks: 8,
        }
      ]
    },
    {
      sectionTitle: 'PART IV: CLASS 10 CAPSTONE THESIS & ACADEMIC VIVA DEFENSE',
      instructions: 'External panel interrogation on the candidate’s final graduation thesis and research integrity. (Marks: 25)',
      marksPerQuestion: 25,
      items: [
        {
          qNum: 11,
          text: 'Defend your Class 10 Graduation Dissertation methodology, explain your primary manuscript citation apparatus, and address critical counter-arguments presented by the Board of Examiners.',
          marks: 25,
        }
      ]
    }
  ];
}

// Generate the complete catalog of past question papers for all years
export function getDhiuQuestionPapers(classId: number, semesterId: number, subject: DhiuSubjectName): DhiuQuestionPaper[] {
  return DHIU_YEARS.map((year, idx) => {
    const isEven = idx % 2 === 0;
    const examType: DhiuQuestionPaper['examType'] = semesterId === 1 
      ? (isEven ? 'Half-Yearly' : 'Model / Pre-Board') 
      : (isEven ? 'Annual' : 'Model / Pre-Board');
    
    const sizeKB = 65 + (year % 25) * 2;
    
    return {
      id: `dhiu-c${classId}-s${semesterId}-${subject.toLowerCase().replace(/\s+/g, '-')}-${year}`,
      classId,
      semesterId,
      subject,
      year,
      examType,
      section: 'General Section',
      fileSize: `${sizeKB} KB`,
      maxMarks: 100,
      duration: '2.5 Hours',
      verified: true,
      questions: generateExamQuestions(subject, year, classId, semesterId)
    };
  });
}

// Generate past Viva Voce papers specifically for Class 10 (2000 - present)
export function getDhiuClass10VivaPapers(): DhiuQuestionPaper[] {
  return DHIU_YEARS.map((year, idx) => {
    const isEven = idx % 2 === 0;
    const examType = isEven ? 'Viva Voce Examination' : 'Oral Assessment';
    const sizeKB = 72 + (year % 20) * 2;

    return {
      id: `dhiu-c10-viva-${year}`,
      classId: 10,
      semesterId: 3, // Viva identifier
      subject: 'Viva Voce',
      year,
      examType,
      section: 'Grand Oral Board',
      fileSize: `${sizeKB} KB`,
      maxMarks: 100,
      duration: '45 Mins / Candidate',
      verified: true,
      isViva: true,
      questions: generateVivaExamQuestions(year)
    };
  });
}
