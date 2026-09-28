import React from 'react';
import { AcademicProgram } from '../types';
import { getDaysUntil, TODAY_ISO } from '../utils/academicUtils';
import { TranslationDict } from '../utils/translations';

interface MiniSystemSummaryStripProps {
  programs: AcademicProgram[];
  t: TranslationDict;
}

export const MiniSystemSummaryStrip: React.FC<MiniSystemSummaryStripProps> = ({
  programs,
  t,
}) => {
  const onlineCount = programs.filter(p => p.mode === 'Online').length;
  const offlineCount = programs.filter(p => p.mode === 'Offline').length;

  const approachingCount = programs.filter(p => {
    const days = getDaysUntil(p.date, TODAY_ISO);
    return days >= 0 && days <= 3;
  }).length;

  return (
    <div 
      id="mini-system-summary-strip"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-fade-in"
    >
      {/* Box 1 (Total Events): Cyan Theme */}
      <div 
        className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 shadow-xs transition-all hover:bg-white/85 dark:hover:bg-slate-900/80"
        style={{ borderRadius: '8px' }}
      >
        <div 
          className="w-8 h-8 shrink-0 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center border border-cyan-200/80 dark:border-cyan-800/80"
          style={{ borderRadius: '6px' }}
        >
          {programs.length}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider truncate">
            {t.totalPrograms || 'TOTAL PROGRAMS'}
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
            {programs.length} Events
          </div>
        </div>
      </div>

      {/* Box 2 (Approaching Items): Cherry-Red Theme */}
      <div 
        className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 shadow-xs transition-all hover:bg-white/85 dark:hover:bg-slate-900/80"
        style={{ borderRadius: '8px' }}
      >
        <div 
          className="w-8 h-8 shrink-0 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold text-xs flex items-center justify-center border border-rose-200/80 dark:border-rose-800/80"
          style={{ borderRadius: '6px' }}
        >
          {approachingCount}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider truncate">
            {t.approachingSoon || 'APPROACHING SOON'}
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400 truncate">
            {approachingCount} {t.scheduled || 'Scheduled'}
          </div>
        </div>
      </div>

      {/* Box 3 (Webinar Status): Mint-Green Theme */}
      <div 
        className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 shadow-xs transition-all hover:bg-white/85 dark:hover:bg-slate-900/80"
        style={{ borderRadius: '8px' }}
      >
        <div 
          className="w-8 h-8 shrink-0 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/80"
          style={{ borderRadius: '6px' }}
        >
          {onlineCount}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider truncate">
            ONLINE MODE
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-teal-600 dark:text-teal-400 truncate">
            {onlineCount} Webinars
          </div>
        </div>
      </div>

      {/* Box 4 (Physical Venues): Amber Theme */}
      <div 
        className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 shadow-xs transition-all hover:bg-white/85 dark:hover:bg-slate-900/80"
        style={{ borderRadius: '8px' }}
      >
        <div 
          className="w-8 h-8 shrink-0 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center border border-amber-200/80 dark:border-amber-800/80"
          style={{ borderRadius: '6px' }}
        >
          {offlineCount}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider truncate">
            OFFLINE / ON-SITE
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 truncate">
            {offlineCount} On-Site
          </div>
        </div>
      </div>
    </div>
  );
};
