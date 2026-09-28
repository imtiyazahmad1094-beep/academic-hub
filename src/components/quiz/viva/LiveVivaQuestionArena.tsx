import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward, 
  Settings, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { VivaDomain } from './VivaCategorySelection';
import { soundFX } from '../../../utils/audioUtils';
import { VivaQuestionArea } from './VivaQuestionArea';

export { VivaQuestionArea } from './VivaQuestionArea';

export interface VivaQuestionItem {
  id: string;
  slideNum: number;
  question: string;
  context: string;
  difficulty: 'Graduate' | 'Doctoral' | 'Advanced';
  timeLimitSec: number;
  expectedPoints: string[];
  sources: string[];
  exemplarAnswer: string;
}

const SAMPLE_VIVA_QUESTIONS: VivaQuestionItem[] = [
  {
    id: 'vq-1',
    slideNum: 1,
    question: 'What were the major administrative reforms introduced during the Ottoman Tanzimat period?',
    context: 'Focus on the Gülhane Edict (1839), legal reorganizations, fiscal centralizations, and imperial bureaucratic structures.',
    difficulty: 'Graduate',
    timeLimitSec: 60,
    expectedPoints: [
      'Gülhane Imperial Rescript (Hatt-i Sharif) guaranteeing rights to life, honor, and property regardless of religion',
      'Establishment of the Council of Judicial Ordinances (Meclis-i Vâlâ-yi Ahkâm-i Adliye)',
      'Abolition of tax farming (iltizam) in favor of direct state tax collection',
      'The drafting of the Mecelle-i Ahkâm-i Adliye codified civil law based on Hanafi jurisprudence'
    ],
    sources: [
      'Inalcik, H. — The Ottoman Empire: The Classical Age',
      'Cleveland & Bunton — A History of the Modern Middle East'
    ],
    exemplarAnswer: 'The Tanzimat reforms (1839–1876) centralized imperial governance by secularizing and modernizing bureaucracy, establishing formal civil courts, and guaranteeing universal legal protections under the Gülhane and Islahat Edicts.'
  },
  {
    id: 'vq-2',
    slideNum: 2,
    question: 'How did the abolition of the Janissaries in 1826 impact Sultan Mahmud II’s subsequent institutional reforms?',
    context: 'Analyze the Vaka-i Hayriye (Auspicious Incident) and the resulting formation of the Asakir-i Mansure-i Muhammediye.',
    difficulty: 'Doctoral',
    timeLimitSec: 60,
    expectedPoints: [
      'Elimination of the entrenched military veto against westernizing administrative reforms',
      'Formation of a modern disciplined army (Mansure Army) trained in European tactics',
      'Confiscation of Bektashi sufi order assets linked to Janissary guilds',
      'Clearance for fiscal reform and the establishment of modern ministries (Nezarets)'
    ],
    sources: [
      'Finkel, C. — Osman’s Dream: The History of the Ottoman Empire',
      'Lewis, B. — The Emergence of Modern Turkey'
    ],
    exemplarAnswer: 'The Auspicious Incident permanently severed military insubordination, empowering Mahmud II to establish European-modeled ministries, postal systems, and census surveys without violent conservative resistance.'
  },
  {
    id: 'vq-3',
    slideNum: 3,
    question: 'Evaluate the role of the Young Ottomans in synthesizing Islamic constitutionalism with European constitutional theory.',
    context: 'Examine Namik Kemal, Ziya Pasha, and the drafting of the Kanun-i Esasi of 1876.',
    difficulty: 'Advanced',
    timeLimitSec: 60,
    expectedPoints: [
      'Argued that parliamentary consultation is rooted in the Quranic concept of Shura',
      'Critiqued excessive bureaucratic despotism of Tanzimat viziers (Ali and Fuad Pashas)',
      'Synthesis of natural rights and patriotism (Vatan) with classical Islamic political ethics',
      'Direct ideological precursor to the 1876 Ottoman Constitution under Midhat Pasha'
    ],
    sources: [
      'Mardin, Serif — The Genesis of Young Ottoman Thought',
      'Berkes, Niyazi — The Development of Secularism in Turkey'
    ],
    exemplarAnswer: 'The Young Ottomans harmonized Western constitutionalism with Islamic jurisprudence by framing parliamentary oversight as institutionalized Shura (consultation), preventing executive tyranny while maintaining Islamic legitimacy.'
  },
  {
    id: 'vq-4',
    slideNum: 4,
    question: 'Analyze the significance of the Mecelle-i Ahkâm-i Adliye in Islamic legal history and statutory codification.',
    context: 'Evaluate Ahmet Cevdet Pasha’s commission between 1869 and 1876 and the systematization of Hanafi commercial jurisprudence.',
    difficulty: 'Doctoral',
    timeLimitSec: 60,
    expectedPoints: [
      'First comprehensive state codification of Islamic civil obligations (Muamalat)',
      'Incorporation of 99 fundamental legal maxims (Qawaid Fiqhiyya) as introductory articles',
      'Creation of uniform judicial standards across imperial Nizamiye courts',
      'Precedent for modern Arab and Middle Eastern civil codes in the 20th century'
    ],
    sources: [
      'Liebesny, Herbert — The Law of the Near & Middle East',
      'Schacht, Joseph — An Introduction to Islamic Law'
    ],
    exemplarAnswer: 'The Mecelle transformed classical fiqh manuals into a modern, standardized civil code, preserving Hanafi jurisprudential sovereignty while equipping secular courts with binding, numbered statutory articles.'
  },
  {
    id: 'vq-5',
    slideNum: 5,
    question: 'How did the establishment of the Evkaf-i Hümayun Nezareti restructure the fiscal autonomy of pious endowments?',
    context: 'Investigate the centralization of Waqf revenues and the shifting financial authority between the Ulema and the imperial treasury.',
    difficulty: 'Advanced',
    timeLimitSec: 60,
    expectedPoints: [
      'Centralization of diverse charitable trusts under a single state ministry',
      'Diversion of endowment surplus into military and bureaucratic state budgets',
      'Erosion of the judicial and economic independence of traditional religious scholars',
      'Conversion of autonomous rural waqf estates into tax-assessable lands'
    ],
    sources: [
      'Barnes, John Robert — An Introduction to Religious Foundations in the Ottoman Empire',
      'Kuran, Timur — The Long Divergence'
    ],
    exemplarAnswer: 'By subordinating religious endowments to a ministerial cabinet, the Ottoman state dismantled the financial independence of religious institutions, converting immense pious revenues into direct imperial fiscal instruments.'
  },
  {
    id: 'vq-6',
    slideNum: 6,
    question: 'Examine the jurisdictional tensions between Sharia courts and newly introduced Nizamiye secular tribunals.',
    context: 'Examine procedural law, witness testimony standards, and mixed commercial courts dealing with European capitulatory privileges.',
    difficulty: 'Graduate',
    timeLimitSec: 60,
    expectedPoints: [
      'Relegation of Sharia courts primarily to family, marriage, and inheritance disputes',
      'Introduction of secular penal and commercial codes inspired by French models',
      'Admissibility of non-Muslim testimony on equal standing in Nizamiye tribunals',
      'Bifurcation of judicial training between traditional madrasas and modern law schools'
    ],
    sources: [
      'Findley, Carter V. — Bureaucratic Reform in the Ottoman Empire',
      'Hallaq, Wael — Shari’a: Theory, Practice, Transformations'
    ],
    exemplarAnswer: 'The jurisdictional dualism created parallel courts: traditional Sharia courts retained personal status law, whereas Nizamiye tribunals governed commerce and crime using secular statutory codes and universal witness standards.'
  },
  {
    id: 'vq-7',
    slideNum: 7,
    question: 'Critique the executive balance of power under the Kanun-i Esasi (Ottoman Constitution of 1876).',
    context: 'Analyze Midhat Pasha’s constitutional commission, parliamentary powers, and Sultan Abdulhamid II’s royal prerogatives under Article 113.',
    difficulty: 'Doctoral',
    timeLimitSec: 60,
    expectedPoints: [
      'Creation of a bicameral parliament (Meclis-i Mebusan and Meclis-i Ayan)',
      'Retention of supreme sovereign authority and cabinet appointment power by the Sultan',
      'Controversial Article 113 permitting the monarch to exile individuals deemed subversive without trial',
      'Pioneering parliamentary representation spanning Christian, Jewish, and Muslim provinces'
    ],
    sources: [
      'Devereux, Robert — The First Ottoman Constitutional Period',
      'Shaw & Shaw — History of the Ottoman Empire and Modern Turkey'
    ],
    exemplarAnswer: 'While the 1876 Constitution created the empire’s first representative parliament, executive sovereignty remained concentrated in the Sultan, whose Article 113 exile powers allowed Abdulhamid II to prorogue parliament in 1878.'
  },
  {
    id: 'vq-8',
    slideNum: 8,
    question: 'How did the founding of the Mekteb-i Mülkiye (1859) transform imperial statecraft and civil bureaucracy?',
    context: 'Contrast traditional scribal apprenticeship (Kalemiye) with modern professional higher education in political economy and diplomacy.',
    difficulty: 'Graduate',
    timeLimitSec: 60,
    expectedPoints: [
      'Shift from patrimonial scribal patronage to standardized civil service examinations',
      'Curricular focus on international law, statistics, modern languages, and administrative science',
      'Incubation of a westernized administrative intelligentsia that led later reform movements',
      'Integration of provincial elites into the centralized Istanbul governmental apparatus'
    ],
    sources: [
      'Szyliowicz, Joseph S. — Education and Modernization in the Middle East',
      'Findley, Carter V. — Ottoman Civil Officialdom: A Social History'
    ],
    exemplarAnswer: 'The Mekteb-i Mülkiye ended hereditary scribal guilds, forging a professional civil service corps trained in European administrative sciences and economics that drove late-Ottoman statecraft.'
  },
  {
    id: 'vq-9',
    slideNum: 9,
    question: 'Assess the sovereign and economic consequences of the Decree of Muharrem (1881) and the Duyun-u Umumiye.',
    context: 'Examine the Ottoman sovereign bankruptcy of 1875 and the surrender of salt, tobacco, and silk tax revenues to foreign bondholders.',
    difficulty: 'Doctoral',
    timeLimitSec: 60,
    expectedPoints: [
      'Establishment of the Public Debt Administration managed by representatives of European creditor nations',
      'Direct collection of key state monopolies (salt, silk, stamps, spirits, fisheries) outside treasury control',
      'Restoration of Ottoman international creditworthiness enabling railway concessions',
      'De facto infringement upon imperial fiscal sovereignty through autonomous foreign oversight'
    ],
    sources: [
      'Blaisdell, Donald — European Financial Control in the Ottoman Empire',
      'Pamuk, Sevket — A Monetary History of the Ottoman Empire'
    ],
    exemplarAnswer: 'The Decree of Muharrem surrendered sovereign taxation over primary revenue monopolies to foreign bondholders, creating a quasi-independent economic administration that recovered creditworthiness at the cost of fiscal independence.'
  },
  {
    id: 'vq-10',
    slideNum: 10,
    question: 'Synthesize how Sultan Abdulhamid II combined Islamic Caliphal legitimacy with modern technological infrastructure.',
    context: 'Analyze the strategic development of the Hejaz Railway, extensive telegraph networks, and Pan-Islamic diplomatic missions.',
    difficulty: 'Advanced',
    timeLimitSec: 60,
    expectedPoints: [
      'Construction of the Hejaz Railway financed exclusively through worldwide Muslim charitable contributions',
      'Expansion of 30,000 km of telegraph wire connecting Istanbul directly to distant Arab provinces',
      'Deployment of imperial religious emblems (Sultan-Caliph) to counter European imperialist encroachments',
      'Dual strategy of modern technological centralization combined with conservative ideological legitimacy'
    ],
    sources: [
      'Deringil, Selim — The Well-Protected Domains: Ideology and the Legitimation of Power in the Ottoman Empire',
      'Ochsenwald, William — The Hijaz Railroad'
    ],
    exemplarAnswer: 'Abdulhamid II weaponized modern technology—specifically telegraphy and the Hejaz Railway—to project centralized imperial authority, while legitimizing autocratic rule across global Muslim populations through the institution of the Caliphate.'
  }
];

