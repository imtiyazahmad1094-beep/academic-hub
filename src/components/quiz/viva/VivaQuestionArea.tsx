import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VivaQuestionItem } from './LiveVivaQuestionArena';
import { soundFX } from '../../../utils/audioUtils';

export interface VivaHintData {
  keyConcept: string;
  nudge: string;
  source?: string;
}

export interface VivaQuestionAreaProps {
  question: VivaQuestionItem;
  currentSlide: number;
  totalSlides?: number;
  completedSlides?: number[];
  timeLeft: number;
  typedAnswer: string;
  onTypedAnswerChange: (value: string) => void;
  isRecordingMic: boolean;
  onToggleMic: () => void;
  onSubmitAnswer: () => void;
  evaluating: boolean;
  hasEvaluated: boolean;
  domainName: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onSelectSlide?: (slideNum: number) => void;
}

// Built-in intelligent heuristic hints for every slide
const PRESET_HINTS: Record<number, VivaHintData> = {
  1: {
    keyConcept: "Gülhane Rescript (1839) & Equal Civil Protection",
    nudge: "Consider how legal guarantees for life, honor, and property were decoupled from religious affiliation to establish direct state tax administration."
  },
  2: {
    keyConcept: "Vaka-i Hayriye (Auspicious Incident) & Institutional Modernization",
    nudge: "Reflect on how terminating the Janissary military monopoly cleared the political ground to erect European-modeled ministerial Nezarets."
  },
  3: {
    keyConcept: "Parliamentary Shura (Institutionalized Consultation)",
    nudge: "Notice how Namik Kemal reconciled representative constitutional checks with traditional Quranic consultative jurisprudence."
  },
  4: {
    keyConcept: "Statutory Codification (Taqnin) & Mecelle",
    nudge: "Examine how Ahmet Cevdet Pasha systematically translated classical Hanafi transactions into clear numbered civil code articles."
  },
  5: {
    keyConcept: "Evkaf-i Hümayun Nezareti Fiscal Oversight",
    nudge: "Focus on how state administration of religious endowments centralized fragmented revenues into the imperial treasury."
  },
  6: {
    keyConcept: "Nizamiye Court Dualism",
    nudge: "Analyze the jurisdictional division between traditional Sharia personal law courts and new statutory civil & commercial tribunals."
  },
  7: {
    keyConcept: "Kanun-i Esasi (1876) Executive Prerogative",
    nudge: "Pay attention to Article 113 and how the balance between the Sultan's sovereign power and parliamentary representation was structured."
  },
  8: {
    keyConcept: "Mekteb-i Mülkiye & Bureaucratic Meritocracy",
    nudge: "Look at the educational transformation that trained secular civil servants in economics, languages, and modern administration."
  },
  9: {
    keyConcept: "Duyun-u Umumiye (Ottoman Public Debt Administration)",
    nudge: "Consider how European creditors acquired direct fiscal collection rights over designated state monopolies following the 1881 decree."
  },
  10: {
    keyConcept: "Pan-Islamic Legitimacy & Imperial Infrastructure",
    nudge: "Synthesize how Sultan Abdulhamid II utilized caliphal prestige alongside telegram networks and the Hejaz Railway to maintain cohesion."
  }
};

