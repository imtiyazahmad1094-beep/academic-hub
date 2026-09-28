import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  ChevronDown, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ArrowLeft, 
  FolderOpen, 
  Award, 
  Check, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Layers,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CLASS_DIRECTORY,
  ClassDirectoryItem,
  SEMESTER_OPTIONS,
  SUBJECT_OPTIONS,
  YEAR_OPTIONS,
  SECTION_SIZE_OPTIONS,
  getVivaExamDataset,
  CertifiedExamDataset
} from './vivaVoceData';

interface VivaVoceExamArchivePortalProps {
  onBack?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VivaVoceExamArchivePortal: React.FC<VivaVoceExamArchivePortalProps> = ({
  onBack,
  onShowToast
}) => {
  // =========================================================================
  // 1. TOP FILTER NAVIGATION STATES (DEFAULTS MATCHING EXACT USER RULES)
  // - "CLASS LEVEL | CLASS 1-10" (Default: 'Class 10')
  // - "SEMESTER | SEMESTER 1-3" (Default: 'Semester 3')
  // - "SUBJECT | VIVA VOCE..." (Default: 'Viva Voce')
  // - "EXAM YEAR | 2025" (Default: '2025')
  // - "SECTION & SIZE" (Default: 'Grand Oral Board...')
  // =========================================================================
  const [selectedClassId, setSelectedClassId] = useState<number>(10);
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [selectedSubject, setSelectedSubject] = useState<string>('Viva Voce');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedSectionSize, setSelectedSectionSize] = useState<typeof SECTION_SIZE_OPTIONS[0]>(SECTION_SIZE_OPTIONS[0]);

  // Open/Close Dropdown States for each of the 5 filters
  const [openDropdown, setOpenDropdown] = useState<'class' | 'semester' | 'subject' | 'year' | 'section' | null>(null);

