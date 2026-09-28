import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  Building2, 
  BookOpen, 
  Users, 
  Sparkles, 
  Trophy, 
  Palette,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export interface ParentNetworkDomain {
  id: string;
  name: string;
  url: string;
  badge: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  theme: {
    bg: string;
    border: string;
    shadow: string;
    hoverShadow: string;
    iconBoxBg: string;
    iconBoxText: string;
    badgeBg: string;
    badgeText: string;
    titleColor: string;
    hoverTitleColor: string;
    btnActionBg: string;
    btnActionText: string;
  };
}

export const PARENT_NETWORK_DOMAINS: ParentNetworkDomain[] = [
  {
    id: 'dhiu',
    name: 'DHIU',
    url: 'https://dhiu.in',
    badge: 'HQ',
    category: 'University Flagship',
    description: 'Darul Huda Islamic University Central Portal',
    icon: Building2,
    theme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/70',
      border: 'border-emerald-500 dark:border-emerald-400',
      shadow: 'shadow-[6px_6px_0px_0px_#064e3b] dark:shadow-[6px_6px_0px_0px_#022c22]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#064e3b] dark:hover:shadow-[10px_10px_0px_0px_#022c22]',
      iconBoxBg: 'bg-emerald-500 text-white',
      iconBoxText: 'text-white',
      badgeBg: 'bg-emerald-200 dark:bg-emerald-900',
      badgeText: 'text-emerald-950 dark:text-emerald-100',
      titleColor: 'text-emerald-950 dark:text-emerald-100',
      hoverTitleColor: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
      btnActionBg: 'bg-emerald-600 text-white group-hover:bg-emerald-700',
      btnActionText: 'text-emerald-900 dark:text-emerald-200'
    }
  },
  {
    id: 'islam-on-web',
    name: 'Islam on Web',
    url: 'https://islamonweb.net',
    badge: 'Knowledge',
    category: 'Research Engine',
    description: 'Global Multilingual Islamic Information Engine',
    icon: BookOpen,
    theme: {
      bg: 'bg-blue-50 dark:bg-blue-950/70',
      border: 'border-blue-500 dark:border-blue-400',
      shadow: 'shadow-[6px_6px_0px_0px_#1e3a8a] dark:shadow-[6px_6px_0px_0px_#172554]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#1e3a8a] dark:hover:shadow-[10px_10px_0px_0px_#172554]',
      iconBoxBg: 'bg-blue-500 text-white',
      iconBoxText: 'text-white',
      badgeBg: 'bg-blue-200 dark:bg-blue-900',
      badgeText: 'text-blue-950 dark:text-blue-100',
      titleColor: 'text-blue-950 dark:text-blue-100',
      hoverTitleColor: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
      btnActionBg: 'bg-blue-600 text-white group-hover:bg-blue-700',
      btnActionText: 'text-blue-900 dark:text-blue-200'
    }
  },
  {
    id: 'hadia',
    name: 'HADIA',
    url: 'https://hadia.in',
    badge: 'Alumni',
    category: 'National Network',
    description: "Hudawis' Association for Devoted Islamic Activities",
    icon: Users,
    theme: {
      bg: 'bg-amber-50 dark:bg-amber-950/70',
      border: 'border-amber-500 dark:border-amber-400',
      shadow: 'shadow-[6px_6px_0px_0px_#78350f] dark:shadow-[6px_6px_0px_0px_#451a03]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#78350f] dark:hover:shadow-[10px_10px_0px_0px_#451a03]',
      iconBoxBg: 'bg-amber-500 text-slate-950',
      iconBoxText: 'text-slate-950',
      badgeBg: 'bg-amber-200 dark:bg-amber-900',
      badgeText: 'text-amber-950 dark:text-amber-100',
      titleColor: 'text-amber-950 dark:text-amber-100',
      hoverTitleColor: 'group-hover:text-amber-800 dark:group-hover:text-amber-300',
      btnActionBg: 'bg-amber-500 text-slate-950 group-hover:bg-amber-600',
      btnActionText: 'text-amber-950 dark:text-amber-200'
    }
  },
  {
    id: 'hadia-cse',
    name: 'HADIA CSE',
    url: 'https://hadiacse.in',
    badge: 'CSE',
    category: 'Social Excellence',
    description: 'HADIA Centre for Social Excellence & Guidance',
    icon: Sparkles,
    theme: {
      bg: 'bg-purple-50 dark:bg-purple-950/70',
      border: 'border-purple-500 dark:border-purple-400',
      shadow: 'shadow-[6px_6px_0px_0px_#581c87] dark:shadow-[6px_6px_0px_0px_#3b0764]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#581c87] dark:hover:shadow-[10px_10px_0px_0px_#3b0764]',
      iconBoxBg: 'bg-purple-600 text-white',
      iconBoxText: 'text-white',
      badgeBg: 'bg-purple-200 dark:bg-purple-900',
      badgeText: 'text-purple-950 dark:text-purple-100',
      titleColor: 'text-purple-950 dark:text-purple-100',
      hoverTitleColor: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
      btnActionBg: 'bg-purple-600 text-white group-hover:bg-purple-700',
      btnActionText: 'text-purple-900 dark:text-purple-200'
    }
  },
  {
    id: 'sibaq',
    name: 'sibaq',
    url: 'https://www.sibaq.in/downloads',
    badge: 'Downloads',
    category: 'National Fest',
    description: 'National Arts & Cultural Festival Official Materials',
    icon: Trophy,
    theme: {
      bg: 'bg-rose-50 dark:bg-rose-950/70',
      border: 'border-rose-500 dark:border-rose-400',
      shadow: 'shadow-[6px_6px_0px_0px_#881337] dark:shadow-[6px_6px_0px_0px_#4c0519]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#881337] dark:hover:shadow-[10px_10px_0px_0px_#4c0519]',
      iconBoxBg: 'bg-rose-500 text-white',
      iconBoxText: 'text-white',
      badgeBg: 'bg-rose-200 dark:bg-rose-900',
      badgeText: 'text-rose-950 dark:text-rose-100',
      titleColor: 'text-rose-950 dark:text-rose-100',
      hoverTitleColor: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
      btnActionBg: 'bg-rose-600 text-white group-hover:bg-rose-700',
      btnActionText: 'text-rose-900 dark:text-rose-200'
    }
  },
  {
    id: 'artfest',
    name: 'artfest',
    url: 'https://festie.app',
    badge: 'Festie',
    category: 'Live Scoring',
    description: 'Live Adjudication, Tabulation & Scoreboard App',
    icon: Palette,
    theme: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/70',
      border: 'border-indigo-500 dark:border-indigo-400',
      shadow: 'shadow-[6px_6px_0px_0px_#312e81] dark:shadow-[6px_6px_0px_0px_#1e1b4b]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#312e81] dark:hover:shadow-[10px_10px_0px_0px_#1e1b4b]',
      iconBoxBg: 'bg-indigo-600 text-white',
      iconBoxText: 'text-white',
      badgeBg: 'bg-indigo-200 dark:bg-indigo-900',
      badgeText: 'text-indigo-950 dark:text-indigo-100',
      titleColor: 'text-indigo-950 dark:text-indigo-100',
      hoverTitleColor: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
      btnActionBg: 'bg-indigo-600 text-white group-hover:bg-indigo-700',
      btnActionText: 'text-indigo-900 dark:text-indigo-200'
    }
  }
];

