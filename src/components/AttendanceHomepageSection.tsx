import React from 'react';
import { 
  ClipboardCheck, 
  CalendarClock, 
  FileText, 
  ArrowUpRight, 
  Lock, 
  Sparkles, 
  Layers, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';

interface AttendanceHomepageSectionProps {
  onOpenAttendanceModal: () => void;
  onOpenClearanceDirectly?: () => void;
}

export const AttendanceHomepageSection: React.FC<AttendanceHomepageSectionProps> = ({
  onOpenAttendanceModal
}) => {
  const CLEARANCE_URL = 'https://google.com';

  return (
    <section 
      id="homepage-attendance-section"
      className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8"
      aria-label="Attendance & Period Clearance Management"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-sky-500/15 dark:from-[#0a1520]/95 dark:via-[#0c1c2e]/90 dark:to-[#0a1622]/95 border-t-2 border-emerald-400/40 dark:border-emerald-500/30 border-b-4 border-slate-900 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_45px_rgba(16,185,129,0.2)]">
        
        {/* Top Gradient Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
        
        {/* Subtle Ambient Backing Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Info: Header & Description */}
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-2xs">
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Attendance System</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Period Window Enabled</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Online Clearance Verified</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
              Attendance, Period Window &amp; Online Clearance
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Submit period schedules for Merged Secondary, Senior Secondary, Degree, and PG tiers. Access the permanent institutional online clearance gateway and manage faculty attendance registers.
            </p>

            {/* Quick Preview Chips of Available Sections */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Active Sections:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">Merged Secondary</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">Senior Secondary</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">Degree (3-Year)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">PG (2-Year)</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Primary Action Button: Open Attendance & Period Window Modal */}
            <button
              id="btn-open-attendance-section-modal"
              type="button"
              onClick={onOpenAttendanceModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95 border-2 border-emerald-400/40"
            >
              <ClipboardCheck className="w-4 h-4 shrink-0 text-emerald-200" />
              <span>Open Attendance Window</span>
            </button>

            {/* Quick Link: Direct Link to Permanent Clearance Form */}
            <a
              href={CLEARANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:text-white font-bold text-xs sm:text-sm border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              title="Open Attendance Clearance Form directly in Google Forms"
            >
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Clearance Form</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