export const VivaQuestionArea: React.FC<VivaQuestionAreaProps> = ({
  question,
  currentSlide,
  totalSlides = 10,
  completedSlides = [],
  timeLeft,
  typedAnswer,
  onTypedAnswerChange,
  isRecordingMic,
  onToggleMic,
  onSubmitAnswer,
  evaluating,
  hasEvaluated,
  domainName,
  onShowToast,
  onSelectSlide
}) => {
  const [hint, setHint] = useState<VivaHintData | null>(null);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [loadingHint, setLoadingHint] = useState(false);

  // Automatically reset or fetch hint when moving between slides
  useEffect(() => {
    setHint(null);
    setIsHintOpen(false);
    setLoadingHint(false);
  }, [currentSlide]);

  // Compute visual progress percentage
  // If current question has been evaluated/submitted, progress includes it fully.
  // Otherwise, the current question shows an active in-progress state.
  const completedCount = completedSlides.length;
  const progressRatio = Math.min(1, Math.max(0, (currentSlide - 1 + (hasEvaluated ? 1 : 0.45)) / totalSlides));
  const progressPercent = Math.round(progressRatio * 100);

  // Fetch or Reveal AI Hint
  const handleToggleHint = async () => {
    if (isHintOpen) {
      setIsHintOpen(false);
      soundFX.playTick(0.15);
      return;
    }

    if (hint) {
      setIsHintOpen(true);
      soundFX.playSuccess(0.3);
      return;
    }

    setLoadingHint(true);
    soundFX.playTick(0.2);

    try {
      const response = await fetch('/api/viva-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          context: question.context,
          domain: domainName,
          difficulty: question.difficulty,
          slideNum: currentSlide
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.hint) {
        setHint(result.hint);
        setIsHintOpen(true);
        soundFX.playSuccess(0.4);
        onShowToast('AI Examiner Hint generated: 1 key concept revealed!', 'success');
      } else {
        // Fallback to preset hint
        const fallback = PRESET_HINTS[currentSlide] || PRESET_HINTS[1];
        setHint(fallback);
        setIsHintOpen(true);
        soundFX.playSuccess(0.3);
      }
    } catch (err) {
      console.warn('[VivaQuestionArea] AI Hint network fallback activated:', err);
      // Instant graceful heuristic fallback
      const fallback = PRESET_HINTS[currentSlide] || {
        keyConcept: 'Structural Institutional Precedent',
        nudge: 'Examine the primary legal charter or ministerial decree that mediated between traditional authority and modern governance.'
      };
      setHint(fallback);
      setIsHintOpen(true);
      soundFX.playSuccess(0.3);
      onShowToast('Gentle hint loaded from scholarly knowledge base', 'info');
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <div 
      id="viva-question-area" 
      className="p-6 sm:p-9 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-t-2 border-white/80 dark:border-white/10 border-b-4 border-slate-300 dark:border-black shadow-2xl backdrop-blur-xl space-y-6 transition-all duration-300"
    >
      {/* ======================================================== */}
      {/* ANIMATED VIVA PROGRESS TRACKER (SLIDE 1/10 VISUAL SYSTEM) */}
      {/* ======================================================== */}
      <div className="space-y-2.5 pb-2 border-b border-slate-200/90 dark:border-slate-800">
        
        {/* Top Info Strip: Session Trajectory, Slide Index, Completion % */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Slide {currentSlide} of {totalSlides}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Trajectory:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{completedCount} Defended</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Progress</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono font-bold text-xs border border-teal-500/30 shadow-2xs">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Fluid Animated Progress Bar Track */}
        <div 
          role="progressbar" 
          aria-valuenow={progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="relative w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-800/90 overflow-hidden shadow-inner p-0.5 border border-slate-300/60 dark:border-slate-700/60"
        >
          {/* Animated Gradient Fill */}
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-400 relative overflow-hidden transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Ambient Shimmer Light Strip */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent w-full animate-shimmer" />
          </div>
        </div>

        {/* 10-Slide Segmented Beads Indicator */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 pt-1">
          {Array.from({ length: totalSlides }, (_, idx) => {
            const slideNumber = idx + 1;
            const isCurrent = slideNumber === currentSlide;
            const isCompleted = completedSlides.includes(slideNumber);
            const isPast = slideNumber < currentSlide;

            return (
              <button
                key={slideNumber}
                type="button"
                onClick={() => onSelectSlide && onSelectSlide(slideNumber)}
                title={`Slide ${slideNumber}${isCompleted ? ' (Evaluated)' : isCurrent ? ' (Active)' : ''}`}
                className={`group relative h-2.5 sm:h-3 rounded-md transition-all duration-300 cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'bg-purple-600 ring-2 ring-purple-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 shadow-md scale-105'
                    : isCompleted || isPast
                    ? 'bg-teal-500/90 hover:bg-teal-400'
                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {/* Dot Pulse for Current Slide */}
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Indicators: Level, Time Remaining, and Get Hint Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold">
            Level: {question.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">
            {domainName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 'GET HINT' AI NUDGE BUTTON */}
          <button
            type="button"
            id="btn-get-viva-hint"
            onClick={handleToggleHint}
            disabled={loadingHint}
            className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-xs tracking-wide transition-all cursor-pointer shadow-xs active:scale-95 border ${
              isHintOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-300/40'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40 hover:border-amber-400/70'
            }`}
          >
            {loadingHint ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                <span>AI Generating Nudge...</span>
              </>
            ) : (
              <>
                <Lightbulb className={`w-3.5 h-3.5 ${isHintOpen ? 'text-slate-950' : 'text-amber-500 animate-pulse'}`} />
                <span>{isHintOpen ? 'Hide Hint' : 'Get Hint'}</span>
                {isHintOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />}
              </>
            )}
          </button>

          {/* Time Remaining Pill */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Time:</span>
            <span className={`px-3 py-1 rounded-full font-bold text-xs sm:text-sm font-mono shadow-xs ${
              timeLeft < 15 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-teal-300 border border-slate-300 dark:border-slate-700'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPANDABLE GENTLE AI HINT REVELATION PANEL               */}
      {/* ======================================================== */}
      {isHintOpen && hint && (
        <div 
          id="viva-ai-hint-card"
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/95 via-orange-50/70 to-yellow-50/90 dark:from-amber-950/40 dark:via-slate-900/90 dark:to-orange-950/30 border-2 border-amber-400/80 dark:border-amber-500/50 shadow-xl backdrop-blur-md space-y-3 animate-fade-in text-left relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header Strip with AI Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                💡
              </span>
              <div>
                <span className="text-xs font-mono font-black tracking-wide text-amber-800 dark:text-amber-300 uppercase block">
                  Gentle AI Examination Nudge
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                  Reveals 1 key concept without disclosing the full answer
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHintOpen(false)}
              className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          {/* Key Concept / Keyword Pill */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
              Focus Concept:
            </span>
            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-mono font-black text-xs shadow-xs border border-amber-300">
              🎯 {hint.keyConcept}
            </span>
          </div>

          {/* The Gentle Guiding Nudge */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-amber-300/80 dark:border-amber-500/30">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-amber-100 font-sans italic leading-relaxed">
              "{hint.nudge}"
            </p>
          </div>

          {/* Scholar Reflection Tip */}
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Reflect on this key concept to formulate your verbal thesis defense.</span>
          </div>
        </div>
      )}

      {/* Large Academic Question in Elegant Serif Typography */}
      <div className="space-y-2 text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
          Oral Defense Inquiry
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white leading-snug">
          "{question.question}"
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans italic">
          {question.context}
        </p>
      </div>

      {/* Answer Input Area */}
      <div className="space-y-3 pt-2 text-left">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Type or dictate your verbal argument:</span>
          <span className="text-purple-600 dark:text-purple-400">{typedAnswer.length} characters</span>
        </div>

        <div className="relative">
          <textarea
            rows={4}
            value={typedAnswer}
            onChange={e => onTypedAnswerChange(e.target.value)}
            placeholder="Formulate your structured academic thesis, cite institutional decrees, and analyze administrative consequences..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-sans focus:border-purple-500 outline-none resize-none transition-all shadow-inner"
          />

          {/* Mic Toggle Float */}
          <button
            type="button"
            onClick={onToggleMic}
            className={`absolute right-3 bottom-3 p-2.5 rounded-xl border transition-all cursor-pointer shadow-md ${
              isRecordingMic 
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-purple-600 hover:text-white'
            }`}
            title={isRecordingMic ? 'Stop mic dictation' : 'Start mic dictation'}
          >
            {isRecordingMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Row: [ Load Exemplar Response ] & [ Submit Answer ] */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onTypedAnswerChange(question.exemplarAnswer)}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 underline cursor-pointer font-mono"
          >
            Load Exemplar Response
          </button>

          <button
            type="button"
            id="btn-submit-viva-answer"
            onClick={onSubmitAnswer}
            disabled={evaluating}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wide border-t-2 border-white/50 border-b-4 border-purple-950 shadow-lg shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            {evaluating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                <span>Evaluating Defense...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Answer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
