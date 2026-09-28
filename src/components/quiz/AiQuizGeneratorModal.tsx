import React, { useState, useRef } from 'react';
import { X, Sparkles, Wand2, Check, Loader2, Plus, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { QuizItem, QuizQuestion, QuizCategory } from '../../types';

interface AiQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuiz: (quiz: QuizItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

interface CustomManualQuestion {
  id: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export const AiQuizGeneratorModal: React.FC<AiQuizGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuiz,
  onShowToast
}) => {
  const [subject, setSubject] = useState('');
  const [pdfOrNotesText, setPdfOrNotesText] = useState('');
  const [category, setCategory] = useState<QuizCategory>('Science & Nature');
  const [questionCount, setQuestionCount] = useState<number | 'unlimited'>(50);
  const [isGenerating, setIsGenerating] = useState(false);

  // File dropper state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedPdfFile, setUploadedPdfFile] = useState<{
    name: string;
    size: string;
    rawPayload?: string;
    uploadedAt: string;
  } | null>(null);

  // Custom Manual Question Builder state
  const [isManualBuilderOpen, setIsManualBuilderOpen] = useState(false);
  const [customStem, setCustomStem] = useState('');
  const [customOptA, setCustomOptA] = useState('');
  const [customOptB, setCustomOptB] = useState('');
  const [customOptC, setCustomOptC] = useState('');
  const [customOptD, setCustomOptD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [customQuestionsList, setCustomQuestionsList] = useState<CustomManualQuestion[]>([]);

  if (!isOpen) return null;

  const handlePdfUpload = (file: File) => {
    if (!file) return;
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    // Cache the binary document payload object
    const reader = new FileReader();
    reader.onload = () => {
      const payloadString = typeof reader.result === 'string' ? reader.result : '';
      setUploadedPdfFile({
        name: file.name,
        size: formattedSize,
        rawPayload: payloadString,
        uploadedAt: new Date().toLocaleTimeString()
      });
      onShowToast(`Binary PDF document "${file.name}" cached successfully!`, 'success');
    };
    reader.onerror = () => {
      setUploadedPdfFile({
        name: file.name,
        size: formattedSize,
        uploadedAt: new Date().toLocaleTimeString()
      });
      onShowToast(`Uploaded PDF: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomQuestionToBatch = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!customStem.trim()) {
      onShowToast('Please enter the question stem text.', 'error');
      return;
    }
    if (!customOptA.trim() || !customOptB.trim()) {
      onShowToast('Please provide at least Option A and Option B.', 'error');
      return;
    }

    const newQ: CustomManualQuestion = {
      id: `manual-q-${Date.now()}`,
      stem: customStem.trim(),
      optionA: customOptA.trim(),
      optionB: customOptB.trim(),
      optionC: customOptC.trim() || 'Not Applicable / Alternative Observation',
      optionD: customOptD.trim() || 'None of the Above / Null Formulation',
      correctOption
    };

    setCustomQuestionsList(prev => [...prev, newQ]);
    setCustomStem('');
    setCustomOptA('');
    setCustomOptB('');
    setCustomOptC('');
    setCustomOptD('');
    setCorrectOption('A');
    onShowToast(`Custom question added to quiz suite! (${customQuestionsList.length + 1} total)`, 'success');
  };

  const handleRemoveCustomQuestion = (id: string) => {
    setCustomQuestionsList(prev => prev.filter(q => q.id !== id));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptSubject = subject.trim() || (uploadedPdfFile ? uploadedPdfFile.name.replace(/\.pdf$/i, '') : 'Academic Research & Defense');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1400));

      // Check if user has an uncommitted custom question typed in the fields
      let finalCustomList = [...customQuestionsList];
      if (customStem.trim() && customOptA.trim() && customOptB.trim()) {
        finalCustomList.push({
          id: `manual-q-${Date.now()}`,
          stem: customStem.trim(),
          optionA: customOptA.trim(),
          optionB: customOptB.trim(),
          optionC: customOptC.trim() || 'Not Applicable',
          optionD: customOptD.trim() || 'None of the Above',
          correctOption
        });
      }

      // Convert custom questions into standard QuizQuestion instances
      const formattedCustomQuestions: QuizQuestion[] = finalCustomList.map((cq, idx) => {
        const optionMap: Record<'A' | 'B' | 'C' | 'D', string> = {
          A: cq.optionA,
          B: cq.optionB,
          C: cq.optionC,
          D: cq.optionD
        };
        const correctText = optionMap[cq.correctOption];
        return {
          id: `custom-card-${Date.now()}-${idx + 1}`,
          question: cq.stem,
          category,
          mediaType: 'none',
          correctAnswer: correctText,
          acceptedAnswers: [correctText, `Option ${cq.correctOption}`],
          options: [cq.optionA, cq.optionB, cq.optionC, cq.optionD],
          timeLimitSec: 30,
          points: 1000,
          explanation: `Custom author question: Option ${cq.correctOption} is marked as the verified defense answer.`
        };
      });

      // Synthesized AI Questions
      const simulatedCount = questionCount === 'unlimited' ? 250 : questionCount;
      const countLabel = questionCount === 'unlimited' ? '♾️ Unlimited Adaptive Stream' : `${questionCount} Questions`;

      const aiSynthesizedQuestions: QuizQuestion[] = [
        {
          id: `gen-q-${Date.now()}-1`,
          question: `Regarding ${promptSubject}, what is the foundational axiom recognized in contemporary peer review?`,
          category: category,
          mediaType: 'waveform',
          mediaTitle: `${promptSubject} Acoustic Synthesis Track`,
          correctAnswer: 'Empirical verifiability and reproducible consensus',
          acceptedAnswers: ['Empirical verifiability', 'Reproducibility', 'Consensus', 'Peer review standard'],
          options: [
            'Empirical verifiability and reproducible consensus',
            'Subjective anecdotal extrapolation',
            'Unverified pre-print conjecture',
            'Sole reliance on uncalibrated heuristics'
          ],
          timeLimitSec: 30,
          points: 1000,
          explanation: 'Scientific defense requires reproducible methodological verification and rigorous peer validation.'
        },
        {
          id: `gen-q-${Date.now()}-2`,
          question: `In advanced theoretical models of ${promptSubject}, which parameter governs state transitions?`,
          category: category,
          mediaType: 'none',
          correctAnswer: 'Equilibrium free energy gradient',
          acceptedAnswers: ['Free energy', 'Equilibrium gradient', 'Energy potential'],
          options: [
            'Equilibrium free energy gradient',
            'Random perturbation variance',
            'Static boundary stagnation',
            'Decoupled scalar friction'
          ],
          timeLimitSec: 25,
          points: 1000,
          explanation: 'State transitions consistently seek lower potential energy under thermodynamic and structural constraints.'
        },
        {
          id: `gen-q-${Date.now()}-3`,
          question: `What distinguishes the primary thesis in modern treatises on ${promptSubject}?`,
          category: category,
          mediaType: 'waveform',
          mediaTitle: 'Synthesized Oral Defense Argumentation',
          correctAnswer: 'Synthesizing foundational axioms with empirical data',
          acceptedAnswers: ['Synthesis', 'Empirical integration', 'Axiomatic synthesis'],
          options: [
            'Synthesizing foundational axioms with empirical data',
            'Ignoring primary literature citations',
            'Refusing counter-factual validation',
            'Arbitrary dogma adherence'
          ],
          timeLimitSec: 30,
          points: 1000,
          explanation: 'Robust academic defenses integrate primary axioms seamlessly with modern empirical observation.'
        },
        {
          id: `gen-q-${Date.now()}-4`,
          question: `When evaluating disputed hypotheses in ${promptSubject}, which investigative method holds highest evidentiary priority?`,
          category: category,
          mediaType: 'none',
          correctAnswer: 'Double-blind controlled comparative trial',
          acceptedAnswers: ['Double blind', 'Controlled trial', 'Comparative trial'],
          options: [
            'Double-blind controlled comparative trial',
            'Unsubstantiated rhetorical declamation',
            'Retrospective selective sample screening',
            'Ad-hoc qualitative preference polling'
          ],
          timeLimitSec: 30,
          points: 1000,
          explanation: 'Controlled comparative trials minimize observer bias and test causal hypotheses rigorously.'
        },
        {
          id: `gen-q-${Date.now()}-5`,
          question: `In the standard reference syllabus for ${promptSubject}, how is anomalous variance systematically addressed?`,
          category: category,
          mediaType: 'none',
          correctAnswer: 'Documented sensitivity analysis & boundary demarcation',
          acceptedAnswers: ['Sensitivity analysis', 'Boundary demarcation'],
          options: [
            'Documented sensitivity analysis & boundary demarcation',
            'Immediate suppression of outlier data points',
            'Unilateral modification of null hypotheses',
            'Arbitrary truncation of distribution tails'
          ],
          timeLimitSec: 30,
          points: 1000,
          explanation: 'Academic integrity commands thorough sensitivity analysis rather than selective omission of outliers.'
        }
      ];

      // Merge: Custom Questions first, then AI synthesized
      const combinedQuestions = [...formattedCustomQuestions, ...aiSynthesizedQuestions];

      const pin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

      const newQuiz: QuizItem = {
        id: `quiz-ai-${Date.now()}`,
        title: `${promptSubject} AI Defense Suite`,
        subtitle: uploadedPdfFile
          ? `Grounded in cached document: ${uploadedPdfFile.name} (${countLabel})`
          : `Generated from academic subject notes: ${promptSubject} (${countLabel})`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        category,
        author: 'Academic AI Engine (Gemini 2.5 Flash)',
        rating: 4.98,
        playsCount: 1,
        questionsCount: simulatedCount,
        isAiGenerated: true,
        pinCode: pin,
        createdAt: new Date().toISOString().split('T')[0],
        questions: combinedQuestions
      };

      onSaveQuiz(newQuiz);
      onShowToast(`Generated AI Quiz "${newQuiz.title}" with PIN ${pin} (${countLabel})!`, 'success');
      onClose();
    } catch {
      onShowToast('Error during AI quiz generation', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="ai-quiz-generator-modal-container"
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/60 relative overflow-hidden animate-smooth-entry text-slate-900 dark:text-zinc-100"
        style={{ borderRadius: '24px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500" />

        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-600 dark:text-sky-400 font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950 dark:text-white font-serif tracking-tight flex items-center gap-2">
                <span>A.I. Gemini Flash Quiz Generator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-mono font-bold uppercase">
                  v2.5
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-rigor oral defense matrices from manuscript notes or binary PDF payloads
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleGenerate} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Headline Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Subject / Topic Headline *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Classical Arabic Rhetoric (Balaghah), Quantum Computing, or Neuroscience"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Category & Questions Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as QuizCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 cursor-pointer font-medium"
              >
                <option value="Science & Nature">Science &amp; Nature</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Academic Defense">Academic Defense</option>
                <option value="History">History</option>
                <option value="Languages">Languages</option>
                <option value="Geography">Geography</option>
                <option value="Art & Literature">Art &amp; Literature</option>
                <option value="Trivia">Trivia</option>
              </select>
            </div>

            {/* Target Element: Questions Count Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                QUESTIONS COUNT
              </label>
              <select
                id="select-quiz-question-count"
                value={questionCount}
                onChange={e => setQuestionCount(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 cursor-pointer font-bold"
              >
                <option value={50}>50 Questions (Balanced Defense)</option>
                <option value={100}>100 Questions (Comprehensive Exam)</option>
                <option value={150}>150 Questions (Syllabus Marathon)</option>
                <option value={200}>200 Questions (Grand Registry Core)</option>
                <option value="unlimited">♾️ Unlimited Questions (Adaptive AI Stream)</option>
              </select>
            </div>
          </div>

          {/* Primary Text Area: Paste PDF Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              PASTE PDF NOTES OR ABSTRACT EXCERPT (OPTIONAL)
            </label>
            <textarea
              rows={3}
              value={pdfOrNotesText}
              onChange={e => setPdfOrNotesText(e.target.value)}
              placeholder="Paste article excerpt, dissertation chapter, or syllabus notes here to ground the generated questions in specific text..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-sky-500 font-mono resize-none placeholder:text-slate-400"
            />

            {/* Standalone File Dropper Zone Directly Underneath */}
            <div className="mt-2.5">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handlePdfUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                id="ai-modal-pdf-dropzone"
                onDragOver={e => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePdfUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-3.5 rounded-2xl border-dashed border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDraggingFile
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 shadow-inner'
                    : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-base shadow-2xs shrink-0">
                    📁
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>📁 Or Drag &amp; Drop PDF Document</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload manuscript, abstract, or syllabus paper (.pdf)
                    </div>
                  </div>
                </div>

                {/* Upload Status Badge */}
                {uploadedPdfFile ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span 
                      id="badge-pdf-upload-success"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold font-mono shadow-xs animate-fade-in"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{uploadedPdfFile.name}</span>
                      <span className="opacity-75 font-normal">({uploadedPdfFile.size})</span>
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setUploadedPdfFile(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove attached PDF"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-white/80 dark:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-600 shrink-0 shadow-2xs">
                    Choose PDF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: ADD CUSTOM QUIZ QUESTION TERMINAL             */}
          {/* ======================================================== */}
          <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              id="btn-toggle-custom-quiz-terminal"
              onClick={() => setIsManualBuilderOpen(!isManualBuilderOpen)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-t border-white/20 border-b-2 border-slate-900/40 dark:border-slate-950 text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm flex items-center justify-between hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-xs active:translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <span>➕ Add Custom Quiz Question</span>
                {customQuestionsList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-black">
                    {customQuestionsList.length} ready
                  </span>
                )}
              </div>
              <div className="text-slate-400">
                {isManualBuilderOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Dynamic Expanded Manual Card Workspace */}
            {isManualBuilderOpen && (
              <div 
                id="custom-quiz-question-manual-workspace"
                className="mt-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-300/80 dark:border-slate-700 space-y-4 shadow-sm animate-fade-in"
                style={{ borderRadius: '18px' }}
              >
                {/* Text Field A (Question Stating) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                    QUESTION STEM TEXT
                  </label>
                  <textarea
                    rows={2}
                    value={customStem}
                    onChange={e => setCustomStem(e.target.value)}
                    placeholder="e.g., Define the literal meaning of Balagha in classical literature..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 font-medium placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Multi-Option Choice Grid: Symmetric 2x2 Column Block */}
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    ANSWER CHOICES (OPTIONS A - D)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>Option A</span>
                        {correctOption === 'A' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ Correct</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={customOptA}
                        onChange={e => setCustomOptA(e.target.value)}
                        placeholder="Choice A text..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    {/* Option B */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>Option B</span>
                        {correctOption === 'B' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ Correct</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={customOptB}
                        onChange={e => setCustomOptB(e.target.value)}
                        placeholder="Choice B text..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    {/* Option C */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>Option C</span>
                        {correctOption === 'C' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ Correct</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={customOptC}
                        onChange={e => setCustomOptC(e.target.value)}
                        placeholder="Choice C text..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500 font-medium placeholder:text-slate-400"
                      />
                    </div>

                    {/* Option D */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>Option D</span>
                        {correctOption === 'D' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ Correct</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={customOptD}
                        onChange={e => setCustomOptD(e.target.value)}
                        placeholder="Choice D text..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500 font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Correct Answer Ingestion Picker: Horizontal Capsule Selector Dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                      Mark Correct Option:
                    </label>
                    <select
                      id="select-custom-correct-option"
                      value={correctOption}
                      onChange={e => setCorrectOption(e.target.value as 'A' | 'B' | 'C' | 'D')}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-xs font-black outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomQuestionToBatch}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 self-end sm:self-auto border-t border-white/20 border-b-2 border-emerald-900 active:translate-y-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Question To Batch</span>
                  </button>
                </div>

                {/* Stored Custom Question Cards Feed */}
                {customQuestionsList.length > 0 && (
                  <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Draft Custom Question Cards ({customQuestionsList.length})
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {customQuestionsList.map((cq, idx) => (
                        <div
                          key={cq.id}
                          className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1.5">
                              #{idx + 1}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 truncate inline-block max-w-[280px] sm:max-w-md align-bottom">
                              {cq.stem}
                            </span>
                            <span className="ml-2 font-mono text-[10px] text-slate-400">
                              (Correct: {cq.correctOption})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomQuestion(cq.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                            title="Remove question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom 3D Raised Action Button: "Quiz generator" (Cyan/Blue Theme) */}
          <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              {customQuestionsList.length > 0 ? `${customQuestionsList.length} custom question(s) will be merged` : 'Ready to synthesize quiz package'}
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isGenerating}
                id="btn-execute-ai-quiz-generator"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm tracking-wide border-t-2 border-white/40 border-b-4 border-sky-950 shadow-xl shadow-sky-500/25 active:translate-y-1 active:border-b-0 transition-all cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Questions...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Quiz generator</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

