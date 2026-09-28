import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Mic, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Play, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  Volume2,
  Globe,
  ExternalLink,
  X,
  Link2,
  BarChart3,
  BookOpen,
  Edit3,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { getVivaResourceLinks, saveVivaResourceLink, VivaResourceLink } from '../../utils/pyqStorage';

interface QuizQuestion {
  id: number;
  category: 'Tajweed & Recitation' | 'Arabic Balaghah' | 'Usul al-Fiqh' | 'Dissertation Defense' | 'Hadith Sciences';
  question: string;
  arabicPrompt?: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const TALENT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Tajweed & Recitation',
    question: 'When reciting the letter "الراء" (Ra) in the word "مِرْيَةٍ" with a Kasrah preceding a quiescent Ra, what is the obligatory phonetic ruling in Hafs an Asim?',
    arabicPrompt: 'حكم الراء الساكنة المسبوقة بكسرة أصلية متصلة',
    options: [
      { key: 'A', text: 'Tarkheeq (Thin / Light articulation) because of the original adjacent Kasrah', isCorrect: true },
      { key: 'B', text: 'Tafkheem (Thick / Velarized articulation) unconditionally', isCorrect: false },
      { key: 'C', text: 'Jawaz al-Wajhayn (Permissibility of both thick and thin)', isCorrect: false },
      { key: 'D', text: 'Ishmam with lip rounding', isCorrect: false }
    ],
    explanation: 'When the quiescent Ra is preceded by a genuine original Kasrah within the same word and is not followed by an Isti’la letter with Fathah, Tarqeeq (slender pronunciation) is strictly mandated.'
  },
  {
    id: 2,
    category: 'Arabic Balaghah',
    question: 'In classical rhetoric (Ilm al-Badi’), what rhetorical device is exemplified by combining words that agree in letters but differ in semantic meaning (الجناس التام)?',
    arabicPrompt: 'قوله تعالى: ﴿وَيَوْمَ تَقُومُ السَّاعَةُ يُقْسِمُ الْمُجْرِمُونَ مَا لَبِثُوا غَيْرَ سَاعَةٍ﴾',
    options: [
      { key: 'A', text: 'Tashbeeh Mujmal (Concise Simile)', isCorrect: false },
      { key: 'B', text: 'Jinas Taamm (Complete Homonymy / Perfect Paranomasia)', isCorrect: true },
      { key: 'C', text: 'Tabaq Ijaab (Affirmative Antithesis)', isCorrect: false },
      { key: 'D', text: 'Isti’arah Tasrihiyyah (Explicit Metaphor)', isCorrect: false }
    ],
    explanation: 'In the verse, "الساعة" (The Day of Judgment) and "ساعة" (an hour of worldly time) share identical pronunciation, letter count, vowel order, and sequence while having distinct meanings, which defines Jinas Taamm.'
  },
  {
    id: 3,
    category: 'Usul al-Fiqh',
    question: 'Which legal maxim dictates that an established certainty cannot be nullified or overturned merely through subsequent speculative doubt?',
    arabicPrompt: 'القاعدة الكبرى الأولى في الفقه المقارن',
    options: [
      { key: 'A', text: 'الضرورات تبيح المحظورات (Necessities render prohibited things permissible)', isCorrect: false },
      { key: 'B', text: 'اليقين لا يزول بالشك (Certainty is not eliminated by doubt)', isCorrect: true },
      { key: 'C', text: 'المشقة تجلب التيسير (Hardship begets facility)', isCorrect: false },
      { key: 'D', text: 'العادة محكمة (Custom is an authoritative arbiter)', isCorrect: false }
    ],
    explanation: 'Al-Yaqeenu La Yazoolu Bish-Shakk establishes that once a status (e.g. ritual purity or contract validity) is verified with certainty, subsequent doubt cannot invalidate it without positive proof.'
  },
  {
    id: 4,
    category: 'Dissertation Defense',
    question: 'In Class 10 Capstone thesis evaluation, how should a researcher handle an apparent conflict between authentic textual Hadith and a speculative rational analogy (Qiyas)?',
    arabicPrompt: 'تقديم النص على القياس عند التعارض الظاهري',
    options: [
      { key: 'A', text: 'Prioritize the explicit textual Nas over Qiyas, as text constitutes foundational primary evidence', isCorrect: true },
      { key: 'B', text: 'Reject both and construct a novel philosophical formulation', isCorrect: false },
      { key: 'C', text: 'Prefer Qiyas unconditionally over solitary report chains', isCorrect: false },
      { key: 'D', text: 'Suspend all rulings permanently without synthesis', isCorrect: false }
    ],
    explanation: 'Classical Usul consensus prioritizes established textual evidence (Nas) over human analogical reasoning (Qiyas), as analogy cannot supersede explicit Divine revelation.'
  }
];

