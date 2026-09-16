'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { Compass, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentStep, resetAll, completedStepIds, roadmap } = useAdmission();
  const progressPercent = Math.round(((currentStep - 1) / 6) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">UniPath</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">AI 2.0</span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Персональный маршрут поступления в университет
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-700">Прогресс маршрута</div>
              <div className="text-[11px] text-slate-400">Этап {currentStep} из 7 ({progressPercent}%)</div>
            </div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={resetAll}
            title="Сбросить прогресс и начать заново"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Сбросить</span>
          </button>
        </div>
      </div>
    </header>
  );
};