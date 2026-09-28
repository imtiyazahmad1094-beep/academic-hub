import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Trash2, 
  Check, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Eraser, 
  Link2, 
  Palette, 
  Sparkles,
  Download,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ProximityFluidText } from './common/ProximityFluidText';

interface TextToPdfWorkspaceProps {
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3';
type PageOrientation = 'Portrait' | 'Landscape';
type PageMargin = '10 mm' | '20 mm' | '25 mm' | '30 mm';
type TextDirection = 'LTR' | 'RTL';
type TemplateLang = 'English sample' | 'Arabic text to PDF' | 'Urdu text to PDF' | 'Hindi text to PDF';

const TEMPLATES: Record<TemplateLang, { title: string; content: string; dir: TextDirection }> = {
  'English sample': {
    title: 'Empirical Methodologies in Distributed AI Ethics',
    dir: 'LTR',
    content: `Academic Hub & Research Governance Review\n\nTitle: Empirical Methodologies in Distributed AI Ethics\n\nAbstract:\nRecent advancements in multi-modal intelligence systems have underscored the urgent imperative for rigorous ethical boundaries and verifiable algorithmic safety. This treatise evaluates three foundational dimensions: distributed model consensus, data provenance integrity, and cross-jurisdictional compliance.\n\n1. Introduction\nModern distributed intelligence networks require robust verification mechanisms that preserve user sovereignty while preventing adversarial prompt injection and bias amplification.\n\n2. Methodological Framework\nWe audit fifty thousand cross-institutional academic submissions under standardized peer-review matrices.\n\n3. Conclusion & Policy Recommendations\nContinuous auditing and real-time governance pipelines ensure scalable, transparent, and morally sound academic deployments.`
  },
  'Arabic text to PDF': {
    title: 'مناهج التوثيق العلمي والذكاء الاصطناعي',
    dir: 'RTL',
    content: `بسم الله الرحمن الرحيم\nجامعة دار الهدى الإسلامية — مركز البحوث الأكاديمية\n\nعنوان البحث: مناهج التوثيق العلمي وضوابط الإفتاء المعاصر في ظل الذكاء الاصطناعي\n\nالمقدمة:\nإن الثورة الرقمية المعاصرة تفرض على الباحثين المسلمين التزام أعلى معايير التدقيق والتحقيق، صوناً للتراث واستيعاباً لمستجدات العصر وتحدياته الفكرية.\n\nالمحاور الأساسية:\n١. الضوابط الفقهية للأنظمة الذكية والمسؤولية الأخلاقية للأبحاث الرقمية.\n٢. توثيق الأحاديث النبوية الشريفة والمراجع الأثرية عبر قواعد البيانات السحابية.\n٣. آليات تحكيم الأوراق العلمية في المؤتمرات الأكاديمية الدولية.\n\nالخاتمة:\nنسأل الله تعالى التوفيق والسداد لكافة طلبة العلم والباحثين في مشارق الأرض ومغاربها.`
  },
  'Urdu text to PDF': {
    title: 'معاصر فقہی مسائل اور جدید ٹیکنالوجی',
    dir: 'RTL',
    content: `دار الہدیٰ اسلامک یونیورسٹی — سنٹرل ریسرچ پورٹل\n\nمقالہ برائے علمی و تحقیقی مذاکرہ: معاصر فقہی مسائل اور جدید ٹیکنالوجی\n\nخلاصہ بحث:\nموجودہ دور میں علمی تحقیقات کی اشاعت اور ان کی مستند جانچ پڑتال ایک لازمی تقاضا بن چکی ہے۔ یہ دستاویز طلبہ و اساتذہ کے مابین باہمی علمی تبادلے اور تحقیقی مقالات کو محفوظ بنانے کی عملی پیش رفت ہے۔\n\nاہم نکات:\n۱. اسلامی اقدار کے مطابق ٹیکنالوجی کا مثبت اور نتیجہ خیز استعمال۔\n۲. تحقیقی مقالات کے لیے بین الاقوامی تعلیمی معیارات کی ترویج۔\n۳. امتحانی نظام میں شفافیت، معیاری جانچ اور ریکارڈ کا تحفظ۔\n\nنتیجہ:\nعلم کی ترویج اور اخلاقی تربیت کا حسین امتزاج ہی حقیقی کامیابی کی ضمانت ہے۔`
  },
  'Hindi text to PDF': {
    title: 'आधुनिक शिक्षा प्रणाली में डिजिटल शोध और मानक',
    dir: 'LTR',
    content: `अकादमिक हब एवं शोध संस्थान — केंद्रीय अनुसंधान विलेख\n\nशीर्षक: आधुनिक शिक्षा प्रणाली में डिजिटल शोध और नैतिक मानक\n\nसारांश:\nप्रस्तुत शोध पत्र में समकालीन सूचना प्रौद्योगिकी एवं शैक्षणिक अनुशासन के समन्वय पर विस्तृत प्रकाश डाला गया है। हमारा उद्देश्य विद्यार्थियों और शोधकर्ताओं को पारदर्शी, सुरक्षित एवं सुगम मंच प्रदान करना है।\n\nमुख्य बिंदु:\n१. डिजिटल अभिलेखागार का मानकीकरण और दीर्घकालिक संरक्षण।\n२. अनुसंधान पत्रों की निष्पक्ष एवं त्वरित समीक्षा प्रणाली।\n३. तकनीकी नवाचार के साथ मानवीय मूल्यों और बौद्धिक संपदा का संरक्षण।\n\nनिष्कर्ष:\nसत्य, निष्ठा और ज्ञान की खोज ही समग्र मानवीय विकास की आधारशिला है।`
  }
};

export const TextToPdfWorkspace: React.FC<TextToPdfWorkspaceProps> = ({ onShowToast }) => {
  // Configuration parameters
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<PageOrientation>('Portrait');
  const [margins, setMargins] = useState<PageMargin>('20 mm');
  const [textDirection, setTextDirection] = useState<TextDirection>('LTR');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateLang>('English sample');

  // Rich Text Editor State
  const [content, setContent] = useState<string>(TEMPLATES['English sample'].content);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [fontColor, setFontColor] = useState<string>('#1e293b');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load sample content handler
  const handleLoadSample = () => {
    const template = TEMPLATES[selectedTemplate];
    if (template) {
      setContent(template.content);
      setTextDirection(template.dir);
      setTextAlign(template.dir === 'RTL' ? 'right' : 'left');
      if (onShowToast) {
        onShowToast(`Loaded "${selectedTemplate}" template successfully!`, 'info');
      }
    }
  };

  // Clear all handler
  const handleClearAll = () => {
    setContent('');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsStrikethrough(false);
    setTextAlign('left');
    if (onShowToast) {
      onShowToast('Workspace cleared. Start typing your new document.', 'info');
    }
    textareaRef.current?.focus();
  };

  // Insert list bullet helper
  const handleInsertBullet = (type: 'disc' | 'number') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const prefix = type === 'disc' ? '• ' : '1. ';
    const newText = text.substring(0, start) + prefix + text.substring(end);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 50);
  };

  // Insert link helper
  const handleInsertLink = () => {
    const url = prompt('Enter the link URL (e.g., https://academic-hub.edu):', 'https://');
    if (!url) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Hyperlink';
    const linkStr = `[${selectedText}](${url})`;

    const newText = textarea.value.substring(0, start) + linkStr + textarea.value.substring(end);
    setContent(newText);
  };

  // Reset typography styling
  const handleClearFormatting = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsStrikethrough(false);
    setFontColor('#1e293b');
    setTextAlign(textDirection === 'RTL' ? 'right' : 'left');
    if (onShowToast) {
      onShowToast('Typography formatting reset to baseline.', 'info');
    }
  };

  // Export PDF using jsPDF
  const handleCreatePdf = async () => {
    if (!content.trim()) {
      if (onShowToast) onShowToast('Please type or paste some text before creating a PDF.', 'error');
      return;
    }

    try {
      setIsGenerating(true);

      const doc = new jsPDF({
        orientation: orientation.toLowerCase() as 'portrait' | 'landscape',
        unit: 'mm',
        format: pageSize.toLowerCase() as 'a4' | 'letter' | 'legal' | 'a3'
      });

      const marginVal = parseInt(margins, 10) || 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - marginVal * 2;

      // Header Brand Stamp
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('ACADEMIC HUB — CONVERT TEXT TO PDF ONLINE', marginVal, marginVal / 2 + 5);

      doc.setDrawColor(226, 232, 240);
      doc.line(marginVal, marginVal / 2 + 7, pageWidth - marginVal, marginVal / 2 + 7);

      // Body text configuration
      let fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
      if (isBold && isItalic) fontStyle = 'bolditalic';
      else if (isBold) fontStyle = 'bold';
      else if (isItalic) fontStyle = 'italic';

      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(12);

      // Parse hex color
      const hexToRgb = (hex: string) => {
        const clean = hex.replace('#', '');
        const bigint = parseInt(clean, 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255
        };
      };
      const rgb = hexToRgb(fontColor);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);

      // Split text to fit width
      const lines = doc.splitTextToSize(content, contentWidth);

      let currentY = marginVal + 12;
      const lineHeight = 6.5;

      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - marginVal) {
          doc.addPage();
          currentY = marginVal;
        }

        const line = lines[i];
        let textX = marginVal;
        let alignOption: 'left' | 'center' | 'right' = 'left';

        if (textAlign === 'center') {
          textX = pageWidth / 2;
          alignOption = 'center';
        } else if (textAlign === 'right' || textDirection === 'RTL') {
          textX = pageWidth - marginVal;
          alignOption = 'right';
        }

        doc.text(line, textX, currentY, { align: alignOption });
        currentY += lineHeight;
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${p} of ${totalPages} • Generated via Academic Hub Text-to-PDF Engine`,
          pageWidth / 2,
          pageHeight - 8,
          { align: 'center' }
        );
      }

      // Trigger automatic direct download
      doc.save(`academic-converted-doc-${Date.now()}.pdf`);

      if (onShowToast) {
        onShowToast('✓ PDF generated and downloaded successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('Failed to create PDF. Please verify your content.', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section 
      id="convert-text-to-pdf-online-workspace" 
      className="w-full max-w-6xl mx-auto my-12 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in select-text"
    >
      {/* ========================================================= */}
      {/* MAIN TYPOGRAPHY & PROXIMITY FLUID HEADLINE                */}
      {/* ========================================================= */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
          Convert{' '}
          {/* Interactive Proximity-based Fluid Dispersion Title String ("Text to PDF ") */}
          <span className="relative inline-block text-sky-600 dark:text-sky-400 font-serif px-1 py-0.5 rounded-lg bg-sky-50/50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/60 shadow-2xs">
            <ProximityFluidText 
              text="Text to PDF "
              radius={100}
              maxDisplacement={38}
              maxBlur={7.5}
              charClassName="transition-colors hover:text-sky-500"
            />
          </span>{' '}
          Online
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
          Type or paste your text, format it in the online editor, and create a downloadable, searchable PDF in seconds.
        </p>

        {/* Top Feature Badges Row (4 Small Rounded Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            <span>No signup required</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            <span>Unicode and RTL controls</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            <span>Searchable PDF export</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
            <span>High-speed instant rendering</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3D GLASS CONTAINER WRAPPER                                */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-[1.5px] border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden space-y-0">
        
        {/* ======================================================= */}
        {/* DOCUMENT CONFIGURATION TOOLBAR GRID                     */}
        {/* ======================================================= */}
        <div 
          id="pdf-document-config-toolbar"
          className="p-4 sm:p-5 bg-slate-50/90 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end"
        >
          {/* Dropdown 1: Page Size */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 block">
              📄 PAGE SIZE
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="A4">A4 (Standard 210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
              <option value="Legal">Legal (8.5 × 14 in)</option>
              <option value="A3">A3 (297 × 420 mm)</option>
            </select>
          </div>

          {/* Dropdown 2: Orientation */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 block">
              🧭 ORIENTATION
            </label>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setOrientation('Portrait')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  orientation === 'Portrait'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('Landscape')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  orientation === 'Landscape'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Dropdown 3: Margins */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 block">
              ↔ MARGINS
            </label>
            <select
              value={margins}
              onChange={(e) => setMargins(e.target.value as PageMargin)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="10 mm">10 mm (Compact)</option>
              <option value="20 mm">20 mm (Standard Balanced)</option>
              <option value="25 mm">25 mm (Wide Editorial)</option>
              <option value="30 mm">30 mm (Spacious)</option>
            </select>
          </div>

          {/* Toggle Group 4: Text Direction */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 block">
              ¶ TEXT DIRECTION
            </label>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setTextDirection('LTR');
                  setTextAlign('left');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  textDirection === 'LTR'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                LTR
              </button>
              <button
                type="button"
                onClick={() => {
                  setTextDirection('RTL');
                  setTextAlign('right');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  textDirection === 'RTL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                RTL
              </button>
            </div>
          </div>

          {/* Dropdown 5 & Load Sample: Test Content Template Ingestion */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 block">
              🪄 TEST CONTENT
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateLang)}
                className="flex-1 px-2.5 py-2 rounded-xl bg-white dark:bg-zinc-850 border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer truncate"
              >
                <option value="English sample">English sample</option>
                <option value="Arabic text to PDF">Arabic text to PDF</option>
                <option value="Urdu text to PDF">Urdu text to PDF</option>
                <option value="Hindi text to PDF">Hindi text to PDF</option>
              </select>
              <button
                type="button"
                id="btn-load-sample-content"
                onClick={handleLoadSample}
                className="px-3 py-2 rounded-xl border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0 active:scale-95"
              >
                Load sample
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* RICH TEXT EDITING CANVAS AREA                           */}
        {/* ======================================================= */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Formatted Editor Header (Typography Adjustments Bar) */}
          <div 
            id="formatted-editor-header-bar"
            className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-100/90 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 shadow-2xs"
          >
            {/* Style Toggles: B, I, U, S */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Bold"
                onClick={() => setIsBold(!isBold)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isBold
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Italic"
                onClick={() => setIsItalic(!isItalic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isItalic
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Underline"
                onClick={() => setIsUnderline(!isUnderline)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isUnderline
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <Underline className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Strikethrough"
                onClick={() => setIsStrikethrough(!isStrikethrough)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isStrikethrough
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

            {/* Font Color Picker */}
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <div className="flex items-center gap-1">
                {[
                  { color: '#1e293b', label: 'Charcoal' },
                  { color: '#1e40af', label: 'Royal Blue' },
                  { color: '#047857', label: 'Forest Green' },
                  { color: '#b91c1c', label: 'Crimson' },
                  { color: '#6b21a8', label: 'Purple' }
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    title={item.label}
                    onClick={() => setFontColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                      fontColor === item.color
                        ? 'scale-125 border-white shadow-xs ring-2 ring-sky-500'
                        : 'border-transparent hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

            {/* Link Inserter */}
            <button
              type="button"
              title="Insert Link"
              onClick={handleInsertLink}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 flex items-center gap-1 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Link</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

            {/* Text Alignment Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Align Left"
                onClick={() => setTextAlign('left')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                  textAlign === 'left'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Align Center"
                onClick={() => setTextAlign('center')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                  textAlign === 'center'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Align Right"
                onClick={() => setTextAlign('right')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                  textAlign === 'right'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Justify"
                onClick={() => setTextAlign('justify')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                  textAlign === 'justify'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700'
                }`}
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

            {/* List Bullets & Clear Formatting */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Unordered List Bullet"
                onClick={() => handleInsertBullet('disc')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Numbered List"
                onClick={() => handleInsertBullet('number')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Clear Formatting"
                onClick={handleClearFormatting}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Input Box (Crisp White Rectangular Writing Block) */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              dir={textDirection.toLowerCase()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing or paste your text here..."
              style={{
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: `${isUnderline ? 'underline ' : ''}${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                color: fontColor,
                textAlign: textAlign
              }}
              rows={14}
              className="w-full p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-base leading-relaxed resize-y min-h-[360px] placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-sans"
            />

            {/* Word & Character Count Counter Badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 text-[11px] font-mono text-slate-600 dark:text-zinc-400 shadow-2xs pointer-events-none">
              {content.trim() ? content.trim().split(/\s+/).length : 0} words • {content.length} chars
            </div>
          </div>

          {/* ======================================================= */}
          {/* BASE EXECUTION BUTTONS                                  */}
          {/* ======================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            
            {/* Primary Action Button: "📄 Create PDF" (Solid High-Contrast Blue) */}
            <button
              type="button"
              id="btn-create-pdf-execute"
              disabled={isGenerating}
              onClick={handleCreatePdf}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-5 h-5 text-white" />
              <span>{isGenerating ? 'Generating PDF...' : '📄 Create PDF'}</span>
            </button>

            {/* Secondary Action Button: "🗑️ Clear All" (Clean White Outline) */}
            <button
              type="button"
              id="btn-clear-all-text-workspace"
              onClick={handleClearAll}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-200 font-bold text-sm border border-slate-300 dark:border-zinc-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>🗑️ Clear All</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
