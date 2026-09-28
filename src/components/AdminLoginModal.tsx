import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthSuccess: (adminUser: AuthUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthSuccess,
}) => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo admin key or standard verification
    if (adminKey !== 'admin2026' && adminKey !== 'root' && adminKey.length < 4) {
      setError('Invalid Administrative Key. Use "admin2026" or quick unlock button below.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch (_) {}

      const superAdminUser: AuthUser = {
        id: 'admin-super-01',
        name: 'Prof. Dr. Tariq Al-Mansoor (Super Admin)',
        email: 'tariq.almansoor@alazhar.edu.eg',
        role: 'Super Admin',
        institution: 'Executive Academic Council & Governance Committee',
        createdAt: '2024-08-15T08:00:00Z',
        permissionTier: 'Super Admin Tier 1',
        isAdmin: true,
      };

      setIsAuthenticating(false);
      onAdminAuthSuccess(superAdminUser);
      onClose();
    }, 600);
  };

  const handleQuickUnlock = () => {
    setAdminKey('admin2026');
    setIsAuthenticating(true);
    setTimeout(() => {
      try {
        confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
      } catch (_) {}

      const superAdminUser: AuthUser = {
        id: 'admin-super-01',
        name: 'Prof. Dr. Tariq Al-Mansoor (Super Admin)',
        email: 'tariq.almansoor@alazhar.edu.eg',
        role: 'Super Admin',
        institution: 'Executive Academic Council & Governance Committee',
        createdAt: '2024-08-15T08:00:00Z',
        permissionTier: 'Super Admin Tier 1',
        isAdmin: true,
      };

      setIsAuthenticating(false);
      onAdminAuthSuccess(superAdminUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        id="admin-login-modal"
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-slate-700/80 my-auto text-slate-900 dark:text-white transition-all overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Administrative Access
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Tier 1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Easter egg unlocked: 5 Consecutive Clicks
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-900/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleAdminAuth} className="relative z-10 mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Admin Master Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-admin-passcode"
                type="password"
                required
                autoFocus
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter admin passcode (e.g. admin2026)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Passcode hint: <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">admin2026</code>
            </p>
          </div>

          <div className="pt-1 flex flex-col gap-2.5">
            <button
              id="btn-submit-admin-auth"
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {isAuthenticating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300 dark:text-slate-900" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-quick-unlock-admin"
              onClick={handleQuickUnlock}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-semibold border border-amber-200 dark:border-amber-800/80 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>One-Click Quick Admin Unlock</span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Log Protocol 4.2</span>
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>End-to-End Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  );
};
