import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser } from '../types';
import { Language, TranslationDict } from '../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  t: TranslationDict;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  t,
  lang,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<'Scholar' | 'Program Chair' | 'Reviewer' | 'Author'>('Scholar');
  const [signupInstitution, setSignupInstitution] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.includes('@') || loginPassword.length < 4) {
      setErrorMessage('Please enter a valid academic email and password (at least 4 characters).');
      return;
    }

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: loginEmail,
      role: 'Scholar',
      institution: 'Academic Institute of Advanced Research',
      createdAt: new Date().toISOString()
    };

    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch (_) {}

    onAuthSuccess(user);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser: AuthUser = {
      id: 'demo-scholar-01',
      name: 'Dr. Sarah Lin (Demo Scholar)',
      email: 's.lin@cambridge.ac.uk',
      role: 'Program Chair',
      institution: 'University of Cambridge, EdTech Lab',
      createdAt: new Date().toISOString()
    };

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (_) {}

    onAuthSuccess(demoUser);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupName.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please provide your full name and valid academic email.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim(),
      role: signupRole,
      institution: signupInstitution.trim() || 'Global Academic Consortium',
      createdAt: new Date().toISOString()
    };

    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch (_) {}

    onAuthSuccess(user);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!forgotEmail.includes('@')) {
      setErrorMessage('Please provide a registered academic email address.');
      return;
    }

    setResetSent(true);
  };

  const handleResetPasswordFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode.length < 4 || newPassword.length < 6) {
      setErrorMessage('Please enter the 4-digit code and a new password (min 6 chars).');
      return;
    }

    setResetCompleted(true);
    setTimeout(() => {
      setMode('login');
      setResetSent(false);
      setResetCompleted(false);
      setLoginEmail(forgotEmail);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        id="auth-modal-card"
        style={{ borderRadius: '16px' }}
        className="relative w-full max-w-md bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[16px] shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_35px_rgba(14,165,233,0.2)] overflow-hidden my-auto border-[1.5px] border-white/70 text-slate-100 transition-all"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <KeyRound className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-1.5 [text-shadow:0_0_12px_rgba(34,211,238,0.4)]">
                <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}</span>
              </h3>
              <p className="text-xs text-zinc-300 font-medium">
                Academic Portal &amp; Abstract Access
              </p>
            </div>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/70 text-red-200 text-xs font-semibold border border-red-500/50 flex items-center gap-2 [text-shadow:0_0_8px_rgba(239,68,68,0.4)]">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="scholar@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold outline-none border border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)]">
                  PASSWORD
                </label>
                <button
                  type="button"
                  id="btn-login-forgot-password"
                  onClick={() => {
                    setErrorMessage('');
                    setMode('forgot');
                  }}
                  className="text-xs text-sky-300 hover:text-sky-200 font-bold transition-colors cursor-pointer hover:underline [text-shadow:0_0_8px_rgba(56,189,248,0.45)]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold outline-none border border-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 shadow-xs"
                />
              </div>
            </div>

            {/* Quick Demo Login */}
            <button
              type="button"
              id="btn-demo-login"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm border border-teal-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Quick Demo Login</span>
            </button>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 hover:from-sky-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Sign In →</span>
            </button>

            {/* Switch to Signup */}
            <div className="text-center pt-3 border-t border-white/10 text-xs text-zinc-300 flex items-center justify-center gap-1.5">
              <span className="text-zinc-300">Don't have an account?</span>
              <button
                type="button"
                id="btn-switch-signup"
                onClick={() => {
                  setErrorMessage('');
                  setMode('signup');
                }}
                className="text-cyan-400 font-bold hover:underline cursor-pointer [text-shadow:0_0_8px_rgba(34,211,238,0.5)] transition-colors hover:text-cyan-300"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* ================= SIGN UP FORM ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                FULL NAME <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-name"
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="Prof. Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                EMAIL ADDRESS <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="jane.doe@stanford.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                  ACADEMIC ROLE
                </label>
                <select
                  id="select-signup-role"
                  value={signupRole}
                  onChange={e => setSignupRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                >
                  <option value="Scholar">Scholar / Researcher</option>
                  <option value="Program Chair">Program Chair</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Author">Author</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                  INSTITUTION
                </label>
                <input
                  id="input-signup-institution"
                  type="text"
                  value={signupInstitution}
                  onChange={e => setSignupInstitution(e.target.value)}
                  placeholder="e.g. Oxford, MIT"
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                  PASSWORD
                </label>
                <input
                  id="input-signup-password"
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                  CONFIRM
                </label>
                <input
                  id="input-signup-confirm-password"
                  type="password"
                  required
                  value={signupConfirmPassword}
                  onChange={e => setSignupConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                />
              </div>
            </div>

            <button
              id="btn-submit-signup"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-98"
            >
              <span>Sign Up →</span>
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center pt-3 border-t border-white/10 text-xs text-zinc-300 flex items-center justify-center gap-1.5">
              <span className="text-zinc-300">Already have an account?</span>
              <button
                type="button"
                id="btn-switch-login"
                onClick={() => {
                  setErrorMessage('');
                  setMode('login');
                }}
                className="text-cyan-400 font-bold hover:underline cursor-pointer [text-shadow:0_0_8px_rgba(34,211,238,0.5)] transition-colors hover:text-cyan-300"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ================= FORGOT PASSWORD FORM ================= */}
        {mode === 'forgot' && (
          <div className="p-6 space-y-4">
            {!resetSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter your registered academic email. We will dispatch a 4-digit verification code to reset your account password securely.
                </p>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="input-forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="scholar@university.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                    />
                  </div>
                </div>

                <button
                  id="btn-send-reset-link"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Send Reset Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : resetCompleted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-sm font-black text-white [text-shadow:0_0_10px_rgba(52,211,153,0.5)]">Password Reset Successful!</h4>
                <p className="text-xs text-zinc-300">Redirecting to Sign In...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordFinal} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-200 text-xs font-bold border border-emerald-500/50">
                  Verification email sent! (Simulated code: <strong className="text-emerald-300 font-mono text-sm">8492</strong>)
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                    4-DIGIT VERIFICATION CODE
                  </label>
                  <input
                    id="input-reset-code"
                    type="text"
                    maxLength={4}
                    required
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    placeholder="e.g. 8492"
                    className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 text-center font-mono font-black tracking-widest text-sm outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-cyan-100/90 [text-shadow:0_0_10px_rgba(34,211,238,0.45),0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                    NEW PASSWORD
                  </label>
                  <input
                    id="input-new-password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-bold outline-none border border-slate-300 focus:border-cyan-400 shadow-xs"
                  />
                </div>

                <button
                  id="btn-confirm-new-password"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
                >
                  Confirm &amp; Update Password
                </button>
              </form>
            )}

            <div className="text-center pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                id="btn-back-to-login"
                onClick={() => {
                  setErrorMessage('');
                  setMode('login');
                }}
                className="text-sky-300 hover:text-sky-200 font-bold hover:underline cursor-pointer [text-shadow:0_0_8px_rgba(56,189,248,0.4)]"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
