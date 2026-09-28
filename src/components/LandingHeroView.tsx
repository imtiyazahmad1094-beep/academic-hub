import React from 'react';
import { 
  GraduationCap, 
  Calendar as CalendarIcon, 
  BookOpen, 
  LogIn, 
  Trophy,
  ClipboardCheck,
  Award,
  Globe,
  ExternalLink
} from 'lucide-react';
import { AcademicProgram, AuthUser } from '../types';
import { TranslationDict } from '../utils/translations';
import { HeroProximityHeadline } from './common/HeroProximityHeadline';
import { OurParentWebsNested } from './OurParentWebsNested';

interface LandingHeroViewProps {
  onOpenAuth: () => void;
  onOpenSubmitAbstract: () => void;
  onBrowsePrograms: () => void;
  onOpenDhiuPyq?: () => void;
  onOpenQuizSuite?: () => void;
  onOpenShare?: () => void;
  onOpenSubmitLink?: () => void;
  onOpenAttendance?: () => void;
  onOpenVivaVoce?: () => void;
  onQuickLogin: (user: AuthUser) => void;
  onOpenAdminAuth?: () => void;
  programs: AcademicProgram[];
  interestedProgramIds?: string[];
  onSelectProgram: (program: AcademicProgram) => void;
  onToggleMode: (programId: string, currentMode: 'Online' | 'Offline') => void;
  t: TranslationDict;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  onOpenAuth,
  onOpenSubmitAbstract,
  onBrowsePrograms,
  onOpenDhiuPyq,
  onOpenQuizSuite,
  onOpenSubmitLink,
  onOpenAttendance,
  onOpenVivaVoce,
  onQuickLogin,
  t,
}) => {
  const quickUsers: AuthUser[] = [
    {
      id: 'usr-scholar-1',
      name: 'Prof. Dr. Tariq Al-Mansoor',
      email: 'tariq.mansoor@oxford.ac.uk',
      role: 'Scholar',
      institution: 'Oxford Centre for AI Ethics',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15',
      permissionTier: 'Senior Editorial Tier 2',
      isAdmin: false
    },
    {
      id: 'usr-chair-2',
      name: 'Prof. Elena Rostova',
      email: 'elena.rostova@cambridge.ac.uk',
      role: 'Program Chair',
      institution: 'Cavendish Laboratory & Quantum AI',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-10',
      permissionTier: 'Senior Editorial Tier 2',
      isAdmin: false
    },
    {
      id: 'usr-admin-root',
      name: 'Prof. Dr. Tariq Al-Mansoor',
      email: 'tariq.almansoor@alazhar.edu.eg',
      role: 'Super Admin',
      institution: 'Central Academic Governance Board',
      createdAt: '2025-11-01',
      permissionTier: 'Super Admin Tier 1',
      isAdmin: true
    }
  ];

  return (
    <div 
      id="landing-hero-view"
      className="w-full min-h-[calc(100vh-130px)] relative flex flex-col justify-between bg-gradient-to-b from-slate-50/80 via-sky-50/50 to-indigo-50/30 dark:from-[#080d1a] dark:via-[#0c1629] dark:to-[#060a14] p-4 sm:p-8 md:p-12 lg:p-16 animate-fade-in select-text"
    >
      {/* Subtle Ambient Backing Lights spanning the full-screen canvas */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/25 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-teal-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Frosted Hero Content Area */}
      <div className="relative z-10 my-auto w-full max-w-6xl mx-auto text-center space-y-7 py-6">
        
        {/* Core Editorial Serif Headline with Hardware-Accelerated Fluid Proximity Dispersion Engine */}
        <HeroProximityHeadline 
          radius={120}
          maxDisplacement={45}
          maxBlur={6}
        />

        {/* Primary Platform Subtext */}
        <p 
          data-i18n="subDescription"
          className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl mx-auto font-sans drop-shadow-xs"
        >
          Academic Hub helps you share upcoming events, track your submissions, and read documents instantly. Upload your event papers and let our smart system organize all the important details for you automatically.
        </p>

        {/* Geometric Symmetrical 2-Tier Interactive Button Matrix */}
        <div className="pt-3 w-full max-w-4xl mx-auto flex flex-col items-center gap-3 sm:gap-4">
          {/* Row 1: [Submit an Opportunity] | [Browse Programs] | [DHIU PYQ Portal] */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center justify-center max-w-3xl">
            {/* Button 1: Submit an Opportunity */}
            <button
              id="cta-submit-opportunity"
              data-i18n="btnSubmitOpportunity"
              onClick={onOpenSubmitAbstract}
              className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-sans font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Submit an Opportunity</span>
            </button>

            {/* Button 2: Browse Programs */}
            <button
              id="cta-browse-programs"
              data-i18n="btnBrowsePrograms"
              onClick={onBrowsePrograms}
              className="w-full px-5 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm border-2 border-slate-200/90 hover:border-slate-300 shadow-md hover:shadow-lg dark:bg-[#0c1427]/80 dark:hover:bg-[#131f3c] dark:text-white dark:border-white/15 dark:hover:border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
            >
              <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="truncate">{t.btnBrowsePrograms || 'Browse Programs'}</span>
            </button>

            {/* Button 3: DHIU PYQ Portal */}
            <button
              id="cta-dhiu-pyq-portal"
              onClick={onOpenDhiuPyq}
              className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">DHIU PYQ Portal</span>
            </button>
          </div>

          {/* Row 2: [Quiz Arena] | [Sign In / Register] */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center justify-center max-w-3xl">
            {/* Button 4: Quiz Arena */}
            <button
              id="cta-quiz-arena-portal"
              onClick={onOpenQuizSuite}
              className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border-2 border-amber-300/80"
            >
              <Trophy className="w-4 h-4 shrink-0 text-slate-950" />
              <span className="truncate">Quiz Arena</span>
            </button>

            {/* Button 5: Sign In / Register */}
            <button
              id="cta-login-portal"
              data-i18n="btnQuickLogin"
              onClick={onOpenAuth}
              className="w-full px-5 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg border-2 border-slate-300/80 dark:bg-white/15 dark:hover:bg-white/25 dark:text-white dark:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95 backdrop-blur-md"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className="truncate">Sign In / Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fast Demonstration 1-Click Sign In Routes Bar (Spanning symmetrically across wide lower viewport) */}
      <div className="relative z-10 pt-6 pb-2 w-full max-w-5xl mx-auto border-t border-slate-200 dark:border-white/10">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-3.5 text-center">
          Fast Demonstration 1-Click Sign In Routes:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
          {/* Route 1: Prof. Dr. (Scholar) */}
          <button
            id="btn-quick-login-scholar"
            data-i18n="roleScholar"
            onClick={() => onQuickLogin(quickUsers[0])}
            className="p-3.5 rounded-xl bg-white/95 hover:bg-white dark:bg-[#0c1427]/75 dark:hover:bg-[#121d39]/90 border-2 border-slate-200/90 hover:border-sky-400 dark:border-white/10 dark:hover:border-white/25 backdrop-blur-md transition-all cursor-pointer text-left flex items-center gap-3 group shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              TM
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 truncate">
                {t.roleScholar || 'Prof. Dr. (Scholar)'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Oxford AI Ethics
              </div>
            </div>
          </button>

          {/* Route 2: Prof. Elena (Program Chair) */}
          <button
            id="btn-quick-login-chair"
            data-i18n="roleChair"
            onClick={() => onQuickLogin(quickUsers[1])}
            className="p-3.5 rounded-xl bg-white/95 hover:bg-white dark:bg-[#0c1427]/75 dark:hover:bg-[#121d39]/90 border-2 border-slate-200/90 hover:border-fuchsia-400 dark:border-white/10 dark:hover:border-white/25 backdrop-blur-md transition-all cursor-pointer text-left flex items-center gap-3 group shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-400 to-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              ER
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-300 truncate">
                {t.roleChair || 'Prof. Elena (Program Chair)'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Cavendish Quantum Lab
              </div>
            </div>
          </button>

          {/* Route 3: Prof. Dr. Tariq Al-Mansoor (Super Admin) */}
          <button
            id="btn-quick-login-admin"
            data-i18n="roleAdmin"
            onClick={() => onQuickLogin(quickUsers[2])}
            className="p-3.5 rounded-xl bg-white/95 hover:bg-white dark:bg-[#0c1427]/75 dark:hover:bg-[#121d39]/90 border-2 border-slate-200/90 hover:border-amber-400 dark:border-white/10 dark:hover:border-white/25 backdrop-blur-md transition-all cursor-pointer text-left flex items-center gap-3 group shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20">
              TA
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 truncate flex items-center gap-1.5">
                <span>{t.roleAdmin || 'Prof. Dr. Tariq Al-Mansoor'}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-400 text-slate-950">Admin</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Central Governance • Super Admin
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Homepage "Our Parent Webs:" Unified Nested System Component */}
      <div className="relative z-10 w-full pt-4">
        <OurParentWebsNested />
      </div>
    </div>
  );
};

