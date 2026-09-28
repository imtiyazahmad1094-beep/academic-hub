import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Link2, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Brain, 
  Layers3, 
  BookOpen, 
  Mic, 
  ArrowRight,
  Edit3,
  Globe
} from 'lucide-react';
import { soundFX } from '../../../utils/audioUtils';

export interface ExtractedResourceData {
  title: string;
  subject: string;
  category: string;
  author: string;
  source: string;
  pubDate: string;
  docDate: string;
  topic: string;
  keywords: string[];
  pages: number;
  difficulty: 'Undergraduate' | 'Graduate' | 'Doctoral' | 'Foundational';
  language: string;
  institution: string;
  description: string;
}

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  onResourceProcessed: (
    data: ExtractedResourceData, 
    action: 'viva' | 'quiz' | 'flashcards' | 'notes'
  ) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ResourceUploadModal: React.FC<ResourceUploadModalProps> = ({
  isOpen,
  onClose,
  domainName,
  onResourceProcessed,
  onShowToast
}) => {
  const [activeInputType, setActiveInputType] = useState<'pdf' | 'link'>('pdf');
  const [pastedUrl, setPastedUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
  // Extraction Lifecycle State: idle -> analyzing -> ready
  const [extractionState, setExtractionState] = useState<'idle' | 'analyzing' | 'ready'>('idle');
  const [analysisStep, setAnalysisStep] = useState('Extracting document tokens...');

  // Extracted Data Fields
  const [extractedData, setExtractedData] = useState<ExtractedResourceData>({
    title: 'The Ottoman Tanzimat Reforms: Legal Modernization & State Centralization',
    subject: 'Late Imperial Ottoman History',
    category: domainName || 'History',
    author: 'Prof. Halil Inalcik & Suraiya Faroqhi',
    source: 'Cambridge University Press / JSTOR Archive',
    pubDate: '1994 (Rev. 2018)',
    docDate: 'Circa 1839–1876 CE',
    topic: 'Gülhane Edict, Nizam-i Cedid, Ottoman Constitutionalism',
    keywords: ['Tanzimat', 'Mecelle', 'Sublime Porte', 'Janissaries', 'Imperial Edicts'],
    pages: 48,
    difficulty: 'Graduate',
    language: 'English & Ottoman Turkish Reference',
    institution: 'Bilkent Center for Ottoman Studies',
    description: 'An authoritative critical analysis of institutional modernization during the Tanzimat period, detailing legal, fiscal, and pedagogical reorganizations leading up to the 1876 Constitution.'
  });

  if (!isOpen) return null;

  const handleSimulateExtraction = (resourceLabel: string) => {
    setExtractionState('analyzing');
    setAnalysisStep('Ingesting multimodal semantic tokens...');
    soundFX.playTick(0.2);

    setTimeout(() => {
      setAnalysisStep('Extracting bibliographic metadata & author citations...');
    }, 900);

    setTimeout(() => {
      setAnalysisStep('Constructing oral-defense question manifolds & key terms...');
    }, 1800);

    setTimeout(() => {
      setExtractionState('ready');
      soundFX.playSuccess(0.3);
      onShowToast(`AI successfully indexed "${resourceLabel}" with high confidence!`, 'success');
    }, 2600);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFileName(file.name);
      handleSimulateExtraction(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFileName(file.name);
      handleSimulateExtraction(file.name);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUrl.trim()) {
      onShowToast('Please enter or paste a valid resource URL', 'info');
      return;
    }
    handleSimulateExtraction(pastedUrl.trim());
  };

  const handleDispatchAction = (action: 'viva' | 'quiz' | 'flashcards' | 'notes') => {
    soundFX.playSuccess(0.25);
    onResourceProcessed(extractedData, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Heavy Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Main Split Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-slate-700 border-t-2 border-t-white/30 border-b-4 border-black rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-serif text-white">
                Add Learning Resource
              </h2>
              <p className="text-xs text-slate-400">
                {domainName} — Ingest PDFs, syllabi, or scholarly links for AI extraction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Ingestion Switcher: Split Workspace (Upload PDF vs. Add Link) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* LEFT — UPLOAD PDF */}
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                activeInputType === 'pdf' 
                  ? 'border-cyan-500/80 bg-cyan-950/20' 
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
              }`}
              onClick={() => setActiveInputType('pdf')}
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-md">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-white mb-1">
                Drop PDF here
              </h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs">
                Supports syllabi, academic monographs, lecture notes, or past examination papers (up to 50MB)
              </p>

              <label className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer border-t border-white/40 border-b-2 border-cyan-800 transition-all shadow-sm">
                Browse Files
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
              </label>

              {selectedFileName && (
                <div className="mt-3 text-xs font-mono text-cyan-300 font-bold truncate max-w-xs">
                  ✓ Selected: {selectedFileName}
                </div>
              )}
            </div>

            {/* RIGHT — ADD LINK */}
            <div 
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                activeInputType === 'link' 
                  ? 'border-indigo-500/80 bg-indigo-950/20' 
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
              }`}
              onClick={() => setActiveInputType('link')}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">
                    Add Web / DOI Link
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Paste JSTOR, Wikipedia, Britannica, YouTube lecture, or university repository URL.
                </p>

                <form onSubmit={handleLinkSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="url"
                      value={pastedUrl}
                      onChange={e => setPastedUrl(e.target.value)}
                      placeholder="https://jstor.org/stable/300185 or Wikipedia URL..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs border-t border-white/30 border-b-2 border-indigo-950 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Fetch &amp; Extract Resource</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Sample Quick Links */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-400">
                <span>Quick:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPastedUrl('https://en.wikipedia.org/wiki/Tanzimat');
                    handleSimulateExtraction('Wikipedia — Tanzimat Reforms');
                  }}
                  className="hover:text-indigo-400 underline cursor-pointer truncate"
                >
                  Wikipedia Tanzimat
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setPastedUrl('https://jstor.org/stable/ottoman-reforms');
                    handleSimulateExtraction('JSTOR — Ottoman Political History');
                  }}
                  className="hover:text-indigo-400 underline cursor-pointer truncate"
                >
                  JSTOR Article
                </button>
              </div>
            </div>

          </div>

          {/* AI Extraction State Indicator */}
          {extractionState === 'analyzing' && (
            <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-black text-cyan-300 font-mono">
                  AI is analyzing your resource...
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  {analysisStep}
                </p>
              </div>
            </div>
          )}

          {/* AI Extracted Metadata Fields (Section 18) with Confidence Indicators */}
          {(extractionState === 'ready' || extractionState === 'idle') && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-black uppercase text-cyan-300">
                    AI Auto-Extracted Metadata (Editable)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>High Confidence Parser</span>
                </div>
              </div>

              {/* Grid of Fields with Confidence Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                
                {/* Title */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Title</span>
                    <span className="text-emerald-400 font-bold">✓ 99%</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.title}
                    onChange={e => setExtractedData({ ...extractedData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Subject</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.subject}
                    onChange={e => setExtractedData({ ...extractedData, subject: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Author</span>
                    <span className="text-amber-400 font-bold">92%</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.author}
                    onChange={e => setExtractedData({ ...extractedData, author: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Source */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Source</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.source}
                    onChange={e => setExtractedData({ ...extractedData, source: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Pub Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Publication Date</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.pubDate}
                    onChange={e => setExtractedData({ ...extractedData, pubDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Topic */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Topic</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.topic}
                    onChange={e => setExtractedData({ ...extractedData, topic: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                {/* Difficulty & Pages */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span>Pages &amp; Level</span>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={extractedData.pages}
                      onChange={e => setExtractedData({ ...extractedData, pages: Number(e.target.value) })}
                      className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <select
                      value={extractedData.difficulty}
                      onChange={e => setExtractedData({ ...extractedData, difficulty: e.target.value as any })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                    >
                      <option>Undergraduate</option>
                      <option>Graduate</option>
                      <option>Doctoral</option>
                      <option>Foundational</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                  <span>Executive Abstract &amp; Synopsis</span>
                  <span className="text-emerald-400 font-bold">✓</span>
                </div>
                <textarea
                  rows={2}
                  value={extractedData.description}
                  onChange={e => setExtractedData({ ...extractedData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* AI RESOURCE PROCESSING ACTION BUTTONS (Section 19) */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-black uppercase text-slate-400 block">
              Generate Evaluated Artifacts from this Resource:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Button 1: [ Generate Viva ] */}
              <button
                type="button"
                onClick={() => handleDispatchAction('viva')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs border-t-2 border-white/30 border-b-3 border-purple-950 shadow-md flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-all"
              >
                <Mic className="w-5 h-5 text-purple-200" />
                <span>Generate Viva</span>
              </button>

              {/* Button 2: [ Generate Quiz ] */}
              <button
                type="button"
                onClick={() => handleDispatchAction('quiz')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs border-t-2 border-white/30 border-b-3 border-emerald-950 shadow-md flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-all"
              >
                <Brain className="w-5 h-5 text-emerald-200" />
                <span>Generate Quiz</span>
              </button>

              {/* Button 3: [ Create Flashcards ] */}
              <button
                type="button"
                onClick={() => handleDispatchAction('flashcards')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs border-t-2 border-white/40 border-b-3 border-amber-950 shadow-md flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-all"
              >
                <Layers3 className="w-5 h-5 text-slate-950" />
                <span>Create Flashcards</span>
              </button>

              {/* Button 4: [ View Notes ] */}
              <button
                type="button"
                onClick={() => handleDispatchAction('notes')}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border-t-2 border-white/10 border-b-3 border-black shadow-md flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-all"
              >
                <BookOpen className="w-5 h-5 text-slate-300" />
                <span>View Notes</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
