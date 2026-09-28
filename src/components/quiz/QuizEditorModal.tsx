import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { QuizItem, QuizQuestion, QuizCategory } from '../../types';

interface QuizEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuiz: (quiz: QuizItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuiz,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<QuizCategory>('Academic Defense');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-custom-1',
      question: '',
      correctAnswer: '',
      acceptedAnswers: [],
      options: ['', '', '', ''],
      mediaType: 'none',
      timeLimitSec: 30,
      points: 1000
    }
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-custom-${Date.now()}`,
        question: '',
        correctAnswer: '',
        acceptedAnswers: [],
        options: ['', '', '', ''],
        mediaType: 'none',
        timeLimitSec: 30,
        points: 1000
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      onShowToast('A quiz must contain at least one question', 'info');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: unknown) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Please enter a quiz title', 'error');
      return;
    }

    const validQuestions = questions.filter(q => q.question.trim() && q.correctAnswer.trim());
    if (validQuestions.length === 0) {
      onShowToast('Please complete at least one question with question text and correct answer', 'error');
      return;
    }

    // Format accepted answers
    const finalizedQuestions: QuizQuestion[] = validQuestions.map(q => ({
      ...q,
      acceptedAnswers: q.acceptedAnswers.length > 0 ? q.acceptedAnswers : [q.correctAnswer.trim()]
    }));

    const newQuiz: QuizItem = {
      id: `quiz-custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Custom academic interactive test module',
      coverImage,
      category,
      author: 'Academic Scholar',
      rating: 5.0,
      playsCount: 1,
      questionsCount: finalizedQuestions.length,
      isAiGenerated: false,
      pinCode: `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      questions: finalizedQuestions
    };

    onSaveQuiz(newQuiz);
    onShowToast(`Created quiz "${newQuiz.title}" successfully!`, 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="quiz-editor-modal-container"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/50 relative overflow-hidden animate-smooth-entry"
        style={{ borderRadius: '24px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                Create a quiz
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Play for free with up to 300 participants
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quiz Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Usul al-Fiqh Oral Defense & Qat’i Evidence"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Academic Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as QuizCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              >
                <option value="Academic Defense">Academic Defense</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Art & Literature">Art &amp; Literature</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="Languages">Languages</option>
                <option value="Science & Nature">Science &amp; Nature</option>
                <option value="Sports">Sports</option>
                <option value="Trivia">Trivia</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="High-speed oral defense and conceptual examination"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Question Builder List */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Questions ({questions.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {questions.map((q, idx) => (
              <div 
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Question #{idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter question prompt..."
                    value={q.question}
                    onChange={e => handleUpdateQuestion(idx, 'question', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Correct Answer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Standard evaluated answer"
                      value={q.correctAnswer}
                      onChange={e => handleUpdateQuestion(idx, 'correctAnswer', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Time Limit (Sec)
                    </label>
                    <select
                      value={q.timeLimitSec}
                      onChange={e => handleUpdateQuestion(idx, 'timeLimitSec', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
                    >
                      <option value={15}>15 Seconds (Sprint)</option>
                      <option value={25}>25 Seconds</option>
                      <option value={30}>30 Seconds (Standard)</option>
                      <option value={45}>45 Seconds (Defense)</option>
                      <option value={60}>60 Seconds (Complex)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sticky Action Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm border-t border-white/30 border-b-3 border-emerald-800 shadow-md shadow-emerald-500/20 active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"
            >
              Save &amp; Publish Quiz
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
