import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp, 
  Lightbulb, 
  Bug, 
  Palette, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, FeedbackEntry } from '../types';
import { TranslationDict } from '../utils/translations';

interface FeedbackSectionProps {
  currentUser: AuthUser | null;
  feedbackList: FeedbackEntry[];
  onSubmitFeedback: (entry: FeedbackEntry) => void;
  t: TranslationDict;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  currentUser,
  feedbackList,
  onSubmitFeedback,
  t,
}) => {
  const [category, setCategory] = useState<FeedbackEntry['category']>('UI / UX Design');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [likedIds, setLikedIds] = useState<Record<string, number>>({});

  const categories = [
    { id: 'UI / UX Design', label: t.uiux, icon: Palette, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
    { id: 'Feature Request', label: t.featureRequest, icon: Lightbulb, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
    { id: 'Bug Report', label: t.bugReport, icon: Bug, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
    { id: 'General Improvement', label: t.generalIdea, icon: Layers, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newEntry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      category,
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      userName: name.trim() || currentUser?.name || 'Anonymous Scholar',
      userEmail: email.trim() || currentUser?.email || 'scholar@consortium.org'
    };

    onSubmitFeedback(newEntry);
    setIsSubmitted(true);
    setMessage('');

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (_) {}

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const handleLike = (id: string) => {
    setLikedIds(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div id="section-feedback-improvement" className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div 
        className="section-box-glass section-box-feedback p-6 sm:p-7 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Emerald Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Community Driven Development</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 neon-glow-emerald">
            {t.leaveFeedbackTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.leaveFeedbackDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <div 
          className="lg:col-span-7 section-box-glass p-6 sm:p-7 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquarePlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.leaveFeedbackTitle}
            </h3>
          </div>

          {isSubmitted ? (
            <div 
              className="p-8 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-400 dark:border-emerald-700 text-center space-y-3"
              style={{ borderRadius: '12px' }}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t.feedbackSubmitted}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your recommendations help shape the next iteration of the Academic &amp; Abstract Manager.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.feedbackCategory}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`flex items-center gap-2.5 p-3 text-xs font-bold border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-transparent shadow-md ring-2 ring-emerald-400'
                            : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-emerald-500/20 hover:bg-white'
                        }`}
                        style={{ borderRadius: '10px' }}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : cat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.feedbackRating}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 ml-2">
                    {rating === 5 ? 'Exceptional' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t.feedbackMessage} <span className="text-emerald-500">*</span>
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {message.length} characters
                  </span>
                </div>
                <textarea
                  id="input-feedback-message"
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Share ideas on layouts, UI glass aesthetics, filter tools, or export preferences..."
                  className="w-full p-3.5 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs sm:text-sm font-medium outline-none text-slate-800 dark:text-slate-200"
                  style={{ borderRadius: '10px' }}
                />
              </div>

              {/* Author Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t.fullName}
                  </label>
                  <input
                    id="input-feedback-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Prof. / Dr. / Researcher"
                    className="w-full px-3.5 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t.email}
                  </label>
                  <input
                    id="input-feedback-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="scholar@university.edu"
                    className="w-full px-3.5 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-emerald-500/30 focus:border-emerald-500 text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              </div>

              <button
                id="btn-submit-feedback"
                type="submit"
                disabled={!message.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                style={{ borderRadius: '10px' }}
              >
                <Send className="w-4 h-4" />
                <span>{t.submitFeedback}</span>
              </button>
            </form>
          )}
        </div>

        {/* Community Suggestions Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Scholar Suggestions ({feedbackList.length})
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Live Feed</span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {feedbackList.map(entry => {
              const likes = (likedIds[entry.id] || 0);
              return (
                <div 
                  key={entry.id}
                  className="section-box-glass p-4 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.08)] space-y-2.5 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {entry.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < entry.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    "{entry.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{entry.userName}</span>
                    <button
                      type="button"
                      onClick={() => handleLike(entry.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 cursor-pointer font-bold"
                    >
                      <ThumbsUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{likes > 0 ? `+${likes}` : 'Upvote'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
