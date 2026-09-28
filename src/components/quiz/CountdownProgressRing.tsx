import React from 'react';
import { Flame, AlertTriangle, Clock } from 'lucide-react';

interface CountdownProgressRingProps {
  remainingMs: number;
  totalMs: number;
  isPaused?: boolean;
  size?: number;
  strokeWidth?: number;
}

export const CountdownProgressRing: React.FC<CountdownProgressRingProps> = ({
  remainingMs,
  totalMs,
  isPaused = false,
  size = 84,
  strokeWidth = 7
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Normalized percentage [0 to 100]
  const ratio = Math.max(0, Math.min(1, remainingMs / (totalMs || 30000)));
  // SVG stroke-dashoffset: when ratio=1 offset=0; when ratio=0 offset=circumference
  const strokeDashoffset = circumference * (1 - ratio);

  const secondsRemaining = Math.max(0, Math.ceil(remainingMs / 1000));
  const isUnder10 = secondsRemaining <= 10 && remainingMs > 0;
  const isCriticallyLow = secondsRemaining <= 5 && remainingMs > 0;

  // Determine dynamic ring colors
  let strokeColor = '#2dd4bf'; // teal-400
  let strokeSecondaryColor = '#06b6d4'; // cyan-500
  let textColorClass = 'text-teal-300';
  let badgeText = 'Defense Active';
  let badgeColorClass = 'bg-teal-950/80 text-teal-300 border-teal-500/40';

  if (isUnder10) {
    strokeColor = '#ef4444'; // red-500
    strokeSecondaryColor = '#f87171'; // red-400
    textColorClass = 'text-red-400 font-black';
    badgeText = isCriticallyLow ? 'CRITICAL DEFENSE' : 'FINAL 10s DEFENSE';
    badgeColorClass = 'bg-red-950/90 text-red-300 border-red-500 shadow-lg shadow-red-500/30';
  } else if (secondsRemaining <= 18) {
    strokeColor = '#f59e0b'; // amber-500
    strokeSecondaryColor = '#fbbf24'; // amber-400
    textColorClass = 'text-amber-300';
    badgeText = 'Time Dwindling';
    badgeColorClass = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
  }

  return (
    <div 
      className={`relative flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border transition-all duration-300 ${
        isUnder10 
          ? 'border-red-500/80 shadow-2xl shadow-red-600/30 animate-timer-pulse-red' 
          : 'border-slate-700/80 shadow-lg shadow-black/40'
      }`}
      aria-label={`Countdown timer: ${secondsRemaining} seconds remaining`}
    >
      {/* SVG Circular Progress Ring */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 origin-center overflow-visible"
        >
          <defs>
            {/* Standard Gradient */}
            <linearGradient id="ringTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Amber Gradient */}
            <linearGradient id="ringAmberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Red Pulsing Gradient */}
            <linearGradient id="ringRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={`text-slate-800/80 transition-colors duration-300 ${
              isUnder10 ? 'text-red-950/60' : ''
            }`}
          />

          {/* Animated Progress Ring Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={
              isUnder10 
                ? 'url(#ringRedGradient)' 
                : secondsRemaining <= 18 
                ? 'url(#ringAmberGradient)' 
                : 'url(#ringTealGradient)'
            }
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-150 ease-out ${
              isUnder10 ? 'animate-timer-ring-glow-red' : ''
            }`}
          />
        </svg>

        {/* Numeric Time in Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span 
            className={`font-mono text-xl sm:text-2xl font-black tracking-tighter leading-none transition-colors duration-200 ${textColorClass} ${
              isUnder10 ? 'scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''
            }`}
          >
            {secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
          </span>
          <span className={`text-[9px] font-mono uppercase font-bold tracking-widest leading-tight ${
            isUnder10 ? 'text-red-400 font-extrabold animate-pulse' : 'text-slate-400'
          }`}>
            SEC
          </span>
        </div>
      </div>

      {/* Detail Labeling / Urgent Beacon */}
      <div className="flex flex-col justify-center gap-1">
        <div className="flex items-center gap-1.5">
          {isUnder10 ? (
            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
          ) : secondsRemaining <= 18 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-teal-400" />
          )}
          
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider border transition-all duration-300 ${badgeColorClass}`}>
            {badgeText}
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {isPaused ? (
            <span className="text-amber-400 font-bold">Paused by Host</span>
          ) : isUnder10 ? (
            <span className="text-red-400 font-bold animate-pulse">
              Submit oral defense now!
            </span>
          ) : (
            <span>Timer Synchronized</span>
          )}
        </div>
      </div>
    </div>
  );
};
