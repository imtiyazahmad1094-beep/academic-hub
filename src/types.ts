import { Language } from './utils/translations';

export type ProgramMode = 'Online' | 'Offline';

export type ProgramStatus = 'upcoming' | 'approaching' | 'expired';

export type ColorTheme = 'blue' | 'mint' | 'yellow' | 'purple' | 'rose';

export type AppThemePalette = 'emerald' | 'cyber' | 'sunset' | 'oceanic';

export type AppDisplayMode = 'light' | 'dark' | 'midnight';

export type AppNavSection = 
  | 'dashboard'
  | 'quiz-arena'
  | 'dhiu-pyq'
  | 'viva-voce'
  | 'my-works'
  | 'send-receive'
  | 'programs'
  | 'ai-parser'
  | 'notifications'
  | 'analytics'
  | 'settings';

export interface DhiuClassInfo {
  id: number;
  name: string; // e.g., 'Class 1'
  level: string; // e.g., 'Primary', 'Secondary', 'Senior'
  subjectCount: number;
  totalPapers: number;
  description: string;
}

export interface DhiuSemesterInfo {
  id: number;
  name: string; // 'Semester 1' | 'Semester 2'
  termLabel: string; // 'Term 1' | 'Term 2'
  description: string;
  badgeColor: 'emerald' | 'teal';
}

export type DhiuSubjectName =
  | 'Adab'
  | 'Aqeeda'
  | 'English'
  | 'Fiqh'
  | 'Hadith'
  | 'Maths'
  | 'Nahv'
  | 'Science'
  | 'Social Science'
  | 'Swarf'
  | 'Tareekh'
  | 'Tasawwuf'
  | 'Urdu'
  | 'Viva Voce';

export interface DhiuSubjectInfo {
  id: string;
  name: DhiuSubjectName;
  arabicName: string;
  code: string;
  paperCount: number;
  category: 'Shari’ah Sciences' | 'Linguistic Studies' | 'General Academics' | 'Historical Studies' | 'Oral Assessment';
  description: string;
  colorAccent: string;
}

export interface DhiuQuestionItem {
  qNum: number;
  text: string;
  arabicText?: string;
  marks: number;
  options?: string[];
}

export interface DhiuQuestionSection {
  sectionTitle: string;
  instructions: string;
  marksPerQuestion: number;
  items: DhiuQuestionItem[];
}

export interface DhiuQuestionPaper {
  id: string;
  classId: number;
  semesterId: number;
  subject: DhiuSubjectName | string;
  year: number;
  examType: 'Annual' | 'Half-Yearly' | 'Model / Pre-Board' | 'Viva Voce' | 'Oral Assessment' | string;
  section: string;
  fileSize: string;
  maxMarks: number;
  duration: string;
  verified: boolean;
  isViva?: boolean;
  downloadUrl?: string;
  questions?: DhiuQuestionSection[];
}

export type WorkLifecycleStatus = 'Selected' | 'Done' | 'Pending' | 'Postponed';

export interface UserWorkItem {
  id: string;
  type: 'program' | 'abstract' | 'task';
  programId?: string;
  abstractId?: string;
  title: string;
  category?: 'Islamic Topics' | 'Simple Topics' | string;
  date?: string;
  dayOfWeek?: string;
  time?: string;
  location?: string;
  mode?: ProgramMode;
  status: WorkLifecycleStatus;
  userNotes?: string;
  notes?: string;
  updatedAt: string;
  speaker?: string;
  wordCount?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Scholar' | 'Program Chair' | 'Reviewer' | 'Author' | 'Super Admin';
  institution: string;
  avatarUrl?: string;
  createdAt: string;
  permissionTier?: string;
  isAdmin?: boolean;
}

export interface AdminUserLog {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Program Chair' | 'Senior Scholar' | 'Peer Reviewer' | 'Guest Author' | 'Super Admin';
  permissionTier: 'Super Admin Tier 1' | 'Senior Editorial Tier 2' | 'Reviewer Tier 3' | 'Author Tier 4';
  activeAbstractsCount: number;
  assignedReviewsCount: number;
  status: 'Active' | 'Pending Verification' | 'Suspended' | 'Restricted';
  lastLogin: string;
  registrationDate: string;
  ipAddress: string;
  deviceSession: string;
  storageQuotaUsed: string;
  analyticalEventsCount: number;
}