interface QuizStats {
  gamesPlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface FullSyllabusData {
  description: string;
  book1: string;
  book2: string;
}

const STATS_STORAGE_KEY = 'dhiu_viva_quiz_stats_v1';
const SYLLABUS_FULL_KEY = 'dhiu_viva_syllabus_full_v2';

const DEFAULT_STATS: QuizStats = {
  gamesPlayed: 14,
  correctAnswers: 48,
  wrongAnswers: 6
};

const DEFAULT_SYLLABUS: FullSyllabusData = {
  description: 'Chronological registry of past Viva Voce oral examination papers from year 2000 to 2026 covering classical Islamic jurisprudence, rhetoric, and Quranic sciences.',
  book1: 'تفسير البيضاوي ',
  book2: 'نور الأنوار في شرح المنار '
};

interface LiveTalentShowQuizProps {
  onOpenLiveBroadcaster?: () => void;
  onShowToast: (msg: string) => void;
  onClose?: () => void;
}

export const LiveTalentShowQuiz: React.FC<LiveTalentShowQuizProps> = ({
  onOpenLiveBroadcaster,
  onShowToast,
  onClose
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [resourceLinks, setResourceLinks] = useState<VivaResourceLink[]>([]);

  // Performance Stats State
  const [showStatsPanel, setShowStatsPanel] = useState<boolean>(false);
  const [stats, setStats] = useState<QuizStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Saved Links Modal States
  const [isLinksPortalOpen, setIsLinksPortalOpen] = useState<boolean>(false);
  const [selectedLinkDetail, setSelectedLinkDetail] = useState<VivaResourceLink | null>(null);

  // Sequential Add Link Modal States
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState<boolean>(false);
  const [newLinkTitle, setNewLinkTitle] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');

  // Dynamic Arabic Core Syllabus State
  const [syllabusData, setSyllabusData] = useState<FullSyllabusData>(() => {
    try {
      const saved = localStorage.getItem(SYLLABUS_FULL_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SYLLABUS;
    } catch {
      return DEFAULT_SYLLABUS;
    }
  });
  const [isEditSyllabusOpen, setIsEditSyllabusOpen] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<string>('');
  const [editBook1, setEditBook1] = useState<string>('');
  const [editBook2, setEditBook2] = useState<string>('');

  useEffect(() => {
    setResourceLinks(getVivaResourceLinks());
  }, []);

  const saveStats = (updated: QuizStats) => {
    setStats(updated);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  };

  const currentQ = TALENT_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (key: string, isCorrect: boolean) => {
    if (isAnswered) return; // prevent multiple selections

    setSelectedOptionKey(key);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 100 + streak * 25);
      setStreak(prev => prev + 1);
      saveStats({
        ...stats,
        correctAnswers: stats.correctAnswers + 1
      });
      onShowToast('🎉 ✓ Correct Answer! +100 XP awarded to candidate scoreboard!');
    } else {
      setStreak(0);
      saveStats({
        ...stats,
        wrongAnswers: stats.wrongAnswers + 1
      });
      onShowToast('❌ Incorrect answer. Review the examiner explanation rubric below.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TALENT_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionKey(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      saveStats({
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1
      });
      onShowToast(`🏆 Talent Show Assessment completed! Total Score: ${score + (selectedOptionKey && currentQ.options.find(o => o.key === selectedOptionKey)?.isCorrect ? 100 : 0)} XP`);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionKey(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setCompleted(false);
    saveStats({
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1
    });
    onShowToast('🔄 Live Show Talent Quiz reset. Ready for oral round 1!');
  };

  const handleOpenExternalPortal = (link: VivaResourceLink) => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
    onShowToast(`🌐 Opening portal: ${link.title}`);
  };

  // Save new external resource link handler
  const handleSaveNewLink = () => {
    const trimmedTitle = newLinkTitle.trim();
    const trimmedUrl = newLinkUrl.trim();

    if (!trimmedTitle) {
      onShowToast('⚠️ Please enter a Resource Display Title.');
      return;
    }
    if (!trimmedUrl) {
      onShowToast('⚠️ Please enter a Weblink URL Destination.');
      return;
    }

    const updated = saveVivaResourceLink({
      title: trimmedTitle,
      url: trimmedUrl,
      category: 'Institutional Portal'
    });

    setResourceLinks(updated);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddLinkModalOpen(false);
    onShowToast(`💾 ✓ Successfully saved link reference: "${trimmedTitle}"!`);
  };

  // Open Dynamic Edit Syllabus Modal
  const handleOpenEditSyllabus = () => {
    setEditDescription(syllabusData.description);
    setEditBook1(syllabusData.book1);
    setEditBook2(syllabusData.book2);
    setIsEditSyllabusOpen(true);
  };

  const handleSaveSyllabus = () => {
    const updated: FullSyllabusData = {
      description: editDescription.trim() || DEFAULT_SYLLABUS.description,
      book1: editBook1.trim() || DEFAULT_SYLLABUS.book1,
      book2: editBook2.trim() || DEFAULT_SYLLABUS.book2
    };
    setSyllabusData(updated);
    try {
      localStorage.setItem(SYLLABUS_FULL_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save syllabus', e);
    }
    setIsEditSyllabusOpen(false);
    onShowToast('💾 ✓ Syllabus changes saved and updated globally!');
  };

  return (
    <div 
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/95 via-zinc-900/98 to-pink-950/95 text-white backdrop-blur-2xl border-[1.5px] border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden space-y-6 animate-fade-in"
      id="section-live-show-talent-quiz"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Optional Top-Right Close Button */}
      {onClose && (
        <button
          type="button"
          id="btn-close-quiz-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header Bar: Title, Performance Stats Button, XP, and 🔗 Saved Links Launcher */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-purple-500/30 pb-5 pr-8">
        
        {/* Left Title & Arabic Core Syllabus */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-600/30 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>INTERACTIVE BOARD ARENA</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200 flex items-center gap-2.5">
            <span>🎤 Play Live Show Talent</span>
          </h2>

          {/* ======================================================== */}
          {/* 3. DYNAMIC SYLLABUS DISCOVERY & EDITING INTERFACE        */}
          {/* ======================================================== */}
          <div className="pt-2 space-y-2" id="arabic-syllabus-discovery-container">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>CORE SYLLABUS:</span>
              </span>

              {/* Book 1 Target Pill */}
              <div 
                id="syllabus-badge-book-1"
                className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-400/40 text-xs font-bold font-serif text-amber-200 shadow-2xs hover:border-amber-400/70 transition-all flex items-center gap-1.5"
              >
                <span>📖 {syllabusData.book1}</span>
              </div>

              {/* Book 2 Target Pill */}
              <div 
                id="syllabus-badge-book-2"
                className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-400/40 text-xs font-bold font-serif text-amber-200 shadow-2xs hover:border-amber-400/70 transition-all flex items-center gap-1.5"
              >
                <span>📖 {syllabusData.book2}</span>
              </div>

              {/* Interactive Outline Button: "📝 Edit Syllabus" */}
              <button
                type="button"
                id="btn-edit-syllabus"
                onClick={handleOpenEditSyllabus}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-purple-300/60 hover:border-pink-300 text-xs font-extrabold text-purple-100 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                <span>📝 Edit Syllabus</span>
              </button>
            </div>

            {/* Dynamic Registry Description */}
            <p className="text-xs text-purple-200/90 leading-relaxed font-sans max-w-2xl pl-0.5">
              {syllabusData.description}
            </p>
          </div>
        </div>

        {/* Right: "📊 Performance Stats", "🏆 0 XP", and "🔗" Standalone Circular Launcher */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Interactive Controller: "📊 Performance Stats" */}
            <button
              id="btn-performance-stats-toggle"
              type="button"
              onClick={() => setShowStatsPanel(!showStatsPanel)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer active:scale-95 border shadow-md ${
                showStatsPanel
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 shadow-cyan-500/30'
                  : 'bg-purple-900/80 hover:bg-purple-800 text-purple-100 hover:text-white border-purple-400/60 hover:border-cyan-400'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cyan-300" />
              <span>📊 Performance Stats</span>
            </button>

            {/* XP Display Pill */}
            <div className="px-3 py-2 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center gap-1.5 text-xs font-bold font-mono text-purple-200">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score} XP</span>
            </div>

            {/* Suffix Header Integration: Standalone Circular Launcher Button reading exactly: "🔗" */}
            <button
              id="btn-saved-links-circular-launcher"
              type="button"
              onClick={() => setIsLinksPortalOpen(true)}
              className="w-10 h-10 rounded-full bg-indigo-950/90 hover:bg-indigo-900 text-indigo-100 hover:text-white border-[1.5px] border-indigo-400/80 hover:border-pink-400 hover:shadow-[0_0_16px_rgba(99,102,241,0.45)] flex items-center justify-center text-base shadow-md transition-all cursor-pointer active:scale-95 group"
              title="Saved Links & Official Web Channels Portal"
            >
              <span className="leading-none select-none">🔗</span>
            </button>

            {streak > 0 && (
              <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 flex items-center gap-1.5 text-xs font-black font-mono text-amber-300 animate-bounce">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>{streak}x Streak!</span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SLIDE-DOWN HORIZONTAL METRICS STATISTICS PANEL           */}
          {/* ======================================================== */}
          {showStatsPanel && (
            <div 
              id="quiz-performance-stats-panel"
              className="w-full md:w-auto p-2.5 rounded-2xl bg-black/40 border border-cyan-500/40 backdrop-blur-xl shadow-lg animate-fade-in flex items-center gap-2 flex-wrap"
            >
              {/* Cell 1: Total Engagement */}
              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold font-mono text-xs flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Games Played: {stats.gamesPlayed}</span>
              </div>

              {/* Cell 2: Accuracy Tracker */}
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold font-mono text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>✓ Correct Answers: {stats.correctAnswers}</span>
              </div>

              {/* Cell 3: Error Log Tally */}
              <div className="px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold font-mono text-xs flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>✕ Wrong Answers: {stats.wrongAnswers}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Main MCQ Game Interactive Box */}
      {!completed ? (
        <div className="relative z-10 space-y-5" id="mcq-active-question-card">
          
          {/* Question Meta & Category Bar */}
          <div className="flex items-center justify-between text-xs text-purple-300">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-900/80 border border-purple-700 text-purple-200 font-bold">
                Round {currentQuestionIndex + 1} of {TALENT_QUIZ_QUESTIONS.length}
              </span>
              <span className="font-semibold text-pink-300">• {currentQ.category}</span>
            </div>

            <div className="text-[11px] font-mono text-purple-400">
              Instant Feedback Evaluation
            </div>
          </div>

          {/* Question Body */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-2">
            <h3 className="text-base sm:text-lg font-bold font-serif text-white leading-relaxed">
              {currentQ.question}
            </h3>
            
            {currentQ.arabicPrompt && (
              <p className="text-sm sm:text-base font-serif text-amber-300/90 font-medium dir-rtl text-right">
                {currentQ.arabicPrompt}
              </p>
            )}
          </div>

          {/* Multiple Choice Options Grid (Real-Time Visual Feedback State Machine) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="mcq-options-grid">
            {currentQ.options.map(option => {
              const isSelected = selectedOptionKey === option.key;
              const isCorrectOption = option.isCorrect;

              // Visual State Classes based on Feedback State Machine
              let containerStyle = 'bg-zinc-900/80 border-purple-500/30 text-zinc-200 hover:border-purple-400 hover:bg-zinc-800/80 hover:shadow-md';
              let badgeStyle = 'bg-purple-900/60 text-purple-300 border-purple-700';

              if (isAnswered) {
                if (isSelected) {
                  if (isCorrectOption) {
                    // MINT-GREEN CORRECT BOUNDING CONTAINER
                    containerStyle = 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/50 scale-[1.01]';
                    badgeStyle = 'bg-emerald-500 text-black border-emerald-300 font-black';
                  } else {
                    // CORAL-RED INCORRECT BOUNDING CONTAINER
                    containerStyle = 'bg-rose-950/80 border-2 border-rose-500 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.45)] ring-2 ring-rose-500/50';
                    badgeStyle = 'bg-rose-600 text-white border-rose-400 font-black';
                  }
                } else if (isCorrectOption) {
                  // Reveal correct answer if wrong selected
                  containerStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
                  badgeStyle = 'bg-emerald-600/60 text-emerald-200 border-emerald-400';
                } else {
                  containerStyle = 'opacity-40 bg-zinc-900/40 border-zinc-800 text-zinc-500';
                }
              }

              return (
                <button
                  key={option.key}
                  id={`btn-quiz-option-${option.key.toLowerCase()}`}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(option.key, option.isCorrect)}
                  className={`p-4 rounded-2xl border-[1.5px] transition-all text-left flex items-start gap-3 cursor-pointer disabled:cursor-default ${containerStyle}`}
                >
                  <span className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-mono font-bold shrink-0 ${badgeStyle}`}>
                    {option.key}
                  </span>

                  <div className="space-y-1 flex-1">
                    <p className="text-xs sm:text-sm font-semibold leading-snug">
                      {option.text}
                    </p>

                    {/* Real-time Indicator Strings */}
                    {isAnswered && isSelected && (
                      <div className="pt-1 flex items-center gap-1.5 text-xs font-black">
                        {isCorrectOption ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Correct Answer! (+100 XP)</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            <span>✕ Incorrect - Try Again</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Rubric & Next Progression Controls */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-purple-900/40 border border-purple-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <HelpCircle className="w-4 h-4" />
                <span>Examiner Rubric &amp; Shari'ah Justification:</span>
              </div>
              
              <p className="text-xs text-purple-200 leading-relaxed pl-6 border-l-2 border-amber-400/60">
                {currentQ.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  id="btn-next-talent-question"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/40 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{currentQuestionIndex < TALENT_QUIZ_QUESTIONS.length - 1 ? 'Next Question Round →' : 'View Final Score Card 🏆'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Completion Screen */
        <div className="relative z-10 text-center py-8 space-y-5 animate-fade-in" id="quiz-complete-card">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-1 mx-auto shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
              Talent Show Round Completed!
            </h3>
            <p className="text-xs sm:text-sm text-purple-200">
              You achieved a total score of <span className="font-bold text-amber-300">{score} XP</span> across the Class 10 Viva Voce defense assessment.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 rounded-2xl bg-white text-zinc-900 hover:bg-purple-100 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => setShowStatsPanel(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Performance Stats</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. SAVED LINKS & CHANNELS PORTAL MODAL (Z-50)            */}
      {/* ======================================================== */}
      {isLinksPortalOpen && (
        <div 
          id="modal-saved-links-portal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLinksPortalOpen(false);
          }}
        >
          <div className="w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-zinc-950/98 border-[1.5px] border-indigo-500 shadow-2xl shadow-indigo-950/80 space-y-5 text-white relative animate-smooth-entry">
            
            {/* Modal Header & Top Action Section: "➕ Add Link" */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border-[1.5px] border-indigo-400 flex items-center justify-center text-xl shadow-inner shadow-indigo-500/30">
                  🔗
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                    Saved Links &amp; Institutional Web Channels
                  </h3>
                  <p className="text-[11px] text-indigo-300">
                    Active directory of authenticated exam rubrics &amp; oral web channels
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-add-link-top-anchor"
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs border-[1.5px] border-indigo-300 shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>➕ Add Link</span>
                </button>

                <button
                  type="button"
                  id="btn-close-links-portal"
                  onClick={() => setIsLinksPortalOpen(false)}
                  className="p-2 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-indigo-500/40 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Independent Separate 3D Box Directory */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1" id="links-box-directory-list">
              {resourceLinks.map((link, idx) => (
                <div 
                  key={link.id || idx}
                  className="p-4 sm:p-4.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850/90 border-[1.5px] border-indigo-500/50 hover:border-indigo-400/80 shadow-lg shadow-indigo-950/40 hover:shadow-indigo-950/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Title is an active button click listener */}
                    <button
                      type="button"
                      id={`btn-link-title-inspect-${idx}`}
                      onClick={() => setSelectedLinkDetail(link)}
                      className="text-left font-bold text-sm sm:text-base text-white group-hover:text-indigo-200 transition-colors flex items-center gap-2 cursor-pointer hover:underline"
                    >
                      <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </button>
                    
                    <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950/90 border-[1.5px] border-indigo-700/60 text-indigo-200 font-bold">
                        {link.category || 'Viva Voce Exam'}
                      </span>
                      <span className="text-zinc-400">• Authenticated Portal</span>
                    </div>
                  </div>

                  {/* Actions: Details & Link anchor "🌐 Play via Web Channel" */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      id={`btn-link-details-open-${idx}`}
                      onClick={() => setSelectedLinkDetail(link)}
                      className="px-3 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Details
                    </button>
                    <a
                      id={`btn-launch-link-direct-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenExternalPortal(link);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 border-[1.5px] border-indigo-300 hover:border-pink-300 text-white text-xs font-extrabold shadow-md shadow-pink-600/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                    >
                      <span>🌐 Play via Web Channel</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-mono text-indigo-300 font-bold">{resourceLinks.length} Active Web Portals</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-add-link-footer"
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border-[1.5px] border-indigo-400 text-xs font-extrabold text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕ Add Link</span>
                </button>
                <button
                  type="button"
                  id="btn-close-links-portal-footer"
                  onClick={() => setIsLinksPortalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Close Directory
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SEQUENTIAL "ADD LINK" MANAGER CONSOLE MODAL (Z-70)    */}
      {/* ======================================================== */}
      {isAddLinkModalOpen && (
        <div 
          id="modal-add-link-sequential"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddLinkModalOpen(false);
              setNewLinkTitle('');
              setNewLinkUrl('');
            }
          }}
        >
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-zinc-950 border-[1.5px] border-indigo-500 shadow-2xl shadow-indigo-950/80 space-y-5 text-white relative animate-smooth-entry">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border-[1.5px] border-indigo-400 flex items-center justify-center text-lg shadow-inner shadow-indigo-500/30">
                  ➕
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-white">
                    Add External Link Reference
                  </h3>
                  <p className="text-[11px] text-indigo-300">
                    Register a new live exam venue or oral guidelines channel
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-add-link-dialog"
                onClick={() => {
                  setIsAddLinkModalOpen(false);
                  setNewLinkTitle('');
                  setNewLinkUrl('');
                }}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-[1.5px] border-indigo-500/40 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form Fields */}
            <div className="space-y-4">
              {/* Input Field 1 (Resource Display Title) */}
              <div className="space-y-1.5">
                <label htmlFor="input-new-link-title" className="text-xs font-bold text-indigo-200 block tracking-wide">
                  Resource Display Title:
                </label>
                <input
                  type="text"
                  id="input-new-link-title"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  placeholder="e.g., Live Registration Site"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border-[1.5px] border-indigo-500/50 hover:border-indigo-400/80 text-sm font-medium text-white placeholder:text-zinc-400 placeholder:opacity-80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-950 focus:shadow-[0_0_16px_rgba(99,102,241,0.35)] outline-none transition-all duration-200 caret-white selection:bg-indigo-600 selection:text-white"
                  style={{ color: '#ffffff', backgroundColor: '#18181b' }}
                />
              </div>

              {/* Input Field 2 (Weblink URL Destination) */}
              <div className="space-y-1.5">
                <label htmlFor="input-new-link-url" className="text-xs font-bold text-indigo-200 block tracking-wide">
                  Weblink URL Destination:
                </label>
                <input
                  type="url"
                  id="input-new-link-url"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  placeholder="e.g., https://dhiu.edu.eg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border-[1.5px] border-indigo-500/50 hover:border-indigo-400/80 text-sm font-mono text-white placeholder:text-zinc-400 placeholder:opacity-80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-950 focus:shadow-[0_0_16px_rgba(99,102,241,0.35)] outline-none transition-all duration-200 caret-white selection:bg-indigo-600 selection:text-white"
                  style={{ color: '#ffffff', backgroundColor: '#18181b' }}
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/60 border-[1.5px] border-indigo-800/60 text-xs text-indigo-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Saved instantly into global database and live matrix directory.</span>
              </div>
            </div>

            {/* Execution Actions: Cancel and 💾 Save Link Reference */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                id="btn-cancel-add-link"
                onClick={() => {
                  setIsAddLinkModalOpen(false);
                  setNewLinkTitle('');
                  setNewLinkUrl('');
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-save-link-reference"
                onClick={handleSaveNewLink}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold border-[1.5px] border-indigo-300 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>💾 Save Link Reference</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. NESTED DEEP-DIVE PARAMETER SUMMARY PREVIEW MODAL      */}
      {/* ======================================================== */}
      {selectedLinkDetail && (
        <div 
          id="modal-link-parameter-summary-preview"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLinkDetail(null);
          }}
        >
          <div className="w-full max-w-lg p-6 rounded-3xl bg-zinc-950 border-[1.5px] border-indigo-500 shadow-2xl shadow-indigo-950/80 space-y-5 text-white relative animate-smooth-entry">
            
            {/* Header Title & Authenticated Flag */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold font-mono shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>✓ Authenticated Web Channel</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-white leading-snug">
                  {selectedLinkDetail.title}
                </h3>
              </div>

              <button
                type="button"
                id="btn-close-link-detail-preview"
                onClick={() => setSelectedLinkDetail(null)}
                className="p-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-indigo-500/40 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Rows */}
            <div className="p-4 rounded-2xl bg-zinc-900 border-[1.5px] border-indigo-900/50 space-y-3 font-sans text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Target URL Destination String:</span>
                <span className="font-mono text-pink-300 break-all select-all font-semibold">
                  {selectedLinkDetail.url}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Category Tracking:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono font-bold">
                  {selectedLinkDetail.category || 'Viva Voce Exam'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 font-medium">Date Log Entry:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  Added Today
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-400 font-medium">Verification Protocol:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <a
                id="btn-visit-portal-action-anchor"
                href={selectedLinkDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(selectedLinkDetail.url, '_blank', 'noopener,noreferrer');
                  onShowToast(`🌐 Opening authenticated channel: ${selectedLinkDetail.title}`);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm border-[1.5px] border-indigo-300 shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>🌐 Play via Web Channel ↗</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                id="btn-back-to-links-directory"
                onClick={() => setSelectedLinkDetail(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-850 hover:bg-zinc-750 border-[1.5px] border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer text-center"
              >
                ← Back to Links Directory
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DYNAMIC SYLLABUS DISCOVERY & EDITING INTERFACE MODAL  */}
      {/* ======================================================== */}
      {isEditSyllabusOpen && (
        <div 
          id="modal-edit-syllabus-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-zinc-900 border-[1.5px] border-purple-500/60 shadow-2xl shadow-purple-950/50 space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-serif text-white">
                    Dynamic Syllabus Management Console
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Configure curriculum description and core textbook references
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-close-edit-syllabus-dialog"
                onClick={() => setIsEditSyllabusOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ingestion Workflow Form */}
            <div className="space-y-4">
              {/* Input A (Description) */}
              <div className="space-y-1.5">
                <label htmlFor="input-syllabus-description-a" className="text-xs font-bold text-zinc-200 block tracking-wide">
                  Input A — Syllabus Registry Description:
                </label>
                <textarea
                  id="input-syllabus-description-a"
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  placeholder="Chronological registry of past Viva Voce oral examination papers from year 2000 to 2026..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border-[1.5px] border-purple-500/40 hover:border-purple-400/60 text-sm font-medium text-white placeholder:text-zinc-400 placeholder:opacity-80 focus:border-purple-500 focus:ring-2 focus:ring-purple-950 focus:shadow-[0_0_16px_rgba(168,85,247,0.35)] outline-none leading-relaxed transition-all duration-200 caret-white selection:bg-purple-600 selection:text-white"
                  style={{ color: '#ffffff', backgroundColor: '#09090b' }}
                />
              </div>

              {/* Input B (Book Target 1) */}
              <div className="space-y-1.5">
                <label htmlFor="input-syllabus-book-target-1" className="text-xs font-bold text-zinc-200 block tracking-wide">
                  Input B — Core Textbook 1 (Book Target 1):
                </label>
                <input
                  type="text"
                  id="input-syllabus-book-target-1"
                  value={editBook1}
                  onChange={e => setEditBook1(e.target.value)}
                  placeholder="تفسير البيضاوي "
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border-[1.5px] border-purple-500/40 hover:border-purple-400/60 text-sm sm:text-base font-serif font-bold text-white placeholder:text-zinc-400 placeholder:opacity-80 focus:border-purple-500 focus:ring-2 focus:ring-purple-950 focus:shadow-[0_0_16px_rgba(168,85,247,0.35)] outline-none transition-all duration-200 caret-white selection:bg-purple-600 selection:text-white"
                  style={{ color: '#ffffff', backgroundColor: '#09090b' }}
                />
              </div>

              {/* Input C (Book Target 2) */}
              <div className="space-y-1.5">
                <label htmlFor="input-syllabus-book-target-2" className="text-xs font-bold text-zinc-200 block tracking-wide">
                  Input C — Core Textbook 2 (Book Target 2):
                </label>
                <input
                  type="text"
                  id="input-syllabus-book-target-2"
                  value={editBook2}
                  onChange={e => setEditBook2(e.target.value)}
                  placeholder="نور الأنوار في شرح المنار "
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border-[1.5px] border-purple-500/40 hover:border-purple-400/60 text-sm sm:text-base font-serif font-bold text-white placeholder:text-zinc-400 placeholder:opacity-80 focus:border-purple-500 focus:ring-2 focus:ring-purple-950 focus:shadow-[0_0_16px_rgba(168,85,247,0.35)] outline-none transition-all duration-200 caret-white selection:bg-purple-600 selection:text-white"
                  style={{ color: '#ffffff', backgroundColor: '#09090b' }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  High-contrast typography with instant global synchronization
                </span>
                <span className="font-mono text-zinc-500">Live UTF-8</span>
              </div>
            </div>

            {/* State Mutation Action: Save Syllabus Changes */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                id="btn-cancel-edit-syllabus"
                onClick={() => setIsEditSyllabusOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-save-syllabus-changes"
                onClick={handleSaveSyllabus}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>💾 Save Syllabus Changes</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

