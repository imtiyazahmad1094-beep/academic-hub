import { QuizItem } from '../types';

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'quiz-anime-openings-941985',
    title: 'Anime & Pop Culture OST Acoustics',
    subtitle: 'High-speed audio listening and sonic recognition challenge',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    category: 'Entertainment',
    author: 'Prof. Kenji Takahashi',
    rating: 4.9,
    playsCount: 24800,
    questionsCount: 10,
    isAiGenerated: false,
    pinCode: '941 985',
    createdAt: '2026-09-18',
    tags: ['Acoustics', 'Pop Culture', 'OSTs', 'Oral Defense'],
    questions: [
      {
        id: 'q-anime-1',
        question: 'What Anime is this opening song from?',
        category: 'Entertainment',
        mediaType: 'waveform',
        mediaTitle: 'A Cruel Angel’s Thesis — Synth Opening Theme',
        mediaUrl: 'https://archive.org/download/cruel-angel-thesis-sample/audio.mp3',
        correctAnswer: 'Neon Genesis Evangelion',
        acceptedAnswers: ['Evangelion', 'Neon Genesis Evangelion', 'Eva', 'NGE', 'Cruel Angels Thesis'],
        options: ['Neon Genesis Evangelion', 'Cowboy Bebop', 'Fullmetal Alchemist', 'Attack on Titan'],
        timeLimitSec: 30,
        points: 1000,
        explanation: 'Composed by Hidetoshi Sato and sung by Yoko Takahashi for the 1995 iconic series Neon Genesis Evangelion.'
      },
      {
        id: 'q-anime-2',
        question: 'Identify the iconic jazz brass melody composer for Cowboy Bebop’s "Tank!" opening theme.',
        category: 'Art & Literature',
        mediaType: 'waveform',
        mediaTitle: 'Seatbelts — Big Band Brass Track',
        correctAnswer: 'Yoko Kanno',
        acceptedAnswers: ['Yoko Kanno', 'Kanno', 'Seatbelts'],
        options: ['Yoko Kanno', 'Joe Hisaishi', 'Hiroyuki Sawano', 'Kenji Kawai'],
        timeLimitSec: 25,
        points: 1000,
        explanation: 'Legendary composer Yoko Kanno and her band Seatbelts arranged this high-energy bebop jazz standard in 1998.'
      },
      {
        id: 'q-anime-3',
        question: 'Which historical medieval series features the German-language choral anthem "Guren no Yumiya"?',
        category: 'History',
        mediaType: 'waveform',
        mediaTitle: 'Linked Horizon Choral Brass Fanfare',
        correctAnswer: 'Attack on Titan',
        acceptedAnswers: ['Attack on Titan', 'Shingeki no Kyojin', 'AOT'],
        options: ['Attack on Titan', 'Vinland Saga', 'Berserk', 'Kingdom'],
        timeLimitSec: 25,
        points: 1000,
        explanation: 'Recorded by Linked Horizon for Attack on Titan (Shingeki no Kyojin) Season 1.'
      }
    ]
  },
  {
    id: 'quiz-usul-fiqh-academic-301',
    title: 'Usul al-Fiqh & Jurisprudential Methodology',
    subtitle: 'Rigorous oral defense on Qat’i evidence, Qiyas, and classical consensus',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    category: 'Islamic Studies',
    author: 'Dr. Faisal Al-Husseini',
    rating: 5.0,
    playsCount: 18450,
    questionsCount: 8,
    isAiGenerated: false,
    pinCode: '312 804',
    createdAt: '2026-09-20',
    tags: ['Jurisprudence', 'Usul', 'Legal Theory', 'DHIU'],
    questions: [
      {
        id: 'q-usul-1',
        question: 'In classical Usul al-Fiqh, what is the prerequisite for an Ijma’ (consensus) to be classified as Qat’i (definitive)?',
        category: 'Islamic Studies',
        mediaType: 'waveform',
        mediaTitle: 'Manuscript Analysis Audio Dispatch — Usul al-Bazdawi',
        correctAnswer: 'Unanimous consensus of all Mujtahids across the Islamic ummah',
        acceptedAnswers: ['Unanimous consensus', 'All mujtahids', 'Ijma Sukuti exclusion', 'Qati consensus'],
        options: [
          'Unanimous agreement of all qualified Mujtahids without dissenting opinion',
          'Majority consensus of the scholars of Madinah',
          'Consensus among the four primary Madhhab founders only',
          'Written decree from the chief judicial magistrates'
        ],
        timeLimitSec: 40,
        points: 1200,
        explanation: 'A Qat’i Ijma requires total unanimity among all living Mujtahidin of that era upon an unambiguous legal ruling.'
      },
      {
        id: 'q-usul-2',
        question: 'Identify the fundamental pillar (Rukn) of Qiyas that links the novel branch (Far’) to the foundational origin (Asl).',
        category: 'Islamic Studies',
        mediaType: 'waveform',
        mediaTitle: 'Oral Defense Argumentation Clip',
        correctAnswer: 'Illah',
        acceptedAnswers: ['Illah', 'Al-Illah', 'Effective Cause', 'Ratio Decidendi'],
        options: ['Al-Illah (The Effective Ratio)', 'Al-Hukm (The Derived Rule)', 'Al-Asl (The Root Case)', 'Al-Far’ (The Branch)'],
        timeLimitSec: 30,
        points: 1000,
        explanation: 'The Illah (underlying ratio decidendi) is the common denominator that justifies extending the original ruling.'
      }
    ]
  },
  {
    id: 'quiz-quantum-physics-ai-772',
    title: 'Quantum Mechanics & Decoherence Phenomena',
    subtitle: 'Generated from MIT OpenCourseWare Lecture Notes PDF',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    category: 'Science & Nature',
    author: 'Academic AI Engine (Gemini 2.5)',
    rating: 4.85,
    playsCount: 31200,
    questionsCount: 12,
    isAiGenerated: true,
    pinCode: '582 119',
    createdAt: '2026-09-21',
    tags: ['Quantum', 'Physics', 'AI Generated', 'MIT'],
    questions: [
      {
        id: 'q-qp-1',
        question: 'What mathematical entity represents the state vector in Dirac bra-ket notation?',
        category: 'Science & Nature',
        mediaType: 'waveform',
        mediaTitle: 'Dirac Bra-Ket Spectral Waveform',
        correctAnswer: 'Ket vector |ψ⟩',
        acceptedAnswers: ['Ket', 'Ket vector', '|ψ⟩', 'State vector'],
        options: ['Ket vector |ψ⟩', 'Bra vector ⟨ψ|', 'Hamiltonian operator Ĥ', 'Commutator bracket [A, B]'],
        timeLimitSec: 25,
        points: 1000,
        explanation: 'The ket vector |ψ⟩ belongs to the complex Hilbert space representing the pure quantum state.'
      }
    ]
  },
  {
    id: 'quiz-cartography-ai-410',
    title: 'Historical Geopolitics & Ancient Trade Corridors',
    subtitle: 'Extracted from Silk Road & Maritime Indian Ocean treaties',
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
    category: 'Geography',
    author: 'Academic AI Engine (Gemini 2.5)',
    rating: 4.92,
    playsCount: 14200,
    questionsCount: 7,
    isAiGenerated: true,
    pinCode: '741 029',
    createdAt: '2026-09-19',
    tags: ['Geography', 'Silk Road', 'Maritime', 'Trade'],
    questions: [
      {
        id: 'q-geo-1',
        question: 'Which ancient maritime emporium in southwestern India was the primary hub for Roman black pepper exchange?',
        category: 'Geography',
        mediaType: 'none',
        correctAnswer: 'Muziris',
        acceptedAnswers: ['Muziris', 'Kodungallur', 'Muchiri'],
        options: ['Muziris', 'Arikamedu', 'Calicut', 'Lothal'],
        timeLimitSec: 30,
        points: 1000,
        explanation: 'Muziris (near modern Kodungallur, Kerala) was documented extensively in the Periplus of the Erythraean Sea.'
      }
    ]
  },
  {
    id: 'quiz-arabic-syntax-882',
    title: 'Classical Arabic Nahw: Alfiyyah Ibn Malik',
    subtitle: 'Grammatical analysis, I’rab, and sentence topology drills',
    coverImage: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
    category: 'Languages',
    author: 'Ustadh Luqman Mansoor',
    rating: 4.96,
    playsCount: 22100,
    questionsCount: 15,
    isAiGenerated: false,
    pinCode: '492 633',
    createdAt: '2026-09-17',
    tags: ['Arabic', 'Nahw', 'Alfiyyah', 'Grammar'],
    questions: [
      {
        id: 'q-nahw-1',
        question: 'What is the governing operator (Amil) of the subject (Mubtada) according to the Basran grammarians?',
        category: 'Languages',
        mediaType: 'waveform',
        mediaTitle: 'Poetic Meter Recitation — Rajaz Verse',
        correctAnswer: 'Ibtida (Inchoation)',
        acceptedAnswers: ['Ibtida', 'Al-Ibtida', 'Inchoation', 'Amil Ma’nawi'],
        options: ['Al-Ibtida (Abstract Inchoation)', 'The Khabar predicate', 'Implicit Kana', 'Fa’il transposition'],
        timeLimitSec: 30,
        points: 1000,
        explanation: 'The Basran school posits that Mubtada is in Raf’ through the non-physical governor: al-Ibtida.'
      }
    ]
  },
  {
    id: 'quiz-ai-neuroscience-509',
    title: 'Computational Neuroscience & Synaptic Plasticity',
    subtitle: 'Generated from Nature Reviews Neuroscience monograph',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
    category: 'Science & Nature',
    author: 'Academic AI Engine (Gemini 2.5)',
    rating: 4.9,
    playsCount: 19800,
    questionsCount: 9,
    isAiGenerated: true,
    pinCode: '826 401',
    createdAt: '2026-09-22',
    tags: ['Neuroscience', 'Synapse', 'LTP', 'AI'],
    questions: [
      {
        id: 'q-neuro-1',
        question: 'Which neurotransmitter receptor is famously known as the molecular coincidence detector for Long-Term Potentiation (LTP)?',
        category: 'Science & Nature',
        mediaType: 'waveform',
        mediaTitle: 'Electrophysiological Spike Waveform',
        correctAnswer: 'NMDA receptor',
        acceptedAnswers: ['NMDA', 'NMDA receptor', 'N-methyl-D-aspartate'],
        options: ['NMDA receptor', 'AMPA receptor', 'GABA-A receptor', 'Nicotinic receptor'],
        timeLimitSec: 25,
        points: 1000,
        explanation: 'NMDA receptors require both glutamate binding and membrane depolarization to expel magnesium block.'
      }
    ]
  }
];

