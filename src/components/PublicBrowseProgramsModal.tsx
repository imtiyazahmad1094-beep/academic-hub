import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Globe, 
  Building2, 
  Sparkles, 
  Lock, 
  ArrowRight,
  GraduationCap,
  Atom,
  Scale,
  Dna,
  BookOpen,
  Sun
} from 'lucide-react';
import { AcademicProgram } from '../types';

interface PublicBrowseProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onSelectProgram?: (program: AcademicProgram) => void;
}

interface PublicProgramEntry {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  dayOfWeek: string;
  time: string;
  category: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  location: string;
  organizer: string;
  trackTheme: 'quantum' | 'fiqh' | 'bio' | 'ai' | 'energy';
  bgClass: string;
  badgeClass: string;
  borderClass: string;
  icon: React.ReactNode;
}

const FIVE_CHRONOLOGICAL_PROGRAMS: PublicProgramEntry[] = [
  {
    id: 'prog-1',
    title: 'International Quantum Computing & Neural Algorithms Symposium',
    date: '2026-09-19',
    displayDate: 'Sat, Sep 19, 2026',
    dayOfWeek: 'Saturday',
    time: '09:00 AM - 05:30 PM EST',
    category: 'Quantum Computing & AI',
    format: 'Online',
    location: 'Virtual Auditorium Alpha',
    organizer: 'Cavendish Laboratory & Quantum AI Institute',
    trackTheme: 'quantum',
    bgClass: 'bg-sky-50/80 dark:bg-sky-950/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/50',
    badgeClass: 'bg-sky-100 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    borderClass: 'border-slate-200/80 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500',
    icon: <Atom className="w-4 h-4 text-sky-600 dark:text-sky-400" />
  },
  {
    id: 'prog-islamic-ai',
    title: 'AI Ethics in Islamic Jurisprudence & Governance Workshop',
    date: '2026-09-20',
    displayDate: 'Sun, Sep 20, 2026',
    dayOfWeek: 'Sunday',
    time: '10:00 AM - 04:00 PM EST',
    category: 'Ethics & Islamic Jurisprudence',
    format: 'Online',
    location: 'Zoom Global Academic Webinar',
    organizer: 'Centre for Digital Fiqh & Governance',
    trackTheme: 'fiqh',
    bgClass: 'bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    borderClass: 'border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500',
    icon: <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
  },
  {
    id: 'prog-2',
    title: 'Global Bioethics, CRISPR-Cas14 & Gene Editing Summit',
    date: '2026-09-20',
    displayDate: 'Sun, Sep 20, 2026',
    dayOfWeek: 'Sunday',
    time: '10:00 AM - 06:00 PM CET',
    category: 'Biomedical Ethics & Genomics',
    format: 'Hybrid',
    location: 'Geneva Bioethics Hall & Online Stream',
    organizer: 'World Bioethics Committee & INSERM',
    trackTheme: 'bio',
    bgClass: 'bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100/80 dark:hover:bg-purple-900/50',
    badgeClass: 'bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    borderClass: 'border-slate-200/80 dark:border-slate-800/80 hover:border-purple-400 dark:hover:border-purple-500',
    icon: <Dna className="w-4 h-4 text-purple-600 dark:text-purple-400" />
  },
  {
    id: 'prog-3',
    title: 'Next-Gen AI in Pedagogy & Cognitive Learning Systems',
    date: '2026-09-21',
    displayDate: 'Mon, Sep 21, 2026',
    dayOfWeek: 'Monday',
    time: '01:00 PM - 07:00 PM GMT',
    category: 'Cognitive Science & Education AI',
    format: 'Online',
    location: 'Stanford Academic Digital Hall',
    organizer: 'Global Institute for Cognitive Learning',
    trackTheme: 'ai',
    bgClass: 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/50',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    borderClass: 'border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500',
    icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
  },
  {
    id: 'prog-4',
    title: 'Sustainable Clean Energy & Perovskite Photovoltaics Colloquium',
    date: '2026-09-25',
    displayDate: 'Fri, Sep 25, 2026',
    dayOfWeek: 'Friday',
    time: '09:30 AM - 05:00 PM CET',
    category: 'Clean Tech & Advanced Materials',
    format: 'In-Person',
    location: 'Munich Clean Energy Innovation Centre',
    organizer: 'European Photovoltaic Research Consortium',
    trackTheme: 'energy',
    bgClass: 'bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-900/50',
    badgeClass: 'bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700',
    borderClass: 'border-slate-200/80 dark:border-slate-800/80 hover:border-teal-400 dark:hover:border-teal-500',
    icon: <Sun className="w-4 h-4 text-teal-600 dark:text-teal-400" />
  }
];

