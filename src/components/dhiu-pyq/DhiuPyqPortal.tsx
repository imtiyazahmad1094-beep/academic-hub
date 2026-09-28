import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  Eye, 
  Layers, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Share2, 
  Filter, 
  SlidersHorizontal,
  FolderOpen,
  Award,
  Hash,
  ExternalLink,
  ChevronDown,
  Mic,
  Volume2,
  Megaphone,
  Upload,
  Plus,
  Globe,
  Radio,
  HelpCircle,
  FileCheck,
  Gamepad2,
  Clock,
  X
} from 'lucide-react';
import { 
  DhiuClassInfo, 
  DhiuSemesterInfo, 
  DhiuSubjectInfo, 
  DhiuQuestionPaper, 
  DhiuSubjectName 
} from '../../types';
import { 
  DHIU_CLASSES, 
  DHIU_SEMESTERS, 
  DHIU_SUBJECTS, 
  getDhiuQuestionPapers,
  getDhiuClass10VivaPapers,
  generateExamQuestions,
  generateVivaExamQuestions
} from '../../data/dhiuPyqData';
import { 
  getCombinedPyqPapers, 
  getCombinedVivaPapers, 
  saveCustomPyqPaper, 
  getSubjectPaperCount,
  getCustomPyqPapers,
  getVivaResourceLinks
} from '../../utils/pyqStorage';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { PyqUploadModal } from './PyqUploadModal';
import { LiveBroadcasterModal } from './LiveBroadcasterModal';
import { LiveTalentShowQuiz } from './LiveTalentShowQuiz';
import { VivaVoceExamArchivePortal } from '../viva/VivaVoceExamArchivePortal';

interface DhiuPyqPortalProps {
  onBackToDashboard: () => void;
  onShowToast: (msg: string) => void;
  onOpenShare?: (url: string, title: string) => void;
}

// 2005 to 2026 Chronological Year Range for Dropdown Search Selector
const CHRONOLOGICAL_YEAR_OPTIONS = Array.from({ length: 22 }, (_, idx) => 2026 - idx);

