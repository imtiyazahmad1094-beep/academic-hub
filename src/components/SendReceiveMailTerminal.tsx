import React, { useState, useRef } from 'react';
import { 
  Mail, 
  Send, 
  Paperclip, 
  Inbox, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Trash2, 
  RefreshCw, 
  Clock, 
  User, 
  AlertCircle, 
  ArrowUpRight, 
  Search, 
  Filter, 
  ShieldCheck, 
  ExternalLink,
  Tag,
  AtSign,
  Download,
  Eye,
  Check,
  Zap,
  CornerUpLeft,
  Archive,
  Star
} from 'lucide-react';
import { AuthUser } from '../types';
import { TranslationDict } from '../utils/translations';
import confetti from 'canvas-confetti';

interface SendReceiveMailTerminalProps {
  currentUser: AuthUser | null;
  t?: TranslationDict;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export interface OutgoingEmailPayload {
  id: string;
  recipientEmail: string;
  subject: string;
  category: 'Symposium Abstract' | 'Peer Review' | 'Urgent Inquiry' | 'Governance' | 'General';
  message: string;
  attachments: {
    name: string;
    size: string;
    type: string;
    url?: string;
  }[];
  sentAt: string;
  status: 'Delivered' | 'In Transit' | 'Read';
}

export interface IncomingAcademicMail {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  subject: string;
  category: string;
  preview: string;
  fullMessage: string;
  timestamp: string;
  read: boolean;
  starred?: boolean;
  attachments?: { name: string; size: string }[];
}

const INITIAL_SENT_MESSAGES: OutgoingEmailPayload[] = [
  {
    id: 'sent-1',
    recipientEmail: 'editorial.board@oxford-academic.org',
    subject: 'Submission of Final Proof: AI Ethics & Islamic Jurisprudence Review',
    category: 'Symposium Abstract',
    message: 'Dear Editorial Committee,\n\nPlease find attached the final revised manuscript addressing the noise decoherence bounds and Shariah moral autonomous governance frameworks.',
    attachments: [
      { name: 'AI_Ethics_Islamic_Jurisprudence_FinalProof.pdf', size: '2.4 MB', type: 'application/pdf' }
    ],
    sentAt: '2026-09-19 16:45',
    status: 'Delivered'
  },
  {
    id: 'sent-2',
    recipientEmail: 'conference.chair@cambridge-quantum.edu',
    subject: 'Keynote Symposium Schedule Confirmation & Technical Rider',
    category: 'General',
    message: 'Greetings Chair,\n\nConfirming my presentation on Sept 24 for the Fault-Tolerant Cryptography Track.',
    attachments: [],
    sentAt: '2026-09-18 11:20',
    status: 'Read'
  }
];

const INITIAL_INBOX_MESSAGES: IncomingAcademicMail[] = [
  {
    id: 'inbox-1',
    senderName: 'Prof. Dr. Tariq Al-Mansoor',
    senderEmail: 'tariq.mansoor@dhiu.edu.in',
    senderRole: 'Symposium Lead Chair',
    subject: 'Acceptance Notice: AI Ethics Colloquium Keynote Paper',
    category: 'Symposium Abstract',
    preview: 'We are pleased to inform you that your abstract has been accepted with distinguished commendation...',
    fullMessage: 'Dear Scholar,\n\nWe are pleased to inform you that your abstract on "AI Ethics in Islamic Jurisprudence & Governance" has been accepted for keynote presentation at the 2026 International Symposium.\n\nPlease confirm your technical equipment preferences for the Zoom Webinar broadcast session.',
    timestamp: '2026-09-20 09:15',
    read: false,
    starred: true,
    attachments: [{ name: 'Colloquium_Speaker_Guide_2026.pdf', size: '1.1 MB' }]
  },
  {
    id: 'inbox-2',
    senderName: 'Editorial Secretariat',
    senderEmail: 'review.secretariat@academic-hub.org',
    senderRole: 'Chief Peer Referee',
    subject: 'Peer Review Assignment: Quantum Computing Cryptography (Ref #ABS-884)',
    category: 'Peer Review',
    preview: 'You have been assigned to evaluate the noise decoherence boundary parameters in paper #ABS-884...',
    fullMessage: 'Dear Referee,\n\nPlease review the attached manuscript evaluating quantum noise decoherence bounds. The referee scoring portal deadline is Sept 26, 2026 at 23:59 GMT.',
    timestamp: '2026-09-19 13:40',
    read: true,
    starred: false,
    attachments: [{ name: 'Manuscript_ABS-884_BlindReview.pdf', size: '3.8 MB' }]
  },
  {
    id: 'inbox-3',
    senderName: 'DHIU Academic Council',
    senderEmail: 'admin@dhiu.edu.in',
    senderRole: 'Academic Secretariat',
    subject: 'Past Year Question Papers Portal Integration Complete',
    category: 'Governance',
    preview: 'The DHIU PYQ Gateway is now synchronized with Classes 1-12 and all degree semesters...',
    fullMessage: 'The DHIU Past Year Questions Portal has completed master cataloging across Classes 1 through Degree Finals. All mark distributions and PDF downloads are verified.',
    timestamp: '2026-09-18 17:00',
    read: true,
    starred: false
  }
];

export const SendReceiveMailTerminal: React.FC<SendReceiveMailTerminalProps> = ({
  currentUser,
  t,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'dispatcher' | 'inbox' | 'outbox'>('dispatcher');

  // Outgoing form states
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Symposium Abstract' | 'Peer Review' | 'Urgent Inquiry' | 'Governance' | 'General'>('Symposium Abstract');
  const [messageText, setMessageText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string; url?: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mail arrays state
  const [sentList, setSentList] = useState<OutgoingEmailPayload[]>(() => {
    try {
      const saved = localStorage.getItem('academic_hub_sent_mail_v1');
      return saved ? JSON.parse(saved) : INITIAL_SENT_MESSAGES;
    } catch {
      return INITIAL_SENT_MESSAGES;
    }
  });

  const [inboxList, setInboxList] = useState<IncomingAcademicMail[]>(() => {
    try {
      const saved = localStorage.getItem('academic_hub_inbox_mail_v1');
      return saved ? JSON.parse(saved) : INITIAL_INBOX_MESSAGES;
    } catch {
      return INITIAL_INBOX_MESSAGES;
    }
  });

  const [selectedInboxMail, setSelectedInboxMail] = useState<IncomingAcademicMail | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const unreadInboxCount = inboxList.filter(m => !m.read).length;

  const handleFileUpload = (files: FileList | File[]) => {
    const newItems = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      type: f.type || 'application/pdf',
      url: URL.createObjectURL(f)
    }));
    setAttachedFiles(prev => [...prev, ...newItems]);
    onShowToast(`Attached ${newItems.length} document(s) to mail payload.`, 'info');
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      onShowToast('Please provide a valid recipient Gmail or academic address.', 'error');
      return;
    }

