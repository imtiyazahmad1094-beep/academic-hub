import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  UploadCloud, 
  FileText, 
  Link2, 
  Globe, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  Mic, 
  CheckCircle2, 
  Clock, 
  Layers3, 
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { VivaDomain } from './VivaCategorySelection';
import { ResourceUploadModal, ExtractedResourceData } from './ResourceUploadModal';
import { soundFX } from '../../../utils/audioUtils';

export interface ReferenceLinkItem {
  id: string;
  title: string;
  source: string;
  sourceType: 'Encyclopedia' | 'Peer-Reviewed Journal' | 'University Lecture' | 'Historical Archive';
  sourceIcon: string;
  dateStatus: string;
  url: string;
  summary: string;
  citations: string[];
  keyTopics: string[];
}

export interface UploadedPdfItem {
  id: string;
  filename: string;
  docTitle: string;
  date: string;
  pages: number;
  category: string;
  aiStatus: string;
  fileSize: string;
  institution: string;
  inquiryThemes: string[];
}

const INITIAL_LINKS: ReferenceLinkItem[] = [
  {
    id: 'link-1',
    title: 'Wikipedia — Ottoman Empire',
    source: 'Wikipedia Academic Foundation',
    sourceType: 'Encyclopedia',
    sourceIcon: '🌐',
    dateStatus: 'Verified Sep 23 • Stable',
    url: 'https://en.wikipedia.org/wiki/Ottoman_Empire',
    summary: 'A comprehensive institutional survey of the state from its 1299 foundation in northwestern Anatolia through the classical age, Tanzimat reforms, and 1922 dissolution.',
    citations: ['Finkel, Caroline. Osman’s Dream (2005)', 'Shaw, Stanford. History of the Ottoman Empire (1976)'],
    keyTopics: ['Devshirme System', 'Sublime Porte', 'Capitulations', 'Millet Hierarchy']
  },
  {
    id: 'link-2',
    title: 'JSTOR — Ottoman Political History & The Tanzimat',
    source: 'JSTOR Scholarly Repository',
    sourceType: 'Peer-Reviewed Journal',
    sourceIcon: '📚',
    dateStatus: 'Peer-Reviewed • AI Indexed',
    url: 'https://jstor.org/stable/ottoman-political-history',
    summary: 'A critical archival investigation into the Gülhane Edict of 1839 and subsequent centralizing legislation aimed at preserving territorial integrity against European financial hegemony.',
    citations: ['Inalcik, Halil. Studies in Ottoman Social and Economic History (1985)'],
    keyTopics: ['Edict of Gülhane', 'Islaahat Firman', 'Fiscal Decentralization', 'Young Ottomans']
  },
  {
    id: 'link-3',
    title: 'Britannica — Abbasid Caliphate Governance & Philosophy',
    source: 'Encyclopaedia Britannica Academic',
    sourceType: 'Encyclopedia',
    sourceIcon: '🏛️',
    dateStatus: 'Verified Academic Entry',
    url: 'https://britannica.com/topic/Abbasid-caliphate',
    summary: 'Analysis of the Golden Age of Islam, the House of Wisdom (Bayt al-Hikmah), translation movements, Mu’tazilite debates, and the development of classical Sunnism.',
    citations: ['Gutas, Dimitri. Greek Thought, Arabic Culture (1998)'],
    keyTopics: ['Bayt al-Hikma', 'Translation Movement', 'Vizierate Structure', 'Barmakid Dynasty']
  },
  {
    id: 'link-4',
    title: 'University Lecture — Mughal Administrative Synthesis',
    source: 'Oxford Historical Society Archives',
    sourceType: 'University Lecture',
    sourceIcon: '🎓',
    dateStatus: 'Lecture Transcript • 52 min audio',
    url: 'https://oxford.ac.uk/podcasts/mughal-administration',
    summary: 'Detailed examination of Akbar’s Mansabdari system, Todar Mal’s revenue assessment (Zabt), and the secular-religious governance philosophy of Sulh-i Kul.',
    citations: ['Habib, Irfan. The Agrarian System of Mughal India (1963)'],
    keyTopics: ['Mansabdari System', 'Sulh-i Kul', 'Jagir Grants', 'Ain-i Akbari']
  }
];

