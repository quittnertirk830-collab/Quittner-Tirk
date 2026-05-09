import React from 'react';

interface ResultViewProps {
  score: number;
  total: number;
  wrongCount: number;
  onHome: () => void;
  onReviewWrong: () => void;
}

export default function ResultView({ score, total, wrongCount, onHome, onReviewWrong }: ResultViewProps) {
  const percentage = Math.round((score / total) * 100);
  
  let resultMessage = '';
  if (percentage >= 90) resultMessage = '非常棒！你已经掌握了大部分知识点。';
  else if (percentage >= 60) resultMessage = '合格！继续努力，多加巩固错题。';
  else resultMessage = '还需努力！建议多刷题和复习课本知识。';

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6">
      <div className="bg-app-card rounded-lg border border-app-border overflow-hidden text-center p-10 animate-scale-in">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded border border-app-border bg-app-card-hover text-primary-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-app text-app-text mb-2">练习完成</h2>
        <p className="text-app-text-muted font-app italic mb-8">{resultMessage}</p>

        <div className="grid grid-cols-2 gap-4 mb-10 max-w-sm mx-auto">
          <div className="bg-app-card-hover/50 p-4 rounded border border-app-border">
            <div className="text-[10px] uppercase tracking-widest text-app-text-muted mb-1">正确率</div>
            <div className="text-3xl font-mono text-primary-500">{percentage}%</div>
          </div>
          <div className="bg-app-card-hover/50 p-4 rounded border border-app-border">
            <div className="text-[10px] uppercase tracking-widest text-app-text-muted mb-1">答对题目</div>
            <div className="text-3xl font-mono text-primary-500">{score} <span className="text-base font-sans font-normal text-app-text-muted">/ {total}</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onHome}
            className="w-full sm:w-auto px-8 py-3 bg-transparent border border-app-border text-app-text rounded text-xs font-bold uppercase tracking-widest hover:border-primary-900 hover:text-primary-500 transition-colors"
          >
            返回首页
          </button>
          
          {wrongCount > 0 && (
            <button
              onClick={onReviewWrong}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--app-card-hover)] border border-[var(--app-border)] text-primary-500 rounded text-xs font-bold uppercase tracking-widest hover:border-primary-500 transition-colors"
            >
              去巩固错题 ({wrongCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
