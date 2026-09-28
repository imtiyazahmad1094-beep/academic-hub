import React, { useState } from 'react';
import { X, Copy, Check, Trash2, AlertCircle } from 'lucide-react';

interface SharePublicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  shareTitle?: string;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SharePublicLinkModal: React.FC<SharePublicLinkModalProps> = ({
  isOpen,
  onClose,
  shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://academic-hub.edu/share/public-thread-2026',
  shareTitle = 'Academic Hub & Research Platform',
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (!isOpen) return null;

  const currentLink = isDeleted ? 'https://academic-hub.edu/link-revoked' : shareUrl;

  const handleCopy = async () => {
    if (isDeleted) {
      if (onShowToast) onShowToast('Link has been deleted and cannot be copied.', 'error');
      return;
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentLink);
      }
      setCopied(true);
      if (onShowToast) onShowToast('Public link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDeleteLink = () => {
    setIsDeleted(true);
    if (onShowToast) {
      onShowToast('This public link has been deleted. Previous access revoked.', 'info');
    }
  };

  const handleSocialClick = (network: string) => {
    if (isDeleted) {
      if (onShowToast) onShowToast('Link was deleted. Re-enable or generate a new link to share.', 'error');
      return;
    }
    const encodedUrl = encodeURIComponent(currentLink);
    const encodedText = encodeURIComponent(`Explore this academic research thread on ${shareTitle}: `);

    let targetUrl = '';
    switch (network) {
      case 'facebook':
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'gmail':
        targetUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'x':
        targetUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'reddit':
        targetUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        targetUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        break;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (onShowToast) onShowToast(`Redirecting to ${network}...`, 'info');
    }
  };

  return (
    <div
      id="share-link-backdrop-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-400/40 dark:bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="share-public-link-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl border-[1.5px] border-slate-200/90 dark:border-slate-850 shadow-2xl shadow-slate-400/20 dark:shadow-sky-950/40 p-6 sm:p-7 space-y-6 text-slate-900 dark:text-white transition-all transform animate-smooth-entry"
      >
        {/* ========================================================= */}
        {/* HEADER: Left-aligned bold "Share link" + Close marker "✕" */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
            Share link
          </h2>
          <button
            type="button"
            id="btn-close-share-modal"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold"
          >
            ✕
          </button>
        </div>

        {/* ========================================================= */}
        {/* WARNING BLOCK: bg-gray-100 container + "THINK & SHARE "   */}
        {/* ========================================================= */}
        <div className="bg-gray-100 dark:bg-zinc-800/90 rounded-xl p-4 border border-gray-200/80 dark:border-zinc-700/60 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-slate-500 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed font-sans">
              <span className="font-extrabold uppercase tracking-wide text-slate-900 dark:text-sky-300 mr-1.5">
                THINK &amp; SHARE
              </span>
              <span>
                This public link shares a thread, which may include personal and academic information. You can{' '}
              </span>
              <button
                type="button"
                id="link-delete-public-share"
                onClick={handleDeleteLink}
                className="text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors inline-block"
              >
                delete
              </button>
              <span> this link at any time, but not copies made by others.</span>
            </div>
          </div>
          {isDeleted && (
            <div className="mt-2.5 pt-2 border-t border-gray-200 dark:border-zinc-700 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Link successfully revoked and deleted from active cache.</span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* LINK INPUT COPY FIELD + "📋 Copy link" PILL WIDGET        */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100/90 dark:bg-zinc-850 border border-gray-200 dark:border-zinc-700/80 shadow-inner">
          <input
            type="text"
            readOnly
            value={currentLink}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-700 dark:text-sky-200 bg-transparent border-none focus:outline-none select-all truncate"
          />
          <button
            type="button"
            id="btn-copy-public-link"
            onClick={handleCopy}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-650 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-600 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>✓ Copied</span>
              </>
            ) : (
              <>
                <span className="text-xs">📋</span>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy link</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* SOCIAL REDIRECTION GRID: 5 CIRCULAR SOCIAL SHARE NODES    */}
        {/* ========================================================= */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block mb-3 text-center">
            Share directly to social platforms
          </span>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            
            {/* 1. Facebook */}
            <button
              type="button"
              id="btn-share-facebook"
              onClick={() => handleSocialClick('facebook')}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                Facebook
              </span>
            </button>

            {/* 2. Gmail */}
            <button
              type="button"
              id="btn-share-gmail"
              onClick={() => handleSocialClick('gmail')}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-md shadow-slate-200/50 dark:shadow-none group-hover:scale-105 group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M1.5 6.5v12a2 2 0 0 0 2 2h2V10.2L1.5 6.5z" />
                  <path fill="#EA4335" d="M12 12.8L2.5 5.5A2 2 0 0 1 3.5 4.5h17a2 2 0 0 1 1 1L12 12.8z" />
                  <path fill="#34A853" d="M22.5 6.5L18.5 10.2v10.3h2a2 2 0 0 0 2-2V6.5z" />
                  <path fill="#FBBC05" d="M5.5 20.5h13V9.8L12 14.5 5.5 9.8z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-red-500 dark:group-hover:text-red-400">
                Gmail
              </span>
            </button>

            {/* 3. X / Twitter */}
            <button
              type="button"
              id="btn-share-x"
              onClick={() => handleSocialClick('x')}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white flex items-center justify-center shadow-md shadow-slate-200/50 dark:shadow-none group-hover:scale-105 group-hover:shadow-lg transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-slate-950 dark:group-hover:text-white">
                X
              </span>
            </button>

            {/* 4. Reddit */}
            <button
              type="button"
              id="btn-share-reddit"
              onClick={() => handleSocialClick('reddit')}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-zinc-800 border border-orange-200 dark:border-zinc-700 text-[#FF4500] flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-[#FF4500]">
                Reddit
              </span>
            </button>

            {/* 5. WhatsApp */}
            <button
              type="button"
              id="btn-share-whatsapp"
              onClick={() => handleSocialClick('whatsapp')}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700 text-[#25D366] flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-[#25D366]">
                WhatsApp
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
