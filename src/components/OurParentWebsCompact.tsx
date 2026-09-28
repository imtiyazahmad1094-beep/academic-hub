import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Building2, 
  BookOpen, 
  Users, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';

export interface ParentWebLinkItem {
  id: string;
  name: string;
  shortName: string;
  url: string;
  desc: string;
  badge: string;
  colorClass: string;
  hoverClass: string;
  borderClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PARENT_WEB_LINKS: ParentWebLinkItem[] = [
  {
    id: 'dhiu',
    name: 'DHIU',
    shortName: 'DHIU',
    url: 'https://dhiu.in',
    desc: 'Darul Huda Islamic University Headquarters',
    badge: 'HQ',
    colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50',
    hoverClass: 'hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600',
    borderClass: 'border-emerald-300 dark:border-emerald-700/70',
    icon: Building2
  },
  {
    id: 'islam-on-web',
    name: 'Islam on Web',
    shortName: 'Islam on Web',
    url: 'https://islamonweb.net',
    desc: 'Multilingual Islamic Knowledge Engine',
    badge: 'Web',
    colorClass: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50',
    hoverClass: 'hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600',
    borderClass: 'border-sky-300 dark:border-sky-700/70',
    icon: BookOpen
  },
  {
    id: 'hadia',
    name: 'HADIA',
    shortName: 'HADIA',
    url: 'https://hadia.in',
    desc: "Hudawis' Association for Devoted Islamic Activities",
    badge: 'Alumni',
    colorClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50',
    hoverClass: 'hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600',
    borderClass: 'border-amber-300 dark:border-amber-700/70',
    icon: Users
  },
  {
    id: 'hadia-cse',
    name: 'HADIA CSE',
    shortName: 'HADIA CSE',
    url: 'https://hadiacse.in',
    desc: 'HADIA Centre for Social Excellence',
    badge: 'CSE',
    colorClass: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50',
    hoverClass: 'hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600',
    borderClass: 'border-purple-300 dark:border-purple-700/70',
    icon: Sparkles
  }
];

interface OurParentWebsCompactProps {
  className?: string;
  variant?: 'inline-row' | 'mother-dropdown' | 'responsive';
}

export const OurParentWebsCompact: React.FC<OurParentWebsCompactProps> = ({
  className = '',
  variant = 'responsive'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      id="our-parent-webs-compact-component"
      className={`flex items-center flex-wrap gap-2.5 ${className}`}
    >
      {/* Label Indicator */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Globe className="w-3 h-3" />
        </div>
        <span className="tracking-wide">Our Parent Webs:</span>
      </div>

      {/* 1. Inline Horizontal Button Row */}
      <div className="inline-flex items-center flex-wrap gap-1.5 sm:gap-2">
        {PARENT_WEB_LINKS.map(link => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              id={`parent-web-btn-${link.id}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${link.name} — ${link.desc}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm active:scale-95 group ${link.colorClass} ${link.borderClass} ${link.hoverClass}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
              <span>{link.name}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>

      {/* 2. Compact Mother Button Dropdown (Secondary / Mobile Friendly access) */}
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          id="btn-parent-webs-mother-dropdown"
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer"
          title="Browse parent portals menu"
        >
          <span className="text-[11px] font-mono">Portals</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div 
            id="parent-webs-dropdown-menu"
            className="absolute left-0 sm:right-0 sm:left-auto bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-64 p-2 bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-600 rounded-2xl shadow-xl z-50 animate-fade-in space-y-1"
          >
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800">
              Official Institutional Links
            </div>

            {PARENT_WEB_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-medium transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
