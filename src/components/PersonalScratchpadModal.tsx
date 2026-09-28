import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  StickyNote, 
  CheckSquare, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  AlertCircle, 
  Tag, 
  Copy, 
  Check, 
  UploadCloud, 
  RefreshCw,
  Search,
  ListTodo,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  X,
  FileUp,
  Download,
  Eye,
  CheckCircle2,
  Zap,
  Paperclip
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PersonalReminder {
  id: string;
  task: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate?: string;
  completed: boolean;
  category?: string;
  createdAt: string;
}

export interface ScratchpadSnippet {
  id: string;
  content: string;
  sourceType: 'pasted-text' | 'pdf-snippet' | 'extracted-note' | 'image-ocr';
  tags: string[];
  extractedDeadlines: string[];
  createdAt: string;
}

export interface AttachedPersonalFile {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
  uploadedAt: string;
  extractedKeywords?: string[];
}

const DEFAULT_FILES: AttachedPersonalFile[] = [
  {
    id: 'file-1',
    name: 'Oxford_AI_Ethics_Draft_Paper_v2.pdf',
    size: '1.4 MB',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
    type: 'application/pdf',
    uploadedAt: '2026-09-19 14:15',
    extractedKeywords: ['Ethics', 'Governance', 'Decoherence', 'Shariah AI']
  },
  {
    id: 'file-2',
    name: 'Cambridge_Quantum_Colloquium_Schedule.pdf',
    size: '850 KB',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    type: 'application/pdf',
    uploadedAt: '2026-09-18 09:30',
    extractedKeywords: ['Quantum', 'Symposium', 'Keynote', 'Peer Review']
  }
];

const DEFAULT_REMINDERS: PersonalReminder[] = [
  {
    id: 'rem-1',
    task: "Review Dr. Tariq's AI Ethics Abstract paper by Monday afternoon",
    priority: 'urgent',
    dueDate: '2026-09-22',
    completed: false,
    category: 'Paper Review',
    createdAt: '2026-09-19'
  },
  {
    id: 'rem-2',
    task: 'Finalize presentation slides for Oxford Quantum Colloquium',
    priority: 'high',
    dueDate: '2026-09-24',
    completed: false,
    category: 'Keynote Prep',
    createdAt: '2026-09-18'
  },
  {
    id: 'rem-3',
    task: 'Submit peer evaluation metrics for Cambridge AI Fellowship cohort',
    priority: 'medium',
    dueDate: '2026-09-28',
    completed: true,
    category: 'Governance',
    createdAt: '2026-09-15'
  }
];

const DEFAULT_SNIPPETS: ScratchpadSnippet[] = [
  {
    id: 'snip-1',
    content: 'Colloquium Key Note: Empirical methodology requires 4-stage validation with double-blind peer scrutiny. Submission portal closes Sept 25, 2026 at 23:59 GMT.',
    sourceType: 'pasted-text',
    tags: ['Methodology', 'Sept 25', 'Empirical'],
    extractedDeadlines: ['Sept 25, 2026 23:59 GMT'],
    createdAt: '2026-09-19 14:20'
  },
  {
    id: 'snip-2',
    content: 'DOI: 10.1038/s41586-026-0892 - "Quantum Machine Learning Benchmarks across Distributed Neural Arrays". Key takeaway: 40% reduction in error vectors.',
    sourceType: 'pdf-snippet',
    tags: ['Quantum ML', 'Benchmarks', 'DOI Reference'],
    extractedDeadlines: [],
    createdAt: '2026-09-18 10:05'
  }
];

