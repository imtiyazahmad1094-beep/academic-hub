import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Calendar as CalendarIcon, 
  Globe, 
  Building2, 
  Clock, 
  FileText, 
  ChevronRight, 
  Trash2, 
  Edit3,
  Share2,
  Link2
} from 'lucide-react';
import { AcademicProgram, ProgramMode, ProgramStatus } from '../types';
import { 
  getProgramStatus, 
  formatFriendlyDate, 
  getWordCount 
} from '../utils/academicUtils';
import { TranslationDict } from '../utils/translations';

interface ProgramsListViewProps {
  programs: AcademicProgram[];
  onSelectProgram: (program: AcademicProgram) => void;
  onToggleMode: (programId: string, currentMode: ProgramMode) => void;
  onEditProgram: (program: AcademicProgram) => void;
  onDeleteProgram: (programId: string) => void;
  onOpenShare?: (url?: string, title?: string) => void;
  onOpenSubmitLink?: () => void;
  t?: TranslationDict;
}

export const ProgramsListView: React.FC<ProgramsListViewProps> = ({
  programs,
  onSelectProgram,
  onEditProgram,
  onDeleteProgram,
  onOpenShare,
  onOpenSubmitLink,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'Online' | 'Offline'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProgramStatus>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Collect all unique themes
  const allThemes = useMemo(() => {
    const themeSet = new Set<string>();
    programs.forEach(p => p.themes.forEach(t => themeSet.add(t)));
    return Array.from(themeSet).sort();
  }, [programs]);

  // Filter and sort chronologically
  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchAbstract = p.abstract.toLowerCase().includes(q);
          const matchLocation = p.location.toLowerCase().includes(q);
          const matchTheme = p.themes.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchAbstract && !matchLocation && !matchTheme) {
            return false;
          }
        }

        // Mode filter
        if (modeFilter !== 'all' && p.mode !== modeFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          const status = getProgramStatus(p.date);
          if (status !== statusFilter) {
            return false;
          }
        }

        // Theme filter
        if (selectedTheme !== 'all' && !p.themes.includes(selectedTheme)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
  }, [programs, searchQuery, modeFilter, statusFilter, selectedTheme, sortOrder]);

  // Helper to highlight search query matches in red glowing text, or fallback to keyword highlights
  const renderHighlightedTitle = (title: string) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      if (regex.test(title)) {
        const parts = title.split(regex);
        return parts.map((part, i) => {
          if (part.toLowerCase() === q.toLowerCase()) {
            return (
              <span 
                key={i} 
                className="text-red-600 dark:text-red-400 font-extrabold drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] bg-red-100/90 dark:bg-red-950/80 px-1 py-0.5 rounded border border-red-400/80 dark:border-red-600/80"
              >
                {part}
              </span>
            );
          }
          return part;
        });
      }
    }

    const keywordsToHighlight = ['Jurisprudence', 'Quantum', 'Bioethics', 'Pedagogy', 'Photovoltaics', 'Robotics', 'Linguistics', 'Neuroscience', 'Oceanography', 'Optics'];
    
    // Check if title contains any of the keywords
    for (const kw of keywordsToHighlight) {
      if (title.includes(kw)) {
        const parts = title.split(new RegExp(`(${kw})`, 'gi'));
        return parts.map((part, i) => {
          if (part.toLowerCase() === kw.toLowerCase()) {
            return (
              <span key={i} className="relative inline-block px-1 z-0">
                <span className="relative z-10">{part}</span>
                <span className="absolute inset-x-0 bottom-0.5 top-1 bg-amber-200/60 dark:bg-amber-400/25 -rotate-0.5 rounded-[3px] -z-1" />
              </span>
            );
          }
          return part;
        });
      }
    }
    return title;
  };

  return (
    <div className="w-full mb-12" id="section-master-list">
      
      {/* Title & Subtitle Card */}
      <div 
        className="section-box-glass section-box-programs p-6 mb-4 relative overflow-hidden"
        style={{ borderRadius: '16px' }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            {/* Title & Badge Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 
                id="header-academic-programs-title"
                data-i18n="titleRegister"
                className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight"
              >
                Academic Programs
              </h2>

              {/* Programs Counter Badge */}
              <span 
                id="badge-programs-counter"
                className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 shadow-2xs"
              >
                {filteredPrograms.length} {filteredPrograms.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>

            {/* Stacked Subtitle & Inspiring Arabic Quote and Micro-description */}
            <div className="space-y-1 pt-0.5">
              <p 
                dir="rtl"
                className="text-xs sm:text-sm font-arabic-quote text-zinc-600 dark:text-zinc-300 tracking-wide font-normal"
              >
                طَلَبُ العِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ، وَحُسْنُ تَدْبِيرِهِ أَسَاسُ النَّجَاحِ
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Vertical event log feed organized chronologically by date with side-by-side venue locations.
              </p>
            </div>
          </div>

          {/* Right Actions: Submit Link & Sorting Controller Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-start shrink-0">
            {onOpenSubmitLink && (
              <button
                id="btn-programs-submit-link"
                type="button"
                onClick={onOpenSubmitLink}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 hover:shadow-lg transition-all cursor-pointer border border-cyan-400/30 dark:border-cyan-400/50 active:scale-95"
                title="Ingest external web reference into active directory"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>🔗 Submit Link</span>
              </button>
            )}

            <button
              id="btn-sort-chronological"
              type="button"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>↑↓ Date: {sortOrder === 'asc' ? 'Earliest First' : 'Latest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar: Single, cohesive, perfectly spaced grid bar */}
      <div 
        className="section-box-glass section-box-programs p-3 sm:p-4 my-4"
        style={{ borderRadius: '16px' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
          
          {/* Search input field with magnifying glass */}
          <div className="sm:col-span-2 md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-programs"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, topic, venue..."
              className="w-full pl-9 pr-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-2xs"
            />
          </div>

          {/* Minimalist tab group for modes */}
          <div className="sm:col-span-2 md:col-span-3 flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs">
            <button
              id="filter-mode-all"
              type="button"
              onClick={() => setModeFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                modeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs dark:bg-indigo-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Modes
            </button>
            <button
              id="filter-mode-online"
              type="button"
              onClick={() => setModeFilter('Online')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                modeFilter === 'Online'
                  ? 'bg-slate-900 text-white shadow-2xs dark:bg-indigo-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Online
            </button>
            <button
              id="filter-mode-offline"
              type="button"
              onClick={() => setModeFilter('Offline')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                modeFilter === 'Offline'
                  ? 'bg-slate-900 text-white shadow-2xs dark:bg-indigo-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Offline
            </button>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2 sm:col-span-1">
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-2xs"
            >
              <option value="all">Status: All Programs</option>
              <option value="approaching">Approaching Soon</option>
              <option value="upcoming">Scheduled</option>
              <option value="expired">Concluded</option>
            </select>
          </div>

          {/* Theme Dropdown */}
          <div className="md:col-span-3 sm:col-span-1">
            <select
              id="filter-theme-select"
              value={selectedTheme}
              onChange={e => setSelectedTheme(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer truncate focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-2xs"
            >
              <option value="all">Theme: All Disciplines</option>
              {allThemes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Program List Rows */}
      {filteredPrograms.length === 0 ? (
        <div 
          className="section-box-glass section-box-programs p-12 text-center"
          style={{ borderRadius: '12px' }}
        >
          <CalendarIcon className="w-10 h-10 mx-auto text-slate-400 mb-2.5" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No Academic Programs Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or reset the filters above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrograms.map(prog => {
            const status = getProgramStatus(prog.date);
            const wordCount = getWordCount(prog.abstract);
            const maxWords = prog.maxAbstractWords || 300;
            const isSearchMatch = Boolean(
              searchQuery.trim() && (
                prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prog.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prog.themes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            );

            return (
              <div
                key={prog.id}
                id={`program-row-${prog.id}`}
                onClick={() => onSelectProgram(prog)}
                className={`group relative section-box-glass bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer select-none ${
                  isSearchMatch
                    ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] dark:border-red-500 ring-2 ring-red-400/20'
                    : 'border border-slate-400/40 shadow-[0_0_15px_rgba(71,85,105,0.12)] hover:shadow-[0_0_22px_rgba(71,85,105,0.22)]'
                }`}
                style={{ borderRadius: '12px' }}
              >
                {/* Unified Full-Width Content Block */}
                <div className="flex flex-col gap-2.5">
                  
                  {/* Status & Meta Row (Top-Left) and Action Group (Top-Right) */}
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Top-Left: Solid bright red pill badge, icon-supported date, icon-supported format */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      {/* Urgency Status Badge */}
                      {status === 'approaching' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-2xs animate-urgent-pulse-breathe">
                          Approaching Soon
                        </span>
                      ) : status === 'expired' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-600 text-white text-[11px] font-bold shadow-2xs">
                          Concluded
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-2xs">
                          Scheduled
                        </span>
                      )}

                      {/* Icon-supported date: 📅 Sep 20, 2026 • Sunday */}
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatFriendlyDate(prog.date)}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-slate-500 dark:text-slate-400">{prog.dayOfWeek}</span>
                      </span>

                      {/* Icon-supported format label: 🌐 Online or 🏢 Offline */}
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        {prog.mode === 'Online' ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Offline</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Action Group (Top Right): sleek pen, trash can, share, and Expand Details › link */}
                    <div className="flex items-center gap-2.5 shrink-0" onClick={e => e.stopPropagation()}>
                      {onOpenShare && (
                        <button
                          id={`btn-row-share-${prog.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenShare(
                              prog.registrationUrl || (typeof window !== 'undefined' ? `${window.location.origin}/programs#${prog.id}` : 'https://academic-hub.edu/share/program'),
                              prog.name
                            );
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          title="Share link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        id={`btn-row-edit-${prog.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProgram(prog);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Edit program"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-row-delete-${prog.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProgram(prog.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-row-expand-${prog.id}`}
                        onClick={() => onSelectProgram(prog)}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-0.5 cursor-pointer ml-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                      >
                        <span>Expand Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>

                  {/* Program Title: Large, bold charcoal serif typography with subtle marker highlight */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1e293b] dark:text-white leading-snug tracking-tight">
                    {renderHighlightedTitle(prog.name)}
                  </h3>

                  {/* Streamlined Venue & Time Line (Verbose metadata stripped from master row feed; available in Expand Details modal) */}
                  {prog.location !== 'Geneva Bio-Innovation Hub, Hall B, Switzerland' && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prog.location}</span>
                      </span>

                      {prog.time && prog.time !== '10:00 AM - 06:00 PM CET' && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{prog.time}</span>
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Footer Tags & Metrics: Clean streamlined pill tags & Word Count progress */}
                  <div className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {/* Topic Tags (Stripped of deep thematic sub-tags to reduce row weight; full tags in modal) */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                      {prog.themes
                        .filter(t => !['Chemosynthetic Ecosystems', 'Abyssal Geochemistry', 'Submersible ROVs'].includes(t))
                        .slice(0, 3)
                        .map((theme, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700"
                          >
                            {theme}
                          </span>
                        ))}
                    </div>

                    {/* Word Count Metric */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{wordCount}/{maxWords} words</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
