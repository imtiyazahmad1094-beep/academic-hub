import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Globe, 
  Building2, 
  FileText, 
  Check, 
  Copy, 
  Edit3, 
  User, 
  BookOpen, 
  ExternalLink,
  BookmarkCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Share2
} from 'lucide-react';
import { AcademicProgram, AcademicAbstract, ProgramMode } from '../types';
import { formatFriendlyDate, getWordCount } from '../utils/academicUtils';

interface ProgramDetailModalProps {
  program: AcademicProgram | null;
  abstracts?: AcademicAbstract[];
  isInterested?: boolean;
  onToggleInterest?: (program: AcademicProgram, interested: boolean) => void;
  onClose: () => void;
  onToggleMode?: (programId: string, currentMode: ProgramMode) => void;
  onEdit?: (program: AcademicProgram) => void;
  onOpenShare?: (url?: string, title?: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  abstracts = [],
  isInterested = false,
  onToggleInterest,
  onClose,
  onEdit,
  onOpenShare,
}) => {
  const [copied, setCopied] = useState(false);

  if (!program) return null;

  // Derive speaker info
  const speakerName = program.organizerOrChair || (
    program.name.includes('Islamic Jurisprudence') 
      ? 'Prof. Dr. Tariq Al-Mansoor' 
      : program.name.includes('Quantum') 
      ? 'Prof. Elena Rostova & Dr. Nathan Chen' 
      : 'Prof. Dr. Marcus Vance'
  );

  const speakerRole = program.name.includes('Islamic Jurisprudence')
    ? 'Keynote Chair & Senior Fiqh Scholar'
    : 'Lead Symposium Chair & Researcher';

  const speakerInstitution = program.name.includes('Islamic Jurisprudence')
    ? 'Centre for Digital Fiqh & AI Governance'
    : program.location.includes('Zoom') || program.location.includes('Virtual')
    ? 'International Academic Consortium'
    : program.location;

  const speakerBio = program.name.includes('Islamic Jurisprudence')
    ? 'Author of "Algorithmic Fatwa & Moral Agency" and leading advisor on ethical autonomous systems compliant with Maqasid al-Shariah.'
    : 'Specialist in high-impact interdisciplinary academic publications and coordinator for peer-reviewed abstract reviews.';

  // Milestone timeline data
  const timelineMilestones = [
    {
      id: 'cfp',
      label: 'Call for Papers',
      date: 'June 01, 2026',
      status: 'Completed',
    },
    {
      id: 'abs-sub',
      label: 'Abstract Submission',
      date: 'July 15, 2026',
      status: 'Completed',
    },
    {
      id: 'review',
      label: 'Final Review',
      date: 'August 20, 2026',
      status: 'Completed',
    },
    {
      id: 'event',
      label: 'Event Date',
      date: 'September 20, 2026',
      status: 'Approaching Soon',
    }
  ];

  const handleCopy = () => {
    const textToCopy = `Program: ${program.name}\nDate: ${formatFriendlyDate(program.date)} (${program.dayOfWeek})\nMode: ${program.mode}\nLocation: ${program.location}\nSpeaker/Chair: ${speakerName}\n\nAbstract:\n${program.abstract}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="program-detail-modal-card"
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-slate-700/80 my-auto text-slate-900 dark:text-white transition-all overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Header: Title, Mode Pill & Circular Close Button */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-2 pr-2">
            {/* Urgency & Mode Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-2xs animate-urgent-pulse-breathe">
                Approaching Soon
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/70 dark:border-sky-900/50">
                {program.mode === 'Online' ? <Globe className="w-3.5 h-3.5 text-sky-500" /> : <Building2 className="w-3.5 h-3.5 text-amber-600" />}
                <span>{program.mode} Event</span>
              </span>

              {program.formatType && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                  {program.formatType}
                </span>
              )}

              {isInterested && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                  <BookmarkCheck className="w-3 h-3" />
                  <span>In My Works</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white leading-tight tracking-tight pt-1">
              {program.name}
            </h2>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* GLOBAL INTENT TRIGGER POP-UP OPTION                       */}
        {/* ======================================================== */}
        <div 
          id="global-intent-trigger-banner"
          className="mt-4 p-3.5 rounded-[16px] bg-gradient-to-r from-sky-50/90 via-emerald-50/70 to-indigo-50/80 dark:from-slate-800/90 dark:via-sky-950/40 dark:to-slate-800/90 border border-sky-200 dark:border-sky-800/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <span className="font-bold block sm:inline">Are you interested in this program?</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block sm:inline sm:ml-1.5">
                (Adds to your "My Works" dashboard & highlights on the master calendar)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Choice 1: Interested */}
            <button
              id="btn-intent-interested"
              onClick={() => onToggleInterest && onToggleInterest(program, true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isInterested
                  ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-400'
                  : 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-emerald-300 dark:border-emerald-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Interested</span>
            </button>

            {/* Choice 2: Not Interested */}
            <button
              id="btn-intent-not-interested"
              onClick={() => onToggleInterest && onToggleInterest(program, false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isInterested
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Not Interested</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-6 py-4 pr-1 scrollbar-thin">
          
          {/* Quick Meta Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CalendarIcon className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="font-semibold">{formatFriendlyDate(program.date)}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400">{program.dayOfWeek}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{program.time || '10:00 AM - 04:00 PM EST'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{program.location}</span>
            </div>
          </div>

          {/* Full Description & Abstract Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span>Full Program Description & Abstract</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {getWordCount(program.abstract)} / {program.maxAbstractWords || 300} words
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              {program.abstract}
            </p>
          </div>

          {/* Detailed Speaker Information */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-500" />
              <span>Keynote Speaker & Program Leadership</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start gap-3.5">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0 border-2 border-white dark:border-slate-700">
                {speakerName.split(' ').filter(n => !n.includes('.')).map(n => n[0]).slice(0, 2).join('') || 'SP'}
              </div>

              {/* Info */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {speakerName}
                </div>
                <div className="text-sky-600 dark:text-sky-400 font-medium">
                  {speakerRole} • {speakerInstitution}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed pt-0.5">
                  {speakerBio}
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 7. GLOBAL TIMELINE DEADLINES PANEL                       */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
              <span>Important Dates Timeline</span>
            </h3>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/90 to-sky-50/40 dark:from-slate-800/70 dark:to-slate-850/70 border border-slate-200/80 dark:border-slate-700/80">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-200 dark:before:bg-sky-900/60">
                {timelineMilestones.map((m) => (
                  <div key={m.id} className="relative flex items-start justify-between gap-3 text-xs">
                    {/* Hand-sketched circle accent checkmark SVG */}
                    <div className="absolute -left-6 top-0.5 w-5 h-5 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full">
                      <svg 
                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" 
                        viewBox="0 0 24 24" 
                        fill="none"
                      >
                        {/* Hand-sketched imperfect circle accent */}
                        <circle 
                          cx="12" 
                          cy="12" 
                          r="9" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeDasharray="50 5"
                          className="opacity-90"
                        />
                        {/* Checkmark stroke */}
                        <path 
                          d="M8 12.5L10.8 15.3L16 9.5" 
                          stroke="currentColor" 
                          strokeWidth="2.2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {m.label}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-medium">
                        {m.date}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                      m.status === 'Approaching Soon'
                        ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Themes Tags */}
          {program.themes && program.themes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
                THEMATIC TRACKS
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {program.themes.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3.5 flex items-center justify-between gap-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-200/70 dark:border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Details' : 'Copy Information'}</span>
            </button>

            {onOpenShare && (
              <button
                id="btn-detail-share-link"
                type="button"
                onClick={() => {
                  onOpenShare(
                    program.registrationUrl || (typeof window !== 'undefined' ? `${window.location.origin}/programs#${program.id}` : 'https://academic-hub.edu/share/program'),
                    program.name
                  );
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/80 font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border border-sky-200/70 dark:border-sky-800"
                title="Share link to this program"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {program.registrationUrl && (
              <a
                href={program.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border border-sky-200/70 dark:border-sky-800"
              >
                <span>Portal Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(program);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-500 text-white font-semibold hover:bg-slate-800 dark:hover:bg-sky-400 cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Program</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