interface PersonalScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PersonalScratchpadModal: React.FC<PersonalScratchpadModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'split' | 'clipboard' | 'reminders' | 'dropper'>('split');

  // Load state from localStorage
  const [reminders, setReminders] = useState<PersonalReminder[]>(() => {
    try {
      const saved = localStorage.getItem('academic_hub_personal_reminders');
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  const [snippets, setSnippets] = useState<ScratchpadSnippet[]>(() => {
    try {
      const saved = localStorage.getItem('academic_hub_personal_snippets');
      return saved ? JSON.parse(saved) : DEFAULT_SNIPPETS;
    } catch {
      return DEFAULT_SNIPPETS;
    }
  });

  const [attachedFiles, setAttachedFiles] = useState<AttachedPersonalFile[]>(() => {
    try {
      const saved = localStorage.getItem('academic_hub_personal_attached_files');
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    } catch {
      return DEFAULT_FILES;
    }
  });

  const [activePreviewFile, setActivePreviewFile] = useState<AttachedPersonalFile | null>(null);

  // Input states
  const [pasteContent, setPasteContent] = useState('');
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [reminderTask, setReminderTask] = useState('');
  const [reminderPriority, setReminderPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [reminderDueDate, setReminderDueDate] = useState('');
  const [reminderCategory, setReminderCategory] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('academic_hub_personal_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('academic_hub_personal_snippets', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    localStorage.setItem('academic_hub_personal_attached_files', JSON.stringify(attachedFiles));
  }, [attachedFiles]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Automated Keyword & Deadline Mini-Parser
  const extractAndAddSnippet = (rawText: string, sourceType: 'pasted-text' | 'pdf-snippet' | 'image-ocr') => {
    if (!rawText.trim()) return;

    setIsExtractingText(true);

    setTimeout(() => {
      const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}|\b\d{4}-\d{2}-\d{2}\b|\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi;
      const dateMatches = rawText.match(dateRegex) || [];
      const extractedDeadlines = Array.from(new Set(dateMatches)).slice(0, 3);

      const words = rawText.split(/[\s,.;:()]+/);
      const candidates = words
        .filter(w => w.length > 4 && !['about', 'after', 'before', 'their', 'which', 'there', 'could', 'should', 'would', 'where', 'these'].includes(w.toLowerCase()))
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 4);

      const newSnippet: ScratchpadSnippet = {
        id: `snip-${Date.now()}`,
        content: rawText.trim(),
        sourceType,
        tags: candidates.length > 0 ? candidates : ['Academic Note'],
        extractedDeadlines,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setSnippets(prev => [newSnippet, ...prev]);
      setPasteContent('');
      setIsExtractingText(false);

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#0284c7', '#0d9488', '#f59e0b']
        });
      } catch (_) {}
    }, 300);
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const simulatedKeywords = [
      file.name.split('.')[0].replace(/[-_]/g, ' '),
      file.type.includes('pdf') ? 'PDF Document' : 'Image Scan',
      'Ingested Token',
      'Scholar Record'
    ];

    const newAttachedFile: AttachedPersonalFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: fileUrl,
      type: file.type || 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      extractedKeywords: simulatedKeywords
    };

    setAttachedFiles(prev => [newAttachedFile, ...prev]);

    const simulatedText = `[File Ingested: ${file.name}] - Format: ${file.type || 'Document'}, Size: ${(file.size / 1024).toFixed(1)} KB. Extracted structured tokens: Verified scholarly parameters, citations, and symposium schedule references.`;
    extractAndAddSnippet(simulatedText, file.type.includes('image') ? 'image-ocr' : 'pdf-snippet');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => handleFileUpload(file));
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTask.trim()) return;

    const newReminder: PersonalReminder = {
      id: `rem-${Date.now()}`,
      task: reminderTask.trim(),
      priority: reminderPriority,
      dueDate: reminderDueDate || new Date().toISOString().split('T')[0],
      completed: false,
      category: reminderCategory.trim() || 'General Task',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReminders(prev => [newReminder, ...prev]);
    setReminderTask('');
    setReminderDueDate('');
    setReminderCategory('');

    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    } catch (_) {}
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  const deleteFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s =>
    s.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const renderClipboardContent = (isCompact?: boolean) => (
    <div className="space-y-5 animate-fade-in">
      {/* Input Area */}
      <div 
        className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-850/60 border border-amber-300/60 dark:border-amber-500/40 space-y-3 shadow-xs"
        style={{ borderRadius: '16px' }}
      >
        <label className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Raw Text &amp; Token Ingestion Stream</span>
        </label>
        
        <textarea
          id="textarea-scratchpad-clipboard"
          rows={isCompact ? 4 : 5}
          value={pasteContent}
          onChange={e => setPasteContent(e.target.value)}
          placeholder="Paste any text, notes, links, or code here..."
          className="w-full px-4 py-3 text-xs sm:text-sm font-sans bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none shadow-2xs"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Auto-extracts dates &amp; keywords on save.
          </span>

          <button
            id="btn-save-scratchpad-note"
            type="button"
            disabled={!pasteContent.trim() || isExtractingText}
            onClick={() => extractAndAddSnippet(pasteContent, 'pasted-text')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {isExtractingText ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Save Note Row</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Snippet Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Saved Clipboard Entries ({filteredSnippets.length})
          </h3>

          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {filteredSnippets.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-400">
            <StickyNote className="w-7 h-7 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">No clipboard entries found.</p>
            <p className="text-[11px]">Paste raw notes above to start archiving snippets.</p>
          </div>
        ) : (
          <div className={isCompact ? "space-y-2.5 max-h-[320px] overflow-y-auto pr-1" : "grid grid-cols-1 md:grid-cols-2 gap-3"}>
            {filteredSnippets.map(snippet => (
              <div 
                key={snippet.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-2.5 group"
                style={{ borderRadius: '12px' }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {snippet.createdAt}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(snippet.content, snippet.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Copy note text"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteSnippet(snippet.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {snippet.content}
                  </p>
                </div>

                {/* Keyword & Deadline Tag Pills */}
                {(snippet.tags.length > 0 || snippet.extractedDeadlines.length > 0) && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
                    {snippet.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    {snippet.extractedDeadlines.map((dl, idx) => (
                      <span 
                        key={`dl-${idx}`}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1"
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {dl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderRemindersContent = (isCompact?: boolean) => (
    <div className="space-y-5 animate-fade-in">
      {/* Form to add reminder */}
      <form 
        onSubmit={handleAddReminder}
        className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-slate-850/60 border border-emerald-300/60 dark:border-emerald-500/40 space-y-3 shadow-xs"
        style={{ borderRadius: '16px' }}
      >
        <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-emerald-500" />
          <span>Interactive Task Reminder Checkbox List</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={reminderTask}
            onChange={e => setReminderTask(e.target.value)}
            placeholder="e.g., Review paper draft, prepare keynote slides..."
            className={`${isCompact ? 'sm:col-span-12' : 'sm:col-span-6'} px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
          />

          <select
            value={reminderPriority}
            onChange={e => setReminderPriority(e.target.value as any)}
            className={`${isCompact ? 'sm:col-span-6' : 'sm:col-span-3'} px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none`}
          >
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <input
            type="date"
            value={reminderDueDate}
            onChange={e => setReminderDueDate(e.target.value)}
            className={`${isCompact ? 'sm:col-span-6' : 'sm:col-span-3'} px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none font-mono`}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!reminderTask.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Task Item</span>
          </button>
        </div>
      </form>

      {/* Reminders Checkbox List */}
      <div className={`space-y-2 ${isCompact ? 'max-h-[340px] overflow-y-auto pr-1' : ''}`}>
        {reminders.length === 0 ? (
          <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            All tasks completed! Add an action item above to keep track of deadlines.
          </div>
        ) : (
          reminders.map(rem => (
            <div
              key={rem.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                rem.completed
                  ? 'bg-slate-100/70 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : rem.priority === 'urgent'
                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    rem.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
                  }`}
                  title={rem.completed ? 'Mark as pending' : 'Mark as done'}
                >
                  {rem.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate ${rem.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {rem.task}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    {rem.dueDate && <span>Due: {rem.dueDate}</span>}
                    <span>•</span>
                    <span className="capitalize font-semibold">{rem.priority} priority</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 50 }}
      id="personal-scratchpad-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border-[1.5px] border-amber-400/60 dark:border-amber-500/50 shadow-2xl shadow-black/80 overflow-hidden text-slate-900 dark:text-zinc-100"
        style={{ borderRadius: '24px' }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-80 h-32 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-950 dark:text-white flex items-center gap-2">
                  <span>📝 Scratchpad &amp; Reminders</span>
                </h2>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono">
                  Console Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct clipboard text container, interactive task reminder checkbox list, and academic note workspace.
              </p>
            </div>
          </div>

          <button
            id="btn-close-scratchpad-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="relative z-10 px-6 pt-3 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tab 0: Split Dual-Pane */}
            <button
              id="tab-scratchpad-split"
              onClick={() => setActiveTab('split')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'split'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Dual-Pane (Split View)</span>
            </button>

            {/* Tab 1: Quick Clipboard */}
            <button
              id="tab-scratchpad-clipboard"
              onClick={() => setActiveTab('clipboard')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'clipboard'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <StickyNote className="w-4 h-4" />
              <span>Quick Clipboard ({snippets.length})</span>
            </button>

            {/* Tab 2: Reminders & Tasks */}
            <button
              id="tab-scratchpad-reminders"
              onClick={() => setActiveTab('reminders')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'reminders'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Reminders &amp; Agendas ({reminders.filter(r => !r.completed).length})</span>
            </button>

            {/* Tab 3: Document Dropper */}
            <button
              id="tab-scratchpad-dropper"
              onClick={() => setActiveTab('dropper')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'dropper'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Document Dropper ({attachedFiles.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* ======================================================== */}
          {/* TAB 0: DUAL-PANE SPLIT VIEW                              */}
          {/* ======================================================== */}
          {activeTab === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-fade-in">
              <div>
                {renderClipboardContent(true)}
              </div>
              <div>
                {renderRemindersContent(true)}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: QUICK CLIPBOARD ONLY                              */}
          {/* ======================================================== */}
          {activeTab === 'clipboard' && renderClipboardContent(false)}

          {/* ======================================================== */}
          {/* TAB 2: DOCUMENT DROPPER                                  */}
          {/* ======================================================== */}
          {activeTab === 'dropper' && (
            <div className="space-y-6 animate-fade-in">
              {/* Dropzone Wrapper */}
              <div
                id="scratchpad-document-dropper-zone"
                onDragOver={e => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/60 dark:bg-slate-850/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
                style={{ borderRadius: '20px' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      Array.from(e.target.files).forEach(file => handleFileUpload(file));
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <FileUp className="w-7 h-7" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                  Multi-Format Binary Document Ingestion Stream
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3">
                  Drag &amp; drop files here, or click to browse. Supports <span className="font-bold text-sky-600 dark:text-sky-400">.PDF, .PNG, .JPG, .JPEG</span>
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[11px] font-bold border border-sky-300 dark:border-sky-800">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant OCR &amp; Keyword Array Extraction Enabled</span>
                </div>
              </div>

              {/* Ingested Document List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ingested Files &amp; Structured Keyword Arrays ({attachedFiles.length})
                  </h3>
                </div>

                {attachedFiles.length === 0 ? (
                  <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                    No files dropped yet. Drop research papers or symposium flyers to parse tokens.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachedFiles.map(file => (
                      <div
                        key={file.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                        style={{ borderRadius: '16px' }}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.uploadedAt}</span>
                            </div>

                            {/* Extracted Keyword Chips */}
                            {file.extractedKeywords && file.extractedKeywords.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                {file.extractedKeywords.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>

                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: REMINDERS & AGENDAS                               */}
          {/* ======================================================== */}
          {activeTab === 'reminders' && renderRemindersContent(false)}
        </div>
      </div>
    </div>
  );
};
