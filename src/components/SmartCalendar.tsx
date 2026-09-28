import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Building2, 
  Clock, 
  MapPin, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  Plus,
  BookmarkCheck,
  Star
} from 'lucide-react';
import { AcademicProgram } from '../types';
import { 
  getProgramStatus, 
  formatFriendlyDate, 
  TODAY_ISO 
} from '../utils/academicUtils';
import { TranslationDict } from '../utils/translations';

interface SmartCalendarProps {
  programs: AcademicProgram[];
  interestedProgramIds?: string[];
  onSelectProgram: (program: AcademicProgram) => void;
  onToggleMode: (programId: string, currentMode: 'Online' | 'Offline') => void;
  t?: TranslationDict;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  programs,
  interestedProgramIds = [],
  onSelectProgram,
  onToggleMode,
  t,
}) => {
  // Calendar month state (default to September 2026 based on TODAY_ISO)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(TODAY_ISO);
  const [calendarViewType, setCalendarViewType] = useState<'month' | 'timeline'>('month');
  const [dayInspectorDate, setDayInspectorDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Compute days in current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    dateIso: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    programsOnDay: AcademicProgram[];
    hasInterestedProgram: boolean;
  }> = [];

  // Generate day slots
  for (let i = 0; i < firstDayOfMonth; i++) {
    // Blank padding
    calendarDays.push({
      dayNumber: 0,
      dateIso: '',
      isCurrentMonth: false,
      isToday: false,
      programsOnDay: [],
      hasInterestedProgram: false
    });
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateIso = `${currentYear}-${monthStr}-${dayStr}`;
    const isToday = dateIso === TODAY_ISO;
    const progs = programs.filter(p => p.date === dateIso);
    const hasInterested = progs.some(p => interestedProgramIds.includes(p.id));

    calendarDays.push({
      dayNumber: day,
      dateIso,
      isCurrentMonth: true,
      isToday,
      programsOnDay: progs,
      hasInterestedProgram: hasInterested
    });
  }

  // Selected date programs
  const selectedDayPrograms = selectedDateIso 
    ? programs.filter(p => p.date === selectedDateIso)
    : [];

  const dayInspectorPrograms = dayInspectorDate
    ? programs.filter(p => p.date === dayInspectorDate)
    : [];

  return (
    <div 
      className="section-box-glass section-box-calendar p-6 mb-10 border-2 border-indigo-500/40 rounded-[20px] bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden" 
      id="smart-calendar-module"
    >
      {/* Ambient Indigo Glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Calendar Header with Title and Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 neon-glow-purple">
              <span className="sketch-underline">{t?.calendar ? `${t.calendar} • Smart Academic Calendar` : 'Smart Academic Calendar'}</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Visual status monitoring: <span className="text-emerald-700 dark:text-emerald-400 font-bold inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Solid Emerald Block</span> (Your Interested/Selected Events), <span className="text-red-600 dark:text-red-400 font-bold inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full animate-blink-red" /> Blinking Red</span> (Approaching ≤ 3 days), <span className="text-red-800 dark:text-red-300 font-bold">Solid Red</span> (Concluded). Click any day box to inspect schedule.
          </p>
        </div>

        {/* View mode toggle (Month vs Timeline) - 3D Glassmorphism Control Block */}
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center p-1.5 bg-white/45 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/15 transition-all shadow-sm"
            style={{ 
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08)' 
            }}
          >
            <button
              id="btn-cal-view-month"
              onClick={() => setCalendarViewType('month')}
              className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                calendarViewType === 'month'
                  ? 'bg-gradient-to-b from-violet-500 via-violet-600 to-indigo-700 text-white font-extrabold border-t-2 border-white/40 border-b-2 border-violet-800 shadow-[0_0_15px_rgba(99,102,241,0.5)] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] scale-[1.02]'
                  : 'text-slate-600 dark:text-zinc-400 font-bold hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month Grid</span>
            </button>
            <button
              id="btn-cal-view-timeline"
              onClick={() => setCalendarViewType('timeline')}
              className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                calendarViewType === 'timeline'
                  ? 'bg-gradient-to-b from-violet-500 via-violet-600 to-indigo-700 text-white font-extrabold border-t-2 border-white/40 border-b-2 border-violet-800 shadow-[0_0_15px_rgba(99,102,241,0.5)] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] scale-[1.02]'
                  : 'text-slate-600 dark:text-zinc-400 font-bold hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Timeline View</span>
            </button>
          </div>
        </div>
      </div>

      {calendarViewType === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* Calendar Grid (8 cols on lg) - 3D Glass Container with Bezel Shadow */}
          <div 
            className="lg:col-span-8 bg-slate-900/90 dark:bg-zinc-950/90 backdrop-blur-xl p-4 sm:p-5 border-2 border-indigo-500/40 rounded-[20px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.4)]"
          >
            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif tracking-wide">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                {currentMonth === 8 && currentYear === 2026 && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-2xs">
                    Current Period
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  id="btn-cal-prev-month"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 active:scale-95"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="btn-cal-next-month"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 active:scale-95"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-black text-slate-300 mb-2.5 uppercase tracking-wider font-mono">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Day Slots - 3D Hyper-Tactile Playing-Card Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((dayObj, index) => {
                if (!dayObj.isCurrentMonth) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[72px] sm:min-h-[86px] rounded-xl bg-slate-900/30 dark:bg-zinc-950/40 border border-dashed border-slate-800/60"
                    />
                  );
                }

                const isSelected = selectedDateIso === dayObj.dateIso;
                const hasApproaching = dayObj.programsOnDay.some(
                  p => getProgramStatus(p.date) === 'approaching'
                );
                const hasExpired = dayObj.programsOnDay.some(
                  p => getProgramStatus(p.date) === 'expired'
                );
                const hasUpcoming = dayObj.programsOnDay.some(
                  p => getProgramStatus(p.date) === 'upcoming'
                );
                const isUserInterestedBlock = dayObj.hasInterestedProgram;

                return (
                  <div
                    key={dayObj.dateIso}
                    id={`calendar-day-${dayObj.dateIso}`}
                    onClick={() => {
                      setSelectedDateIso(dayObj.dateIso);
                      setDayInspectorDate(dayObj.dateIso);
                    }}
                    className={`min-h-[72px] sm:min-h-[86px] p-2 rounded-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 duration-150 ${
                      /* 3D SURFACE BEZEL PHYSICS & HIGHLIGHT COLORING */
                      isUserInterestedBlock
                        ? 'bg-emerald-600 text-white border-x border-emerald-400/60 border-t-2 border-t-white/40 border-b-4 border-b-emerald-950 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] font-bold'
                        : hasApproaching
                        ? 'bg-red-600 text-white border-x border-red-400/60 border-t-2 border-t-white/40 border-b-4 border-b-red-950 ring-2 ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] font-bold'
                        : isSelected
                        ? 'bg-indigo-700 text-white border-x border-indigo-400/60 border-t-2 border-t-white/40 border-b-4 border-b-indigo-950 ring-2 ring-indigo-400 shadow-[0_0_18px_rgba(99,102,241,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] font-bold'
                        : dayObj.isToday
                        ? 'bg-slate-800 dark:bg-zinc-900 border-x border-amber-500/60 border-t-2 border-t-amber-300/40 border-b-4 border-b-slate-950 ring-1 ring-amber-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_10px_rgba(0,0,0,0.5)]'
                        : 'bg-slate-800/90 dark:bg-zinc-900/90 hover:bg-slate-750 dark:hover:bg-zinc-800 border-x border-slate-700/80 border-t-2 border-white/20 border-b-4 border-slate-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_10px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {/* Day number & Today marker with FORCED High-Brightness Ice White Contrast */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-extrabold tracking-tight ${
                          isUserInterestedBlock || hasApproaching || isSelected
                            ? 'text-white flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                            : dayObj.isToday
                            ? 'w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-black shadow-xs'
                            : 'text-white font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                        }`}
                      >
                        {isUserInterestedBlock && <Star className="w-3 h-3 fill-white text-white inline shrink-0 drop-shadow-xs" />}
                        <span>{dayObj.dayNumber}</span>
                      </span>

                      {/* Status indicator pill */}
                      {dayObj.programsOnDay.length > 0 && (
                        <div className="flex items-center gap-0.5">
                          {isUserInterestedBlock ? (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-950/90 text-white font-black uppercase tracking-wider border border-white/70 shadow-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                              title="Contains your Selected/Interested Event"
                            >
                              ★ STARRED
                            </span>
                          ) : hasApproaching ? (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] bg-red-950/90 text-white font-black uppercase tracking-wider border border-white/70 shadow-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] animate-urgent-pulse-breathe"
                              title="Approaching program on this date"
                            >
                              APPROACHING
                            </span>
                          ) : (
                            <>
                              {hasExpired && (
                                <span 
                                  className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/60 shadow-xs" 
                                  title="Concluded program" 
                                />
                              )}
                              {hasUpcoming && (
                                <span 
                                  className="w-2.5 h-2.5 rounded-full bg-teal-400 border border-white/60 shadow-xs" 
                                  title="Upcoming program" 
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mini event tags with Glowing High-Contrast Pure White Typography */}
                    <div className="flex flex-col gap-1 overflow-hidden mt-1">
                      {dayObj.programsOnDay.slice(0, 2).map(p => {
                        const status = getProgramStatus(p.date);
                        const isInterestedThis = interestedProgramIds.includes(p.id);

                        return (
                          <div
                            key={p.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProgram(p);
                            }}
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded truncate shadow-2xs ${
                              isUserInterestedBlock
                                ? 'bg-emerald-950/90 text-white border border-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                                : hasApproaching || status === 'approaching'
                                ? 'bg-red-950/90 text-white border border-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                                : status === 'expired'
                                ? 'bg-red-900/90 text-white border border-red-400'
                                : 'bg-slate-900/90 text-white font-bold border border-slate-600'
                            }`}
                          >
                            {isInterestedThis ? '⭐ ' : ''}{p.name}
                          </div>
                        );
                      })}
                      {dayObj.programsOnDay.length > 2 && (
                        <span className="text-[8px] font-black text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          +{dayObj.programsOnDay.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Sidebar (4 cols on lg) - 3D Glass Surface */}
          <div 
            className="lg:col-span-4 bg-slate-900/90 dark:bg-zinc-950/90 backdrop-blur-xl p-5 border-2 border-indigo-500/40 rounded-[20px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800 mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-600 dark:text-cyan-300 uppercase tracking-wider">
                    Selected Date Schedule
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                    <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>{selectedDateIso ? formatFriendlyDate(selectedDateIso) : 'Select a date'}</span>
                  </h4>
                </div>
                {selectedDateIso === TODAY_ISO && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 font-black border border-amber-300 dark:border-amber-700 shadow-2xs">
                    Today
                  </span>
                )}
              </div>

              {selectedDayPrograms.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No programs scheduled on this date.</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Click any highlighted date or select a program from the feed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>Total Programs Scheduled Today: {selectedDayPrograms.length}</span>
                  </div>

                  {selectedDayPrograms.map(prog => {
                    const status = getProgramStatus(prog.date);
                    const isInterestedProg = interestedProgramIds.includes(prog.id);

                    return (
                      <div
                        key={prog.id}
                        onClick={() => onSelectProgram(prog)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                          isInterestedProg
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400'
                            : 'bg-slate-50/90 dark:bg-slate-800/80 hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border-slate-200 dark:border-slate-700 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {status === 'approaching' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
                                <span className="w-1.5 h-1.5 rounded-full animate-blink-red" />
                                Approaching
                              </span>
                            ) : status === 'expired' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                                Concluded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                Scheduled
                              </span>
                            )}

                            {isInterestedProg && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                                <span>Interested</span>
                              </span>
                            )}
                          </div>

                          {/* Mode tag */}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {prog.mode}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 font-serif">
                          {prog.name}
                        </h5>

                        <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{prog.time || '10:00 AM - 04:00 PM EST'}</span>
                          </div>
                          <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:underline flex items-center gap-0.5">
                            Inspect ›
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick legend footer */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 mt-4 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Solid Emerald Block: User Selected / Starred item</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-blink-red shrink-0" />
                <span className="font-semibold text-rose-700 dark:text-rose-300">Blinking Red: Imminent deadline / Event in ≤ 3 days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Solid Red: Concluded program</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-serif">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Chronological Event Progression</span>
          </h3>

          <div className="relative pl-6 border-l-2 border-sky-200 dark:border-sky-800 space-y-6">
            {[...programs]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(prog => {
                const status = getProgramStatus(prog.date);
                const isInterested = interestedProgramIds.includes(prog.id);

                return (
                  <div 
                    key={prog.id}
                    onClick={() => onSelectProgram(prog)}
                    className="relative group cursor-pointer"
                  >
                    {/* Timeline Node Dot */}
                    <div 
                      className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs transition-transform group-hover:scale-125 ${
                        isInterested
                          ? 'bg-emerald-500 ring-2 ring-emerald-300'
                          : status === 'approaching'
                          ? 'animate-blink-red'
                          : status === 'expired'
                          ? 'bg-red-600'
                          : 'bg-teal-500'
                      }`}
                    />

                    {/* Timeline card */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isInterested
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/90 dark:bg-slate-800/90 group-hover:bg-sky-50/70 dark:group-hover:bg-sky-950/50 border-slate-200 dark:border-slate-700 group-hover:border-sky-300'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                            {formatFriendlyDate(prog.date)} ({prog.dayOfWeek})
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            status === 'approaching'
                              ? 'bg-red-100 text-red-700'
                              : status === 'expired'
                              ? 'bg-red-500 text-white'
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {status === 'approaching' ? 'Approaching Soon' : status === 'expired' ? 'Concluded' : 'Upcoming'}
                          </span>
                          {isInterested && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ⭐ In My Works
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-serif">
                          {prog.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>{prog.location}</span>
                          <span>•</span>
                          <span>{prog.time || '10:00 AM - 04:00 PM EST'}</span>
                        </div>
                      </div>

                      {/* Mode switch */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMode(prog.id, prog.mode);
                        }}
                        className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {prog.mode}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE DAY-BOX CLICK LISTENER POPUP MODAL          */}
      {/* ======================================================== */}
      {dayInspectorDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={() => setDayInspectorDate(null)}>
          <div 
            id="calendar-day-popup"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-white/90 dark:border-slate-700 p-6 space-y-5"
          >
            {/* Header: Date + Calculated Numeric Tally Label */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                    {formatFriendlyDate(dayInspectorDate)}
                  </h3>
                  {/* EXACT TALLY LABEL AS REQUESTED */}
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                    Total Programs Scheduled Today: <span className="font-extrabold text-sky-600 dark:text-sky-400">{dayInspectorPrograms.length}</span>
                  </p>
                </div>
              </div>

              <button
                id="btn-close-day-popup"
                onClick={() => setDayInspectorDate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body: Clean, clickable vertical directory of all program titles happening on that day */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {dayInspectorPrograms.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    No academic programs scheduled on this specific date.
                  </p>
                </div>
              ) : (
                dayInspectorPrograms.map(prog => {
                  const status = getProgramStatus(prog.date);
                  const isInterestedProg = interestedProgramIds.includes(prog.id);

                  return (
                    <div
                      key={prog.id}
                      id={`day-inspector-item-${prog.id}`}
                      onClick={() => {
                        setDayInspectorDate(null);
                        onSelectProgram(prog);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 group shadow-sm hover:shadow-md ${
                        isInterestedProg
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 hover:border-emerald-500'
                          : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            status === 'approaching'
                              ? 'bg-red-100 text-red-700'
                              : status === 'expired'
                              ? 'bg-red-500 text-white'
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {status === 'approaching' ? 'Approaching Soon' : status === 'expired' ? 'Concluded' : 'Scheduled'}
                          </span>

                          {isInterestedProg && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                              <span>Interested</span>
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          {prog.mode === 'Online' ? <Globe className="w-3.5 h-3.5 text-sky-500" /> : <Building2 className="w-3.5 h-3.5 text-amber-500" />}
                          <span>{prog.mode}</span>
                        </span>
                      </div>

                      {/* Program Title */}
                      <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                        {prog.name}
                      </h4>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{prog.location}</span>
                        </div>
                        <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:underline flex items-center gap-1 text-xs">
                          <span>Inspect Full Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
