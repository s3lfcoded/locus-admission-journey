'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Lightbulb,
  Coins,
  TrendingUp
} from 'lucide-react';

export const Step3Diagnostic: React.FC = () => {
  const { diagnostic, profile, setCurrentStep } = useAdmission();

  const getStatusBadge = () => {
    switch (diagnostic.overallStrength) {
      case 'высокая':
        return {
          label: 'Высокая конкурентоспособность',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          desc: 'Твой профиль открывает возможность подачи на полные гранты и топовые программы.',
        };
      case 'требует_усиления':
        return {
          label: 'Требует точечного усиления',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          desc: 'Есть узкие места в тестах или оценках, которые нужно компенсировать стратегией.',
        };
      default:
        return {
          label: 'Уверенный базовый уровень',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          desc: 'Хороший баланс оценок и бюджета. Доступны сильные региональные и европейские вузы.',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 3 из 7 • Диагностика профиля
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Честная оценка твоих шансов и рисков
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Мы проанализировали твои академические метрики, языковой балл и бюджетные рамки.
        </p>
      </div>

      {/* Главный бейдж статуса */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Общий статус кандидата
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-sm font-bold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500 sm:max-w-xs sm:text-right">
            {status.desc}
          </div>
        </div>
      </div>

      {/* SWOT: Сильные стороны и Узкие места */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Сильные стороны */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold">Сильные стороны профиля</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {diagnostic.strongPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Узкие места (Bottlenecks) */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold">Зоны риска и ограничения</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {diagnostic.bottlenecks.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Совет и Стипендии */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Lightbulb className="h-5 w-5 text-indigo-600" />
            <h4 className="text-sm font-bold">Стратегический совет</h4>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {diagnostic.keyAdvice}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Coins className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-bold">Доступность грантов и скидок</h4>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {diagnostic.scholarshipEligibility}
          </p>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Изменить анкету</span>
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <span>Подобрать подходящие вузы</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};