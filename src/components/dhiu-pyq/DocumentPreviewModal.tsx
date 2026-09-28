import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Check, 
  Folder,
  FolderOpen,
  Sparkles,
  Award,
  ChevronDown
} from 'lucide-react';
import { DhiuQuestionPaper, DhiuSubjectName } from '../../types';
import { generateExamQuestions, generateVivaExamQuestions } from '../../data/dhiuPyqData';
import { getCustomPyqPapers } from '../../utils/pyqStorage';

interface DocumentPreviewModalProps {
  paper: DhiuQuestionPaper;
  onClose: () => void;
  onDownload: (paper: DhiuQuestionPaper) => void;
  onShare: (paper: DhiuQuestionPaper) => void;
}

type DropdownTarget = 'class' | 'semester' | 'subject' | 'year' | 'section' | null;

// Choice Datasets
const CLASS_OPTIONS = [
  { id: 1, name: 'Class 1', level: 'Junior Basic' },
  { id: 2, name: 'Class 2', level: 'Junior Basic' },
  { id: 3, name: 'Class 3', level: 'Upper Primary' },
  { id: 4, name: 'Class 4', level: 'Upper Primary' },
  { id: 5, name: 'Class 5', level: 'Secondary' },
  { id: 6, name: 'Class 6', level: 'Secondary' },
  { id: 7, name: 'Class 7', level: 'Senior Secondary' },
  { id: 8, name: 'Class 8', level: 'Senior Secondary' },
  { id: 9, name: 'Class 9', level: 'Degree Prep' },
  { id: 10, name: 'Class 10', level: 'Graduation Board' },
];

const SEMESTER_OPTIONS = [
  { id: 1, name: 'Semester 1', term: 'Term 1', desc: 'Half-Yearly Examination Board' },
  { id: 2, name: 'Semester 2', term: 'Term 2', desc: 'Annual Promotional Board' },
];

const CORE_SUBJECTS: { name: DhiuSubjectName; code: string; category: string }[] = [
  { name: 'Adab', code: 'ADB-101', category: 'Linguistic Studies' },
  { name: 'English', code: 'ENG-102', category: 'General Academics' },
  { name: 'Fiqh', code: 'FQH-103', category: 'Shari’ah Sciences' },
  { name: 'Hadith', code: 'HDT-104', category: 'Shari’ah Sciences' },
  { name: 'Maths', code: 'MTH-105', category: 'General Academics' },
  { name: 'Nahv', code: 'NHV-106', category: 'Linguistic Studies' },
  { name: 'Science', code: 'SCI-107', category: 'General Academics' },
  { name: 'Swarf', code: 'SWF-108', category: 'Linguistic Studies' },
  { name: 'Tareekh', code: 'TRK-109', category: 'Historical Studies' },
  { name: 'Urdu', code: 'URD-110', category: 'Linguistic Studies' },
  { name: 'Aqeeda', code: 'AQD-100', category: 'Shari’ah Sciences' },
  { name: 'Social Science', code: 'SOC-111', category: 'General Academics' },
  { name: 'Tasawwuf', code: 'TSW-112', category: 'Shari’ah Sciences' },
  { name: 'Viva Voce', code: 'VIV-100', category: 'Oral Assessment' }
];

const CHRONOLOGICAL_YEAR_OPTIONS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
  2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  2006, 2005
];