export const PublicBrowseProgramsModal: React.FC<PublicBrowseProgramsModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onSelectProgram
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="public-browse-programs-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      {/* Centered Modal Box Container with 16px border-radius, modern glassmorphism, and cyan border outline */}
      <div 
        id="public-browse-programs-modal-container"
        className="relative w-full max-w-3xl my-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-[1.5px] border-cyan-400/60 dark:border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.22)] p-5 sm:p-7 space-y-5 max-h-[92vh] flex flex-col transition-all duration-300 animate-fade-in select-text"
        style={{ borderRadius: '16px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>UPCOMING PUBLIC REGISTRY // 5 NEXT EVENTS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 dark:text-white tracking-tight">
              Curated Academic Programs
            </h2>
            <p className="text-xs font-sans text-slate-600 dark:text-slate-400">
              Browse upcoming symposia, research workshops, and global academic summits.
            </p>
          </div>

          <button
            type="button"
            id="btn-close-browse-programs-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            aria-label="Close browse modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chronological List of Exactly 5 Items (No long descriptions for maximum scannability) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
          {FIVE_CHRONOLOGICAL_PROGRAMS.map((item, index) => (
            <div
              key={item.id}
              id={`public-program-item-${item.id}`}
              onClick={() => {
                if (onSelectProgram) {
                  onSelectProgram({
                    id: item.id,
                    name: item.title,
                    date: item.date,
                    dayOfWeek: item.dayOfWeek,
                    time: item.time,
                    submissionDeadline: 'See details after login',
                    formatType: item.format,
                    mode: item.format === 'In-Person' ? 'Offline' : 'Online',
                    location: item.location,
                    themes: [item.category],
                    abstract: item.title,
                    extractedSummary: [],
                    finalNotes: '',
                    organizerOrChair: item.organizer,
                    registrationUrl: '',
                    documentSource: 'Public_Curated_Registry.pdf',
                    createdAt: '2026-09-01T00:00:00Z',
                    colorTheme: 'blue'
                  });
                  onClose();
                }
              }}
              className={`p-4 rounded-xl border ${item.borderClass} ${item.bgClass} transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              {/* Left Column: Number Marker & Title */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                  0{index + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${item.badgeClass}`}>
                      {item.icon}
                      <span>{item.category}</span>
                    </span>
                    <span className="text-[11px] font-sans font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[200px]">{item.organizer}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Right Column: Date, Time & Mode Badges */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{item.displayDate.replace(', 2026', '')}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-sans text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>{item.format}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.time.split(' - ')[0]}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* High-Contrast "See More" Portal Call-to-Action Box */}
        <div 
          id="browse-programs-cta-auth-box"
          className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white border border-cyan-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-sans text-slate-200 leading-relaxed max-w-lg">
              <strong className="text-cyan-300 font-semibold">🔒 To see more programs,</strong> explore past registries, and track upcoming deadlines, please log in or create an account.
            </p>
          </div>

          <button
            type="button"
            id="btn-browse-programs-modal-auth"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-slate-950 font-sans font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Sign In / Sign Up →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