interface OurParentWebsNestedProps {
  className?: string;
}

export const OurParentWebsNested: React.FC<OurParentWebsNestedProps> = ({ className = '' }) => {
  return (
    <div
      id="our-parent-webs-system-container"
      className={`w-full max-w-5xl mx-auto my-3 ${className}`}
      aria-label="Our Parent Webs Official Network Portals"
    >
      {/* ======================================================== */}
      {/* 1. PARENT CONTAINER ARCHITECTURE: 3D BRUTALIST SHELL     */}
      {/* Solid background, thick border, and crisp flat 3D shadow */}
      {/* ======================================================== */}
      <div 
        id="panel-parent-webs-main-shell"
        className="p-4 sm:p-5 sm:pb-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] dark:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative transition-all"
      >
        {/* Top Header Row of the Main Shell */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-slate-800/20 dark:border-slate-700/80 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center border-2 border-slate-800 dark:border-slate-200 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight uppercase">
                  Our Parent Webs:
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border-2 border-indigo-700 dark:border-indigo-500 shadow-[2px_2px_0px_0px_rgba(67,56,202,1)]">
                  6 Network Domains
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Official affiliated institutional portals, national fest downloads &amp; live apps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-700 dark:border-emerald-600 text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-200 shadow-[1.5px_1.5px_0px_0px_rgba(6,78,59,1)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Verified Institutional Links</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. INNER 3D GRID CARD REDESIGN (THE 6 TACTILE 3D CARDS)  */}
        {/* Solid hard offset shadows, hover popping transform effect */}
        {/* ======================================================== */}
        <div 
          id="grid-parent-webs-boxes"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 pt-1"
        >
          {PARENT_NETWORK_DOMAINS.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                id={`parent-network-box-${item.id}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${item.name} (${item.category}): ${item.description}`}
                className={`group p-3 sm:p-3.5 rounded-2xl ${item.theme.bg} border-2 ${item.theme.border} ${item.theme.shadow} ${item.theme.hoverShadow} transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex flex-col justify-between text-left relative overflow-hidden`}
              >
                {/* Individual Card Header: 3D Icon Box & 3D Badge Pill */}
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    {/* 3D Icon Box */}
                    <div className={`w-8 h-8 rounded-xl ${item.theme.iconBoxBg} flex items-center justify-center border-2 border-slate-900 dark:border-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* 3D Badge Pill with precise dark border */}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black border border-slate-900 dark:border-slate-800 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${item.theme.badgeBg} ${item.theme.badgeText}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h4 className={`font-black text-xs sm:text-sm ${item.theme.titleColor} ${item.theme.hoverTitleColor} transition-colors tracking-tight line-clamp-1`}>
                    {item.name}
                  </h4>

                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {item.category}
                  </p>
                </div>

                {/* Individual Card Footer: 3D Action Pill */}
                <div className="mt-3 pt-2 border-t-2 border-slate-900/10 dark:border-white/10 flex items-center justify-between text-[10px] font-black">
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${item.theme.btnActionText}`}>
                    Open
                  </span>

                  <div className={`w-5 h-5 rounded-md ${item.theme.btnActionBg} border border-slate-900 dark:border-slate-800 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
                    <ArrowUpRight className="w-3 h-3 text-white dark:text-slate-950" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
