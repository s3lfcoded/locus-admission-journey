'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';

export const Step6Roadmap: React.FC = () => {
  const { 
    roadmap, 
    toggleCompleteStep, 
    targetUniversity, 
    setCurrentStep 
  } = useAdmission();

  const completedCount = roadmap.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / roadmap.length) * 100);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'экзамены':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'документы':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'дедлайны':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 6 из 7 • Интерактивный Roadmap
        </div>
        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Пошаговый план поступления
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Сформирован под целевой университет: <span className="font-bold text-slate-900">{targetUniversity?.name}</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-right">
            <div className="text-xs text-slate-500">Выполнено шагов</div>
            <div className="text-base font-bold text-slate-900">
              {completedCount} из {roadmap.length} ({progressPercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* Таймлайн шагов */}
      <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6 sm:ml-8 sm:pl-8">
        {roadmap.map((step, idx) => {
          return (
            <div key={step.id} className="relative group">
              {/* Круг на линии */}
              <button
                type="button"
                onClick={() => toggleCompleteStep(step.id)}
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                  step.completed
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                    : 'border-slate-300 bg-white text-slate-400 group-hover:border-blue-500'
                }`}
                title={step.completed ? 'Отметить как невыполненный' : 'Отметить как выполненный'}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>

              {/* Карточка шага */}
              <div
                className={`rounded-2xl border p-5 transition-all ${
                  step.completed
                    ? 'border-emerald-200 bg-emerald-50/30 opacity-80'
                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getCategoryColor(step.category)}`}>
                      {step.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Шаг {idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Дедлайн: {step.deadlineDate} ({step.timeRemaining})</span>
                  </div>
                </div>

                <h3 className={`mt-2.5 text-base font-bold sm:text-lg ${
                  step.completed ? 'line-through text-slate-500' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>

                <p className="mt-1 text-xs text-slate-600 sm:text-sm leading-relaxed">
                  {step.description}
                </p>

                {step.links && step.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.links.map((lnk, i) => (
                      <a
                        key={i}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <span>{lnk.title}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Навигация */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>К выбору вузов</span>
        </button>

        <button
          onClick={() => setCurrentStep(7)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <span>Фокус на следующем шаге</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};