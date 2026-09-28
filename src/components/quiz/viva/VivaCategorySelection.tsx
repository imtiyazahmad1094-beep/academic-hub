import React from 'react';
import { 
  Landmark, 
  BookOpen, 
  Brain, 
  FlaskConical, 
  Languages, 
  Scale, 
  BookOpenText, 
  GraduationCap, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Mic
} from 'lucide-react';
import { soundFX } from '../../../utils/audioUtils';

export interface VivaDomain {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  topics: string[];
  accentColor: string;
  gradient: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  activeSessions: number;
  resourcesCount: number;
}

export const VIVA_DOMAINS: VivaDomain[] = [
  {
    id: 'history',
    name: 'History',
    subtitle: 'Historiography, Empires & Governance',
    icon: Landmark,
    topics: ['Islamic History', 'Indian History', 'World History', 'Political History', 'Civilization'],
    accentColor: 'rose',
    gradient: 'from-rose-950/80 via-slate-900 to-red-950/60',
    borderClass: 'border-rose-500/50 hover:border-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300 border-rose-500/40',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white',
    activeSessions: 24,
    resourcesCount: 142
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    subtitle: 'Scriptural Sciences & Jurisprudence',
    icon: BookOpen,
    topics: ["Qur'an", 'Hadith', 'Fiqh', 'Usul al-Fiqh', 'Aqaid', 'Seerah', 'Islamic Civilization', 'Comparative Religion'],
    accentColor: 'emerald',
    gradient: 'from-emerald-950/80 via-slate-900 to-teal-950/60',
    borderClass: 'border-emerald-500/50 hover:border-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300 border-emerald-500/40',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    activeSessions: 38,
    resourcesCount: 285
  },
  {
    id: 'logic-reasoning',
    name: 'Logic & Reasoning',
    subtitle: 'Critical Thinking, Epistemology & Formal Logic',
    icon: Brain,
    topics: ['Critical Thinking', 'Formal Logic', 'Arguments', 'Philosophy of Mind', 'Analytical Reasoning'],
    accentColor: 'indigo',
    gradient: 'from-indigo-950/80 via-slate-900 to-violet-950/60',
    borderClass: 'border-indigo-500/50 hover:border-indigo-400',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300 border-indigo-500/40',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white',
    activeSessions: 19,
    resourcesCount: 96
  },
  {
    id: 'science',
    name: 'Science',
    subtitle: 'Empirical Investigation & Natural Laws',
    icon: FlaskConical,
    topics: ['Quantum Physics', 'Organic Chemistry', 'Molecular Biology', 'Astronomy', 'Scientific Method'],
    accentColor: 'sky',
    gradient: 'from-sky-950/80 via-slate-900 to-blue-950/60',
    borderClass: 'border-sky-500/50 hover:border-sky-400',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300 border-sky-500/40',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
    activeSessions: 31,
    resourcesCount: 190
  },
  {
    id: 'arabic',
    name: 'Arabic',
    subtitle: 'Linguistics, Rhetoric & Classical Literature',
    icon: Languages,
    topics: ['Nahw (Syntax)', 'Sarf (Morphology)', 'Balagha (Rhetoric)', 'Classical Poetry', 'Lexicography'],
    accentColor: 'amber',
    gradient: 'from-amber-950/80 via-slate-900 to-yellow-950/60',
    borderClass: 'border-amber-500/50 hover:border-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300 border-amber-500/40',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950',
    activeSessions: 15,
    resourcesCount: 118
  },
  {
    id: 'political-science',
    name: 'Political Science',
    subtitle: 'Statecraft, Constitutional Law & Global Order',
    icon: Scale,
    topics: ['International Relations', 'Constitutional Law', 'Political Philosophy', 'Comparative Politics'],
    accentColor: 'cyan',
    gradient: 'from-cyan-950/80 via-slate-900 to-slate-900',
    borderClass: 'border-cyan-500/50 hover:border-cyan-400',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300 border-cyan-500/40',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600 text-slate-950',
    activeSessions: 12,
    resourcesCount: 84
  },
  {
    id: 'literature',
    name: 'Literature',
    subtitle: 'Narratology, Hermeneutics & Canon Analysis',
    icon: BookOpenText,
    topics: ['World Literature', 'Literary Theory', 'Rhetoric & Poetics', 'Creative Writing', 'Comparative Classics'],
    accentColor: 'purple',
    gradient: 'from-purple-950/80 via-slate-900 to-fuchsia-950/60',
    borderClass: 'border-purple-500/50 hover:border-purple-400',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300 border-purple-500/40',
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white',
    activeSessions: 17,
    resourcesCount: 110
  },
  {
    id: 'general-academic',
    name: 'General Academic Viva',
    subtitle: 'Cross-Disciplinary Defense & Methodological Rigor',
    icon: GraduationCap,
    topics: ['Thesis Defense', 'Research Methodology', 'Interdisciplinary Inquiry', 'Academic Writing', 'Peer Defense'],
    accentColor: 'teal',
    gradient: 'from-teal-950/80 via-slate-900 to-emerald-950/60',
    borderClass: 'border-teal-500/50 hover:border-teal-400',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300 border-teal-500/40',
    iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950',
    activeSessions: 42,
    resourcesCount: 310
  }
];

