import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardCheck, 
  ExternalLink, 
  X, 
  Plus, 
  Trash2, 
  School, 
  GraduationCap, 
  Sparkles, 
  ArrowUpRight, 
  Link2, 
  ClipboardPaste, 
  Check,
  Lock,
  CalendarClock,
  UploadCloud,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Layers,
  Copy,
  BookOpen,
  FileText,
  Clock,
  Eye,
  Globe,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export interface CustomAttendanceSection {
  id: string;
  name: string;
  url: string;
}

export type AcademicPathwayBranch = 'Merged Secondary' | 'Senior Secondary' | 'Degree' | 'PG';

export interface PeriodScheduleRecord {
  id: string;
  section: AcademicPathwayBranch;
  stream?: string;
  className?: string;
  year: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileDataUrl?: string;
  createdAt: string;
}

const DEFAULT_CATEGORIES: string[] = [
  'Degree Attendance'
];

const ATTENDANCE_TARGET_URL = 'https://shuhood.vercel.app/student';
// Permanent Field Constraint: firm readonly URL mapping precisely to https://google.com
const PERMANENT_CLEARANCE_URL = 'https://google.com';

const STORAGE_KEY = 'academic_custom_attendance_sections_v2';
const SCHEDULES_STORAGE_KEY = 'academic_period_schedules_v1';

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  // Custom Sections State
  const [customSections, setCustomSections] = useState<CustomAttendanceSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === 'object' && item.name);
        }
      }
    } catch (e) {
      console.error('Error reading custom attendance sections from localStorage:', e);
    }
    return [];
  });

  // Submitted Period Schedules State
  const [savedSchedules, setSavedSchedules] = useState<PeriodScheduleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(SCHEDULES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Period Window State: Trigger area that opens the 4 sections
  const [isPeriodWindowOpen, setIsPeriodWindowOpen] = useState<boolean>(true);
  const [activeBranch, setActiveBranch] = useState<AcademicPathwayBranch>('Merged Secondary');

  // Dynamic Flow Logic: Subject/Stream Selection (Malayalam, Urdu, etc.)
  const [selectedSubjectStream, setSelectedSubjectStream] = useState<string>('Malayalam');
  const [selectedClass, setSelectedClass] = useState<string>('Class 1');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState<boolean>(false);
  const [academicYearInput, setAcademicYearInput] = useState<string>('2026-2027');

  // Degree Timeline Dropdown: strictly "First Year", "Second Year", "Third Year"
  const [selectedDegreeYear, setSelectedDegreeYear] = useState<'First Year' | 'Second Year' | 'Third Year'>('First Year');

  // PG Timeline Dropdown: strictly "First Year", "Second Year"
  const [selectedPgYear, setSelectedPgYear] = useState<'First Year' | 'Second Year'>('First Year');

  // Target Upload Interface (Image or PDF)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string; dataUrl?: string } | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [isEmbedPreviewOpen, setIsEmbedPreviewOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // New Section Custom Prompt Form
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionUrl, setNewSectionUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedClearance, setCopiedClearance] = useState(false);
  const [showRecordedHistory, setShowRecordedHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when custom section prompt opens
  useEffect(() => {
    if (isPromptOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isPromptOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isClassDropdownOpen) {
          setIsClassDropdownOpen(false);
        } else if (isPromptOpen) {
          setIsPromptOpen(false);
          setNewSectionName('');
          setNewSectionUrl('');
          setErrorMsg(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isPromptOpen, isClassDropdownOpen, onClose]);

  // Save custom sections
  const saveCustomSections = (sections: CustomAttendanceSection[]) => {
    setCustomSections(sections);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch (e) {
      console.error('Error saving custom attendance sections:', e);
    }
  };

  // Save schedules
  const saveSchedulesToStorage = (records: PeriodScheduleRecord[]) => {
    setSavedSchedules(records);
    try {
      localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving period schedules:', e);
    }
  };

  const handleCopyClearanceUrl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(PERMANENT_CLEARANCE_URL);
      }
      setCopiedClearance(true);
      if (onShowToast) onShowToast('Attendance Clearance Online URL copied!', 'success');
      setTimeout(() => setCopiedClearance(false), 2000);
    } catch (_) {}
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText && clipText.trim()) {
          setNewSectionUrl(clipText.trim());
          if (onShowToast) onShowToast('Link pasted from clipboard!', 'info');
        }
      }
    } catch {
      if (onShowToast) onShowToast('Please paste using Ctrl+V or Cmd+V.', 'info');
    }
  };

  const handleAddSectionSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newSectionName.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter a valid section name.');
      return;
    }

    const allCurrentNames = [
      ...DEFAULT_CATEGORIES,
      ...customSections.map(s => s.name)
    ];

    if (allCurrentNames.some(n => n.toLowerCase() === trimmedName.toLowerCase())) {
      setErrorMsg(`"${trimmedName}" already exists in the attendance list.`);
      return;
    }

    let finalUrl = newSectionUrl.trim();
    if (!finalUrl) {
      finalUrl = ATTENDANCE_TARGET_URL;
    } else if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const newSection: CustomAttendanceSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      url: finalUrl
    };

    const updated = [...customSections, newSection];
    saveCustomSections(updated);
    setNewSectionName('');
    setNewSectionUrl('');
    setIsPromptOpen(false);
    setErrorMsg(null);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.65 }
      });
    } catch (_) {}

    if (onShowToast) onShowToast(`Created attendance portal "${trimmedName}"`, 'success');
  };

  const handleDeleteCustomSection = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = customSections.filter(s => s.id !== id);
    saveCustomSections(updated);
    if (onShowToast) onShowToast(`Removed section "${name}"`, 'info');
  };

  // Branch Selection Handler
  const handleSelectBranch = (branch: AcademicPathwayBranch) => {
    setActiveBranch(branch);
    setFileUploadError(null);
    setIsClassDropdownOpen(false);
  };

  // File Upload Processing (Image or PDF)
  const processUploadedFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setFileUploadError('Invalid format. Please upload an Image (JPG, PNG, WebP) or PDF file.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileUploadError('File exceeds 20MB maximum allowed upload limit.');
      return;
    }

    setFileUploadError(null);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: isPdf ? 'PDF' : 'IMAGE',
        dataUrl: e.target?.result as string
      });
      if (onShowToast) onShowToast(`Attached "${file.name}" for ${activeBranch}`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Submit Period Schedule
  const handleSubmitPeriodSchedule = () => {
    if (!uploadedFile) {
      setFileUploadError('Please attach an Image or PDF file of your period schedule before submitting.');
      return;
    }

    let finalYear = academicYearInput.trim();
    if (activeBranch === 'Degree') {
      finalYear = selectedDegreeYear;
    } else if (activeBranch === 'PG') {
      finalYear = selectedPgYear;
    } else {
      if (!finalYear) {
        setFileUploadError('Please provide a valid Academic Year (e.g., 2026-2027).');
        return;
      }
    }

    const record: PeriodScheduleRecord = {
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      section: activeBranch,
      stream: (activeBranch === 'Merged Secondary' || activeBranch === 'Senior Secondary') ? selectedSubjectStream : undefined,
      className: (activeBranch === 'Merged Secondary' || activeBranch === 'Senior Secondary') ? selectedClass : undefined,
      year: finalYear,
      fileName: uploadedFile.name,
      fileType: uploadedFile.type,
      fileSize: uploadedFile.size,
      fileDataUrl: uploadedFile.dataUrl,
      createdAt: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [record, ...savedSchedules];
    saveSchedulesToStorage(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    if (onShowToast) {
      onShowToast(`Period breakdown for ${activeBranch} submitted successfully!`, 'success');
    }

    // Reset upload state
    setUploadedFile(null);
    setFileUploadError(null);
    setShowRecordedHistory(true);
  };

  const formatDisplayUrl = (raw: string) => {
    return raw.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="modal-student-attendance"
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-modal-title"
        className="w-full max-w-4xl my-auto bg-white dark:bg-slate-900 border-2 border-emerald-500/50 dark:border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Glow Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 via-sky-500 to-indigo-500 shrink-0" />

        {/* Modal Main Bar */}
        <div className="px-6 py-4 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-850/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="attendance-modal-title" className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                  Attendance &amp; Academic Clearance
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Online Portal
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Attendance clearance, period window pathway configuration &amp; schedule monograph upload
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close window (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 space-y-6">

          {/* ======================================================== */}
          {/* 1. PERMANENT FIELD CONSTRAINT: ATTENDANCE CLEARANCE ONLINE */}
          {/* ======================================================== */}
          <div 
            id="permanent-attendance-clearance-block"
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-emerald-500/10 dark:from-amber-950/30 dark:via-sky-950/20 dark:to-emerald-950/30 border-2 border-amber-400/70 dark:border-amber-500/60 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                  <Lock className="w-3 h-3" />
                  <span>PERMANENT FIELD</span>
                </span>
                <label 
                  htmlFor="field-attendance-clearance-online"
                  className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5"
                >
                  <span>Attendance Clearance Online</span>
                </label>
              </div>

              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Uneditable • Readonly</span>
              </span>
            </div>

            {/* Exact URL Field (Strictly Readonly and Disabled to firmly prevent modification or removal) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="field-attendance-clearance-online"
                  type="text"
                  readOnly
                  disabled
                  value={PERMANENT_CLEARANCE_URL}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-mono bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/80 text-slate-900 dark:text-slate-100 font-bold cursor-not-allowed select-all focus:outline-hidden opacity-95"
                  title="Permanent System URL: Attendance Clearance Online (Readonly & Uneditable)"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Action Buttons for the Permanent URL */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="btn-copy-clearance-url"
                  onClick={handleCopyClearanceUrl}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy permanent clearance form link"
                >
                  {copiedClearance ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="btn-toggle-embed-preview"
                  onClick={() => setIsEmbedPreviewOpen(prev => !prev)}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Toggle embedded clearance view"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{isEmbedPreviewOpen ? 'Hide Embed' : 'Embed Preview'}</span>
                </button>

                <a
                  href={PERMANENT_CLEARANCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-open-clearance-form"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  title="Open official Google Form for Attendance Clearance"
                >
                  <span>Open Form</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </a>
              </div>
            </div>

            {/* Firmly Embedded Live Form Preview Container */}
            {isEmbedPreviewOpen && (
              <div className="mt-3.5 rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-amber-700/80 bg-white dark:bg-slate-900 shadow-md animate-fade-in">
                <div className="px-3.5 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-800 dark:to-slate-850 text-xs font-mono text-amber-950 dark:text-amber-200 flex items-center justify-between border-b border-amber-200 dark:border-slate-700">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Firmly Embedded Clearance Destination: {PERMANENT_CLEARANCE_URL}</span>
                  </span>
                  <a
                    href={PERMANENT_CLEARANCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 text-[11px] font-sans font-semibold"
                  >
                    <span>Launch in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="h-52 sm:h-60 w-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950/60">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 shadow-2xs">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Official Attendance Clearance Gateway
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm">
                    Permanent institutional Google Form verified at: <br/>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{PERMANENT_CLEARANCE_URL}</span>
                  </p>
                  <a
                    href={PERMANENT_CLEARANCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Open Clearance Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 2. "PERIOD WINDOW" TRIGGER AREA (OPENS 4 SECTIONS)       */}
          {/* ======================================================== */}
          <div id="period-window-trigger-area" className="space-y-4">
            
            {/* Action Block / Trigger Bar for Period Window */}
            <div 
              id="btn-period-window-trigger"
              onClick={() => setIsPeriodWindowOpen(prev => !prev)}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 hover:from-sky-500/15 hover:to-purple-500/15 border-2 border-sky-400/80 dark:border-sky-500/60 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0 group-hover:scale-105 transition-transform">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      Period Window
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                      4 Sections
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Click to open academic pathways: Merged Secondary &bull; Senior Secondary &bull; Degree &bull; PG
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 hidden sm:inline">
                  {isPeriodWindowOpen ? 'Active Window' : 'Open Window'}
                </span>
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isPeriodWindowOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {/* Revealed 4 Sections Panel */}
            {isPeriodWindowOpen && (
              <div className="space-y-4 animate-fade-in">
                
                {/* 4 Section Choices: Merged Secondary, Senior Secondary, Degree, PG */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  
                  {/* Section 1: Merged Secondary */}
                  <button
                    type="button"
                    id="period-section-merged-secondary"
                    onClick={() => handleSelectBranch('Merged Secondary')}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                      activeBranch === 'Merged Secondary'
                        ? 'bg-sky-500/15 dark:bg-sky-950/60 border-sky-500 shadow-md shadow-sky-500/15 ring-2 ring-sky-400/40'
                        : 'bg-slate-50 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          activeBranch === 'Merged Secondary'
                            ? 'bg-sky-600 text-white'
                            : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        }`}>
                          <BookOpen className="w-4 h-4" />
                        </div>
                        {activeBranch === 'Merged Secondary' && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Merged Secondary
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        Malayalam, Urdu &bull; Class 1-7
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      <span>Configure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Section 2: Senior Secondary */}
                  <button
                    type="button"
                    id="period-section-senior-secondary"
                    onClick={() => handleSelectBranch('Senior Secondary')}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                      activeBranch === 'Senior Secondary'
                        ? 'bg-teal-500/15 dark:bg-teal-950/60 border-teal-500 shadow-md shadow-teal-500/15 ring-2 ring-teal-400/40'
                        : 'bg-slate-50 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-teal-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          activeBranch === 'Senior Secondary'
                            ? 'bg-teal-600 text-white'
                            : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                        }`}>
                          <School className="w-4 h-4" />
                        </div>
                        {activeBranch === 'Senior Secondary' && (
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Senior Secondary
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        Malayalam, Urdu &bull; Class 1-7
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-teal-600 dark:text-teal-400">
                      <span>Configure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Section 3: Degree */}
                  <button
                    type="button"
                    id="period-section-degree"
                    onClick={() => handleSelectBranch('Degree')}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                      activeBranch === 'Degree'
                        ? 'bg-amber-500/15 dark:bg-amber-950/60 border-amber-500 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/40'
                        : 'bg-slate-50 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          activeBranch === 'Degree'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        {activeBranch === 'Degree' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Degree
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        1st, 2nd, 3rd Year
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      <span>Configure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Section 4: PG */}
                  <button
                    type="button"
                    id="period-section-pg"
                    onClick={() => handleSelectBranch('PG')}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                      activeBranch === 'PG'
                        ? 'bg-purple-500/15 dark:bg-purple-950/60 border-purple-500 shadow-md shadow-purple-500/15 ring-2 ring-purple-400/40'
                        : 'bg-slate-50 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-purple-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          activeBranch === 'PG'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}>
                          <Layers className="w-4 h-4" />
                        </div>
                        {activeBranch === 'PG' && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        PG
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        1st &amp; 2nd Year Only
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-purple-700 dark:text-purple-400">
                      <span>Configure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>

                {/* ======================================================== */}
                {/* 3. POP-UP INNER DYNAMIC ROUTING LOGIC                   */}
                {/* ======================================================== */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-750 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Selected: <span className="text-sky-600 dark:text-sky-400">{activeBranch}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Dynamic Routing
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {activeBranch === 'Degree' 
                        ? '3-Year Selection' 
                        : activeBranch === 'PG' 
                        ? '2-Year Selection' 
                        : 'Subject Selectors → Class 1-7 Dropdown'}
                    </span>
                  </div>

                  {/* ROUTING 1: MERGED SECONDARY / SENIOR SECONDARY */}
                  {(activeBranch === 'Merged Secondary' || activeBranch === 'Senior Secondary') && (
                    <div className="space-y-4 animate-fade-in">
                      
                      {/* Subject Selectors (Malayalam, Urdu, etc.) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                          <span>Subject Selectors (Click to activate Class Dropdown): *</span>
                        </label>
                        <div id="subject-selectors-row" className="flex flex-wrap gap-2">
                          {[
                            { id: 'malayalam', name: 'Malayalam' },
                            { id: 'urdu', name: 'Urdu' },
                            { id: 'arabic', name: 'Arabic' },
                            { id: 'english', name: 'English' },
                            { id: 'islamic-studies', name: 'Islamic Studies' }
                          ].map(subj => (
                            <button
                              key={subj.id}
                              type="button"
                              id={`btn-subject-${subj.id}`}
                              onClick={() => {
                                setSelectedSubjectStream(subj.name);
                                setIsClassDropdownOpen(true);
                                if (fileUploadError) setFileUploadError(null);
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                selectedSubjectStream === subj.name
                                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 ring-2 ring-sky-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>{subj.name}</span>
                              {selectedSubjectStream === subj.name && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable dropdown window (max-height with overflow-y: auto) containing Class 1 to Class 7 */}
                      <div className="space-y-2 animate-fade-in relative">
                        <div className="flex items-center justify-between">
                          <label 
                            htmlFor="btn-toggle-class-dropdown"
                            className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Class Dropdown Window (Class 1 to Class 7) *</span>
                          </label>
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                            Enforced Max-Height &bull; Overflow-Y: Auto
                          </span>
                        </div>

                        {/* Interactive Dropdown Button */}
                        <button
                          type="button"
                          id="btn-toggle-class-dropdown"
                          onClick={() => setIsClassDropdownOpen(prev => !prev)}
                          className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 text-slate-900 dark:text-slate-100 flex items-center justify-between cursor-pointer font-medium shadow-xs transition-colors"
                          title="Select Class (Class 1 to Class 7)"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-indigo-700 dark:text-indigo-300">
                              {selectedClass || 'Select Class (Class 1 to Class 7)'}
                            </span>
                            <span className="text-xs text-slate-400">({selectedSubjectStream})</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform duration-200 ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Scrollable dropdown window with max-height and overflow-y: auto */}
                        {isClassDropdownOpen && (
                          <div 
                            id="class-dropdown-scrollable-window"
                            style={{ maxHeight: '250px', overflowY: 'auto' }}
                            className="w-full max-h-[250px] overflow-y-auto p-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-xl space-y-1.5 custom-scrollbar animate-fade-in z-20"
                          >
                            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span>Select Tier (Scrollable 1 to 7)</span>
                              <span>&darr;</span>
                            </div>

                            {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'].map(cName => {
                              const isSelected = selectedClass === cName;
                              return (
                                <button
                                  key={cName}
                                  type="button"
                                  id={`option-${cName.toLowerCase().replace(/\s+/g, '-')}`}
                                  onClick={() => {
                                    setSelectedClass(cName);
                                    setIsClassDropdownOpen(false);
                                    if (fileUploadError) setFileUploadError(null);
                                  }}
                                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {cName.replace('Class ', '')}
                                    </span>
                                    <span>{cName}</span>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Year Selection Field */}
                      <div className="space-y-2 animate-fade-in">
                        <label 
                          htmlFor="input-academic-year"
                          className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal-500" />
                            <span>Year Selection Field *</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Academic Year</span>
                        </label>
                        <input
                          id="input-academic-year"
                          type="text"
                          value={academicYearInput}
                          onChange={e => {
                            setAcademicYearInput(e.target.value);
                            if (fileUploadError) setFileUploadError(null);
                          }}
                          placeholder="e.g. 2026-2027 or 2025-2026"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* ROUTING 2: DEGREE (DROPDOWN WINDOW: FIRST YEAR, SECOND YEAR, THIRD YEAR) */}
                  {activeBranch === 'Degree' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label 
                          htmlFor="select-degree-year"
                          className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Dropdown Window for Degree Years *</span>
                          </span>
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                            First Year &bull; Second Year &bull; Third Year
                          </span>
                        </label>
                        <select
                          id="select-degree-year"
                          value={selectedDegreeYear}
                          onChange={e => setSelectedDegreeYear(e.target.value as 'First Year' | 'Second Year' | 'Third Year')}
                          className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-amber-500 cursor-pointer font-bold shadow-xs"
                        >
                          <option value="First Year">First Year</option>
                          <option value="Second Year">Second Year</option>
                          <option value="Third Year">Third Year</option>
                        </select>
                        <p className="text-[11px] text-slate-500">
                          Degree undergraduate curriculum spans three consecutive academic years.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ROUTING 3: PG (STRICTLY CONSTRAINED TO FIRST YEAR, SECOND YEAR) */}
                  {activeBranch === 'PG' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label 
                          htmlFor="select-pg-year"
                          className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-purple-500" />
                            <span>Dropdown Window for PG Years (Strictly Two Entries) *</span>
                          </span>
                          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                            First Year &bull; Second Year
                          </span>
                        </label>
                        <select
                          id="select-pg-year"
                          value={selectedPgYear}
                          onChange={e => setSelectedPgYear(e.target.value as 'First Year' | 'Second Year')}
                          className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-purple-500 cursor-pointer font-bold shadow-xs"
                        >
                          <option value="First Year">First Year</option>
                          <option value="Second Year">Second Year</option>
                        </select>
                        <p className="text-[11px] text-slate-500">
                          Post-graduate pathways are strictly constrained to First Year and Second Year.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COMMON: "IMAGE OR PDF" FILE UPLOAD INPUT */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5 text-emerald-500" />
                        <span>File Upload Input: Image or PDF *</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        Accepts JPG, PNG, PDF (Up to 20MB)
                      </span>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      id="input-file-period-schedule"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!uploadedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        id="btn-upload-image-or-pdf"
                        className={`w-full p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group ${
                          isDragging
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/20'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          Click to Upload Image or PDF
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Attach your scanned period breakdown or official curriculum document
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 flex items-center justify-between gap-3 animate-fade-in">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {uploadedFile.type === 'PDF' ? 'PDF' : 'IMG'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {uploadedFile.name}
                            </div>
                            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                              Ready for submission &bull; {uploadedFile.size}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {fileUploadError && (
                      <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fileUploadError}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Configuration: {activeBranch} &bull; {activeBranch === 'Degree' ? selectedDegreeYear : activeBranch === 'PG' ? selectedPgYear : `${selectedSubjectStream} (${selectedClass})`}
                    </span>

                    <button
                      type="button"
                      id="btn-submit-period-schedule"
                      onClick={handleSubmitPeriodSchedule}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Period Breakdown</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 4. ACTIVE ATTENDANCE PORTALS (DEGREE & CUSTOM LINKS)     */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Active Attendance Portals</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Target: {formatDisplayUrl(ATTENDANCE_TARGET_URL)}
              </span>
            </div>

            {/* Default Category: Degree Attendance */}
            {DEFAULT_CATEGORIES.map((categoryName, idx) => (
              <a
                key={`default-${categoryName}`}
                href={ATTENDANCE_TARGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                id={`attendance-category-${idx + 1}`}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-emerald-400 dark:hover:border-emerald-500/80 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                    <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {categoryName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span>Institutional Attendance Gateway</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        {formatDisplayUrl(ATTENDANCE_TARGET_URL)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </a>
            ))}

            {/* Custom Sections Added By Faculty with Custom or Default Links */}
            {customSections.map((customSec, cIdx) => (
              <div
                key={customSec.id || `custom-${cIdx}`}
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500/80 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <a
                  href={customSec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer pr-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                    <School className="w-5 h-5 text-indigo-500 shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {customSec.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60 shrink-0">
                        Custom
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <span>Faculty Section</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {formatDisplayUrl(customSec.url)}
                      </span>
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={e => handleDeleteCustomSection(customSec.id, customSec.name, e)}
                    title={`Delete section "${customSec.name}"`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={customSec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}

            {/* Bottom Add Section Drawer Trigger */}
            {!isPromptOpen ? (
              <button
                id="btn-add-attendance-section"
                type="button"
                onClick={() => {
                  setIsPromptOpen(true);
                  setErrorMsg(null);
                  setNewSectionName('');
                  setNewSectionUrl('');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  + Add Attendance Section
                </span>
              </button>
            ) : (
              <form 
                onSubmit={handleAddSectionSubmit}
                className="space-y-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-400/80 dark:border-emerald-500/80 shadow-md animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Create Attendance Section</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPromptOpen(false);
                      setErrorMsg(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Section Name */}
                <div className="space-y-1">
                  <label htmlFor="new-section-name-input" className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                    Section Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    id="new-section-name-input"
                    type="text"
                    value={newSectionName}
                    onChange={e => {
                      setNewSectionName(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g. Higher Secondary Attendance, Faculty Diploma Section..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Portal Link with Paste Button */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="new-section-url-input" className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-sky-500" />
                      <span>Attendance Portal Link (Optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Leave blank for default</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="new-section-url-input"
                      type="text"
                      value={newSectionUrl}
                      onChange={e => {
                        setNewSectionUrl(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder={ATTENDANCE_TARGET_URL}
                      className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Paste link from clipboard"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-rose-500 animate-fade-in">{errorMsg}</p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPromptOpen(false);
                      setErrorMsg(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
                  >
                    Create Section
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer Strip */}
        <div className="px-6 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>Attendance Clearance Online is firmly mapped to: <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{PERMANENT_CLEARANCE_URL}</span></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
          >
            Dismiss Window
          </button>
        </div>
      </div>
    </div>
  );
};
