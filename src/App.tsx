import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { questions } from './data';
import { Question, QuizMode } from './types';

type ViewState = 'dashboard' | 'quiz' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [quizContext, setQuizContext] = useState<{ mode: QuizMode, title: string, list: Question[] } | null>(null);
  const [result, setResult] = useState<{ score: number, total: number, newWrongCount: number } | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  // Storage
  const [wrongRecords, setWrongRecords] = useLocalStorage<string[]>('ais_wrong_records', []);
  const [colorTheme, setColorTheme] = useLocalStorage<string>('ais_color_theme', 'amber');
  const [fontTheme, setFontTheme] = useLocalStorage<string>('ais_font_theme', 'serif');
  const [appearance, setAppearance] = useLocalStorage<string>('ais_appearance', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
    document.documentElement.setAttribute('data-font', fontTheme);
    document.documentElement.setAttribute('data-mode', appearance);
  }, [colorTheme, fontTheme, appearance]);

  // Shuffle array utility
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleStartQuiz = (mode: QuizMode, title: string, categoryFilter?: string) => {
    let selectedQuestions: Question[] = [];

    if (mode === 'practice') {
      selectedQuestions = questions.filter(q => !categoryFilter || q.category === categoryFilter);
    } else if (mode === 'exam') {
      const filtered = categoryFilter ? questions.filter(q => q.category === categoryFilter) : questions;
      const singleQ = shuffleArray(filtered.filter(q => q.type === 'single')).slice(0, 50);
      const multipleQ = shuffleArray(filtered.filter(q => q.type === 'multiple')).slice(0, 30);
      const booleanQ = shuffleArray(filtered.filter(q => q.type === 'boolean')).slice(0, 20);
      selectedQuestions = [...singleQ, ...multipleQ, ...booleanQ];
    } else if (mode === 'review') {
      selectedQuestions = questions.filter(q => wrongRecords.includes(q.id));
    }

    if (selectedQuestions.length === 0) {
      alert("没有找到相关题目！");
      return;
    }

    setQuizContext({ mode, title, list: selectedQuestions });
    setView('quiz');
  };

  const handleFinishQuiz = (score: number, wrongIds: string[]) => {
    if (wrongIds.length > 0) {
      setWrongRecords(prev => {
        const set = new Set([...prev, ...wrongIds]);
        return Array.from(set);
      });
    }

    if (quizContext?.mode === 'review') {
      setWrongRecords(prev => {
        const currentListIds = quizContext.list.map(q => q.id);
        const rightIds = currentListIds.filter(id => !wrongIds.includes(id));
        return prev.filter(id => !rightIds.includes(id));
      });
    }

    setResult({
      score,
      total: quizContext?.list.length || 0,
      newWrongCount: wrongIds.length
    });
    setView('result');
  };

  const handleHome = () => {
    setView('dashboard');
    setQuizContext(null);
    setResult(null);
  };

  const handleReviewWrong = () => {
    handleStartQuiz('review', '错题巩固');
  };

  const colors = [
    { id: 'amber', label: 'Amber', hex: '#f59e0b' },
    { id: 'emerald', label: 'Emerald', hex: '#10b981' },
    { id: 'rose', label: 'Rose', hex: '#f43f5e' },
    { id: 'blue', label: 'Blue', hex: '#3b82f6' },
    { id: 'purple', label: 'Purple', hex: '#a855f7' }
  ];

  const fonts = [
    { id: 'sans', label: 'Sans-Serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' }
  ];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans transition-colors duration-300">
      <header className="bg-[var(--app-bg)] border-b border-[var(--app-border)] sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer gap-4" onClick={handleHome}>
            <span className="text-xl font-app italic tracking-widest text-primary-500">EXAM MIRROR</span>
            <span className="text-sm uppercase tracking-widest text-[var(--app-text-muted)] hidden sm:inline">演出经纪人备考</span>
          </div>
          
          <div className="flex items-center gap-4">
            {view === 'quiz' && quizContext && (
              <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--app-text-muted)] bg-[var(--app-card-hover)] border border-[var(--app-border)] px-3 py-1 rounded hidden md:block">
                {quizContext.title}
              </div>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 text-[var(--app-text-muted)] hover:text-primary-500 transition-colors rounded-full hover:bg-[var(--app-card-hover)]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsThemeMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg shadow-xl z-50 p-4 animate-scale-in transition-colors duration-300">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-muted)] mb-3 border-b border-[var(--app-border)] pb-2">Appearance</h3>
                    <div className="flex gap-2 mb-4">
                      {[{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }].map(a => (
                        <button
                          key={a.id}
                          onClick={() => setAppearance(a.id)}
                          className={`flex-1 py-1.5 text-sm rounded transition-colors ${
                            appearance === a.id 
                              ? 'bg-[var(--app-card-hover)] text-[var(--app-text)] font-medium border border-[var(--app-border)]' 
                              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg)]'
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-muted)] mb-3 border-b border-[var(--app-border)] pb-2">Theme Colors</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {colors.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setColorTheme(c.id)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${colorTheme === c.id ? `border-[var(--app-text)] scale-110` : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-muted)] mb-3 border-b border-[var(--app-border)] pb-2">Typography</h3>
                    <div className="space-y-2">
                      {fonts.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFontTheme(f.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            fontTheme === f.id 
                              ? 'bg-[var(--app-card-hover)] text-[var(--app-text)] font-medium' 
                              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg)] hover:text-[var(--app-text)]'
                          } ${
                            f.id === 'sans' ? 'font-sans' : f.id === 'serif' ? 'font-serif' : 'font-mono'
                          }`}
                        >
                          {f.label} {fontTheme === f.id && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="pb-16">
        {view === 'dashboard' && (
          <Dashboard 
            onStartQuiz={handleStartQuiz} 
            recordCount={wrongRecords.length} 
          />
        )}
        
        {view === 'quiz' && quizContext && (
          <QuizView 
            questions={quizContext.list} 
            title={quizContext.title} 
            onFinish={handleFinishQuiz}
            onBack={handleHome}
          />
        )}
        
        {view === 'result' && result && (
          <ResultView 
            score={result.score} 
            total={result.total} 
            wrongCount={result.newWrongCount}
            onHome={handleHome}
            onReviewWrong={handleReviewWrong}
          />
        )}
      </main>
    </div>
  );
}