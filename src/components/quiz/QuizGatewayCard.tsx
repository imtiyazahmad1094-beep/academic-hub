import React, { useState } from 'react';
import { Trophy, Play, Radio, ArrowRight, Sparkles, Gamepad2, Brain } from 'lucide-react';

interface QuizGatewayCardProps {
  onOpenPortal: (targetPin?: string) => void;
  onOpenQuizEditor?: () => void;
  onOpenAiGenerator?: () => void;
}

export const QuizGatewayCard: React.FC<QuizGatewayCardProps> = ({
  onOpenPortal,
  onOpenQuizEditor,
  onOpenAiGenerator
}) => {
  const [pinInput, setPinInput] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenPortal(pinInput.trim() || undefined);
  };

  return (
    <div 
      id="module-interactive-quiz-gateway"
      className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-teal-500/15 dark:from-slate-900/95 dark:via-indigo-950/40 dark:to-slate-900/95 border-t-2 border-white/50 dark:border-white/20 border-b-4 border-slate-950 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(14,165,233,0.2)]"
      style={{ borderRadius: '24px' }}
    >
      {/* Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Info with High-Contrast Typography */}
        <div className="space-y-2.5 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Academic Hub Play Quiz</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
              Live Oral Defense &amp; Viva
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            Interactive Quiz Suite &amp; Live Defense Arena
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
            Multiplayer lobbies, acoustic waveform oral testing, AI question synthesis from PDF monographs, and live room hosting for up to 300 scholars.
          </p>
        </div>

        {/* Center & Right Actions: Fast PIN Capsule & Primary "Play Quiz" 3D Launcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0">
          
          {/* Quick PIN Capsule */}
          <form 
            onSubmit={handleJoin}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-emerald-400/80 dark:border-emerald-500/60 shadow-inner w-full sm:w-auto"
          >
            <Radio className="w-4 h-4 text-emerald-500 shrink-0 animate-pulse" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
              PIN:
            </span>
            <input
              type="text"
              placeholder="123 456"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="w-24 bg-transparent font-mono font-black text-sm text-slate-900 dark:text-teal-300 placeholder-slate-400 outline-none uppercase tracking-wider"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase cursor-pointer transition-all border-t border-white/40 border-b-2 border-emerald-800 shadow-sm active:translate-y-0.5 active:border-b-0"
            >
              Enter
            </button>
          </form>

          {/* Primary Hyper-Tactile 3D "Play Quiz" Launcher Button */}
          <button
            type="button"
            id="primary-play-quiz-launcher-btn"
            onClick={() => onOpenPortal()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide border-t-2 border-white/80 border-b-4 border-emerald-900 dark:border-black shadow-xl shadow-emerald-500/25 hover:-translate-y-1 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
          >
            <Gamepad2 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>Play Quiz</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
};

