import React, { useState } from 'react';
import { 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  Volume2, 
  Radio, 
  Layers,
  ChevronRight,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { soundFX } from '../../utils/audioUtils';

export interface FlashcardItem {
  id: string;
  term: string;
  category: string;
  definition: string;
  academicCitation?: string;
  hint?: string;
}

const SAMPLE_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    term: 'Categorical Imperative (Kant)',
    category: 'Philosophy & Ethics',
    definition: 'Act only according to that maxim whereby you can at the same time will that it should become a universal law without contradiction.',
    academicCitation: 'Groundwork of the Metaphysics of Morals (1785)',
    hint: 'Deontological moral philosophy founded upon rational duty.'
  },
  {
    id: 'fc-2',
    term: 'Gradient Descent Optimization',
    category: 'Computer Science & AI',
    definition: 'A first-order iterative optimization algorithm for finding a local minimum of a differentiable function by taking steps proportional to the negative of the gradient.',
    academicCitation: 'Cauchy, A. (1847) / Goodfellow et al. (2016)',
    hint: 'Learning rate modulates step vector across parameter loss manifolds.'
  },
  {
    id: 'fc-3',
    term: 'Usul al-Fiqh: Ijma (الإجماع)',
    category: 'Islamic Jurisprudence',
    definition: 'The unanimous consensus of qualified Islamic legal scholars (Mujtahids) of a particular era on a religious or legal ruling following the demise of the Prophet ﷺ.',
    academicCitation: 'Al-Ghazali, Al-Mustasfa min Ilm al-Usul',
    hint: 'The third recognized primary source of Islamic jurisprudence.'
  },
  {
    id: 'fc-4',
    term: 'Schrödinger Wave Equation',
    category: 'Quantum Mechanics',
    definition: 'A linear partial differential equation that governs the wave function of a quantum-mechanical system, describing how the quantum state changes over time.',
    academicCitation: 'Annalen der Physik (1926)',
    hint: 'iℏ ∂/∂t |ψ(t)⟩ = Ĥ |ψ(t)⟩'
  },
  {
    id: 'fc-5',
    term: 'P-Value & Null Hypothesis',
    category: 'Statistical Inference',
    definition: 'The probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is completely true.',
    academicCitation: 'Fisher, R. A. (1925)',
    hint: 'Significance threshold commonly indexed at α = 0.05.'
  },
  {
    id: 'fc-6',
    term: 'Transformer Attention Mechanism',
    category: 'Deep Learning',
    definition: 'Query-Key-Value mapping scaled dot-product formula: Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V, enabling global sequence context modeling without recurrence.',
    academicCitation: 'Vaswani et al. (NeurIPS 2017)',
    hint: 'Attention is All You Need.'
  }
];

