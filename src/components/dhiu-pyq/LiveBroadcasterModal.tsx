import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Flame, 
  Heart, 
  Award, 
  Maximize2, 
  Minimize2,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface LiveBroadcasterModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: 'Examiner' | 'Scholar' | 'Candidate' | 'Student';
  text: string;
  time: string;
}

export const LiveBroadcasterModal: React.FC<LiveBroadcasterModalProps> = ({
  onClose,
  onShowToast,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'stream' | 'chat' | 'rubric'>('stream');
  const [likesCount, setLikesCount] = useState(3842);
  const [hasLiked, setHasLiked] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [waveHeights, setWaveHeights] = useState<number[]>([40, 65, 85, 30, 95, 70, 50, 80, 60, 90, 45, 75, 35, 88, 62, 48]);
  const [activeQuestion, setActiveQuestion] = useState(
    'Q3: Provide the Shafi’i jurisprudence distinction regarding modern digital financial exchange contracts.'
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Dr. Abdul Rahman (Chief Jurist)', role: 'Examiner', text: 'Candidate has articulated the Usul principle with excellent textual precision.', time: '10:42 AM' },
    { id: '2', sender: 'Prof. Tariq Al-Madani', role: 'Scholar', text: 'Notice the articulation of Makharij al-Huroof in the Surah Al-An’am recitation.', time: '10:43 AM' },
    { id: '3', sender: 'Zaid K. (Candidate 104)', role: 'Student', text: 'MashaAllah, very inspiring oral defense performance!', time: '10:44 AM' }
  ]);

  // Audio Visualizer Wave Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights(prev => 
        prev.map(() => Math.floor(Math.random() * 75) + 20)
      );
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You (Academic Candidate)',
      role: 'Candidate',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    onShowToast('💬 Live stream comment posted to board registry!');
  };

  const handleLike = () => {
    setLikesCount(prev => prev + 1);
    setHasLiked(true);
    onShowToast('❤️ Clapped & supported live oral candidate!');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      id="modal-live-broadcaster-stream"
    >
      <div className="w-full max-w-5xl bg-zinc-950 text-white rounded-3xl border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE BROADCASTER STREAM</span>
            </span>
            <span className="hidden sm:inline text-xs text-zinc-400 font-medium">
              Class 10 Viva Voce Central Board Session #2024-B
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>4,218 Live Viewers</span>
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Close Stream"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stream Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          
          {/* Main Stage & Simulated Live Video (2 Columns) */}
          <div className="lg:col-span-2 bg-black flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
            
            {/* Ambient Lighting Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Stage Video Screen Graphic */}
            <div className="relative z-10 w-full aspect-video rounded-2xl bg-gradient-to-br from-zinc-900 via-purple-950/40 to-zinc-900 border border-purple-500/30 flex flex-col justify-between p-4 sm:p-5 shadow-2xl overflow-hidden">
              
              {/* Top Video Overlay Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                    1080p60 • ULTRA HD
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-mono text-purple-300 font-bold border border-purple-500/30">
                    STUDIO 01
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-700">
                    SESSION TIME: 24:18
                  </span>
                </div>
              </div>

              {/* Central Visualizer & Stage Presence */}
              <div className="text-center space-y-4 py-2">
                <div className="inline-block relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.5)] mx-auto">
                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-purple-300">
                      <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 animate-pulse" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-[9px] font-bold text-black">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                    Oral Examination Tribunal
                  </h3>
                  <p className="text-xs text-purple-300 font-mono">
                    Candidate Oral Defense • Class 10 Capstone Assessment
                  </p>
                </div>

                {/* Real-time Audio Spectrum Wave */}
                <div className="flex items-end justify-center gap-1.5 h-12 pt-2 px-4">
                  {waveHeights.map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-purple-600 via-fuchsia-500 to-pink-400 transition-all duration-100"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Video Info & Active Ticker */}
              <div className="bg-black/70 backdrop-blur-md p-3 rounded-xl border border-purple-500/20 text-xs">
                <span className="text-pink-400 font-bold uppercase tracking-wider text-[10px] block">
                  Active Question under Evaluation:
                </span>
                <p className="text-zinc-200 font-medium truncate sm:whitespace-normal">
                  {activeQuestion}
                </p>
              </div>

            </div>

            {/* Broadcaster Stage Controls */}
            <div className="relative z-10 pt-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicOn 
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 hover:bg-purple-600/40' 
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
                  <span>{isMicOn ? 'Candidate Mic Active' : 'Mic Muted'}</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Stream Audio' : 'Mute Stream Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasLiked 
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-pink-400 border border-zinc-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
                  <span>Clap ({likesCount.toLocaleString()})</span>
                </button>

                <button
                  onClick={() => onShowToast('🔗 Broadcaster stream link copied to clipboard!')}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  title="Share Stream"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Chat & Board Commentary */}
          <div className="bg-zinc-900/90 flex flex-col justify-between h-full min-h-[380px]">
            
            {/* Tab Bar */}
            <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'stream' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveTab('rubric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'rubric' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Board Rubric
                </button>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Real-time
              </span>
            </div>

            {/* Chat Body */}
            {activeTab === 'stream' ? (
              <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[360px] text-xs">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{msg.sender}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          msg.role === 'Examiner' 
                            ? 'bg-rose-900/80 text-rose-300 border border-rose-700' 
                            : msg.role === 'Scholar' 
                            ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                            : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                        }`}>
                          {msg.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[360px] text-xs">
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1">
                  <div className="font-bold text-purple-300">Part I: Quranic Tajweed (25M)</div>
                  <p className="text-zinc-400 text-[11px]">Evaluation on Makharij, Sifaat, and continuous tartil recitation.</p>
                </div>
                <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-800/50 space-y-1">
                  <div className="font-bold text-pink-300">Part II: Classical Balaghah (25M)</div>
                  <p className="text-zinc-400 text-[11px]">Analysis of rhetoric devices, Badi', Ma'ani, and poetic meter.</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1">
                  <div className="font-bold text-purple-300">Part III: Usul al-Fiqh Defense (25M)</div>
                  <p className="text-zinc-400 text-[11px]">Resolving complex modern transactions and legal maxims.</p>
                </div>
                <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-800/50 space-y-1">
                  <div className="font-bold text-pink-300">Part IV: Capstone Thesis (25M)</div>
                  <p className="text-zinc-400 text-[11px]">Defense of Class 10 graduation dissertation and methodology.</p>
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type question or candidate encouragement..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px]">
            Official DHIU Central Board Broadcast Protocol • End-to-End Encrypted
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Exit Broadcaster
          </button>
        </div>

      </div>
    </div>
  );
};
