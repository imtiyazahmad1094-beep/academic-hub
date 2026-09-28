import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Users, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Music, 
  Radio, 
  GraduationCap,
  Trophy,
  Flame,
  Crown,
  Medal,
  Search,
  Zap,
  TrendingUp,
  Filter
} from 'lucide-react';
import { QuizItem, QuizQuestion, LobbyPlayer } from '../../types';
import { soundFX } from '../../utils/audioUtils';
import { CountdownProgressRing } from './CountdownProgressRing';

export interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar: string;
  institution: string;
  score: number;
  streak: number;
  accuracy: number;
  speedSec: string;
  isCurrentUser?: boolean;
  status: 'Answering' | 'Locked In';
}

interface LiveOralDefenseArenaProps {
  quiz: QuizItem;
  roomPin: string;
  playerCount: number;
  initialPlayers?: LobbyPlayer[];
  onExitRoom: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LiveOralDefenseArena: React.FC<LiveOralDefenseArenaProps> = ({
  quiz,
  roomPin,
  playerCount,
  initialPlayers,
  onExitRoom,
  onShowToast
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerMs, setTimerMs] = useState(30000); // 30 seconds
  const [maxTimerMs, setMaxTimerMs] = useState(30000);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Tab & Leaderboard state
  const [arenaTab, setArenaTab] = useState<'leaderboard' | 'stream'>('leaderboard');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'streaks' | 'podium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time Leaderboard State with Glassmorphic player roster
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<LeaderboardPlayer[]>(() => {
    const baseInstitutions = [
      'Oxford AI Lab', 
      'DHIU PYQ Research', 
      'MIT Media Lab', 
      'Cambridge Quantum', 
      'Vienna Acoustics', 
      'Sorbonne Dept', 
      'Tokyo Tech', 
      'Islamic University'
    ];

    if (initialPlayers && initialPlayers.length > 0) {
      const mapped: LeaderboardPlayer[] = initialPlayers.map((p, idx) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        institution: baseInstitutions[idx % baseInstitutions.length],
        score: p.score || 1800 + (initialPlayers.length - idx) * 220,
        streak: idx === 0 ? 4 : idx === 1 ? 3 : idx === 2 ? 2 : 1,
        accuracy: 88 + ((idx * 3) % 11),
        speedSec: `${(1.1 + (idx * 0.25) % 1.4).toFixed(1)}s`,
        isCurrentUser: false,
        status: idx % 2 === 0 ? 'Locked In' : 'Answering'
      }));

      return [
        { 
          id: 'user-self', 
          name: 'You (Scholar Candidate)', 
          avatar: '🎓', 
          institution: 'Candidate Fellow', 
          score: 0, 
          streak: 0, 
          accuracy: 100, 
          speedSec: '1.2s', 
          isCurrentUser: true, 
          status: 'Answering' 
        },
        ...mapped
      ];
    }

    return [
      { id: 'user-self', name: 'You (Scholar Candidate)', avatar: '🎓', institution: 'Candidate Fellow', score: 0, streak: 0, accuracy: 100, speedSec: '1.2s', isCurrentUser: true, status: 'Answering' },
      { id: 'p1', name: 'Dr. Zayd Scholar', avatar: '🏛️', institution: 'Oxford AI Lab', score: 2850, streak: 4, accuracy: 96, speedSec: '1.2s', status: 'Locked In' },
      { id: 'p2', name: 'Maryam_Oxford', avatar: '🔬', institution: 'Oxford Neuroscience', score: 2420, streak: 3, accuracy: 94, speedSec: '1.3s', status: 'Locked In' },
      { id: 'p3', name: 'Ahmad_DHIU', avatar: '📚', institution: 'DHIU PYQ Research', score: 2180, streak: 2, accuracy: 91, speedSec: '1.7s', status: 'Answering' },
      { id: 'p4', name: 'Sarah_CyberLab', avatar: '⚡', institution: 'MIT Media Lab', score: 1950, streak: 2, accuracy: 89, speedSec: '1.5s', status: 'Locked In' },
      { id: 'p5', name: 'Tariq_Medina', avatar: '🕌', institution: 'Islamic University', score: 1720, streak: 1, accuracy: 87, speedSec: '2.0s', status: 'Answering' },
      { id: 'p6', name: 'Elena_Cambridge', avatar: '🌌', institution: 'Cambridge Quantum', score: 1600, streak: 3, accuracy: 93, speedSec: '1.4s', status: 'Locked In' },
      { id: 'p7', name: 'Prof_Kowalski', avatar: '🎻', institution: 'Vienna Acoustics', score: 1480, streak: 0, accuracy: 85, speedSec: '2.3s', status: 'Answering' }
    ];
  });

  // Synchronize candidate's current score and streak with leaderboard cards in real time
  useEffect(() => {
    setLeaderboardPlayers(prev => 
      prev.map(p => {
        if (p.isCurrentUser) {
          return {
            ...p,
            score,
            streak,
            status: hasEvaluated ? 'Locked In' : 'Answering'
          };
        }
        return p;
      })
    );
  }, [score, streak, hasEvaluated]);

  // Real-time dynamic simulation: background point increments & streak ticks for active competitors
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLeaderboardPlayers(prev => {
        const peers = prev.filter(p => !p.isCurrentUser);
        if (peers.length === 0) return prev;
        const targetIdx = Math.floor(Math.random() * peers.length);
        const targetId = peers[targetIdx].id;
        const scoreInc = Math.floor(60 + Math.random() * 140);
        const streakShift = Math.random() > 0.35 ? 1 : -1;

        return prev.map(p => {
          if (p.id === targetId) {
            const nextStreak = Math.max(0, p.streak + streakShift);
            return {
              ...p,
              score: p.score + scoreInc,
              streak: nextStreak,
              status: Math.random() > 0.4 ? 'Locked In' : 'Answering'
            };
          }
          return p;
        });
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickedSecondRef = useRef<number | null>(null);

  const currentQ: QuizQuestion = quiz.questions[currentQuestionIndex] || {
    id: 'default-q',
    question: 'What Anime is this opening song from?',
    mediaType: 'waveform',
    mediaTitle: 'A Cruel Angel’s Thesis — Synth Opening Theme',
    correctAnswer: 'Neon Genesis Evangelion',
    acceptedAnswers: ['Evangelion', 'Neon Genesis Evangelion', 'Eva'],
    timeLimitSec: 30,
    points: 1000
  };

  // Reset timer on slide change
  useEffect(() => {
    const limit = (currentQ.timeLimitSec || 30) * 1000;
    setTimerMs(limit);
    setMaxTimerMs(limit);
    setTypedAnswer('');
    setHasEvaluated(false);
    setIsCorrect(null);
    lastTickedSecondRef.current = null;
  }, [currentQuestionIndex, currentQ]);

  // Countdown clock tick with urgent auditory & visual triggers under 10 seconds
  useEffect(() => {
    if (isPaused || hasEvaluated || timerMs <= 0) return;
    const interval = setInterval(() => {
      setTimerMs(prev => {
        const next = prev - 50;
        if (next <= 0) {
          clearInterval(interval);
          handleTimeExpire();
          return 0;
        }

        // Auditory urgency tick when under 10 seconds on each whole second boundary
        const sec = Math.ceil(next / 1000);
        if (sec <= 10 && sec > 0 && sec !== lastTickedSecondRef.current) {
          lastTickedSecondRef.current = sec;
          if (!isMuted) {
            soundFX.playUrgentTick(0.25);
          }
        }

        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused, hasEvaluated, timerMs, isMuted]);

  const handleTimeExpire = () => {
    if (!hasEvaluated) {
      setHasEvaluated(true);
      setIsCorrect(false);
      setStreak(0);
      if (!isMuted) soundFX.playError();
      onShowToast('Time expired for this oral defense prompt!', 'info');
    }
  };

  // Canvas Waveform Animator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;
      const bars = 48;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const factor = Math.sin(phase + (i / bars) * Math.PI * 4) * 0.5 + 0.5;
        const amplitude = isPlayingAudio ? (Math.sin(phase * 2 + i * 0.4) * 0.4 + 0.6) * 45 : 6;
        const barHeight = Math.max(4, amplitude * factor);

        // Neon teal to cyan gradient
        const grad = ctx.createLinearGradient(0, midY - barHeight, 0, midY + barHeight);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.5, '#2dd4bf');
        grad.addColorStop(1, '#0284c7');

        ctx.fillStyle = grad;
        ctx.fillRect(i * barWidth + 2, midY - barHeight, barWidth - 4, barHeight * 2);
      }

      phase += isPlayingAudio ? 0.08 : 0.01;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlayingAudio]);

  const handleTryAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasEvaluated) return;
    const input = typedAnswer.trim().toLowerCase();
    if (!input) {
      onShowToast('Please type your answer or transcription first', 'info');
      return;
    }

    const correctMatch = currentQ.acceptedAnswers.some(ans => 
      ans.toLowerCase() === input || input.includes(ans.toLowerCase())
    ) || input.includes(currentQ.correctAnswer.toLowerCase());

    setHasEvaluated(true);
    setIsCorrect(correctMatch);

    if (correctMatch) {
      const addedPoints = currentQ.points || 1000;
      setScore(prev => prev + addedPoints);
      setStreak(prev => prev + 1);
      if (!isMuted) soundFX.playSuccess();
      onShowToast(`Exact match! +${addedPoints} pts`, 'success');
    } else {
      setStreak(0);
      if (!isMuted) soundFX.playError();
      onShowToast('Incorrect transcription. Revealing standard answer.', 'error');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onShowToast(`Arena completed! Final Score: ${score} points`, 'success');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Numerical progress metric string, e.g. "826"
  const numericalMetric = Math.floor((timerMs / maxTimerMs) * 1000);
  const progressPercent = Math.max(0, Math.min(100, (timerMs / maxTimerMs) * 100));

  // Sorted leaderboard in descending order by score (or by streak when streak filter is active)
  const sortedLeaderboard = [...leaderboardPlayers].sort((a, b) => {
    if (leaderboardFilter === 'streaks') {
      if (b.streak !== a.streak) return b.streak - a.streak;
      return b.score - a.score;
    }
    return b.score - a.score;
  });

  const filteredLeaderboard = sortedLeaderboard.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.institution.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (leaderboardFilter === 'podium') {
      const top3Ids = sortedLeaderboard.slice(0, 3).map(x => x.id);
      return top3Ids.includes(p.id) || p.isCurrentUser;
    }
    return true;
  });

  const userRank = sortedLeaderboard.findIndex(p => p.isCurrentUser) + 1;

  return (
    <div 
      id="live-oral-defense-arena-viewport"
      className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950"
    >
      {/* ======================================================== */}
      {/* TOP INFO STRIP                                           */}
      {/* ======================================================== */}
      <header className="h-16 px-4 sm:px-8 border-b-2 border-slate-800 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-30">
        
        {/* Left Side: Logo, Live PIN, Active Players */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-teal-400 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight text-white text-sm sm:text-base hidden md:inline">
              Academic Hub
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/90 border border-teal-500/40 text-xs sm:text-sm font-mono shadow-inner">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[11px] uppercase font-bold">PIN:</span>
            <span className="font-extrabold text-teal-300 tracking-wider">{roomPin}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">{playerCount}</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Active</span>
          </div>
        </div>

        {/* Center: Arena Tab Quick Switcher */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
          <button
            type="button"
            id="arena-tab-leaderboard-header-btn"
            onClick={() => setArenaTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              arenaTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-950" />
            <span>Quiz Leaderboard</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900/30 text-[10px] font-mono">
              #{userRank}
            </span>
          </button>

          <button
            type="button"
            id="arena-tab-stream-header-btn"
            onClick={() => setArenaTab('stream')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              arenaTab === 'stream'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audio Stream</span>
          </button>
        </div>

        {/* Right Side: Slide Metric & Standard Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Slide Track Metric Indicator */}
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold font-mono text-amber-300">
            Slide {currentQuestionIndex + 1}/{quiz.questions.length}
          </div>

          {/* Previous Slide */}
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            title="Previous slide"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? 'Resume' : 'Pause'}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Skip Slide */}
          <button
            onClick={handleNextQuestion}
            title="Skip to next slide"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Back Button with Hosting Lifecycle Modal hook */}
          <button
            onClick={onExitRoom}
            title="Exit Room / Hosting Controls"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* BALANCED HORIZONTAL SPLIT LAYOUT (FULL VIEWPORT)         */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ====================================================== */}
        {/* LEFT INTERACTION PANE                                  */}
        {/* ====================================================== */}
        <section className="flex-1 flex flex-col justify-between bg-slate-900/60 border-2 border-slate-800/90 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/60 via-teal-400/40 to-transparent" />

          {/* Staggered Spring-Animated Question Card Slide Wrapper */}
          <div 
            key={`question-card-slide-${currentQuestionIndex}`}
            className="flex-1 flex flex-col justify-between"
          >
            {/* STAGGER 1: Top Category, Score, and the Real-Time Countdown Progress Ring */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 stagger-spring-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase bg-teal-950/80 border border-teal-500/50 text-teal-300 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>{currentQ.category || quiz.category}</span>
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono font-bold text-amber-300 shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>{score} pts</span>
                </div>

                {streak > 1 && (
                  <div className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold font-mono animate-pulse">
                    🔥 {streak}x streak
                  </div>
                )}
              </div>

              {/* Real-time Countdown Timer Component with Visual Progress Ring */}
              <CountdownProgressRing 
                remainingMs={timerMs}
                totalMs={maxTimerMs}
                isPaused={isPaused}
              />
            </div>

            {/* STAGGER 2: Left-Aligned Bold Headline Query using Large Serif Typography */}
            <div className="my-auto py-3 stagger-spring-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight tracking-tight text-left">
                {currentQ.question}
              </h2>

              {currentQ.mediaTitle && (
                <p className="mt-3 text-xs sm:text-sm text-slate-400 font-mono flex items-center gap-2">
                  <Music className="w-4 h-4 text-sky-400" />
                  <span>Track reference: {currentQ.mediaTitle}</span>
                </p>
              )}
            </div>

            {/* STAGGER 3: Multiple Choice Options Prompt (if available) */}
            {currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 stagger-spring-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasEvaluated}
                    onClick={() => {
                      setTypedAnswer(opt);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      typedAnswer === opt
                        ? 'bg-sky-600/30 border-sky-400 text-white shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* STAGGER 4: Evaluation Result Banner */}
            {hasEvaluated && (
              <div className={`mb-4 p-4 rounded-2xl border-2 stagger-spring-4 flex items-start gap-3 ${
                isCorrect 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100' 
                  : 'bg-rose-950/80 border-rose-500 text-rose-100'
              }`}>
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-sm">
                    {isCorrect ? 'Outstanding! Precise oral defense.' : 'Defense rejected or incorrect.'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Expected answer: <strong className="text-white font-mono">{currentQ.correctAnswer}</strong>
                  </p>
                  {currentQ.explanation && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {currentQ.explanation}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs tracking-wide hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Continue to next slide →
                  </button>
                </div>
              </div>
            )}

            {/* STAGGER 5: Form: Text Input + 3D Raised "Try" Execution Button */}
            <form onSubmit={handleTryAnswer} className="space-y-4 stagger-spring-5">
              
              {/* Clean Rectangular Text Input Field Wrapper */}
              <div className="relative">
                <input
                  type="text"
                  id="arena-typed-answer-field"
                  value={typedAnswer}
                  disabled={hasEvaluated}
                  onChange={e => setTypedAnswer(e.target.value)}
                  placeholder="Type your answer, transcription, or argument..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700 focus:border-teal-400 text-white placeholder-slate-500 text-sm sm:text-base font-medium outline-none transition-colors shadow-inner"
                />
              </div>

              {/* Wide 3D Raised Execution Button: Exactly "Try" (Vibrant Green Theme) */}
              <button
                type="submit"
                id="btn-arena-try-execute"
                disabled={hasEvaluated}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg tracking-wider uppercase border-t-2 border-white/40 border-b-4 border-emerald-800 shadow-xl shadow-emerald-600/30 active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Try</span>
              </button>

              {/* Horizontal Loading Time Progress Bar tracking Numerical Increments (e.g., "826") */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-400">Oral Defense Timer</span>
                  <span className="text-emerald-400 font-extrabold tracking-wider">
                    {numericalMetric}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700/80 overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full transition-all duration-75 rounded-full ${
                      progressPercent > 40
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        : progressPercent > 15
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </form>
          </div>

        </section>

        {/* ====================================================== */}
        {/* RIGHT PANE: REAL-TIME QUIZ LEADERBOARD & MEDIA STREAM  */}
        {/* ====================================================== */}
        <section 
          id="arena-right-media-pane"
          className="flex-1 min-h-[520px] lg:min-h-auto bg-slate-950/90 border-2 border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-2xl"
          style={{ borderRadius: '24px' }}
        >
          {/* Top Arena Tab Switcher Strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80 shrink-0">
            {/* Tab Pill Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
              <button
                type="button"
                id="tab-btn-arena-leaderboard"
                onClick={() => setArenaTab('leaderboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  arenaTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-950" />
                <span>Quiz Leaderboard</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px] font-mono font-black">
                  LIVE
                </span>
              </button>

              <button
                type="button"
                id="tab-btn-arena-stream"
                onClick={() => setArenaTab('stream')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  arenaTab === 'stream'
                    ? 'bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Media Stream</span>
              </button>
            </div>

            {/* Live Contenders Ticker Badge */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{sortedLeaderboard.length} Scholars Active</span>
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* TAB CONTENT A: REAL-TIME QUIZ LEADERBOARD             */}
          {/* ==================================================== */}
          {arenaTab === 'leaderboard' ? (
            <div className="relative z-10 flex-1 flex flex-col min-h-0 pt-3.5 space-y-3.5 overflow-hidden">
              
              {/* CURRENT CANDIDATE PROFILE GLASSMORPHIC HERO CARD */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900/80 to-slate-900/90 border border-teal-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 text-xl font-black shadow-md border border-teal-300">
                    🎓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">You (Scholar Candidate)</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold font-mono border border-teal-500/40">
                        CANDIDATE
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span className="text-teal-300 font-bold">Rank #{userRank} of {sortedLeaderboard.length}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-extrabold">{score.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Current Streak Glassmorphic Capsule */}
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 border font-mono font-black text-xs transition-all ${
                    streak > 0
                      ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20 border-orange-500/60 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}>
                    <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400 fill-orange-400' : 'text-slate-500'}`} />
                    <span>{streak}x STREAK</span>
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLeaderboardFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      leaderboardFilter === 'all'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Contenders
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardFilter('streaks')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      leaderboardFilter === 'streaks'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>Streak Leaders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardFilter('podium')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      leaderboardFilter === 'podium'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Top 3 Podium</span>
                  </button>
                </div>

                {/* Search Scholar Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search scholar..."
                    className="pl-8 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 focus:border-teal-400 text-xs text-white placeholder-slate-500 outline-none w-36 sm:w-44 transition-colors"
                  />
                </div>
              </div>

              {/* TOP 3 PODIUM DISPLAY (Glassmorphic Pedestals) */}
              {leaderboardFilter !== 'streaks' && sortedLeaderboard.length >= 3 && !searchQuery && (
                <div className="grid grid-cols-3 gap-2.5 pt-1 pb-1 shrink-0">
                  {/* 2nd Place (Silver) */}
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-400/10 via-slate-900/60 to-slate-900/90 border-2 border-slate-400/40 backdrop-blur-xl flex flex-col items-center text-center shadow-lg relative">
                    <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center absolute -top-2.5 shadow-md">
                      2
                    </div>
                    <div className="text-xl mt-1.5">{sortedLeaderboard[1].avatar}</div>
                    <div className="text-xs font-bold text-slate-200 truncate w-full mt-1">
                      {sortedLeaderboard[1].name}
                    </div>
                    <div className="text-xs font-mono font-extrabold text-amber-300 mt-0.5">
                      {sortedLeaderboard[1].score.toLocaleString()} pts
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-[10px] text-orange-300 font-mono font-bold flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-orange-400" />
                      <span>{sortedLeaderboard[1].streak}x</span>
                    </div>
                  </div>

                  {/* 1st Place (Gold - Elevated) */}
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900/70 to-slate-900/90 border-2 border-amber-400/80 backdrop-blur-xl flex flex-col items-center text-center shadow-[0_0_20px_rgba(245,158,11,0.25)] relative -translate-y-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center absolute -top-3 shadow-md border border-amber-300">
                      <Crown className="w-3.5 h-3.5 text-amber-950" />
                    </div>
                    <div className="text-2xl mt-1">{sortedLeaderboard[0].avatar}</div>
                    <div className="text-xs font-extrabold text-amber-200 truncate w-full mt-1">
                      {sortedLeaderboard[0].name}
                    </div>
                    <div className="text-xs font-mono font-black text-amber-400 mt-0.5">
                      {sortedLeaderboard[0].score.toLocaleString()} pts
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-orange-500/30 border border-orange-500/50 text-[10px] text-orange-300 font-mono font-bold flex items-center gap-1 animate-pulse">
                      <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                      <span>{sortedLeaderboard[0].streak}x streak</span>
                    </div>
                  </div>

                  {/* 3rd Place (Bronze) */}
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-800/20 via-slate-900/60 to-slate-900/90 border-2 border-amber-700/50 backdrop-blur-xl flex flex-col items-center text-center shadow-lg relative">
                    <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center absolute -top-2.5 shadow-md">
                      3
                    </div>
                    <div className="text-xl mt-1.5">{sortedLeaderboard[2].avatar}</div>
                    <div className="text-xs font-bold text-slate-200 truncate w-full mt-1">
                      {sortedLeaderboard[2].name}
                    </div>
                    <div className="text-xs font-mono font-extrabold text-amber-300 mt-0.5">
                      {sortedLeaderboard[2].score.toLocaleString()} pts
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-[10px] text-orange-300 font-mono font-bold flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-orange-400" />
                      <span>{sortedLeaderboard[2].streak}x</span>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPLETE GLASSMORPHIC CONTENDER ROSTER CARDS */}
              <div 
                id="leaderboard-roster-cards-feed"
                className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[160px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              >
                {filteredLeaderboard.map((player) => {
                  const overallRank = sortedLeaderboard.findIndex(p => p.id === player.id) + 1;
                  return (
                    <div
                      key={player.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-md backdrop-blur-xl ${
                        player.isCurrentUser
                          ? 'bg-gradient-to-r from-teal-950/70 via-slate-900/90 to-slate-900/80 border-teal-400/90 ring-2 ring-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                          : 'bg-slate-900/60 hover:bg-slate-850/80 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      {/* Left: Rank, Avatar, Identity */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Metallic Rank Capsule */}
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                          overallRank === 1
                            ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border border-amber-300 shadow-sm'
                            : overallRank === 2
                            ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 border border-white/40 shadow-sm'
                            : overallRank === 3
                            ? 'bg-gradient-to-tr from-amber-700 to-orange-500 text-white border border-amber-500 shadow-sm'
                            : 'bg-slate-800/90 text-slate-400 border border-slate-700/80'
                        }`}>
                          #{overallRank}
                        </div>

                        {/* Avatar Capsule */}
                        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                          {player.avatar}
                        </div>

                        {/* Name, Tag & Academic Affiliation */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs sm:text-sm font-bold truncate ${
                              player.isCurrentUser ? 'text-teal-200 font-extrabold' : 'text-slate-100'
                            }`}>
                              {player.name}
                            </span>
                            {player.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded-md bg-teal-500/20 border border-teal-500/40 text-[9px] font-mono font-bold text-teal-300">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate flex items-center gap-1.5">
                            <span>{player.institution}</span>
                            <span>•</span>
                            <span className="text-slate-500">⚡ {player.speedSec}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Streak Counter Capsule & Current Score */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Streak Counter Capsule */}
                        <div className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-mono text-xs font-bold border transition-all ${
                          player.streak >= 3
                            ? 'bg-gradient-to-r from-orange-500/25 via-amber-500/25 to-red-500/25 border-orange-500/60 text-orange-300 shadow-xs'
                            : player.streak > 0
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-slate-800/50 border-slate-800 text-slate-500'
                        }`}>
                          <Flame className={`w-3.5 h-3.5 ${
                            player.streak >= 3 
                              ? 'text-orange-400 fill-orange-400 animate-pulse' 
                              : player.streak > 0 
                              ? 'text-amber-400' 
                              : 'text-slate-600'
                          }`} />
                          <span>{player.streak}x</span>
                        </div>

                        {/* Monospace Current Score Display */}
                        <div className="text-right min-w-[70px]">
                          <div className="font-mono font-extrabold text-sm sm:text-base text-amber-300">
                            {player.score.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 flex items-center justify-end gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              player.status === 'Locked In' ? 'bg-emerald-400' : 'bg-sky-400 animate-pulse'
                            }`} />
                            <span>{player.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Real-Time Sync Status Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-semibold">Real-Time Sync: Active</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Updated dynamically upon each answer submission
                </div>
              </div>

            </div>
          ) : (
            /* ==================================================== */
            /* TAB CONTENT B: LIVE AUDIO / WAVEFORM MEDIA STREAM    */
            /* ==================================================== */
            <div className="relative z-10 flex-1 flex flex-col justify-between pt-4">
              
              {/* Broadcast Header Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-400 font-extrabold tracking-wider">LIVE STREAM</span>
                  <span className="text-slate-400">#AUDIO-SPECTRUM</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                  Lossless Audio • 48kHz
                </div>
              </div>

              {/* Center Canvas Audio Visualizer Waveform */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-6">
                <div className="w-full max-w-md h-32 sm:h-44 relative flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={160}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(45,212,191,0.4)]"
                  />
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white mt-2 font-mono">
                  {currentQ.mediaTitle || 'Acoustic Defense Waveform Stream'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Synchronized oral audio playback with real-time spectrum analysis
                </p>
              </div>

              {/* Bottom Media Controls Bar */}
              <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(prev => !prev)}
                    className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isPlayingAudio ? 'Audio Stream Playing' : 'Audio Stream Paused'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Volume: {isMuted ? 'Muted' : '100%'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(prev => !prev)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          )}

        </section>

      </main>
    </div>
  );
};
