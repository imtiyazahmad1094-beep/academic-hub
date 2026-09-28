import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Award, 
  AlertCircle, 
  Layers, 
  Check, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { AcademicNotification } from '../types';
import { TranslationDict } from '../utils/translations';

interface NotificationsSectionProps {
  notifications: AcademicNotification[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onSelectProgramId?: (programId: string) => void;
  t: TranslationDict;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead,
  onDeleteNotification,
  onSelectProgramId,
  t,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => (filter === 'all' ? true : !n.read));
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AcademicNotification['type']) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-red-500" />;
      case 'acceptance':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'review':
        return <Layers className="w-4 h-4 text-sky-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div 
        className="section-box-glass section-box-notifications p-6 sm:p-7 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Rose Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
            <Bell className="w-3.5 h-3.5 text-rose-500" />
            <span>Academic Dispatch Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white neon-glow-rose">
            {t.notifications}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
            You have <span className="font-bold text-rose-600 dark:text-rose-400">{unreadCount} unread</span> alerts and upcoming deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white text-xs font-bold border border-rose-500/30 cursor-pointer shadow-2xs transition-all"
              style={{ borderRadius: '10px' }}
            >
              <CheckCheck className="w-4 h-4 text-rose-600" />
              <span>Mark All as Read</span>
            </button>
          )}

          <div 
            className="flex items-center bg-white/80 dark:bg-slate-800/80 p-1 border border-rose-500/30"
            style={{ borderRadius: '10px' }}
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-bold cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              style={{ borderRadius: '8px' }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs font-bold cursor-pointer transition-all ${
                filter === 'unread'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              style={{ borderRadius: '8px' }}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div 
            className="section-box-glass section-box-notifications p-12 text-center border-[1.5px] border-rose-500/30 space-y-2"
            style={{ borderRadius: '12px' }}
          >
            <Bell className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Notifications</h3>
            <p className="text-xs text-slate-500">All alerts and reviews have been attended to.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const isPriority = notif.priority === 'high' || notif.type === 'deadline';
            const isSystem = notif.type === 'system';
            const isStandard = !isPriority && !isSystem;

            // Tier styling
            let cardClasses = '';
            let iconWrapperClasses = '';
            let titleClasses = '';
            let badgeClasses = '';
            let timeAccentClasses = '';

            if (isPriority) {
              // Priority Alerts: Soft coral-red border, ultra-light red background wash, dark blood-red charcoal text
              cardClasses = notif.read
                ? 'border-[1.5px] border-red-500/30 dark:border-red-500/30 bg-red-50/50 dark:bg-red-950/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] opacity-90'
                : 'border-[1.5px] border-red-500/40 dark:border-red-500/50 bg-red-50/70 dark:bg-red-950/40 shadow-[0_0_16px_rgba(239,68,68,0.18)]';
              iconWrapperClasses = 'bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700';
              titleClasses = 'text-red-950 dark:text-red-100 font-extrabold drop-shadow-[0_0_6px_rgba(239,68,68,0.2)]';
              badgeClasses = 'bg-red-100 text-red-950 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700 font-extrabold';
              timeAccentClasses = 'text-red-950/80 dark:text-red-200/90 font-semibold';
            } else if (isStandard) {
              // Standard/Pending Alerts: Clean neutral medium-blue border, soft blue accent icon
              cardClasses = notif.read
                ? 'border-[1.5px] border-sky-400/35 dark:border-sky-500/30 bg-sky-50/40 dark:bg-sky-950/20 shadow-[0_0_8px_rgba(14,165,233,0.08)] opacity-90'
                : 'border-[1.5px] border-sky-500/50 dark:border-sky-500/50 bg-sky-50/70 dark:bg-sky-950/40 shadow-[0_0_14px_rgba(14,165,233,0.16)]';
              iconWrapperClasses = 'bg-sky-100 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700';
              titleClasses = 'text-slate-950 dark:text-sky-100 font-extrabold';
              badgeClasses = 'bg-sky-100 text-sky-950 dark:bg-sky-900 dark:text-sky-100 border border-sky-300 dark:border-sky-700 font-extrabold';
              timeAccentClasses = 'text-slate-700 dark:text-sky-300 font-semibold';
            } else {
              // System/Model Updates: Isolated charcoal border strip, neutral steel-gray layout
              cardClasses = notif.read
                ? 'border-[1.5px] border-slate-300/60 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-900/60 shadow-[0_0_8px_rgba(71,85,105,0.08)] opacity-90'
                : 'border-[1.5px] border-slate-400/70 dark:border-slate-600/70 bg-slate-100/90 dark:bg-slate-800/90 shadow-[0_0_14px_rgba(71,85,105,0.16)]';
              iconWrapperClasses = 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600';
              titleClasses = 'text-slate-950 dark:text-slate-100 font-extrabold';
              badgeClasses = 'bg-slate-200 text-slate-950 dark:bg-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600 font-extrabold';
              timeAccentClasses = 'text-slate-700 dark:text-slate-300 font-semibold';
            }

            return (
              <div
                key={notif.id}
                className={`section-box-glass p-4 sm:p-5 transition-all flex items-start justify-between gap-4 ${cardClasses}`}
                style={{ borderRadius: '12px' }}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconWrapperClasses}`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm truncate ${titleClasses}`}>
                        {notif.title}
                      </h3>
                      {isPriority && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badgeClasses}`}>
                          Priority Alert
                        </span>
                      )}
                      {isStandard && notif.type === 'review' && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badgeClasses}`}>
                          Review Assigned
                        </span>
                      )}
                      {isSystem && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badgeClasses}`}>
                          System Update
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${
                      isPriority
                        ? 'text-red-950 dark:text-red-100 font-medium'
                        : 'text-slate-800 dark:text-slate-200 font-normal'
                    }`}>
                      {notif.message}
                    </p>

                    <div className={`flex items-center gap-3 pt-1 text-[11px] ${timeAccentClasses}`}>
                      <span>{new Date(notif.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.programId && onSelectProgramId && (
                        <button
                          onClick={() => onSelectProgramId(notif.programId!)}
                          className={`font-bold hover:underline cursor-pointer ${
                            isPriority ? 'text-red-900 dark:text-red-300' : isStandard ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-slate-200'
                          }`}
                        >
                          Open Program &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleRead(notif.id)}
                    title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                  >
                    <Check className={`w-4 h-4 ${notif.read ? 'text-slate-400' : isPriority ? 'text-red-600' : 'text-sky-600'}`} />
                  </button>
                  <button
                    onClick={() => onDeleteNotification(notif.id)}
                    title="Dismiss"
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
