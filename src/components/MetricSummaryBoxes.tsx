import React from 'react';
import { 
  Layers, 
  FileText, 
  Award, 
  Globe, 
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AcademicProgram, AcademicAbstract } from '../types';
import { TranslationDict } from '../utils/translations';

interface MetricSummaryBoxesProps {
  programs: AcademicProgram[];
  abstracts: AcademicAbstract[];
  className?: string;
  onCardClick?: (metricKey: 'programs' | 'abstracts' | 'length' | 'modality') => void;
  t?: TranslationDict;
}

export const MetricSummaryBoxes: React.FC<MetricSummaryBoxesProps> = ({
  programs,
  abstracts,
  className = '',
  onCardClick,
  t
}) => {
  // Metric Computations
  const totalProgramsCount = programs.length;
  const onlineCount = programs.filter(p => p.mode === 'Online').length;
  const offlineCount = programs.filter(p => p.mode === 'Offline').length;

  const totalAbstractsCount = abstracts.length;
  const acceptedCount = abstracts.filter(a => a.status === 'Accepted').length;
  const acceptanceRate = totalAbstractsCount > 0 ? Math.round((acceptedCount / totalAbstractsCount) * 100) : 0;

  const totalWords = abstracts.reduce((acc, a) => acc + (a.wordCount || 0), 0);
  const avgWordCount = totalAbstractsCount > 0 ? Math.round(totalWords / totalAbstractsCount) : 0;

  const virtualPercentage = totalProgramsCount > 0 
    ? Math.round((onlineCount / totalProgramsCount) * 100) 
    : 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. TOTAL PROGRAMS MODULE: Cyan/Teal Brand Theme (#0ea5e9 / #06b6d4)       */}
      {/* ========================================================================= */}
      <div
        id="metric-box-total-programs"
        onClick={() => onCardClick && onCardClick('programs')}
        className="metric-box-glass metric-card-cyan p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-[1.5px] border-cyan-400/40 dark:border-cyan-400/50"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Corner Aura */}
        <div 
          className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-400/20 dark:bg-cyan-400/25 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125" 
        />

        <div>
          {/* Header Row: Label + Accent Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-cyan-900 dark:text-cyan-100/90 font-sans [text-shadow:0_0_8px_rgba(34,211,238,0.35)]">
              {t?.totalPrograms || 'TOTAL PROGRAMS'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 dark:bg-cyan-400/20 border border-cyan-500/30 dark:border-cyan-400/50 text-cyan-600 dark:text-cyan-300 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Metric Value with Crisp Neon Text-Shadow Glow */}
          <div className="text-3xl sm:text-4xl font-black text-cyan-700 dark:text-cyan-300 tracking-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] dark:drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
            {totalProgramsCount}
          </div>
        </div>

        {/* Footer Subtext: Uniform Cyan Theme Sync */}
        <div className="mt-3 pt-3 border-t border-cyan-500/20 dark:border-cyan-400/30 flex items-center justify-between text-xs text-cyan-800 dark:text-cyan-100/90 font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" />
            <span>{onlineCount} {t?.online || 'Online'}</span>
          </span>
          <span className="text-cyan-700/90 dark:text-cyan-100/80">
            • {offlineCount} {t?.offline || 'On-Site'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CURATED ABSTRACTS MODULE: Emerald/Green Brand Theme (#10b981)          */}
      {/* ========================================================================= */}
      <div
        id="metric-box-curated-abstracts"
        onClick={() => onCardClick && onCardClick('abstracts')}
        className="metric-box-glass metric-card-emerald p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-[1.5px] border-emerald-400/40 dark:border-emerald-400/50"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Corner Aura */}
        <div 
          className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/20 dark:bg-emerald-400/25 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125" 
        />

        <div>
          {/* Header Row: Label + Accent Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-100/90 font-sans [text-shadow:0_0_8px_rgba(52,211,153,0.35)]">
              {t?.abstracts ? `${t.abstracts.toUpperCase()} (CURATED)` : 'CURATED ABSTRACTS'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 dark:border-emerald-400/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Metric Value with Crisp Neon Text-Shadow Glow */}
          <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] dark:drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]">
            {totalAbstractsCount}
          </div>
        </div>

        {/* Footer Subtext: Uniform Emerald Theme Sync */}
        <div className="mt-3 pt-3 border-t border-emerald-500/20 dark:border-emerald-400/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-100/90 font-bold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
            <span>{acceptanceRate}% Acceptance Ratio</span>
          </span>
          <span className="text-emerald-700/90 dark:text-emerald-100/80">
            Peer Reviewed
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AVG. ABSTRACT LENGTH MODULE: Amber/Gold Brand Theme (#f59e0b)          */}
      {/* ========================================================================= */}
      <div
        id="metric-box-avg-abstract-length"
        onClick={() => onCardClick && onCardClick('length')}
        className="metric-box-glass metric-card-amber p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-[1.5px] border-amber-400/40 dark:border-amber-400/50"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Corner Aura */}
        <div 
          className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 dark:bg-amber-400/25 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125" 
        />

        <div>
          {/* Header Row: Label + Accent Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-100/90 font-sans [text-shadow:0_0_8px_rgba(251,191,36,0.35)]">
              AVG. ABSTRACT LENGTH
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 dark:bg-amber-400/20 border border-amber-500/30 dark:border-amber-400/50 text-amber-600 dark:text-amber-300 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]">
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Metric Value with Crisp Neon Text-Shadow Glow */}
          <div className="text-3xl sm:text-4xl font-black text-amber-700 dark:text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]">
            {avgWordCount} <span className="text-lg font-bold text-amber-800/80 dark:text-amber-200/90 font-mono">words</span>
          </div>
        </div>

        {/* Footer Subtext: Uniform Amber Theme Sync */}
        <div className="mt-3 pt-3 border-t border-amber-500/20 dark:border-amber-400/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-100/90 font-bold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>Within 250-300 word bound</span>
          </span>
          <span className="text-amber-700/90 dark:text-amber-100/80">
            Excellent
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALITY SPLIT MODULE: Purple/Indigo Brand Theme (#6366f1)             */}
      {/* ========================================================================= */}
      <div
        id="metric-box-modality-split"
        onClick={() => onCardClick && onCardClick('modality')}
        className="metric-box-glass metric-card-indigo p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-[1.5px] border-purple-400/40 dark:border-purple-400/50"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Corner Aura */}
        <div 
          className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-400/20 dark:bg-purple-400/25 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125" 
        />

        <div>
          {/* Header Row: Label + Accent Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-purple-100/90 font-sans [text-shadow:0_0_8px_rgba(192,132,252,0.35)]">
              MODALITY SPLIT
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 dark:bg-purple-400/20 border border-indigo-500/30 dark:border-purple-400/50 text-indigo-600 dark:text-purple-300 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 drop-shadow-[0_0_6px_rgba(192,132,252,0.4)]">
              <Globe className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Metric Value with Crisp Neon Text-Shadow Glow */}
          <div className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-purple-300 tracking-tight drop-shadow-[0_0_8px_rgba(192,132,252,0.5)] dark:drop-shadow-[0_0_12px_rgba(192,132,252,0.7)]">
            {virtualPercentage}% <span className="text-lg font-bold text-indigo-800/80 dark:text-purple-200/90 font-mono">Virtual</span>
          </div>
        </div>

        {/* Footer Subtext: Uniform Purple/Indigo Theme Sync */}
        <div className="mt-3 pt-3 border-t border-indigo-500/20 dark:border-purple-400/30 flex items-center justify-between text-xs text-indigo-800 dark:text-purple-100/80 font-bold">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-300" />
            <span>Hybrid global reach</span>
          </span>
          <span className="text-indigo-700/90 dark:text-purple-200/90">
            {onlineCount}V / {offlineCount}P
          </span>
        </div>
      </div>

    </div>
  );
};