export interface AcademicProgram {
  id: string;
  name: string;
  date: string; // ISO format: YYYY-MM-DD
  dayOfWeek: string;
  time?: string;
  submissionDeadline?: string;
  formatType?: string; // 'Webinar' | 'Workshop' | 'Symposium' | 'Conference' | 'Colloquium'
  mode: ProgramMode;
  location: string;
  themes: string[];
  category?: string;
  abstract: string;
  maxAbstractWords?: number;
  extractedSummary: string[];
  finalNotes: string;
  organizerOrChair?: string;
  registrationUrl?: string;
  documentSource?: string;
  createdAt: string;
  colorTheme: ColorTheme;
}

export interface AcademicAbstract {
  id: string;
  programId?: string;
  programName?: string;
  title: string;
  primaryAuthor: string;
  authors?: string[];
  coAuthors: string[];
  institution: string;
  topicTrack: string;
  thematicCategory?: 'Islamic Topics' | 'Simple Topics';
  mode?: 'Online' | 'Offline' | 'Hybrid';
  format?: 'Oral Presentation' | 'Poster Session' | 'Keynote Paper' | 'Symposium Lecture' | 'Colloquium Paper';
  lifecycleStatus?: 'Working' | 'Done';
  abstractText: string;
  wordCount: number;
  maxWords: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Revision Requested';
  submittedDate: string;
  submissionDate?: string;
  assignedReviewers: string[];
  reviewerScore?: number;
  keywords: string[];
}

export interface AcademicNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'review' | 'system' | 'acceptance';
  date: string;
  read: boolean;
  programId?: string;
  priority: 'high' | 'normal';
}

export interface AcademicPerson {
  id: string;
  name: string;
  email: string;
  role: 'Author' | 'Reviewer' | 'Program Chair';
  institution: string;
  hIndex: number;
  assignedReviewsCount: number;
  expertise: string[];
  avatarColor: string;
}

export interface FeedbackEntry {
  id: string;
  category: 'UI / UX Design' | 'Feature Request' | 'Bug Report' | 'General Improvement';
  rating: number; // 1 to 5 stars
  message: string;
  createdAt: string;
  timestamp?: string;
  userName?: string;
  userEmail?: string;
}

export interface ParsedDocumentData {
  programName: string;
  date: string;
  dayOfWeek: string;
  time: string;
  mode: ProgramMode;
  location: string;
  themes: string[];
  abstract: string;
  extractedSummary: string[];
  finalNotes: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'image';
}

// ==========================================
// QUIZ SUITE & MULTIPLAYER LOBBY DATA TYPES
// ==========================================

export type QuizCategory = 
  | 'Start'
  | 'Art & Literature'
  | 'Entertainment'
  | 'Geography'
  | 'History'
  | 'Languages'
  | 'Science & Nature'
  | 'Sports'
  | 'Trivia'
  | 'Islamic Studies'
  | 'Academic Defense';

export interface QuizQuestion {
  id: string;
  question: string;
  category?: string;
  mediaType: 'audio' | 'video' | 'waveform' | 'none';
  mediaUrl?: string;
  mediaTitle?: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  options?: string[];
  timeLimitSec: number;
  points: number;
  explanation?: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  category: QuizCategory;
  author: string;
  rating: number;
  playsCount: number;
  questionsCount: number;
  isAiGenerated?: boolean;
  pinCode: string;
  questions: QuizQuestion[];
  createdAt: string;
  tags?: string[];
}

export interface LobbyPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  joinedAt: string;
  isHost?: boolean;
  selected?: boolean;
  status: 'Ready' | 'Answering' | 'Completed';
  lastAnswer?: string;
}

export interface LobbySettings {
  soundMusic: number;
  soundYoutube: number;
  soundVoice: number;
  soundEffects: number;
  teamMode: boolean;
  hideLeaderboard: boolean;
  muteSound: boolean;
  onlySafePlayerNames: boolean;
  hideIncorrectTypeAnswers: boolean;
  dontReadOutPlayerNames: boolean;
  banKickedPlayers: boolean;
}