interface FlashcardVivaArenaProps {
  onBackToDiscovery: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const FlashcardVivaArena: React.FC<FlashcardVivaArenaProps> = ({
  onBackToDiscovery,
  onShowToast
}) => {
  const [cards] = useState<FlashcardItem[]>(SAMPLE_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [history, setHistory] = useState<{ id: string; knew: boolean }[]>([]);

  const activeCard = cards[currentIndex] || cards[0];
  const totalCards = 20; // 20-card queue standard as per prompt specification

  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
    soundFX.playTick(0.25);
  };

  const handleRating = (knew: boolean) => {
    if (knew) {
      setKnownCount(prev => prev + 1);
      soundFX.playSuccess(0.35);
      onShowToast(`Mastered: "${activeCard.term}"`, 'success');
    } else {
      setReviewCount(prev => prev + 1);
      soundFX.playJoin(0.2);
      onShowToast(`Queued for review: "${activeCard.term}"`, 'info');
    }

    setHistory(prev => [...prev, { id: activeCard.id, knew }]);
    setIsFlipped(false);

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Loop or complete
        setCurrentIndex(0);
        onShowToast('Queue cycle completed! Reviewing deck.', 'info');
      }
    }, 200);
  };

  return (
    <div 
      id="flashcard-viva-module-arena"
      className="space-y-6 animate-fade-in w-full max-w-6xl mx-auto"
    >
      {/* Top Header Bar with tactile bezel */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onBackToDiscovery}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs border-t border-white/40 border-b-2 border-slate-900/30 transition-all cursor-pointer active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-mono font-black">
            <Brain className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>Play by Flashcards (Viva Module)</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
            ✓ Mastered: {knownCount}
          </div>
          <div className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
            ↺ Review: {reviewCount}
          </div>
        </div>
      </div>

      {/* Split Interactive Arena for Memory Loops (Left Pane & Right Pane) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ======================================================== */}
        {/* LEFT PANE: 3D GLASSMORPHIC FLIP CARD                     */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div 
            className="perspective-[1200px] w-full min-h-[380px] sm:min-h-[420px] cursor-pointer group"
            onClick={handleFlipCard}
          >
            <div 
              className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl transition-transform duration-500 ease-out shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* FRONT OF CARD (Question / Term) */}
              <div 
                className="absolute inset-0 backface-hidden p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-t-2 border-white/25 border-b-4 border-black flex flex-col justify-between shadow-[0_15px_35px_rgba(30,27,75,0.4)]"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                {/* Card Top Strip */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {activeCard.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Click to Flip Card</span>
                  </div>
                </div>

                {/* Main Term / Prompt */}
                <div className="my-auto text-center space-y-3 py-6">
                  <span className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-widest block">
                    Term / Question Prompt
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white drop-shadow-md">
                    {activeCard.term}
                  </h2>
                  {activeCard.hint && (
                    <p className="text-xs sm:text-sm text-indigo-200/70 font-sans italic max-w-md mx-auto">
                      Hint: {activeCard.hint}
                    </p>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
                  <span>Viva Memory Loop</span>
                  <span className="text-amber-400 font-mono font-bold">Tap to reveal definition →</span>
                </div>
              </div>

              {/* BACK OF CARD (Definition / Solution) */}
              <div 
                className="absolute inset-0 backface-hidden p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white border-t-2 border-white/30 border-b-4 border-black flex flex-col justify-between shadow-[0_15px_35px_rgba(6,78,59,0.4)]"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {/* Back Top Strip */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Verified Answer &amp; Definition
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Recall Verified</span>
                  </div>
                </div>

                {/* Main Definition Body */}
                <div className="my-auto text-center space-y-4 py-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-emerald-100 leading-relaxed max-w-2xl mx-auto">
                    "{activeCard.definition}"
                  </h3>
                  {activeCard.academicCitation && (
                    <div className="inline-block px-3 py-1 rounded-xl bg-black/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                      📚 Citation: {activeCard.academicCitation}
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between text-xs text-emerald-300/70 border-t border-white/10 pt-3">
                  <span>Rate your comprehension on the right panel</span>
                  <span className="text-emerald-400 font-mono">Card {(currentIndex % cards.length) + 1} of {cards.length}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              💡 Tip: Click anywhere on the card to physically rotate it in 3D space
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANE: QUEUE TRACKER & TACTILE RATING BUTTONS       */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-5 p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/25 dark:border-black shadow-2xl backdrop-blur-xl">
          
          <div className="space-y-4">
            {/* Queue Tracker Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  Memory Queue
                </span>
                <h3 className="text-xl font-black font-serif text-slate-900 dark:text-white">
                  Card {currentIndex + 1} / {totalCards}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm font-mono shadow-xs">
                #{currentIndex + 1}
              </div>
            </div>

            {/* Progress Segmented Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                <span>Progress</span>
                <span>{Math.round(((currentIndex + 1) / totalCards) * 100)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, ((currentIndex + 1) / totalCards) * 100)}%` }}
                />
              </div>
            </div>

            {/* Viva Session Insights */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Retention Target</span>
                <span className="font-bold text-slate-900 dark:text-white">85% Accuracy</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Interval Decay Algorithm</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">SM-2 Spaced</span>
              </div>
            </div>
          </div>

          {/* TWO QUICK TACTILE RATING BUTTONS */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
              Active Recall Assessment
            </span>

            {/* Button 1: 👍 I Knew This (Green outline border, 3D raised) */}
            <button
              type="button"
              id="btn-flashcard-knew"
              onClick={() => handleRating(true)}
              className="w-full py-4 px-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-sm tracking-wide border-2 border-emerald-500 border-t-2 border-t-white/40 dark:border-t-emerald-400 border-b-4 border-b-emerald-800 dark:border-b-emerald-950 shadow-lg shadow-emerald-500/20 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <ThumbsUp className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>👍 I Knew This</span>
            </button>

            {/* Button 2: 👎 Review Again (Red outline border, 3D raised) */}
            <button
              type="button"
              id="btn-flashcard-review"
              onClick={() => handleRating(false)}
              className="w-full py-4 px-5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-black text-sm tracking-wide border-2 border-rose-500 border-t-2 border-t-white/40 dark:border-t-rose-400 border-b-4 border-b-rose-800 dark:border-b-rose-950 shadow-lg shadow-rose-500/20 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <ThumbsDown className="w-5 h-5 text-rose-500 shrink-0" />
              <span>👎 Review Again</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
