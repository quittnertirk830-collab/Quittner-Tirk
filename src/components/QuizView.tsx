import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizViewProps {
  questions: Question[];
  title: string;
  onFinish: (score: number, wrongIds: string[]) => void;
  onBack: () => void;
}

export default function QuizView({ questions, title, onFinish, onBack }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submittedIndexes, setSubmittedIndexes] = useState<Set<number>>(new Set());
  
  const question = questions[currentIndex];
  
  const selectedAnswers = answers[currentIndex] ?? (question?.type === 'multiple' ? [] : null);
  const isSubmitted = submittedIndexes.has(currentIndex);

  if (!question) {
    return null;
  }

  const handleOptionToggle = (val: any) => {
    if (isSubmitted) return;

    setAnswers(prev => {
      const current = prev[currentIndex];
      if (question.type === 'multiple') {
        let arr = current || [];
        if (arr.includes(val)) {
          arr = arr.filter((item: number) => item !== val);
        } else {
          arr = [...arr, val].sort();
        }
        return { ...prev, [currentIndex]: arr };
      } else {
        const nextAnswers = { ...prev, [currentIndex]: val };
        
        // Auto-submit for single / boolean
        setTimeout(() => {
          submitSpecificAnswer(nextAnswers[currentIndex]);
        }, 50);

        return nextAnswers;
      }
    });
  };

  const submitSpecificAnswer = (ansObj: any) => {
    let isCorrect = false;
    if (question.type === 'multiple') {
      const correctArr = question.correctAnswer as number[];
      const selectedArr = ansObj as number[];
      isCorrect = correctArr.length === selectedArr.length && correctArr.every(val => selectedArr.includes(val));
    } else {
      isCorrect = ansObj === question.correctAnswer;
    }

    setSubmittedIndexes(prev => new Set(prev).add(currentIndex));
    
    if (isCorrect && currentIndex < questions.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const handleSubmitQuestion = () => {
    if (selectedAnswers === null || (Array.isArray(selectedAnswers) && selectedAnswers.length === 0)) {
      alert("请先选择答案！");
      return;
    }

    submitSpecificAnswer(selectedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
    }
  };

  const answeredCount = questions.filter((_, idx) => {
    const ans = answers[idx];
    return ans !== undefined && ans !== null && (!Array.isArray(ans) || ans.length > 0);
  }).length;

  const handleFinishExam = () => {
    if (answeredCount < questions.length) {
      if (!window.confirm("还有题目未作答，确定要提前交卷吗？")) {
        return;
      }
    }
    
    let cCount = 0;
    const wIds: string[] = [];
    
    questions.forEach((q, idx) => {
      const selected = answers[idx];
      let isCorrect = false;
      
      if (selected !== undefined && selected !== null) {
        if (q.type === 'multiple') {
          const correctArr = q.correctAnswer as number[];
          const selectedArr = selected as number[];
          if (
            correctArr.length === selectedArr.length && 
            correctArr.every(val => selectedArr.includes(val))
          ) {
            isCorrect = true;
          }
        } else {
          isCorrect = selected === q.correctAnswer;
        }
      }
      
      if (isCorrect) {
        cCount++;
      } else {
        wIds.push(q.id);
      }
    });
    
    onFinish(cCount, wIds);
  };


  const renderOptions = () => {
    if (question.type === 'boolean') {
      const options = [
        { label: '对', value: true },
        { label: '错', value: false }
      ];
      
      return (
        <div className="space-y-4">
          {options.map((opt) => {
            const isSelected = selectedAnswers === opt.value;
            const isCorrectAnswer = isSubmitted && question.correctAnswer === opt.value;
            const isWrongSelection = isSubmitted && isSelected && !isCorrectAnswer;
            
            let btnClass = "group w-full text-left px-3 py-2 sm:py-3 rounded border transition-all ";
            
            if (!isSubmitted) {
              btnClass += isSelected 
                ? "border-primary-500 bg-primary-500/10 text-primary-500" 
                : "border-app-border bg-[var(--app-card)] hover:border-primary-900 hover:bg-[var(--app-card-hover)] text-[var(--app-text)]";
            } else {
              if (isCorrectAnswer) {
                btnClass += "border-green-900 bg-green-900/10 text-green-200";
              } else if (isWrongSelection) {
                btnClass += "border-red-900 bg-red-900/10 text-red-200";
              } else {
                btnClass += "border-app-border bg-[var(--app-card)] text-[var(--app-text-muted)] opacity-60";
              }
            }

            return (
              <button
                key={opt.label}
                onClick={() => handleOptionToggle(opt.value)}
                disabled={isSubmitted}
                className={btnClass}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded border mr-3 text-[10px] ${
                    !isSubmitted 
                      ? (isSelected ? 'border-primary-500 bg-primary-500/20 text-primary-500' : 'border-[var(--app-border)] text-[var(--app-text-muted)] group-hover:border-primary-500 group-hover:text-primary-500')
                      : (isCorrectAnswer ? 'border-green-500 bg-green-500 text-black font-bold' : isWrongSelection ? 'border-red-500 bg-red-500 text-black font-bold' : 'border-[var(--app-border)] text-[var(--app-text-muted)]')
                  }`}>
                    {isSubmitted && isCorrectAnswer && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                    {isSubmitted && isWrongSelection && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <span className="text-base font-medium text-left leading-relaxed">{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // Single or Multiple
    return (
      <div className="space-y-3">
        {question.options?.map((opt, idx) => {
          const isSelected = question.type === 'multiple' 
            ? Array.isArray(selectedAnswers) && selectedAnswers.includes(idx)
            : selectedAnswers === idx;
            
          const isCorrectAnswer = isSubmitted && (
            question.type === 'multiple'
              ? (question.correctAnswer as number[]).includes(idx)
              : question.correctAnswer === idx
          );
          
          const isWrongSelection = isSubmitted && isSelected && !isCorrectAnswer;

          let btnClass = "group w-full text-left p-2 sm:p-3 rounded border transition-all ";
          
          if (!isSubmitted) {
            btnClass += isSelected 
              ? "border-primary-500 bg-primary-500/10 text-primary-500" 
              : "border-app-border bg-[var(--app-card)] hover:border-primary-900 hover:bg-[var(--app-card-hover)] text-[var(--app-text)]";
          } else {
            if (isCorrectAnswer) {
              btnClass += "border-green-900 bg-green-900/10 text-green-200";
            } else if (isWrongSelection) {
              btnClass += "border-red-900 bg-red-900/10 text-red-200";
            } else {
              btnClass += "border-app-border bg-[var(--app-card)] text-[var(--app-text-muted)] opacity-60";
            }
          }

          const label = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <button
              key={idx}
              onClick={() => handleOptionToggle(idx)}
              disabled={isSubmitted}
              className={btnClass}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded border mr-3 text-[10px] ${
                  !isSubmitted 
                    ? (isSelected ? 'border-primary-500 bg-primary-500/20 text-primary-500' : 'border-[var(--app-border)] text-[var(--app-text-muted)] group-hover:border-primary-500 group-hover:text-primary-500')
                    : (isCorrectAnswer ? 'border-green-500 bg-green-500 text-black font-bold' : isWrongSelection ? 'border-red-500 bg-red-500 text-black font-bold' : 'border-[var(--app-border)] text-[var(--app-text-muted)]')
                }`}>
                  {label}
                </div>
                <span className="text-sm sm:text-base text-left pt-0.5 leading-relaxed">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-3 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-app-border">
        <button 
          onClick={onBack}
          className="text-app-text-muted hover:text-primary-500 flex items-center transition-colors uppercase tracking-widest text-xs"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
        <h2 className="text-base font-app text-app-text">{title}</h2>
        <div className="text-[10px] uppercase font-mono tracking-widest text-app-text-muted bg-app-card-hover border border-app-border px-3 py-1 rounded">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-app-card rounded-lg border border-app-border p-4 sm:p-8 mb-4 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-0.5 border border-app-border text-app-text-muted text-[9px] uppercase tracking-widest rounded bg-transparent">
            {question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '判断题'}
          </span>
          <span className="h-px flex-1 bg-[var(--app-border)]"></span>
          <span className="text-[10px] font-mono opacity-50 text-app-text-muted">{question.category}</span>
        </div>
        
        <h3 className="text-[15px] sm:text-lg font-app leading-snug mb-4 sm:mb-6 text-app-text">
          {question.text}
        </h3>

        {renderOptions()}
        
        {/* Explanation Area */}
        {isSubmitted && (() => {
          let isCorrect = false;
          let correctDisplay = '';
          
          if (question.type === 'boolean') {
            isCorrect = selectedAnswers === question.correctAnswer;
            correctDisplay = question.correctAnswer ? '对' : '错';
          } else if (question.type === 'multiple') {
            const correctArr = question.correctAnswer as number[];
            const selectedArr = (selectedAnswers || []) as number[];
            isCorrect = correctArr.length === selectedArr.length && correctArr.every(val => selectedArr.includes(val));
            correctDisplay = correctArr.map(idx => String.fromCharCode(65 + idx)).join(', ');
          } else {
            isCorrect = selectedAnswers === question.correctAnswer;
            correctDisplay = String.fromCharCode(65 + (question.correctAnswer as number));
          }

          return (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 border-l-4 rounded-r animate-fade-in ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <h4 className="text-sm font-bold text-green-500 uppercase flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    回答正确！
                  </h4>
                ) : (
                  <h4 className="text-sm font-bold text-red-500 uppercase flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    回答错误！正确答案是：{correctDisplay}
                  </h4>
                )}
              </div>
              
              <h4 className="text-[11px] sm:text-xs font-bold text-[var(--app-text)] uppercase tracking-widest mb-1 sm:mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 sm:mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                答案解析
              </h4>
              <div className="text-[13px] sm:text-sm leading-relaxed text-[var(--app-text)] font-app bg-[var(--app-card)] p-3 sm:p-4 rounded border border-[var(--app-border)]">
                {question.explanation ? (
                  <p>{question.explanation}</p>
                 ) : (
                  <p>无</p>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 bg-[var(--app-bg)] flex justify-between items-center py-3 mt-6 gap-2 flex-wrap border-t border-[var(--app-border)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-3 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] font-bold text-xs uppercase tracking-widest rounded hover:bg-[var(--app-card-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none text-center"
        >
          上一题
        </button>

        <div className="flex gap-2 flex-1 sm:flex-none justify-end">
          {(!isSubmitted && question.type === 'multiple') && (
            <button
              onClick={handleSubmitQuestion}
              className="px-4 py-3 bg-[var(--app-card-hover)] border border-[var(--app-border)] text-[var(--app-text)] font-bold uppercase tracking-widest text-xs hover:border-primary-500 hover:text-primary-500 rounded transition-all"
            >
              确认选项
            </button>
          )}

          {currentIndex < questions.length - 1 ? (
             <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-black font-bold uppercase tracking-widest text-xs hover:bg-primary-500 rounded transition-all flex items-center shadow-lg"
            >
              下一题
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
             <button
              onClick={handleFinishExam}
              className="px-6 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-500 rounded transition-all shadow-lg flex items-center"
            >
              交卷
            </button>
          )}
        </div>
      </div>

      {/* Navigation Grid */}
      <details className="mt-4 mb-20 group">
        <summary className="text-xs font-bold text-[var(--app-text-muted)] uppercase tracking-widest mb-4 flex justify-between items-center cursor-pointer list-none bg-[var(--app-card)] p-4 rounded border border-[var(--app-border)] hover:border-primary-500/50 transition-colors">
          <div className="flex items-center">
            <span>题目导航 (已答 {answeredCount} / 共 {questions.length} 题)</span>
            <svg className="w-4 h-4 ml-2 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleFinishExam();
            }}
            className="text-red-500 hover:text-red-400 font-bold transition-colors shadow-sm bg-red-500/10 px-3 py-1 rounded"
          >
            直接交卷
          </button>
        </summary>
        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-[repeat(16,minmax(0,1fr))] gap-2 p-4 bg-[var(--app-card)] rounded border border-[var(--app-border)]">
          {questions.map((q, idx) => {
            const currentAns = answers[idx];
            const isAnswered = currentAns !== undefined && currentAns !== null && (Array.isArray(currentAns) ? currentAns.length > 0 : true);
            const isCurrent = currentIndex === idx;
            const hasChecked = submittedIndexes.has(idx);

            let bgClass = "bg-[var(--app-card)] border-[var(--app-border)] text-[var(--app-text)]";
            if (isCurrent) {
              bgClass = "bg-primary-500/20 border-primary-500 text-primary-500";
            } else if (hasChecked) {
              bgClass = "bg-[var(--app-border)] border-[var(--app-border)] text-[var(--app-text-muted)] opacity-60";
            } else if (isAnswered) {
              bgClass = "bg-[var(--app-card-hover)] border-primary-500/50 text-[var(--app-text)]";
            }

            return (
               <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square flex items-center justify-center rounded text-xs font-mono font-medium border transition-colors hover:border-primary-500 hover:text-primary-500 ${bgClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
}
