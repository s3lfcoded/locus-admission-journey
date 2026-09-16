'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { 
  Sparkles, 
  FileText, 
  Activity, 
  GraduationCap, 
  Columns3, 
  Map, 
  CheckCircle2 
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Вход', icon: Sparkles },
  { id: 2, name: 'Анкета', icon: FileText },
  { id: 3, name: 'Диагностика', icon: Activity },
  { id: 4, name: 'Рекомендации', icon: GraduationCap },
  { id: 5, name: 'Сравнение', icon: Columns3 },
  { id: 6, name: 'Roadmap', icon: Map },
  { id: 7, name: 'Действие', icon: CheckCircle2 },
];

export const Stepper: React.FC = () => {
  const { currentStep, setCurrentStep } = useAdmission();

  return (
    <div className="w-full border-b border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`group flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 ring-2 ring-blue-600/20'
                      : isCompleted
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100/80'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-lg text-xs ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <span>{step.name}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div className={`hidden h-0.5 w-4 shrink-0 rounded-full md:block ${
                    isCompleted ? 'bg-blue-200' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};