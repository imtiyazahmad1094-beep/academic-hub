import React from 'react';
import { Radio, AlertTriangle, X } from 'lucide-react';

interface HostingLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveKeepHosting: () => void;
  onLeaveStopHosting: () => void;
  roomPin?: string;
}

export const HostingLifecycleModal: React.FC<HostingLifecycleModalProps> = ({
  isOpen,
  onClose,
  onLeaveKeepHosting,
  onLeaveStopHosting,
  roomPin = '941 985'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="hosting-lifecycle-modal-container"
        className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 relative overflow-hidden animate-smooth-entry"
        style={{ borderRadius: '24px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Edge Highlight for 3D tactile effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-rose-400" />

        {/* Close "X" Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-md">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        {/* Header Title */}
        <h3 className="text-xl sm:text-2xl font-black text-center text-slate-900 dark:text-white mb-2 font-serif tracking-tight">
          Would you like to continue hosting?
        </h3>

        {/* Subtext Description */}
        <p className="text-xs sm:text-sm text-center text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          The same PIN <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">({roomPin})</span> will be used and all players stay connected until you stop hosting.
        </p>

        {/* Action Button Stack (3 vertically stacked high-contrast 3D separate boxes) */}
        <div className="space-y-3">
          
          {/* Button 1: Leave — Keep hosting (Solid glowing mint-green 3D block) */}
          <button
            type="button"
            id="btn-leave-keep-hosting"
            onClick={onLeaveKeepHosting}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 border-t-2 border-white/30 border-b-4 border-emerald-800 dark:border-emerald-950 shadow-lg shadow-emerald-500/25 active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Leave — Keep hosting</span>
          </button>

          {/* Button 2: Leave — Stop hosting (Intense glowing coral-red 3D block) */}
          <button
            type="button"
            id="btn-leave-stop-hosting"
            onClick={onLeaveStopHosting}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 border-t-2 border-white/30 border-b-4 border-rose-900 dark:border-rose-950 shadow-lg shadow-rose-500/25 active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Leave — Stop hosting</span>
          </button>

          {/* Button 3: Cancel (Clean neutral secondary cream/white outline block with dark text) */}
          <button
            type="button"
            id="btn-leave-cancel"
            onClick={onClose}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm tracking-wide flex items-center justify-center border-t-2 border-white/60 dark:border-white/10 border-b-3 border-slate-300 dark:border-slate-950 shadow-sm active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