const INITIAL_PDFS: UploadedPdfItem[] = [
  {
    id: 'pdf-1',
    filename: 'History of Ottoman Empire.pdf',
    docTitle: 'History of the Ottoman Empire: Legal & Administrative Evolution',
    date: 'Sep 23, 2026',
    pages: 32,
    category: 'History',
    aiStatus: 'AI indexed',
    fileSize: '4.2 MB',
    institution: 'Bilkent Center for Ottoman Studies',
    inquiryThemes: ['Tanzimat Fiscal Decrees', 'Janissary Abolition (1826)', 'Mecelle Civil Code']
  },
  {
    id: 'pdf-2',
    filename: 'Tanzimat_Reforms_and_Constitutionalism.pdf',
    docTitle: 'The Tanzimat Era and the First Constitutional Monarchy (1876)',
    date: 'Sep 22, 2026',
    pages: 45,
    category: 'History',
    aiStatus: 'AI indexed',
    fileSize: '6.8 MB',
    institution: 'SOAS University of London',
    inquiryThemes: ['Midhat Pasha Draftership', 'Imperial Council', 'Ottoman Citizenship Concept']
  },
  {
    id: 'pdf-3',
    filename: 'Early_Caliphates_Political_Institutions.pdf',
    docTitle: 'Political Institutions of the Early Caliphates & Diwan Systems',
    date: 'Sep 21, 2026',
    pages: 18,
    category: 'History',
    aiStatus: 'AI indexed',
    fileSize: '2.5 MB',
    institution: 'DHIU Research Archives',
    inquiryThemes: ['Diwan al-Jund Formations', 'Shura Principles', 'Provincial Kharaj Management']
  }
];

