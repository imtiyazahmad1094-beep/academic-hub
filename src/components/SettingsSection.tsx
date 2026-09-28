import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Moon, 
  Sun, 
  Sparkles, 
  Globe, 
  User, 
  Database, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Check, 
  LogOut 
} from 'lucide-react';
import { AppDisplayMode, AppThemePalette, AuthUser, AcademicProgram } from '../types';
import { Language, TranslationDict } from '../utils/translations';

interface SettingsSectionProps {
  currentTheme: AppThemePalette;
  onChangeTheme: (theme: AppThemePalette) => void;
  currentMode: AppDisplayMode;
  onChangeMode: (mode: AppDisplayMode) => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onResetData: () => void;
  programs: AcademicProgram[];
  t: TranslationDict;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  currentTheme,
  onChangeTheme,
  currentMode,
  onChangeMode,
  currentLang,
  onChangeLang,
  currentUser,
  onOpenAuth,
  onLogout,
  onResetData,
  programs,
  t,
}) => {
  const [copiedBackup, setCopiedBackup] = useState(false);

  const themeOptions: { id: AppThemePalette; label: string; desc: string; colors: string[] }[] = [
    {
      id: 'emerald',
      label: 'Academic Emerald & Mint',
      desc: 'Calming, focus-friendly research laboratory palette.',
      colors: ['bg-emerald-400', 'bg-teal-400', 'bg-sky-400']
    },
    {
      id: 'cyber',
      label: 'Cyber Neon & Violet',
      desc: 'High-energy futuristic academic aesthetic with vivid neon accents.',
      colors: ['bg-purple-500', 'bg-cyan-400', 'bg-pink-500']
    },
    {
      id: 'sunset',
      label: 'Warm Sunset & Amber',
      desc: 'Cozy, scholarly library ambiance with rich amber tones.',
      colors: ['bg-amber-400', 'bg-rose-400', 'bg-orange-500']
    },
    {
      id: 'oceanic',
      label: 'Oceanic Azure & Sky',
      desc: 'Crisp, crystal-clear blue maritime glassmorphism.',
      colors: ['bg-sky-400', 'bg-blue-600', 'bg-teal-300']
    }
  ];

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(programs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `academic_programs_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Banner */}
      <div 
        className="section-box-glass section-box-settings p-6 sm:p-7 border border-slate-500/40 shadow-[0_0_15px_rgba(100,116,139,0.15)] relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Slate/Cyan Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div 
            className="p-3 bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-2xs"
            style={{ borderRadius: '10px' }}
          >
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white neon-glow-slate">
              {t.settings}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              Configure themes, multi-language localization, authentication status, and storage preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div 
        className="section-box-glass p-6 border border-slate-500/30 shadow-[0_0_12px_rgba(100,116,139,0.1)] space-y-4"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Globe className="w-4 h-4 text-cyan-500" />
          <span>{t.language}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'en', label: 'English', sub: 'English (UK/US)' },
            { id: 'es', label: 'Español', sub: 'Spanish (Castellano)' },
            { id: 'ur', label: 'اردو', sub: 'Urdu (RTL)' },
            { id: 'hi', label: 'हिन्दी', sub: 'Hindi (Devanagari)' },
            { id: 'ar', label: 'العربية', sub: 'Arabic (RTL)' },
            { id: 'fr', label: 'Français', sub: 'French' },
            { id: 'de', label: 'Deutsch', sub: 'German' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => onChangeLang(lang.id as Language)}
              className={`p-3.5 border text-left cursor-pointer transition-all ${
                currentLang === lang.id
                  ? 'bg-slate-900 dark:bg-cyan-600 text-white border-transparent shadow-md ring-2 ring-cyan-400'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              style={{ borderRadius: '10px' }}
            >
              <div className="text-sm font-bold">{lang.label}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{lang.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Day / Night / Midnight Mode */}
      <div 
        className="section-box-glass p-6 border border-slate-500/30 shadow-[0_0_12px_rgba(100,116,139,0.1)] space-y-4"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>{t.dayNightMode}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'light', label: t.lightMode, icon: Sun, desc: 'Clean, radiant pastel glass with soft contrast' },
            { id: 'dark', label: t.darkMode, icon: Moon, desc: 'Sophisticated deep twilight dark canvas' },
            { id: 'midnight', label: t.midnightMode, icon: Sparkles, desc: 'Electric cyber neon glow with obsidian backdrop' }
          ].map(m => {
            const Icon = m.icon;
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChangeMode(m.id as AppDisplayMode)}
                className={`p-4 border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white border-transparent shadow-md ring-2 ring-cyan-400'
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                style={{ borderRadius: '10px' }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold">{m.label}</span>
                </div>
                <p className="text-[11px] opacity-80 leading-snug">
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palettes */}
      <div 
        className="section-box-glass p-6 border border-slate-500/30 shadow-[0_0_12px_rgba(100,116,139,0.1)] space-y-4"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Palette className="w-4 h-4 text-cyan-500" />
          <span>{t.themeColor}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themeOptions.map(th => {
            const isSelected = currentTheme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => onChangeTheme(th.id)}
                className={`p-4 border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-white/95 dark:bg-slate-800/95 border-cyan-400 ring-2 ring-cyan-300 shadow-md'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white'
                }`}
                style={{ borderRadius: '10px' }}
              >
                <div className="flex -space-x-1 shrink-0 mt-0.5">
                  {th.colors.map((c, i) => (
                    <span key={i} className={`w-3.5 h-3.5 rounded-full ${c} ring-2 ring-white dark:ring-slate-900`} />
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{th.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{th.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auth / Account Profile */}
      <div 
        className="section-box-glass p-6 border border-slate-500/30 shadow-[0_0_12px_rgba(100,116,139,0.1)] space-y-4"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <User className="w-4 h-4 text-cyan-500" />
            <span>Academic Scholar Account</span>
          </div>
          {currentUser ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 hover:bg-red-100 text-xs font-bold cursor-pointer border border-red-200 dark:border-red-900/60"
              style={{ borderRadius: '8px' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer"
              style={{ borderRadius: '8px' }}
            >
              {t.login} / {t.signup}
            </button>
          )}
        </div>

        {currentUser ? (
          <div 
            className="p-4 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            style={{ borderRadius: '10px' }}
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
              <div className="text-xs text-slate-500">{currentUser.email} &bull; <span className="font-semibold text-cyan-600 dark:text-cyan-400">{currentUser.role}</span></div>
              <div className="text-xs text-slate-400">{currentUser.institution}</div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Sign in to synchronize reviewer assignments, submit draft abstracts, and receive automated deadline notifications.
          </p>
        )}
      </div>

      {/* Database Storage Management */}
      <div 
        className="section-box-glass p-6 border border-slate-500/30 shadow-[0_0_12px_rgba(100,116,139,0.1)] space-y-3"
        style={{ borderRadius: '12px' }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Database className="w-4 h-4 text-cyan-500" />
          <span>Local Storage &amp; Backup</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          All changes persist automatically in browser storage. You can export a JSON backup or reset to the default academic curriculum.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 text-xs font-bold border border-cyan-300 dark:border-cyan-800 cursor-pointer shadow-2xs"
            style={{ borderRadius: '10px' }}
          >
            {copiedBackup ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
            <span>Export Programs JSON</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all programs and data to the default sample dataset?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 text-xs font-semibold cursor-pointer border border-slate-300 dark:border-slate-700"
            style={{ borderRadius: '10px' }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
