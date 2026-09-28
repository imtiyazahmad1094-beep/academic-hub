import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Award, 
  UserCheck, 
  Sparkles, 
  BookOpen, 
  Layers, 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  BookMarked,
  ArrowRight,
  Globe,
  Building2,
  Calendar
} from 'lucide-react';
import { AcademicAbstract } from '../types';
import { TranslationDict } from '../utils/translations';
import { getWordCount } from '../utils/academicUtils';

interface AbstractsSectionProps {
  abstracts: AcademicAbstract[];
  onAddAbstract: (abs: AcademicAbstract) => void;
  onUpdateAbstract?: (abs: AcademicAbstract) => void;
  t: TranslationDict;
}

// Utility to categorize an abstract into "Islamic Topics" or "Simple Topics"
export const getThematicCategory = (abs: AcademicAbstract): 'Islamic Topics' | 'Simple Topics' => {
  if (abs.thematicCategory) return abs.thematicCategory;
  const trackLower = (abs.topicTrack || '').toLowerCase();
  const titleLower = (abs.title || '').toLowerCase();
  if (
    trackLower.includes('islamic') || 
    trackLower.includes('fiqh') || 
    trackLower.includes('shariah') || 
    trackLower.includes('ethics') ||
    titleLower.includes('shariah') ||
    titleLower.includes('maqasid') ||
    titleLower.includes('fatwa') ||
    titleLower.includes('waqf')
  ) {
    return 'Islamic Topics';
  }
  return 'Simple Topics';
};

// Utility to map lifecycle status into "Working" or "Done"
export const getLifecycleStatus = (abs: AcademicAbstract): 'Working' | 'Done' => {
  if (abs.lifecycleStatus) return abs.lifecycleStatus;
  if (abs.status === 'Accepted') return 'Done';
  return 'Working';
};