  // Document Viewer States
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchDocQuery, setSearchDocQuery] = useState<string>('');
  const [isFetchingDataset, setIsFetchingDataset] = useState<boolean>(false);

  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Selected Class Object
  const currentClassObj = useMemo(() => {
    return CLASS_DIRECTORY.find(c => c.id === selectedClassId) || CLASS_DIRECTORY[9];
  }, [selectedClassId]);

  // Dynamic Exam Dataset derived from all selected parameters
  const examDataset: CertifiedExamDataset = useMemo(() => {
    return getVivaExamDataset(
      selectedClassId,
      selectedSemester,
      selectedSubject,
      selectedYear,
      selectedSectionSize
    );
  }, [selectedClassId, selectedSemester, selectedSubject, selectedYear, selectedSectionSize]);

  // Handle Dynamic Class Selection with simulated active dataset fetch
  const handleSelectClass = (cls: ClassDirectoryItem) => {
    if (selectedClassId === cls.id) {
      setOpenDropdown(null);
      return;
    }

    setIsFetchingDataset(true);
    setSelectedClassId(cls.id);
    setOpenDropdown(null);
    setCurrentPage(1);

    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.25 }
      });
    } catch (_) {}

    setTimeout(() => {
      setIsFetchingDataset(false);
      if (onShowToast) {
        onShowToast(`Fetched Dataset: ${cls.name} (${cls.category}) — PDF Document Updated`, 'success');
      }
    }, 180);
  };

  // Handle Parameter Updates (Year, Semester, Subject, Section)
  const handleUpdateParameter = (
    type: 'semester' | 'subject' | 'year' | 'section',
    value: any,
    label: string
  ) => {
    setIsFetchingDataset(true);
    if (type === 'semester') setSelectedSemester(value);
    if (type === 'subject') setSelectedSubject(value);
    if (type === 'year') setSelectedYear(value);
    if (type === 'section') setSelectedSectionSize(value);

    setOpenDropdown(null);

    setTimeout(() => {
      setIsFetchingDataset(false);
      if (onShowToast) {
        onShowToast(`Updated: ${label} — Recompiling PDF preview`, 'info');
      }
    }, 150);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  // Print Document Simulation
  const handlePrint = () => {
    if (onShowToast) {
      onShowToast(`Preparing ${currentClassObj.name} ${selectedSubject} (${selectedYear}) for print...`, 'info');
    }
    window.print();
  };

  // Download Document Action
  const handleDownload = () => {
    const filename = `DHIU_${currentClassObj.name.replace(/\s+/g, '')}_Sem${selectedSemester}_${selectedSubject.replace(/\s+/g, '')}_${selectedYear}.txt`;
    let docData = `==========================================================\n` +
      `DARUL HUDA ISLAMIC UNIVERSITY - CENTRAL EXAMINATION BOARD\n` +
      `CENTRAL ACADEMIC COUNCIL • VIVA VOCE ORAL ARCHIVE (${selectedYear})\n` +
      `==========================================================\n\n` +
      `Document ID: ${examDataset.docId}\n` +
      `Class Level: ${examDataset.className} (${examDataset.category})\n` +
      `Evaluation Cycle: Semester ${examDataset.semester}\n` +
      `Subject: ${examDataset.subject}\n` +
      `Exam Year: ${examDataset.year}\n` +
      `Section & Size: ${examDataset.sectionName} (${examDataset.fileSize})\n` +
      `Duration: ${examDataset.duration}\n` +
      `Total Marks: ${examDataset.maxMarks} Marks\n` +
      `Sacred Motto: ${examDataset.arabicVerse}\n\n` +
      `==========================================================\n` +
      `CANDIDATE EXAMINATION INSTRUCTIONS:\n` +
      `==========================================================\n`;

    examDataset.instructions.forEach((ins, idx) => {
      docData += `${idx + 1}. ${ins}\n`;
    });

    docData += `\n==========================================================\n` +
      `${examDataset.part1.title.toUpperCase()} [${examDataset.part1.marksTotal} MARKS]\n` +
      `==========================================================\n\n`;
    examDataset.part1.questions.forEach(q => {
      docData += `${q.qNum}: ${q.title} [${q.marks} Marks]\n${q.prompt}\n\n`;
    });

    docData += `==========================================================\n` +
      `${examDataset.part2.title.toUpperCase()} [${examDataset.part2.marksTotal} MARKS]\n` +
      `==========================================================\n\n`;
    examDataset.part2.questions.forEach(q => {
      docData += `${q.qNum}: ${q.title} [${q.marks} Marks]\n${q.prompt}\n\n`;
    });

    docData += `==========================================================\n` +
      `${examDataset.part3.title.toUpperCase()} [${examDataset.part3.marksTotal} MARKS]\n` +
      `==========================================================\n\n`;
    examDataset.part3.questions.forEach(q => {
      docData += `${q.qNum}: ${q.title} [${q.marks} Marks]\n${q.prompt}\n\n`;
    });

    docData += `==========================================================\n` +
      `TRIBUNAL ADJUDICATORS & JURY PANEL:\n` +
      `==========================================================\n`;
    examDataset.tribunalJury.forEach(j => {
      docData += `• ${j.name} (${j.role}) — Max Marks: ${j.maxMarks} | Awarded: ${j.awardedMarks}\n`;
    });

    docData += `\n© Darul Huda Islamic University Examination Board. Certified Archive.`;

    const blob = new Blob([docData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast(`Downloaded: ${filename} (${selectedSectionSize.size})`, 'success');
    }
  };

  return (
    <div 
      id="viva-voce-exam-archive-portal-root"
      className="w-full space-y-6 sm:space-y-8 animate-fade-in text-slate-900 dark:text-slate-100 select-text"
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB CONTEXT                       */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-2 border-purple-500/40 dark:border-purple-500/30 shadow-xl shadow-purple-950/20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              id="btn-back-from-viva-archive"
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
                  Viva Voce — {selectedYear} Exam Archive Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Certified Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Official Examination Repository • Central Academic Council Digital Registry
              </p>
            </div>
          </div>
        </div>

        {/* Live Active Context Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-purple-50 dark:bg-zinc-800/80 px-4 py-2 rounded-2xl border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active: {currentClassObj.name} • Sem {selectedSemester} • {selectedSubject} • {selectedYear}</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP FILTER NAVIGATION BAR (5 FILTERING BUTTONS)       */}
      {/* ======================================================== */}
      <div className="relative z-40" ref={filterBarRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* -------------------------------------------------------- */}
          {/* BUTTON 1: "CLASS LEVEL | CLASS 1-10" (Default: Class 10) */}
          {/* -------------------------------------------------------- */}
          <div className="relative">
            <button
              id="filter-btn-class-level"
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'class' ? null : 'class')}
              className={`w-full p-4 rounded-2xl backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 text-left cursor-pointer shadow-lg space-y-1.5 group ${
                openDropdown === 'class'
                  ? 'bg-purple-600 text-white border-x-2 border-purple-400 ring-2 ring-purple-400'
                  : 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-x border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-80">
                  CLASS LEVEL
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60">
                  CLASS 1-10
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base sm:text-lg font-bold font-serif tracking-wide truncate">
                  {currentClassObj.name}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${openDropdown === 'class' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* ======================================================== */}
            {/* FLOATING SCROLLABLE "CLASS DIRECTORY FOLDERS" PANEL      */}
            {/* UI Constraint: Fixed max height (max-h-80 or 320px)      */}
            {/* with overflow-y: auto for smooth scrolling               */}
            {/* ======================================================== */}
            {openDropdown === 'class' && (
              <div 
                id="panel-class-directory-folders"
                className="absolute z-50 top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-2 border-purple-500 shadow-2xl shadow-purple-950/90 overflow-hidden animate-smooth-entry text-left"
              >
                {/* Header */}
                <div className="p-3.5 bg-gradient-to-r from-purple-900/80 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                      CLASS DIRECTORY FOLDERS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Scroll 1 – 10 ↓
                  </span>
                </div>

                {/* Scrollable Container with exact max-h-80 (320px) and overflow-y: auto */}
                <div 
                  className="max-h-80 overflow-y-auto p-3 space-y-2.5 custom-scrollbar"
                  style={{ maxHeight: '320px' }}
                >
                  {CLASS_DIRECTORY.map(cls => {
                    const isSelected = selectedClassId === cls.id;
                    return (
                      <div
                        key={cls.id}
                        id={`class-directory-item-${cls.id}`}
                        onClick={() => handleSelectClass(cls)}
                        className={`p-3 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group/card ${
                          isSelected
                            ? 'bg-purple-900/70 border border-purple-400 text-white shadow-md'
                            : 'bg-zinc-900/80 hover:bg-zinc-850/90 text-zinc-200 border border-zinc-800 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                            isSelected 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-zinc-800 text-zinc-300 group-hover/card:bg-purple-950 group-hover/card:text-purple-300'
                          }`}>
                            {cls.id}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white group-hover/card:text-purple-300 transition-colors">
                                {cls.name}
                              </span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${cls.badgeColor}`}>
                                {cls.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5 max-w-[200px]">
                              {cls.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center">
                          {isSelected ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-sm">
                              ✓
                            </span>
                          ) : (
                            <span className="text-zinc-600 group-hover/card:text-purple-400 text-xs font-bold transition-colors">
                              Select →
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Indicator showing scroll capability */}
                <div className="p-2.5 bg-zinc-900/90 border-t border-zinc-800 text-center text-[10px] text-zinc-400 font-mono">
                  Showing 10 Certified Classes • Click any card to switch preview
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- */}
          {/* BUTTON 2: "SEMESTER | SEMESTER 1-3" (Default: Sem 3)     */}
          {/* -------------------------------------------------------- */}
          <div className="relative">
            <button
              id="filter-btn-semester"
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'semester' ? null : 'semester')}
              className={`w-full p-4 rounded-2xl backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 text-left cursor-pointer shadow-lg space-y-1.5 group ${
                openDropdown === 'semester'
                  ? 'bg-sky-600 text-white border-x-2 border-sky-400 ring-2 ring-sky-400'
                  : 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-x border-sky-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-80">
                  SEMESTER
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-300 border border-sky-700/60">
                  SEMESTER 1-3
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base sm:text-lg font-bold font-serif tracking-wide truncate">
                  Semester {selectedSemester}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${openDropdown === 'semester' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openDropdown === 'semester' && (
              <div className="absolute z-50 top-full left-0 mt-2 w-72 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-2 border-sky-500 shadow-2xl p-2.5 space-y-1.5 animate-smooth-entry text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-1 border-b border-zinc-800">
                  Select Evaluation Cycle
                </div>
                {SEMESTER_OPTIONS.map(sem => (
                  <button
                    key={sem.id}
                    type="button"
                    onClick={() => handleUpdateParameter('semester', sem.id, sem.label)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedSemester === sem.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-zinc-200 hover:bg-sky-950/70 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{sem.label}</div>
                      <div className="text-[10px] opacity-70 font-normal">{sem.description}</div>
                    </div>
                    {selectedSemester === sem.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- */}
          {/* BUTTON 3: "SUBJECT | VIVA VOCE..." (Default: Viva Voce)   */}
          {/* -------------------------------------------------------- */}
          <div className="relative">
            <button
              id="filter-btn-subject"
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'subject' ? null : 'subject')}
              className={`w-full p-4 rounded-2xl backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 text-left cursor-pointer shadow-lg space-y-1.5 group ${
                openDropdown === 'subject'
                  ? 'bg-amber-600 text-white border-x-2 border-amber-400 ring-2 ring-amber-400'
                  : 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-x border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-80">
                  SUBJECT
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  VIVA VOCE...
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base sm:text-lg font-bold font-serif tracking-wide truncate">
                  {selectedSubject}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${openDropdown === 'subject' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openDropdown === 'subject' && (
              <div className="absolute z-50 top-full left-0 mt-2 w-72 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-2 border-amber-500 shadow-2xl p-2.5 max-h-72 overflow-y-auto space-y-1 animate-smooth-entry text-left custom-scrollbar">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-1 border-b border-zinc-800">
                  Oral &amp; Written Disciplines
                </div>
                {SUBJECT_OPTIONS.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleUpdateParameter('subject', sub, sub)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedSubject === sub
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-zinc-200 hover:bg-amber-950/70 hover:text-white'
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubject === sub && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- */}
          {/* BUTTON 4: "EXAM YEAR | 2025" (Default: 2025)             */}
          {/* -------------------------------------------------------- */}
          <div className="relative">
            <button
              id="filter-btn-exam-year"
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
              className={`w-full p-4 rounded-2xl backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 text-left cursor-pointer shadow-lg space-y-1.5 group ${
                openDropdown === 'year'
                  ? 'bg-teal-600 text-white border-x-2 border-teal-400 ring-2 ring-teal-400'
                  : 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-x border-teal-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-80">
                  EXAM YEAR
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-700/60">
                  2025
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base sm:text-lg font-bold font-serif tracking-wide truncate">
                  {selectedYear}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${openDropdown === 'year' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openDropdown === 'year' && (
              <div className="absolute z-50 top-full left-0 mt-2 w-64 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-2 border-teal-500 shadow-2xl p-2.5 space-y-1 animate-smooth-entry text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 px-2 py-1 border-b border-zinc-800">
                  Select Examination Year
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {YEAR_OPTIONS.map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleUpdateParameter('year', yr, `Year ${yr}`)}
                      className={`p-2 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedYear === yr
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-zinc-200 hover:bg-teal-950/70 hover:text-white'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- */}
          {/* BUTTON 5: "SECTION & SIZE" (Default: Grand Oral Board)   */}
          {/* -------------------------------------------------------- */}
          <div className="relative">
            <button
              id="filter-btn-section-size"
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'section' ? null : 'section')}
              className={`w-full p-4 rounded-2xl backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 text-left cursor-pointer shadow-lg space-y-1.5 group ${
                openDropdown === 'section'
                  ? 'bg-fuchsia-600 text-white border-x-2 border-fuchsia-400 ring-2 ring-fuchsia-400'
                  : 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-x border-fuchsia-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-80 truncate">
                  SECTION &amp; SIZE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-700/60">
                  {selectedSectionSize.size}
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-base sm:text-lg font-bold font-serif tracking-wide truncate">
                  {selectedSectionSize.name.endsWith('...') ? selectedSectionSize.name : `${selectedSectionSize.name}...`}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${openDropdown === 'section' ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openDropdown === 'section' && (
              <div className="absolute z-50 top-full right-0 mt-2 w-80 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-2 border-fuchsia-500 shadow-2xl p-2.5 space-y-1.5 animate-smooth-entry text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 px-2 py-1 border-b border-zinc-800">
                  Oral Defense Board Sections
                </div>
                {SECTION_SIZE_OPTIONS.map(sec => (
                  <button
                    key={sec.name}
                    type="button"
                    onClick={() => handleUpdateParameter('section', sec, sec.name)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedSectionSize.name === sec.name
                        ? 'bg-fuchsia-600 text-white shadow-sm'
                        : 'text-zinc-200 hover:bg-fuchsia-950/70 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{sec.name}</div>
                      <div className="text-[10px] opacity-70 font-normal">{sec.panel} • {sec.size}</div>
                    </div>
                    {selectedSectionSize.name === sec.name && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE: SIDE-BY-SIDE SUMMARY & PDF VIEWER     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (4 Cols): Examination Overview & Active Parameters */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Examination Paper Metadata Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-2 border-purple-500/40 shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                BOARD ARCHIVE #{examDataset.docId}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certified Document</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {selectedSubject} — {selectedYear}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {currentClassObj.name} ({currentClassObj.category}) • Semester {selectedSemester}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Duration</span>
                <span className="font-bold text-slate-800 dark:text-white">{examDataset.duration}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Max Marks</span>
                <span className="font-bold text-slate-800 dark:text-white">{examDataset.maxMarks} Marks</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">File Size</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">{examDataset.fileSize}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Classification</span>
                <span className="font-bold text-slate-800 dark:text-white">{examDataset.category}</span>
              </div>
            </div>

            {/* Evaluation Guidelines Box */}
            <div className="p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Central Board Examination Protocol:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                Candidates must exhibit linguistic mastery in classical dialectics, articulate theological proofs, and address spontaneous tribunal inquiries with textual citations.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                id="btn-sidebar-download-paper"
                onClick={handleDownload}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>

              <button
                type="button"
                id="btn-sidebar-print-paper"
                onClick={handlePrint}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold border border-slate-300 dark:border-zinc-700 transition-colors cursor-pointer"
                title="Print question paper"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Class Directory Quick Selector Grid */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 space-y-3 text-left">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
              Quick Class Jump
            </span>
            <div className="grid grid-cols-5 gap-2">
              {CLASS_DIRECTORY.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => handleSelectClass(cls)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer border ${
                    selectedClassId === cls.id
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-purple-50 dark:hover:bg-zinc-750'
                  }`}
                >
                  C{cls.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (8 Cols): Authenticated PDF Document Viewer Panel */}
        <div className="lg:col-span-8 space-y-3" ref={viewerContainerRef}>
          
          {/* Document Viewer Frame Card */}
          <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Top Simulated PDF Viewer Toolbar */}
            <div className="px-4 py-3 bg-zinc-950/95 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
              
              {/* Document Identity */}
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span 
                  className="font-mono text-zinc-200 font-semibold truncate max-w-[200px] sm:max-w-xs" 
                  title={`DHIU_${currentClassObj.name}_${selectedSubject}_${selectedYear}.pdf`}
                >
                  DHIU_{currentClassObj.name.replace(/\s+/g, '')}_Sem{selectedSemester}_{selectedSubject.replace(/\s+/g, '')}_{selectedYear}.pdf
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  PDF 1.7
                </span>
                {isFetchingDataset && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-purple-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Loading...</span>
                  </span>
                )}
              </div>

              {/* PDF Toolbar Controls: Zoom, Print, Download, Page Navigation */}
              <div className="flex items-center gap-2 shrink-0">
                
                {/* Search In Document Input */}
                <div className="hidden sm:flex items-center bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800 text-[11px]">
                  <Search className="w-3 h-3 text-zinc-400 mr-1.5" />
                  <input
                    type="text"
                    value={searchDocQuery}
                    onChange={e => setSearchDocQuery(e.target.value)}
                    placeholder="Search doc..."
                    className="bg-transparent border-none text-zinc-200 placeholder-zinc-500 focus:outline-none w-20 text-[11px]"
                  />
                  {searchDocQuery && (
                    <button 
                      onClick={() => setSearchDocQuery('')}
                      className="text-zinc-500 hover:text-zinc-300 text-[10px] ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-1.5 py-0.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-bold"
                  >
                    ‹
                  </button>
                  <span className="font-mono text-[11px] text-zinc-300">
                    {currentPage} / 2
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, 2))}
                    disabled={currentPage === 2}
                    className="px-1.5 py-0.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-bold"
                  >
                    ›
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    title="Reset to 100%"
                    className="font-mono text-[11px] text-zinc-200 px-1 hover:text-purple-300 cursor-pointer"
                  >
                    {zoomLevel}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Print Trigger */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer transition-colors"
                  title="Print Document"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>

                {/* Download Trigger */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer transition-all active:scale-95"
                  title="Download Authenticated PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>

            </div>

            {/* Authenticated PDF Canvas Preview Area */}
            <div className="p-4 sm:p-8 bg-zinc-950/80 overflow-auto flex justify-center items-start min-h-[620px] max-h-[820px] custom-scrollbar">
              
              {/* Simulated Authentic A4 Sheet */}
              <div 
                id="pdf-document-simulated-sheet"
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className={`w-full max-w-2xl bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 relative select-text text-left my-2 transition-opacity duration-150 ${
                  isFetchingDataset ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {/* Official Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                  <GraduationCap className="w-96 h-96 text-slate-950" />
                </div>

                {/* Page 1 Content: Header, Meta, Instructions, Part I & Part II */}
                {currentPage === 1 ? (
                  <div className="space-y-6 relative z-10 font-serif">
                    
                    {/* Institutional Header */}
                    <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
                      <div className="text-[11px] font-sans font-bold tracking-widest uppercase text-slate-600">
                        Government &amp; University Recognized Academic Council
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-serif uppercase">
                        Darul Huda Islamic University
                      </h2>
                      <div className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wider">
                        Central Examination Board • Oral Evaluation Registry — {selectedYear}
                      </div>
                      
                      {/* Arabic Sacred Emblem */}
                      <div 
                        dir="rtl" 
                        className="text-lg font-bold text-slate-900 pt-1 font-amiri"
                        style={{ fontFamily: "'Amiri', serif" }}
                      >
                        {examDataset.arabicVerse}
                      </div>
                    </div>

                    {/* Dynamic Metadata Table */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans bg-slate-50 p-3 rounded-lg border border-slate-300">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Level:</span>
                        <span className="font-bold text-slate-900">{examDataset.className} ({examDataset.category})</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Evaluation Cycle:</span>
                        <span className="font-bold text-slate-900">Semester {examDataset.semester}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Discipline:</span>
                        <span className="font-bold text-slate-900">{examDataset.subject}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Time &amp; Marks:</span>
                        <span className="font-bold text-slate-900">{examDataset.duration} • 100M</span>
                      </div>
                    </div>

                    {/* Candidate Examination Directives */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-sans text-amber-950 space-y-1">
                      <span className="font-bold uppercase tracking-wide block text-[11px]">
                        Official Examination Directives:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] leading-relaxed">
                        {examDataset.instructions.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Part I Questions */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
                        <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700">
                          {examDataset.part1.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">[{examDataset.part1.marksTotal} Marks]</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                        {examDataset.part1.questions.map(q => (
                          <div key={q.id} className="space-y-1">
                            <p className="font-bold">
                              {q.qNum}: {q.title}
                            </p>
                            <p className="text-slate-700 pl-3 italic border-l-2 border-slate-300">
                              "{q.prompt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part II Questions */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
                        <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700">
                          {examDataset.part2.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">[{examDataset.part2.marksTotal} Marks]</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                        {examDataset.part2.questions.map(q => (
                          <div key={q.id} className="space-y-1">
                            <p className="font-bold">
                              {q.qNum}: {q.title}
                            </p>
                            <p className="text-slate-700 pl-3 italic border-l-2 border-slate-300">
                              "{q.prompt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Sign-off Bar */}
                    <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[11px] font-sans text-slate-500">
                      <div>
                        <span>Doc ID: {examDataset.docId}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold font-mono">
                        <Check className="w-3.5 h-3.5" />
                        <span>Certified Examination Paper</span>
                      </div>
                      <div>
                        <span>Page 1 of 2</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Page 2 Content: Part III, Adjudication Score Matrix, Signature Blocks */
                  <div className="space-y-6 relative z-10 font-serif">
                    <div className="border-b border-slate-300 pb-3 flex items-center justify-between text-xs font-sans text-slate-600">
                      <span>DARUL HUDA ISLAMIC UNIVERSITY • {selectedYear}</span>
                      <span>PAGE 2 OF 2</span>
                    </div>

                    {/* Part III Questions */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-slate-300 pb-1 flex items-center justify-between">
                        <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700">
                          {examDataset.part3.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">[{examDataset.part3.marksTotal} Marks]</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                        {examDataset.part3.questions.map(q => (
                          <div key={q.id} className="space-y-1">
                            <p className="font-bold">
                              {q.qNum}: {q.title}
                            </p>
                            <p className="text-slate-700 pl-3 italic border-l-2 border-slate-300">
                              "{q.prompt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tribunal Adjudication Score Matrix */}
                    <div className="pt-4">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider block mb-2 text-slate-700">
                        Tribunal Adjudication Score Matrix
                      </span>
                      <table className="w-full text-xs font-sans border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 text-left">
                            <th className="border border-slate-300 p-2">Evaluation Parameter</th>
                            <th className="border border-slate-300 p-2 text-center">Max Marks</th>
                            <th className="border border-slate-300 p-2 text-center">Awarded</th>
                            <th className="border border-slate-300 p-2">Adjudicator Signature</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examDataset.tribunalJury.map((j, i) => (
                            <tr key={i}>
                              <td className="border border-slate-300 p-2">{j.role}</td>
                              <td className="border border-slate-300 p-2 text-center font-mono font-bold">{j.maxMarks}</td>
                              <td className="border border-slate-300 p-2 text-center font-mono">{j.awardedMarks}</td>
                              <td className="border border-slate-300 p-2 font-mono text-[10px]">{j.name}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50 font-bold">
                            <td className="border border-slate-300 p-2">Cumulative Final Score</td>
                            <td className="border border-slate-300 p-2 text-center font-mono text-purple-700">100</td>
                            <td className="border border-slate-300 p-2 text-center font-mono text-emerald-700 font-bold">
                              {examDataset.tribunalJury.reduce((acc, curr) => acc + curr.awardedMarks, 0)}
                            </td>
                            <td className="border border-slate-300 p-2 font-mono text-[10px]">Board Verified Seal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Official University Seal & Signature Blocks */}
                    <div className="pt-8 flex items-end justify-between font-sans text-xs">
                      <div className="space-y-1">
                        <div className="w-24 h-8 border-b-2 border-slate-900" />
                        <div className="text-[10px] text-slate-600 font-bold uppercase">Controller of Examinations</div>
                        <div className="text-[9px] text-slate-400 font-mono">DHIU Academic Registry</div>
                      </div>

                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-600/60 flex items-center justify-center p-2 text-center text-[9px] font-mono text-purple-700 rotate-6 uppercase">
                        <span>Central Board Seal Verified</span>
                      </div>

                      <div className="space-y-1 text-right">
                        <div className="w-24 h-8 border-b-2 border-slate-900 ml-auto" />
                        <div className="text-[10px] text-slate-600 font-bold uppercase">Dean of Academic Council</div>
                        <div className="text-[9px] text-slate-400 font-mono">Certification Date: {selectedYear}</div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
