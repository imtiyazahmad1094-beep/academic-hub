import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  ArrowLeft, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  BarChart2, 
  Calendar, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Zap, 
  Search,
  Sparkles,
  Layers3,
  Mic,
  ShieldCheck
} from 'lucide-react';
import { soundFX } from '../../../utils/audioUtils';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  institution: string;
  points: number;
  quizzesCount: number;
  accuracy: number;
  streak: number;
  level: string;
  category: string;
  weeklyProgress: number[];
}

const SAMPLE_LEADERBOARD: Record<string, LeaderboardEntry[]> = {
  history: [
    {
      id: 'lb-1',
      rank: 1,
      name: 'Dr. Zayd Scholar',
      avatar: '👨‍🏫',
      institution: 'DHIU Historiography Unit',
      points: 9840,
      quizzesCount: 64,
      accuracy: 96.5,
      streak: 18,
      level: 'Doctoral Fellow',
      category: 'History',
      weeklyProgress: [820, 1100, 1450, 1920, 2400, 3100, 9840]
    },
    {
      id: 'lb-2',
      rank: 2,
      name: 'Maryam Oxford',
      avatar: '👩‍🎓',
      institution: 'Oxford Middle East Centre',
      points: 9120,
      quizzesCount: 58,
      accuracy: 94.2,
      streak: 14,
      level: 'Senior Researcher',
      category: 'History',
      weeklyProgress: [750, 980, 1300, 1750, 2200, 2850, 9120]
    },
    {
      id: 'lb-3',
      rank: 3,
      name: 'Ahmad DHIU',
      avatar: '👳‍♂️',
      institution: 'Darul Huda Islamic University',
      points: 8750,
      quizzesCount: 52,
      accuracy: 93.8,
      streak: 12,
      level: 'Master Scholar',
      category: 'History',
      weeklyProgress: [680, 890, 1200, 1600, 2050, 2600, 8750]
    },
    {
      id: 'lb-4',
      rank: 4,
      name: 'Prof. Elena Rostova',
      avatar: '👩‍🔬',
      institution: 'Sorbonne Historical Dept',
      points: 7940,
      quizzesCount: 44,
      accuracy: 91.4,
      streak: 9,
      level: 'Research Fellow',
      category: 'History',
      weeklyProgress: [600, 780, 1050, 1400, 1800, 2300, 7940]
    },
    {
      id: 'lb-5',
      rank: 5,
      name: 'Tariq Al-Mansoor',
      avatar: '📜',
      institution: 'Cairo Al-Azhar Archives',
      points: 7420,
      quizzesCount: 39,
      accuracy: 90.1,
      streak: 7,
      level: 'Graduate Scholar',
      category: 'History',
      weeklyProgress: [550, 710, 950, 1280, 1650, 2100, 7420]
    },
    {
      id: 'lb-6',
      rank: 6,
      name: 'Sophia Vance',
      avatar: '🏛️',
      institution: 'Cambridge Faculty of History',
      points: 6890,
      quizzesCount: 35,
      accuracy: 89.2,
      streak: 6,
      level: 'Candidate',
      category: 'History',
      weeklyProgress: [500, 650, 880, 1180, 1500, 1920, 6890]
    }
  ],
  islamic: [
    {
      id: 'lb-i1',
      rank: 1,
      name: 'Shaykh Bilal Al-Qasimi',
      avatar: '📖',
      institution: 'DHIU Usul al-Fiqh Chair',
      points: 10420,
      quizzesCount: 72,
      accuracy: 98.2,
      streak: 22,
      level: 'Grand Jurist',
      category: 'Islamic Studies',
      weeklyProgress: [900, 1250, 1700, 2200, 2800, 3600, 10420]
    },
    {
      id: 'lb-i2',
      rank: 2,
      name: 'Dr. Zayd Scholar',
      avatar: '👨‍🏫',
      institution: 'DHIU PYQ Research Hub',
      points: 9650,
      quizzesCount: 61,
      accuracy: 95.8,
      streak: 16,
      level: 'Doctoral Fellow',
      category: 'Islamic Studies',
      weeklyProgress: [800, 1100, 1500, 1950, 2500, 3200, 9650]
    },
    {
      id: 'lb-i3',
      rank: 3,
      name: 'Fatima Al-Zahra',
      avatar: '🧕',
      institution: 'Madinah University Fellow',
      points: 8990,
      quizzesCount: 54,
      accuracy: 94.5,
      streak: 11,
      level: 'Hadith Specialist',
      category: 'Islamic Studies',
      weeklyProgress: [720, 980, 1350, 1780, 2250, 2900, 8990]
    }
  ],
  science: [
    {
      id: 'lb-s1',
      rank: 1,
      name: 'Prof. Marcus Vance',
      avatar: '🔬',
      institution: 'MIT Quantum & BioLab',
      points: 9980,
      quizzesCount: 68,
      accuracy: 97.1,
      streak: 20,
      level: 'Lead Investigator',
      category: 'Science',
      weeklyProgress: [850, 1180, 1600, 2100, 2700, 3450, 9980]
    },
    {
      id: 'lb-s2',
      rank: 2,
      name: 'Elena Rostova',
      avatar: '👩‍🔬',
      institution: 'Cavendish Laboratory',
      points: 9240,
      quizzesCount: 59,
      accuracy: 95.0,
      streak: 15,
      level: 'Quantum Physicist',
      category: 'Science',
      weeklyProgress: [760, 1020, 1400, 1850, 2350, 3000, 9240]
    }
  ],
  logic: [
    {
      id: 'lb-l1',
      rank: 1,
      name: 'Dr. Arthur Sterling',
      avatar: '🧠',
      institution: 'Vienna Epistemic Guild',
      points: 9450,
      quizzesCount: 56,
      accuracy: 96.0,
      streak: 17,
      level: 'Formal Logician',
      category: 'Logic & Reasoning',
      weeklyProgress: [800, 1080, 1480, 1920, 2450, 3150, 9450]
    }
  ]
};

