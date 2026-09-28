import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Globe, 
  Building2, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Plus, 
  Edit3, 
  Layers,
  Sparkles,
  FileText,
  User,
  Check,
  Tag,
  Star,
  Share2,
  Link2
} from 'lucide-react';
import { UserWorkItem, WorkLifecycleStatus, AcademicProgram } from '../types';
import { formatFriendlyDate } from '../utils/academicUtils';
import { TranslationDict } from '../utils/translations';

interface MyWorksSectionProps {
  works: UserWorkItem[];
  programs?: AcademicProgram[];
  onSelectProgram?: (programIdOrProg: any) => void;
  onUpdateStatus?: (workId: string, newStatus: WorkLifecycleStatus) => void;
  onUpdateWorkStatus?: (workId: string, newStatus: WorkLifecycleStatus) => void;
  onDeleteWork?: (workId: string) => void;
  onRemoveWorkItem?: (workId: string) => void;
  onAddCustomWork?: (item: Omit<UserWorkItem, 'id' | 'updatedAt'>) => void;
  onAddCustomTask?: (task: Partial<UserWorkItem>) => void;
  onOpenShare?: (url?: string, title?: string) => void;
  onOpenSubmitLink?: () => void;
  t?: TranslationDict;
}

export const MyWorksSection: React.FC<MyWorksSectionProps> = ({
  works,
  programs = [],
  onSelectProgram,
  onUpdateStatus,
  onUpdateWorkStatus,
  onDeleteWork,
  onRemoveWorkItem,
  onAddCustomWork,
  onAddCustomTask,
  onOpenShare,
  onOpenSubmitLink,
  t
}) => {
  const [activeTab, setActiveTab] = useState<WorkLifecycleStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Islamic Topics' | 'Simple Topics'>('Islamic Topics');
  const [newTaskStatus, setNewTaskStatus] = useState<WorkLifecycleStatus>('Selected');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('2026-09-20');

  const handleStatusChange = (workId: string, newStatus: WorkLifecycleStatus) => {
    if (onUpdateStatus) onUpdateStatus(workId, newStatus);
    else if (onUpdateWorkStatus) onUpdateWorkStatus(workId, newStatus);
  };

  const handleRemove = (workId: string) => {
    if (onDeleteWork) onDeleteWork(workId);
    else if (onRemoveWorkItem) onRemoveWorkItem(workId);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const payload = {
      type: 'task' as const,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      status: newTaskStatus,
      date: newTaskDate,
      notes: newTaskNotes.trim() || undefined,
      userNotes: newTaskNotes.trim() || undefined,
    };

    if (onAddCustomWork) {
      onAddCustomWork(payload);
    } else if (onAddCustomTask) {
      onAddCustomTask(payload);
    }

    setNewTaskTitle('');
    setNewTaskNotes('');
    setIsAddingTask(false);
  };

  // Filter works by tab and search
  const filteredWorks = works.filter(w => {
    const matchesTab = activeTab === 'All' || w.status === activeTab;
    const matchesSearch = 
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.category && w.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.notes && w.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.speaker && w.speaker.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const counts = {
    All: works.length,
    Selected: works.filter(w => w.status === 'Selected').length,
    Done: works.filter(w => w.status === 'Done').length,
    Pending: works.filter(w => w.status === 'Pending').length,
    Postponed: works.filter(w => w.status === 'Postponed').length,
  };

  const tabs: Array<{ id: WorkLifecycleStatus | 'All'; label: string; count: number; colorClass: string }> = [
    { id: 'All', label: 'All Works', count: counts.All, colorClass: 'bg-slate-500 text-white' },
    { id: 'Selected', label: 'Selected', count: counts.Selected, colorClass: 'bg-sky-500 text-white' },
    { id: 'Done', label: 'Done', count: counts.Done, colorClass: 'bg-emerald-600 text-white' },
    { id: 'Pending', label: 'Pending', count: counts.Pending, colorClass: 'bg-amber-500 text-white' },
    { id: 'Postponed', label: 'Postponed', count: counts.Postponed, colorClass: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="my-works-workspace">
      
      {/* Top Header Card */}
      <div 
        className="section-box-glass section-box-my-works p-6 sm:p-8 relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-sky-400/20 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 shadow-2xs">
                <BookmarkCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2 neon-glow-cyan">
                <span>{t?.myWorks ? `${t.myWorks} • Workspace` : 'My Works Workspace'}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-sans">
              Curate, monitor, and synchronize your personal research commitments, interested symposiums, and abstract submissions across lifecycle stages.
            </p>
          </div>

          <button
            id="btn-add-custom-task"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingTask ? 'Close Form' : '+ Add Custom Research Item'}</span>
          </button>
        </div>

        {/* Custom Task Creation Dropdown */}
        {isAddingTask && (
          <form 
            onSubmit={handleCreateTask}
            className="mt-6 p-5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] space-y-4 animate-fade-in"
            style={{ borderRadius: '12px' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-500/20">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Log New Research Target or Milestone</span>
              </h4>
              <button 
                type="button" 
                onClick={() => setIsAddingTask(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Title / Research Commitment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare Final Slide Deck for Quantum ML Keynote..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Date</label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={e => setNewTaskDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Thematic Track</label>
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none cursor-pointer"
                >
                  <option value="Islamic Topics">Islamic Topics</option>
                  <option value="Simple Topics">Simple Topics</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Initial Lifecycle Status</label>
                <select
                  value={newTaskStatus}
                  onChange={e => setNewTaskStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none cursor-pointer"
                >
                  <option value="Selected">Selected</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                  <option value="Postponed">Postponed</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Notes / Objectives (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Needs consultation with editorial board..."
                  value={newTaskNotes}
                  onChange={e => setNewTaskNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Add to Works
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Lifecycle Stage Tabs */}
        <div 
          className="flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.1)] overflow-x-auto"
          style={{ borderRadius: '12px' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-myworks-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search filter input & Submit Link Action */}
        <div className="flex items-center gap-2">
          {onOpenSubmitLink && (
            <button
              id="btn-myworks-submit-link"
              type="button"
              onClick={onOpenSubmitLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Ingest external web reference into active directory"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>🔗 Submit Link</span>
            </button>
          )}

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search within my works..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 glass-input text-xs outline-none border-sky-500/30 focus:border-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.08)]"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Works Items Grid */}
      {filteredWorks.length === 0 ? (
        <div 
          className="section-box-glass section-box-my-works p-12 text-center space-y-3"
          style={{ borderRadius: '12px' }}
        >
          <BookmarkCheck className="w-12 h-12 mx-auto text-sky-400/60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
            No research items found in "{activeTab}" stage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Interact with any program details modal and select <span className="font-bold text-sky-600 dark:text-sky-400">"Interested"</span> to automatically aggregate it into this workspace, or use the "+ Add Custom Research Item" button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorks.map(work => {
            const statusBadgeColors = {
              Selected: 'bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-100 border-sky-300 dark:border-sky-700 font-extrabold',
              Done: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700 font-extrabold',
              Pending: 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-700 font-extrabold',
              Postponed: 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100 border-rose-300 dark:border-rose-700 font-extrabold',
            };

            return (
              <div
                key={work.id}
                id={`work-card-${work.id}`}
                className="section-box-glass p-5 transition-all border border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_22px_rgba(14,165,233,0.25)] space-y-3.5 flex flex-col justify-between group bg-white/95 dark:bg-slate-900/95"
                style={{ borderRadius: '12px' }}
              >
                <div>
                  {/* Top Meta: Type, Category, Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                        {work.type}
                      </span>

                      {work.category && (
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          work.category === 'Islamic Topics'
                            ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : 'bg-indigo-50 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                        }`}>
                          {work.category}
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border shadow-2xs ${statusBadgeColors[work.status]}`}>
                      {work.status}
                    </span>
                  </div>

                  {/* Title in maximum contrast charcoal black or high-contrast dark indigo */}
                  <h3 
                    onClick={() => {
                      if (work.programId && onSelectProgram) {
                        onSelectProgram(work.programId);
                      }
                    }}
                    className={`text-base font-extrabold font-serif text-slate-950 dark:text-white leading-snug ${
                      work.programId ? 'cursor-pointer hover:text-sky-700 dark:hover:text-cyan-300' : ''
                    }`}
                  >
                    {work.title}
                  </h3>

                  {/* Notes / Description snippet */}
                  {(work.notes || work.userNotes) && (
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed line-clamp-2 font-normal">
                      {work.notes || work.userNotes}
                    </p>
                  )}

                  {/* Program Extra Details */}
                  {work.date && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>{formatFriendlyDate(work.date)}</span>
                      </div>
                      {work.time && (
                        <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{work.time}</span>
                        </div>
                      )}
                      {work.speaker && (
                        <div className="flex items-center gap-1 text-slate-900 dark:text-slate-100 font-bold">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{work.speaker}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Lifecycle Switcher & Remove */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold mr-1">Move:</span>
                    {(['Selected', 'Done', 'Pending', 'Postponed'] as WorkLifecycleStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(work.id, st)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors ${
                          work.status === st
                            ? 'bg-slate-950 text-white dark:bg-sky-500 dark:text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onOpenShare && (
                      <button
                        id={`btn-share-work-${work.id}`}
                        type="button"
                        onClick={() => onOpenShare(
                          typeof window !== 'undefined' ? `${window.location.origin}#work-${work.id}` : 'https://academic-hub.edu/share/work',
                          work.title
                        )}
                        title="Share link to this work"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(work.id)}
                      title="Remove from My Works"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
