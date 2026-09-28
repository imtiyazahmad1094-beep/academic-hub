import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Plus, 
  FileUp, 
  Globe, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Sun, 
  Moon, 
  Bell, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Settings, 
  MessageSquarePlus, 
  User, 
  FileText,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Shield,
  BookmarkCheck,
  Languages,
  LogIn,
  Mail,
  Zap,
  StickyNote,
  Link2,
  Trophy,
  ClipboardCheck,
  Award
} from 'lucide-react';
import { AcademicProgram, AppDisplayMode, AppNavSection, AuthUser } from '../types';
import { getDaysUntil, TODAY_ISO } from '../utils/academicUtils';
import { Language, TranslationDict } from '../utils/translations';
import { UserProfileIndicator } from './UserProfileIndicator';

interface GlowHeaderProps {
  programs: AcademicProgram[];
  onOpenParser: () => void;
  onOpenAddProgram: () => void;
  onOpenScratchpad?: () => void;
  onOpenShare?: () => void;
  onOpenSubmitLink?: () => void;
  onOpenAttendance?: () => void;
  activeSection: AppNavSection;
  setActiveSection: (section: AppNavSection) => void;
  displayMode: AppDisplayMode;
  onToggleDisplayMode: () => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onTriggerAdminEasterEgg: () => void;
  isAdminActive?: boolean;
  onToggleAdminView?: () => void;
  unreadNotifsCount: number;
  t: TranslationDict;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const GlowHeader: React.FC<GlowHeaderProps> = ({
  programs,
  onOpenParser,
  onOpenAddProgram,
  onOpenScratchpad,
  onOpenShare,
  onOpenSubmitLink,
  onOpenAttendance,
  activeSection,
  setActiveSection,
  displayMode,
  onToggleDisplayMode,
  currentLang,
  onChangeLang,
  currentUser,
  onOpenAuth,
  onLogout,
  onTriggerAdminEasterEgg,
  isAdminActive,
  onToggleAdminView,
  unreadNotifsCount,
  t,
  onUpdateAvatar
}) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [clickFeedback, setClickFeedback] = useState<string | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (nextCount === 5) {
      setLogoClicks(0);
      setClickFeedback('Admin Unlocked!');
      setTimeout(() => setClickFeedback(null), 2500);
      onTriggerAdminEasterEgg();
    } else {
      if (nextCount >= 2) {
        setClickFeedback(`${nextCount}/5 clicks`);
        setTimeout(() => setClickFeedback(null), 1500);
      }
      clickTimeoutRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 3000);
    }
  };

  const onlineCount = programs.filter(p => p.mode === 'Online').length;
  const offlineCount = programs.filter(p => p.mode === 'Offline').length;

  const approachingCount = programs.filter(p => {
    const days = getDaysUntil(p.date, TODAY_ISO);
    return days >= 0 && days <= 3;
  }).length;

  const allNavItems: { id: AppNavSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'quiz-arena', label: 'Play Quiz', icon: Trophy },
    { id: 'dhiu-pyq', label: 'DHIU PYQ', icon: GraduationCap },
    { id: 'viva-voce', label: 'Viva Voce', icon: Award },
    { id: 'my-works', label: 'My Works', icon: BookmarkCheck },
    { id: 'send-receive', label: 'Send & Receive', icon: Mail },
    { id: 'programs', label: 'Programs', icon: CalendarIcon },
    { id: 'ai-parser', label: 'Upload', icon: FileUp },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount ?? 2 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Navigation pills are strictly reserved for logged-in workspace navigation.
  // When unauthenticated, completely strip Dashboard, Quiz Arena, DHIU PYQ and all pills from the pre-login homepage.
  const navItems = currentUser ? allNavItems : [];

  const languageOptions: { code: Language; name: string; native: string; flag: string }[] = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLangObj = languageOptions.find(l => l.code === currentLang) || languageOptions[0];

  return (
    <header className="mb-8 space-y-5 overflow-visible relative z-30">
      {/* Top Main Bar */}
      <div 
        id="main-glow-header"
        className="glass-panel dark:bg-slate-900/85 dark:border-slate-800/90 p-5 sm:p-6 rounded-3xl relative overflow-visible transition-all duration-300 z-30"
      >
        {/* Glow backdrop aura */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Brand & Title with 5-Click Easter Egg Trigger */}
          <div className="flex items-start gap-3.5">
            <button
              id="brand-logo-button"
              onClick={handleLogoClick}
              title="Academic Program Management System (Click 5 consecutive times for Admin Console)"
              className="p-3 rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-amber-300 text-slate-900 shadow-md shadow-sky-200/50 dark:shadow-none animate-float-gentle shrink-0 cursor-pointer active:scale-95 transition-transform select-none relative group"
            >
              <GraduationCap className="w-8 h-8 text-slate-950" />
              {clickFeedback && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-mono font-bold whitespace-nowrap shadow-md animate-fade-in z-30">
                  {clickFeedback}
                </span>
              )}
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2 dark:[text-shadow:0_0_20px_rgba(56,189,248,0.45)]">
                  <span>{t.appName || 'Academic Hub'}</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100/90 text-teal-900 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-300/80 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>{t.aiPoweredLabel || 'AI Powered'}</span>
                </span>
                {isAdminActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.adminModeActiveLabel || 'Admin Mode Active'}</span>
                  </span>
                )}
              </div>

              <p 
                dir="rtl"
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-arabic-quote font-normal max-w-xl leading-relaxed tracking-wide pt-0.5"
              >
                طَلَبُ العِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ، وَحُسْنُ تَدْبِيرِهِ أَسَاسُ النَّجَاحِ
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls (Right Header Area) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            
            {/* Dynamic Global Language Selector Dropdown */}
            <div className="relative overflow-visible z-50" ref={langMenuRef}>
              <button
                id="btn-header-lang-selector"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-input bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-zinc-100 cursor-pointer shadow-2xs transition-all border border-slate-200/90 dark:border-slate-700"
                title="Select global application language"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.native}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
              </button>

              {isLangMenuOpen && (
                <div 
                  id="language-dropdown-menu"
                  style={{ zIndex: 9999 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl p-2 shadow-xl shadow-sky-500/10 dark:shadow-2xl dark:shadow-black/70 border-[1.5px] border-sky-400/80 dark:border-sky-500/60 z-[9999] animate-fade-in space-y-1 overflow-visible"
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {t.language}
                  </div>
                  {languageOptions.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChangeLang(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/80 dark:border-sky-800/80'
                          : 'hover:bg-sky-50/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day / Night toggle */}
            <button
              id="btn-header-toggle-mode"
              onClick={onToggleDisplayMode}
              title="Toggle Day/Night Display"
              className="p-2.5 rounded-2xl glass-input bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-zinc-100 cursor-pointer shadow-2xs transition-transform active:scale-95 border border-slate-200/90 dark:border-slate-700"
            >
              {displayMode === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Attendance Portal Button */}
            {onOpenAttendance && (
              <button
                id="btn-header-attendance-portal"
                onClick={onOpenAttendance}
                title="Open Student Attendance Portals"
                className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-bold shrink-0 border border-emerald-400/40"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Attendance</span>
              </button>
            )}

            {/* 📝 Scratchpad & Reminders Premium Tactile Button */}
            {onOpenScratchpad && (
              <button
                id="btn-header-scratchpad-reminders"
                onClick={onOpenScratchpad}
                title="Open Scratchpad & Reminders"
                className="px-3.5 py-2 rounded-2xl border-t border-white/15 border-b-2 border-zinc-950 bg-zinc-900 text-zinc-100 hover:text-white shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 text-xs sm:text-sm font-bold shrink-0"
              >
                <span>📝 Scratchpad &amp; Reminders</span>
              </button>
            )}

            {/* User Profile State & Log Out Engine (Top Right Workspace Corner - rendered only when signed in) */}
            {currentUser && (
              <UserProfileIndicator
                currentUser={currentUser}
                onLogout={onLogout}
                onToggleAdminView={onToggleAdminView}
                isAdminActive={isAdminActive}
                onNavigateSection={setActiveSection}
                onUpdateAvatar={onUpdateAvatar}
                idPrefix="header"
              />
            )}

            {/* Quick Action Buttons (Only when Authenticated) */}
            {currentUser && (
              <>
                <button
                  id="btn-quick-ai-parser"
                  onClick={onOpenParser}
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  title="Document Parser & Optical Character Reader"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>{t.parseDocument}</span>
                </button>

                {/* Prominent Core Utility Action Button: "🔗 Submit Link" */}
                {onOpenSubmitLink && (
                  <button
                    id="btn-quick-submit-link"
                    type="button"
                    onClick={onOpenSubmitLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/25 hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-cyan-400/30 dark:border-cyan-400/50"
                    title="Ingest unauthenticated web reference"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>🔗 Submit Link</span>
                  </button>
                )}

                <button
                  id="btn-quick-new-program"
                  onClick={onOpenAddProgram}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.newProgram}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Global Mini Post-Login Summary Metrics Strip (Only rendered when user is logged in) */}
        {currentUser && (
          <div 
            id="header-mini-summary-strip"
            className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in"
          >
            {/* Box 1 (Total Events): Cyan Theme */}
            <div 
              className="flex items-center gap-3 p-2.5 bg-cyan-50/70 dark:bg-cyan-950/40 backdrop-blur-md border border-cyan-200/80 dark:border-cyan-800/70 shadow-2xs hover:bg-cyan-100/80 dark:hover:bg-cyan-900/60 transition-all"
              style={{ borderRadius: '8px' }}
            >
              <div 
                className="w-8 h-8 shrink-0 bg-cyan-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                style={{ borderRadius: '6px' }}
              >
                {programs.length}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-extrabold text-cyan-900 dark:text-cyan-200 tracking-wider truncate">
                  {t.totalPrograms || 'TOTAL PROGRAMS'}
                </div>
                <div className="text-xs font-black text-cyan-950 dark:text-cyan-100 truncate">
                  {programs.length} {t.eventsLabel || 'Events'}
                </div>
              </div>
            </div>

            {/* Box 2 (Approaching Items): Cherry-Red Theme */}
            <div 
              className="flex items-center gap-3 p-2.5 bg-rose-50/70 dark:bg-rose-950/40 backdrop-blur-md border border-rose-200/80 dark:border-rose-800/70 shadow-2xs hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-all"
              style={{ borderRadius: '8px' }}
            >
              <div 
                className="w-8 h-8 shrink-0 bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                style={{ borderRadius: '6px' }}
              >
                {approachingCount}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-extrabold text-rose-900 dark:text-rose-200 tracking-wider truncate">
                  {t.approachingSoon || 'APPROACHING SOON'}
                </div>
                <div className="text-xs font-black text-rose-800 dark:text-rose-200 truncate">
                  {approachingCount} {t.scheduled || 'Scheduled'}
                </div>
              </div>
            </div>

            {/* Box 3 (Webinar Status): Mint-Green Theme */}
            <div 
              className="flex items-center gap-3 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/70 shadow-2xs hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 transition-all"
              style={{ borderRadius: '8px' }}
            >
              <div 
                className="w-8 h-8 shrink-0 bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                style={{ borderRadius: '6px' }}
              >
                {onlineCount}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-extrabold text-emerald-900 dark:text-emerald-200 tracking-wider truncate">
                  {t.onlinePrograms || 'ONLINE MODE'}
                </div>
                <div className="text-xs font-black text-emerald-800 dark:text-emerald-200 truncate">
                  {onlineCount} {t.online || 'Webinars'}
                </div>
              </div>
            </div>

            {/* Box 4 (Physical Venues): Amber Theme */}
            <div 
              className="flex items-center gap-3 p-2.5 bg-amber-50/70 dark:bg-amber-950/40 backdrop-blur-md border border-amber-200/80 dark:border-amber-800/70 shadow-2xs hover:bg-amber-100/80 dark:hover:bg-amber-900/60 transition-all"
              style={{ borderRadius: '8px' }}
            >
              <div 
                className="w-8 h-8 shrink-0 bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                style={{ borderRadius: '6px' }}
              >
                {offlineCount}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-extrabold text-amber-900 dark:text-amber-200 tracking-wider truncate">
                  {t.offlinePrograms || 'OFFLINE / ON-SITE'}
                </div>
                <div className="text-xs font-black text-amber-800 dark:text-amber-200 truncate">
                  {offlineCount} {t.offline || 'On-Site'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Pills Strip (Rendered strictly for authenticated workspaces; purged on pre-login homepage) */}
      {currentUser && navItems.length > 0 && (
        <nav 
          id="navbar-nav-strip"
          aria-label="Main Navigation"
          className="glass-panel p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none animate-fade-in"
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs scale-[1.02]'
                    : 'hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