interface AcademicHubLeaderboardProps {
  onBackToDiscovery: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AcademicHubLeaderboard: React.FC<AcademicHubLeaderboardProps> = ({
  onBackToDiscovery,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('history');
  const [timePeriod, setTimePeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'All Time'>('All Time');
  const [selectedQuizType, setSelectedQuizType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = (SAMPLE_LEADERBOARD[selectedCategory] || SAMPLE_LEADERBOARD.history).filter(entry => 
    !searchQuery.trim() ||
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topPodium = currentList.slice(0, 3);

  // Time multiplier for visual charts
  const periodMultiplier = timePeriod === 'Daily' ? 0.25 : timePeriod === 'Weekly' ? 0.55 : timePeriod === 'Monthly' ? 0.8 : 1.0;

  return (
    <div id="academic-hub-master-leaderboard" className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto pb-12">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onBackToDiscovery}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs border-t border-white/40 border-b-2 border-slate-900/30 transition-all cursor-pointer active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-black">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Academic Hub Global Honor Roll</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {(['Daily', 'Weekly', 'Monthly', 'All Time'] as const).map(period => (
            <button
              key={period}
              type="button"
              onClick={() => {
                setTimePeriod(period);
                soundFX.playTick(0.15);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                timePeriod === period
                  ? 'bg-amber-400 text-slate-950 shadow-sm border-t border-white/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hero Title */}
      <div className="text-center space-y-2 pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Scholar Rankings &amp; Progression</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-slate-900 dark:text-white">
          Academic Hub Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Recognizing doctoral research excellence, oral defense accuracy, competitive live games, and persistent study streaks across academic categories.
        </p>
      </div>

      {/* Category & Filter Tabs Bar (Section 31) */}
      <div className="p-4 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-800">
          {[
            { id: 'history', label: 'History', icon: '🏛️' },
            { id: 'islamic', label: 'Islamic Studies', icon: '📖' },
            { id: 'science', label: 'Science', icon: '🔬' },
            { id: 'logic', label: 'Logic & Reasoning', icon: '🧠' },
            { id: 'arabic', label: 'Arabic', icon: '✍️' },
            { id: 'literature', label: 'Literature', icon: '📚' }
          ].map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundFX.playTick(0.2);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 border-t-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white/60 border-b-3 border-amber-900 shadow-md scale-102'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search scholar or institution..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Type:</span>
            </div>
            <select
              value={selectedQuizType}
              onChange={e => setSelectedQuizType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
            >
              <option>All Types</option>
              <option>Live Games</option>
              <option>Viva Defense</option>
              <option>Flashcards</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
            >
              <option>All Levels</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Doctoral</option>
            </select>
          </div>
        </div>

      </div>

      {/* TOP 3 PODIUM HERO (Section 32) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 items-end">
        
        {/* RANK 2: Silver */}
        {topPodium[1] && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-t-2 border-slate-300 border-b-4 border-black text-white shadow-xl flex flex-col items-center text-center space-y-3 order-2 md:order-1">
            <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
              #2
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-2xl shadow-inner">
              {topPodium[1].avatar}
            </div>
            <div>
              <h3 className="text-lg font-black font-serif text-white">{topPodium[1].name}</h3>
              <p className="text-xs text-slate-400 font-mono">{topPodium[1].institution}</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-600 text-amber-300 font-mono font-black text-sm">
              {Math.round(topPodium[1].points * periodMultiplier).toLocaleString()} pts
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span>{topPodium[1].accuracy}% Acc</span>
              <span>•</span>
              <span className="text-amber-400">🔥 {topPodium[1].streak}d Streak</span>
            </div>
          </div>
        )}

        {/* RANK 1: Gold / Crown */}
        {topPodium[0] && (
          <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-400 border-t-2 border-t-white/50 border-b-4 border-b-black text-white shadow-2xl flex flex-col items-center text-center space-y-3.5 order-1 md:order-2 scale-105 z-10">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-lg border-2 border-white">
              👑 #1
            </div>
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg">
              {topPodium[0].avatar}
            </div>
            <div>
              <h3 className="text-xl font-black font-serif text-amber-200">{topPodium[0].name}</h3>
              <p className="text-xs text-slate-300 font-mono">{topPodium[0].institution}</p>
            </div>
            <div className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-base shadow-md border-t border-white/60">
              {Math.round(topPodium[0].points * periodMultiplier).toLocaleString()} pts
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-amber-200 pt-1">
              <span className="text-emerald-400 font-bold">{topPodium[0].accuracy}% Accuracy</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">🔥 {topPodium[0].streak}d Streak</span>
            </div>
          </div>
        )}

        {/* RANK 3: Bronze */}
        {topPodium[2] && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-t-2 border-amber-700 border-b-4 border-black text-white shadow-xl flex flex-col items-center text-center space-y-3 order-3">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-md">
              #3
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-amber-700/60 flex items-center justify-center text-2xl shadow-inner">
              {topPodium[2].avatar}
            </div>
            <div>
              <h3 className="text-lg font-black font-serif text-white">{topPodium[2].name}</h3>
              <p className="text-xs text-slate-400 font-mono">{topPodium[2].institution}</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-600 text-amber-300 font-mono font-black text-sm">
              {Math.round(topPodium[2].points * periodMultiplier).toLocaleString()} pts
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span>{topPodium[2].accuracy}% Acc</span>
              <span>•</span>
              <span className="text-amber-400">🔥 {topPodium[2].streak}d Streak</span>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* FULL CATEGORY LEADERBOARD TABLE & VISUALIZATIONS         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Full Ranking Table (Section 32) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{selectedCategory.toUpperCase()} Champions Ledger</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {currentList.length} Qualified Scholars
            </span>
          </div>

          <div className="space-y-2.5">
            {currentList.map(entry => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 border-t-2 border-t-white/40 dark:border-t-white/10 border-b-3 border-slate-900/20 dark:border-black shadow-md flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                    entry.rank === 1 ? 'bg-amber-400 text-slate-950 font-bold' :
                    entry.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    entry.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    0{entry.rank}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {entry.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {entry.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-mono font-bold hidden sm:inline-block">
                        {entry.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {entry.institution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <div className="text-xs font-mono text-slate-400">{entry.quizzesCount} quizzes</div>
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">{entry.accuracy}% acc</div>
                  </div>

                  <div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-amber-300">
                      {Math.round(entry.points * periodMultiplier).toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      points
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Data Visualizations (Section 33) & Personal Performance (Section 34) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Visual Progress Graph (Section 33) */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Weekly Progression Curves</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">{timePeriod}</span>
            </div>

            {/* Visual Point Progression Bars */}
            <div className="space-y-3 pt-1">
              {topPodium.map(entry => (
                <div key={entry.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px]">
                      {entry.name}
                    </span>
                    <span className="text-amber-500 font-black">
                      {Math.round(entry.points * periodMultiplier).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (entry.points / 10500) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Activity Sparklines */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block">
                7-Day Ingestion &amp; Viva Trajectory:
              </span>
              <div className="flex items-end gap-1.5 h-12 pt-2">
                {[45, 60, 75, 55, 90, 85, 98].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-indigo-500/80 rounded-t-md transition-all"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* PERSONAL PERFORMANCE "MY PERFORMANCE" (Section 34) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-t-2 border-white/30 border-b-4 border-black text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-black font-serif text-white">
                  My Performance
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono text-[10px] border border-teal-500/30">
                Candidate Fellow
              </span>
            </div>

            {/* Metrics Matrix (8 Core Parameters) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              {/* Total Points */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total Points</span>
                <div className="text-lg font-black font-mono text-amber-300">14,820</div>
              </div>

              {/* Quizzes Completed */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Quizzes Completed</span>
                <div className="text-lg font-black font-mono text-teal-300">42</div>
              </div>

              {/* Viva Sessions */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Viva Sessions</span>
                <div className="text-lg font-black font-mono text-purple-300">18</div>
              </div>

              {/* Accuracy */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Accuracy</span>
                <div className="text-lg font-black font-mono text-emerald-300">94.2%</div>
              </div>

              {/* Average Score */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Score</span>
                <div className="text-lg font-black font-mono text-sky-300">885</div>
              </div>

              {/* Study Streak */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Study Streak</span>
                <div className="text-lg font-black font-mono text-orange-400">🔥 14 Days</div>
              </div>

              {/* Flashcards Mastered */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Cards Mastered</span>
                <div className="text-lg font-black font-mono text-teal-300">128</div>
              </div>

              {/* Categories Completed */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Categories</span>
                <div className="text-lg font-black font-mono text-indigo-300">6 Domains</div>
              </div>

            </div>

            {/* Visual Retention Progress Ring / Bar */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Doctoral Candidacy Milestone</span>
                <span className="text-teal-400 font-bold">85% Achieved</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
