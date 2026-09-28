/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingDoodles } from './components/FloatingDoodles';
import { GlowHeader } from './components/GlowHeader';
import { LandingHeroView } from './components/LandingHeroView';
import { MyWorksSection } from './components/MyWorksSection';
import { TopUpcomingSection } from './components/TopUpcomingSection';
import { SmartCalendar } from './components/SmartCalendar';
import { ProgramsListView } from './components/ProgramsListView';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { DocumentParserModal } from './components/DocumentParserModal';
import { ProgramFormModal } from './components/ProgramFormModal';
import { UnauthenticatedSubmitOpportunityModal } from './components/UnauthenticatedSubmitOpportunityModal';
import { PublicBrowseProgramsModal } from './components/PublicBrowseProgramsModal';
import { PersonalScratchpadModal } from './components/PersonalScratchpadModal';
import { SendReceiveMailTerminal } from './components/SendReceiveMailTerminal';
import { AnalyticsSection } from './components/AnalyticsSection';
import { MetricSummaryBoxes } from './components/MetricSummaryBoxes';
import { AuthorsReviewersSection } from './components/AuthorsReviewersSection';
import { NotificationsSection } from './components/NotificationsSection';
import { FeedbackSection } from './components/FeedbackSection';
import { SettingsSection } from './components/SettingsSection';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DhiuPyqPortal } from './components/dhiu-pyq/DhiuPyqPortal';
import { DhiuPyqGatewayCard } from './components/dhiu-pyq/DhiuPyqGatewayCard';
import { QuizSuitePortal } from './components/quiz/QuizSuitePortal';
import { QuizGatewayCard } from './components/quiz/QuizGatewayCard';
import { SharePublicLinkModal } from './components/SharePublicLinkModal';
import { SubmitLinkModal } from './components/SubmitLinkModal';
import { TextToPdfWorkspace } from './components/TextToPdfWorkspace';
import { AttendanceModal } from './components/AttendanceModal';
import { VivaVoceExamArchivePortal } from './components/viva/VivaVoceExamArchivePortal';

import { INITIAL_PROGRAMS } from './data/samplePrograms';
import { 
  INITIAL_ABSTRACTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PERSONS, 
  INITIAL_FEEDBACK 
} from './data/extendedAcademicData';
import { 
  AcademicProgram, 
  AcademicAbstract, 
  AcademicNotification, 
  AcademicPerson, 
  FeedbackEntry, 
  AuthUser, 
  AppNavSection, 
  AppDisplayMode, 
  AppThemePalette, 
  ProgramMode,
  UserWorkItem,
  WorkLifecycleStatus
} from './types';
import { Language, TRANSLATIONS } from './utils/translations';
import confetti from 'canvas-confetti';
import { Check, Sparkles, X, Info, FileUp, BookmarkCheck, ClipboardCheck } from 'lucide-react';

const STORAGE_KEYS = {
  PROGRAMS: 'academic_abstract_programs_v2',
  ABSTRACTS: 'academic_abstracts_list_v2',
  NOTIFS: 'academic_notifications_v2',
  PERSONS: 'academic_persons_v2',
  FEEDBACK: 'academic_feedback_v2',
  AUTH: 'academic_auth_user_v2',
  THEME: 'academic_app_theme_v2',
  MODE: 'academic_app_mode_v2',
  LANG: 'academic_app_lang_v2',
  WORKS: 'academic_user_works_v2'
};

const INITIAL_USER_WORKS: UserWorkItem[] = [
  {
    id: 'work-prog-1',
    type: 'program',
    programId: 'prog-1',
    title: 'AI Ethics in Islamic Jurisprudence & Governance',
    category: 'Islamic Topics',
    date: '2026-09-20',
    dayOfWeek: 'Sunday',
    time: '10:00 AM - 04:00 PM EST',
    location: 'Zoom Webinar (International Academic Broadcast)',
    mode: 'Online',
    status: 'Selected',
    speaker: 'Prof. Dr. Tariq Al-Mansoor',
    notes: 'Keynote lecture on algorithmic Shariah compliance & moral autonomous governance.',
    updatedAt: '2026-09-18'
  },
  {
    id: 'work-abs-1',
    type: 'abstract',
    title: 'Peer Review: Quantum Computing Architectures for Fault-Tolerant Cryptography',
    category: 'Simple Topics',
    status: 'Pending',
    date: '2026-09-24',
    speaker: 'Prof. Elena Rostova',
    notes: 'Secondary referee evaluation on noise decoherence bounds.',
    updatedAt: '2026-09-17'
  }
];

