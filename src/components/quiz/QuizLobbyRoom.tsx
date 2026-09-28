import React, { useState } from 'react';
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Users, 
  Play, 
  Sliders, 
  UserMinus, 
  Check, 
  ArrowLeft, 
  Radio, 
  Plus
} from 'lucide-react';
import { QuizItem, LobbyPlayer, LobbySettings } from '../../types';
import { soundFX } from '../../utils/audioUtils';

interface QuizLobbyRoomProps {
  quiz: QuizItem;
  roomPin: string;
  players: LobbyPlayer[];
  onStartGame: () => void;
  onExitLobby: () => void;
  onKickPlayers: (playerIds: string[]) => void;
  onAddPlayer: (name: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

// Neon Sound Slider Props and Styling Map
interface SoundSliderConfig {
  trackGradient: string;
  thumbClass: string;
  badgeClass: string;
  glowAura: string;
}

const SLIDER_THEMES: Record<'cyan' | 'orange' | 'blue' | 'purple', SoundSliderConfig> = {
  cyan: {
    trackGradient: 'from-cyan-500 to-teal-400',
    thumbClass: 'bg-cyan-400 border-2 border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.95)]',
    badgeClass: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50',
    glowAura: 'group-hover:shadow-[0_0_16px_rgba(6,182,212,0.4)]'
  },
  orange: {
    trackGradient: 'from-orange-500 to-amber-400',
    thumbClass: 'bg-orange-500 border-2 border-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.95)]',
    badgeClass: 'text-orange-300 bg-orange-950/80 border-orange-500/50',
    glowAura: 'group-hover:shadow-[0_0_16px_rgba(249,115,22,0.4)]'
  },
  blue: {
    trackGradient: 'from-blue-600 via-sky-500 to-cyan-400',
    thumbClass: 'bg-sky-400 border-2 border-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.95)]',
    badgeClass: 'text-sky-300 bg-sky-950/80 border-sky-500/50',
    glowAura: 'group-hover:shadow-[0_0_16px_rgba(56,189,248,0.4)]'
  },
  purple: {
    trackGradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
    thumbClass: 'bg-purple-400 border-2 border-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.95)]',
    badgeClass: 'text-purple-300 bg-purple-950/80 border-purple-500/50',
    glowAura: 'group-hover:shadow-[0_0_16px_rgba(168,85,247,0.4)]'
  }
};

interface NeonSoundSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  accent: 'cyan' | 'orange' | 'blue' | 'purple';
}

const NeonSoundSlider: React.FC<NeonSoundSliderProps> = ({
  label,
  value,
  onChange,
  accent
}) => {
  const theme = SLIDER_THEMES[accent];

  return (
    <div className={`p-3 sm:p-3.5 rounded-2xl bg-zinc-900/90 border-[1.5px] border-zinc-800 border-t-2 border-t-white/15 border-b-3 border-b-black shadow-md space-y-2 transition-all ${theme.glowAura}`}>
      <div className="flex items-center justify-between">
        <span className="text-white font-black text-xs uppercase tracking-wider font-mono">
          {label}
        </span>
        <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs border ${theme.badgeClass}`}>
          {value}%
        </span>
      </div>

      <div className="relative w-full h-3 bg-zinc-950 rounded-full border border-zinc-800 overflow-visible cursor-pointer flex items-center">
        {/* Neon Active Track Fill */}
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${theme.trackGradient} transition-all duration-75`}
          style={{ width: `${value}%` }}
        />

        {/* Real Range Input */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
        />

        {/* Glowing Circular Range Button Thumb (scales up on hover) */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full ${theme.thumbClass} pointer-events-none z-10 transition-transform duration-150 hover:scale-125`}
          style={{ left: `${value}%` }}
        />
      </div>
    </div>
  );
};

export const QuizLobbyRoom: React.FC<QuizLobbyRoomProps> = ({
  quiz,
  roomPin,
  players,
  onStartGame,
  onExitLobby,
  onKickPlayers,
  onAddPlayer,
  onShowToast
}) => {
  const [isPinHidden, setIsPinHidden] = useState(false);
  const [hasCopiedPin, setHasCopiedPin] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Sound Sliders
  const [soundMusic, setSoundMusic] = useState(75);
  const [soundYoutube, setSoundYoutube] = useState(80);
  const [soundVoice, setSoundVoice] = useState(90);
  const [soundEffects, setSoundEffects] = useState(85);

  // Gameplay & Safety Checkboxes
  const [settings, setSettings] = useState<LobbySettings>({
    soundMusic: 75,
    soundYoutube: 80,
    soundVoice: 90,
    soundEffects: 85,
    teamMode: false,
    hideLeaderboard: false,
    muteSound: false,
    onlySafePlayerNames: true,
    hideIncorrectTypeAnswers: true,
    dontReadOutPlayerNames: false,
    banKickedPlayers: true
  });

  const toggleSetting = (key: keyof LobbySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    soundFX.playTick(0.2);
  };

  const handleCopyPin = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(roomPin);
    }
    setHasCopiedPin(true);
    soundFX.playJoin(0.3);
    onShowToast(`Copied room PIN: ${roomPin}`, 'success');
    setTimeout(() => setHasCopiedPin(false), 2000);
  };

  const handleSelectPlayerForKick = (id: string) => {
    setSelectedPlayerIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleExecuteKick = () => {
    if (selectedPlayerIds.length === 0) {
      onShowToast('Select at least one player to kick from ledger', 'info');
      return;
    }
    onKickPlayers(selectedPlayerIds);
    setSelectedPlayerIds([]);
    soundFX.playError(0.3);
    onShowToast(`Kicked ${selectedPlayerIds.length} player(s) from lobby`, 'info');
  };

  const handleManualAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    onAddPlayer(newPlayerName.trim());
    setNewPlayerName('');
    soundFX.playJoin(0.4);
    onShowToast(`Simulated connection for ${newPlayerName.trim()}`, 'success');
  };

  // Helper to get high-contrast text chips matching user specification
  const getChipLabel = (name: string): string => {
    if (name.startsWith('Dr.')) return 'Dr.';
    if (name.startsWith('Prof')) return 'Pr.';
    const lower = name.toLowerCase();
    if (lower.startsWith('maryam')) return 'Me';
    if (lower.startsWith('ahmad')) return 'Ah';
    if (lower.startsWith('sarah')) return 'Sa';
    if (lower.startsWith('tariq')) return 'Tar';
    if (lower.startsWith('elena')) return 'Ele';
    if (lower.startsWith('bilal')) return 'Bil.';
    const parts = name.split(/[_\s]+/);
    if (parts.length > 1) {
      return (parts[0].slice(0, 2)).toUpperCase();
    }
    return name.slice(0, 3);
  };

  return (
    <div 
      id="multiplayer-lobby-room-stage"
      className="min-h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-400 selection:text-zinc-950"
    >
      {/* Top Breadcrumb Bar */}
      <div className="h-14 px-4 sm:px-8 border-b-[1.5px] border-zinc-800 bg-zinc-900/90 backdrop-blur-md flex items-center justify-between z-20">
        <button
          onClick={onExitLobby}
          className="flex items-center gap-2 text-xs sm:text-sm font-black text-zinc-100 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-300" />
          <span>Exit Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 font-bold">Target Session:</span>
          <span className="text-xs sm:text-sm font-black text-teal-300 truncate max-w-xs sm:max-w-md">
            {quiz.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-400 font-black hidden sm:inline">LOBBY LIVE</span>
        </div>
      </div>

      {/* Main Split-Frame Waiting Room Dashboard Layer */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* ======================================================== */}
        {/* LEFT CONTROL MODULE (THE LOBBY CORE)                     */}
        {/* ======================================================== */}
        <div className="flex-[3] flex flex-col justify-between bg-zinc-950/80 border-[1.5px] border-zinc-800 border-t-2 border-t-white/20 border-b-4 border-b-black rounded-3xl p-6 sm:p-8 shadow-2xl relative backdrop-blur-xl">
          
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-400 rounded-t-3xl" />

          {/* Top Joining Banner + PIN Credential + QR Code */}
          <div className="bg-zinc-900/90 border-[1.5px] border-zinc-800 border-t-2 border-t-white/20 border-b-4 border-b-black rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* Active Joining URL & Large Bold Neon Glowing PIN */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-300 flex items-center justify-center md:justify-start gap-2">
                <span>Join at:</span>
                <span className="font-mono text-sky-400 font-black tracking-wide">QUIZ.com</span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-xs sm:text-sm font-mono text-zinc-300 uppercase font-bold">
                  PIN code:
                </span>
                
                <div className="px-5 py-2 rounded-2xl bg-zinc-950 border-[1.5px] border-teal-400/80 border-t-2 border-t-teal-300/40 border-b-4 border-b-black shadow-[0_0_20px_rgba(45,212,191,0.35)]">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]">
                    {isPinHidden ? '••• •••' : roomPin}
                  </span>
                </div>

                {/* Mini Click Buttons for "Copy" and "Hide" */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    title="Copy PIN Code"
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border-[1.5px] border-zinc-700 border-t border-t-white/20 border-b-2 border-b-black text-zinc-100 hover:text-white transition-colors cursor-pointer"
                  >
                    {hasCopiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPinHidden(prev => !prev)}
                    title={isPinHidden ? 'Show PIN' : 'Hide PIN'}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border-[1.5px] border-zinc-700 border-t border-t-white/20 border-b-2 border-b-black text-zinc-100 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPinHidden ? <Eye className="w-4 h-4 text-teal-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Crisp Square QR Code Container Component */}
            <div className="shrink-0 flex flex-col items-center bg-white p-3.5 rounded-2xl shadow-xl border-[1.5px] border-zinc-800 border-t-2 border-t-white/40 border-b-4 border-b-black text-zinc-950">
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center relative">
                {/* Visual SVG QR Code Matrix */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-950 fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="3" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="9" y="9" width="12" height="12" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="3" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="79" y="9" width="12" height="12" />

                  <rect x="0" y="70" width="30" height="30" rx="3" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="9" y="79" width="12" height="12" />

                  {/* Dense pattern elements */}
                  <rect x="36" y="8" width="8" height="8" />
                  <rect x="48" y="8" width="14" height="8" />
                  <rect x="36" y="24" width="26" height="8" />
                  <rect x="8" y="38" width="8" height="24" />
                  <rect x="24" y="38" width="14" height="14" />
                  <rect x="44" y="38" width="12" height="12" />
                  <rect x="62" y="38" width="30" height="8" />
                  <rect x="38" y="56" width="24" height="16" />
                  <rect x="70" y="56" width="22" height="12" />
                  <rect x="38" y="78" width="14" height="14" />
                  <rect x="58" y="78" width="34" height="14" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase font-mono tracking-wider mt-1 text-zinc-900">
                Scan to Join
              </span>
            </div>

          </div>

          {/* Center Workspace: Active Player Tally & Symmetrical Connected Players Grid */}
          <div className="my-6 flex-1 flex flex-col justify-start space-y-4">
            
            {/* Active Player Tally: "1 of 300 players:" */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black font-mono text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{players.length} of 300 players connected:</span>
              </h3>

              {/* Add Simulated Player Trigger */}
              <form onSubmit={handleManualAddPlayer} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Invite name..."
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border-[1.5px] border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none w-28 sm:w-36 focus:border-teal-400"
                />
                <button
                  type="submit"
                  title="Simulate Player Connection"
                  className="p-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white cursor-pointer border-t border-white/20 border-b-2 border-teal-900 active:translate-y-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Symmetrical Connected Players Matrix with 3D Bezel Surface Physics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[380px] p-2 scrollbar-thin">
              {players.map(player => (
                <div
                  key={player.id}
                  className="relative p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-[1.5px] border-zinc-800 border-t-2 border-t-white/20 border-b-4 border-b-black shadow-xl hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(45,212,191,0.2)] transition-all duration-200 flex flex-col items-center justify-center text-center group"
                >
                  {/* Host Suffix Badge */}
                  {player.isHost && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/50">
                      HOST
                    </span>
                  )}

                  {/* Circular Connection Bubble with Bold High-Contrast Solid White Characters */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-sky-600 to-teal-500 border-2 border-zinc-700 shadow-lg flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <span className="text-white font-black text-base sm:text-lg font-mono tracking-tight drop-shadow-md">
                      {getChipLabel(player.name)}
                    </span>
                  </div>

                  {/* Player Avatar Chip Name (Pure White Text) */}
                  <div className="w-full text-center px-1 mb-2">
                    <span className="text-white font-black text-xs sm:text-sm truncate block drop-shadow-xs">
                      {player.name}
                    </span>
                  </div>

                  {/* Bright Green "Ready" Sub-Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 text-[10px] sm:text-[11px] font-mono font-black shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ready</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Sticky Base Button: Prominent Wide 3D Raised "Start game" (Yellow/Gold Theme) */}
          <div className="pt-4 mt-auto">
            <button
              type="button"
              id="btn-lobby-start-game"
              onClick={onStartGame}
              className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-black text-lg sm:text-xl tracking-wider uppercase border-[1.5px] border-amber-600 border-t-2 border-t-white/60 border-b-4 border-b-amber-950 shadow-2xl shadow-amber-500/30 active:translate-y-1 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Start game</span>
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT CONTROL MODULE (ADVANCED SETTINGS SIDEBAR)         */}
        {/* ======================================================== */}
        <div 
          id="lobby-advanced-settings-sidebar"
          className="flex-[2] bg-zinc-950/85 border-[1.5px] border-zinc-800 border-t-2 border-t-white/20 border-b-4 border-b-black rounded-3xl p-6 shadow-2xl flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="space-y-6">
            
            {/* Header Title in Pure White */}
            <div className="flex items-center justify-between border-b-[1.5px] border-zinc-800 pb-3">
              <h3 className="text-sm font-black uppercase font-mono tracking-wider text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Room Settings</span>
              </h3>
              <span className="text-[11px] font-mono text-teal-400 font-black">
                Multiplayer 3.0
              </span>
            </div>

            {/* SECTION 1: DYNAMIC SOUND SLIDERS WITH NEON TRACKING FILLS */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-black font-mono text-white tracking-wider">
                Sound Channels
              </h4>

              {/* Music Slider: Neon Cyan */}
              <NeonSoundSlider
                label="Music"
                value={soundMusic}
                onChange={setSoundMusic}
                accent="cyan"
              />

              {/* YouTube Slider: Neon Orange */}
              <NeonSoundSlider
                label="YouTube Stream"
                value={soundYoutube}
                onChange={setSoundYoutube}
                accent="orange"
              />

              {/* Voice Slider: Neon Blue */}
              <NeonSoundSlider
                label="Voice / Dictation"
                value={soundVoice}
                onChange={setSoundVoice}
                accent="blue"
              />

              {/* Effects Slider: Neon Purple */}
              <NeonSoundSlider
                label="Sound Effects"
                value={soundEffects}
                onChange={setSoundEffects}
                accent="purple"
              />
            </div>

            {/* SECTION 2: GAMEPLAY & SAFETY CHECKBOXES IN PURE WHITE */}
            <div className="space-y-2 pt-2 border-t-[1.5px] border-zinc-800">
              <h4 className="text-xs uppercase font-black font-mono text-white tracking-wider mb-2">
                Gameplay &amp; Safety Controls
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'teamMode', label: 'Team mode' },
                  { key: 'hideLeaderboard', label: 'Hide leaderboard' },
                  { key: 'muteSound', label: 'Mute sound' },
                  { key: 'onlySafePlayerNames', label: 'Only safe player names' },
                  { key: 'hideIncorrectTypeAnswers', label: 'Hide incorrect type-answers' },
                  { key: 'dontReadOutPlayerNames', label: 'Don’t read out player names' },
                  { key: 'banKickedPlayers', label: 'Ban kicked players' }
                ].map(item => {
                  const isChecked = Boolean(settings[item.key as keyof LobbySettings]);
                  return (
                    <label
                      key={item.key}
                      className="p-2.5 rounded-xl bg-zinc-900/90 border-[1.5px] border-zinc-800 border-t-2 border-t-white/10 border-b-2 border-b-black hover:bg-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-3 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSetting(item.key as keyof LobbySettings)}
                        className="rounded border-zinc-700 text-teal-400 focus:ring-teal-400 accent-teal-400 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-zinc-100 font-bold text-xs">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: KICK PLAYERS LEDGER WITH HIGH-CONTRAST WHITE TEXT & BRIGHT CYAN NODES */}
            <div className="space-y-2 pt-2 border-t-[1.5px] border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-black font-mono text-white tracking-wider">
                  Kick Players Ledger
                </h4>
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  {selectedPlayerIds.length} selected
                </span>
              </div>

              {/* Vertical Directory List Box detailing active connected member strings */}
              <div className="max-h-36 overflow-y-auto bg-zinc-950 rounded-xl p-2 border-[1.5px] border-zinc-800 border-t-2 border-t-white/10 border-b-2 border-b-black space-y-1.5 text-xs font-mono scrollbar-thin">
                {players.map(p => {
                  const isSelected = selectedPlayerIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPlayerForKick(p.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-rose-950/90 text-rose-100 border border-rose-600 shadow-sm' 
                          : 'hover:bg-zinc-900 text-zinc-100 bg-zinc-950/60 border border-zinc-800/80'
                      }`}
                    >
                      <span className="font-bold text-zinc-100 text-xs truncate max-w-[170px]">
                        {p.name}
                      </span>
                      <span 
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900 hover:text-cyan-200'
                        }`}
                      >
                        {isSelected ? '✓ Marked' : 'Select'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: "Kick selected players" */}
              <button
                type="button"
                id="btn-kick-selected-players"
                onClick={handleExecuteKick}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-rose-950/90 hover:text-rose-100 hover:border-rose-600 border-[1.5px] border-zinc-800 border-t-2 border-t-white/10 border-b-3 border-b-black text-zinc-300 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-2"
              >
                <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                <span>Kick selected players</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