const SECTION_OPTIONS = [
  { 
    name: 'General Section', 
    sizeKB: 68, 
    desc: 'Standard Central Curriculum Board Examination Sheet',
    badge: 'Core'
  },
  { 
    name: 'Special Board Section', 
    sizeKB: 86, 
    desc: 'Advanced Distinction, Analytical & Research Track Paper',
    badge: 'Advanced'
  },
  { 
    name: 'Oral/Viva Examination Sheet', 
    sizeKB: 75, 
    desc: 'External Viva Voce & Oral Recitation Assessment Rubric',
    badge: 'Oral'
  },
  { 
    name: 'Supplements', 
    sizeKB: 52, 
    desc: 'Supplementary Revision Module & Model Question Sets',
    badge: 'Revision'
  },
];

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  paper,
  onClose,
  onDownload,
  onShare,
}) => {
  const [currentPaper, setCurrentPaper] = useState<DhiuQuestionPaper>(paper);
  const [activeDropdown, setActiveDropdown] = useState<DropdownTarget>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Sync if prop updates externally
  useEffect(() => {
    setCurrentPaper(paper);
  }, [paper]);

  // Handle escape key to close any active dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDropdown) {
          setActiveDropdown(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDropdown, onClose]);

  // Real-time parameter re-injection & view state mutation
  const handleSelectParameter = (updates: Partial<DhiuQuestionPaper>) => {
    const newClassId = updates.classId ?? currentPaper.classId;
    const newSemesterId = updates.semesterId ?? currentPaper.semesterId;
    const newSubject = (updates.subject ?? currentPaper.subject) as DhiuSubjectName;
    const newYear = updates.year ?? currentPaper.year;
    const newSection = updates.section ?? currentPaper.section;

    // Check if custom uploaded paper exists in localStorage matching this exact coordinate
    const customList = getCustomPyqPapers();
    const matchedCustom = customList.find(
      p => p.classId === newClassId && p.semesterId === newSemesterId && p.subject === newSubject && p.year === newYear
    );

    const isViva = newSubject === 'Viva Voce' || newSection === 'Oral/Viva Examination Sheet';
    const baseSize = 65 + (newYear % 25) * 2;
    const sectionSizeOffset = newSection === 'Special Board Section' ? 18 
      : newSection === 'Oral/Viva Examination Sheet' ? 10 
      : newSection === 'Supplements' ? -14 : 0;
    const newFileSize = matchedCustom?.fileSize || `${baseSize + sectionSizeOffset} KB`;

    const examType = isViva 
      ? 'Viva Voce Examination'
      : (newSemesterId === 1 
          ? (newYear % 2 === 0 ? 'Half-Yearly' : 'Model / Pre-Board') 
          : (newYear % 2 === 0 ? 'Annual' : 'Model / Pre-Board'));

    const questions = matchedCustom?.questions || (
      isViva 
        ? generateVivaExamQuestions(newYear)
        : generateExamQuestions(newSubject, newYear, newClassId, newSemesterId)
    );

    const nextPaper: DhiuQuestionPaper = {
      ...currentPaper,
      id: matchedCustom?.id || `dhiu-c${newClassId}-s${newSemesterId}-${String(newSubject).toLowerCase().replace(/\s+/g, '-')}-${newYear}`,
      classId: newClassId,
      semesterId: newSemesterId,
      subject: newSubject,
      year: newYear,
      section: newSection,
      fileSize: newFileSize,
      examType,
      isViva,
      duration: isViva ? '45 Mins / Candidate' : '2.5 Hours',
      maxMarks: 100,
      verified: true,
      questions
    };

    setCurrentPaper(nextPaper);
    setActiveDropdown(null);

    // Trigger visual refresh feedback on the file canvas view
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 280);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    onShare(currentPaper);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDropdown = (target: DropdownTarget) => {
    setActiveDropdown(prev => (prev === target ? null : target));
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) {
          if (activeDropdown) {
            setActiveDropdown(null);
          } else {
            onClose();
          }
        }
      }}
    >
      {/* Invisible backdrop to dismiss any active dropdown when clicking outside */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      <div 
        className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full max-w-none max-h-none rounded-none' 
            : 'w-full max-w-5xl max-h-[92vh]'
        } overflow-visible relative`}
        id="dhiu-pyq-document-preview-modal"
      >
        {/* ======================================================== */}
        {/* TOP META SUMMARY BLOCK                                  */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 rounded-t-3xl">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 
                id="doc-viewer-main-headline"
                className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2"
              >
                <span>{currentPaper.subject} — {currentPaper.year}</span>
                {isRefreshing && (
                  <span className="inline-block w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                )}
              </h2>
              
              {/* Green checkmark pill */}
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>✓ Verified DHIU Examination Paper</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
              Darul Huda Islamic University Examination Board • Central Evaluation Archive
            </p>
          </div>

          {/* Three Clean Horizontal Utility Controls */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
            {/* Control 1: Share */}
            <button
              id="btn-doc-share"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold border border-slate-200 dark:border-zinc-700 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-sky-500" />}
              <span>{copied ? 'Copied Link' : '🔗 Share'}</span>
            </button>

            {/* Control 2: Full Preview Toggle */}
            <button
              id="btn-doc-fullscreen"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold border border-slate-200 dark:border-zinc-700 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>👁️ Full Preview</span>
            </button>

            {/* Control 3: Solid Download PDF Button */}
            <button
              id="btn-doc-download-pdf"
              onClick={() => onDownload(currentPaper)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>📥 Download PDF</span>
            </button>

            {/* Close Modal */}
            <button
              id="btn-doc-close-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-all cursor-pointer ml-1"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPONENT-TO-DROPDOWN TRANSFORMATION (THE 5 META TARGETS) */}
        {/* ======================================================== */}
        <div className="px-4 sm:px-6 py-3 bg-white dark:bg-zinc-900/90 border-b border-slate-100 dark:border-zinc-800 shrink-0 relative z-30 overflow-visible">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 relative">
            
            {/* ---------------------------------------------------- */}
            {/* 1. CLASS LEVEL DROPDOWN TARGET                       */}
            {/* ---------------------------------------------------- */}
            <div className="relative">
              <button
                type="button"
                id="meta-box-class-level"
                onClick={() => toggleDropdown('class')}
                className={`w-full text-left p-2.5 rounded-xl bg-sky-50/90 dark:bg-sky-950/50 border-[1.5px] ${
                  activeDropdown === 'class'
                    ? 'border-sky-500 shadow-md ring-2 ring-sky-400/40'
                    : 'border-sky-300/80 dark:border-sky-700/70 hover:border-sky-400 dark:hover:border-sky-500'
                } flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 tracking-wider truncate">
                      CLASS LEVEL | Class {currentPaper.classId}
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      Class {currentPaper.classId}
                    </div>
                  </div>
                </div>

                {/* Miniature down-arrow glyph indicator (▼) in top-right */}
                <span 
                  className={`text-[10px] font-mono text-sky-600 dark:text-sky-300 shrink-0 self-start mt-0.5 select-none transition-transform duration-200 ${
                    activeDropdown === 'class' ? 'rotate-180 text-sky-500' : 'group-hover:translate-y-0.5'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Localized Floating Glassmorphic Pop-up Dropdown (Class 1 to Class 10) */}
              {activeDropdown === 'class' && (
                <div 
                  id="dropdown-menu-class-level"
                  className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-sky-400 dark:border-sky-500 shadow-2xl shadow-sky-950/30 z-50 p-3 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-sky-500" />
                      <span>CLASS DIRECTORY FOLDERS</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-400">Class 1–10</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto p-0.5">
                    {CLASS_OPTIONS.map(c => {
                      const isSelected = currentPaper.classId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          id={`option-class-${c.id}`}
                          onClick={() => handleSelectParameter({ classId: c.id })}
                          className={`p-2 rounded-xl text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30 ring-1 ring-sky-300'
                              : 'bg-slate-50 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 hover:bg-sky-100/70 dark:hover:bg-zinc-800 hover:text-sky-800 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isSelected ? (
                              <FolderOpen className="w-4 h-4 text-white shrink-0" />
                            ) : (
                              <Folder className="w-4 h-4 text-sky-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{c.name}</div>
                              <div className={`text-[10px] truncate ${isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                                {c.level}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* 2. SEMESTER DROPDOWN TARGET                          */}
            {/* ---------------------------------------------------- */}
            <div className="relative">
              <button
                type="button"
                id="meta-box-semester"
                onClick={() => toggleDropdown('semester')}
                className={`w-full text-left p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/50 border-[1.5px] ${
                  activeDropdown === 'semester'
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                    : 'border-emerald-300/80 dark:border-emerald-700/70 hover:border-emerald-400 dark:hover:border-emerald-500'
                } flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider truncate">
                      SEMESTER | Semester {currentPaper.semesterId}
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      Semester {currentPaper.semesterId}
                    </div>
                  </div>
                </div>

                {/* Miniature down-arrow glyph indicator (▼) in top-right */}
                <span 
                  className={`text-[10px] font-mono text-emerald-600 dark:text-emerald-300 shrink-0 self-start mt-0.5 select-none transition-transform duration-200 ${
                    activeDropdown === 'semester' ? 'rotate-180 text-emerald-500' : 'group-hover:translate-y-0.5'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Localized Floating Glassmorphic Pop-up Dropdown (Semester 1 & 2) */}
              {activeDropdown === 'semester' && (
                <div 
                  id="dropdown-menu-semester"
                  className="absolute left-0 sm:left-auto md:left-0 top-full mt-2 w-72 rounded-2xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-emerald-400 dark:border-emerald-500 shadow-2xl shadow-emerald-950/30 z-50 p-3 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ACADEMIC SEMESTER TERMS</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-400">2 Terms</span>
                  </div>

                  {/* Two clear rectangular rows */}
                  <div className="space-y-2 p-0.5">
                    {SEMESTER_OPTIONS.map(s => {
                      const isSelected = currentPaper.semesterId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          id={`option-semester-${s.id}`}
                          onClick={() => handleSelectParameter({ semesterId: s.id })}
                          className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 ring-1 ring-emerald-300'
                              : 'bg-slate-50 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 hover:bg-emerald-100/70 dark:hover:bg-zinc-800 hover:text-emerald-800 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs font-extrabold flex items-center gap-2">
                              <span>{s.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              }`}>
                                {s.term}
                              </span>
                            </div>
                            <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                              {s.desc}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* 3. SUBJECT DROPDOWN TARGET                           */}
            {/* ---------------------------------------------------- */}
            <div className="relative">
              <button
                type="button"
                id="meta-box-subject"
                onClick={() => toggleDropdown('subject')}
                className={`w-full text-left p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/50 border-[1.5px] ${
                  activeDropdown === 'subject'
                    ? 'border-amber-500 shadow-md ring-2 ring-amber-400/40'
                    : 'border-amber-300/80 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500'
                } flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider truncate">
                      SUBJECT | {currentPaper.subject}
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {currentPaper.subject}
                    </div>
                  </div>
                </div>

                {/* Miniature down-arrow glyph indicator (▼) in top-right */}
                <span 
                  className={`text-[10px] font-mono text-amber-600 dark:text-amber-300 shrink-0 self-start mt-0.5 select-none transition-transform duration-200 ${
                    activeDropdown === 'subject' ? 'rotate-180 text-amber-500' : 'group-hover:translate-y-0.5'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Localized Floating Glassmorphic Pop-up Dropdown (Core Syllabus Subjects) */}
              {activeDropdown === 'subject' && (
                <div 
                  id="dropdown-menu-subject"
                  className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-amber-400 dark:border-amber-500 shadow-2xl shadow-amber-950/30 z-50 p-3 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span>CORE ACADEMIC SYLLABUS SUBJECTS</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-400">10 Core</span>
                  </div>

                  {/* Clean multi-column matrix */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto p-0.5">
                    {CORE_SUBJECTS.map(subj => {
                      const isSelected = currentPaper.subject === subj.name;
                      return (
                        <button
                          key={subj.name}
                          type="button"
                          id={`option-subject-${subj.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => handleSelectParameter({ subject: subj.name })}
                          className={`p-2 rounded-xl text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30 ring-1 ring-amber-300'
                              : 'bg-slate-50 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 hover:bg-amber-100/70 dark:hover:bg-zinc-800 hover:text-amber-800 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate flex items-center gap-1">
                              <span>{subj.name}</span>
                            </div>
                            <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-amber-100' : 'text-slate-400 dark:text-zinc-400'}`}>
                              {subj.code}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* 4. EXAM YEAR DROPDOWN TARGET                         */}
            {/* ---------------------------------------------------- */}
            <div className="relative">
              <button
                type="button"
                id="meta-box-exam-year"
                onClick={() => toggleDropdown('year')}
                className={`w-full text-left p-2.5 rounded-xl bg-purple-50/90 dark:bg-purple-950/50 border-[1.5px] ${
                  activeDropdown === 'year'
                    ? 'border-purple-500 shadow-md ring-2 ring-purple-400/40'
                    : 'border-purple-300/80 dark:border-purple-700/70 hover:border-purple-400 dark:hover:border-purple-500'
                } flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider truncate">
                      EXAM YEAR | {currentPaper.year}
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {currentPaper.year}
                    </div>
                  </div>
                </div>

                {/* Miniature down-arrow glyph indicator (▼) in top-right */}
                <span 
                  className={`text-[10px] font-mono text-purple-600 dark:text-purple-300 shrink-0 self-start mt-0.5 select-none transition-transform duration-200 ${
                    activeDropdown === 'year' ? 'rotate-180 text-purple-500' : 'group-hover:translate-y-0.5'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Localized Floating Glassmorphic Pop-up Dropdown (2005 to 2026 Chronological List) */}
              {activeDropdown === 'year' && (
                <div 
                  id="dropdown-menu-exam-year"
                  className="absolute left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-purple-400 dark:border-purple-500 shadow-2xl shadow-purple-950/30 z-50 p-3 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      <span>CHRONOLOGICAL EXAM YEARS</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-400">2005 – 2026</span>
                  </div>

                  {/* Scrollable chronological grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-60 overflow-y-auto p-0.5">
                    {CHRONOLOGICAL_YEAR_OPTIONS.map(yr => {
                      const isSelected = currentPaper.year === yr;
                      return (
                        <button
                          key={yr}
                          type="button"
                          id={`option-year-${yr}`}
                          onClick={() => handleSelectParameter({ year: yr })}
                          className={`py-2 px-1.5 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-300'
                              : 'bg-slate-50 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 hover:bg-purple-100/70 dark:hover:bg-zinc-800 hover:text-purple-800 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800'
                          }`}
                        >
                          <span>{yr}</span>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* 5. SECTION & SIZE DROPDOWN TARGET                    */}
            {/* ---------------------------------------------------- */}
            <div className="relative col-span-2 sm:col-span-1">
              <button
                type="button"
                id="meta-box-section-size"
                onClick={() => toggleDropdown('section')}
                className={`w-full text-left p-2.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border-[1.5px] ${
                  activeDropdown === 'section'
                    ? 'border-rose-500 shadow-md ring-2 ring-rose-400/40'
                    : 'border-rose-300/80 dark:border-rose-700/70 hover:border-rose-400 dark:hover:border-rose-500'
                } flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer group active:scale-[0.98]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 tracking-wider truncate">
                      SECTION &amp; SIZE | {currentPaper.section} • {currentPaper.fileSize}
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {currentPaper.section} • {currentPaper.fileSize}
                    </div>
                  </div>
                </div>

                {/* Miniature down-arrow glyph indicator (▼) in top-right */}
                <span 
                  className={`text-[10px] font-mono text-rose-600 dark:text-rose-300 shrink-0 self-start mt-0.5 select-none transition-transform duration-200 ${
                    activeDropdown === 'section' ? 'rotate-180 text-rose-500' : 'group-hover:translate-y-0.5'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Localized Floating Glassmorphic Pop-up Dropdown (Section & Size Options) */}
              {activeDropdown === 'section' && (
                <div 
                  id="dropdown-menu-section-size"
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-rose-400 dark:border-rose-500 shadow-2xl shadow-rose-950/30 z-50 p-3 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-rose-500" />
                      <span>SECTION &amp; ARCHIVE SPECIFICATIONS</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-400">4 Types</span>
                  </div>

                  {/* Clean selection array */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto p-0.5">
                    {SECTION_OPTIONS.map(sec => {
                      const isSelected = currentPaper.section === sec.name;
                      return (
                        <button
                          key={sec.name}
                          type="button"
                          id={`option-section-${sec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          onClick={() => handleSelectParameter({ section: sec.name })}
                          className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30 ring-1 ring-rose-300'
                              : 'bg-slate-50 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 hover:bg-rose-100/70 dark:hover:bg-zinc-800 hover:text-rose-800 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="text-xs font-bold flex items-center gap-2">
                              <span>{sec.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                isSelected ? 'bg-rose-700 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                              }`}>
                                {sec.badge}
                              </span>
                            </div>
                            <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-rose-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                              {sec.desc}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE CONTROLS BAR (ZOOM & PRINT TOOLBAR)          */}
        {/* ======================================================== */}
        <div className="px-6 py-2 bg-slate-100/90 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-zinc-300">Document Canvas:</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[11px] font-mono text-slate-800 dark:text-zinc-200">
              Page 1 of 2
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:inline font-mono">
              Max Marks: {currentPaper.maxMarks} • Time: {currentPaper.duration} • {currentPaper.section}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Out */}
            <button
              id="btn-doc-zoom-out"
              onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs w-12 text-center font-bold text-slate-800 dark:text-zinc-200">
              {zoomLevel}%
            </span>
            {/* Zoom In */}
            <button
              id="btn-doc-zoom-in"
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />
            {/* Print */}
            <button
              id="btn-doc-print"
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer font-medium"
              title="Print question sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LIVE DIRECT PDF DOCUMENT VIEWER CANVAS                   */}
        {/* ======================================================== */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-slate-200/70 dark:bg-zinc-950 flex justify-center items-start">
          <div 
            ref={printAreaRef}
            id="pdf-document-print-canvas"
            key={`${currentPaper.id}-${currentPaper.year}-${currentPaper.subject}-${currentPaper.section}`}
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-in-out'
            }}
            className={`w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded-xl p-8 sm:p-12 border-2 border-slate-300/80 min-h-[950px] relative font-serif transition-opacity duration-200 ${
              isRefreshing ? 'opacity-60 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
          >
            {/* Traditional DHIU Watermark Emblem Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden select-none">
              <span className="text-[140px] font-bold font-arabic-quote text-center">جامعة دار الهدى</span>
            </div>

            {/* Official Board Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 space-y-1">
              <p className="text-sm font-arabic-quote font-bold text-slate-700 tracking-wider">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-950 font-serif">
                DARUL HUDA ISLAMIC UNIVERSITY
              </h1>
              <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-700 uppercase font-sans">
                EXAMINATION BOARD • CENTRAL ACADEMIC COUNCIL
              </h2>
              <div className="inline-block px-4 py-0.5 mt-1 border border-slate-900 rounded text-xs font-bold uppercase tracking-wider font-sans bg-slate-50">
                {currentPaper.examType.toUpperCase()} — {currentPaper.year} ({currentPaper.section.toUpperCase()})
              </div>
            </div>

            {/* Exam Meta Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans border-b border-slate-800 pb-3 mb-6 font-semibold">
              <div>
                <span className="text-slate-500">CLASS:</span> <span className="text-slate-950 font-bold">Class {currentPaper.classId}</span>
              </div>
              <div>
                <span className="text-slate-500">SEMESTER:</span> <span className="text-slate-950 font-bold">Semester {currentPaper.semesterId}</span>
              </div>
              <div>
                <span className="text-slate-500">TIME:</span> <span className="text-slate-950 font-bold">{currentPaper.duration}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">MAX MARKS:</span> <span className="text-slate-950 font-black">{currentPaper.maxMarks}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-slate-500">SUBJECT:</span> <span className="text-slate-950 font-extrabold text-sm uppercase">{currentPaper.subject}</span>
              </div>
              <div className="col-span-2 text-right pt-1">
                <span className="text-slate-500">CANDIDATE ROLL NO:</span> <span className="inline-block w-28 border-b border-dotted border-slate-800 ml-1"></span>
              </div>
            </div>

            {/* General Instructions */}
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-sans text-slate-700 space-y-1">
              <p className="font-bold text-slate-900 uppercase">General Instructions to Candidates:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Write your register number and exam center details clearly in the designated boxes.</li>
                <li>All questions in Section A and Section B are compulsory unless specified otherwise.</li>
                <li>Write your answers in clear, legible handwriting in the appropriate language format.</li>
                <li>Section designation: {currentPaper.section}. File catalog index: {currentPaper.id}.</li>
              </ul>
            </div>

            {/* Question Paper Content Sections */}
            <div className="space-y-8 font-sans">
              {currentPaper.questions?.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  {/* Section Title Header */}
                  <div className="border-b border-slate-400 pb-1 flex justify-between items-baseline">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                      {sec.sectionTitle}
                    </h3>
                  </div>
                  
                  <p className="text-xs italic text-slate-600 font-serif">
                    {sec.instructions}
                  </p>

                  {/* Question Items */}
                  <div className="space-y-3 pl-1">
                    {sec.items.map((item) => (
                      <div key={item.qNum} className="flex gap-2.5 items-start justify-between text-xs sm:text-sm">
                        <div className="flex gap-2 items-start flex-1">
                          <span className="font-bold text-slate-900 shrink-0 w-6 font-mono">{item.qNum}.</span>
                          <div className="space-y-1.5 flex-1">
                            <p className="text-slate-900 leading-relaxed font-normal">
                              {item.text}
                            </p>
                            
                            {item.arabicText && (
                              <p 
                                dir="rtl"
                                className="text-sm font-arabic-quote font-medium text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 text-right leading-loose"
                              >
                                {item.arabicText}
                              </p>
                            )}

                            {item.options && (
                              <div className="grid grid-cols-2 gap-2 pt-1 pl-2">
                                {item.options.map((opt, oIdx) => (
                                  <span key={oIdx} className="text-xs text-slate-800 font-mono">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="shrink-0 font-bold text-slate-900 font-mono text-xs pl-3">
                          [{item.marks}]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Official Seal / Signature Line Footer */}
            <div className="mt-12 pt-6 border-t border-slate-400 flex justify-between items-end text-[10px] font-sans text-slate-500 uppercase">
              <div>
                <span>DHIU-EXAM-BOARD-{currentPaper.year}-{currentPaper.subject.toUpperCase().slice(0, 3)}</span>
                <p>CONFIDENTIAL &amp; ARCHIVED • {currentPaper.fileSize}</p>
              </div>
              <div className="text-center">
                <div className="w-24 border-b border-slate-800 mb-1"></div>
                <span>CONTROLLER OF EXAMINATIONS</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 shrink-0 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Digital Repository Authenticated • Darul Huda Islamic University</span>
          </div>

          <button
            id="btn-doc-footer-close"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};

