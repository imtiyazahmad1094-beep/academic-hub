import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  User,
  ScanLine,
  X,
  FileCheck,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Share2,
  Link2
} from 'lucide-react';
import { AcademicProgram } from '../types';
import { 
  getProgramStatus, 
  getWordCount 
} from '../utils/academicUtils';

interface TopUpcomingSectionProps {
  programs: AcademicProgram[];
  onSelectProgram: (program: AcademicProgram) => void;
  onToggleMode?: (programId: string, currentMode: 'Online' | 'Offline') => void;
  onOpenShare?: (url?: string, title?: string) => void;
  onOpenSubmitLink?: () => void;
}

interface ExtractedSenderInfo {
  senderName: string;
  sponsorOrg: string;
  email: string;
  phone: string;
  designation: string;
  sourceDocName: string;
  confidenceScore: number;
  extractedTimestamp: string;
}

export const TopUpcomingSection: React.FC<TopUpcomingSectionProps> = ({
  programs,
  onSelectProgram,
  onOpenShare,
  onOpenSubmitLink,
}) => {
  // OCR / Sender extraction state
  const [showSenderUploadModal, setShowSenderUploadModal] = useState(false);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [ocrStep, setOcrStep] = useState<number>(0); // 0=idle, 1=scanning, 2=bounding box, 3=done
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string>('sample_sponsor_card.png');

  // Extracted Sender Info state (editable pre-filled fields)
  const [senderInfo, setSenderInfo] = useState<ExtractedSenderInfo>({
    senderName: 'Dr. Katherine Reynolds',
    sponsorOrg: 'Global Quantum AI Consortium & Cambridge Secretariat',
    email: 'katherine.reynolds@quantum-consortium.org',
    phone: '+44 (0) 1223 765432',
    designation: 'Symposium Organizing Chair & Keynote Sponsor',
    sourceDocName: 'cambridge_symposium_invitation.png',
    confidenceScore: 98.6,
    extractedTimestamp: 'Just now'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort programs chronologically to get top upcoming/approaching
  const sortedPrograms = [...programs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prioritize approaching / upcoming
  const approachingOrUpcoming = sortedPrograms.filter(p => {
    const s = getProgramStatus(p.date);
    return s === 'approaching' || s === 'upcoming';
  });

  // Take top 5
  let displayList = approachingOrUpcoming.slice(0, 5);
  if (displayList.length < 5) {
    const rest = sortedPrograms.filter(p => !displayList.some(d => d.id === p.id));
    displayList = [...displayList, ...rest.slice(0, 5 - displayList.length)];
  }

  // Format short date (e.g., "Sep 19, 2026")
  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Trigger OCR Extraction Simulation
  const runOcrExtraction = (fileName: string, customPreset?: Partial<ExtractedSenderInfo>) => {
    setActiveFileName(fileName);
    setIsExtractingOcr(true);
    setOcrStep(1);
    setShowSuccessToast(false);

    // Step 1: Scan optical characters (500ms)
    setTimeout(() => {
      setOcrStep(2); // Step 2: Isolate Sender Info Bounding Box (600ms)
      
      setTimeout(() => {
        setOcrStep(3);
        setIsExtractingOcr(false);
        
        if (customPreset) {
          setSenderInfo(prev => ({
            ...prev,
            ...customPreset,
            sourceDocName: fileName,
            extractedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        } else {
          setSenderInfo(prev => ({
            ...prev,
            sourceDocName: fileName,
            extractedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        }

        // Show smooth popup checkmark indicator
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }, 700);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      runOcrExtraction(file.name, {
        senderName: file.name.includes('oxford') ? 'Prof. Tariq Al-Mansoor' : 'Dr. Sarah Jenkins',
        sponsorOrg: file.name.includes('oxford') ? 'Oxford Centre for AI Ethics' : 'International Science Foundation',
        email: file.name.includes('oxford') ? 'secretariat@oxford-ethics.org' : 's.jenkins@sciencefoundation.org',
        phone: '+1 (555) 839-2041',
        designation: 'Director of Symposium Grants',
        confidenceScore: 99.1
      });
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section className="w-full mb-8" id="section-top-upcoming">
      {/* Clean Smooth Platinum Charcoal Glass Container */}
      <div 
        className="section-box-glass section-box-programs bg-white/95 dark:bg-slate-900/95 border border-slate-300/60 dark:border-sky-500/40 p-6 sm:p-8 shadow-[0_0_20px_rgba(14,165,233,0.12)] relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        
        {/* Subtle decorative background sprinkles */}
        <div className="absolute top-3 right-6 w-24 h-24 bg-sky-400/15 dark:bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-2 left-10 w-28 h-28 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Title Row with Playful Headline, Neon-Glow Highlight, Crayon Stroke Underline & Smiling Star Badge */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative inline-block">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight font-sans">
                  <span>Top 5 </span>
                  {/* Words "Upcoming Programs" with Ambient Soft Neon-Glow drop shadow */}
                  <span className="neon-glow-sky text-sky-700 dark:text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.65)]">
                    Upcoming Programs
                  </span>
                </h2>
                
                {/* Vibrant Playful Hand-Drawn Crayon Stroke Accent */}
                <svg 
                  className="w-full h-3.5 mt-0.5 text-sky-500 dark:text-sky-400 overflow-visible" 
                  viewBox="0 0 240 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M3 7.5C40 2.5 85 10 130 5C170 1.5 210 8 237 6" 
                    stroke="url(#crayon-gradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <defs>
                    <linearGradient id="crayon-gradient" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="45%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Cheerful Smiling Star Badge */}
              <div 
                className="inline-flex items-center justify-center p-1.5 rounded-full bg-amber-100 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 shadow-2xs animate-float-gentle"
                title="Active live quest schedule"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Glowing 5-point Star */}
                  <path 
                    d="M12 2L14.9 8.26L21.8 9.27L16.8 14.14L18 21.02L12 17.77L6 21.02L7.2 14.14L2.2 9.27L9.1 8.26L12 2Z" 
                    fill="#FBBF24" 
                    stroke="#D97706" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Cheerful Eyes */}
                  <circle cx="9.5" cy="11.5" r="1" fill="#78350F" />
                  <circle cx="14.5" cy="11.5" r="1" fill="#78350F" />
                  {/* Cute Smile */}
                  <path 
                    d="M10 14C10.7 15 13.3 15 14 14" 
                    stroke="#78350F" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                  />
                  {/* Rosy Cheeks */}
                  <circle cx="7.8" cy="13" r="0.8" fill="#F87171" opacity="0.8" />
                  <circle cx="16.2" cy="13" r="0.8" fill="#F87171" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Subtitle in high-contrast crisp tone */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-cyan-100 font-medium">
              Real-time schedule with active status tracking.
            </p>
          </div>

          {/* Right Header Cluster: Smart Sponsor/Sender OCR Button & Status Legend */}
          <div className="flex items-center gap-3 text-xs shrink-0 flex-wrap">
            
            {/* Smart Sponsor / Sender Info OCR Extraction Action Trigger */}
            <button
              id="btn-open-sender-ocr"
              onClick={() => setShowSenderUploadModal(!showSenderUploadModal)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Smart AI Document Sourcing & Automated OCR Extraction"
            >
              <ScanLine className="w-3.5 h-3.5 animate-pulse" />
              <span>Sponsor / Sender Info OCR</span>
            </button>

            {/* Ingestion Trigger Placement: Directly adjacent to primary document upload assets */}
            {onOpenSubmitLink && (
              <button
                id="btn-upcoming-submit-link"
                type="button"
                onClick={onOpenSubmitLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 border border-cyan-400/30 dark:border-cyan-400/50"
                title="Ingest external web reference into active directory"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>🔗 Submit Link</span>
              </button>
            )}

            {/* Status Legend Pill 1: Near/Approaching (Warm pastel cherry-red dot) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-xs ring-2 ring-rose-200 dark:ring-rose-900/50 shrink-0" />
              <span className="font-extrabold text-rose-950 dark:text-rose-100 text-xs">Near/Approaching</span>
            </div>

            {/* Status Legend Pill 2: Scheduled (Bright pastel mint-green dot) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs ring-2 ring-emerald-200 dark:ring-emerald-900/50 shrink-0" />
              <span className="font-extrabold text-emerald-950 dark:text-emerald-100 text-xs">Scheduled</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* SMART AI DOCUMENT SOURCING & OCR EXTRACTION ZONE         */}
        {/* ======================================================== */}
        {showSenderUploadModal && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-850/90 border-2 border-sky-200/90 dark:border-sky-900/70 shadow-md animate-pop-up-bounce relative">
            <button
              onClick={() => setShowSenderUploadModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <span>Smart AI Sender Info Extraction & Optical Character Scan</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Auto-Boundary Box
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload an event flyer, secretariat business card, or invitation letter to instantly extract phone numbers and email IDs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
              
              {/* Dropzone & Presets (Left Column) */}
              <div className="lg:col-span-5 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sky-300 dark:border-sky-700 hover:border-sky-500 rounded-2xl p-5 text-center bg-white/80 dark:bg-slate-900/80 cursor-pointer transition-all hover:bg-sky-50/50 dark:hover:bg-slate-800/80 group"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-sky-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drop Flyer / Business Card image or <span className="text-sky-600 underline">Browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports PNG, JPG, PDF documents
                  </p>
                </div>

                {/* Quick OCR Simulation Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Sample Document Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => runOcrExtraction('cambridge_quantum_flyer.png', {
                        senderName: 'Prof. Elena Rostova',
                        sponsorOrg: 'Cavendish Laboratory & Quantum AI Institute',
                        email: 'elena.rostova@cambridge.ac.uk',
                        phone: '+44 1223 337733',
                        designation: 'Chair of Quantum Communications',
                        confidenceScore: 99.4
                      })}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 cursor-pointer shadow-2xs"
                    >
                      📄 Cambridge Flyer
                    </button>

                    <button
                      type="button"
                      onClick={() => runOcrExtraction('oxford_symposium_card.png', {
                        senderName: 'Prof. Dr. Tariq Al-Mansoor',
                        sponsorOrg: 'Oxford Centre for Islamic Studies & Ethics',
                        email: 'tariq.mansoor@oxford.ac.uk',
                        phone: '+44 1865 278730',
                        designation: 'Editorial Chair & Grants Liaison',
                        confidenceScore: 98.8
                      })}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 cursor-pointer shadow-2xs"
                    >
                      📇 Oxford Contact Card
                    </button>

                    <button
                      type="button"
                      onClick={() => runOcrExtraction('stanford_bio_keynote.pdf', {
                        senderName: 'Dr. Marcus Vance',
                        sponsorOrg: 'Stanford Bio-Engineering & Neural Matrix Board',
                        email: 'm.vance@stanford.edu',
                        phone: '+1 (650) 723-2300',
                        designation: 'Lead Organizing Secretary',
                        confidenceScore: 99.7
                      })}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 cursor-pointer shadow-2xs"
                    >
                      📑 Stanford Keynote
                    </button>
                  </div>
                </div>

                {/* Simulated Boundary Box Visualizer */}
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono border border-slate-700 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      OCR Engine Status: {isExtractingOcr ? 'Active Scanning...' : 'Synchronized'}
                    </span>
                    <span>File: {activeFileName}</span>
                  </div>

                  {isExtractingOcr ? (
                    <div className="py-3 text-center space-y-2">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 animate-pulse w-3/4" />
                      </div>
                      <p className="text-[10px] text-sky-400">
                        {ocrStep === 1 && 'Scanning raster image optical layers...'}
                        {ocrStep === 2 && 'Isolating [Sender Info] bounding coordinates (x: 142, y: 310)...'}
                        {ocrStep === 3 && 'Validating phone E.164 and RFC 5322 email syntax...'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-[10px] text-emerald-400 space-y-0.5">
                      <div>[✓] Bounding Box: [Sender / Secretariat Header Area]</div>
                      <div>[✓] Regex match: Phone ({senderInfo.phone})</div>
                      <div>[✓] Regex match: Email ({senderInfo.email})</div>
                      <div className="text-slate-400 text-[9px] pt-1">Confidence: {senderInfo.confidenceScore}% • Extracted at {senderInfo.extractedTimestamp}</div>
                    </div>
                  )}
                </div>

              </div>

              {/* Pre-filled Extracted Input Fields (Right Column) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Extracted Sender & Secretariat Contact Records</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Live Validated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Sender Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-sky-500" />
                      <span>Sender / Chair Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderInfo.senderName}
                        onChange={e => setSenderInfo({ ...senderInfo, senderName: e.target.value })}
                        className="w-full pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(senderInfo.senderName, 'name')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600"
                        title="Copy Name"
                      >
                        {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Sponsor Org */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-sky-500" />
                      <span>Sponsoring Institution</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderInfo.sponsorOrg}
                        onChange={e => setSenderInfo({ ...senderInfo, sponsorOrg: e.target.value })}
                        className="w-full pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(senderInfo.sponsorOrg, 'org')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600"
                        title="Copy Org"
                      >
                        {copiedField === 'org' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Email ID (Auto-Extracted) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-emerald-500" />
                      <span>Extracted Email ID</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={senderInfo.email}
                        onChange={e => setSenderInfo({ ...senderInfo, email: e.target.value })}
                        className="w-full pl-2.5 pr-8 py-1.5 rounded-lg border-2 border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-mono text-xs outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(senderInfo.email, 'email')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                        title="Copy Email"
                      >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Phone Number (Auto-Extracted) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-500" />
                      <span>Extracted Phone / Hotline</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderInfo.phone}
                        onChange={e => setSenderInfo({ ...senderInfo, phone: e.target.value })}
                        className="w-full pl-2.5 pr-8 py-1.5 rounded-lg border-2 border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-mono text-xs outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(senderInfo.phone, 'phone')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                        title="Copy Phone"
                      >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Fields are automatically synchronized with active symposium forms.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessToast(true);
                      setTimeout(() => {
                        setShowSuccessToast(false);
                        setShowSenderUploadModal(false);
                      }, 1500);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Apply Sender Info</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Subtle Pop-Up Checkmark Toast Notification */}
        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-500 shadow-2xl flex items-center gap-3 animate-pop-up-bounce">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Optical Character Extraction Succeeded!
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sender phone ({senderInfo.phone}) and email populated instantly.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5 HORIZONTAL GAMIFIED CARDS LAYOUT                       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayList.slice(0, 5).map((prog, index) => {
            // Cards #1 through #4 use soft pastel light-pink background wash
            // Card #5 uses vibrant joyful pastel light-green background wash
            const isUrgent = index < 4;
            const levelText = `Lv. ${index + 1}`;

            const cardBgStyle = isUrgent
              ? 'bg-[#FFF0F3] dark:bg-slate-900/90 border-2 border-rose-300 dark:border-rose-500/60 hover:border-rose-400 dark:hover:border-rose-400 shadow-sm'
              : 'bg-[#F0FDF4] dark:bg-slate-900/90 border-2 border-emerald-300 dark:border-emerald-500/60 hover:border-emerald-400 dark:hover:border-emerald-400 shadow-sm';

            const statusBadgeText = isUrgent ? 'Approaching' : 'Upcoming';
            
            // Soft pulse glow animation for urgent status with maximum contrast text
            const statusBadgeClass = isUrgent
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-100 border-rose-300 dark:border-rose-700 animate-urgent-badge-glow shadow-[0_0_8px_rgba(244,63,94,0.3)] font-extrabold'
              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700 font-extrabold';

            const wordCount = getWordCount(prog.abstract);
            const maxWords = prog.maxAbstractWords || 300;

            // Sequential playful bouncy vertical pop-up motion transition from bottom
            const animationDelayMs = index * 100;

            return (
              <div
                key={prog.id}
                id={`upcoming-card-${prog.id}`}
                onClick={() => onSelectProgram(prog)}
                style={{ animationDelay: `${animationDelayMs}ms` }}
                className={`animate-pop-up-bounce rounded-[16px] p-4.5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer flex flex-col justify-between group relative overflow-hidden ${cardBgStyle}`}
              >
                {/* Card Header Cluster: Chunky Level Badge (Left) & Crisp Animated Arrow (Right) */}
                <div className="flex items-center justify-between mb-3">
                  {/* Chunky Level Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] font-black text-slate-950 dark:text-white tracking-wide font-sans">
                      {levelText}
                    </span>
                  </div>

                  {/* Action triggers: Share Link & Crisp Animated Arrow Button */}
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    {onOpenShare && (
                      <button
                        id={`btn-share-upcoming-${prog.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenShare(
                            prog.registrationUrl || (typeof window !== 'undefined' ? `${window.location.origin}/programs#${prog.id}` : 'https://academic-hub.edu/share/program'),
                            prog.name
                          );
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs hover:text-sky-600 dark:hover:text-sky-400 hover:scale-110 transition-all cursor-pointer"
                        title="Share link"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    )}

                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 group-hover:scale-110 transition-all duration-200 cursor-pointer"
                      title="View quest & symposium details"
                      onClick={() => onSelectProgram(prog)}
                    >
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Status & Mode Badges Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {/* Soft, friendly bubble pill for urgency with soft pulse glow when urgent */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${statusBadgeClass}`}>
                    {statusBadgeText}
                  </span>

                  {/* Cheerful Miniature Vector Icon for Format (Online 3D-styled Globe / Offline School House) */}
                  <div 
                    className="p-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs text-slate-700 dark:text-slate-200" 
                    title={prog.mode === 'Online' ? 'Online Global Webinar' : 'Offline Campus Venue'}
                  >
                    {prog.mode === 'Online' ? (
                      /* Playful 3D-styled Globe vector */
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#38BDF8" fillOpacity="0.25" stroke="#0284C7" strokeWidth="2" />
                        <path d="M2 12H22" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2Z" stroke="#0284C7" strokeWidth="1.8" />
                      </svg>
                    ) : (
                      /* Cute Block-Building School House vector */
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" fill="#F59E0B" fillOpacity="0.25" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M9 21V14H15V21" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                        <circle cx="12" cy="8" r="1.5" fill="#D97706" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Program Title: Bold, friendly charcoal sans-serif typeface, wrapping 2-3 lines without truncating */}
                <div className="mb-2.5 min-h-[56px] flex items-start">
                  <h3 
                    className="font-black text-slate-950 dark:text-white text-xs sm:text-sm leading-snug font-sans group-hover:text-sky-800 dark:group-hover:text-cyan-300 transition-colors"
                    title={prog.name}
                  >
                    {prog.name}
                  </h3>
                </div>

                {/* Event Meta Details: Miniature colorful icons for dates and location */}
                <div className="space-y-1 text-[11px] text-slate-800 dark:text-slate-200 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs shrink-0">📅</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatShortDate(prog.date)}
                    </span>
                  </div>
                  {prog.location !== 'Geneva Bio-Innovation Hub, Hall B, Switzerland' && (
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs shrink-0">📍</span>
                      <span className="truncate text-slate-800 dark:text-slate-300 font-medium">
                        {prog.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Topic Tags (Bottom-Left) & Word Count Quest Milestone Badge (Bottom-Right) */}
                <div className="flex items-center justify-between gap-1.5 pt-2.5 border-t border-slate-300/80 dark:border-slate-800 mt-auto">
                  
                  {/* Topic Tags (High-contrast background with dark text on light / crisp white on dark) */}
                  <div className="flex items-center gap-1 overflow-hidden">
                    {prog.themes
                      .filter(t => !['Chemosynthetic Ecosystems', 'Abyssal Geochemistry', 'Submersible ROVs'].includes(t))
                      .slice(0, 2)
                      .map((theme, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-cyan-100 border border-slate-300 dark:border-slate-700 truncate max-w-[72px] shadow-2xs"
                          title={theme}
                        >
                          {theme}
                        </span>
                      ))}
                    {prog.themes.filter(t => !['Chemosynthetic Ecosystems', 'Abyssal Geochemistry', 'Submersible ROVs'].includes(t)).length > 2 && (
                      <span 
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-cyan-200 border border-slate-300 dark:border-slate-700 shrink-0 shadow-2xs"
                        title={`More topics`}
                      >
                        +{prog.themes.filter(t => !['Chemosynthetic Ecosystems', 'Abyssal Geochemistry', 'Submersible ROVs'].includes(t)).length - 2}
                      </span>
                    )}
                  </div>

                  {/* Word Count Milestone Badge (Game quest progress tracker) */}
                  <div 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-extrabold text-slate-950 dark:text-white font-mono shrink-0 shadow-2xs group-hover:border-sky-400 transition-colors"
                    title={`Quest Progress: Abstract submission status (${wordCount} of ${maxWords} maximum words)`}
                  >
                    <span className="text-[10px]">📄</span>
                    <span>{wordCount}/{maxWords}w</span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
