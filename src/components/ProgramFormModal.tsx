import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Globe, 
  Building2, 
  Clock, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Bell 
} from 'lucide-react';
import { AcademicProgram, ColorTheme, ProgramMode } from '../types';
import { getDayOfWeek, getWordCount, TODAY_ISO } from '../utils/academicUtils';

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: AcademicProgram) => void;
  initialProgram?: AcademicProgram | null;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProgram,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(TODAY_ISO);
  const [time, setTime] = useState('09:00 AM - 05:00 PM');
  const [mode, setMode] = useState<ProgramMode>('Online');
  const [location, setLocation] = useState('');
  const [themes, setThemes] = useState<string[]>(['Academic Research']);
  const [newTheme, setNewTheme] = useState('');
  const [abstract, setAbstract] = useState('');
  const [maxWords, setMaxWords] = useState(300);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [newSummary, setNewSummary] = useState('');
  const [finalNotes, setFinalNotes] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');

  const MAX_NAME_CHARS = 85;

  useEffect(() => {
    if (initialProgram) {
      setName(initialProgram.name);
      setDate(initialProgram.date);
      setTime(initialProgram.time || '09:00 AM - 05:00 PM');
      setMode(initialProgram.mode);
      setLocation(initialProgram.location);
      setThemes(initialProgram.themes || []);
      setAbstract(initialProgram.abstract || '');
      setMaxWords(initialProgram.maxAbstractWords || 300);
      setSummaries(initialProgram.extractedSummary || []);
      setFinalNotes(initialProgram.finalNotes || '');
      setOrganizer(initialProgram.organizerOrChair || '');
      setColorTheme(initialProgram.colorTheme || 'blue');
    } else {
      setName('');
      setDate(TODAY_ISO);
      setTime('09:00 AM - 05:00 PM');
      setMode('Online');
      setLocation('Virtual Conference Room');
      setThemes(['Computer Science', 'AI Research']);
      setAbstract('');
      setMaxWords(300);
      setSummaries([]);
      setFinalNotes('');
      setOrganizer('');
      setColorTheme('blue');
    }
  }, [initialProgram, isOpen]);

  if (!isOpen) return null;

  const currentWordCount = getWordCount(abstract);
  const isAbstractOverLimit = currentWordCount > maxWords;
  const isNameOverLimit = name.length > MAX_NAME_CHARS;

  const handleAddTheme = () => {
    if (newTheme.trim() && !themes.includes(newTheme.trim())) {
      setThemes([...themes, newTheme.trim()]);
      setNewTheme('');
    }
  };

  const handleRemoveTheme = (index: number) => {
    setThemes(themes.filter((_, i) => i !== index));
  };

  const handleAddSummary = () => {
    if (newSummary.trim()) {
      setSummaries([...summaries, newSummary.trim()]);
      setNewSummary('');
    }
  };

  const handleRemoveSummary = (index: number) => {
    setSummaries(summaries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    const savedProgram: AcademicProgram = {
      id: initialProgram ? initialProgram.id : `prog-${Date.now()}`,
      name: name.trim(),
      date,
      dayOfWeek: getDayOfWeek(date),
      time,
      mode,
      location: location || (mode === 'Online' ? 'Online Video Platform' : 'Physical Auditorium'),
      themes: themes.length > 0 ? themes : ['General Research'],
      abstract,
      maxAbstractWords: maxWords,
      extractedSummary: summaries,
      finalNotes,
      organizerOrChair: organizer,
      createdAt: initialProgram ? initialProgram.createdAt : new Date().toISOString(),
      colorTheme
    };

    onSave(savedProgram);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        id="program-form-modal-card"
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-zinc-100"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-850/90 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {initialProgram ? 'Edit Academic Program' : 'Create New Academic Program'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Ensure strict word limits and metadata alignment
              </p>
            </div>
          </div>

          <button
            id="btn-close-form-modal"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            
            {/* Program Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-mono font-bold ${
                  isNameOverLimit ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {name.length} / {MAX_NAME_CHARS} chars
                </span>
              </div>
              <input
                id="input-form-program-name"
                type="text"
                required
                maxLength={MAX_NAME_CHARS}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. International Colloquium on Quantum Systems"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900"
              />
            </div>

            {/* Date, Time, Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Day &amp; Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-form-date"
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-900 cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-indigo-700 mt-1 block">
                  {getDayOfWeek(date)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time Window
                </label>
                <input
                  id="input-form-time"
                  type="text"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  placeholder="09:00 AM - 05:00 PM"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mode-Wise Tag
                </label>
                <button
                  type="button"
                  id="btn-form-toggle-mode"
                  onClick={() => setMode(prev => prev === 'Online' ? 'Offline' : 'Online')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                    mode === 'Online'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {mode === 'Online' ? (
                    <>
                      <Globe className="w-3.5 h-3.5 text-sky-600" />
                      <span>Online</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Offline</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Location & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Venue / URL
                </label>
                <input
                  id="input-form-location"
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Geneva Bio-Hub / Zoom Link"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organizer / Session Chair
                </label>
                <input
                  id="input-form-organizer"
                  type="text"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  placeholder="e.g. Prof. David K. Sterling"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Themes & Topics */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Themes &amp; Topics
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {themes.map((theme, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-900 border border-teal-200"
                  >
                    <span>{theme}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTheme(i)}
                      className="text-teal-700 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="input-form-new-theme"
                  type="text"
                  value={newTheme}
                  onChange={e => setNewTheme(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTheme())}
                  placeholder="Add academic topic..."
                  className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddTheme}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Abstract with Word limit indicator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Abstract</span>
                </label>
                <span className={`text-xs font-mono font-bold ${
                  isAbstractOverLimit ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {currentWordCount} / {maxWords} words
                </span>
              </div>
              <textarea
                id="input-form-abstract"
                rows={3}
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                placeholder="Enter program abstract..."
                className={`w-full p-3 rounded-2xl glass-input text-xs sm:text-sm text-slate-800 ${
                  isAbstractOverLimit ? 'border-red-400' : ''
                }`}
              />
            </div>

            {/* Extracted Key Summaries */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Key Summaries / Takeaways
              </label>
              <div className="space-y-1.5 mb-2">
                {summaries.map((sum, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-sky-50/60 p-2 rounded-lg border border-sky-100">
                    <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{sum}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSummary(i)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="input-form-new-summary"
                  type="text"
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSummary())}
                  placeholder="Add bullet point summary..."
                  className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddSummary}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Final Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Final Notes &amp; Notifications
              </label>
              <textarea
                id="input-form-final-notes"
                rows={2}
                value={finalNotes}
                onChange={e => setFinalNotes(e.target.value)}
                placeholder="Registration deadlines, notes..."
                className="w-full p-2.5 rounded-xl glass-input text-xs text-slate-800"
              />
            </div>

            {/* Color Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pastel Glassmorphic Card Tint
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'blue', label: 'Pastel Blue', bg: 'bg-sky-200 border-sky-400' },
                  { id: 'mint', label: 'Pastel Mint', bg: 'bg-emerald-200 border-emerald-400' },
                  { id: 'yellow', label: 'Pastel Yellow', bg: 'bg-amber-200 border-amber-400' },
                  { id: 'purple', label: 'Pastel Violet', bg: 'bg-purple-200 border-purple-400' },
                  { id: 'rose', label: 'Pastel Rose', bg: 'bg-rose-200 border-rose-400' }
                ].map(th => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setColorTheme(th.id as ColorTheme)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                      colorTheme === th.id
                        ? `${th.bg} text-slate-900 shadow-xs ring-2 ring-slate-800`
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${th.bg}`} />
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-850/90 backdrop-blur-md flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-submit-program-form"
              type="submit"
              disabled={isAbstractOverLimit || !name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{initialProgram ? 'Save Changes' : 'Create Program'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
