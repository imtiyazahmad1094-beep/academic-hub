import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layers,
  Award
} from 'lucide-react';

interface DhiuPyqGatewayCardProps {
  onOpenPortal: () => void;
}

export const DhiuPyqGatewayCard: React.FC<DhiuPyqGatewayCardProps> = ({ onOpenPortal }) => {
  return (
    <div 
      id="card-dhiu-pyq-gateway"
      onClick={onOpenPortal}
      className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-sky-50/70 to-teal-50/70 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-slate-900/90 backdrop-blur-xl border-2 border-sky-400/70 dark:border-sky-500/40 shadow-xl shadow-sky-500/10 dark:shadow-2xl dark:shadow-black/60 hover:border-sky-500 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow Highlights */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-400/20 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-400/20 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Content Area */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold shadow-xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>DHIU PYQ</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-800">
              <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>Verified Board Archive</span>
            </span>

            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 hidden sm:inline">
              10 Classes • 12 Subjects • 2000–2024
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            Darul Huda Islamic University Past Year Questions Portal
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
            Access the complete digitized repository of examination papers across Class 1 to Class 10. Filter by semester, explore all 12 Islamic and academic subjects, and preview or download verified papers with official answer schemes.
          </p>

          {/* Quick Subject Highlights Bar */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
            {['Adab', 'English', 'Fiqh', 'Hadith', 'Maths', 'Nahv', 'Science', 'Social Science', 'Swarf', 'Tareekh', 'Tasawwuf', 'Urdu'].slice(0, 8).map((sub, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-lg bg-white/80 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-2xs"
              >
                {sub}
              </span>
            ))}
            <span className="px-1.5 py-0.5 rounded-lg text-slate-500 font-bold">+4 more</span>
          </div>
        </div>

        {/* Right Action CTA Button */}
        <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3">
          <div className="text-right hidden lg:block">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Past Papers Hub</div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">600+ Papers</div>
          </div>

          <button
            id="btn-open-dhiu-pyq-gateway"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore DHIU PYQ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
