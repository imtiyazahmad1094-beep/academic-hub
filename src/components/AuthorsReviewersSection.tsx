import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Award, 
  Mail, 
  Building2, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  X, 
  Sparkles 
} from 'lucide-react';
import { AcademicPerson } from '../types';
import { TranslationDict } from '../utils/translations';

interface AuthorsReviewersSectionProps {
  persons: AcademicPerson[];
  onAddPerson: (person: AcademicPerson) => void;
  t: TranslationDict;
}

export const AuthorsReviewersSection: React.FC<AuthorsReviewersSectionProps> = ({
  persons,
  onAddPerson,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Person Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Author' | 'Reviewer' | 'Program Chair'>('Reviewer');
  const [institution, setInstitution] = useState('');
  const [hIndex, setHIndex] = useState(25);
  const [expertise, setExpertise] = useState('Quantum Error Correction, AI');

  const filtered = persons.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'all' || p.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const colors = [
      'from-sky-400 to-indigo-600',
      'from-emerald-400 to-teal-600',
      'from-amber-400 to-orange-500',
      'from-purple-400 to-pink-600',
      'from-cyan-400 to-blue-600'
    ];

    const newPerson: AcademicPerson = {
      id: `person-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      institution: institution.trim() || 'Global Academic Institute',
      hIndex: Number(hIndex) || 15,
      assignedReviewsCount: 0,
      expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };

    onAddPerson(newPerson);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setInstitution('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div 
        className="section-box-glass section-box-authors-reviewers p-6 sm:p-7 border border-rose-600/40 shadow-[0_0_15px_rgba(225,29,72,0.15)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Crimson Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
            <Users className="w-3.5 h-3.5 text-rose-600" />
            <span>Academic Faculty &amp; Peer Board</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white neon-glow-crimson">
            {t.authorsReviewers}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
            Manage symposium chairs, peer review referees, and corresponding authors.
          </p>
        </div>

        <button
          id="btn-add-scholar"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95 self-start sm:self-auto relative z-10"
          style={{ borderRadius: '12px' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Scholar</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div 
        className="section-box-glass p-4 border border-rose-600/30 shadow-[0_0_10px_rgba(225,29,72,0.08)] flex flex-wrap items-center gap-3"
        style={{ borderRadius: '12px' }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-scholars"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scholars, institutions, fields of expertise..."
            className="w-full pl-9 pr-3 py-2 bg-white/90 dark:bg-slate-800/90 border border-rose-500/30 focus:border-rose-500 text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            style={{ borderRadius: '10px' }}
          />
        </div>

        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="px-3 py-2 bg-white/90 dark:bg-slate-800/90 border border-rose-500/30 focus:border-rose-500 text-xs font-medium cursor-pointer outline-none text-slate-800 dark:text-slate-200"
          style={{ borderRadius: '10px' }}
        >
          <option value="all">All Academic Roles</option>
          <option value="Program Chair">Program Chairs</option>
          <option value="Reviewer">Peer Reviewers</option>
          <option value="Author">Authors</option>
        </select>
      </div>

      {/* Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(person => {
          const isChair = person.role === 'Program Chair';
          const isReviewer = person.role === 'Reviewer';
          const isAuthor = !isChair && !isReviewer;

          let cardContainerClasses = '';
          let nameClasses = '';
          let roleBadgeClasses = '';
          let tagClasses = '';
          let borderDividerClasses = '';

          if (isChair) {
            // Program Chair: Prominent, distinctive magenta/fuchsia border layout with matching background hue layer
            cardContainerClasses = 'border-[1.5px] border-fuchsia-500/50 dark:border-fuchsia-500/60 bg-fuchsia-50/85 dark:bg-fuchsia-950/40 shadow-[0_0_16px_rgba(217,70,239,0.18)] hover:shadow-[0_0_22px_rgba(217,70,239,0.28)]';
            nameClasses = 'text-fuchsia-950 dark:text-fuchsia-100 drop-shadow-[0_0_6px_rgba(217,70,239,0.2)]';
            roleBadgeClasses = 'bg-fuchsia-100 dark:bg-fuchsia-900/70 text-fuchsia-900 dark:text-fuchsia-200 border border-fuchsia-300 dark:border-fuchsia-700';
            tagClasses = 'bg-white/80 dark:bg-fuchsia-900/40 text-fuchsia-900 dark:text-fuchsia-200 border border-fuchsia-200 dark:border-fuchsia-800';
            borderDividerClasses = 'border-fuchsia-300/50 dark:border-fuchsia-800/60';
          } else if (isReviewer) {
            // Reviewer: Clean mint/emerald green border container with high-visibility tracking text blocks
            cardContainerClasses = 'border-[1.5px] border-emerald-500/50 dark:border-emerald-500/60 bg-emerald-50/85 dark:bg-emerald-950/40 shadow-[0_0_16px_rgba(16,185,129,0.16)] hover:shadow-[0_0_22px_rgba(16,185,129,0.26)]';
            nameClasses = 'text-emerald-950 dark:text-emerald-100 drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]';
            roleBadgeClasses = 'bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700';
            tagClasses = 'bg-white/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800';
            borderDividerClasses = 'border-emerald-300/50 dark:border-emerald-800/60';
          } else {
            // Author: Isolated sky-blue border box with deep cerulean typography accents
            cardContainerClasses = 'border-[1.5px] border-sky-500/50 dark:border-sky-500/60 bg-sky-50/85 dark:bg-sky-950/40 shadow-[0_0_16px_rgba(14,165,233,0.16)] hover:shadow-[0_0_22px_rgba(14,165,233,0.26)]';
            nameClasses = 'text-sky-950 dark:text-sky-100 drop-shadow-[0_0_6px_rgba(14,165,233,0.2)]';
            roleBadgeClasses = 'bg-sky-100 dark:bg-sky-900/70 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700';
            tagClasses = 'bg-white/80 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800';
            borderDividerClasses = 'border-sky-300/50 dark:border-sky-800/60';
          }

          return (
            <div
              key={person.id}
              className={`section-box-glass p-5 transition-all space-y-4 flex flex-col justify-between ${cardContainerClasses}`}
              style={{ borderRadius: '12px' }}
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${person.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}>
                    {person.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-sm font-bold truncate ${nameClasses}`}>
                      {person.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium mt-0.5">
                      {person.institution}
                    </p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${roleBadgeClasses}`}>
                      {person.role}
                    </span>
                  </div>
                </div>

                {/* Expertise */}
                <div className="space-y-1.5 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Domain Expertise
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {person.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${tagClasses}`}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`pt-3 border-t ${borderDividerClasses} flex items-center justify-between text-xs`}>
                <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>h-index: {person.hIndex}</span>
                </div>

                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {person.assignedReviewsCount} reviews assigned
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Scholar Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md glass-popup-modal rounded-3xl shadow-2xl overflow-hidden my-auto border border-white/90 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Academic Faculty</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePerson} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name &amp; Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Prof. Kenneth Vance, Ph.D."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Academic Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vance@cambridge.ac.uk"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                  >
                    <option value="Reviewer">Reviewer</option>
                    <option value="Program Chair">Program Chair</option>
                    <option value="Author">Author</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    h-index Score
                  </label>
                  <input
                    type="number"
                    value={hIndex}
                    onChange={e => setHIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="MIT Computer Science & AI Lab"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Expertise (comma separated)
                </label>
                <input
                  type="text"
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  placeholder="Quantum Algorithms, Neuromorphic AI"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Save Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