export const AbstractsSection: React.FC<AbstractsSectionProps> = ({
  abstracts,
  onAddAbstract,
  onUpdateAbstract,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [activeAbstractModal, setActiveAbstractModal] = useState<AcademicAbstract | null>(null);
  const [isDraftingModalOpen, setIsDraftingModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Abstract Draft Form State
  const [title, setTitle] = useState('');
  const [primaryAuthor, setPrimaryAuthor] = useState('');
  const [coAuthors, setCoAuthors] = useState('');
  const [institution, setInstitution] = useState('');
  const [thematicArea, setThematicArea] = useState<'Islamic Topics' | 'Simple Topics'>('Islamic Topics');
  const [topicTrack, setTopicTrack] = useState('Fiqh');
  const [mode, setMode] = useState<'Online' | 'Offline' | 'Hybrid'>('Online');
  const [format, setFormat] = useState<'Oral Presentation' | 'Poster Session' | 'Keynote Paper' | 'Symposium Lecture'>('Oral Presentation');
  const [abstractText, setAbstractText] = useState('');
  const [maxWords, setMaxWords] = useState(250);
  const [keywords, setKeywords] = useState('');

  const currentWords = getWordCount(abstractText);
  const isWordLimitExceeded = currentWords > maxWords;

  // Extract distinct tracks for filter dropdown
  const allTracks = Array.from(new Set(abstracts.map(a => a.topicTrack).filter(Boolean)));

  // Filter logic
  const filtered = abstracts.filter(item => {
    const thematicCat = getThematicCategory(item);
    const lifecycle = getLifecycleStatus(item);

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topicTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      thematicCat.toLowerCase().includes(searchQuery.toLowerCase());

    // Status matching
    let matchesStatus = true;
    if (selectedStatus === 'working') {
      matchesStatus = lifecycle === 'Working';
    } else if (selectedStatus === 'done') {
      matchesStatus = lifecycle === 'Done';
    } else if (selectedStatus !== 'all') {
      matchesStatus = item.status === selectedStatus || lifecycle.toLowerCase() === selectedStatus.toLowerCase();
    }

    // Track matching
    let matchesTrack = true;
    if (selectedTrack === 'theme:Islamic Topics') {
      matchesTrack = thematicCat === 'Islamic Topics';
    } else if (selectedTrack === 'theme:Simple Topics') {
      matchesTrack = thematicCat === 'Simple Topics';
    } else if (selectedTrack !== 'all') {
      matchesTrack = item.topicTrack === selectedTrack;
    }

    return matchesSearch && matchesStatus && matchesTrack;
  });

  const handleCopy = (abs: AcademicAbstract) => {
    const textToCopy = `${abs.title}\n${abs.primaryAuthor} • ${abs.institution}\nTopic: ${abs.topicTrack} (${getThematicCategory(abs)})\nFormat: ${abs.mode || 'Online'} - ${abs.format || 'Oral Presentation'}\n\nAbstract:\n${abs.abstractText}\n\nKeywords: ${abs.keywords?.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(abs.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (abs: AcademicAbstract) => {
    const content = `=====================================================
ACADEMIC ABSTRACT DOSSIER
=====================================================
Title: ${abs.title}
Author: ${abs.primaryAuthor}
Institution: ${abs.institution}
Thematic Area: ${getThematicCategory(abs)}
Track: ${abs.topicTrack}
Format: ${abs.mode || 'Online'} • ${abs.format || 'Oral Presentation'}
Lifecycle Status: ${getLifecycleStatus(abs)}
Review Status: ${abs.status}
Word Count: ${abs.wordCount} / ${abs.maxWords} words

ABSTRACT:
${abs.abstractText}

KEYWORDS:
${abs.keywords?.join(', ')}

ASSIGNED REVIEWERS:
${abs.assignedReviewers?.join(', ') || 'Pending Assignment'}
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${abs.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}_abstract.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleLifecycleInModal = (abs: AcademicAbstract) => {
    const currentLifecycle = getLifecycleStatus(abs);
    const newLifecycle: 'Working' | 'Done' = currentLifecycle === 'Working' ? 'Done' : 'Working';
    const updated: AcademicAbstract = {
      ...abs,
      lifecycleStatus: newLifecycle,
      status: newLifecycle === 'Done' ? 'Accepted' : 'Under Review',
    };
    setActiveAbstractModal(updated);
    if (onUpdateAbstract) {
      onUpdateAbstract(updated);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstractText.trim()) return;

    const newAbs: AcademicAbstract = {
      id: `abs-${Date.now()}`,
      title: title.trim(),
      primaryAuthor: primaryAuthor.trim() || 'Principal Investigator',
      coAuthors: coAuthors ? coAuthors.split(',').map(s => s.trim()).filter(Boolean) : [],
      institution: institution.trim() || 'Academic Research Center',
      thematicCategory: thematicArea,
      topicTrack: topicTrack.trim() || (thematicArea === 'Islamic Topics' ? 'Fiqh' : 'Adaptive Tutoring'),
      mode,
      format,
      lifecycleStatus: 'Working',
      abstractText: abstractText.trim(),
      wordCount: getWordCount(abstractText),
      maxWords,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      assignedReviewers: ['Dr. Clara Beauchamp', 'Prof. Kenji Takahashi'],
      keywords: keywords ? keywords.split(',').map(s => s.trim()).filter(Boolean) : ['Academic', 'Research']
    };

    onAddAbstract(newAbs);
    setIsDraftingModalOpen(false);

    // Reset Form
    setTitle('');
    setPrimaryAuthor('');
    setCoAuthors('');
    setInstitution('');
    setAbstractText('');
    setKeywords('');
  };

  return (
    <div id="abstracts-management-portal" className="space-y-6 animate-fade-in">
      {/* ======================================================== */}
      {/* 1. HEADER & FILTER CONTROLS SECTION                      */}
      {/* ======================================================== */}
      <div 
        className="section-box-glass section-box-abstracts p-6 sm:p-7 relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Emerald Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 
                data-i18n="titleAbstracts"
                className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight neon-glow-green"
              >
                {t.titleAbstracts || 'Abstracts'}
              </h2>
            </div>
            {/* Subtitle directly below title */}
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans font-normal max-w-2xl">
              Curate peer submissions, track reviewer assignments, and maintain strict word limits with integrated keywords and thematic tags.
            </p>
          </div>

          {/* Prominent dark solid action button reading "+ Submit Abstract" */}
          <button
            id="btn-submit-abstract"
            onClick={() => setIsDraftingModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all duration-200 active:scale-95 shrink-0 self-start sm:self-auto"
            style={{ borderRadius: '12px' }}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Submit Abstract</span>
          </button>
        </div>

        {/* Filter Bar: Single, perfectly aligned horizontal row of search & filter inputs */}
        <div 
          id="abstracts-filter-bar"
          className="mt-5 p-2 sm:p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)] flex flex-col md:flex-row items-stretch md:items-center gap-2.5"
          style={{ borderRadius: '12px' }}
        >
          {/* Wide search input with magnifying glass icon */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-abstracts"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search abstracts, titles, authors, keywords..."
              className="w-full pl-10 pr-9 py-2 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none transition-all shadow-[0_0_8px_rgba(16,185,129,0.06)]"
              style={{ borderRadius: '10px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clean dropdown menu for statuses: "All Statuses" */}
          <div className="w-full md:w-44 shrink-0">
            <select
              id="select-status-filter"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer outline-none"
              style={{ borderRadius: '10px' }}
            >
              <option value="all">All Statuses</option>
              <option value="working">Working</option>
              <option value="done">Done</option>
              <option value="Accepted">Accepted</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Revision Requested">Revision Requested</option>
            </select>
          </div>

          {/* Clean dropdown menu for topic tracks: "All Topic Tracks" */}
          <div className="w-full md:w-56 shrink-0">
            <select
              id="select-track-filter"
              value={selectedTrack}
              onChange={e => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer outline-none"
              style={{ borderRadius: '10px' }}
            >
              <option value="all">All Topic Tracks</option>
              <optgroup label="Thematic Curriculum Areas">
                <option value="theme:Islamic Topics">Islamic Topics</option>
                <option value="theme:Simple Topics">Simple Topics</option>
              </optgroup>
              <optgroup label="Specific Tracks">
                {allTracks.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. GRID CARD LAYOUT & STRUCTURE (MULTI-COLUMN GRID)      */}
      {/* ======================================================== */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-[12px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching abstracts found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search criteria, switching track filters, or submitting a new abstract to the symposium repository.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedTrack('all');
            }}
            className="px-4 py-2 rounded-[10px] bg-slate-900 dark:bg-sky-500 text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div 
          id="abstracts-grid-container"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map(abs => {
            const thematicCategory = getThematicCategory(abs);
            const lifecycle = getLifecycleStatus(abs);
            const isDone = lifecycle === 'Done';
            const modeFormatText = `${abs.mode || 'Online'} • ${abs.format || 'Oral Presentation'}`;

            return (
              <div
                key={abs.id}
                id={`abstract-card-${abs.id}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveAbstractModal(abs)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveAbstractModal(abs);
                  }
                }}
                className="section-box-glass p-5 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_22px_rgba(16,185,129,0.25)] transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden text-left outline-none"
                style={{ borderRadius: '12px' }}
              >
                {/* Top Section */}
                <div>
                  {/* Status & Meta Row + Topic Categorization Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    {/* Status & Format row at top-left */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Color-coded badges indicating work lifecycle:
                          soft yellow badge for "Working", soft green badge for "Done" */}
                      {isDone ? (
                        <span 
                          id={`badge-status-${abs.id}`}
                          data-i18n="labelDone"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{t.labelDone || 'Done'}</span>
                        </span>
                      ) : (
                        <span 
                          id={`badge-status-${abs.id}`}
                          data-i18n="labelWorking"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{t.labelWorking || 'Working'}</span>
                        </span>
                      )}

                      {/* Clear mode/format pill tag next to status */}
                      <span 
                        id={`badge-mode-format-${abs.id}`}
                        className="inline-flex items-center text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 truncate max-w-[170px]"
                        title={modeFormatText}
                      >
                        {modeFormatText}
                      </span>
                    </div>

                    {/* Topic Categorization Badge: prominently positioned at top
                        dividing curriculum into "Islamic Topics" or "Simple Topics" */}
                    {thematicCategory === 'Islamic Topics' ? (
                      <span 
                        id={`badge-thematic-${abs.id}`}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 shrink-0"
                      >
                        <BookMarked className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Islamic Topics</span>
                      </span>
                    ) : (
                      <span 
                        id={`badge-thematic-${abs.id}`}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50/90 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300/80 dark:border-indigo-800 shrink-0"
                      >
                        <Layers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Simple Topics</span>
                      </span>
                    )}
                  </div>

                  {/* Abstract Title: Rendered in large, bold charcoal serif typography */}
                  <h3 
                    id={`abstract-title-${abs.id}`}
                    className="font-serif font-bold text-slate-800 dark:text-slate-100 text-lg sm:text-[19px] leading-snug tracking-tight mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2"
                  >
                    {abs.title}
                  </h3>

                  {/* Author & Institution Line */}
                  <p 
                    id={`abstract-meta-${abs.id}`}
                    className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium flex items-center gap-1.5 truncate mb-3"
                    title={`${abs.primaryAuthor} • ${abs.institution}`}
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                      {abs.primaryAuthor}
                    </span>
                    <span className="text-slate-400 select-none">&bull;</span>
                    <span className="truncate">
                      {abs.institution}
                    </span>
                  </p>

                  {/* Integrated Keyword Chips */}
                  {abs.keywords && abs.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {abs.keywords.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[10px] font-medium"
                        >
                          #{kw}
                        </span>
                      ))}
                      {abs.keywords.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">+{abs.keywords.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Links */}
                <div className="pt-3.5 border-t border-emerald-500/20 flex items-center justify-between text-xs mt-auto">
                  {/* Word count fraction progress metric */}
                  <div className="flex items-center gap-2">
                    <span 
                      id={`abstract-word-count-${abs.id}`}
                      className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {abs.wordCount} / {abs.maxWords}w
                    </span>
                    {/* Micro progress bar */}
                    <div className="w-12 h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700 overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full rounded-full ${
                          abs.wordCount > abs.maxWords 
                            ? 'bg-red-500' 
                            : isDone 
                              ? 'bg-emerald-500' 
                              : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((abs.wordCount / abs.maxWords) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleCopy(abs)}
                      className="p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                      title="Copy Abstract to clipboard"
                    >
                      {copiedId === abs.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Clean, minimal text link reading "View →" */}
                    <span 
                      id={`link-view-${abs.id}`}
                      onClick={() => setActiveAbstractModal(abs)}
                      className="font-bold text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <span className="text-sm font-sans">&rarr;</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. INTERACTIVE POP-UP MODAL (ABSTRACT REVIEW INSPECTION) */}
      {/* ======================================================== */}
      {activeAbstractModal && (
        <div 
          id="abstract-popup-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveAbstractModal(null)}
        >
          <div 
            id="abstract-inspector-popup"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[16px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-white dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scale-in"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Thematic Category */}
                  {getThematicCategory(activeAbstractModal) === 'Islamic Topics' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                      <BookMarked className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                      <span>Islamic Topics</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                      <Layers className="w-3 h-3 text-sky-700 dark:text-sky-400" />
                      <span>Simple Topics</span>
                    </span>
                  )}

                  {/* Sub-track */}
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Track: {activeAbstractModal.topicTrack}
                  </span>

                  {/* Operational Lifecycle Badge */}
                  {getLifecycleStatus(activeAbstractModal) === 'Done' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Done</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Working</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                id="btn-close-abstract-modal"
                onClick={() => setActiveAbstractModal(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 dark:text-slate-200">
              {/* Title in large Serif */}
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
                {activeAbstractModal.title}
              </h2>

              {/* Author & Institution Dossier */}
              <div className="p-4 rounded-[12px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-sans font-semibold">Primary Author:</span>
                  <span>{activeAbstractModal.primaryAuthor}</span>
                </div>

                {activeAbstractModal.coAuthors && activeAbstractModal.coAuthors.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-sans font-semibold">Co-Authors:</span>
                    <span>{activeAbstractModal.coAuthors.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-sans font-semibold">Institution:</span>
                  <span>{activeAbstractModal.institution}</span>
                </div>

                <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Format: <strong className="text-slate-700 dark:text-slate-200">{activeAbstractModal.mode || 'Online'} • {activeAbstractModal.format || 'Oral Presentation'}</strong></span>
                  <span>Submitted: <strong className="text-slate-700 dark:text-slate-200">{activeAbstractModal.submittedDate}</strong></span>
                </div>
              </div>

              {/* Word Count Progress Bar & Metrics */}
              <div className="p-3.5 rounded-[12px] bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Abstract Length Metric:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-800 dark:text-sky-300">
                    {activeAbstractModal.wordCount} / {activeAbstractModal.maxWords} words
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ({Math.round((activeAbstractModal.wordCount / activeAbstractModal.maxWords) * 100)}% of quota)
                  </span>
                </div>
              </div>

              {/* Full Abstract Body (Presented here in full detail) */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Full Abstract Dossier</span>
                </h4>
                <div className="p-4 sm:p-5 rounded-[12px] bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal shadow-xs whitespace-pre-line">
                  {activeAbstractModal.abstractText}
                </div>
              </div>

              {/* Keywords */}
              {activeAbstractModal.keywords && activeAbstractModal.keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Research Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAbstractModal.keywords.map((kw, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 rounded-[8px] text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Reviewers & Score */}
              {activeAbstractModal.assignedReviewers && activeAbstractModal.assignedReviewers.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Assigned Reviewers
                    </h4>
                    {activeAbstractModal.reviewerScore && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>Peer Score: {activeAbstractModal.reviewerScore.toFixed(1)} / 5.0</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeAbstractModal.assignedReviewers.map((rev, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{rev}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Toggle Lifecycle Status button */}
                <button
                  onClick={() => handleToggleLifecycleInModal(activeAbstractModal)}
                  className="px-3 py-2 rounded-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  {getLifecycleStatus(activeAbstractModal) === 'Done' ? 'Set as Working' : 'Mark as Done'}
                </button>

                {/* Copy Text */}
                <button
                  onClick={() => handleCopy(activeAbstractModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  {copiedId === activeAbstractModal.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === activeAbstractModal.id ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Download Dossier */}
                <button
                  onClick={() => handleDownload(activeAbstractModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <button
                onClick={() => setActiveAbstractModal(null)}
                className="px-5 py-2 rounded-[10px] bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUBMIT ABSTRACT MODAL                                 */}
      {/* ======================================================== */}
      {isDraftingModalOpen && (
        <div 
          id="submit-abstract-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={() => setIsDraftingModalOpen(false)}
        >
          <div 
            id="draft-abstract-modal"
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[16px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-white dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit New Abstract</h3>
              </div>
              <button
                onClick={() => setIsDraftingModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDraft} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-200">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Abstract Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Maqasid al-Shariah as a Lens for AI Governance"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-sky-500/20"
                  />
                </div>

                {/* Thematic Area & Topic Track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Thematic Curriculum Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={thematicArea}
                      onChange={e => {
                        const newCat = e.target.value as 'Islamic Topics' | 'Simple Topics';
                        setThematicArea(newCat);
                        setTopicTrack(newCat === 'Islamic Topics' ? 'Fiqh' : 'Adaptive Tutoring');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="Islamic Topics">Islamic Topics (Fiqh, AI Ethics)</option>
                      <option value="Simple Topics">Simple Topics (Science, Engineering, EdTech)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Topic Track <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={topicTrack}
                      onChange={e => setTopicTrack(e.target.value)}
                      placeholder={thematicArea === 'Islamic Topics' ? 'e.g. Fiqh, AI Ethics' : 'e.g. Quantum ML, Tandem Solar Cells'}
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Primary Author & Co-Authors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Primary Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryAuthor}
                      onChange={e => setPrimaryAuthor(e.target.value)}
                      placeholder="e.g. Dr. Tariq Al-Mansoor"
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Research Institution / Center <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      placeholder="e.g. Centre for Digital Fiqh & AI Governance"
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Mode & Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Presentation Mode
                    </label>
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value as 'Online' | 'Offline' | 'Hybrid')}
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Format Type
                    </label>
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="Oral Presentation">Oral Presentation</option>
                      <option value="Keynote Paper">Keynote Paper</option>
                      <option value="Poster Session">Poster Session</option>
                      <option value="Symposium Lecture">Symposium Lecture</option>
                    </select>
                  </div>
                </div>

                {/* Co-Authors */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Co-Authors (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    value={coAuthors}
                    onChange={e => setCoAuthors(e.target.value)}
                    placeholder="Prof. Elena Rostova, Dr. Zayd Qureshi"
                    className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                {/* Abstract Text */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Abstract Content <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs font-mono font-bold ${
                      isWordLimitExceeded ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {currentWords} / {maxWords} words
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    value={abstractText}
                    onChange={e => setAbstractText(e.target.value)}
                    placeholder="State foundational thesis, methodology, empirical findings, and academic significance..."
                    className={`w-full p-3 rounded-[10px] bg-white dark:bg-slate-800 border ${
                      isWordLimitExceeded 
                        ? 'border-red-400 ring-2 ring-red-200' 
                        : 'border-slate-200 dark:border-slate-700'
                    } text-xs sm:text-sm leading-relaxed outline-none`}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    placeholder="Maqasid al-Shariah, AI Governance, Algorithmic Ethics"
                    className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsDraftingModalOpen(false)}
                  className="px-4 py-2 rounded-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isWordLimitExceeded || !title.trim()}
                  className="px-5 py-2.5 rounded-[10px] bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                >
                  Submit Abstract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