interface LiveVivaQuestionArenaProps {
  domain: VivaDomain;
  roomPin?: string;
  onExitArena: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LiveVivaQuestionArena: React.FC<LiveVivaQuestionArenaProps> = ({
  domain,
  roomPin = '941 985',
  onExitArena,
  onShowToast
}) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;
  const [completedSlides, setCompletedSlides] = useState<number[]>([]);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Active question from the full 10-slide curriculum
  const activeQuestion = SAMPLE_VIVA_QUESTIONS[(currentSlide - 1) % SAMPLE_VIVA_QUESTIONS.length];

  // AI Viva Evaluation Metrics
  const [evalScores, setEvalScores] = useState({
    knowledge: 94,
    accuracy: 92,
    relevance: 96,
    structure: 88,
    evidence: 85,
    confidence: 90
  });

  // Timer Countdown
  useEffect(() => {
    if (isPaused || hasEvaluated || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, hasEvaluated, timeLeft]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMicToggle = () => {
    if (!isRecordingMic) {
      setIsRecordingMic(true);
      soundFX.playTick(0.2);
      onShowToast('Oral dictation recording enabled. Speak your defense...', 'info');
      // Simulate dictation speech-to-text
      setTimeout(() => {
        setTypedAnswer(prev => 
          prev 
            ? `${prev} Furthermore, the Tanzimat introduced the Gülhane Edict of 1839 which reformed taxation and military conscription.` 
            : 'The major reforms introduced during the Ottoman Tanzimat period included the Gülhane Rescript of 1839, the abolishment of tax farming (iltizam), and modern civil courts.'
        );
      }, 1500);
    } else {
      setIsRecordingMic(false);
      soundFX.playTick(0.2);
      onShowToast('Dictation paused.', 'info');
    }
  };

  const handleSubmitAnswer = () => {
    if (!typedAnswer.trim()) {
      onShowToast('Please provide an oral defense response before submitting.', 'info');
      return;
    }

    setEvaluating(true);
    soundFX.playTick(0.25);
    onShowToast('AI is evaluating your oral defense against scholarly rubrics...', 'info');

    setTimeout(() => {
      setEvaluating(false);
      setHasEvaluated(true);
      setCompletedSlides(prev => prev.includes(currentSlide) ? prev : [...prev, currentSlide]);
      soundFX.playSuccess(0.4);
      onShowToast('Evaluation completed! Check rubrics & expected key points below.', 'success');
    }, 1800);
  };

  const handleNextSlide = () => {
    soundFX.playTick(0.2);
    setHasEvaluated(false);
    setTypedAnswer('');
    setTimeLeft(60);
    setCurrentSlide(prev => (prev < totalSlides ? prev + 1 : 1));
  };

  return (
    <div id="live-viva-question-arena" className="space-y-6 animate-fade-in w-full max-w-6xl mx-auto pb-12">
      
      {/* ======================================================== */}
      {/* TOP BAR (SECTION 20)                                     */}
      {/* ======================================================== */}
      {/* Top bar: Academic Hub | Viva — History | PIN: 941 985 | Player: 01 | Slide 1 / 10 | Pause | Next | Settings | Fullscreen */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/95 border-t-2 border-white/40 border-b-4 border-black text-white shadow-2xl backdrop-blur-xl">
        
        {/* Left: Identity & PIN */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitArena}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm text-white tracking-tight">
              Academic Hub
            </span>
            <span className="text-slate-500">•</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
              Viva — {domain.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
              PIN: {roomPin}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              Player: 01
            </span>
          </div>
        </div>

        {/* Right: Slide Controls & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-200 border border-slate-700">
            Slide {currentSlide} / {totalSlides}
          </div>

          {/* Pause */}
          <button
            type="button"
            onClick={() => setIsPaused(prev => !prev)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-all"
            title={isPaused ? 'Resume timer' : 'Pause timer'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNextSlide}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs border-t border-white/30 border-b-2 border-purple-950 flex items-center gap-1 cursor-pointer transition-all shadow-md"
          >
            <span>Next</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => onShowToast('Oral Defense Assessment Engine v3.4 Active', 'info')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* VIVA QUESTION AREA (SECTION 21)                          */}
      {/* ======================================================== */}
      <VivaQuestionArea
        question={activeQuestion}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        completedSlides={completedSlides}
        timeLeft={timeLeft}
        typedAnswer={typedAnswer}
        onTypedAnswerChange={setTypedAnswer}
        isRecordingMic={isRecordingMic}
        onToggleMic={handleMicToggle}
        onSubmitAnswer={handleSubmitAnswer}
        evaluating={evaluating}
        hasEvaluated={hasEvaluated}
        domainName={domain.name}
        onShowToast={onShowToast}
        onSelectSlide={(targetSlide) => {
          soundFX.playTick(0.15);
          setHasEvaluated(false);
          setTypedAnswer('');
          setTimeLeft(60);
          setCurrentSlide(targetSlide);
        }}
      />

      {/* ======================================================== */}
      {/* AI VIVA EVALUATION (SECTION 22)                          */}
      {/* ======================================================== */}
      {hasEvaluated && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-t-2 border-white/30 border-b-4 border-black text-white shadow-2xl space-y-6 animate-fade-in">
          
          {/* Header Strip with Verdict */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Scholarly Verdict
                </span>
                <h3 className="text-xl font-black font-serif text-white">
                  Strong answer — Verified Scholarly Defense
                </h3>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-black">
              Overall Score: 91 / 100
            </div>
          </div>

          {/* Visual Progress Bars for 6 Dimensions (Section 22) */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-black uppercase text-slate-400 block">
              Multi-Dimensional Defense Assessment:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Knowledge */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Knowledge Depth</span>
                  <span className="text-purple-400 font-bold">{evalScores.knowledge}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${evalScores.knowledge}%` }} />
                </div>
              </div>

              {/* Accuracy */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Historical Accuracy</span>
                  <span className="text-emerald-400 font-bold">{evalScores.accuracy}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evalScores.accuracy}%` }} />
                </div>
              </div>

              {/* Relevance */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Inquiry Relevance</span>
                  <span className="text-sky-400 font-bold">{evalScores.relevance}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${evalScores.relevance}%` }} />
                </div>
              </div>

              {/* Structure */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Logical Structure</span>
                  <span className="text-amber-400 font-bold">{evalScores.structure}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evalScores.structure}%` }} />
                </div>
              </div>

              {/* Evidence */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Textual Evidence</span>
                  <span className="text-rose-400 font-bold">{evalScores.evidence}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${evalScores.evidence}%` }} />
                </div>
              </div>

              {/* Confidence */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Oral Confidence</span>
                  <span className="text-teal-400 font-bold">{evalScores.confidence}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${evalScores.confidence}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Expected Key Points & Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Expected Key Points */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <span className="text-xs font-mono font-black uppercase text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expected Key Points</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {activeQuestion.expectedPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono font-bold shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sources & Recommendations to Improve */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-black uppercase text-sky-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Referenced Citations</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300 font-mono italic">
                  {activeQuestion.sources.map((src, idx) => (
                    <li key={idx}>• {src}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-teal-400">
                  💡 How to improve your answer:
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  Elaborate on the opposition from provincial ayans (local notables) to further demonstrate doctoral mastery of imperial tensions.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Slide Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setHasEvaluated(false);
                setTypedAnswer('');
              }}
              className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Oral Defense Response</span>
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs border-t border-white/30 border-b-2 border-purple-950 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Advance to Slide {currentSlide < totalSlides ? currentSlide + 1 : 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
