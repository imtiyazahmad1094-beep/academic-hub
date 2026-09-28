import React, { useState } from 'react';
import { 
  ArrowLeft,
  Search, 
  Sparkles, 
  BookOpen, 
  Star, 
  Play, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Trophy, 
  HelpCircle,
  GraduationCap,
  Radio,
  Gamepad2,
  Brain,
  Zap,
  Flame,
  Globe2,
  Atom,
  Film,
  Music,
  Award,
  ChevronRight,
  UserCheck,
  Clapperboard,
  Activity,
  Layers,
  FileText,
  Mic,
  Calendar,
  X
} from 'lucide-react';
import { QuizItem } from '../../types';
import { soundFX } from '../../utils/audioUtils';

interface QuizDiscoveryHubProps {
  quizzes: QuizItem[];
  onBackToDashboard?: () => void;
  onSelectQuiz: (quiz: QuizItem, mode: 'lobby' | 'arena') => void;
  onJoinWithPin: (pin: string) => void;
  onOpenQuizEditor: () => void;
  onOpenAiGenerator: () => void;
  onHostLiveGame?: () => void;
  onOpenFlashcards?: () => void;
  onOpenVivaDomains?: () => void;
  onOpenLeaderboard?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const QuizDiscoveryHub: React.FC<QuizDiscoveryHubProps> = ({
  quizzes,
  onBackToDashboard,
  onSelectQuiz,
  onJoinWithPin,
  onOpenQuizEditor,
  onOpenAiGenerator,
  onHostLiveGame,
  onOpenFlashcards,
  onOpenVivaDomains,
  onOpenLeaderboard,
  onShowToast
}) => {
  const [pinInput, setPinInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'quiz' | 'trivia' | 'lesson' | 'viva' | 'leaderboard'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showPromoRibbon, setShowPromoRibbon] = useState(true);

  // Brain games cards reveal state
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});

  // 5 Tabs: 📘 Quiz, 🎙️ Viva Quiz, 🏅 Leaderboard, 📑 Flashcards, 🏆 Trivia
  const workspaceTabs = [
    { id: 'quiz', label: 'Quiz', icon: '📘' },
    { id: 'viva', label: 'Viva Quiz', icon: '🎙️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏅' },
    { id: 'lesson', label: 'Flashcards', icon: '📑' },
    { id: 'trivia', label: 'Trivia', icon: '🏆' },
  ] as const;

  // Exactly 9 Standalone 3D Blocks with solid thin 1.5px border outline
  // 1. General Knowledge (Deep Violet)
  // 2. Geography (Mint Green)
  // 3. Science (Sky Blue)
  // 4. History (Coral Red)
  // 5. Sports (Amber Gold)
  // 6. Bollywood/Culture (Tangerine)
  // 7. Hollywood/Media (Bright Purple)
  // 8. Cricket/Athletics (Electric Blue)
  // 9. Harry Potter (Deep Indigo with a lightning bolt glyph ⚡)
  const nineBoxMatrix = [
    {
      id: 'general-knowledge',
      label: 'General Knowledge',
      theme: 'from-violet-900 to-indigo-950 border-violet-500/70 shadow-violet-500/25',
      badgeColor: 'bg-violet-500',
      icon: Compass
    },
    {
      id: 'geography',
      label: 'Geography',
      theme: 'from-emerald-900 to-teal-950 border-emerald-500/70 shadow-emerald-500/25',
      badgeColor: 'bg-emerald-500',
      icon: Globe2
    },
    {
      id: 'science',
      label: 'Science',
      theme: 'from-sky-900 to-blue-950 border-sky-500/70 shadow-sky-500/25',
      badgeColor: 'bg-sky-500',
      icon: Atom
    },
    {
      id: 'history',
      label: 'History',
      theme: 'from-rose-900 to-red-950 border-rose-500/70 shadow-rose-500/25',
      badgeColor: 'bg-rose-500',
      icon: GraduationCap
    },
    {
      id: 'sports',
      label: 'Sports',
      theme: 'from-amber-900 to-yellow-950 border-amber-500/70 shadow-amber-500/25',
      badgeColor: 'bg-amber-500',
      icon: Trophy
    },
    {
      id: 'bollywood',
      label: 'Bollywood/Culture',
      theme: 'from-orange-900 to-amber-950 border-orange-500/70 shadow-orange-500/25',
      badgeColor: 'bg-orange-500',
      icon: Film
    },
    {
      id: 'hollywood',
      label: 'Hollywood/Media',
      theme: 'from-purple-900 to-fuchsia-950 border-purple-500/70 shadow-purple-500/25',
      badgeColor: 'bg-purple-500',
      icon: Clapperboard
    },
    {
      id: 'cricket',
      label: 'Cricket/Athletics',
      theme: 'from-blue-900 to-cyan-950 border-blue-500/70 shadow-blue-500/25',
      badgeColor: 'bg-blue-500',
      icon: Activity
    },
    {
      id: 'harry-potter',
      label: 'Harry Potter',
      theme: 'from-indigo-950 via-slate-900 to-violet-950 border-indigo-400/80 shadow-indigo-500/30',
      badgeColor: 'bg-amber-400',
      icon: Zap
    }
  ];

  // 12 Distinct sequential 3D capsule boxes containing grade level milestones: Grade 1 through Grade 12
  const gradeLevels = Array.from({ length: 12 }, (_, i) => i + 1);

  // Discover Creators Feed data
  const discoverCreators = [
    {
      id: 'c-1',
      name: 'Dr. Tariq Al-Mansoor',
      institution: 'DHIU PYQ Research Hub',
      avatar: '👨‍🏫',
      quizzesCount: 42,
      followers: '12.8k',
      rating: 4.9,
      cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      specialty: 'Islamic Jurisprudence & Logic'
    },
    {
      id: 'c-2',
      name: 'Prof. Elena Rostova',
      institution: 'Cavendish Quantum Lab',
      avatar: '👩‍🔬',
      quizzesCount: 28,
      followers: '9.4k',
      rating: 4.8,
      cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      specialty: 'Quantum Computing & Algorithms'
    },
    {
      id: 'c-3',
      name: 'Prof. Marcus Vance',
      institution: 'Oxford AI Ethics Institute',
      avatar: '👨‍🎓',
      quizzesCount: 35,
      followers: '15.2k',
      rating: 5.0,
      cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      specialty: 'Machine Learning Ethics'
    }
  ];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) {
      onShowToast('Please enter a room PIN code (e.g. 123 456)', 'info');
      return;
    }
    onJoinWithPin(cleanPin);
  };

  const handleTabSelect = (tab: 'quiz' | 'trivia' | 'lesson' | 'viva' | 'leaderboard') => {
    setActiveTab(tab);
    soundFX.playTick(0.2);
    if (tab === 'viva') {
      if (onOpenVivaDomains) {
        onShowToast('Opening Viva Oral Defense Domain Selection...', 'info');
        onOpenVivaDomains();
      }
    } else if (tab === 'leaderboard') {
      if (onOpenLeaderboard) {
        onShowToast('Opening Academic Hub Global Leaderboard...', 'info');
        onOpenLeaderboard();
      }
    } else if (tab === 'lesson' && onOpenFlashcards) {
      onShowToast('Entering Play by Flashcards (Viva Module)...', 'info');
      onOpenFlashcards();
    }
  };

  const toggleBrainCard = (index: number) => {
    soundFX.playTick(0.25);
    setRevealedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = !searchQuery.trim() || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.pinCode.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div id="quiz-discovery-portal-hub" className="space-y-8 animate-fade-in pb-12">
      
      {/* ======================================================== */}
      {/* SECTION 39: PROMOTIONAL RIBBON                           */}
      {/* ======================================================== */}
      {showPromoRibbon && (
        <div className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-teal-500/20 border border-amber-400/40 text-xs font-mono backdrop-blur-md shadow-md animate-fade-in">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wide shadow-xs">
              SAVE $60
            </span>
            <span className="text-slate-900 dark:text-white font-bold">
              <span className="line-through text-slate-400 dark:text-slate-500 mr-1.5">$99.99</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">$39.99/yr</span>
            </span>
            <span className="hidden md:inline-block text-slate-400">•</span>
            <span className="text-purple-700 dark:text-purple-300 font-extrabold uppercase tracking-wide">
              PREMIUM PLUS ACADEMIC PASS
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onShowToast('Institutional 60% discount code activated!', 'success')}
              className="px-3.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-xs border-t border-white/60 transition-transform active:translate-y-0.5"
            >
              Claim Offer
            </button>
            <button
              type="button"
              onClick={() => setShowPromoRibbon(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/10 transition-colors cursor-pointer"
              title="Dismiss promotion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 1: TOP NAVIGATION CONTROL BAR                     */}
      {/* ======================================================== */}
      <div 
        id="quiz-top-nav-control-bar"
        className="glass-panel p-3.5 sm:p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 border-t-2 border-white/60 dark:border-white/20 border-b-4 border-slate-900/20 dark:border-black shadow-2xl backdrop-blur-2xl"
      >
        {/* Left Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-emerald-400 flex items-center justify-center text-teal-950 font-black shadow-md border-t border-white/60 border-b-2 border-teal-800 shrink-0">
            <Trophy className="w-5 h-5 text-teal-950" />
          </div>
          <div className="flex flex-col justify-center">
            <button
              type="button"
              id="btn-return-homepage"
              onClick={onBackToDashboard}
              title="Return to Homepage"
              aria-label="Return to Homepage"
              className="group inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer w-fit mb-0.5"
            >
              <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 group-hover:shadow-[0_0_10px_rgba(45,212,191,0.25)] transition-all">
                <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-transform group-hover:-translate-x-0.5" />
              </span>
            </button>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Academic Hub — Master Quiz, Viva &amp; Flashcard Ecosystem
            </div>
          </div>
        </div>

        {/* Center: Rounded Capsule PIN Ingestion Box */}
        <form 
          onSubmit={handlePinSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border-2 border-emerald-400/70 dark:border-emerald-500/50 shadow-inner w-full md:w-auto max-w-md"
        >
          <Radio className="w-4 h-4 text-emerald-500 shrink-0 animate-pulse" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">
            Join Game? Enter PIN:
          </span>
          <input
            type="text"
            id="input-quick-join-pin"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder="123 456"
            className="w-24 sm:w-28 bg-transparent text-xs sm:text-sm font-mono font-black tracking-widest text-slate-900 dark:text-teal-300 placeholder-slate-400 outline-none uppercase"
          />
          <button
            type="submit"
            className="px-3.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all cursor-pointer border-t border-white/40 border-b-2 border-emerald-800 shadow-sm active:translate-y-0.5 active:border-b-0"
          >
            Join
          </button>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 font-black text-xs border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('main-search-quizzes-input');
              if (el) el.focus();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide border-t-2 border-white/50 border-b-4 border-indigo-900 dark:border-black shadow-lg shadow-sky-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>🔍</span>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 09: QUIZ HERO (SPLIT LAYOUT WITH 3D ABSTRACT VISUAL) */}
      {/* ======================================================== */}
      <div 
        id="module-1-main-search-hero"
        className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-50/95 via-sky-50/85 to-teal-50/95 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 border-t-2 border-white/90 dark:border-white/30 border-b-4 border-slate-300/80 dark:border-black text-slate-900 dark:text-white shadow-2xl relative overflow-hidden"
      >
        {/* Subtle background ambient mesh */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Hero Column: Headings & Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30 dark:border-teal-500/40">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span>Academic Hub Viva &amp; Competitive Engine</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
                Take Quizzes. Learn.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 dark:from-teal-300 dark:via-cyan-300 dark:to-amber-300">
                  Challenge Yourself.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
                Explore academic quizzes, test your knowledge, join live rooms, and build your own learning challenges. Ingest syllabi, defend doctoral arguments, and track weekly honor roll ranks.
              </p>
            </div>

            {/* Primary & Secondary Actions (Section 09) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Action 1: [ Host Live Game ] (Gold/Amber) */}
              <button
                type="button"
                id="btn-hero-host-live"
                onClick={onHostLiveGame || (() => onSelectQuiz(quizzes[0], 'lobby'))}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/80 border-b-4 border-amber-950 shadow-xl shadow-amber-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>Host Live Game</span>
              </button>

              {/* Action 2: [ Join Game ] (Mint/Teal) */}
              <button
                type="button"
                id="btn-hero-join-game"
                onClick={() => {
                  const el = document.getElementById('input-quick-join-pin');
                  if (el) el.focus();
                  onShowToast('Enter your 6-digit room PIN above to join', 'info');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/50 border-b-4 border-emerald-950 shadow-xl shadow-emerald-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Join Game</span>
              </button>

              {/* Action 3: [ Create Quiz ] */}
              <button
                type="button"
                id="btn-hero-create-quiz"
                onClick={onOpenQuizEditor}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-white font-black text-xs sm:text-sm border-t-2 border-white/60 dark:border-white/20 border-b-4 border-slate-300 dark:border-black shadow-md transition-all cursor-pointer flex items-center gap-2 hover:-translate-y-1 active:translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Create Quiz</span>
              </button>

              {/* Action 4: [ 🎙️ Viva Defense ] */}
              {onOpenVivaDomains && (
                <button
                  type="button"
                  id="btn-hero-viva-quiz"
                  onClick={onOpenVivaDomains}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm border-t-2 border-white/30 border-b-4 border-purple-950 shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-2 hover:-translate-y-1 active:translate-y-0.5"
                >
                  <Mic className="w-4 h-4 text-purple-200" />
                  <span>Viva Defense</span>
                </button>
              )}

              {/* Secondary Action: [ Explore Categories ] */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('quiz-category-explorer-rail');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 rounded-2xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-bold text-xs underline cursor-pointer transition-colors"
              >
                Explore Categories ↓
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-950/80 border-2 border-slate-300 dark:border-slate-700 p-1.5 focus-within:border-sky-500 dark:focus-within:border-cyan-400 shadow-md transition-all">
                <input
                  id="main-search-quizzes-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search thousands of scholarly quizzes &amp; viva questions..."
                  className="w-full pl-4 pr-12 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => onShowToast(`Searching quizzes for "${searchQuery}"`, 'info')}
                  className="absolute right-2 w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-400 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Large Abstract Academic 3D Visual (Section 09) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              
              {/* Outer Glowing Orbital Ring */}
              <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-purple-500/25 pointer-events-none" />

              {/* Center 3D Monograph / Question Card Stack */}
              <div className="relative z-10 w-48 h-60 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 border-2 border-teal-500/80 dark:border-teal-400/80 border-t-2 border-t-white/80 dark:border-t-white/50 border-b-4 border-b-slate-300 dark:border-b-black shadow-[0_20px_40px_rgba(45,212,191,0.25)] p-5 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer group text-slate-900 dark:text-white">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-teal-500 text-white dark:bg-teal-400 dark:text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                    Ω
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-mono text-[10px] border border-teal-300 dark:border-teal-500/30">
                    Live Room
                  </span>
                </div>
                
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Doctoral Inquest</span>
                  <h4 className="font-serif font-black text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-amber-300 transition-colors">
                    Institutional Governance &amp; Ethics
                  </h4>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2">
                    <div className="h-full bg-teal-500 dark:bg-teal-400 rounded-full w-3/4" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Slide 01/10</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">941 985</span>
                </div>
              </div>

              {/* Floating Knowledge Card 1: Top-Right (Thesis Card) */}
              <div className="absolute -top-3 -right-2 z-20 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border-2 border-purple-500/50 dark:border-purple-500/60 border-t-2 border-t-white/80 dark:border-t-white/40 border-b-3 border-slate-300 dark:border-black shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-bounce-slow text-slate-900 dark:text-white">
                <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Oral Defense</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white font-mono">Tanzimat Reforms</div>
                </div>
              </div>

              {/* Floating Knowledge Card 2: Bottom-Left (Score Pill) */}
              <div className="absolute -bottom-2 -left-2 z-20 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/90 border-2 border-amber-400/70 border-t-2 border-t-white/80 dark:border-t-white/40 border-b-3 border-slate-300 dark:border-black shadow-xl backdrop-blur-md flex items-center gap-2.5 text-slate-900 dark:text-white">
                <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  🏆
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Leaderboard Rank</div>
                  <div className="text-xs font-black text-amber-600 dark:text-amber-300 font-mono">#01 • 9,840 pts</div>
                </div>
              </div>

              {/* Floating Knowledge Card 3: Top-Left (AI Accuracy Node) */}
              <div className="absolute top-8 -left-6 z-10 px-3 py-1.5 rounded-xl bg-emerald-50/95 dark:bg-emerald-950/80 border border-emerald-400/60 dark:border-emerald-500/40 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>96.5% Accuracy</span>
              </div>

            </div>
          </div>

        </div>
      </div>
      {/* ======================================================== */}
      {/* SECTION 10: QUIZ CATEGORY EXPLORER (17 CATEGORIES RAIL)  */}
      {/* ======================================================== */}
      <div id="quiz-category-explorer-rail" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black font-serif text-slate-900 dark:text-white tracking-tight">
                Explore Quiz Categories
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                17 Specialized academic disciplines with peer-reviewed inquiry sets
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Scroll horizontally →
          </span>
        </div>

        {/* Horizontally Scrollable Category Rail with 3D tactile cards */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none px-1">
          {[
            { id: 'all', title: 'All Fields', icon: '🌟', count: '100K+ Qs', color: 'from-slate-700 via-slate-800 to-slate-900 border-slate-500 dark:from-slate-800 dark:to-slate-950' },
            { id: 'general-knowledge', title: 'General Knowledge', icon: '🧭', count: '4,200 Qs', color: 'from-violet-600 via-purple-600 to-indigo-700 border-violet-400 dark:from-violet-900 dark:to-indigo-950 dark:border-violet-500/60' },
            { id: 'history', title: 'History', icon: '🏛️', count: '6,800 Qs', color: 'from-rose-600 via-red-600 to-amber-700 border-rose-400 dark:from-rose-900 dark:to-red-950 dark:border-rose-500/60' },
            { id: 'islamic-studies', title: 'Islamic Studies', icon: '📖', count: '8,400 Qs', color: 'from-emerald-600 via-teal-600 to-cyan-700 border-emerald-400 dark:from-emerald-900 dark:to-teal-950 dark:border-emerald-500/60' },
            { id: 'geography', title: 'Geography', icon: '🌍', count: '3,100 Qs', color: 'from-teal-600 via-cyan-600 to-blue-700 border-teal-400 dark:from-teal-900 dark:to-cyan-950 dark:border-teal-500/60' },
            { id: 'science', title: 'Science', icon: '🔬', count: '7,900 Qs', color: 'from-sky-600 via-blue-600 to-indigo-700 border-sky-400 dark:from-sky-900 dark:to-blue-950 dark:border-sky-500/60' },
            { id: 'mathematics', title: 'Mathematics', icon: '📐', count: '5,200 Qs', color: 'from-blue-600 via-indigo-600 to-purple-700 border-blue-400 dark:from-blue-900 dark:to-indigo-950 dark:border-blue-500/60' },
            { id: 'languages', title: 'Languages', icon: '🗣️', count: '3,800 Qs', color: 'from-amber-500 via-orange-500 to-rose-600 border-amber-400 dark:from-amber-900 dark:to-yellow-950 dark:border-amber-500/60' },
            { id: 'literature', title: 'Literature', icon: '📚', count: '4,600 Qs', color: 'from-purple-600 via-fuchsia-600 to-pink-700 border-purple-400 dark:from-purple-900 dark:to-fuchsia-950 dark:border-purple-500/60' },
            { id: 'logic-reasoning', title: 'Logic & Reasoning', icon: '🧠', count: '3,400 Qs', color: 'from-indigo-600 via-violet-600 to-purple-700 border-indigo-400 dark:from-indigo-900 dark:to-violet-950 dark:border-indigo-500/60' },
            { id: 'computer-science', title: 'Computer Science', icon: '💻', count: '6,100 Qs', color: 'from-cyan-600 via-teal-600 to-emerald-700 border-cyan-400 dark:from-cyan-900 dark:to-slate-950 dark:border-cyan-500/60' },
            { id: 'technology', title: 'Technology', icon: '⚡', count: '4,900 Qs', color: 'from-blue-600 via-sky-600 to-teal-700 border-sky-400 dark:from-sky-950 dark:to-indigo-950 dark:border-sky-500/60' },
            { id: 'sports', title: 'Sports', icon: '🏆', count: '2,800 Qs', color: 'from-orange-500 via-amber-500 to-yellow-600 border-orange-400 dark:from-orange-900 dark:to-amber-950 dark:border-orange-500/60' },
            { id: 'culture', title: 'Culture', icon: '🎭', count: '3,500 Qs', color: 'from-pink-600 via-rose-600 to-red-700 border-pink-400 dark:from-pink-900 dark:to-rose-950 dark:border-pink-500/60' },
            { id: 'current-affairs', title: 'Current Affairs', icon: '📰', count: '4,100 Qs', color: 'from-red-600 via-rose-600 to-pink-700 border-red-400 dark:from-red-900 dark:to-slate-950 dark:border-red-500/60' },
            { id: 'art', title: 'Art & Aesthetics', icon: '🎨', count: '2,900 Qs', color: 'from-fuchsia-600 via-purple-600 to-indigo-700 border-fuchsia-400 dark:from-fuchsia-900 dark:to-purple-950 dark:border-fuchsia-500/60' },
            { id: 'medicine', title: 'Medicine', icon: '⚕️', count: '5,700 Qs', color: 'from-teal-600 via-emerald-600 to-green-700 border-teal-400 dark:from-teal-900 dark:to-emerald-950 dark:border-teal-500/60' },
            { id: 'education', title: 'Education', icon: '🎓', count: '4,300 Qs', color: 'from-indigo-600 via-blue-600 to-sky-700 border-indigo-400 dark:from-slate-900 dark:to-indigo-950 dark:border-indigo-500/60' }
          ].map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id);
                  soundFX.playTick(0.15);
                }}
                className={`group relative min-w-[170px] p-4 rounded-2xl bg-gradient-to-br ${cat.color} border-2 border-t-2 border-t-white/40 border-b-4 border-b-black shadow-lg hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 select-none ${
                  isSelected ? 'ring-2 ring-amber-400 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-mono font-black text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/20">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black font-serif text-white group-hover:text-amber-200 group-hover:underline transition-colors tracking-tight truncate">
                    {cat.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-white/80 group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual-Core 3D Launcher Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* CARD 1 (Create & Host): Mint-Green / Gold Theme */}
        <div 
          id="banner-card-create-and-host"
          className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-amber-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(16,185,129,0.2)]"
          style={{ borderRadius: '24px' }}
        >
          <div className="space-y-2 mb-6">
            <span className="px-3 py-1 rounded-full text-[11px] font-black font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40 inline-block">
              Host For Free
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
              Create a quiz
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Play for free with 300 participants
            </p>
          </div>

          {/* Bottom 3D Raised Buttons: "Quiz Editor" (Mint-Green) & "Host Live Game" (Gold/Amber) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              id="btn-open-quiz-editor"
              onClick={onOpenQuizEditor}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/50 border-b-4 border-emerald-900 dark:border-black shadow-lg shadow-emerald-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Quiz Editor</span>
            </button>

            <button
              type="button"
              id="btn-host-live-game"
              onClick={onHostLiveGame || (() => onSelectQuiz(quizzes[0], 'lobby'))}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/80 border-b-4 border-amber-900 dark:border-black shadow-lg shadow-amber-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Host Live Game</span>
            </button>
          </div>
        </div>

        {/* CARD 2 (AI Generation): Cyan/Blue Theme with streaming play icon */}
        <div 
          id="banner-card-youtube-ai-generator"
          className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-blue-500/10 dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-900 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(14,165,233,0.2)]"
          style={{ borderRadius: '24px' }}
        >
          <div className="space-y-2 mb-6">
            <span className="px-3 py-1 rounded-full text-[11px] font-black font-mono uppercase tracking-wider bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-400/40 inline-block">
              YouTube &amp; PDF Synthesis
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-2">
              <span>YouTube &amp; A.I. Generator</span>
              <Sparkles className="w-6 h-6 text-cyan-500" />
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Generate a quiz from any subject, PDF, or YouTube URL
            </p>
          </div>

          {/* Bottom 3D Raised Button: "Quiz Generator" (Cyan/Blue) with red-and-white streaming play icon */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-open-ai-generator"
              onClick={onOpenAiGenerator}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/50 border-b-4 border-sky-950 dark:border-black shadow-lg shadow-sky-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              {/* Red-and-white streaming play icon */}
              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Play className="w-3 h-3 fill-white translate-x-0.5" />
              </div>
              <span>Quiz Generator</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* INFINITE SCROLLING FEATURE TICKER                        */}
      {/* ======================================================== */}
      {/* Narrow horizontal ribbon using translucent deep teal glassmorphism (#0d9488 / bg-teal-600) */}
      <div 
        id="infinite-scrolling-feature-ticker"
        className="w-full overflow-hidden rounded-2xl bg-[#0d9488]/90 dark:bg-[#0d9488]/75 backdrop-blur-xl border border-teal-400/40 border-t-2 border-t-white/40 border-b-3 border-b-teal-950 shadow-lg py-3 relative"
      >
        <div className="animate-marquee-infinite flex items-center space-x-8 text-white font-mono text-xs sm:text-sm font-black tracking-wide whitespace-nowrap">
          {/* Loop Set 1 */}
          <div className="flex items-center space-x-8">
            <span className="flex items-center gap-2"><span>[🚀]</span><span>Ready-to-Play Academic Quizzes</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[📈]</span><span>Up to 2,000 Live Seminar Participants</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[🧠]</span><span>Multimodal AI Quiz Ingestion Terminal</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[📱]</span><span>No Application Download Required</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[⭐]</span><span>Loved by Educators Worldwide</span></span>
            <span className="text-teal-200 opacity-60">•</span>
          </div>

          {/* Loop Set 2 (Seamless Infinite Repeat) */}
          <div className="flex items-center space-x-8">
            <span className="flex items-center gap-2"><span>[🚀]</span><span>Ready-to-Play Academic Quizzes</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[📈]</span><span>Up to 2,000 Live Seminar Participants</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[🧠]</span><span>Multimodal AI Quiz Ingestion Terminal</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[📱]</span><span>No Application Download Required</span></span>
            <span className="text-teal-200 opacity-60">•</span>
            <span className="flex items-center gap-2"><span>[⭐]</span><span>Loved by Educators Worldwide</span></span>
            <span className="text-teal-200 opacity-60">•</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INSTITUTIONAL CREDIBILITY GRID                           */}
      {/* ======================================================== */}
      <div 
        id="institutional-credibility-grid"
        className="text-center py-3 space-y-4"
      >
        <h4 className="text-xs sm:text-sm font-black font-mono uppercase tracking-[0.2em] text-[#667085] dark:text-slate-400">
          TRUSTED BY SCHOLARS, UNIVERSITIES &amp; ORGANIZATIONS WORLDWIDE
        </h4>

        {/* Logo Wall: Symmetrical horizontal grid of grayscale corporate branding vectors smoothly transitioning into authentic colors on hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center max-w-5xl mx-auto px-6 py-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md backdrop-blur-md">
          
          {/* NYU */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#57068c] fill-current" aria-hidden="true">
                <path d="M16 2L13 9H19L16 2Z" />
                <path d="M11 11L14 18H18L21 11H11Z" />
                <path d="M16 20C13 20 10 23 10 27H22C22 23 19 20 16 20Z" />
              </svg>
              <span className="font-serif font-black tracking-wider text-lg text-slate-800 dark:text-white group-hover:text-[#57068c] dark:group-hover:text-[#b388ff]">
                NYU
              </span>
            </div>
          </div>

          {/* Google */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center gap-0.5 font-sans font-bold text-lg">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
          </div>

          {/* Microsoft */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-[#F25022] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#7FBA00] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#00A4EF] w-1.5 h-1.5 rounded-[0.5px]" />
                <div className="bg-[#FFB900] w-1.5 h-1.5 rounded-[0.5px]" />
              </div>
              <span className="font-semibold text-sm text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white tracking-tight">
                Microsoft
              </span>
            </div>
          </div>

          {/* IBM */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center">
              <span className="font-black text-xl tracking-widest text-[#054ada] font-mono group-hover:drop-shadow-[0_0_8px_rgba(5,74,218,0.5)]">
                IBM
              </span>
            </div>
          </div>

          {/* Deloitte */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center font-bold text-sm text-slate-800 dark:text-white tracking-tight">
              <span>Deloitte</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#86bc25] ml-0.5 inline-block group-hover:shadow-[0_0_6px_#86bc25]" />
            </div>
          </div>

          {/* Accenture */}
          <div className="group flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
            <div className="filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex items-center font-bold text-sm text-slate-800 dark:text-white lowercase tracking-tight">
              <span>accenture</span>
              <span className="text-[#a100ff] font-black text-base ml-0.5 group-hover:drop-shadow-[0_0_6px_rgba(161,0,255,0.6)]">&gt;</span>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODULE 2: WORKSPACE TABS & CURRICULUM DIRECTORY          */}
      {/* ======================================================== */}
      <div id="module-2-workspace-tabs-directory" className="space-y-6 pt-2">
        
        {/* Multi-Tab Workspace Grid (4 navigation choices side-by-side) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {workspaceTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`workspace-tab-${tab.id}`}
                onClick={() => handleTabSelect(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-b-3 border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* The 9-Box Matrix (Quiz Categories): Standalone 3D blocks with 1.5px border outline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Interactive Category Matrix (9 Fields)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {nineBoxMatrix.map(box => {
              const Icon = box.icon;
              const isSelected = selectedCategory === box.id;
              return (
                <div
                  key={box.id}
                  onClick={() => {
                    setSelectedCategory(box.id === selectedCategory ? 'all' : box.id);
                    soundFX.playTick(0.2);
                  }}
                  className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${box.theme} border-[1.5px] border-t-2 border-t-white/30 border-b-4 border-b-black shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[105px] ${
                    isSelected ? 'ring-2 ring-white scale-102' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${box.badgeColor} text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-black text-white leading-tight drop-shadow-sm line-clamp-2">
                    {box.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Level Chips: 12 distinct sequential 3D capsule boxes */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Grade Level Milestones (Grade 1 – Grade 12)
          </span>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {gradeLevels.map(grade => {
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => {
                    setSelectedGrade(grade === selectedGrade ? null : grade);
                    soundFX.playTick(0.15);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-mono shrink-0 transition-all cursor-pointer border-t-2 border-white/50 border-b-3 border-slate-900/40 dark:border-black shadow-md ${
                    isSelected
                      ? 'bg-sky-500 text-white border-b-sky-900 scale-105'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-0.5'
                  }`}
                >
                  Grade {grade}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODULE 3: POST-LOGIN DASHBOARD CAROUSELS                 */}
      {/* ======================================================== */}
      <div id="module-3-dashboard-carousels" className="space-y-8 pt-2">
        
        {/* Symmetric, Dual-Column Grid of Translucent Frosted Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* SLOT 1: Today's Challenge Arena */}
          <div 
            className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            style={{ borderRadius: '24px' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md border-t border-white/60 border-b-2 border-amber-800">
                  <Trophy className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                    Today's Challenge
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Fresh questions every day. Compete on the leaderboard.
                  </p>
                </div>
              </div>

              {/* Placeholder Timeline Rows */}
              <div className="space-y-2.5 my-4 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">09:00 AM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Round 1: Ethics in AI &amp; Epistemology</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-mono font-bold text-slate-400">01:30 PM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Round 2: Quantum Algorithms &amp; Crypto</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">UPCOMING</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-mono font-bold text-slate-400">05:00 PM</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Round 3: DHIU Usul al-Fiqh Mastery</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">SCHEDULED</span>
                </div>
              </div>
            </div>

            {/* Bottom-left text link: "Play Now ›" */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectQuiz(quizzes[0], 'arena')}
                className="text-amber-600 dark:text-amber-400 font-black text-sm hover:underline cursor-pointer flex items-center gap-1 group"
              >
                <span>Play Now ›</span>
              </button>
              <span className="text-xs font-mono text-slate-400">Leaderboard: 1,420 Scholars Joined</span>
            </div>
          </div>

          {/* SLOT 2: Brain Games Sandbox */}
          <div 
            className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            style={{ borderRadius: '24px' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black shadow-md border-t border-white/60 border-b-2 border-indigo-900">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                    Brain Games
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Memory Match, Simon Says, and more.
                  </p>
                </div>
              </div>

              {/* Compact 3D playing-card boxes containing hidden questions [ ? ] that reveal details on hover / click */}
              <div className="grid grid-cols-3 gap-3 my-4">
                {[
                  { prompt: 'Speed Recall', detail: 'Pattern Grid Flash' },
                  { prompt: 'Anagram Blitz', detail: 'Greek & Latin Roots' },
                  { prompt: 'Logic Matrix', detail: 'Deductive Syllogisms' }
                ].map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleBrainCard(idx)}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 border-2 border-indigo-500/40 border-t-2 border-t-white/30 border-b-4 border-b-black shadow-md hover:-translate-y-1 hover:border-indigo-400 transition-all cursor-pointer text-center group"
                  >
                    <div className="text-lg font-mono font-black text-amber-400 mb-1 group-hover:scale-125 transition-transform">
                      {revealedCards[idx] ? '⚡' : '[ ? ]'}
                    </div>
                    <div className="text-xs font-extrabold text-white truncate">
                      {card.prompt}
                    </div>
                    <div className="text-[10px] text-indigo-300 font-mono mt-0.5 truncate">
                      {revealedCards[idx] ? card.detail : 'Hover/Tap'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suffix link: "Explore ›" */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenFlashcards || (() => onShowToast('Opening Brain Games suite...', 'info'))}
                className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline cursor-pointer flex items-center gap-1 group"
              >
                <span>Explore ›</span>
              </button>
              <span className="text-xs font-mono text-slate-400">Interactive Cognitive Sandbox</span>
            </div>
          </div>

        </div>

        {/* FEED CAROUSEL 1: Recently Published */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-serif flex items-center gap-2">
              <span>Recently Published</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                {filteredQuizzes.length}
              </span>
            </h3>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
            {filteredQuizzes.map(quiz => (
              <div
                key={quiz.id}
                onClick={() => onSelectQuiz(quiz, 'lobby')}
                className="min-w-[280px] max-w-[300px] shrink-0 bg-white/95 dark:bg-slate-900/90 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                style={{ borderRadius: '12px' }}
              >
                {/* Cover Image */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={quiz.coverImage}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/85 text-teal-300 text-xs font-mono font-bold border border-slate-700">
                    PIN: {quiz.pinCode}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/85 text-white text-[11px] font-bold">
                    {quiz.questionsCount} Questions
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                      {quiz.title}
                    </h4>
                    {quiz.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {quiz.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Rating & Author Tag */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{quiz.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[140px] font-medium">
                      By {quiz.author}
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    Enter Lobby →
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {quiz.playsCount.toLocaleString()} plays
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEED CAROUSEL 2: Discover Creators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-serif flex items-center gap-2">
              <span>Discover Creators</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                Featured Scholars
              </span>
            </h3>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
            {discoverCreators.map(creator => (
              <div
                key={creator.id}
                onClick={() => onShowToast(`Viewing ${creator.name}'s verified curriculum`, 'info')}
                className="min-w-[280px] max-w-[300px] shrink-0 bg-white/95 dark:bg-slate-900/90 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                style={{ borderRadius: '12px' }}
              >
                {/* Creator Cover / Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={creator.cover}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 text-amber-300 text-xs font-mono font-bold">
                    ★ {creator.rating}
                  </div>
                </div>

                {/* Body with Avatar */}
                <div className="p-4 pt-0 relative space-y-2 flex-1 flex flex-col justify-between">
                  <div className="-mt-7 flex items-center gap-2.5 mb-1">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-400 flex items-center justify-center text-xl shadow-md">
                      {creator.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">
                        {creator.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[160px]">
                        {creator.institution}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium line-clamp-1">
                    {creator.specialty}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>{creator.quizzesCount} Quizzes</span>
                    <span>{creator.followers} Followers</span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    Follow Curriculum →
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Verified SME
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODULE 6: COMMUNITY FOOTER & PLATFORM METRICS            */}
      {/* ======================================================== */}
      <div 
        id="module-6-community-footer"
        className="rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-t-2 border-white/30 border-b-4 border-black shadow-2xl space-y-8"
        style={{ borderRadius: '24px' }}
      >
        {/* Master Baseline Block */}
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tracking-tight text-white drop-shadow-md">
            Play Quizzes. Challenge Friends. Create Your Own.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Join thousands of scholars, educators, and students around the globe. Launch live competitive rooms, test active recall with flashcards, or synthesize academic tests instantly with AI.
          </p>

          {/* Action Row containing three wide buttons: "Create Room" (Solid Amber), "Join Room" (Solid Blue), and "Explore" (White Outline Box) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Button 1: Create Room (Solid Amber) */}
            <button
              type="button"
              id="btn-footer-create-room"
              onClick={onHostLiveGame || onOpenQuizEditor}
              className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/60 border-b-4 border-amber-800 shadow-lg shadow-amber-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Create Room</span>
            </button>

            {/* Button 2: Join Room (Solid Blue) */}
            <button
              type="button"
              id="btn-footer-join-room"
              onClick={() => {
                const el = document.getElementById('input-quick-join-pin');
                if (el) {
                  el.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-7 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/40 border-b-4 border-sky-900 shadow-lg shadow-sky-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Join Room</span>
            </button>

            {/* Button 3: Explore (White Outline Box) */}
            <button
              type="button"
              id="btn-footer-explore"
              onClick={() => {
                window.scrollTo({ top: 400, behavior: 'smooth' });
                onShowToast('Exploring all verified categories', 'info');
              }}
              className="px-7 py-3.5 rounded-2xl bg-transparent hover:bg-white/10 text-white font-black text-xs sm:text-sm tracking-wide border-2 border-white/80 border-t-2 border-white border-b-4 border-b-black shadow-md hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </div>
        </div>

        {/* The 4-Column Metric Split: Positioned at absolute base, separated by vertical slate lines */}
        <div className="pt-6 border-t border-slate-700/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Cell 1: [🧭] 100K+ Quizzes */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-0">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-black uppercase tracking-wider mb-2">
              <span>🧭</span>
              <span>Quizzes Available</span>
            </div>
            <div className="relative inline-block py-1">
              <span className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight relative z-10">
                100K+
              </span>
              <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] overflow-visible pointer-events-none animate-sketch-neon text-teal-400" viewBox="0 0 100 50" fill="none">
                <path d="M12,25 C12,12 35,5 60,5 C85,5 95,15 95,25 C95,38 80,45 50,45 C24,45 6,38 6,25 C6,15 25,7 50,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" />
              </svg>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">100k+ Questions</div>
          </div>

          {/* Cell 2: [🔄] 100M+ Attempts */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-0 md:pl-6">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-black uppercase tracking-wider mb-2">
              <span>🔄</span>
              <span>Total Attempts</span>
            </div>
            <div className="relative inline-block py-1">
              <span className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight relative z-10">
                100M+
              </span>
              <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] overflow-visible pointer-events-none animate-sketch-neon text-amber-400" viewBox="0 0 100 50" fill="none">
                <path d="M12,25 C12,12 35,5 60,5 C85,5 95,15 95,25 C95,38 80,45 50,45 C24,45 6,38 6,25 C6,15 25,7 50,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" />
              </svg>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">5+ Live Games Daily</div>
          </div>

          {/* Cell 3: [👥] 45+ SME's */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-0 md:pl-6">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-black uppercase tracking-wider mb-2">
              <span>👥</span>
              <span>Verified SMEs</span>
            </div>
            <div className="relative inline-block py-1">
              <span className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight relative z-10">
                45+
              </span>
              <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] overflow-visible pointer-events-none animate-sketch-neon text-sky-400" viewBox="0 0 100 50" fill="none">
                <path d="M12,25 C12,12 35,5 60,5 C85,5 95,15 95,25 C95,38 80,45 50,45 C24,45 6,38 6,25 C6,15 25,7 50,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" />
              </svg>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">14 Academic Categories</div>
          </div>

          {/* Cell 4: [👤] 10+ Player Rooms (Free / No Signup Required) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-0 md:pl-6">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-black uppercase tracking-wider mb-2">
              <span>👤</span>
              <span>Player Rooms</span>
            </div>
            <div className="relative inline-block py-1">
              <span className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight relative z-10">
                10+
              </span>
              <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] overflow-visible pointer-events-none animate-sketch-neon text-emerald-400" viewBox="0 0 100 50" fill="none">
                <path d="M12,25 C12,12 35,5 60,5 C85,5 95,15 95,25 C95,38 80,45 50,45 C24,45 6,38 6,25 C6,15 25,7 50,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" />
              </svg>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1">Free / No Signup Required</div>
          </div>

        </div>

      </div>

    </div>
  );
};
