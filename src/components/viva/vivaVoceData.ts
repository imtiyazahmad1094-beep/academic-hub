export interface ClassDirectoryItem {
  id: number;
  name: string;
  category: 'Junior Basic' | 'Upper Primary' | 'Secondary' | 'Senior Secondary';
  badgeColor: string;
  description: string;
  subjectsCount: number;
}

// 10 Certified Classes with exact Categories
export const CLASS_DIRECTORY: ClassDirectoryItem[] = [
  { 
    id: 1, 
    name: 'Class 1', 
    category: 'Junior Basic', 
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', 
    description: 'Foundational Arabic Alphabet, Phonology & Moral Stories', 
    subjectsCount: 8 
  },
  { 
    id: 2, 
    name: 'Class 2', 
    category: 'Junior Basic', 
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', 
    description: 'Elementary Nahv, Hadith Narratives & Tajweed Rules', 
    subjectsCount: 8 
  },
  { 
    id: 3, 
    name: 'Class 3', 
    category: 'Upper Primary', 
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40', 
    description: 'Classical Grammar (Ajrumiyyah), Fiqh Fundamentals & English', 
    subjectsCount: 10 
  },
  { 
    id: 4, 
    name: 'Class 4', 
    category: 'Upper Primary', 
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40', 
    description: 'Intermediate Adab, Tareekh & Arabic Rhetoric', 
    subjectsCount: 10 
  },
  { 
    id: 5, 
    name: 'Class 5', 
    category: 'Secondary', 
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40', 
    description: 'Quranic Exegesis, Mantiq Logic & Islamic Jurisprudence', 
    subjectsCount: 12 
  },
  { 
    id: 6, 
    name: 'Class 6', 
    category: 'Secondary', 
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40', 
    description: 'Scholastic Theology (Kalam) & Comparative Islamic History', 
    subjectsCount: 12 
  },
  { 
    id: 7, 
    name: 'Class 7', 
    category: 'Senior Secondary', 
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40', 
    description: 'Advanced Usul al-Fiqh & Dialectical Philosophy', 
    subjectsCount: 12 
  },
  { 
    id: 8, 
    name: 'Class 8', 
    category: 'Senior Secondary', 
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40', 
    description: 'Hermeneutics, Arabic Eloquence & Modern Law', 
    subjectsCount: 12 
  },
  { 
    id: 9, 
    name: 'Class 9', 
    category: 'Senior Secondary', 
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40', 
    description: 'Pre-Board Oral Defense & Archival Literature Research', 
    subjectsCount: 12 
  },
  { 
    id: 10, 
    name: 'Class 10', 
    category: 'Senior Secondary', 
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40', 
    description: 'Central Board Capstone Viva Voce & Thesis Defense', 
    subjectsCount: 12 
  },
];

export const SEMESTER_OPTIONS = [
  { id: 1, label: 'Semester 1', description: 'Written Midterm Examination Cycle' },
  { id: 2, label: 'Semester 2', description: 'Written Terminal Evaluation Cycle' },
  { id: 3, label: 'Semester 3', description: 'Viva Voce Special Oral Examination' },
];

export const SUBJECT_OPTIONS = [
  'Viva Voce',
  'Arabic Eloquence',
  'Fiqh Defense',
  'Capstone Thesis',
  'Quran & Hadith Exegesis',
  'Islamic Jurisprudence',
  'Scholastic Theology',
  'Adab (Literature)',
  'Tareekh (History)',
  'Modern Social Thought'
];

export const YEAR_OPTIONS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const SECTION_SIZE_OPTIONS = [
  { name: 'Grand Oral Board', size: '84 KB', duration: '45 Mins / Candidate', panel: 'Central Examination Panel Alpha' },
  { name: 'Dialectic Defense Panel', size: '92 KB', duration: '40 Mins / Candidate', panel: 'Senior Jurisprudence Jury' },
  { name: 'Arabic Eloquence Board', size: '78 KB', duration: '35 Mins / Candidate', panel: 'Department of Arabic Rhetoric' },
  { name: 'Capstone Dissertation Jury', size: '110 KB', duration: '60 Mins / Candidate', panel: 'Supreme Academic Council' },
];