export const DhiuPyqPortal: React.FC<DhiuPyqPortalProps> = ({
  onBackToDashboard,
  onShowToast,
  onOpenShare,
}) => {
  // Navigation State across Tiers
  // Tier 1: Class Selection (selectedClass === null)
  // Tier 2: Semester Selection (selectedClass !== null, selectedSemester === null, !isVivaMode)
  // Tier 3: Subject Selection (selectedClass !== null, selectedSemester !== null, selectedSubject === null)
  // Tier 4: Year Selection (selectedClass !== null, selectedSemester !== null, selectedSubject !== null)
  // Class 10 Viva Mode: (selectedClass?.id === 10, isVivaMode === true)
  const [selectedClass, setSelectedClass] = useState<DhiuClassInfo | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<DhiuSemesterInfo | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<DhiuSubjectInfo | null>(null);
  const [isVivaMode, setIsVivaMode] = useState<boolean>(false);
  const [isVivaArchiveView, setIsVivaArchiveView] = useState<boolean>(false);
  
  // Tier 5: Document Preview Modal
  const [previewPaper, setPreviewPaper] = useState<DhiuQuestionPaper | null>(null);

  // Universal Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadModalSubject, setUploadModalSubject] = useState<DhiuSubjectName>('Aqeeda');
  const [uploadModalClassId, setUploadModalClassId] = useState<number>(10);
  const [uploadModalSemesterId, setUploadModalSemesterId] = useState<number>(1);
  const [storageVersion, setStorageVersion] = useState<number>(0);

  // Search & Filter in Tier 3 (Subjects), Tier 4 (Years) & Viva Feed
  const [subjectFilterQuery, setSubjectFilterQuery] = useState<string>('');
  const [yearSearchQuery, setYearSearchQuery] = useState<string>('');
  const [selectedDropdownYear, setSelectedDropdownYear] = useState<number | 'All'>('All');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [vivaSearchQuery, setVivaSearchQuery] = useState<string>('');
  const [selectedVivaYear, setSelectedVivaYear] = useState<number | 'All'>('All');
  const [isVivaYearDropdownOpen, setIsVivaYearDropdownOpen] = useState<boolean>(false);
  const [isLiveBroadcasterOpen, setIsLiveBroadcasterOpen] = useState<boolean>(false);
  const [isVivaQuizModalOpen, setIsVivaQuizModalOpen] = useState<boolean>(false);
  const [selectedExamTypeFilter, setSelectedExamTypeFilter] = useState<'All' | 'Annual' | 'Half-Yearly' | 'Model / Pre-Board'>('All');
  const [isRecentUploadsOpen, setIsRecentUploadsOpen] = useState<boolean>(false);

  // High-tactile 3D Glass Dropdown Selectors State (Streamlined non-toggle default interface)
  const [quickClassId, setQuickClassId] = useState<number>(10);
  const [quickSemesterId, setQuickSemesterId] = useState<number>(1);
  const [quickSubject, setQuickSubject] = useState<DhiuSubjectName>('Adab');
  const [quickYear, setQuickYear] = useState<number>(2026);
  const [activeQuickDropdown, setActiveQuickDropdown] = useState<'class' | 'semester' | 'subject' | 'year' | null>(null);

  // Part 2: Viva Voce Oral Archive Disclosure State (Hidden details by default)
  const [expandedVivaCardIds, setExpandedVivaCardIds] = useState<Set<string>>(new Set());

  const toggleVivaCard = (id: string) => {
    setExpandedVivaCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Dynamic Recent Uploads & Ingested Materials (PDFs and Web Hyperlinks)
  const recentPdfDocuments = useMemo(() => {
    const customPapers = getCustomPyqPapers().filter(
      p => p.isViva || p.subject === 'Viva Voce' || p.semesterId === 3
    );

    const defaultRecentDocs = [
      {
        name: '2026 Advanced Hadith Viva Guide.pdf',
        size: '2.4 MB',
        date: 'Added Today',
        paper: {
          id: 'viva-guide-2026',
          classId: 10,
          semesterId: 3,
          subject: 'Viva Voce',
          year: 2026,
          examType: 'Viva Voce',
          section: 'Advanced Hadith Defense',
          fileSize: '2.4 MB',
          maxMarks: 100,
          duration: '3 Hours Oral',
          downloadUrl: '#',
          isViva: true
        } as DhiuQuestionPaper
      },
      {
        name: '2025 Quranic Tajweed & Qira\'at Rubric.pdf',
        size: '1.8 MB',
        date: 'Added Yesterday',
        paper: {
          id: 'viva-guide-2025',
          classId: 10,
          semesterId: 3,
          subject: 'Viva Voce',
          year: 2025,
          examType: 'Viva Voce',
          section: 'Tajweed Evaluation',
          fileSize: '1.8 MB',
          maxMarks: 100,
          duration: '3 Hours Oral',
          downloadUrl: '#',
          isViva: true
        } as DhiuQuestionPaper
      },
      {
        name: '2024 Arabic Rhetoric & Dialectics Guide.pdf',
        size: '3.1 MB',
        date: '3 Days Ago',
        paper: {
          id: 'viva-guide-2024',
          classId: 10,
          semesterId: 3,
          subject: 'Viva Voce',
          year: 2024,
          examType: 'Viva Voce',
          section: 'Arabic Dialectics & Rhetoric',
          fileSize: '3.1 MB',
          maxMarks: 100,
          duration: '3 Hours Oral',
          downloadUrl: '#',
          isViva: true
        } as DhiuQuestionPaper
      }
    ];

    const customMapped = customPapers.map(p => ({
      name: `${p.year} ${p.subject} Assessment Guide.pdf`,
      size: p.fileSize || '2.1 MB',
      date: 'Uploaded Paper',
      paper: p
    }));

    return [...customMapped, ...defaultRecentDocs].slice(0, 4);
  }, [storageVersion]);

  const recentWebLinks = useMemo(() => {
    const savedLinks = getVivaResourceLinks();
    const defaultLinks = [
      {
        id: 'link-portal-1',
        title: 'DHIU Central Testing Registry',
        url: 'https://dhiu.edu.eg'
      },
      {
        id: 'link-portal-2',
        title: 'Al-Azhar Talaqi Oral Assessment Archive',
        url: 'https://azhar.edu.eg'
      }
    ];

    const mappedSaved = savedLinks.map(l => ({
      id: l.id,
      title: l.title,
      url: l.url
    }));

    const combined = [...mappedSaved, ...defaultLinks];
    const seen = new Set<string>();
    return combined.filter(item => {
      const key = `${item.title}-${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
  }, [storageVersion]);

  // Trigger Upload Modal with context
  const handleOpenUploadModal = (subj?: DhiuSubjectName, cId?: number, sId?: number) => {
    setUploadModalSubject(subj || selectedSubject?.name || 'Aqeeda');
    setUploadModalClassId(cId || selectedClass?.id || 10);
    setUploadModalSemesterId(sId || selectedSemester?.id || 1);
    setIsUploadModalOpen(true);
  };

  // Handle custom paper saved
  const handlePaperSaved = (newPaper: DhiuQuestionPaper) => {
    saveCustomPyqPaper(newPaper);
    setStorageVersion(v => v + 1);
  };

  // Breadcrumb generation
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; onClick?: () => void }[] = [
      { label: 'Home', onClick: onBackToDashboard },
      { 
        label: 'DHIU PYQ', 
        onClick: () => {
          setSelectedClass(null);
          setSelectedSemester(null);
          setSelectedSubject(null);
          setIsVivaMode(false);
        }
      }
    ];

    if (selectedClass) {
      items.push({
        label: selectedClass.name,
        onClick: () => {
          setSelectedSemester(null);
          setSelectedSubject(null);
          setIsVivaMode(false);
        }
      });
    }

    if (isVivaMode) {
      items.push({
        label: 'Viva Voce',
      });
      return items;
    }

    if (selectedSemester) {
      items.push({
        label: selectedSemester.name,
        onClick: () => {
          setSelectedSubject(null);
        }
      });
    }

    if (selectedSubject) {
      items.push({
        label: selectedSubject.name,
      });
    }

    return items;
  }, [selectedClass, selectedSemester, selectedSubject, isVivaMode, onBackToDashboard]);

  // Filtered subjects for Tier 3 with dynamic paper counts
  const filteredSubjects = useMemo(() => {
    const list = DHIU_SUBJECTS.map(s => ({
      ...s,
      paperCount: getSubjectPaperCount(s.name)
    }));
    if (!subjectFilterQuery.trim()) return list;
    const query = subjectFilterQuery.toLowerCase().trim();
    return list.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.arabicName.includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query)
    );
  }, [subjectFilterQuery, storageVersion]);

  // Question Papers for Tier 4 with year dropdown & exam type filters
  const currentPapers = useMemo(() => {
    if (!selectedClass || !selectedSemester || !selectedSubject) return [];
    const all = getCombinedPyqPapers(selectedClass.id, selectedSemester.id, selectedSubject.name);
    
    return all.filter(p => {
      const matchType = selectedExamTypeFilter === 'All' || p.examType === selectedExamTypeFilter;
      const matchYearText = !yearSearchQuery.trim() || p.year.toString().includes(yearSearchQuery.trim());
      const matchDropdownYear = selectedDropdownYear === 'All' || p.year === selectedDropdownYear;
      return matchType && matchYearText && matchDropdownYear;
    });
  }, [selectedClass, selectedSemester, selectedSubject, selectedExamTypeFilter, yearSearchQuery, selectedDropdownYear, storageVersion]);

  // Viva Voce Papers for Class 10 (Available whenever Class 10 Viva is active, either in dropdown mode or tier 2)
  const isClass10VivaActive = (selectedClass?.id === 10 && isVivaMode) || (quickClassId === 10 && quickSemesterId === 3);
  const vivaPapers = useMemo(() => {
    if (!isClass10VivaActive) return [];
    const all = getCombinedVivaPapers();
    return all.filter(p => {
      const matchDropdownYear = selectedVivaYear === 'All' || p.year === selectedVivaYear;
      const matchSearchText = !vivaSearchQuery.trim() || 
        p.year.toString().includes(vivaSearchQuery.toLowerCase().trim()) || 
        p.examType.toLowerCase().includes(vivaSearchQuery.toLowerCase().trim()) ||
        p.section.toLowerCase().includes(vivaSearchQuery.toLowerCase().trim());
      return matchDropdownYear && matchSearchText;
    });
  }, [isClass10VivaActive, selectedVivaYear, vivaSearchQuery, storageVersion]);

  // Quick Matched Paper for Dropdown Selectors
  const quickMatchedPaper = useMemo<DhiuQuestionPaper>(() => {
    const isOral = (quickClassId === 10 && quickSemesterId === 3) || quickSubject === 'Viva Voce';
    const allCustom = getCustomPyqPapers();
    const matched = allCustom.find(
      p => p.classId === quickClassId && (isOral ? (p.isViva || p.subject === 'Viva Voce' || p.semesterId === 3) : (p.semesterId === quickSemesterId && p.subject === quickSubject)) && p.year === quickYear
    );
    if (matched) return matched;

    if (isOral) {
      const allViva = getCombinedVivaPapers();
      const vivaMatched = allViva.find(p => p.year === quickYear);
      if (vivaMatched) return vivaMatched;
      return {
        id: `dhiu-quick-c10-viva-${quickYear}`,
        classId: 10,
        semesterId: 3,
        subject: 'Viva Voce',
        year: quickYear,
        examType: 'Viva Voce Examination',
        section: 'Grand Oral Board',
        fileSize: '84 KB',
        maxMarks: 100,
        duration: '45 Mins / Candidate',
        verified: true,
        isViva: true,
        questions: generateVivaExamQuestions(quickYear)
      };
    }

    const baseSize = 72 + ((quickYear + quickClassId) % 18) * 3;
    return {
      id: `dhiu-quick-c${quickClassId}-s${quickSemesterId}-${String(quickSubject).toLowerCase().replace(/\s+/g, '-')}-${quickYear}`,
      classId: quickClassId,
      semesterId: quickSemesterId,
      subject: quickSubject,
      year: quickYear,
      examType: quickSemesterId === 1 ? 'Half-Yearly' : 'Annual Promotional',
      section: 'Primary Core Academic Examination',
      fileSize: `${baseSize} KB`,
      maxMarks: 100,
      duration: '2.5 Hours',
      verified: true,
      isViva: false,
      questions: generateExamQuestions(quickSubject, quickYear, quickClassId, quickSemesterId)
    };
  }, [quickClassId, quickSemesterId, quickSubject, quickYear, storageVersion]);

  // Download simulation
  const handleDownload = (paper: DhiuQuestionPaper) => {
    const isOral = paper.isViva || paper.subject === 'Viva Voce';
    const title = isOral 
      ? `DHIU_Class10_VivaVoce_OralRegistry_${paper.year}.txt`
      : `${paper.subject}_Class${paper.classId}_Sem${paper.semesterId}_${paper.year}.txt`;

    let content = `==========================================================\n`;
    content += `DARUL HUDA ISLAMIC UNIVERSITY - EXAMINATION BOARD\n`;
    content += isOral 
      ? `CENTRAL ACADEMIC COUNCIL • VIVA VOCE ORAL EXAMINATION ARCHIVE\n`
      : `CENTRAL ACADEMIC COUNCIL • PAST YEAR QUESTION PAPER\n`;
    content += `==========================================================\n\n`;
    content += `Subject: ${paper.subject}\n`;
    content += `Class: Class ${paper.classId}\n`;
    content += `Evaluation Cycle: ${isOral ? 'Viva Voce Oral Examination' : `Semester ${paper.semesterId} (${paper.examType})`}\n`;
    content += `Year: ${paper.year}\n`;
    content += `Duration: ${paper.duration}\n`;
    content += `Maximum Marks: ${paper.maxMarks}\n`;
    content += `Verification Status: Certified Authenticated DHIU Archive\n\n`;
    content += `==========================================================\n`;
    content += isOral ? `ORAL EXAMINATION RUBRICS & BOARD PROMPTS\n` : `EXAMINATION QUESTIONS & SYLLABUS RUBRIC\n`;
    content += `==========================================================\n\n`;

    paper.questions?.forEach((sec) => {
      content += `\n${sec.sectionTitle}\n`;
      content += `Instructions: ${sec.instructions}\n\n`;
      sec.items.forEach(item => {
        content += `${item.qNum}. ${item.text} [Marks: ${item.marks}]\n`;
        if (item.arabicText) content += `   ${item.arabicText}\n`;
        if (item.options) content += `   Options: ${item.options.join(', ')}\n`;
        content += `\n`;
      });
    });

    content += `\n\n© Darul Huda Islamic University Examination Board. All Rights Reserved.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast(`Downloaded: ${paper.subject} — ${paper.year} (${paper.fileSize})`);
  };

  const handleShare = (paper: DhiuQuestionPaper) => {
    const isOral = paper.isViva || paper.subject === 'Viva Voce';
    const shareUrl = `${window.location.origin}?portal=dhiu-pyq&class=${paper.classId}&sem=${paper.semesterId}&subj=${encodeURIComponent(paper.subject)}&year=${paper.year}`;
    if (onOpenShare) {
      onOpenShare(shareUrl, `${paper.subject} — ${paper.year} (${isOral ? 'Viva Voce' : 'Examination Paper'})`);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      onShowToast(`Link copied: ${paper.subject} — ${paper.year}`);
    } else {
      onShowToast(`Document reference: ${paper.subject} — ${paper.year}`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in" id="dhiu-pyq-workspace-root">
      
      {/* ======================================================== */}
      {/* TOP ACADEMIC BREADCRUMB & CONTEXT NAVIGATION BAR        */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-sky-200/80 dark:border-zinc-800 shadow-sm">
        
        {/* Left Side: Back Trigger & Category Identity */}
        <div className="flex items-center gap-3">
          <button
            id="btn-dhiu-back-nav"
            onClick={() => {
              if (previewPaper) setPreviewPaper(null);
              else if (isVivaArchiveView) setIsVivaArchiveView(false);
              else if (isVivaMode) setIsVivaMode(false);
              else if (selectedSubject) setSelectedSubject(null);
              else if (selectedSemester) setSelectedSemester(null);
              else if (selectedClass) setSelectedClass(null);
              else onBackToDashboard();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 text-xs font-bold border border-slate-200 dark:border-zinc-700 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Go back one step"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white font-serif tracking-tight flex items-center gap-1.5">
                <span>DHIU PYQ Portal</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono font-bold">
                  Archive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Darul Huda Islamic University Past Examination Papers
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Exact Breadcrumb Navigation Path String & Viva Voce 2025 Portal Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="btn-toggle-viva-voce-archive-portal"
            onClick={() => setIsVivaArchiveView(prev => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border ${
              isVivaArchiveView
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-600/30 ring-2 ring-purple-400'
                : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white border-purple-500/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVivaArchiveView ? '← Standard Archive' : '🎙️ Viva Voce 2025 Portal'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs flex-wrap font-sans text-slate-600 dark:text-zinc-300 bg-slate-100/80 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-zinc-700">
            <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-zinc-500 mr-1">Path:</span>
            {breadcrumbItems.map((item, idx) => {
              const isLast = idx === breadcrumbItems.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />}
                  {item.onClick && !isLast ? (
                    <button
                      onClick={item.onClick}
                      className="hover:text-sky-600 dark:hover:text-sky-400 hover:underline font-semibold cursor-pointer transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={`font-bold ${isLast ? 'text-sky-600 dark:text-sky-400' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* VIVA VOCE 2025 EXAM ARCHIVE PORTAL CONDITIONAL VIEW      */}
      {/* ======================================================== */}
      {isVivaArchiveView ? (
        <VivaVoceExamArchivePortal
          onBack={() => setIsVivaArchiveView(false)}
          onShowToast={onShowToast}
        />
      ) : (
        <>
          {/* ======================================================== */}
          {/* TIER 1: BROWSE CLASS-WISE SCREEN (CLASS 1 - CLASS 10)    */}
          {/* ======================================================== */}
      {!selectedClass && (
        <div className="space-y-6 animate-fade-in" id="dhiu-tier-1-class-grid">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-[1.5px] border-sky-300/80 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-800 dark:text-sky-300 text-xs font-bold border border-sky-300/60 dark:border-sky-800">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Academic Curriculum • DHIU Examination Board</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
              Select Class Level
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              Browse past question papers by class level. Each folder encompasses 12 core academic and Islamic disciplines across two semester evaluation cycles spanning 2000 to the present year.
            </p>
          </div>

          {/* Streamlined Row of 4 Distinct Color-Coded 3D Capsule Selectors */}
          <div className="space-y-6 animate-fade-in" id="dropdown-selectors-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-30">
              
              {/* 1. CLASS LEVEL Box (Blue Theme) */}
              <div className="relative">
                <div
                  id="dropdown-capsule-class"
                  onClick={() => setActiveQuickDropdown(activeQuickDropdown === 'class' ? null : 'class')}
                  className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850/95 backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-zinc-950 border-x border-sky-500/50 shadow-xl shadow-sky-950/40 cursor-pointer transition-all duration-150 active:translate-y-0.5 active:border-b-2 space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                      <GraduationCap className="w-4 h-4 text-sky-400" />
                    </div>
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/60">
                      SELECT CLASS
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold font-serif text-white tracking-wide">
                      Class {quickClassId}
                    </span>
                    <span className="text-sky-400 font-extrabold text-xs transition-transform group-hover:scale-110">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Pop-up Choice Matrix: Class 1 to Class 10 */}
                {activeQuickDropdown === 'class' && (
                  <div 
                    id="dropdown-matrix-class"
                    className="absolute z-50 top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-sky-500 shadow-2xl shadow-sky-950/80 max-h-72 overflow-y-auto space-y-1.5 animate-smooth-entry"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 pb-1 border-b border-zinc-800">
                      Select Academic Grade (Class 1 – 10)
                    </div>
                    {DHIU_CLASSES.map(cls => {
                      const isSelected = quickClassId === cls.id;
                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => {
                            setQuickClassId(cls.id);
                            if (cls.id !== 10 && quickSemesterId === 3) {
                              setQuickSemesterId(1);
                              setQuickSubject('Adab');
                            }
                            setActiveQuickDropdown(null);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-md'
                              : 'text-zinc-200 hover:bg-sky-950/60 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🎓</span>
                            <span>{cls.name}</span>
                          </span>
                          <span className="text-[10px] font-mono opacity-80">
                            {cls.level}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. SEMESTER Box (Green / Fuchsia Theme) */}
              <div className="relative">
                <div
                  id="dropdown-capsule-semester"
                  onClick={() => setActiveQuickDropdown(activeQuickDropdown === 'semester' ? null : 'semester')}
                  className={`p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850/95 backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-zinc-950 border-x ${
                    quickClassId === 10 && quickSemesterId === 3 
                      ? 'border-fuchsia-500/50 shadow-xl shadow-fuchsia-950/40' 
                      : 'border-emerald-500/50 shadow-xl shadow-emerald-950/40'
                  } cursor-pointer transition-all duration-150 active:translate-y-0.5 active:border-b-2 space-y-2 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl ${
                      quickClassId === 10 && quickSemesterId === 3 
                        ? 'bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-400' 
                        : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400'
                    } flex items-center justify-center`}>
                      {quickClassId === 10 && quickSemesterId === 3 ? (
                        <Mic className="w-4 h-4 text-fuchsia-400" />
                      ) : (
                        <Layers className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold font-mono tracking-wider uppercase ${
                      quickClassId === 10 && quickSemesterId === 3 
                        ? 'text-fuchsia-400 bg-fuchsia-950/80 border-fuchsia-800/60' 
                        : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                    } px-2 py-0.5 rounded-md border`}>
                      {quickClassId === 10 && quickSemesterId === 3 ? 'ORAL REGISTRY' : 'SELECT SEMESTER'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold font-serif text-white tracking-wide">
                      {quickClassId === 10 && quickSemesterId === 3 ? 'Viva Voce' : `Semester ${quickSemesterId}`}
                    </span>
                    <span className={`${
                      quickClassId === 10 && quickSemesterId === 3 ? 'text-fuchsia-400' : 'text-emerald-400'
                    } font-extrabold text-xs transition-transform group-hover:scale-110`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Pop-up Choice Matrix: Semester 1, Semester 2 & Dedicated Viva Voce for Class 10 */}
                {activeQuickDropdown === 'semester' && (
                  <div 
                    id="dropdown-matrix-semester"
                    className="absolute z-50 top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-emerald-500 shadow-2xl shadow-emerald-950/80 space-y-2 animate-smooth-entry"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 pb-1 border-b border-zinc-800">
                      Select Evaluation Cycle
                    </div>
                    {DHIU_SEMESTERS.map(sem => {
                      const isSelected = quickSemesterId === sem.id;
                      return (
                        <button
                          key={sem.id}
                          type="button"
                          onClick={() => {
                            setQuickSemesterId(sem.id);
                            if (quickSubject === 'Viva Voce') {
                              setQuickSubject('Adab');
                            }
                            setActiveQuickDropdown(null);
                          }}
                          className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'text-zinc-200 hover:bg-emerald-950/60 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{sem.name}</span>
                          </span>
                          <span className="text-[10px] font-mono opacity-80">
                            {sem.termLabel}
                          </span>
                        </button>
                      );
                    })}

                    {/* Integrated Dedicated Class 10 Third Choice: "🎙️ Viva Voce" */}
                    {quickClassId === 10 && (
                      <button
                        key="semester-viva-voce-option"
                        type="button"
                        id="btn-quick-select-viva-voce"
                        onClick={() => {
                          setQuickSemesterId(3);
                          setQuickSubject('Viva Voce' as any);
                          setActiveQuickDropdown(null);
                          onShowToast('🎙️ Loaded Class 10 Viva Voce Oral Examination Blueprints & Archives');
                        }}
                        className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                          quickSemesterId === 3
                            ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-md border-fuchsia-400/60'
                            : 'bg-purple-950/40 text-purple-200 border-purple-500/40 hover:bg-purple-900/60 hover:text-white hover:border-purple-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>🎙️</span>
                          <span className="font-extrabold text-white text-sm">Viva Voce</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-80 bg-purple-900/80 px-2 py-0.5 rounded border border-purple-400/40">
                          Oral Registry
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3. SUBJECT Box (Amber / Purple Theme) */}
              <div className="relative">
                <div
                  id="dropdown-capsule-subject"
                  onClick={() => setActiveQuickDropdown(activeQuickDropdown === 'subject' ? null : 'subject')}
                  className={`p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850/95 backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-zinc-950 border-x ${
                    quickClassId === 10 && quickSemesterId === 3
                      ? 'border-purple-500/50 shadow-xl shadow-purple-950/40'
                      : 'border-amber-500/50 shadow-xl shadow-amber-950/40'
                  } cursor-pointer transition-all duration-150 active:translate-y-0.5 active:border-b-2 space-y-2 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl ${
                      quickClassId === 10 && quickSemesterId === 3
                        ? 'bg-purple-500/20 border border-purple-400/40 text-purple-400'
                        : 'bg-amber-500/20 border border-amber-400/40 text-amber-400'
                    } flex items-center justify-center`}>
                      {quickClassId === 10 && quickSemesterId === 3 ? (
                        <Mic className="w-4 h-4 text-purple-400" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold font-mono tracking-wider uppercase ${
                      quickClassId === 10 && quickSemesterId === 3
                        ? 'text-purple-400 bg-purple-950/80 border-purple-800/60'
                        : 'text-amber-400 bg-amber-950/80 border-amber-800/60'
                    } px-2 py-0.5 rounded-md border`}>
                      {quickClassId === 10 && quickSemesterId === 3 ? 'ORAL MODULE' : 'SELECT SUBJECT'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold font-serif text-white tracking-wide truncate max-w-[130px]">
                      {quickClassId === 10 && quickSemesterId === 3 ? 'Viva Voce' : quickSubject}
                    </span>
                    <span className={`${
                      quickClassId === 10 && quickSemesterId === 3 ? 'text-purple-400' : 'text-amber-400'
                    } font-extrabold text-xs transition-transform group-hover:scale-110`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Pop-up Choice Matrix: Core Academic Subjects Grid or Viva Modules */}
                {activeQuickDropdown === 'subject' && (
                  <div 
                    id="dropdown-matrix-subject"
                    className="absolute z-50 top-full left-0 right-0 sm:w-80 sm:-left-12 mt-2 p-3.5 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-amber-500 shadow-2xl shadow-amber-950/80 max-h-72 overflow-y-auto space-y-2 animate-smooth-entry"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-1 pb-1 border-b border-zinc-800 flex items-center justify-between">
                      <span>{quickClassId === 10 && quickSemesterId === 3 ? 'Class 10 Viva Voce Areas' : 'Core Curriculum Subjects'}</span>
                      <span className="text-zinc-500 font-mono">{quickClassId === 10 && quickSemesterId === 3 ? 'Oral Board' : '10 Modules'}</span>
                    </div>

                    {quickClassId === 10 && quickSemesterId === 3 ? (
                      <div className="space-y-1.5">
                        {[
                          { name: 'Grand Oral Assessment', label: 'All Modules (100M)' },
                          { name: 'Qur’an & Tajweed', label: 'Oral Defense (25M)' },
                          { name: 'Arabic Eloquence', label: 'Dialectics (25M)' },
                          { name: 'Fiqh Defense', label: 'Jurisprudence (25M)' },
                          { name: 'Capstone Thesis', label: 'Central Board (25M)' },
                        ].map((area, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setQuickSubject('Viva Voce' as any);
                              setActiveQuickDropdown(null);
                            }}
                            className="w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/30"
                          >
                            <span className="flex items-center gap-2">
                              <span>🎙️</span>
                              <span>{area.name}</span>
                            </span>
                            <span className="text-[10px] font-mono opacity-80">{area.label}</span>
                          </button>
                        ))}
                        <div className="pt-2 border-t border-zinc-800">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickSemesterId(1);
                              setQuickSubject('Adab');
                              setActiveQuickDropdown(null);
                            }}
                            className="w-full p-2 text-center text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer hover:bg-zinc-900 rounded-lg transition-colors"
                          >
                            Switch to Written Examination Subjects →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          'Adab',
                          'English',
                          'Fiqh',
                          'Hadith',
                          'Maths',
                          'Nahv',
                          'Science',
                          'Swarf',
                          'Tareekh',
                          'Urdu'
                        ].map(sub => {
                          const isSelected = quickSubject === sub;
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                setQuickSubject(sub as DhiuSubjectName);
                                setActiveQuickDropdown(null);
                              }}
                              className={`p-2 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer truncate ${
                                isSelected
                                  ? 'bg-amber-600 text-white shadow-md'
                                  : 'text-zinc-200 hover:bg-amber-950/60 hover:text-white'
                              }`}
                            >
                              <span className="text-xs">📖</span>
                              <span className="truncate">{sub}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. EXAM YEAR Box (Purple Theme) */}
              <div className="relative">
                <div
                  id="dropdown-capsule-year"
                  onClick={() => setActiveQuickDropdown(activeQuickDropdown === 'year' ? null : 'year')}
                  className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850/95 backdrop-blur-xl border-t-2 border-t-white/30 border-b-4 border-b-zinc-950 border-x border-purple-500/50 shadow-xl shadow-purple-950/40 cursor-pointer transition-all duration-150 active:translate-y-0.5 active:border-b-2 space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/60">
                      SELECT YEAR
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold font-serif text-white tracking-wide">
                      {quickYear}
                    </span>
                    <span className="text-purple-400 font-extrabold text-xs transition-transform group-hover:scale-110">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Pop-up Choice Matrix: Chronological 2005 to Latest Year Grid */}
                {activeQuickDropdown === 'year' && (
                  <div 
                    id="dropdown-matrix-year"
                    className="absolute z-50 top-full left-0 right-0 sm:w-80 sm:-left-24 mt-2 p-3 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-purple-500 shadow-2xl shadow-purple-950/80 max-h-72 overflow-y-auto space-y-2 animate-smooth-entry"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-1 pb-1 border-b border-zinc-800 flex items-center justify-between">
                      <span>Chronological Exam Cycles</span>
                      <span className="font-mono text-zinc-500">2005 – 2026</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {CHRONOLOGICAL_YEAR_OPTIONS.map(yr => {
                        const isSelected = quickYear === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setQuickYear(yr);
                              setActiveQuickDropdown(null);
                            }}
                            className={`py-2 px-1 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-zinc-200 hover:bg-purple-950/60 hover:text-white'
                            }`}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Direct Matched Dashboard (Metrics Tier) */}
            {quickClassId === 10 && quickSemesterId === 3 ? (
              /* Forced Left-to-Right Realignment: Far Left (Year + Headline), Center Matrix (Metrics), Far Right Edge (Buttons) */
              <div 
                id="matched-quick-paper-card"
                dir="ltr"
                className="p-5 sm:p-6 rounded-3xl bg-zinc-950/95 border-[1.5px] border-purple-500/50 shadow-2xl shadow-purple-950/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-white relative z-10 text-left"
              >
                {/* Far Left: The blue year capsule ("📅 2026") right next to the white text headline ("Viva Voce — 2026") */}
                <div className="flex items-center gap-3 shrink-0 text-left">
                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 font-mono font-extrabold text-xs border border-blue-400/50 shadow-2xs whitespace-nowrap">
                    📅 {quickYear}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white whitespace-nowrap">
                    Viva Voce — {quickYear}
                  </h3>
                </div>

                {/* Center Matrix: The horizontal metric items tracking timeline boundaries cleanly */}
                <div className="flex items-center gap-2.5 text-xs text-zinc-300 flex-wrap font-sans lg:justify-center">
                  <span className="whitespace-nowrap">⏱️ 45 Mins / Candidate</span>
                  <span className="text-zinc-600 font-bold">•</span>
                  <span className="whitespace-nowrap">🎯 Maximum Marks: 100</span>
                  <span className="text-zinc-600 font-bold">•</span>
                  <span className="whitespace-nowrap">📦 Size: 84 KB</span>
                  <span className="text-zinc-600 font-bold hidden xl:inline">•</span>
                  <span className="text-emerald-400 font-semibold items-center gap-1 hidden xl:flex whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>✓ Verified DHIU Board Archive</span>
                  </span>
                </div>

                {/* Far Right Edge: Horizontally align the two primary action button triggers level with the data row */}
                <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
                  <button
                    type="button"
                    id="btn-quick-preview-paper"
                    onClick={() => setPreviewPaper(quickMatchedPaper)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-purple-200 hover:text-white text-xs font-bold border border-purple-400/50 hover:border-purple-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>👁️ Preview Paper</span>
                  </button>

                  <button
                    type="button"
                    id="btn-quick-download-paper"
                    onClick={() => handleDownload(quickMatchedPaper)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border-t-2 border-t-white/30 border-b-2 border-b-zinc-950 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>📥 Download</span>
                  </button>

                  <button
                    type="button"
                    id="btn-quick-jump-viva"
                    onClick={() => {
                      setIsVivaArchiveView(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 hover:text-white text-xs font-bold border border-purple-600/40 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Viva Voce 2025 Portal →</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Written Paper Matched Card */
              <div 
                id="matched-quick-paper-card"
                className="p-5 sm:p-6 rounded-3xl bg-zinc-950/95 border-[1.5px] border-indigo-500/50 shadow-2xl shadow-indigo-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white relative z-10 text-left"
              >
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-400/40">
                      MATCHED QUESTION PAPER
                    </span>
                    <span className="text-zinc-400 text-xs">
                      Class {quickClassId} • Semester {quickSemesterId} • {quickYear}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {quickSubject} — {quickYear} Examination Paper
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                    <span>⏱️ {quickMatchedPaper.duration}</span>
                    <span>•</span>
                    <span>🎯 Marks: {quickMatchedPaper.maxMarks}</span>
                    <span>•</span>
                    <span>📦 Size: {quickMatchedPaper.fileSize}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified DHIU Archive
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    type="button"
                    id="btn-quick-preview-paper"
                    onClick={() => setPreviewPaper(quickMatchedPaper)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white text-xs font-bold border border-sky-400/50 hover:border-sky-300 shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>👁️ Preview Paper</span>
                  </button>

                  <button
                    type="button"
                    id="btn-quick-download-paper"
                    onClick={() => handleDownload(quickMatchedPaper)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/40 border-t-2 border-t-white/30 border-b-2 border-b-zinc-950 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>📥 Download</span>
                  </button>

                  <button
                    type="button"
                    id="btn-quick-jump-folder"
                    onClick={() => {
                      const matchedCls = DHIU_CLASSES.find(c => c.id === quickClassId) || DHIU_CLASSES[0];
                      const matchedSem = DHIU_SEMESTERS.find(s => s.id === quickSemesterId) || DHIU_SEMESTERS[0];
                      const matchedSub = DHIU_SUBJECTS.find(s => s.name === quickSubject) || DHIU_SUBJECTS[0];
                      setSelectedClass(matchedCls);
                      setSelectedSemester(matchedSem);
                      setSelectedSubject(matchedSub);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Folder View →</span>
                  </button>
                </div>
              </div>
            )}

            {/* PROGRAMMATICALLY LOADED ORAL EXAMINATION BLUEPRINTS, PARAMETERS, & REFERENCE GUIDES (Below Metrics Tier) */}
            {quickClassId === 10 && quickSemesterId === 3 && (
              <div className="space-y-6 animate-fade-in relative z-20 text-left" dir="ltr" id="viva-blueprint-and-reference-tier">
                
                {/* 1. BLUEPRINTS & EVALUATION PARAMETERS CARD */}
                <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/95 backdrop-blur-xl border-[1.5px] border-purple-500/40 shadow-xl shadow-purple-950/30 text-white space-y-4 text-left" dir="ltr">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                        <Mic className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold font-serif text-white tracking-wide">
                          Oral Examination Blueprints &amp; Assessment Parameters
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          Class 10 Central Examination Board • Standard 100-Mark Oral Defense Rubric
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsVivaQuizModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/50 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Gamepad2 className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>🎮 Play Quiz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenUploadModal('Viva Voce', 10, 3)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Upload Viva Paper</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Core Focus Area Parameter Nodes (25M each = 100M total) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-500/30 text-xs text-left space-y-1">
                      <div className="flex items-center justify-between text-purple-400 font-bold font-mono text-[10px]">
                        <span>MODULE 1</span>
                        <span className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800">25 MARKS</span>
                      </div>
                      <div className="font-serif font-bold text-white text-sm">Qur’an &amp; Tajweed</div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Recitation accuracy, makharij, sifaat, and on-spot tarteel demonstration.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-pink-500/30 text-xs text-left space-y-1">
                      <div className="flex items-center justify-between text-pink-400 font-bold font-mono text-[10px]">
                        <span>MODULE 2</span>
                        <span className="px-1.5 py-0.2 rounded bg-pink-950 border border-pink-800">25 MARKS</span>
                      </div>
                      <div className="font-serif font-bold text-white text-sm">Arabic Eloquence</div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Spontaneous discourse in classical Arabic, rhetoric, Nahv and Balagha rules.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-rose-500/30 text-xs text-left space-y-1">
                      <div className="flex items-center justify-between text-rose-400 font-bold font-mono text-[10px]">
                        <span>MODULE 3</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800">25 MARKS</span>
                      </div>
                      <div className="font-serif font-bold text-white text-sm">Fiqh Defense</div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Jurisprudential argumentation, comparative Usul al-Fiqh, and fatwa dialectics.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-fuchsia-500/30 text-xs text-left space-y-1">
                      <div className="flex items-center justify-between text-fuchsia-400 font-bold font-mono text-[10px]">
                        <span>MODULE 4</span>
                        <span className="px-1.5 py-0.2 rounded bg-fuchsia-950 border border-fuchsia-800">25 MARKS</span>
                      </div>
                      <div className="font-serif font-bold text-white text-sm">Capstone Thesis</div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Final oral defense before the Central Board external &amp; internal examiners.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. ATTACHED ASSESSMENT MATERIALS & REFERENCE GUIDES */}
                <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/95 backdrop-blur-xl border-[1.5px] border-purple-500/30 text-white space-y-4 text-left" dir="ltr">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-left">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>📚 Attached Assessment Materials &amp; Reference Guides</span>
                    </h4>
                    <span className="text-[10px] font-mono text-purple-300 font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60">
                      Certified DHIU Board Bundle
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left" dir="ltr">
                    {/* Document Segment Block */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/90 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                      <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span>Document Segment (PDF Downloads &amp; Rubrics)</span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                          <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                            <span className="text-rose-400 font-bold shrink-0">📄</span>
                            <span className="truncate">{quickYear} Viva Voce Core Evaluation Rubric.pdf</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewPaper(quickMatchedPaper)}
                            className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                          >
                            Open Document →
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                          <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                            <span className="text-rose-400 font-bold shrink-0">📄</span>
                            <span className="truncate">{quickYear} DHIU Tajweed &amp; Oral Dialectics Manual.pdf</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewPaper(quickMatchedPaper)}
                            className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                          >
                            Open Document →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Web Hyperlink Segment Block */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/90 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                      <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                        <Globe className="w-3.5 h-3.5 text-pink-400" />
                        <span>Web Hyperlink Segment (Reference Guidelines)</span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                          <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                            <span className="shrink-0">🌐</span>
                            <span className="truncate">DHIU Interview Guidelines</span>
                            <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onShowToast('🌐 Opening DHIU Interview Guidelines: https://dhiu.edu.eg/viva-guidelines')}
                            className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                          >
                            <span>Visit Portal ↗</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                          <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                            <span className="shrink-0">🌐</span>
                            <span className="truncate">Central Oral Evaluation Standards</span>
                            <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onShowToast('🌐 Opening Central Oral Standards: https://dhiu.edu.eg/oral-standards')}
                            className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                          >
                            <span>Visit Portal ↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. VIVA VOCE ARCHIVE FEED WITH FORCED LEFT-TO-RIGHT REALIGNMENT */}
                <div className="space-y-4 text-left" dir="ltr">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🎙️ Past Viva Voce Examination Papers Archive</span>
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                      Chronological Registry (2005–2026)
                    </span>
                  </div>

                  <div className="space-y-3.5" id="viva-quick-cards-container" dir="ltr">
                    {vivaPapers.map(paper => {
                      const isExpanded = expandedVivaCardIds.has(paper.id);
                      return (
                        <div
                          key={paper.id}
                          id={`card-quick-viva-paper-${paper.year}`}
                          onClick={() => toggleVivaCard(paper.id)}
                          dir="ltr"
                          className="p-4 sm:p-5 rounded-[16px] bg-[#09090b] dark:bg-[#09090b] backdrop-blur-xl border-[1.5px] border-purple-500/50 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] border-t-2 border-t-white/20 border-b-4 border-b-black transition-all duration-300 space-y-3 cursor-pointer group text-left relative overflow-hidden"
                        >
                          {/* Linear Single Horizontal Row: Far Left (Year & Headline), Center Matrix (Metrics), Far Right Edge (Buttons) */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left" dir="ltr">
                            {/* Far Left: The blue year capsule ("📅 2026") right next to the white text headline ("Viva Voce — 2026") */}
                            <div className="flex items-center gap-3 shrink-0 text-left">
                              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 font-mono font-extrabold text-xs border border-blue-400/50 shadow-2xs whitespace-nowrap">
                                📅 {paper.year}
                              </span>
                              <h3 className="text-lg sm:text-xl font-bold font-serif text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                                Viva Voce — {paper.year}
                              </h3>
                            </div>

                            {/* Center Matrix: The horizontal metric items tracking timeline boundaries cleanly */}
                            <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-zinc-300 flex-wrap font-sans lg:justify-center">
                              <span className="whitespace-nowrap">⏱️ {paper.duration || '45 Mins / Candidate'}</span>
                              <span className="text-zinc-600 font-bold">•</span>
                              <span className="whitespace-nowrap">🎯 Maximum Marks: {paper.maxMarks || 100}</span>
                              <span className="text-zinc-600 font-bold">•</span>
                              <span className="whitespace-nowrap">📦 Size: {paper.fileSize || '84 KB'}</span>
                              <span className="text-zinc-600 font-bold hidden xl:inline">•</span>
                              <span className="text-emerald-400 font-semibold items-center gap-1 hidden xl:flex whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>✓ Verified DHIU Board Archive</span>
                              </span>
                            </div>

                            {/* Far Right Edge: Horizontally align the two primary action button triggers level with the data row */}
                            <div 
                              className="flex items-center gap-2.5 shrink-0 self-start lg:self-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                id={`btn-viva-preview-${paper.year}`}
                                type="button"
                                onClick={() => setPreviewPaper(paper)}
                                className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-purple-200 hover:text-white text-xs font-bold border border-purple-400/50 hover:border-purple-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                              >
                                <Eye className="w-4 h-4 text-purple-400" />
                                <span>👁️ Preview Paper</span>
                              </button>

                              <button
                                id={`btn-viva-download-${paper.year}`}
                                type="button"
                                onClick={() => handleDownload(paper)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border-t-2 border-t-white/30 border-b-2 border-b-zinc-950 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                              >
                                <Download className="w-4 h-4 text-white" />
                                <span>📥 Download</span>
                              </button>

                              <div 
                                className={`w-9 h-9 rounded-xl bg-zinc-900 border border-purple-500/40 flex items-center justify-center text-purple-300 transition-transform duration-300 shadow-inner cursor-pointer hover:bg-zinc-800 shrink-0 ${
                                  isExpanded ? 'rotate-180 bg-purple-950/80 text-purple-200 border-purple-400' : ''
                                }`}
                                title={isExpanded ? 'Collapse attached materials' : 'Expand attached materials'}
                                onClick={() => toggleVivaCard(paper.id)}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          {/* Attached Resources Drawer */}
                          {isExpanded && (
                            <div 
                              className="pt-4 border-t border-zinc-800/90 space-y-3.5 animate-smooth-entry text-left"
                              id={`attached-resources-panel-${paper.year}`}
                              dir="ltr"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between text-left">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                                  <span>📚 Attached Assessment Materials &amp; References</span>
                                </h4>
                                <span className="text-[10px] font-mono text-purple-300 font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60">
                                  Certified DHIU Board Bundle
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left" dir="ltr">
                                {/* Document Segment Block */}
                                <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/95 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                                  <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                                    <span>Document Segment (PDF Downloads &amp; Rubrics)</span>
                                  </div>

                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                                      <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                        <span className="text-rose-400 font-bold shrink-0">📄</span>
                                        <span className="truncate">{paper.year} Viva Voce Core Evaluation Rubric.pdf</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setPreviewPaper(paper)}
                                        className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                                      >
                                        Open Document →
                                      </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                                      <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                        <span className="text-rose-400 font-bold shrink-0">📄</span>
                                        <span className="truncate">{paper.year} DHIU Tajweed &amp; Oral Dialectics Manual.pdf</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setPreviewPaper(paper)}
                                        className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                                      >
                                        Open Document →
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Web Hyperlink Segment Block */}
                                <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/95 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                                  <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                                    <Globe className="w-3.5 h-3.5 text-pink-400" />
                                    <span>Web Hyperlink Segment (Reference Guidelines)</span>
                                  </div>

                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                                      <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                        <span className="shrink-0">🌐</span>
                                        <span className="truncate">DHIU Interview Guidelines</span>
                                        <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => onShowToast('🌐 Opening DHIU Interview Guidelines: https://dhiu.edu.eg/viva-guidelines')}
                                        className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                                      >
                                        <span>Visit Portal ↗</span>
                                      </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                                      <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                        <span className="shrink-0">🌐</span>
                                        <span className="truncate">Central Oral Evaluation Standards</span>
                                        <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => onShowToast('🌐 Opening Central Oral Standards: https://dhiu.edu.eg/oral-standards')}
                                        className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                                      >
                                        <span>Visit Portal ↗</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TIER 2: RECONSTRUCTED SELECTION INTERFACE                */}
      {/* For Class 10: Advanced 3-Column Layout with Viva Voce    */}
      {/* For Classes 1-9: Standard Twin-Column Semester Layout    */}
      {/* ======================================================== */}
      {selectedClass && !selectedSemester && !isVivaMode && (
        <div className="space-y-6 animate-fade-in" id="dhiu-tier-2-semester-view">
          
          {/* Header Block with Prominent Headline & Curriculum Tag */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-[1.5px] border-sky-300/80 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Academic Curriculum • {selectedClass.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
              {selectedClass.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              {selectedClass.id === 10
                ? 'Select a semester below or enter the specialized Viva Voce oral examination registry to explore comprehensive question papers, evaluation criteria, and oral review rubrics.'
                : 'Select a semester below to browse all available subjects, syllabus components, and examination papers.'}
            </p>
          </div>

          {/* Conditional Layout: 3-Column Split for Class 10 vs 2-Column for Classes 1-9 */}
          {selectedClass.id === 10 ? (
            /* CLASS 10: 3-COLUMN HORIZONTAL GROUP CONFIGURATION */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="class-10-three-column-grid">
              
              {/* CARD 1 (Far Left): Semester 1 (Term 1) */}
              <div
                id="card-dhiu-class10-semester-1"
                onClick={() => setSelectedSemester(DHIU_SEMESTERS[0])}
                className="group p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-slate-300/80 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 active:scale-[0.99]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Crisp Green Term 1 calendar icon sub-badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Term 1</span>
                    </span>

                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                      Half-Yearly Board
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Semester 1
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                      First half-yearly cycle encompassing mid-term syllabus units, formative milestones, and half-yearly board examinations.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> 12 Subjects
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" /> 2000–2024
                    </span>
                  </div>
                </div>

                {/* Base text button: "Select Semester →" */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Select Semester →</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* CARD 2 (Center Grid): Semester 2 (Term 2) */}
              <div
                id="card-dhiu-class10-semester-2"
                onClick={() => setSelectedSemester(DHIU_SEMESTERS[1])}
                className="group p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-slate-300/80 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 active:scale-[0.99]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Crisp Teal Term 2 calendar icon sub-badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-800 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Term 2</span>
                    </span>

                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                      Annual Promotional
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Semester 2
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                      Second annual cycle covering advanced graduation modules, comprehensive revision syllabi, and final promotional examinations.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-teal-500" /> 12 Subjects
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-teal-500" /> 2000–2024
                    </span>
                  </div>
                </div>

                {/* Base text button: "Select Semester →" */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>Select Semester →</span>
                  <span className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* CARD 3 (Far Right - SPECIALIZED EXPANDED SECTION): "Viva Voce" (The Oral Examination Hub) */}
              <div
                id="card-dhiu-class10-viva-voce"
                onClick={() => {
                  setIsVivaMode(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border-[1.5px] border-fuchsia-400/80 dark:border-fuchsia-500/70 hover:border-fuchsia-300 dark:hover:border-fuchsia-300 shadow-[0_0_22px_rgba(217,70,239,0.18)] dark:shadow-[0_0_30px_rgba(217,70,239,0.25)] hover:shadow-[0_0_42px_rgba(217,70,239,0.45),0_0_85px_rgba(236,72,153,0.25),inset_0_0_26px_rgba(217,70,239,0.18)] dark:hover:shadow-[0_0_52px_rgba(217,70,239,0.58),0_0_95px_rgba(236,72,153,0.32),inset_0_0_32px_rgba(217,70,239,0.28)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 overflow-hidden active:scale-[0.99]"
              >
                {/* Subtle Ambient Glowing Backing Auras */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-fuchsia-500/15 dark:bg-fuchsia-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-140 group-hover:bg-fuchsia-400/35 dark:group-hover:bg-fuchsia-400/40 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/15 dark:bg-pink-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-140 group-hover:bg-pink-400/35 dark:group-hover:bg-pink-400/40 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10 space-y-4">
                  {/* Top Row: Miniature Speaking Megaphone Icon with Tactile Rotate & Pulse Hover Animation & Glowing Sub-Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-fuchsia-500/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-fuchsia-500/50 transition-all duration-300">
                        <Megaphone className="w-5 h-5 text-white group-hover:rotate-12 group-hover:scale-125 group-hover:text-pink-200 group-hover:animate-pulse transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-700 group-hover:border-fuchsia-400 dark:group-hover:border-fuchsia-500 group-hover:bg-fuchsia-200/80 dark:group-hover:bg-fuchsia-900/60 transition-colors">
                        Class 10 Exclusive
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-950/50 px-2 py-0.5 rounded-md border border-fuchsia-200 dark:border-fuchsia-800 group-hover:border-fuchsia-300 dark:group-hover:border-fuchsia-600 transition-colors">
                      Central Board
                    </span>
                  </div>

                  {/* Title & Metadata with High-Impact Vibrant Glowing Typography */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 dark:from-fuchsia-400 dark:via-pink-400 dark:to-rose-400 group-hover:from-fuchsia-500 group-hover:to-pink-500 transition-all">
                        Viva Voce
                      </h2>
                      <span className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 font-sans">
                        Oral Hub
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed">
                      Central Examination Board grand oral defense repository. Access past oral review prompts, interview scoresheets, Quranic recitation rubrics, and dissertation defense criteria.
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="flex items-center gap-3 text-xs text-fuchsia-800 dark:text-fuchsia-200 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-bold">
                      <Volume2 className="w-3.5 h-3.5 text-fuchsia-500" /> Oral Prompts
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold">
                      <Award className="w-3.5 h-3.5 text-pink-500" /> 2000–2024 Archive
                    </span>
                  </div>
                </div>

                {/* Explicit Colorful Action Link: "Enter Oral Registry →" with Tactile Breathe Effect */}
                <div className="relative z-10 pt-4 border-t border-fuchsia-200/80 dark:border-fuchsia-800/80 flex items-center justify-between text-sm font-extrabold group-hover-breathe">
                  <span className="text-fuchsia-700 dark:text-fuchsia-300 font-bold flex items-center gap-1.5 transition-colors group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-200">
                    <span>Enter Oral Registry</span>
                    <span className="text-fuchsia-500 dark:text-fuchsia-400 font-extrabold">→</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-fuchsia-500/30 group-hover-icon-breathe transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* CLASSES 1-9: STANDARD TWIN-COLUMN SEMESTER CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card Left: Semester 1 (Term 1) */}
              <div
                id="card-dhiu-semester-1"
                onClick={() => setSelectedSemester(DHIU_SEMESTERS[0])}
                className="group p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-slate-300/80 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Green Term 1 calendar icon sub-badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Term 1</span>
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                      Half-Yearly Examination
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Semester 1
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {DHIU_SEMESTERS[0].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> 12 Core Subjects
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" /> 2000–2024 Archive
                    </span>
                  </div>
                </div>

                {/* Base Call-To-Action Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Select Semester →</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card Right: Semester 2 (Term 2) */}
              <div
                id="card-dhiu-semester-2"
                onClick={() => setSelectedSemester(DHIU_SEMESTERS[1])}
                className="group p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-slate-300/80 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Teal Term 2 calendar icon sub-badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-800 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Term 2</span>
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                      Annual Promotional Exam
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Semester 2
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {DHIU_SEMESTERS[1].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-teal-500" /> 12 Core Subjects
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-teal-500" /> 2000–2024 Archive
                    </span>
                  </div>
                </div>

                {/* Base Call-To-Action Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>Select Semester →</span>
                  <span className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* SPECIALIZED VIVA VOCE CHRONOLOGICAL FEED (CLASS 10)      */}
      {/* ======================================================== */}
      {selectedClass && selectedClass.id === 10 && isVivaMode && (
        <div className="space-y-7 animate-fade-in relative z-30 overflow-visible text-left" id="dhiu-class10-viva-feed-view" dir="ltr">
          
          {/* Header & Evaluation Scope Banner - overflow-visible ensures dropdown doesn't clip */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-purple-500/40 dark:border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-visible space-y-5 z-40">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-40 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-visible">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono border border-purple-300 dark:border-purple-800 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                    <span>Class 10 • Central Examination Board</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300 border border-pink-300 dark:border-pink-800">
                    Grand Oral Examination Registry
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <span>Viva Voce</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400">
                    Oral Archive
                  </span>
                </h1>
              </div>

              {/* Viva Action Buttons & Quick Search */}
              <div className="relative z-50 flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0 overflow-visible">
                <div className="flex items-center gap-2 flex-wrap overflow-visible">
                  {/* Action 1: "🎮 Play Quiz" Trigger */}
                  <button
                    id="btn-play-viva-quiz"
                    onClick={() => setIsVivaQuizModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-purple-950/70 dark:bg-purple-950/90 hover:bg-purple-900/90 text-purple-100 hover:text-white backdrop-blur-xl border-[1.5px] border-purple-400/80 dark:border-purple-500/80 hover:border-fuchsia-400 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap font-extrabold text-xs group"
                  >
                    <Gamepad2 className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                    <span>🎮 Play Quiz</span>
                  </button>

                  {/* Action 2: "+ Upload Viva Voce Paper" */}
                  <button
                    id="btn-upload-viva-paper"
                    onClick={() => handleOpenUploadModal('Viva Voce', 10, 3)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" />
                    <span>+ Upload Viva Voce Paper</span>
                  </button>

                  {/* Action 3: "⏱️ Recently Uploaded" Tracker Button & Dropdown */}
                  <div className="relative z-[9999] overflow-visible" style={{ zIndex: 9999 }}>
                    <button
                      id="btn-recently-uploaded-viva"
                      type="button"
                      onClick={() => setIsRecentUploadsOpen(prev => !prev)}
                      className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap backdrop-blur-md ${
                        isRecentUploadsOpen
                          ? 'bg-purple-600/30 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                          : 'border-purple-500/30 text-purple-400 hover:text-purple-200 bg-white/10 hover:bg-purple-50/10 dark:bg-zinc-900/60 dark:hover:bg-purple-950/40 hover:border-purple-400 shadow-2xs'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>⏱️ Recently Uploaded</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRecentUploadsOpen ? 'rotate-180 text-purple-300' : 'text-purple-400/80'}`} />
                    </button>

                    {/* Elevated Pop-up Dropdown Menu (Z-index 9999) with Massive Drop Shadow Aura and Deep Backdrop Blur */}
                    {isRecentUploadsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px]" 
                          style={{ zIndex: 9998 }}
                          onClick={() => setIsRecentUploadsOpen(false)} 
                        />
                        <div 
                          id="dropdown-recently-uploaded-materials"
                          style={{ zIndex: 9999 }}
                          className="absolute left-0 sm:left-0 top-full mt-2 w-[340px] sm:w-[440px] p-4 sm:p-5 rounded-3xl bg-zinc-950/98 dark:bg-zinc-950/98 text-white border-[1.5px] border-purple-500/50 backdrop-blur-3xl shadow-2xl shadow-black/90 ring-1 ring-white/10 z-[9999] animate-fade-in space-y-4"
                        >
                          {/* Pop-up Header Bar: Left-Aligned Text */}
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                            <div className="flex items-center gap-2.5 text-left">
                              <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 shrink-0">
                                <Clock className="w-4 h-4 text-purple-300" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-bold font-serif text-white tracking-wide text-left">
                                  Recently Uploaded Materials
                                </h4>
                                <p className="text-[10px] text-purple-300/80 font-mono text-left">
                                  Ingested Viva documents &amp; active portal links
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              id="btn-close-recently-uploaded-dropdown"
                              onClick={() => setIsRecentUploadsOpen(false)}
                              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Live History Stream Structure (PDFs & Hyperlinks) */}
                          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                            
                            {/* Segment 1: PDF Documents - Level Single Horizontal Row with Balanced Padding */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 uppercase tracking-wider font-mono py-1 px-1">
                                <span className="flex items-center gap-1.5 leading-none">
                                  <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>PDF DOCUMENTS</span>
                                </span>
                                <span className="text-[10px] leading-none px-2.5 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold uppercase tracking-wider shrink-0 flex items-center justify-center">
                                  {recentPdfDocuments.length} FILES
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                {recentPdfDocuments.map((doc, idx) => (
                                  <div 
                                    key={`recent-doc-${idx}`}
                                    className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-purple-500/20 hover:border-purple-500/50 transition-all flex items-center justify-between gap-3 group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 text-left">
                                      <span className="text-base shrink-0">📄</span>
                                      <div className="min-w-0 text-left">
                                        <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors text-left">
                                          {doc.name}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5 text-left">
                                          <span>{doc.size}</span>
                                          <span>•</span>
                                          <span className="text-purple-400">{doc.date}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      id={`btn-open-recent-doc-${idx}`}
                                      onClick={() => {
                                        setPreviewPaper(doc.paper);
                                        setIsRecentUploadsOpen(false);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs hover:shadow-purple-500/20 active:scale-95"
                                    >
                                      Open Document
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Segment 2: Web Hyperlinks - Level Single Horizontal Row with Balanced Padding */}
                            <div className="space-y-2 pt-2 border-t border-purple-500/20">
                              <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 uppercase tracking-wider font-mono py-1 px-1">
                                <span className="flex items-center gap-1.5 leading-none">
                                  <Globe className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                  <span>WEB HYPERLINKS</span>
                                </span>
                                <span className="text-[10px] leading-none px-2.5 py-1 rounded-full bg-pink-900/60 border border-pink-500/40 text-pink-200 font-bold uppercase tracking-wider shrink-0 flex items-center justify-center">
                                  {recentWebLinks.length} PORTALS
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                {recentWebLinks.map((link, idx) => (
                                  <div 
                                    key={`recent-link-${idx}`}
                                    className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-purple-500/20 hover:border-pink-500/50 transition-all flex items-center justify-between gap-3 group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 text-left">
                                      <span className="text-base shrink-0">🌐</span>
                                      <div className="min-w-0 text-left">
                                        <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-pink-300 transition-colors text-left">
                                          {link.title}
                                        </div>
                                        <div className="text-[10px] text-pink-400/90 font-mono truncate mt-0.5 text-left">
                                          ({link.url})
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      id={`btn-visit-recent-link-${idx}`}
                                      onClick={() => {
                                        window.open(link.url, '_blank', 'noopener,noreferrer');
                                        onShowToast(`🌐 Opening portal: ${link.title}`);
                                        setIsRecentUploadsOpen(false);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600 border border-pink-500/40 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs hover:shadow-pink-500/20 active:scale-95 flex items-center gap-1"
                                    >
                                      <span>Visit Portal ↗</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>

                          {/* Footer Ingest Action */}
                          <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-zinc-400">
                            <span>Upload new Viva rubrics or URLs:</span>
                            <button
                              type="button"
                              id="btn-recent-popup-upload-more"
                              onClick={() => {
                                setIsRecentUploadsOpen(false);
                                handleOpenUploadModal('Viva Voce', 10, 3);
                              }}
                              className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>+ Ingest Material</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative w-full sm:w-48 shrink-0">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="input-search-viva-year"
                    type="text"
                    value={vivaSearchQuery}
                    onChange={e => setVivaSearchQuery(e.target.value)}
                    placeholder="Search Viva keyword..."
                    className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-purple-300 dark:border-purple-800/80 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 4 Oral Focus Area Indicators */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-100 dark:border-zinc-800/80">
              <div className="p-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-[11px] font-medium text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Qur’an &amp; Tajweed (25M)</span>
              </div>
              <div className="p-2 rounded-xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-800/40 text-[11px] font-medium text-pink-900 dark:text-pink-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Arabic Eloquence (25M)</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-[11px] font-medium text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Fiqh Defense (25M)</span>
              </div>
              <div className="p-2 rounded-xl bg-fuchsia-50/70 dark:bg-fuchsia-950/40 border border-fuchsia-200/60 dark:border-fuchsia-800/40 text-[11px] font-medium text-fuchsia-900 dark:text-fuchsia-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
                <span>Capstone Thesis (25M)</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. CHRONOLOGICAL FILTER DROPDOWN SYSTEM ("SEARCH BY YEAR") */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-purple-500/40 dark:border-purple-500/50 shadow-sm space-y-3 relative overflow-visible z-10" id="viva-year-filter-system">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-visible">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-extrabold font-serif text-slate-900 dark:text-white">
                  📅 Filter by Viva Year
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  (2005 – 2026 Archive)
                </span>
              </div>

              {/* Active Selection Badge & Quick Reset */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Active Year: {selectedVivaYear === 'All' ? 'All Archive Years (2000–2026)' : `Year ${selectedVivaYear}`}
                </span>

                {selectedVivaYear !== 'All' && (
                  <button
                    onClick={() => setSelectedVivaYear('All')}
                    className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer px-2 py-1"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Click Dropdown Interface Bar */}
            <div className="relative z-40">
              <button
                id="btn-viva-year-dropdown-toggle"
                onClick={() => setIsVivaYearDropdownOpen(!isVivaYearDropdownOpen)}
                className="w-full px-4 py-3 rounded-xl bg-purple-50/80 dark:bg-zinc-800/90 border border-purple-300 dark:border-purple-700/80 text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center justify-between hover:bg-purple-100/70 dark:hover:bg-zinc-800 shadow-xs transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>
                    {selectedVivaYear === 'All' 
                      ? '📅 Displaying: All Operational Years (2000 – 2026)' 
                      : `🎯 Filtered to Viva Year: ${selectedVivaYear}`}
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-purple-500 transition-transform duration-200 ${isVivaYearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Glassmorphism Selection Sheet for Year Tokens (2005 to 2026) */}
              {isVivaYearDropdownOpen && (
                <div 
                  id="viva-year-dropdown-sheet"
                  className="absolute z-50 top-full left-0 right-0 mt-2 p-4 rounded-xl bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-[1.5px] border-purple-500/50 shadow-2xl shadow-purple-950/30 animate-fade-in space-y-3"
                  style={{ zIndex: 50, borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-zinc-400 border-b border-purple-100 dark:border-zinc-800 pb-2">
                    <span>Select Year Token to Filter Registry Viewport:</span>
                    <span className="text-[11px] text-purple-500 font-mono">2005 – 2026 Cycles</span>
                  </div>

                  {/* Year Token Pill Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-1">
                    <button
                      type="button"
                      id="token-viva-year-all"
                      onClick={() => {
                        setSelectedVivaYear('All');
                        setIsVivaYearDropdownOpen(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer col-span-2 ${
                        selectedVivaYear === 'All'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      🌟 All Years
                    </button>

                    {CHRONOLOGICAL_YEAR_OPTIONS.map(yr => {
                      const isSelected = selectedVivaYear === yr;
                      return (
                        <button
                          key={yr}
                          type="button"
                          id={`token-viva-year-${yr}`}
                          onClick={() => {
                            setSelectedVivaYear(yr);
                            setIsVivaYearDropdownOpen(false);
                            onShowToast(`📅 Viewport filtered exclusively to Viva Year ${yr}`);
                          }}
                          className={`px-2.5 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-2 ring-purple-400'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-zinc-700 hover:text-purple-700 dark:hover:text-purple-300'
                          }`}
                        >
                          {yr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* PART 2: VIVA VOCE ORAL ARCHIVE — LEFT-TO-RIGHT FEED     */}
          {/* ======================================================== */}
          <div className="space-y-4 text-left" id="viva-cards-container" dir="ltr">
            {vivaPapers.map(paper => {
              const isExpanded = expandedVivaCardIds.has(paper.id);
              return (
                <div
                  key={paper.id}
                  id={`card-viva-paper-${paper.year}`}
                  onClick={() => toggleVivaCard(paper.id)}
                  dir="ltr"
                  className="p-4 sm:p-5 rounded-[16px] bg-[#09090b] dark:bg-[#09090b] backdrop-blur-xl border-[1.5px] border-purple-500/50 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] border-t-2 border-t-white/20 border-b-4 border-b-black transition-all duration-300 space-y-3 cursor-pointer group text-left relative overflow-hidden"
                >
                  {/* Linear Single Horizontal Row: Far Left (Year & Headline), Center Matrix (Metrics), Far Right Edge (Buttons) */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left" dir="ltr">
                    {/* Far Left: The blue year capsule ("📅 2026") right next to the white text headline ("Viva Voce — 2026") */}
                    <div className="flex items-center gap-3 shrink-0 text-left">
                      <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 font-mono font-extrabold text-xs border border-blue-400/50 shadow-2xs whitespace-nowrap">
                        📅 {paper.year}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                        Viva Voce — {paper.year}
                      </h3>
                    </div>

                    {/* Center Matrix: The horizontal metric items tracking timeline boundaries cleanly */}
                    <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-zinc-300 flex-wrap font-sans lg:justify-center">
                      <span className="whitespace-nowrap">⏱️ {paper.duration || '45 Mins / Candidate'}</span>
                      <span className="text-zinc-600 font-bold">•</span>
                      <span className="whitespace-nowrap">🎯 Maximum Marks: {paper.maxMarks || 100}</span>
                      <span className="text-zinc-600 font-bold">•</span>
                      <span className="whitespace-nowrap">📦 Size: {paper.fileSize || '84 KB'}</span>
                      <span className="text-zinc-600 font-bold hidden xl:inline">•</span>
                      <span className="text-emerald-400 font-semibold items-center gap-1 hidden xl:flex whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Verified DHIU Board Archive</span>
                      </span>
                    </div>

                    {/* Far Right Edge: Horizontally align the two primary action button triggers level with the data row */}
                    <div 
                      className="flex items-center gap-2.5 shrink-0 self-start lg:self-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        id={`btn-viva-preview-${paper.year}`}
                        type="button"
                        onClick={() => setPreviewPaper(paper)}
                        className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-purple-200 hover:text-white text-xs font-bold border border-purple-400/50 hover:border-purple-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span>👁️ Preview Paper</span>
                      </button>

                      <button
                        id={`btn-viva-download-${paper.year}`}
                        type="button"
                        onClick={() => handleDownload(paper)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border-t-2 border-t-white/30 border-b-2 border-b-zinc-950 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        <Download className="w-4 h-4 text-white" />
                        <span>📥 Download</span>
                      </button>

                      <div 
                        className={`w-9 h-9 rounded-xl bg-zinc-900 border border-purple-500/40 flex items-center justify-center text-purple-300 transition-transform duration-300 shadow-inner cursor-pointer hover:bg-zinc-800 shrink-0 ${
                          isExpanded ? 'rotate-180 bg-purple-950/80 text-purple-200 border-purple-400' : ''
                        }`}
                        title={isExpanded ? 'Collapse attached materials' : 'Expand attached materials'}
                        onClick={() => toggleVivaCard(paper.id)}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Attached Resources Drawer */}
                  {isExpanded && (
                    <div 
                      className="pt-4 border-t border-zinc-800/90 space-y-3.5 animate-smooth-entry text-left"
                      id={`attached-resources-panel-${paper.year}`}
                      dir="ltr"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between text-left">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>📚 Attached Assessment Materials &amp; References</span>
                        </h4>
                        <span className="text-[10px] font-mono text-purple-300 font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60">
                          Certified DHIU Board Bundle
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left" dir="ltr">
                        {/* Document Segment Block */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/95 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                          <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                            <span>Document Segment (PDF Downloads &amp; Rubrics)</span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                              <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                <span className="text-rose-400 font-bold shrink-0">📄</span>
                                <span className="truncate">{paper.year} Viva Voce Core Evaluation Rubric.pdf</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewPaper(paper)}
                                className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                              >
                                Open Document →
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                              <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                <span className="text-rose-400 font-bold shrink-0">📄</span>
                                <span className="truncate">{paper.year} DHIU Tajweed &amp; Oral Dialectics Manual.pdf</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewPaper(paper)}
                                className="text-xs font-extrabold text-purple-300 hover:text-purple-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-colors shrink-0"
                              >
                                Open Document →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Web Hyperlink Segment Block */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/95 border border-purple-500/30 space-y-3 shadow-2xs text-left">
                          <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                            <Globe className="w-3.5 h-3.5 text-pink-400" />
                            <span>Web Hyperlink Segment (Reference Guidelines)</span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                              <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                <span className="shrink-0">🌐</span>
                                <span className="truncate">DHIU Interview Guidelines</span>
                                <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => onShowToast('🌐 Opening DHIU Interview Guidelines: https://dhiu.edu.eg/viva-guidelines')}
                                className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                              >
                                <span>Visit Portal ↗</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 text-xs py-0.5">
                              <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs flex items-center gap-1.5">
                                <span className="shrink-0">🌐</span>
                                <span className="truncate">Central Oral Evaluation Standards</span>
                                <span className="text-[10px] text-purple-400 font-mono hidden sm:inline">(dhiu.edu.eg)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => onShowToast('🌐 Opening Central Oral Standards: https://dhiu.edu.eg/oral-standards')}
                                className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800/60 text-xs font-bold text-pink-300 hover:bg-pink-900/80 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
                              >
                                <span>Visit Portal ↗</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {/* Empty State when filter yields 0 */}
            {vivaPapers.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-4">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="space-y-1 max-w-md mx-auto">
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                    No Viva records found matching your filter criteria
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    No oral examination registry entries matched year token "{selectedVivaYear}" or search query "{vivaSearchQuery}".
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedVivaYear('All');
                      setVivaSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 cursor-pointer"
                  >
                    Reset Year Filter
                  </button>
                  <button
                    onClick={() => handleOpenUploadModal('Viva Voce', 10, 3)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>📤 Upload Viva Paper</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 4. THE "LIVE TALENT SHOW" GAMIFIED QUIZ MODAL CAPSTONE   */}
          {/* ======================================================== */}
          {isVivaQuizModalOpen && (
            <div 
              id="modal-viva-talent-quiz"
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
            >
              <div className="w-full max-w-4xl my-auto relative">
                <LiveTalentShowQuiz 
                  onOpenLiveBroadcaster={() => {
                    setIsVivaQuizModalOpen(false);
                    setIsLiveBroadcasterOpen(true);
                  }}
                  onShowToast={onShowToast}
                  onClose={() => setIsVivaQuizModalOpen(false)}
                />
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TIER 3: THEMATIC SUBJECT DIRECTORY GRID (13 SUBJECTS)   */}
      {/* ======================================================== */}
      {selectedClass && selectedSemester && !selectedSubject && !isVivaMode && (
        <div className="space-y-6 animate-fade-in" id="dhiu-tier-3-subject-grid">
          
          {/* Header Block with Headline, Upload Trigger & Filter Search Box */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-[1.5px] border-sky-300/80 dark:border-zinc-800 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono">
                  {selectedClass.name} • {selectedSemester.name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                Select Subject
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-300">
                Choose from the core curriculum disciplines or upload new verified past year papers.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Universal Upload Button in Subject Grid */}
              <button
                id="btn-upload-subject-grid-paper"
                onClick={() => handleOpenUploadModal(undefined, selectedClass.id, selectedSemester.id)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload Question Paper</span>
              </button>

              {/* Clean Filtering Text Input Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-filter-dhiu-subjects"
                  type="text"
                  value={subjectFilterQuery}
                  onChange={e => setSubjectFilterQuery(e.target.value)}
                  placeholder="🔍 Filter subjects..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Symmetrical Grid of the Explicit Subject Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSubjects.map(subj => (
              <div
                key={subj.id}
                id={`card-dhiu-subject-${subj.id}`}
                onClick={() => setSelectedSubject(subj)}
                className="group p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border-[1.5px] border-slate-300/80 dark:border-zinc-800 hover:border-sky-500 dark:hover:border-sky-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between h-48 active:scale-[0.98]"
              >
                {/* Top Row: Open Book Logo & Category Pill */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 truncate max-w-[120px]">
                    {subj.category}
                  </span>
                </div>

                {/* Middle: Bold Charcoal Text Title & Arabic Subtitle */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {subj.name}
                    </h3>
                    <span className="text-xs font-arabic-quote text-slate-500 dark:text-zinc-400" dir="rtl">
                      {subj.arabicName.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                    {subj.description}
                  </p>
                </div>

                {/* Bottom Row: Active Paper Count & Interactive Anchor Link "Open →" */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-zinc-400 text-[11px]">
                    {subj.paperCount} Past Papers
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Open</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No subjects found matching "{subjectFilterQuery}"</p>
              <button
                onClick={() => setSubjectFilterQuery('')}
                className="mt-3 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TIER 4: CHRONOLOGICAL PYQ YEAR SELECTION FEED (2000-NOW) */}
      {/* ======================================================== */}
      {selectedClass && selectedSemester && selectedSubject && (
        <div className="space-y-6 animate-fade-in relative overflow-visible" id="dhiu-tier-4-year-feed">
          
          {/* Header & Controls Matrix - overflow-visible and relative z-30 to prevent popover clipping */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-[1.5px] border-sky-300/80 dark:border-zinc-800 shadow-sm space-y-5 relative overflow-visible z-30">
            
            {/* Top Row: Context Badges, Title, and Prominent High-Visibility Green Upload Button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono">
                    {selectedClass.name}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                    {selectedSemester.name}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                    {selectedSubject.code}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{selectedSubject.name} — Past Year Papers</span>
                </h1>
                
                <p className="text-xs text-slate-600 dark:text-zinc-300">
                  Chronologically indexed examination papers with verified board answer rubrics.
                </p>
              </div>

              {/* Action Controls & Global Upload Trigger */}
              <div className="flex items-center gap-3 flex-wrap shrink-0">
                {/* Prominent High-Visibility Green Action Button: "+ Upload [Subject] Paper" */}
                <button
                  id={`btn-upload-${selectedSubject.name.toLowerCase().replace(/\s+/g, '-')}-paper`}
                  onClick={() => handleOpenUploadModal(selectedSubject.name, selectedClass.id, selectedSemester.id)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap border border-emerald-400/50"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Upload {selectedSubject.name} Paper</span>
                </button>

                {/* Exam Type Filter Pills */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs">
                  {(['All', 'Annual', 'Half-Yearly', 'Model / Pre-Board'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedExamTypeFilter(type)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        selectedExamTypeFilter === type
                          ? 'bg-sky-600 text-white shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {type === 'Model / Pre-Board' ? 'Model' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 2: CHRONOLOGICAL SEARCH BY YEAR DROPDOWN PICKER  */}
            {/* ======================================================== */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-visible z-30">
              <div className="flex items-center gap-3 flex-wrap flex-1 overflow-visible">
                
                {/* "📅 Search by Year" Interactive Dropdown Module */}
                <div className="relative z-40">
                  <button
                    id="btn-dropdown-search-by-year"
                    type="button"
                    onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                    className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border-[1.5px] border-sky-400/80 dark:border-sky-500/60 text-slate-900 dark:text-zinc-100 text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>
                      {selectedDropdownYear === 'All' ? '📅 Search by Year' : `📅 Year: ${selectedDropdownYear}`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Interactive Pop-Up Dropdown Sheet (Years 2005 to 2026) - Maximum z-50 Layer Dominance & 12px Radius */}
                  {isYearDropdownOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-72 rounded-xl bg-white/98 dark:bg-zinc-900/98 backdrop-blur-2xl border-[1.5px] border-slate-300/90 dark:border-zinc-700/90 shadow-2xl shadow-slate-900/25 dark:shadow-black/70 z-50 p-3.5 space-y-2.5 animate-fade-in"
                      id="popover-search-year-dropdown"
                      style={{ zIndex: 50, borderRadius: '12px' }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                          SELECT ACADEMIC YEAR
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDropdownYear('All');
                            setIsYearDropdownOpen(false);
                          }}
                          className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          View All Years
                        </button>
                      </div>

                      {/* Scrollable Year Grid */}
                      <div className="max-h-56 overflow-y-auto grid grid-cols-3 gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDropdownYear('All');
                            setIsYearDropdownOpen(false);
                          }}
                          className={`col-span-3 py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                            selectedDropdownYear === 'All'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200'
                          }`}
                        >
                          All Archive Years (2000–2026)
                        </button>

                        {CHRONOLOGICAL_YEAR_OPTIONS.map(yr => (
                          <button
                            key={yr}
                            type="button"
                            id={`btn-year-option-${yr}`}
                            onClick={() => {
                              setSelectedDropdownYear(yr);
                              setIsYearDropdownOpen(false);
                            }}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all text-center cursor-pointer ${
                              selectedDropdownYear === yr
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-zinc-800/80 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-400 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60'
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct text filter input */}
                <div className="relative w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="input-search-year"
                    type="text"
                    value={yearSearchQuery}
                    onChange={e => setYearSearchQuery(e.target.value)}
                    placeholder="Filter Year (e.g. 2023)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Active Year Filter Pill */}
                {selectedDropdownYear !== 'All' && (
                  <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 border border-sky-300 dark:border-sky-800">
                    <span>Filtering: {selectedDropdownYear}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDropdownYear('All')}
                      className="hover:text-rose-500 cursor-pointer font-extrabold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Total Active Records Count */}
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                Showing {currentPapers.length} question paper{currentPapers.length !== 1 ? 's' : ''}
              </span>
            </div>

          </div>

          {/* Chronological List of Year Row Cards */}
          <div className="space-y-3">
            {currentPapers.map(paper => (
              <div
                key={paper.id}
                id={`row-dhiu-paper-${paper.year}`}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Metadata Badges & Large Bold Title */}
                <div className="space-y-2">
                  {/* Top Metadata Badges */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 flex items-center gap-1 font-mono">
                      📅 {paper.year}
                    </span>
                    
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {paper.examType}
                    </span>
                    
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {paper.section}
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                      {paper.duration} • Max Marks: {paper.maxMarks} • {paper.fileSize}
                    </span>
                  </div>

                  {/* Large Bold Title: Exactly "[Subject] — [Year Number]" */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                    {paper.subject} — {paper.year}
                  </h3>
                </div>

                {/* Right: Two Distinct Utility Buttons (Outline Preview & Solid Teal Download) */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  
                  {/* Outline Icon Button: Preview */}
                  <button
                    id={`btn-preview-paper-${paper.year}`}
                    onClick={() => setPreviewPaper(paper)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-xs border border-slate-300 dark:border-zinc-700 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <span>👁️ Preview</span>
                  </button>

                  {/* Solid Teal Action Button: Download */}
                  <button
                    id={`btn-download-paper-${paper.year}`}
                    onClick={() => handleDownload(paper)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>📥 Download</span>
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* ======================================================== */}
          {/* EMPTY STATE FALLBACK CONTAINER                           */}
          {/* ======================================================== */}
          {currentPapers.length === 0 && (
            <div 
              className="p-10 sm:p-14 text-center rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border-[1.5px] border-dashed border-slate-300 dark:border-zinc-700 space-y-5"
              id="empty-state-pyq-container"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto shadow-sm">
                <FolderOpen className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-100 font-serif">
                  No question papers found. No previous-year papers have been added for this subject yet.
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Upload an existing examination paper scan or syllabus document using the AI multimodal extraction tool to populate this repository.
                </p>
              </div>

              {/* Immediate Secondary Execution Block Button: "📤 Upload Paper" */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-empty-state-upload-paper"
                  onClick={() => handleOpenUploadModal(selectedSubject.name, selectedClass.id, selectedSemester.id)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>📤 Upload Paper</span>
                </button>

                {(selectedDropdownYear !== 'All' || yearSearchQuery || selectedExamTypeFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDropdownYear('All');
                      setYearSearchQuery('');
                      setSelectedExamTypeFilter('All');
                    }}
                    className="px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}
      </>
      )}

      {/* ======================================================== */}
      {/* TIER 5: COMPREHENSIVE DOCUMENT VIEW MODAL LAYER          */}
      {/* ======================================================== */}
      {previewPaper && (
        <DocumentPreviewModal
          paper={previewPaper}
          onClose={() => setPreviewPaper(null)}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {/* ======================================================== */}
      {/* AI MULTIMODAL QUESTION PAPER UPLOAD MODAL LAYER         */}
      {/* ======================================================== */}
      {isUploadModalOpen && (
        <PyqUploadModal
          initialSubject={uploadModalSubject}
          initialClassId={uploadModalClassId}
          initialSemesterId={uploadModalSemesterId}
          onClose={() => setIsUploadModalOpen(false)}
          onPaperSaved={handlePaperSaved}
          onShowToast={onShowToast}
        />
      )}

      {/* ======================================================== */}
      {/* LIVE BROADCASTER STREAM & ORAL TALENT SHOW MODAL LAYER  */}
      {/* ======================================================== */}
      {isLiveBroadcasterOpen && (
        <LiveBroadcasterModal
          onClose={() => setIsLiveBroadcasterOpen(false)}
          onShowToast={onShowToast}
        />
      )}

    </div>
  );
};
