import React, { useState } from 'react';
import { X, Link2, Bookmark, Save } from 'lucide-react';

interface SubmitLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLink: (data: { url: string; title: string }) => void;
}

export const SubmitLinkModal: React.FC<SubmitLinkModalProps> = ({
  isOpen,
  onClose,
  onSubmitLink
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedUrl) {
      setError('Please enter a valid weblink URL.');
      return;
    }

    // Ensure valid URL prefix or format
    let finalUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalTitle = trimmedTitle || 'Live Registration Site';

    onSubmitLink({
      url: finalUrl,
      title: finalTitle
    });

    // Reset and close
    setUrl('');
    setTitle('');
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setError(null);
    setUrl('');
    setTitle('');
    onClose();
  };

  return (
    <div
      id="submit-link-modal-overlay"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 dark:bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={handleCancel}
    >
      <div
        id="submit-link-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border-[1.5px] border-slate-200 dark:border-sky-500/40 shadow-2xl shadow-black/40 dark:shadow-sky-950/50 p-6 sm:p-7 space-y-6 text-slate-900 dark:text-white transition-all transform animate-smooth-entry"
      >
        {/* ========================================================= */}
        {/* HEADER: Title & Close Button                              */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                Submit Link Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-cyan-300 font-medium">
                Ingest unauthenticated external web references into directory view
              </p>
            </div>
          </div>
          
          <button
            type="button"
            id="btn-close-submit-link-modal"
            onClick={handleCancel}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-base font-semibold"
          >
            ✕
          </button>
        </div>

        {/* ========================================================= */}
        {/* FORM FIELDS                                               */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-fade-in">
              {error}
            </div>
          )}

          {/* Input Field 1 (Weblink URL) */}
          <div className="space-y-1.5 text-left">
            <label 
              htmlFor="submit-link-url"
              className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-cyan-300 flex items-center gap-1.5"
            >
              <span>🔗 WEBLINK URL</span>
              <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="submit-link-url"
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., https://dhiu.edu.eg"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-cyan-500/50 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-cyan-100 placeholder-slate-400 dark:placeholder-cyan-700/70 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Input Field 2 (Title) */}
          <div className="space-y-1.5 text-left">
            <label 
              htmlFor="submit-link-title"
              className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300 flex items-center gap-1.5"
            >
              <span>🏷️ TITLE</span>
            </label>
            <div className="relative">
              <input
                id="submit-link-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Live Registration Site"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-sky-500/50 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-sky-700/70 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Leave blank to default to &quot;Live Registration Site&quot;.
            </p>
          </div>

          {/* ========================================================= */}
          {/* EXECUTION ACTIONS: Cancel & "💾 Save Link Reference"      */}
          {/* ========================================================= */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="btn-cancel-submit-link"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-save-link-reference"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-sky-500/20 dark:shadow-cyan-950/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>💾 Save Link Reference</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