export default function App() {
  // Localization state
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch (_) {}
    return 'en';
  });

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Display Mode (light, dark, midnight) - defaults to light mode for crisp color clarity
  const [displayMode, setDisplayMode] = useState<AppDisplayMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODE) as AppDisplayMode;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'midnight')) return saved;
    } catch (_) {}
    return 'light';
  });

  // Color Theme (emerald, cyber, sunset, oceanic)
  const [themePalette, setThemePalette] = useState<AppThemePalette>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as AppThemePalette;
      if (saved) return saved;
    } catch (_) {}
    return 'emerald';
  });

  // Navigation State
  const [activeSection, setActiveSection] = useState<AppNavSection>('dashboard');

  // Auth user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });

  // Programs state
  const [programs, setPrograms] = useState<AcademicProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_PROGRAMS;
  });

  // Abstracts state
  const [abstracts, setAbstracts] = useState<AcademicAbstract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ABSTRACTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_ABSTRACTS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AcademicNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Persons / Reviewers state
  const [persons, setPersons] = useState<AcademicPerson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_PERSONS;
  });

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_FEEDBACK;
  });

  // User Works state (My Works Workspace)
  const [userWorks, setUserWorks] = useState<UserWorkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return INITIAL_USER_WORKS;
  });

  // Active Modals & Popups
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram | null>(null);
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<AcademicProgram | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSubmitOpportunityOpen, setIsSubmitOpportunityOpen] = useState(false);
  const [isPublicBrowseOpen, setIsPublicBrowseOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalConfig, setShareModalConfig] = useState<{ url: string; title: string }>({
    url: typeof window !== 'undefined' ? window.location.href : 'https://academic-hub.edu/share/public-thread-2026',
    title: 'Academic Hub & Research Platform'
  });

  const handleOpenShare = (url?: string, title?: string) => {
    setShareModalConfig({
      url: url || (typeof window !== 'undefined' ? window.location.href : 'https://academic-hub.edu/share/public-thread-2026'),
      title: title || 'Academic Hub & Research Platform'
    });
    setIsShareModalOpen(true);
  };

  // Submit Link Modal State & Handler
  const [isSubmitLinkOpen, setIsSubmitLinkOpen] = useState(false);

  // Student Attendance Modal State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const handleSaveSubmittedLink = (data: { url: string; title: string }) => {
    const newProg: AcademicProgram = {
      id: `link-ref-${Date.now()}`,
      name: data.title,
      abstract: `Ingested weblink reference: ${data.url}. Direct access portal for academic registration, symposium materials, and digital documentation.`,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: 'Digital Gateway 24/7',
      location: data.url,
      mode: 'Online',
      themes: ['Digital Gateway', 'Web Reference', 'External Portal'],
      category: 'External Portals',
      registrationUrl: data.url,
      organizerOrChair: 'Web Portal Facilitator',
      extractedSummary: ['Direct web resource', 'External reference ingestion'],
      finalNotes: 'Direct link submission preserved in local active repository.',
      createdAt: new Date().toISOString().split('T')[0],
      colorTheme: 'blue'
    };
    handleSaveProgram(newProg);
    setIsSubmitLinkOpen(false);
    showToast(`Successfully ingested link "${data.title}" into active directory!`);
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ABSTRACTS, JSON.stringify(abstracts));
  }, [abstracts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
  }, [persons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(userWorks));
  }, [userWorks]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, displayMode);
    document.documentElement.classList.remove('dark', 'midnight', 'mode-light', 'mode-dark', 'mode-midnight');
    if (displayMode === 'light') {
      document.documentElement.classList.add('mode-light');
    } else if (displayMode === 'dark') {
      document.documentElement.classList.add('dark', 'mode-dark');
    } else if (displayMode === 'midnight') {
      document.documentElement.classList.add('dark', 'midnight', 'mode-midnight');
    }
  }, [displayMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themePalette);
    document.documentElement.setAttribute('data-theme', themePalette);
  }, [themePalette]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = (currentLang === 'ar' || currentLang === 'ur') ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Global custom event listener for language changes
  useEffect(() => {
    const handleGlobalLang = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: Language }>;
      if (customEvent.detail && customEvent.detail.lang && customEvent.detail.lang !== currentLang) {
        setCurrentLang(customEvent.detail.lang);
      }
    };
    window.addEventListener('academic:languagechange', handleGlobalLang);
    return () => window.removeEventListener('academic:languagechange', handleGlobalLang);
  }, [currentLang]);

  // Toast auto-dismiss helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Avatar update handler
  const handleUpdateAvatar = (avatarUrl: string) => {
    if (currentUser) {
      const updatedUser: AuthUser = {
        ...currentUser,
        avatarUrl
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updatedUser));
      showToast('Profile image avatar updated successfully!', 'success');
    }
  };

  // Compute Interested / Selected Program IDs
  const interestedProgramIds = userWorks
    .filter(w => w.type === 'program' && w.status === 'Selected' && w.programId)
    .map(w => w.programId as string);

  // ========================================================
  // GLOBAL INTENT TRIGGER HANDLER: "Are you interested in this program?"
  // ========================================================
  const handleToggleInterest = (program: AcademicProgram, interested: boolean) => {
    if (interested) {
      // Add or update to Selected in My Works
      setUserWorks(prev => {
        const existingIndex = prev.findIndex(w => w.programId === program.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: 'Selected',
            updatedAt: new Date().toISOString().split('T')[0]
          };
          return updated;
        }

        const newWork: UserWorkItem = {
          id: `work-prog-${Date.now()}`,
          type: 'program',
          programId: program.id,
          title: program.name,
          category: (program.category as any) || 'Islamic Topics',
          date: program.date,
          dayOfWeek: program.dayOfWeek,
          time: program.time || '10:00 AM - 04:00 PM EST',
          location: program.location,
          mode: program.mode,
          status: 'Selected',
          speaker: program.organizerOrChair || 'Lead Chair',
          notes: program.abstract.slice(0, 140) + '...',
          updatedAt: new Date().toISOString().split('T')[0]
        };
        return [newWork, ...prev];
      });

      // Confetti burst & toast notification
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (_) {}

      showToast(`Added "${program.name.slice(0, 32)}..." to your Selected Works!`);
    } else {
      // Remove or deselect
      setUserWorks(prev => prev.filter(w => w.programId !== program.id));
      showToast(`Removed from Selected Works.`, 'info');
    }
  };

  // Program Mode Switcher (Online <-> Offline)
  const handleToggleMode = (programId: string, currentMode: ProgramMode) => {
    const newMode: ProgramMode = currentMode === 'Online' ? 'Offline' : 'Online';
    setPrograms(prev =>
      prev.map(p => (p.id === programId ? { ...p, mode: newMode } : p))
    );
    showToast(`Program format toggled to ${newMode} mode!`);
  };

  // Program CRUD Handlers
  const handleSaveProgram = (programData: Omit<AcademicProgram, 'id'> | AcademicProgram) => {
    if ('id' in programData && programData.id) {
      setPrograms(prev =>
        prev.map(p => (p.id === programData.id ? (programData as AcademicProgram) : p))
      );
      showToast('Program record updated successfully!');
    } else {
      const newProgram: AcademicProgram = {
        ...programData,
        id: `prog-${Date.now()}`
      };
      setPrograms(prev => [newProgram, ...prev]);
      showToast('New academic program registered!');
    }
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const handleEditProgram = (program: AcademicProgram) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleDeleteProgram = (programId: string) => {
    setPrograms(prev => prev.filter(p => p.id !== programId));
    // Also remove from user works
    setUserWorks(prev => prev.filter(w => w.programId !== programId));
    showToast('Program removed from registry', 'info');
  };

  // Abstracts CRUD
  const handleAddAbstract = (newAbs: Omit<AcademicAbstract, 'id' | 'submissionDate'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const created: AcademicAbstract = {
      ...newAbs,
      id: `abs-${Date.now()}`,
      submittedDate: todayStr,
      submissionDate: todayStr
    };
    setAbstracts(prev => [created, ...prev]);

    // Also add to My Works as Pending
    const workItem: UserWorkItem = {
      id: `work-abs-${created.id}`,
      type: 'abstract',
      title: created.title,
      category: created.topicTrack === 'Islamic Jurisprudence' ? 'Islamic Topics' : 'Simple Topics',
      status: 'Pending',
      date: created.submittedDate,
      speaker: created.authors && created.authors.length > 0 ? created.authors.join(', ') : created.primaryAuthor,
      notes: created.abstractText.slice(0, 120) + '...',
      updatedAt: todayStr
    };
    setUserWorks(prev => [workItem, ...prev]);

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (_) {}
    showToast('Abstract submitted & logged to your Works pipeline!');
  };

  const handleUpdateAbstract = (updated: AcademicAbstract) => {
    setAbstracts(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    showToast(`Abstract "${updated.title.slice(0, 24)}..." updated.`);
  };

  // User Works Status Mutator
  const handleUpdateWorkStatus = (workId: string, newStatus: WorkLifecycleStatus) => {
    setUserWorks(prev =>
      prev.map(w => (w.id === workId ? { ...w, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : w))
    );
    showToast(`Status updated to "${newStatus}"`);
  };

  const handleDeleteWork = (workId: string) => {
    setUserWorks(prev => prev.filter(w => w.id !== workId));
    showToast('Item removed from workspace', 'info');
  };

  const handleAddCustomWork = (item: Omit<UserWorkItem, 'id' | 'updatedAt'>) => {
    const newItem: UserWorkItem = {
      ...item,
      id: `work-custom-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setUserWorks(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.title}" to ${newItem.status} column!`);
  };

  // Notifications Handlers
  const handleMarkAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All alerts marked as read.');
  };

  const handleToggleReadNotif = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotif = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // Authors & Reviewers Handler
  const handleAddPerson = (newPerson: Omit<AcademicPerson, 'id'>) => {
    const created: AcademicPerson = {
      ...newPerson,
      id: `person-${Date.now()}`
    };
    setPersons(prev => [created, ...prev]);
    showToast(`${created.name} added to academic registry!`);
  };

  // Feedback Handler
  const handleAddFeedback = (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
    const created: FeedbackEntry = {
      ...entry,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setFeedbackList(prev => [created, ...prev]);
    showToast('Thank you! Your feedback has been recorded.');
  };

  // Reset to sample defaults
  const handleResetData = () => {
    if (window.confirm('Reset all academic databases to fresh demonstration defaults?')) {
      setPrograms(INITIAL_PROGRAMS);
      setAbstracts(INITIAL_ABSTRACTS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setPersons(INITIAL_PERSONS);
      setFeedbackList(INITIAL_FEEDBACK);
      setUserWorks(INITIAL_USER_WORKS);
      showToast('All registers refreshed to factory defaults.', 'info');
    }
  };

  // Unified Authentication Log Out Action
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setIsParserOpen(false);
    setIsFormOpen(false);
    setSelectedProgram(null);
    setEditingProgram(null);
    setIsAuthOpen(false);
    setIsAdminAuthOpen(false);
    setActiveSection('dashboard');
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    try {
      sessionStorage.clear();
    } catch (_) {}
    showToast('Session invalidated. Credentials cleared. Returned to Home Landing View.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const isSelectedProgramInterested = selectedProgram 
    ? interestedProgramIds.includes(selectedProgram.id)
    : false;

  const isLandingView = !currentUser && !isAdminMode && activeSection === 'dashboard';
  const isRTL = currentLang === 'ar' || currentLang === 'ur';

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-sky-500 selection:text-white bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 dark:from-[#080d1a] dark:via-[#0c1629] dark:to-[#060a14]"
    >
      {/* Background Floating Artistic Hand-sketched Doodles (Only displayed in dashboard/admin view, removed completely from Landing Canvas) */}
      {!isLandingView && <FloatingDoodles />}

      {/* When in unauthenticated Landing view: Render the edge-to-edge full-screen canvas */}
      {isLandingView ? (
        <div className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-slate-50 via-sky-50/50 to-indigo-50/30 dark:from-[#080d1a] dark:via-[#0c1629] dark:to-[#060a14] overflow-x-hidden" id="landing-fullscreen-wrapper">
          {/* Header positioned over landing canvas */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <GlowHeader
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onOpenParser={() => setIsParserOpen(true)}
              onOpenAddProgram={() => {
                setEditingProgram(null);
                setIsFormOpen(true);
              }}
              currentLang={currentLang}
              onChangeLang={setCurrentLang}
              displayMode={displayMode}
              onToggleDisplayMode={() =>
                setDisplayMode(prev => (prev === 'light' ? 'dark' : 'light'))
              }
              onOpenShare={() => handleOpenShare()}
              onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
              onOpenAttendance={() => setIsAttendanceModalOpen(true)}
              programs={programs}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onTriggerAdminEasterEgg={() => {
                setIsAdminAuthOpen(true);
              }}
              isAdminActive={isAdminMode}
              onToggleAdminView={() => setIsAdminMode(prev => !prev)}
              unreadNotifsCount={unreadNotifsCount}
              t={t}
            />
          </div>

          {/* Full-screen Edge-to-Edge Academic Hub Landing View with Text-to-PDF in Middle Section */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-start w-full pb-16" id="primary-standalone-landing-stage">
            <LandingHeroView
              t={t}
              programs={programs}
              interestedProgramIds={interestedProgramIds}
              onSelectProgram={prog => setSelectedProgram(prog)}
              onToggleMode={handleToggleMode}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenSubmitAbstract={() => setIsSubmitOpportunityOpen(true)}
              onBrowsePrograms={() => setIsPublicBrowseOpen(true)}
              onOpenDhiuPyq={() => setActiveSection('dhiu-pyq')}
              onOpenQuizSuite={() => setActiveSection('quiz-arena')}
              onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
              onQuickLogin={user => {
                setCurrentUser(user);
                localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
                showToast(`Authenticated as ${user.name} (${user.role})`);
              }}
            />

            {/* Middle Layout Section: Full-Featured "Convert Text to PDF Online" Workspace */}
            <TextToPdfWorkspace onShowToast={showToast} />
          </div>
        </div>
      ) : (
        /* Main Container for Authenticated / Admin Views */
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Top Glow & Glass Navigation Header */}
          <GlowHeader
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onOpenParser={() => setIsParserOpen(true)}
            onOpenAddProgram={() => {
              setEditingProgram(null);
              setIsFormOpen(true);
            }}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onOpenShare={() => handleOpenShare()}
            onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
            onOpenAttendance={() => setIsAttendanceModalOpen(true)}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
            displayMode={displayMode}
            onToggleDisplayMode={() =>
              setDisplayMode(prev => (prev === 'light' ? 'dark' : 'light'))
            }
            programs={programs}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
            onTriggerAdminEasterEgg={() => {
              if (currentUser?.isAdmin) {
                setIsAdminMode(prev => !prev);
                showToast(isAdminMode ? 'Exited Admin Mode' : 'Welcome to Admin Control Center');
              } else {
                setIsAdminAuthOpen(true);
              }
            }}
            isAdminActive={isAdminMode}
            onToggleAdminView={() => setIsAdminMode(prev => !prev)}
            unreadNotifsCount={unreadNotifsCount}
            t={t}
            onUpdateAvatar={handleUpdateAvatar}
          />

        {/* ======================================================== */}
        {/* ADMIN DASHBOARD CONTROL CENTER VIEW                     */}
        {/* ======================================================== */}
        {isAdminMode && (
          <AdminDashboardView
            currentUser={currentUser}
            onExitAdmin={() => setIsAdminMode(false)}
            onLogout={handleLogout}
          />
        )}

        {/* ======================================================== */}
        {/* SECTION: DASHBOARD (AUTHENTICATED HOME PAGE)             */}
        {/* ======================================================== */}
        {!isAdminMode && currentUser && activeSection === 'dashboard' && (
          <div className="space-y-10 animate-fade-in" id="authenticated-home-flow">
            {/* MODULE 1: The Short Service Description & Greeting Hero Block */}
            <div 
              className="section-box-glass p-6 sm:p-8 border-[1.5px] border-sky-500/40 shadow-[0_0_18px_rgba(14,165,233,0.16)] relative overflow-hidden space-y-6"
              style={{ borderRadius: '12px' }}
              id="module-1-hero-service-block"
            >
              {/* Ambient Background Aura */}
              <div className="absolute -top-12 -right-12 w-80 h-80 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  {/* Category Chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span>Academic Hub • Scholar Control Center</span>
                  </div>

                  {/* Greeting Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                    Welcome back, <span className="text-sky-600 dark:text-sky-400">{currentUser.name}</span>
                  </h1>

                  {/* Role & Institution & Attendance Action */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                      {currentUser.role}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      • {currentUser.institution}
                    </span>
                  </div>

                  {/* Sacred Academic Verse & Attribution (Post-Login Dashboard Calligraphy) */}
                  <div 
                    dir="rtl" 
                    className="pt-2 pb-1 space-y-1 text-right"
                  >
                    <div 
                      className="text-2xl md:text-3xl font-bold tracking-normal leading-relaxed font-amiri text-[#172033] dark:text-slate-100 select-text"
                      style={{ fontFamily: "'Amiri', serif" }}
                    >
                      <span>وَقُلْ رَبِّ زِدْنِي </span>
                      <span className="text-[#C9A227] font-extrabold drop-shadow-[0_1px_2px_rgba(201,162,39,0.25)]">عِلْمًا</span>
                    </div>
                    <div 
                      className="text-xs font-semibold font-tajawal text-[#667085] dark:text-zinc-400 tracking-wide select-text"
                      style={{ fontFamily: "'Tajawal', 'Noto Kufi Arabic', sans-serif" }}
                    >
                      القرآن الكريم — سورة طه، الآية 114
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated 4-grid Color-Differentiated Metric Summary Boxes */}
              <div className="pt-2">
                <MetricSummaryBoxes 
                  programs={programs} 
                  abstracts={abstracts}
                  onCardClick={metricKey => {
                    if (metricKey === 'programs') setActiveSection('programs');
                    else if (metricKey === 'abstracts') setActiveSection('my-works');
                    else if (metricKey === 'length' || metricKey === 'modality') setActiveSection('analytics');
                  }}
                  t={t}
                />
              </div>
            </div>

            {/* DEDICATED CATEGORY SECTION: DHIU PYQ ENTRY GATEWAY */}
            <div id="module-dhiu-pyq-gateway-section">
              <DhiuPyqGatewayCard 
                onOpenPortal={() => {
                  setActiveSection('dhiu-pyq');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            </div>

            {/* DEDICATED CATEGORY SECTION: INTERACTIVE QUIZ & ORAL DEFENSE GATEWAY */}
            <div id="module-interactive-quiz-gateway-section">
              <QuizGatewayCard 
                onOpenPortal={(targetPin) => {
                  setActiveSection('quiz-arena');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            </div>


            {/* MODULE 2: The "Top 5 Upcoming Programs" Gamified Carousel */}
            <div id="module-2-top-upcoming-carousel">
              <TopUpcomingSection
                programs={programs}
                onSelectProgram={prog => setSelectedProgram(prog)}
                onToggleMode={handleToggleMode}
                onOpenShare={(url, title) => handleOpenShare(url, title)}
                onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
              />
            </div>

            {/* RESTORED MODULE: Master Interactive Schedule Calendar Grid */}
            <div 
              id="module-master-schedule-calendar" 
              className="section-box-glass p-6 sm:p-7 border-[1.5px] border-sky-500/40 shadow-[0_0_18px_rgba(14,165,233,0.15)]"
              style={{ borderRadius: '12px' }}
            >
              <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>Master Schedule Calendar &amp; Timelines</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 font-mono">
                  Monthly View
                </span>
              </h3>
              <SmartCalendar
                programs={programs}
                interestedProgramIds={interestedProgramIds}
                onSelectProgram={prog => setSelectedProgram(prog)}
                onToggleMode={handleToggleMode}
                t={t}
              />
            </div>

            {/* INTEGRATED "CONVERT TEXT TO PDF ONLINE" WORKSPACE IN DASHBOARD */}
            <div id="module-text-to-pdf-dashboard-section">
              <TextToPdfWorkspace onShowToast={showToast} />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: QUIZ ARENA (INTERACTIVE MULTIPLAYER SUITE)      */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'quiz-arena' && (
          <div className="animate-fade-in space-y-6" id="quiz-arena-full-view">
            <QuizSuitePortal
              onBackToDashboard={() => {
                setActiveSection('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAuth={() => setIsAuthOpen(true)}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: DHIU PYQ (PAST YEAR QUESTIONS PORTAL)           */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'dhiu-pyq' && (
          <div className="animate-fade-in space-y-6" id="dhiu-pyq-full-view">
            <DhiuPyqPortal
              onBackToDashboard={() => {
                setActiveSection('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
              onOpenShare={(url, title) => handleOpenShare(url, title)}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: VIVA VOCE — 2025 EXAM ARCHIVE PORTAL            */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'viva-voce' && (
          <div className="animate-fade-in space-y-6" id="viva-voce-full-view">
            <VivaVoceExamArchivePortal
              onBack={() => {
                setActiveSection('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: SEND & RECEIVE MAIL TERMINAL                   */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'send-receive' && (
          <div className="animate-fade-in space-y-6" id="send-receive-full-view">
            <SendReceiveMailTerminal
              currentUser={currentUser}
              t={t}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: MY WORKS WORKSPACE                             */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'my-works' && (
          <div className="animate-fade-in space-y-6">
            <MyWorksSection
              works={userWorks}
              onUpdateStatus={handleUpdateWorkStatus}
              onDeleteWork={handleDeleteWork}
              onAddCustomWork={handleAddCustomWork}
              onSelectProgram={progId => {
                const found = programs.find(p => p.id === progId);
                if (found) setSelectedProgram(found);
              }}
              onOpenShare={(url, title) => handleOpenShare(url, title)}
              onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
              t={t}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: PROGRAMS (MASTER REGISTER)                     */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'programs' && (
          <div className="animate-fade-in space-y-6">
            <ProgramsListView
              programs={programs}
              onSelectProgram={prog => setSelectedProgram(prog)}
              onToggleMode={handleToggleMode}
              onEditProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
              onOpenShare={(url, title) => handleOpenShare(url, title)}
              onOpenSubmitLink={() => setIsSubmitLinkOpen(true)}
              t={t}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: AI PARSER                                      */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'ai-parser' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 via-teal-400 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <FileUp className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
                {t.parseDocument}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Upload academic symposium announcements, call-for-papers, or syllabus documents (PDF/Image) to automatically extract dates, word-bounded abstracts, and key takeaways.
              </p>
              <button
                id="btn-launch-parser-workspace"
                onClick={() => setIsParserOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch OCR Document Parser</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: NOTIFICATIONS                                  */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'notifications' && (
          <NotificationsSection
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotifsAsRead}
            onToggleRead={handleToggleReadNotif}
            onDeleteNotification={handleDeleteNotif}
            onSelectProgramId={progId => {
              const prog = programs.find(p => p.id === progId);
              if (prog) setSelectedProgram(prog);
            }}
            t={t}
          />
        )}

        {/* ======================================================== */}
        {/* SECTION: ANALYTICS                                      */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'analytics' && (
          <AnalyticsSection
            programs={programs}
            abstracts={abstracts}
            t={t}
          />
        )}

        {/* ======================================================== */}
        {/* SECTION: SETTINGS                                       */}
        {/* ======================================================== */}
        {!isAdminMode && activeSection === 'settings' && (
          <SettingsSection
            currentTheme={themePalette}
            onChangeTheme={setThemePalette}
            currentMode={displayMode}
            onChangeMode={setDisplayMode}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setIsAdminMode(false);
              showToast('Signed out of academic portal', 'info');
            }}
            onResetData={handleResetData}
            programs={programs}
            t={t}
          />
        )}

      </main>
      )}

      {/* ======================================================== */}
      {/* EXPANDABLE GRANULAR DETAILS MODAL WITH INTENT & TIMELINE */}
      {/* ======================================================== */}
      <ProgramDetailModal
        program={selectedProgram}
        abstracts={abstracts}
        isInterested={isSelectedProgramInterested}
        onToggleInterest={handleToggleInterest}
        onClose={() => setSelectedProgram(null)}
        onToggleMode={handleToggleMode}
        onEdit={handleEditProgram}
        onOpenShare={(url, title) => handleOpenShare(url, title)}
      />

      {/* AI Document Parser Modal */}
      <DocumentParserModal
        isOpen={isParserOpen}
        onClose={() => setIsParserOpen(false)}
        onSaveParsedProgram={handleSaveProgram}
        t={t}
      />

      {/* Program Create/Edit Form Modal */}
      <ProgramFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProgram(null);
        }}
        onSave={handleSaveProgram}
        initialProgram={editingProgram}
      />

      {/* Authentication Modal (Login / Signup / Forgot Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={user => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
        t={t}
        lang={currentLang}
      />

      {/* Hidden 5-Click Admin Access Modal */}
      <AdminLoginModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAdminAuthSuccess={adminUser => {
          setCurrentUser(adminUser);
          setIsAdminMode(true);
          showToast('Super Admin Control Center Unlocked!');
        }}
      />

      {/* Unauthenticated Opportunity Submission Modal (Public) */}
      <UnauthenticatedSubmitOpportunityModal
        isOpen={isSubmitOpportunityOpen}
        onClose={() => setIsSubmitOpportunityOpen(false)}
        onSubmitOpportunity={newProg => {
          handleSaveProgram(newProg);
          setIsSubmitOpportunityOpen(false);
          showToast(`Successfully listed "${newProg.name}" to Academic Register!`);
        }}
      />

      {/* Public Browse Programs Modal (Curated 5 Chronological Highlights) */}
      <PublicBrowseProgramsModal
        isOpen={isPublicBrowseOpen}
        onClose={() => setIsPublicBrowseOpen(false)}
        onOpenAuth={() => {
          setIsPublicBrowseOpen(false);
          setIsAuthOpen(true);
        }}
        onSelectProgram={prog => {
          setSelectedProgram(prog);
        }}
      />

      {/* Compact Personal Scratchpad & Document Dropper Modal */}
      <PersonalScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        onShowToast={showToast}
      />

      {/* Dynamic Share Public Link Popup Modal */}
      <SharePublicLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareModalConfig.url}
        shareTitle={shareModalConfig.title}
        onShowToast={showToast}
      />

      {/* Dynamic Unauthenticated Submit Link Ingestion Portal Modal */}
      <SubmitLinkModal
        isOpen={isSubmitLinkOpen}
        onClose={() => setIsSubmitLinkOpen(false)}
        onSubmitLink={handleSaveSubmittedLink}
      />

      {/* Responsive Center-Aligned Student Attendance Portal Modal */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Bottom Floating Toast Notification */}
      {toastMessage && (
        <div 
          id="app-toast-alert"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-popup-modal text-slate-900 dark:text-white border border-teal-300 dark:border-teal-700 shadow-xl animate-fade-in text-xs sm:text-sm font-semibold"
        >
          {toastMessage.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
              <Info className="w-3.5 h-3.5" />
            </div>
          )}
          <span>{toastMessage.text}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
