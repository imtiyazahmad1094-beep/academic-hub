import React, { useState } from 'react';
import { QuizItem, LobbyPlayer } from '../../types';
import { INITIAL_QUIZZES, INITIAL_LOBBY_PLAYERS } from '../../data/mockQuizzes';
import { QuizDiscoveryHub } from './QuizDiscoveryHub';
import { QuizLobbyRoom } from './QuizLobbyRoom';
import { LiveOralDefenseArena } from './LiveOralDefenseArena';
import { HostingLifecycleModal } from './HostingLifecycleModal';
import { QuizEditorModal } from './QuizEditorModal';
import { AiQuizGeneratorModal } from './AiQuizGeneratorModal';
import { FlashcardVivaArena } from './FlashcardVivaArena';
import { VivaCategorySelection, VIVA_DOMAINS, VivaDomain } from './viva/VivaCategorySelection';
import { VivaResourceWorkspace } from './viva/VivaResourceWorkspace';
import { LiveVivaQuestionArena } from './viva/LiveVivaQuestionArena';
import { AcademicHubLeaderboard } from './leaderboard/AcademicHubLeaderboard';

interface QuizSuitePortalProps {
  onBackToDashboard?: () => void;
  onOpenAuth?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export type QuizStage = 
  | 'discovery' 
  | 'viva-domains' 
  | 'viva-resources' 
  | 'viva-arena' 
  | 'leaderboard' 
  | 'lobby' 
  | 'arena' 
  | 'flashcards';

export const QuizSuitePortal: React.FC<QuizSuitePortalProps> = ({
  onBackToDashboard,
  onOpenAuth,
  onShowToast
}) => {
  const [stage, setStage] = useState<QuizStage>('discovery');
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<QuizItem>(INITIAL_QUIZZES[0]);
  const [activeRoomPin, setActiveRoomPin] = useState<string>('941 985');
  const [players, setPlayers] = useState<LobbyPlayer[]>(INITIAL_LOBBY_PLAYERS);
  
  // Viva Domain State
  const [activeVivaDomain, setActiveVivaDomain] = useState<VivaDomain>(VIVA_DOMAINS[0]);

  // Modals
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Handle selecting a quiz from Discovery feed
  const handleSelectQuiz = (quiz: QuizItem, targetStage: 'lobby' | 'arena') => {
    setActiveQuiz(quiz);
    setActiveRoomPin(quiz.pinCode);
    setStage(targetStage);
  };

  // Handle PIN Ingestion
  const handleJoinWithPin = (pin: string) => {
    const formatted = pin.trim().replace(/\s+/g, ' ');
    const found = quizzes.find(q => q.pinCode.replace(/\s+/g, '') === formatted.replace(/\s+/g, ''));
    if (found) {
      setActiveQuiz(found);
      setActiveRoomPin(found.pinCode);
      setStage('lobby');
      onShowToast(`Joined room "${found.title}" via PIN ${found.pinCode}`, 'success');
    } else {
      // Create ad-hoc room with entered PIN
      setActiveRoomPin(formatted);
      setStage('lobby');
      onShowToast(`Connected to custom lobby session with PIN: ${formatted}`, 'info');
    }
  };

  // Kick players from lobby
  const handleKickPlayers = (kickedIds: string[]) => {
    setPlayers(prev => prev.filter(p => !kickedIds.includes(p.id)));
  };

  // Add player to lobby
  const handleAddPlayer = (name: string) => {
    const avatars = ['🎓', '🔬', '📚', '⚡', '🏛️', '🌌', '🎻', '🖋️', '🧠', '🌟'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const newPlayer: LobbyPlayer = {
      id: `p-${Date.now()}`,
      name,
      avatar: randomAvatar,
      score: 1000,
      joinedAt: 'Just now',
      status: 'Ready'
    };
    setPlayers(prev => [newPlayer, ...prev]);
  };

  // Save new custom quiz
  const handleSaveQuiz = (newQuiz: QuizItem) => {
    setQuizzes(prev => [newQuiz, ...prev]);
    setActiveQuiz(newQuiz);
    setActiveRoomPin(newQuiz.pinCode);
  };

  // Exit trigger from Lobby or Arena -> opens Hosting Lifecycle Modal
  const handleTriggerExit = () => {
    setIsHostingModalOpen(true);
  };

  // Hosting Lifecycle Actions
  const handleLeaveKeepHosting = () => {
    setIsHostingModalOpen(false);
    setStage('discovery');
    onShowToast(`Left view. Session is still actively hosted on PIN ${activeRoomPin}`, 'info');
  };

  const handleLeaveStopHosting = () => {
    setIsHostingModalOpen(false);
    setStage('discovery');
    onShowToast(`Session closed. Hosting stopped for PIN ${activeRoomPin}`, 'info');
  };

  // Selection of domain in Viva Category Selection
  const handleSelectVivaDomain = (domain: VivaDomain) => {
    setActiveVivaDomain(domain);
    setStage('viva-resources');
  };

  return (
    <div id="quiz-suite-master-portal" className="w-full relative">
      
      {/* ======================================================== */}
      {/* STAGE A: DISCOVERY & GENERATION PORTAL (HOMEPAGE HUB)    */}
      {/* ======================================================== */}
      {stage === 'discovery' && (
        <div className="space-y-6">
          <QuizDiscoveryHub
            quizzes={quizzes}
            onBackToDashboard={onBackToDashboard}
            onSelectQuiz={handleSelectQuiz}
            onJoinWithPin={handleJoinWithPin}
            onOpenQuizEditor={() => setIsEditorOpen(true)}
            onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
            onHostLiveGame={() => setStage('lobby')}
            onOpenFlashcards={() => setStage('flashcards')}
            onOpenVivaDomains={() => setStage('viva-domains')}
            onOpenLeaderboard={() => setStage('leaderboard')}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE B: VIVA CATEGORY SELECTION WORKSPACE               */}
      {/* ======================================================== */}
      {stage === 'viva-domains' && (
        <div className="animate-fade-in">
          <VivaCategorySelection
            onBack={() => setStage('discovery')}
            onSelectDomain={handleSelectVivaDomain}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE C: VIVA RESOURCE WORKSPACE (SPLIT UNI-WINDOW)      */}
      {/* ======================================================== */}
      {stage === 'viva-resources' && (
        <div className="animate-fade-in">
          <VivaResourceWorkspace
            domain={activeVivaDomain}
            onBack={() => setStage('viva-domains')}
            onLaunchViva={(domain) => {
              setActiveVivaDomain(domain);
              setStage('viva-arena');
            }}
            onLaunchFlashcards={() => setStage('flashcards')}
            onLaunchQuiz={() => setStage('lobby')}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE D: LIVE VIVA QUESTION ARENA                        */}
      {/* ======================================================== */}
      {stage === 'viva-arena' && (
        <div className="animate-fade-in">
          <LiveVivaQuestionArena
            domain={activeVivaDomain}
            roomPin={activeRoomPin}
            onExitArena={() => setStage('viva-resources')}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE E: DEDICATED LEADERBOARD SYSTEM                    */}
      {/* ======================================================== */}
      {stage === 'leaderboard' && (
        <div className="animate-fade-in">
          <AcademicHubLeaderboard
            onBackToDiscovery={() => setStage('discovery')}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE F: MULTIPLAYER LOBBY ROOM INTERFACE                */}
      {/* ======================================================== */}
      {stage === 'lobby' && (
        <div className="animate-fade-in">
          <QuizLobbyRoom
            quiz={activeQuiz}
            roomPin={activeRoomPin}
            players={players}
            onStartGame={() => {
              setStage('arena');
              onShowToast('Oral Defense Arena initialized! Starting slide 1...', 'success');
            }}
            onExitLobby={handleTriggerExit}
            onKickPlayers={handleKickPlayers}
            onAddPlayer={handleAddPlayer}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE G: LIVE "ORAL DEFENSE" QUESTION ARENA             */}
      {/* ======================================================== */}
      {stage === 'arena' && (
        <div className="animate-fade-in">
          <LiveOralDefenseArena
            quiz={activeQuiz}
            roomPin={activeRoomPin}
            playerCount={players.length}
            initialPlayers={players}
            onExitRoom={handleTriggerExit}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE H: PLAY BY FLASHCARDS (VIVA MODULE)                */}
      {/* ======================================================== */}
      {stage === 'flashcards' && (
        <div className="animate-fade-in">
          <FlashcardVivaArena
            onBackToDiscovery={() => setStage('discovery')}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* HOSTING LIFECYCLE OVERLAY (MODAL POP-UP)                 */}
      {/* ======================================================== */}
      <HostingLifecycleModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
        onLeaveKeepHosting={handleLeaveKeepHosting}
        onLeaveStopHosting={handleLeaveStopHosting}
        roomPin={activeRoomPin}
      />

      {/* Quiz Editor Modal */}
      <QuizEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveQuiz={handleSaveQuiz}
        onShowToast={onShowToast}
      />

      {/* AI Quiz Generator Modal */}
      <AiQuizGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onSaveQuiz={handleSaveQuiz}
        onShowToast={onShowToast}
      />

    </div>
  );
};
