import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export interface ParentWebLink {
  id: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  badge: string;
  colorClasses: {
    bg: string;
    border: string;
    hoverBorder: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    glow: string;
  };
  icon: React.ComponentType<{ className?: string }>;
}

export const PARENT_WEBS: ParentWebLink[] = [
  {
    id: 'dhiu',
    name: 'DHIU',
    fullName: 'Darul Huda Islamic University',
    url: 'https://dhiu.in',
    description: 'Premier Islamic University headquarters, central examination board & collegiate directory.',
    badge: 'Flagship University',
    colorClasses: {
      bg: 'from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40',
      border: 'border-emerald-300/80 dark:border-emerald-700/60',
      hoverBorder: 'hover:border-emerald-500 dark:hover:border-emerald-400',
      text: 'text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      badgeBorder: 'border-emerald-300 dark:border-emerald-800',
      glow: 'shadow-emerald-500/15'
    },
    icon: Building2
  },
  {
    id: 'islam-on-web',
    name: 'Islam on Web',
    fullName: 'Islam on Web Portal',
    url: 'https://islamonweb.net',
    description: 'Global multilingual Islamic knowledge portal, contemporary research & classical articles.',
    badge: 'Knowledge Hub',
    colorClasses: {
      bg: 'from-sky-500/10 via-blue-500/5 to-sky-500/10 dark:from-sky-950/40 dark:via-blue-950/20 dark:to-sky-950/40',
      border: 'border-sky-300/80 dark:border-sky-700/60',
      hoverBorder: 'hover:border-sky-500 dark:hover:border-sky-400',
      text: 'text-sky-700 dark:text-sky-300',
      badgeBg: 'bg-sky-100 dark:bg-sky-950',
      badgeText: 'text-sky-800 dark:text-sky-300',
      badgeBorder: 'border-sky-300 dark:border-sky-800',
      glow: 'shadow-sky-500/15'
    },
    icon: Globe
  },
  {
    id: 'hadia',
    name: 'HADIA',
    fullName: "Hudawis' Association for Devoted Islamic Activities",
    url: 'https://hadia.in',
    description: 'Central alumni network, nationwide educational projects & student community programs.',
    badge: 'Alumni Network',
    colorClasses: {
      bg: 'from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40',
      border: 'border-amber-300/80 dark:border-amber-700/60',
      hoverBorder: 'hover:border-amber-500 dark:hover:border-amber-400',
      text: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-100 dark:bg-amber-950',
      badgeText: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-300 dark:border-amber-800',
      glow: 'shadow-amber-500/15'
    },
    icon: Users
  },
  {
    id: 'hadia-cse',
    name: 'HADIA CSE',
    fullName: 'HADIA Centre for Social Excellence',
    url: 'https://hadiacse.in',
    description: 'Social empowerment, career mentoring, scholarship management & civic engagement.',
    badge: 'Social Excellence',
    colorClasses: {
      bg: 'from-purple-500/10 via-indigo-500/5 to-purple-500/10 dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-purple-950/40',
      border: 'border-purple-300/80 dark:border-purple-700/60',
      hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-400',
      text: 'text-purple-700 dark:text-purple-300',
      badgeBg: 'bg-purple-100 dark:bg-purple-950',
      badgeText: 'text-purple-800 dark:text-purple-300',
      badgeBorder: 'border-purple-300 dark:border-purple-800',
      glow: 'shadow-purple-500/15'
    },
    icon: Sparkles
  }
];

interface OurParentWebsSectionProps {
  className?: string;
}

export const OurParentWebsSection: React.FC<OurParentWebsSectionProps> = ({ className = '' }) => {
  return (
    <section
      id="our-parent-webs-section"
      className={`w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 ${className}`}
      aria-label="Our Parent Webs Official Portals"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border-t-2 border-indigo-400/40 dark:border-indigo-500/30 border-b-4 border-slate-900 shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 via-amber-500 to-purple-500" />
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-2xs">
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Institutional Network</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Verified Official Links
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                Our Parent Webs
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Direct access to university headquarters, academic research engines, and central alumni excellence bodies.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>4 Authenticated Domains</span>
            </div>
          </div>

          {/* Interactive Cards Grid: 4 Parent Portals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARENT_WEBS.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  id={`link-parent-web-${item.id}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-5 rounded-2xl bg-gradient-to-br ${item.colorClasses.bg} border-2 ${item.colorClasses.border} ${item.colorClasses.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between text-left active:scale-[0.98]`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs border border-slate-200 dark:border-slate-800 ${item.colorClasses.text} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.colorClasses.badgeBg} ${item.colorClasses.badgeText} ${item.colorClasses.badgeBorder}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </h3>
                      
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate" title={item.fullName}>
                        {item.fullName}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                      {item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${item.colorClasses.text}`}>
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