export interface ExamQuestionItem {
  id: string;
  qNum: string;
  title: string;
  prompt: string;
  marks: number;
}

export interface ExamPartRubric {
  title: string;
  marksTotal: number;
  questions: ExamQuestionItem[];
}

export interface CertifiedExamDataset {
  docId: string;
  classId: number;
  className: string;
  category: string;
  semester: number;
  subject: string;
  year: number;
  sectionName: string;
  fileSize: string;
  duration: string;
  maxMarks: number;
  juryPanel: string;
  arabicVerse: string;
  instructions: string[];
  part1: ExamPartRubric;
  part2: ExamPartRubric;
  part3: ExamPartRubric;
  tribunalJury: {
    name: string;
    role: string;
    awardedMarks: number;
    maxMarks: number;
  }[];
}

// Generate rich, authenticated question datasets for all 10 classes dynamically
export function getVivaExamDataset(
  classId: number,
  semester: number,
  subject: string,
  year: number,
  sectionObj = SECTION_SIZE_OPTIONS[0]
): CertifiedExamDataset {
  const currentClass = CLASS_DIRECTORY.find(c => c.id === classId) || CLASS_DIRECTORY[9];

  let part1: ExamPartRubric;
  let part2: ExamPartRubric;
  let part3: ExamPartRubric;

  if (classId === 1) {
    part1 = {
      title: 'Part I: Foundational Arabic Phonology & Tajweed Recitation',
      marksTotal: 30,
      questions: [
        {
          id: 'c1-q1',
          qNum: 'Question 1.1',
          title: 'Oral Tajweed & Makharij Articulation',
          prompt: `Recite Surah Al-Fatiha and Surah Al-Ikhlas before the scholarly tribunal with precise vocalization of throat letters (Halqi) and tongue articulation points.`,
          marks: 15,
        },
        {
          id: 'c1-q2',
          qNum: 'Question 1.2',
          title: 'Solar & Lunar Letter Distinctions',
          prompt: `Identify and demonstrate oral pronunciation differences between Al-Huruf al-Shamsiyyah and Al-Huruf al-Qamariyyah in provided sample words.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Islamic Morals, Cleanliness (Taharah) & Daily Supplications',
      marksTotal: 30,
      questions: [
        {
          id: 'c1-q3',
          qNum: 'Question 2.1',
          title: 'Wudu (Ablution) Sequence & Hygiene Obligations',
          prompt: `Perform an oral demonstration of the compulsory steps (Fara'idh) and recommended manners (Sunan) of Wudu.`,
          marks: 15,
        },
        {
          id: 'c1-q4',
          qNum: 'Question 2.2',
          title: 'Daily Duas & Moral Narratives',
          prompt: `Recite from memory the authentic supplications for entering and leaving the mosque, beginning meals, and sleeping.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Oral Kalimas & Foundational Hadith Tribunal',
      marksTotal: 40,
      questions: [
        {
          id: 'c1-q5',
          qNum: 'Question 3.1',
          title: 'Recitation of the Five Kalimas',
          prompt: `Recite with accurate voweling and translation the First (Tayyib) and Second (Shahadah) Kalimas before the jury.`,
          marks: 20,
        },
        {
          id: 'c1-q6',
          qNum: 'Question 3.2',
          title: 'Moral Hadith Narratives',
          prompt: `Narrate the moral lesson behind the Prophet's compassion toward animals, parents, and neighbors.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 2) {
    part1 = {
      title: 'Part I: Elementary Syntax (Nahv) & Noon Sakinah Rules',
      marksTotal: 30,
      questions: [
        {
          id: 'c2-q1',
          qNum: 'Question 1.1',
          title: 'Parts of Speech (Kalimah) Classification',
          prompt: `Differentiate between Ism (noun), Fi'l (verb), and Harf (particle) in five selected oral sentence prompts.`,
          marks: 15,
        },
        {
          id: 'c2-q2',
          qNum: 'Question 1.2',
          title: 'Tajweed Rules of Noon Sakinah & Tanween',
          prompt: `Explain and illustrate with Quranic examples the four rules: Izhar, Idgham (with and without Ghunnah), Iqlab, and Ikhfa.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Hadith Narratives & Fiqh of Daily Prayers (Salah)',
      marksTotal: 30,
      questions: [
        {
          id: 'c2-q3',
          qNum: 'Question 2.1',
          title: 'Pillars and Conditions of Salah',
          prompt: `Enumerate orally the internal pillars (Arkan) and external prerequisites (Shuroot) for the five obligatory daily prayers.`,
          marks: 15,
        },
        {
          id: 'c2-q4',
          qNum: 'Question 2.2',
          title: 'Hadith Memorization & Practical Morals',
          prompt: `Recite five short Hadiths from Imam An-Nawawi's collection concerning truthfulness, modesty, and avoidance of harm.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Conversational Arabic Oral Tribunal',
      marksTotal: 40,
      questions: [
        {
          id: 'c2-q5',
          qNum: 'Question 3.1',
          title: 'Introductory Spontaneous Dialogue',
          prompt: `Engage in a 3-minute oral Arabic dialogue with tribunal members regarding school subjects, family, and daily timetable.`,
          marks: 20,
        },
        {
          id: 'c2-q6',
          qNum: 'Question 3.2',
          title: 'Juz Amma Oral Recital Defense',
          prompt: `Recite selected verses from Surah An-Naba with adherence to elongation (Madd) and stopping rules (Waqf).`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 3) {
    part1 = {
      title: 'Part I: Classical Grammar (Ajrumiyyah) & Inflectional Analysis',
      marksTotal: 30,
      questions: [
        {
          id: 'c3-q1',
          qNum: 'Question 1.1',
          title: 'I\'rab Signs & Syntactic Markers',
          prompt: `Explain the signs of Raf' (Dammah, Waw, Alif, Noon) in the Ajrumiyyah paradigm with verbal demonstrations.`,
          marks: 15,
        },
        {
          id: 'c3-q2',
          qNum: 'Question 1.2',
          title: 'Subject & Predicate (Mubtada\' & Khabar)',
          prompt: `Analyze the grammatical components of five nominal sentences, indicating concord in number and gender.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Fiqh Fundamentals (Purification, Taharah & Water Types)',
      marksTotal: 30,
      questions: [
        {
          id: 'c3-q3',
          qNum: 'Question 2.1',
          title: 'Jurisprudence of Waters & Purification',
          prompt: `Categorize waters into Mutlaq (pure and purifying), Musta'mal (used), and Mutanajjis (defiled), citing classical conditions.`,
          marks: 15,
        },
        {
          id: 'c3-q4',
          qNum: 'Question 2.2',
          title: 'Tayammum & Congregational Salah Rules',
          prompt: `Explain the legal grounds permitting Tayammum and the responsibilities of the Imam and Ma'mum in congregational prayer.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Sight Translation & Early Islamic History (Seerah)',
      marksTotal: 40,
      questions: [
        {
          id: 'c3-q5',
          qNum: 'Question 3.1',
          title: 'Sight Translation into English/Vernacular',
          prompt: `Translate at sight a 100-word excerpt from classical prose into English, preserving idiomatic accuracy.`,
          marks: 20,
        },
        {
          id: 'c3-q6',
          qNum: 'Question 3.2',
          title: 'Makkan Period Historical Chronology',
          prompt: `Summarize the pivotal milestones of the Makkan epoch: the first revelation, public proclamation, and the Boycott of Banu Hashim.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 4) {
    part1 = {
      title: 'Part I: Intermediate Adab (Literature) & Arabic Morphology (Swarf)',
      marksTotal: 30,
      questions: [
        {
          id: 'c4-q1',
          qNum: 'Question 1.1',
          title: 'Morphological Derivations (Awzan al-Fi\'l)',
          prompt: `Demonstrate the derived verb scales (Forms II through VIII) and their semantic modifications (e.g. transitivity, reciprocity).`,
          marks: 15,
        },
        {
          id: 'c4-q2',
          qNum: 'Question 1.2',
          title: 'Classical Poetic Declamation',
          prompt: `Recite and elucidate two couplets from Al-Bousiri\'s Qasida al-Burdah, analyzing meter and aesthetic tone.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Islamic History (Tareekh) & Fiqh of Zakah & Fasting',
      marksTotal: 30,
      questions: [
        {
          id: 'c4-q3',
          qNum: 'Question 2.1',
          title: 'The Constitution of Madinah & The Hijrah',
          prompt: `Analyze the sociopolitical covenant established in Madinah ensuring mutual defense and religious autonomy for all citizens.`,
          marks: 15,
        },
        {
          id: 'c4-q4',
          qNum: 'Question 2.2',
          title: 'Calculation of Zakah on Commercial Assets',
          prompt: `Explain Nisab thresholds, Hawlan al-Hawl (holding period), and eligible recipients (Masarif al-Zakah) according to Surah At-Tawbah.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Conversational Eloquence & Hadith Commentary',
      marksTotal: 40,
      questions: [
        {
          id: 'c4-q5',
          qNum: 'Question 3.1',
          title: '5-Minute Fluent Scholarly Monologue',
          prompt: `Deliver an extemporaneous speech in Arabic on the importance of knowledge ('Ilm) and scholastic humility.`,
          marks: 20,
        },
        {
          id: 'c4-q6',
          qNum: 'Question 3.2',
          title: 'Hadith Jibreel Exegesis',
          prompt: `Cross-examine the candidate on the theological implications of Islam, Iman, Ihsan, and the signs of the Final Hour.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 5) {
    part1 = {
      title: 'Part I: Quranic Exegesis (Tafseer) & Dialectic Eloquence',
      marksTotal: 30,
      questions: [
        {
          id: 'c5-q1',
          qNum: 'Question 1.1',
          title: 'Ayat al-Ahkam Jurisprudential Exegesis',
          prompt: `Parse grammatically and explicate the legal consequences of the inheritance ordinances in Surah An-Nisa (Ayah 11–12).`,
          marks: 15,
        },
        {
          id: 'c5-q2',
          qNum: 'Question 1.2',
          title: 'Arabic Rhetorical Tropes (Majaz & Kinayah)',
          prompt: `Distinguish between literal sense (Haqiqah) and figurative metaphor (Majaz) in selected Quranic parables.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Formal Logic (Mantiq) & Islamic Commercial Transactions',
      marksTotal: 30,
      questions: [
        {
          id: 'c5-q3',
          qNum: 'Question 2.1',
          title: 'Categorical Syllogisms & Terms (Tasawwur & Tasdiq)',
          prompt: `Construct a valid first-figure categorical syllogism proving a theological proposition, stating the middle term.`,
          marks: 15,
        },
        {
          id: 'c5-q4',
          qNum: 'Question 2.2',
          title: 'Fiqh al-Mu\'amalat: Riba & Contractual Nullifiers',
          prompt: `Define Riba al-Fadl and Riba al-Nasi\'ah, evaluating how classical definitions apply to deferred currency exchanges.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Scholarly Defense & Tribunal Inquiry',
      marksTotal: 40,
      questions: [
        {
          id: 'c5-q5',
          qNum: 'Question 3.1',
          title: 'Rational Defense of Prophetic Veracity',
          prompt: `Formulate a rational counter-argument refuting doubts concerning divine revelation and prophetic miracles (Mu\'jizat).`,
          marks: 20,
        },
        {
          id: 'c5-q6',
          qNum: 'Question 3.2',
          title: 'Textual Examination in Classical Jurisprudence',
          prompt: `Unassisted parsing and sight reading of a complex passage from the classical manual Fath al-Qarib.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 6) {
    part1 = {
      title: 'Part I: Scholastic Theology (Ilm al-Kalam) & Theistic Proofs',
      marksTotal: 30,
      questions: [
        {
          id: 'c6-q1',
          qNum: 'Question 1.1',
          title: 'Dalil al-Huduth (The Cosmological Contingency Proof)',
          prompt: `Articulate the classical Ash\'ari and Maturidi argument establishing the temporal origination of the universe through accidents and substances.`,
          marks: 15,
        },
        {
          id: 'c6-q2',
          qNum: 'Question 1.2',
          title: 'Divine Attributes (Sifat al-Ma\'ani)',
          prompt: `Explain the distinction between Essential Attributes (Sifat Dhatiyyah) and Operational Attributes (Sifat Fi\'liyyah).`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Comparative Islamic History & Classical Legal Maxims',
      marksTotal: 30,
      questions: [
        {
          id: 'c6-q3',
          qNum: 'Question 2.1',
          title: 'Bayt al-Hikmah Intellectual Transmission',
          prompt: `Assess the translational movement under Al-Ma'mun and its philosophical impact on Islamic intellectual discourse.`,
          marks: 15,
        },
        {
          id: 'c6-q4',
          qNum: 'Question 2.2',
          title: 'Legal Maxim: "Certainty is not Removed by Doubt"',
          prompt: `Demonstrate ten applied subsidiary rulings derived from the cardinal maxim "Al-Yaqin La Yazulu bi al-Shakk".`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Research Monograph Defense',
      marksTotal: 40,
      questions: [
        {
          id: 'c6-q5',
          qNum: 'Question 3.1',
          title: 'Monograph Defense on Ethical Stewardship',
          prompt: `Defend before the board the ethical stewardship doctrine in Islamic governance compared to utilitarian frameworks.`,
          marks: 20,
        },
        {
          id: 'c6-q6',
          qNum: 'Question 3.2',
          title: 'Dialectical Refutation of Materialism',
          prompt: `Provide a structured philosophical rebuttal against contemporary deterministic and physicalist worldviews.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 7) {
    part1 = {
      title: 'Part I: Advanced Usul al-Fiqh & Textual Connotations (Dalalat)',
      marksTotal: 30,
      questions: [
        {
          id: 'c7-q1',
          qNum: 'Question 1.1',
          title: 'Classification of Textual Clartiy (Zahir, Nass, Mufassar, Muhkam)',
          prompt: `Examine the degrees of textual clarity and ambivalence (Khafiyy, Mushkil, Mujmal, Mutashabih) with forensic legal precedents.`,
          marks: 15,
        },
        {
          id: 'c7-q2',
          qNum: 'Question 1.2',
          title: 'Balaghah: Ilm al-Ma\'ani & Syntactic Omission (Hadhf)',
          prompt: `Analyze the profound rhetorical significance of syntactic ellipsis (Hadhf al-Maf'ul) in the opening of Surah Ad-Duha.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Modern Bioethics & Comparative Juristic Methodologies',
      marksTotal: 30,
      questions: [
        {
          id: 'c7-q3',
          qNum: 'Question 2.1',
          title: 'Juridical Consensus on Organ Transplantation',
          prompt: `Critically appraise the rulings of international Fiqh academies regarding clinical brain death and posthumous organ donations.`,
          marks: 15,
        },
        {
          id: 'c7-q4',
          qNum: 'Question 2.2',
          title: 'Arkan al-Qiyas & Jurisprudential Causation (\'Illah)',
          prompt: `Define the four pillars of legal analogy and the methods of extracting the ratio legis (Masalik al-\'Illah: Nass, Ijma\', Sabr wa Taqseem).`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Scholarly Tribunal Cross-Examination',
      marksTotal: 40,
      questions: [
        {
          id: 'c7-q5',
          qNum: 'Question 3.1',
          title: 'Defense Against Deconstructionist Hermeneutics',
          prompt: `Rebut modern historicist approaches that seek to relativize normative Islamic legal injunctions.`,
          marks: 20,
        },
        {
          id: 'c7-q6',
          qNum: 'Question 3.2',
          title: 'Extemporaneous Legal Dictum Exegesis',
          prompt: `Synthesize a comprehensive verdict on a novel financial escrow arrangement utilizing classical Usul principles.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 8) {
    part1 = {
      title: 'Part I: Hermeneutics, Abrogation (Naskh) & Classical Oratory',
      marksTotal: 30,
      questions: [
        {
          id: 'c8-q1',
          qNum: 'Question 1.1',
          title: 'Hermeneutics of Naskh & Ta\'weel',
          prompt: `Critically differentiate between abrogation (Naskh) and specification of the general (Takhsees al-\'Amm) across classical schools.`,
          marks: 15,
        },
        {
          id: 'c8-q2',
          qNum: 'Question 1.2',
          title: 'Advanced Stylistics (Ilm al-Badi\')',
          prompt: `Explain with Quranic examples Jinās Tamm, Tibāq al-Ijab, and Muqabalah, highlighting their cognitive appeal.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Islamic Financial Instruments & Maqasid al-Shariah',
      marksTotal: 30,
      questions: [
        {
          id: 'c8-q3',
          qNum: 'Question 2.1',
          title: 'Shariah Appraisal of Sukuk & Asset-Backed Securities',
          prompt: `Evaluate the Shariah compliance requirements of Ijarah, Murabahah, and Musharakah sukuk structures under AAOIFI standards.`,
          marks: 15,
        },
        {
          id: 'c8-q4',
          qNum: 'Question 2.2',
          title: 'The Five Universal Objectives (Al-Daruriyyat al-Khams)',
          prompt: `Demonstrate the hierarchical prioritization between preservation of religion, life, intellect, lineage, and wealth in crisis management.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Grand Archival Tribunal & Manuscript Exegesis',
      marksTotal: 40,
      questions: [
        {
          id: 'c8-q5',
          qNum: 'Question 3.1',
          title: 'Primary Archival Manuscript Parsing',
          prompt: `Read, vocalize, and interpret an unedited 15th-century manuscript page from the Maliki/Shafi\'i jurisprudence archives.`,
          marks: 20,
        },
        {
          id: 'c8-q6',
          qNum: 'Question 3.2',
          title: 'Defending Methodology in Legal Historiography',
          prompt: `Justify source selection and chain validation in contemporary dissertation literature reviews.`,
          marks: 20,
        }
      ]
    };
  } else if (classId === 9) {
    part1 = {
      title: 'Part I: Hadith Isnad Methodology & Biographical Forensic (Jarh wa Ta\'dil)',
      marksTotal: 30,
      questions: [
        {
          id: 'c9-q1',
          qNum: 'Question 1.1',
          title: 'Critical Evaluation of Chains of Transmission',
          prompt: `Analyze the conditions of Hadith Sahih Li-Dhatihi according to Ibn al-Salah, evaluating hidden defects (\'Ilal Khafiyyah).`,
          marks: 15,
        },
        {
          id: 'c9-q2',
          qNum: 'Question 1.2',
          title: 'Classical Dialectics (Adab al-Bahth wa al-Munazarah)',
          prompt: `Formulate a formal debate argument following the classical rules of objection (Man\'), demand for proof (Matalabah), and counter-proof (Mu\'aradhah).`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Comparative Constitutional Systems & Legal Pluralism',
      marksTotal: 30,
      questions: [
        {
          id: 'c9-q3',
          qNum: 'Question 2.1',
          title: 'Sovereignty, Shura & Constitutional Mechanisms',
          prompt: `Contrast classical theories of Wilayah and Bay\'ah with modern constitutionalism and parliamentary representation.`,
          marks: 15,
        },
        {
          id: 'c9-q4',
          qNum: 'Question 2.2',
          title: 'Harmonization of Civil Codes with Religious Arbitration',
          prompt: `Discuss the legal status of alternative dispute resolution (Tahkim) and minority fiqh in secular legal jurisdictions.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Pre-Dissertation Capstone Defense',
      marksTotal: 40,
      questions: [
        {
          id: 'c9-q5',
          qNum: 'Question 3.1',
          title: 'Primary Hypothesis Defense',
          prompt: `Defend the core thesis of your forthcoming senior dissertation against methodology critiques from external adjudicators.`,
          marks: 20,
        },
        {
          id: 'c9-q6',
          qNum: 'Question 3.2',
          title: 'Forensic Cross-Examination on Source Citations',
          prompt: `Respond to immediate tribunal cross-examination regarding primary manuscript variants and bibliographic cross-verification.`,
          marks: 20,
        }
      ]
    };
  } else {
    // Class 10: Central Board Capstone Viva Voce & Thesis Defense
    part1 = {
      title: 'Part I: Classical Syntax & Linguistic Eloquence',
      marksTotal: 30,
      questions: [
        {
          id: 'c10-q1',
          qNum: 'Question 1.1',
          title: 'Syntactic Parse & Balaghah Exegesis',
          prompt: `Explicate the grammatical nuances of conditional particle constructs (In / Idhā) in Surah Al-Baqarah, distinguishing between indicative certainty and hypothetical contingency.`,
          marks: 15,
        },
        {
          id: 'c10-q2',
          qNum: 'Question 1.2',
          title: 'Oral Dialectics & Classical Rhetoric',
          prompt: `Deliver a 3-minute oral exegesis without manuscript assistance, addressing the semantic divergence between 'Aql (Intellect) and Naql (Transmission) in classical Usul.`,
          marks: 15,
        }
      ]
    };
    part2 = {
      title: 'Part II: Islamic Jurisprudence & Contemporary Application',
      marksTotal: 30,
      questions: [
        {
          id: 'c10-q3',
          qNum: 'Question 2.1',
          title: 'Legal Maxim (Qawa\'id) Defense',
          prompt: `Apply the principle 'Al-Daruratu Tubihu al-Mahzurāt' (Necessity renders permissible the forbidden) to biometric identity verification and automated autonomous systems.`,
          marks: 15,
        },
        {
          id: 'c10-q4',
          qNum: 'Question 2.2',
          title: 'Independent Reasoning (Ijtihad) in Emergent Technologies',
          prompt: `Formulate a methodology for modern Collective Ijtihad (Ijtihad Jama\'i) on decentralized protocols and autonomous algorithmic wealth pools.`,
          marks: 15,
        }
      ]
    };
    part3 = {
      title: 'Part III: Capstone Research Defense & Tribunal Interrogation',
      marksTotal: 40,
      questions: [
        {
          id: 'c10-q5',
          qNum: 'Question 3.1',
          title: 'Bibliographic Integrity & Primary Source Authenticity',
          prompt: `The candidate must defend primary manuscript references cited in their capstone dissertation, demonstrating cross-verification with Al-Mawardi\'s Al-Ahkam al-Sultaniyya and Ibn Khaldun\'s Muqaddimah.`,
          marks: 20,
        },
        {
          id: 'c10-q6',
          qNum: 'Question 3.2',
          title: 'Cross-Examination on Modern Governance',
          prompt: `Respond to hypothetical counter-arguments posed by the chief adjudicator concerning parliamentary shura mechanisms versus direct algorithmic voting systems.`,
          marks: 20,
        }
      ]
    };
  }

  return {
    docId: `DHIU-${year}-C${classId}-S${semester}`,
    classId,
    className: currentClass.name,
    category: currentClass.category,
    semester,
    subject,
    year,
    sectionName: sectionObj.name,
    fileSize: sectionObj.size,
    duration: sectionObj.duration,
    maxMarks: 100,
    juryPanel: sectionObj.panel,
    arabicVerse: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — وَقُلْ رَبِّ زِدْنِي عِلْمًا',
    instructions: [
      'Each candidate shall face a 3-member scholarly tribunal in sequential oral interrogation.',
      'Spontaneous dialectic questions must be corroborated with classical texts, canons, and references.',
      'Scoring shall reflect eloquence (30M), jurisprudential reasoning (30M), and research defense (40M).'
    ],
    part1,
    part2,
    part3,
    tribunalJury: [
      { name: 'Prof. Dr. Tariq Al-Mansoor', role: 'Dean of Classical Dialectics', awardedMarks: 28, maxMarks: 30 },
      { name: 'Prof. Elena Rostova', role: 'Chair of Jurisprudential Synthesis', awardedMarks: 29, maxMarks: 30 },
      { name: 'Supreme Council Jury Chair', role: 'Chief Board Adjudicator', awardedMarks: 38, maxMarks: 40 },
    ]
  };
}