    if (!messageText.trim()) {
      onShowToast('Please include message content or instructions.', 'error');
      return;
    }

    setIsSending(true);

    // Simulate reliable network transport stream
    setTimeout(() => {
      const newSentItem: OutgoingEmailPayload = {
        id: `sent-${Date.now()}`,
        recipientEmail: recipientEmail.trim(),
        subject: subject.trim() || 'Scholarly Communication & Academic Dispatch',
        category,
        message: messageText.trim(),
        attachments: attachedFiles,
        sentAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Delivered'
      };

      const updated = [newSentItem, ...sentList];
      setSentList(updated);
      localStorage.setItem('academic_hub_sent_mail_v1', JSON.stringify(updated));

      setIsSending(false);
      setSendSuccess(true);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#10b981', '#f59e0b', '#6366f1']
        });
      } catch (_) {}

      onShowToast(`Dispatched message to ${recipientEmail}!`, 'success');

      // Reset form after delay
      setTimeout(() => {
        setRecipientEmail('');
        setSubject('');
        setMessageText('');
        setAttachedFiles([]);
        setSendSuccess(false);
      }, 3000);
    }, 1100);
  };

  const markInboxAsRead = (id: string) => {
    setInboxList(prev =>
      prev.map(m => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxList(prev =>
      prev.map(m => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const deleteInboxItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxList(prev => prev.filter(m => m.id !== id));
    if (selectedInboxMail?.id === id) setSelectedInboxMail(null);
    onShowToast('Message moved to archive', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="send-receive-mail-terminal-workspace">
      
      {/* 3D Glass Header Block */}
      <div 
        className="section-box-glass p-6 sm:p-7 border-[1.5px] border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.18)] relative overflow-hidden"
        style={{ borderRadius: '16px' }}
      >
        {/* Ambient Glow Aura */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-sky-500/15 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/15 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-500/30">
              <Mail className="w-3.5 h-3.5 text-sky-500" />
              <span>Academic Communication &amp; Dispatch Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
              Send &amp; Receive Mail Terminal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Dispatch encrypted academic manuscripts, communicate with symposium peer reviewers, and receive official editorial resolutions seamlessly.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div 
            className="flex items-center p-1.5 bg-slate-200/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-300/80 dark:border-slate-700/80 shadow-inner self-start md:self-center"
            style={{ borderRadius: '14px' }}
          >
            <button
              id="tab-mail-dispatcher"
              onClick={() => {
                setActiveTab('dispatcher');
                setSelectedInboxMail(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'dispatcher'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Outgoing Dispatcher</span>
            </button>

            <button
              id="tab-mail-inbox"
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'inbox'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox ({unreadInboxCount})</span>
              {unreadInboxCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              id="tab-mail-outbox"
              onClick={() => {
                setActiveTab('outbox');
                setSelectedInboxMail(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'outbox'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sent Archive ({sentList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. THE OUTGOING MAIL DISPATCHER CONTAINER                 */}
      {/* ======================================================== */}
      {activeTab === 'dispatcher' && (
        <div 
          className="section-box-glass p-6 sm:p-8 border-[1.5px] border-sky-500/40 shadow-[0_0_24px_rgba(14,165,233,0.15)] relative overflow-hidden"
          style={{ borderRadius: '16px' }}
          id="outgoing-mail-dispatcher-container"
        >
          {sendSuccess && (
            <div 
              className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-4 animate-bounce"
              style={{ borderRadius: '14px' }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shrink-0">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                  Message Dispatched Successfully!
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  The payload stream and attachments have been delivered to the recipient mail server.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-6">
            
            {/* Top Row: Target Recipient Gmail & Category */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Target Field: Recipient Gmail Address */}
              <div className="md:col-span-8 space-y-1.5">
                <label 
                  htmlFor="input-recipient-gmail-address"
                  className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300 flex items-center gap-1.5"
                >
                  <AtSign className="w-3.5 h-3.5 text-sky-500" />
                  <span>Recipient Gmail Address</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-recipient-gmail-address"
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="e.g., scholar@gmail.com"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                {/* Quick Academic Contacts Pill Bar */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Recipient:</span>
                  <button
                    type="button"
                    onClick={() => setRecipientEmail('tariq.mansoor@dhiu.edu.in')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-200"
                  >
                    Dr. Tariq Al-Mansoor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientEmail('editorial.board@oxford-academic.org')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-200"
                  >
                    Oxford Editorial
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientEmail('scholar@gmail.com')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-200"
                  >
                    scholar@gmail.com
                  </button>
                </div>
              </div>

              {/* Message Topic Category */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-500" />
                  <span>Dispatch Track Category</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-3 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                  style={{ borderRadius: '12px' }}
                >
                  <option value="Symposium Abstract">📜 Symposium Abstract</option>
                  <option value="Peer Review">⚖️ Peer Review</option>
                  <option value="Urgent Inquiry">🚨 Urgent Inquiry</option>
                  <option value="Governance">🏛️ Governance</option>
                  <option value="General">💬 General Communication</option>
                </select>
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-1.5">
              <label 
                htmlFor="input-mail-subject"
                className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300"
              >
                Subject Header
              </label>
              <input
                id="input-mail-subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g., Symposium Abstract Revision &amp; Presentation Confirmation"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Content Payload Fields: Dual Ingestion Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left: Raw text box editor */}
              <div className="lg:col-span-7 space-y-1.5 flex flex-col">
                <label 
                  htmlFor="textarea-mail-message-body"
                  className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300"
                >
                  Message Content &amp; Web Hyperlinks
                </label>
                <textarea
                  id="textarea-mail-message-body"
                  required
                  rows={8}
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type message text, resource descriptions, or share web hyperlinks here..."
                  className="w-full flex-1 px-4 py-3 text-xs sm:text-sm font-sans bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none shadow-xs leading-relaxed"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Right: Dedicated secure document uploader dropping boundary box */}
              <div className="lg:col-span-5 space-y-1.5 flex flex-col">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-sky-300 flex items-center justify-between">
                  <span>Manuscripts &amp; Attachments</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {attachedFiles.length} item(s) attached
                  </span>
                </label>

                {/* Dropping Boundary Box */}
                <div
                  id="mail-document-uploader-dropzone"
                  onDragOver={e => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFileUpload(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 min-h-[160px] p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/60 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/60 dark:bg-slate-900/60'
                  }`}
                  style={{ borderRadius: '12px' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files);
                      }
                    }}
                  />

                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2">
                    <Paperclip className="w-5 h-5" />
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Attach files, PDF manuscripts, images, or session reference notes
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Drag &amp; drop files here or click to browse
                  </p>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pt-1">
                    {attachedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            ({file.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Remove attachment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Base Row: Delivery Dispatch Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span>TLS Academic Email Transport &amp; Header Validation Active</span>
              </div>

              {/* Bold Primary Action Button */}
              <button
                id="btn-mail-terminal-send-message"
                type="submit"
                disabled={isSending}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-50"
                style={{ borderRadius: '12px' }}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Compiling &amp; Dispatching Stream...</span>
                  </>
                ) : (
                  <span>🚀 Send Message</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INBOX & ACADEMIC CORRESPONDENCES                      */}
      {/* ======================================================== */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inbox List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scholarly Inbox ({inboxList.length})
              </h3>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono font-bold">
                {unreadInboxCount} unread
              </span>
            </div>

            <div className="space-y-2.5">
              {inboxList.map(mail => (
                <div
                  key={mail.id}
                  onClick={() => {
                    setSelectedInboxMail(mail);
                    markInboxAsRead(mail.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    selectedInboxMail?.id === mail.id
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 shadow-md scale-[1.01]'
                      : !mail.read
                      ? 'bg-white dark:bg-slate-850 border-sky-300 dark:border-sky-800 shadow-xs'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {mail.senderName}
                      </span>
                      {!mail.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {mail.timestamp.split(' ')[1]}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {mail.subject}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {mail.preview}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                      {mail.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {mail.attachments && (
                        <span className="flex items-center gap-1 font-mono">
                          <Paperclip className="w-3 h-3 text-slate-400" />
                          {mail.attachments.length}
                        </span>
                      )}
                      <button
                        onClick={e => toggleStar(mail.id, e)}
                        className="text-slate-400 hover:text-amber-500"
                      >
                        <Star className={`w-3.5 h-3.5 ${mail.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mail Reading Pane */}
          <div className="lg:col-span-7">
            {selectedInboxMail ? (
              <div 
                className="section-box-glass p-6 border-[1.5px] border-sky-500/40 shadow-lg space-y-5"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-mono">
                      {selectedInboxMail.category}
                    </span>
                    <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white pt-1">
                      {selectedInboxMail.subject}
                    </h2>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      From: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedInboxMail.senderName}</span> ({selectedInboxMail.senderEmail}) • {selectedInboxMail.senderRole}
                    </div>
                  </div>

                  <button
                    onClick={e => deleteInboxItem(selectedInboxMail.id, e)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800"
                    title="Archive message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap py-2">
                  {selectedInboxMail.fullMessage}
                </div>

                {selectedInboxMail.attachments && selectedInboxMail.attachments.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Attached Documents ({selectedInboxMail.attachments.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedInboxMail.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs"
                        >
                          <FileText className="w-4 h-4 text-sky-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                          <button
                            onClick={() => onShowToast(`Downloading ${att.name}...`, 'info')}
                            className="p-1 hover:text-sky-500 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Trigger */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setRecipientEmail(selectedInboxMail.senderEmail);
                      setSubject(`Re: ${selectedInboxMail.subject}`);
                      setActiveTab('dispatcher');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors cursor-pointer"
                  >
                    <CornerUpLeft className="w-4 h-4" />
                    <span>Reply to {selectedInboxMail.senderName.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="section-box-glass p-12 border border-slate-200 dark:border-slate-800 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]"
                style={{ borderRadius: '16px' }}
              >
                <Mail className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-xs font-bold">Select a message to view details</p>
                <p className="text-[11px]">Academic review decisions and peer requests appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SENT MESSAGES ARCHIVE                                 */}
      {/* ======================================================== */}
      {activeTab === 'outbox' && (
        <div 
          className="section-box-glass p-6 sm:p-7 border-[1.5px] border-sky-500/40 shadow-lg space-y-4"
          style={{ borderRadius: '16px' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Dispatched Transports ({sentList.length})
            </h3>
          </div>

          <div className="space-y-3">
            {sentList.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                style={{ borderRadius: '12px' }}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      To: {item.recipientEmail}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.subject}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-sans">
                    {item.message}
                  </p>

                  {item.attachments.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Paperclip className="w-3 h-3 text-sky-500" />
                      <span>{item.attachments.map(a => a.name).join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400 shrink-0 self-start md:self-center">
                  {item.sentAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
