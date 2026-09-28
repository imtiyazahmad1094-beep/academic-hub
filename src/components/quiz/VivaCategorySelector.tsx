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
  ChevronRight, 
  Sparkles, 
  Mic, 
  FileText, 
  Users,
  Compass,
  Layers
} from 'lucide-react';
import { VivaDomain, VIVA_DOMAINS } from '../../data/vivaEcosystemData';
import { soundFX } from '../../utils/audioUtils';

interface VivaCategorySelectorProps {
  onSelectDomain: (domain: VivaDomain) => void;
  onBackToDiscovery: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VivaCategorySelector: React.FC<VivaCategorySelectorProps> = ({
  onSelectDomain,
  onBackToDiscovery,
  onShowToast
}) => {
  const getDomainIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      case 'Languages':
        return <Languages className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'BookOpenText':
        return <BookOpenText className={className} />;
      case 'GraduationCap':
      default:
        return <GraduationCap className={className} />;
    }
  };

  return (
    <div 
      id="viva-category-selection-workspace"
      className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto pb-12"
    >
      {/* Top Breadcrumb & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDiscovery}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs border-t border-white/40 border-b-2 border-slate-900/30 transition-all cursor-pointer active:translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Academic Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-600 dark:text-purple-400 font-bold">Viva Oral Defense Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-black">
            <Mic className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>Oral Assessment Active</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
            8 Certified Domains
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-800 dark:text-purple-200 text-xs font-mono font-black tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Viva Oral Assessment Matrix</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-900 dark:text-white">
          Choose Your Viva Domain
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Select an academic discipline to enter a rigorous oral-defense environment with verified reference links, curated PDF archives, and AI-evaluated dialectic defense simulations.
        </p>
      </div>

      {/* Differentiated Academic Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {VIVA_DOMAINS.map((domain, index) => {
          return (
            <div
              key={domain.id}
              onClick={() => {
                soundFX.playClick(0.3);
                onSelectDomain(domain);
                onShowToast(`Entered ${domain.name} Viva Resource Library`, 'success');
              }}
              className={`group relative rounded-3xl p-6 bg-gradient-to-br ${domain.gradientTheme} text-white border-t-2 border-white/30 border-b-4 border-black shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden`}
              style={{ borderRadius: '24px' }}
            >
              {/* Subtle Academic Watermark Glyphs */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                {getDomainIcon(domain.iconName, 'w-full h-full text-white')}
              </div>

              {/* Card Header */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${domain.badgeColor} text-white flex items-center justify-center shadow-lg border-t border-white/50 border-b-2 border-black/40 group-hover:scale-110 transition-transform`}>
                    {getDomainIcon(domain.iconName, 'w-6 h-6 text-white')}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 font-bold backdrop-blur-md">
                    Domain 0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black font-serif text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed line-clamp-3">
                    {domain.description}
                  </p>
                </div>

                {/* Topics Matrix */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Core Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.topics.slice(0, 4).map((topic, i) => (
                      <span 
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-200 border border-white/15 font-mono"
                      >
                        {topic}
                      </span>
                    ))}
                    {domain.topics.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                        +{domain.topics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-6 mt-4 border-t border-white/10 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    <span>{domain.resourcesCount} Docs</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span>{domain.questionCount} Questions</span>
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-slate-950 flex items-center justify-center transition-all shadow-md">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
