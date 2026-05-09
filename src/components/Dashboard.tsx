import React, { useState } from 'react';
import { QuizMode } from '../types';

interface DashboardProps {
  onStartQuiz: (mode: QuizMode, title: string, categoryFilter?: string) => void;
  recordCount: number;
}

export default function Dashboard({ onStartQuiz, recordCount }: DashboardProps) {
  const categories = [
    '思想政治与法律基础',
    '演出市场政策与经纪实务'
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-app tracking-widest text-app-text sm:text-5xl">
          演出经纪人资格证备考系统
        </h1>
        <p className="mt-4 text-lg text-app-text-muted font-app italic">
          全考点集训、章节练习、模拟考试及错题本
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 章节练习模块 */}
        <div className="bg-app-card rounded-lg border border-app-border hover:border-primary-900 hover:bg-app-card-hover transition-all">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded border border-app-border bg-app-card-hover flex items-center justify-center text-primary-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-app text-app-text">章节练习</h2>
            </div>
            <p className="text-app-text-muted font-app italic text-sm mb-6">按科目进行知识点针对性刷题，实时反馈解析。</p>
            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onStartQuiz('practice', `${cat} 练习`, cat)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-app-border rounded bg-app-bg hover:border-primary-900 transition-colors text-left group"
                >
                  <span className="font-app text-app-text group-hover:text-primary-500 transition-colors">{cat}</span>
                  <span className="text-app-text-muted text-[10px] font-mono group-hover:text-primary-500 transition-colors uppercase tracking-widest">START &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 模拟考试模块 */}
          <div className="bg-[var(--app-card)] rounded-lg border border-[var(--app-border)] hover:border-primary-900 hover:bg-[var(--app-card-hover)] transition-all p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded border border-[var(--app-border)] bg-[var(--app-card-hover)] flex items-center justify-center text-primary-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-app text-[var(--app-text)]">全真模拟考试</h2>
            </div>
            <p className="text-[var(--app-text-muted)] font-app italic text-sm mb-6">按科目严格遵循真实考试题量（50单选/30多选/20判断）组卷。</p>
            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onStartQuiz('exam', `${cat} 模拟考试`, cat)}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded bg-primary-600 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-primary-500 transition-colors"
                >
                  进入 {cat} 考场
                </button>
              ))}
            </div>
          </div>

          {/* 错题回顾模块 */}
          <div className="bg-[var(--app-card)] rounded-lg border border-[var(--app-border)] hover:border-primary-900 hover:bg-[var(--app-card-hover)] transition-all p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded border border-red-900/50 bg-red-900/10 flex items-center justify-center text-red-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-app text-[var(--app-text)]">错题回顾</h2>
            </div>
            <p className="text-[var(--app-text-muted)] font-app italic text-sm mb-6">
              针对性攻克薄弱环节。当前错题本收录：<span className="text-primary-500">{recordCount}</span> 题
            </p>
            <button
              onClick={() => onStartQuiz('review', '错题巩固')}
              disabled={recordCount === 0}
              className={`w-full flex justify-center items-center py-3 px-4 border rounded text-xs font-bold uppercase tracking-widest transition-colors ${
                recordCount > 0 
                  ? 'border-[var(--app-border)] bg-[var(--app-card-hover)] text-primary-500 hover:border-primary-500' 
                  : 'border-[var(--app-border)] bg-transparent text-[var(--app-text-muted)] cursor-not-allowed'
              }`}
            >
              {recordCount > 0 ? '消灭错题' : '暂无错题'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