export const INITIAL_LOBBY_PLAYERS = [
  { id: 'p1', name: 'Dr. Zayd Scholar', avatar: '🎓', score: 2450, joinedAt: '2 mins ago', isHost: true, status: 'Ready' as const },
  { id: 'p2', name: 'Maryam_Oxford', avatar: '🔬', score: 2120, joinedAt: '1 min ago', status: 'Ready' as const },
  { id: 'p3', name: 'Ahmad_DHIU', avatar: '📚', score: 1980, joinedAt: '45s ago', status: 'Ready' as const },
  { id: 'p4', name: 'Sarah_CyberLab', avatar: '⚡', score: 1850, joinedAt: '30s ago', status: 'Ready' as const },
  { id: 'p5', name: 'Tariq_Medina', avatar: '🏛️', score: 1720, joinedAt: '15s ago', status: 'Ready' as const },
  { id: 'p6', name: 'Elena_Cambridge', avatar: '🌌', score: 1600, joinedAt: '10s ago', status: 'Ready' as const },
  { id: 'p7', name: 'Prof_Kowalski', avatar: '🎻', score: 1480, joinedAt: '5s ago', status: 'Ready' as const },
  { id: 'p8', name: 'Bilal_Research', avatar: '🖋️', score: 1390, joinedAt: 'Just now', status: 'Ready' as const }
];
