import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Sparkles, 
  Building2, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Pencil,
  Camera,
  Upload
} from 'lucide-react';
import { AuthUser, AppNavSection } from '../types';

export const getProfileInitials = (user: AuthUser | null): string => {
  if (!user) return 'TA';
  if (user.role === 'Super Admin' || user.name.toLowerCase().includes('tariq')) {
    return 'TA';
  }
  const clean = user.name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'TA';
};

interface UserProfileIndicatorProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onToggleAdminView?: () => void;
  isAdminActive?: boolean;
  onNavigateSection?: (section: AppNavSection) => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
  className?: string;
  idPrefix?: string;
}

export const UserProfileIndicator: React.FC<UserProfileIndicatorProps> = ({
  currentUser,
  onLogout,
  onToggleAdminView,
  isAdminActive,
  onNavigateSection,
  onUpdateAvatar,
  className = '',
  idPrefix = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = getProfileInitials(currentUser);
  const isSuperAdmin = currentUser.role === 'Super Admin' || currentUser.isAdmin;

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogOutClick = () => {
    setIsOpen(false);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    onLogout();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (onUpdateAvatar) {
          onUpdateAvatar(dataUrl);
        } else {
          // Fallback update to localStorage
          try {
            const savedUser = localStorage.getItem('academic_auth_user_v2');
            if (savedUser) {
              const parsed = JSON.parse(savedUser);
              parsed.avatarUrl = dataUrl;
              localStorage.setItem('academic_auth_user_v2', JSON.stringify(parsed));
            }
          } catch (_) {}
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePenClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening dropdown when clicking pen
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* 1. CLICK EVENT TRIGGER: User Card Row */}
      <div
        id={`btn-${idPrefix}-user-profile-indicator`}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        }}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl glass-input hover:bg-white/95 dark:hover:bg-slate-850 cursor-pointer shadow-xs transition-all border border-slate-200/90 dark:border-slate-700/90 group active:scale-98 text-left select-none ${
          isOpen ? 'ring-2 ring-sky-500/50 bg-white/95 dark:bg-slate-800' : ''
        }`}
        title={`Click to open profile menu for ${currentUser.name}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Circular Avatar Container with Dynamic Inline Pen Accessory Trigger */}
        <div className="relative shrink-0 group/avatar">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full object-cover shadow-sm border-2 border-white dark:border-slate-800 transition-transform group-hover/avatar:scale-105"
            />
          ) : (
            <div 
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-800 tracking-wider transition-transform group-hover/avatar:scale-105"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
            >
              {initials}
            </div>
          )}

          {/* Active Status Pip */}
          <div 
            className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs pointer-events-none" 
            title="Active Session"
          />

          {/* OVERLAY TOOL ACCESSORY TRIGGER: Floating circular pen vector icon glyph button (✏️) on bottom-right quadrant border */}
          <button
            id={`btn-${idPrefix}-edit-avatar-pen`}
            type="button"
            onClick={handlePenClick}
            className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 cursor-pointer transition-all duration-200 group-hover:scale-125 group-hover:rotate-6 hover:scale-135 active:scale-95 z-20"
            title="Change profile picture"
          >
            <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* User Card Row Content */}
        <div className="flex flex-col text-left min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-slate-950 dark:text-zinc-50 truncate max-w-[110px] sm:max-w-[140px] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {currentUser.name.replace(/^(Prof\.|Dr\.)\s*/gi, '').split(' ')[0]}
            </span>

            {/* 'Super Admin' / Role Chip */}
            <span 
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border leading-none shadow-2xs shrink-0 ${
                isSuperAdmin
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                  : 'bg-sky-100 dark:bg-sky-950/80 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700'
              }`}
            >
              {currentUser.role}
            </span>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[130px] sm:max-w-[160px]">
            {currentUser.institution || 'Academic Scholar'}
          </span>
        </div>

        {/* Dynamic Chevron Indicator */}
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
          }`} 
        />
      </div>

      {/* 2. POP-UP / DROPDOWN CONTAINER DESIGN */}
      {isOpen && (
        <div 
          id={`popup-${idPrefix}-profile-menu`}
          style={{ borderRadius: '12px', zIndex: 9999 }}
          className="absolute right-0 top-full mt-2.5 w-72 sm:w-84 max-h-[420px] sm:max-h-[460px] flex flex-col bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-300/90 dark:border-slate-700 shadow-2xl shadow-slate-900/25 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-slate-900 dark:text-white z-[9999] animate-fade-in overflow-hidden"
        >
          {/* Middle Inner Scrollable Content Layer */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar min-h-0">
            {/* Header Identity Card */}
            <div 
              style={{ borderRadius: '8px' }}
              className="p-3 bg-slate-50/90 dark:bg-slate-850/90 border border-gray-200 dark:border-gray-750"
            >
              <div className="flex items-center gap-3">
                {/* Circular Avatar inside Modal Header with Pen Trigger */}
                <div className="relative shrink-0 group/modal-avatar">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-750"
                    />
                  ) : (
                    <div 
                      className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white dark:border-slate-750"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
                    >
                      {initials}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePenClick}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 cursor-pointer transition-transform hover:scale-115 active:scale-95"
                    title="Change profile avatar"
                  >
                    <Pencil className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-black text-xs sm:text-sm truncate text-slate-950 dark:text-zinc-50">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span 
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border ${
                        isSuperAdmin
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                          : 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                    {currentUser.permissionTier && (
                      <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                        {currentUser.permissionTier}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Context Actions & Administrative Links */}
            <div className="space-y-2 text-xs">
              {/* First Action Row: Admin Control Center */}
              {onToggleAdminView && isSuperAdmin && (
                <button
                  id="btn-profile-toggle-admin-center"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onToggleAdminView();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold flex items-center justify-between text-amber-800 dark:text-amber-300 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>{isAdminActive ? 'Exit Admin Center' : 'Admin Control Center'}</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200">
                    {isAdminActive ? 'Active' : 'A–Z'}
                  </span>
                </button>
              )}

              {/* Immediate Action Row: Log Out Profile Button */}
              <button
                id={`btn-${idPrefix}-logout-profile-link`}
                type="button"
                onClick={handleLogOutClick}
                className="w-full px-3 py-2.5 rounded-lg bg-red-50 hover:bg-red-100/90 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-900/50 font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer shadow-2xs hover:shadow-sm active:scale-98"
                title="Terminate session and securely return to Landing Home Page"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none select-none">🚪</span>
                  <span>Log Out Profile</span>
                </span>
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              </button>

              {/* Secondary Menu Items */}
              {onNavigateSection && (
                <button
                  id="btn-profile-nav-settings"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateSection('settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account &amp; Workspace Settings</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
