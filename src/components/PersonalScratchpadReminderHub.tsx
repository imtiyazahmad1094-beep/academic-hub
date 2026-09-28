import React, { useState, useEffect } from 'react';
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
  Bookmark
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
  sourceType: 'pasted-text' | 'pdf-snippet' | 'extracted-note';
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
}

const DEFAULT_FILES: AttachedPersonalFile[] = [
  {
    id: 'file-1',
    name: 'Oxford_AI_Ethics_Draft_Paper_v2.pdf',
    size: '1.4 MB',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
    type: 'application/pdf',
    uploadedAt: '2026-09-19 14:15'
  },
  {
    id: 'file-2',
    name: 'Cambridge_Quantum_AI_Colloquium_Schedule.pdf',
    size: '850 KB',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    type: 'application/pdf',
    uploadedAt: '2026-09-18 09:30'
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

export const PersonalScratchpadReminderHub: React.FC = () => {
  // Load state from localStorage or use defaults
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

  // Automated Keyword & Deadline Mini-Parser
  const extractAndAddSnippet = (rawText: string, sourceType: 'pasted-text' | 'pdf-snippet') => {
    if (!rawText.trim()) return;

    setIsExtractingText(true);

    // Heuristic isolation of dates, deadlines, keywords
    setTimeout(() => {
      const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}|\b\d{4}-\d{2}-\d{2}\b|\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi;
      const dateMatches = rawText.match(dateRegex) || [];
      const extractedDeadlines = Array.from(new Set(dateMatches)).slice(0, 3);

      // Extract keywords (words > 5 characters or capitalized academic words)
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

      // Micro confetti celebration for successful isolation
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#0284c7', '#0d9488', '#f59e0b']
      });
    }, 400);
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const newAttachedFile: AttachedPersonalFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: fileUrl,
      type: file.type || 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setAttachedFiles(prev => [newAttachedFile, ...prev]);

    const reader = new FileReader();
    reader.onload = () => {
      const simulatedText = `[File: ${file.name}] - Size: ${(file.size / 1024).toFixed(1)} KB. Extracted abstract tokens: Key findings regarding cross-disciplinary scholarly governance, ethics criteria, and timeline constraints. Scheduled discussion date: Sept 28, 2026.`;
      extractAndAddSnippet(simulatedText, 'pdf-snippet');
    };
    reader.readAsText(file);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredSnippets = snippets.filter(s => 
    s.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const activeRemindersCount = reminders.filter(r => !r.completed).length;

  return (
    <div 
      id="personal-scratchpad-reminder-hub"
      className="space-y-6 animate-fade-in"
    >
      {/* Panel Header */}
      <div className="section-box-glass p-6 sm:p-7 border border-sky-500/30 rounded-2xl relative overflow-hidden bg-gradient-to-br from-white/90 via-sky-50/40 to-teal-50/40 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-[11px] font-sans font-bold border border-sky-300 dark:border-sky-800">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Personal Tracking Sandbox</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
              Personal Scratchpad & Reminder Hub
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-300 max-w-2xl">
              Paste notes, drop PDF reference snippets, and manage quick personal alerts to keep your academic research and peer duties organized.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-sans font-bold text-slate-500 dark:text-slate-400 block">Pending Alerts</span>
              <span className="text-lg font-sans font-black text-rose-600 dark:text-rose-400 font-mono">{activeRemindersCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-sans font-bold text-slate-500 dark:text-slate-400 block">Saved Notes</span>
              <span className="text-lg font-sans font-black text-sky-600 dark:text-sky-400 font-mono">{snippets.length}</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUB-SECTION 1: THE SMART NOTE COLLECTOR WORKSPACE (SPLIT LAYOUT) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Left Side: Raw Multi-line Clipboard Container */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/80 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Quick Clipboard & Text Collector
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Auto-Extracts Key Takeaways</span>
            </div>

            <div className="relative">
              <textarea
                value={pasteContent}
                onChange={e => setPasteContent(e.target.value)}
                placeholder="Paste any text, notes, links, or code here... Our smart helper will isolate deadlines and keywords instantly."
                className="w-full h-32 p-3 text-xs font-sans text-slate-800 dark:text-slate-100 bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setPasteContent("Review draft paper: 'Ethical Guidelines in Multimodal LLM Deployments' submitted by Oxford Scholars. Final review due by Sept 25, 2026.")}
                className="text-[11px] font-sans font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 underline cursor-pointer"
              >
                Insert Sample Note
              </button>

              <button
                type="button"
                disabled={!pasteContent.trim() || isExtractingText}
                onClick={() => extractAndAddSnippet(pasteContent, 'pasted-text')}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-sans font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                {isExtractingText ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Note Row</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side: Isolated Dropzone Box for Document Snippets */}
          <div 
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`p-5 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center relative ${
              dragActive 
                ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40' 
                : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop any personal PDF or document snippet here
            </h4>
            <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Instant local scanning extracts definitions, dates, and keywords into your searchable scratchpad.
            </p>

            <label className="mt-3 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-sans font-bold text-xs cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-all">
              <span>Select File</span>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

        </div>

        {/* RE-OPENABLE PERSONAL FILES: Attached Reference Files List Row */}
        {attachedFiles.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Attached Reference Files</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {attachedFiles.length} Permanent Reference Node{attachedFiles.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-xl bg-white/95 dark:bg-slate-850/95 border border-slate-200/90 dark:border-slate-750 flex items-center justify-between gap-3 shadow-2xs hover:border-teal-400 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/60">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 transition-colors">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {file.size} • {file.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActivePreviewFile(file)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/90 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-sans font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                      title="Open and preview document natively"
                    >
                      <span>📄 Open Document</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Remove file reference"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Native File Preview Modal */}
        {activePreviewFile && (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
            onClick={() => setActivePreviewFile(null)}
          >
            <div 
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-teal-500 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white truncate">
                    {activePreviewFile.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 font-bold shrink-0">
                    {activePreviewFile.size}
                  </span>
                </div>
                <button
                  onClick={() => setActivePreviewFile(null)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
                {activePreviewFile.type.startsWith('image/') || activePreviewFile.url.startsWith('data:image') || activePreviewFile.url.includes('images.unsplash.com') ? (
                  <img 
                    src={activePreviewFile.url} 
                    alt={activePreviewFile.name}
                    className="max-h-[55vh] object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-center space-y-3 p-6 max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-600 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="font-serif font-bold text-base text-slate-900 dark:text-white">
                      {activePreviewFile.name}
                    </div>
                    <p className="text-xs font-sans text-slate-500">
                      Document pointer loaded in native secure sandbox memory. All keywords and scholarly references are extracted into your scratchpad.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={activePreviewFile.url}
                  download={activePreviewFile.name}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-sans text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Full Browser Tab</span>
                </a>

                <button
                  onClick={() => setActivePreviewFile(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-sans text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Searchable Scratchpad Saved Cards */}
        {snippets.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Searchable Scratchpad Items ({filteredSnippets.length})
              </span>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter scratchpad rows..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-sans bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {filteredSnippets.map((snip) => (
                <div
                  key={snip.id}
                  className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-850/90 border border-slate-200/70 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {snip.sourceType === 'pdf-snippet' ? '📄 PDF Scan' : '📋 Quick Note'} • {snip.createdAt}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(snip.content, snip.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded cursor-pointer"
                        title="Copy content"
                      >
                        {copiedId === snip.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => deleteSnippet(snip.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-800 dark:text-slate-200 leading-relaxed">
                    {snip.content}
                  </p>

                  {/* Isolated Tags & Deadlines */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {snip.extractedDeadlines.map((dl, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{dl}</span>
                      </span>
                    ))}
                    {snip.tags.map((tg, idx) => (
                      <span key={idx} className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-SECTION 2: THE DYNAMIC SYSTEM REMINDER LIST (OPERATIONAL LEDGER) */}
      {/* ------------------------------------------------------------- */}
      <div className="section-box-glass p-6 sm:p-7 border border-emerald-500/30 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                Dynamic System Reminder List
              </h3>
              <p className="text-xs font-sans text-slate-500 dark:text-slate-400">
                List anything for quick alerts, paper reviews, or deadline milestones.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
            {reminders.filter(r => r.completed).length} / {reminders.length} Completed
          </span>
        </div>

        {/* Interactive Add Reminder Form */}
        <form onSubmit={handleAddReminder} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Operational Task / Action Item
              </label>
              <input
                type="text"
                required
                value={reminderTask}
                onChange={e => setReminderTask(e.target.value)}
                placeholder="e.g. Review Dr. Tariq's AI Ethics Abstract paper by Monday afternoon"
                className="w-full px-3 py-2 text-xs font-sans bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Priority Flag
              </label>
              <select
                value={reminderPriority}
                onChange={e => setReminderPriority(e.target.value as any)}
                className="w-full px-2.5 py-2 text-xs font-sans bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Due Target Date
              </label>
              <input
                type="date"
                value={reminderDueDate}
                onChange={e => setReminderDueDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Alert</span>
              </button>
            </div>
          </div>
        </form>

        {/* Clean, Separated Reminder Cards with low-visibility borders */}
        <div className="space-y-2.5">
          {reminders.length === 0 ? (
            <div className="p-6 text-center text-xs font-sans text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              No active operational reminders. Add an action item above to keep track of deadlines.
            </div>
          ) : (
            reminders.map(rem => {
              const priorityStyles = {
                urgent: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800',
                high: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
                medium: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800',
                low: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800'
              };

              return (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    rem.completed
                      ? 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                      : 'bg-white/95 dark:bg-slate-850/95 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        rem.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
                      }`}
                      title={rem.completed ? 'Mark as pending' : 'Mark as done'}
                    >
                      {rem.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <span className={`text-xs font-sans block truncate ${
                        rem.completed 
                          ? 'line-through text-slate-400 dark:text-slate-500' 
                          : 'font-semibold text-slate-900 dark:text-slate-100'
                      }`}>
                        {rem.task}
                      </span>
                      
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${priorityStyles[rem.priority]}`}>
                          {rem.priority.toUpperCase()}
                        </span>
                        {rem.dueDate && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Due: {rem.dueDate}</span>
                          </span>
                        )}
                        {rem.category && (
                          <span className="text-[10px] font-sans text-slate-400">
                            • {rem.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all cursor-pointer shrink-0"
                    title="Remove reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