interface VivaCategorySelectionProps {
  onBack: () => void;
  onSelectDomain: (domain: VivaDomain) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VivaCategorySelection: React.FC<VivaCategorySelectionProps> = ({
  onBack,
  onSelectDomain,
  onShowToast
}) => {
  const handleDomainClick = (domain: VivaDomain) => {
    soundFX.playSuccess(0.25);
    onShowToast(`Opening ${domain.name} Viva Resource Library...`, 'info');
    onSelectDomain(domain);
  };

  return (
    <div id="viva-category-selection-workspace" className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto pb-12">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white/90 dark:bg-slate-900/85 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs border-t border-white/40 border-b-2 border-slate-900/30 transition-all cursor-pointer active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-black">
          <Mic className="w-4 h-4 text-purple-500 animate-pulse" />
          <span>Oral Defense Examination Engine</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>8 Accredited Domains</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Step 1: Domain Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-slate-900 dark:text-white">
          Choose Your Viva Domain
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Select a subject to enter an oral-defense learning environment. Explore reference literature, upload syllabi documents, and generate evaluated defense inquiries.
        </p>
      </div>

      {/* Grid of 8 Visually Differentiated Academic Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
        {VIVA_DOMAINS.map(domain => {
          const Icon = domain.icon;
          return (
            <div
              key={domain.id}
              onClick={() => handleDomainClick(domain)}
              className={`group relative p-6 rounded-3xl bg-gradient-to-br ${domain.gradient} border-2 ${domain.borderClass} border-t-2 border-t-white/30 border-b-4 border-b-black shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[310px]`}
            >
              {/* Subtle background academic grid pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div>
                {/* Header Strip */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${domain.iconBg} flex items-center justify-center shadow-lg border-t border-white/50 border-b-2 border-black/50 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black border ${domain.badgeBg} ${domain.badgeText}`}>
                    {domain.resourcesCount} Papers
                  </span>
                </div>

                {/* Domain Title & Subtitle */}
                <h3 className="text-xl font-black font-serif text-white group-hover:text-amber-200 transition-colors tracking-tight">
                  {domain.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                  {domain.subtitle}
                </p>

                {/* Topic Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {domain.topics.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                  {domain.topics.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-lg bg-black/20 text-[10px] font-mono text-slate-400">
                      +{domain.topics.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                <span className="flex items-center gap-1.5">
                  <span>Enter Resource Library</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {domain.activeSessions} Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Assistance Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Oral Defense Standards</h4>
            <p className="text-xs text-slate-400">Each domain incorporates real dissertation inquiry rubrics, citation models, and structured viva grading.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleDomainClick(VIVA_DOMAINS[0])}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs border-t border-white/30 border-b-2 border-purple-950 transition-all cursor-pointer whitespace-nowrap shadow-md"
        >
          Quick Launch: History Viva
        </button>
      </div>

    </div>
  );
};