interface VivaResourceWorkspaceProps {
  domain: VivaDomain;
  onBack: () => void;
  onLaunchViva: (domain: VivaDomain) => void;
  onLaunchFlashcards: () => void;
  onLaunchQuiz: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VivaResourceWorkspace: React.FC<VivaResourceWorkspaceProps> = ({
  domain,
  onBack,
  onLaunchViva,
  onLaunchFlashcards,
  onLaunchQuiz,
  onShowToast
}) => {
  const [links, setLinks] = useState<ReferenceLinkItem[]>(INITIAL_LINKS);
  const [pdfs, setPdfs] = useState<UploadedPdfItem[]>(INITIAL_PDFS);
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState('');

  const toggleExpandLink = (id: string) => {
    soundFX.playTick(0.15);
    setExpandedLinkId(prev => (prev === id ? null : id));
  };

  const handleResourceProcessed = (
    data: ExtractedResourceData, 
    action: 'viva' | 'quiz' | 'flashcards' | 'notes'
  ) => {
    // Add as new uploaded PDF or link into the workspace
    const newPdf: UploadedPdfItem = {
      id: `pdf-${Date.now()}`,
      filename: `${data.title.slice(0, 24).replace(/\s+/g, '_')}.pdf`,
      docTitle: data.title,
      date: 'Just now',
      pages: data.pages || 24,
      category: domain.name,
      aiStatus: 'AI indexed',
      fileSize: '3.8 MB',
      institution: data.institution || 'Academic Archive',
      inquiryThemes: data.keywords.slice(0, 3)
    };
    setPdfs(prev => [newPdf, ...prev]);

    if (action === 'viva') {
      onShowToast(`Launching Oral Defense on "${data.title}"`, 'success');
      onLaunchViva(domain);
    } else if (action === 'flashcards') {
      onShowToast('Generating 3D Flashcard deck from extracted document...', 'info');
      onLaunchFlashcards();
    } else if (action === 'quiz') {
      onShowToast('Generating live quiz test questions...', 'info');
      onLaunchQuiz();
    } else {
      onShowToast('Document saved to your persistent resource library.', 'success');
    }
  };

  return (
    <div id="viva-resource-library-workspace" className="space-y-6 animate-fade-in w-full max-w-7xl mx-auto pb-12">
      
      {/* Top Breadcrumb & Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-t-2 border-white/60 dark:border-white/10 border-b-4 border-slate-900/20 dark:border-black shadow-xl backdrop-blur-xl">
        
        {/* Breadcrumb Left */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs transition-all cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Domains</span>
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">
            {domain.name}
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Viva Resource Library
          </span>
        </div>

        {/* Top-Right Action Controls (Upload Resource & Close X) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs border-t-2 border-white/50 border-b-3 border-teal-900 shadow-md flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Close workspace"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Action Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-t-2 border-white/30 border-b-4 border-black text-white shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Oral Defense Preparation Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            {domain.name} — Viva Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Ingest syllabi, examine peer-reviewed reference links, and launch evaluated oral defense drills with AI viva assessment.
          </p>
        </div>

        {/* Quick Launch Suite Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onLaunchViva(domain)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs border-t-2 border-white/40 border-b-4 border-purple-950 shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <Mic className="w-4 h-4" />
            <span>Launch Viva Arena</span>
          </button>

          <button
            type="button"
            onClick={onLaunchFlashcards}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-t-2 border-white/60 border-b-4 border-amber-900 shadow-md flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <Layers3 className="w-4 h-4" />
            <span>Flashcard Drill</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SPLIT UNI-WINDOW (SECTIONS 14 & 15)                      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT PANE: REFERENCE LINKS (SECTION 14)                  */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black font-serif text-slate-900 dark:text-white">
                  Reference Links
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {links.length} Curated Scholarly Sources
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Click to expand details
            </span>
          </div>

          {/* List of Essential Links (Clean, uncrowded) */}
          <div className="space-y-3">
            {links.map(link => {
              const isExpanded = expandedLinkId === link.id;
              return (
                <div
                  key={link.id}
                  className="rounded-2xl bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 border-t-2 border-t-white/40 dark:border-t-white/10 border-b-3 border-slate-900/20 dark:border-black shadow-md overflow-hidden transition-all duration-200"
                >
                  {/* Clean Essential Row (Title, Source Icon, Resource Type, Date/Status) */}
                  <div
                    onClick={() => toggleExpandLink(link.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {link.sourceIcon}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {link.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{link.sourceType}</span>
                          <span>•</span>
                          <span className="truncate">{link.dateStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Details Accordion */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs animate-fade-in bg-slate-50/70 dark:bg-slate-950/40">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {link.summary}
                      </p>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                          Key Analytical Topics:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {link.keyTopics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[10px] font-mono"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                          Primary Citations:
                        </span>
                        {link.citations.map((c, idx) => (
                          <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                            • {c}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          <span>Open External Citation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast(`Extracted inquiry parameters from ${link.title}`, 'success');
                            onLaunchViva(domain);
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] cursor-pointer"
                        >
                          Generate Viva Inquiries →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANE: UPLOADED PDF LIBRARY (SECTION 15)            */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black font-serif text-slate-900 dark:text-white">
                  Uploaded Documents
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {pdfs.length} AI-Indexed Monograph PDFs
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>+ Add PDF</span>
            </button>
          </div>

          {/* Compact Academic Document Cards */}
          <div className="space-y-3">
            {pdfs.map(pdf => (
              <div
                key={pdf.id}
                className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 border-t-2 border-t-white/40 dark:border-t-white/10 border-b-3 border-slate-900/20 dark:border-black shadow-md hover:shadow-lg transition-all space-y-3"
              >
                {/* PDF Header (Icon, title, metadata) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {pdf.filename}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        {pdf.docTitle}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-black shrink-0">
                    {pdf.aiStatus}
                  </span>
                </div>

                {/* Metadata Strip: Pages • Date • Category */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{pdf.pages} pages • Added {pdf.date}</span>
                  <span>{pdf.institution}</span>
                </div>

                {/* Inquiry Themes */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {pdf.inquiryThemes.map((theme, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {theme}
                    </span>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Loaded "${pdf.filename}" for Viva Defense evaluation`, 'success');
                      onLaunchViva(domain);
                    }}
                    className="font-black text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Practice Viva Questions →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Generated flashcards for ${pdf.filename}`, 'info');
                      onLaunchFlashcards();
                    }}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Flashcards
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Upload Resource Modal */}
      <ResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        domainName={domain.name}
        onResourceProcessed={handleResourceProcessed}
        onShowToast={onShowToast}
      />

    </div>
  );
};
