'use client';

import React, { useState } from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { MatchTier } from '../../data/types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  BookmarkCheck,
  Check
} from 'lucide-react';

export const Step4Recommendations: React.FC = () => {
  const { 
    matches, 
    selectedUniIds, 
    toggleSelectUni, 
    targetUniId, 
    setTargetUniId, 
    setCurrentStep 
  } = useAdmission();

  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | MatchTier>('ALL');

  const filteredMatches = activeTierFilter === 'ALL'
    ? matches
    : matches.filter(m => m.tier === activeTierFilter);

  const getTierBadge = (tier: MatchTier) => {
    switch (tier) {
      case 'Safety':
        return {
          label: 'Safety (Высокая надежность)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'Target':
        return {
          label: 'Target (Твой реальный уровень)',
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'Reach':
        return {
          label: 'Reach (Амбициозная цель)',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
        };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 4 из 7 • Рекомендации университетов
        </div>
        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Топ программ с персональным объяснением
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Подобрано минимум 3 подходящих варианта с расчетом шансов и доступных грантов.
            </p>
          </div>

          {/* Быстрые фильтры по корзинам */}
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {(['ALL', 'Safety', 'Target', 'Reach'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTierFilter(tier)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  activeTierFilter === tier
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tier === 'ALL' ? 'Все вузы' : tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Список карточек */}
      <div className="grid gap-6">
        {filteredMatches.slice(0, 6).map((match) => {
          const { university: uni, matchScore, tier, matchReasons, riskFactors, scholarshipAdvice } = match;
          const tierInfo = getTierBadge(tier);
          const isSelectedForComparison = selectedUniIds.includes(uni.id);
          const isTargetUni = targetUniId === uni.id;

          return (
            <div
              key={uni.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isTargetUni
                  ? 'border-blue-600 bg-white shadow-lg ring-2 ring-blue-600/30'
                  : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="grid gap-6 p-6 sm:grid-cols-12">
                {/* Левая колонка: бренд, название, статус */}
                <div className="sm:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl">{uni.logo}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {uni.country} • {uni.city}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${tierInfo.bg}`}>
                      {tierInfo.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {uni.ranking}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {uni.name}
                  </h3>

                  {/* Почему подходит */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>Почему этот вариант подходит тебе:</span>
                    </div>
                    <ul className="space-y-1">
                      {matchReasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Риски если есть */}
                  {riskFactors.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>На что обратить внимание (зоны риска):</span>
                      </div>
                      <ul className="space-y-1">
                        {riskFactors.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Стипендиальный совет */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
                    <span className="font-semibold text-blue-700">Финансирование: </span>
                    {scholarshipAdvice}
                  </div>
                </div>

                {/* Правая колонка: метрики и действия */}
                <div className="flex flex-col justify-between border-t border-slate-100 pt-4 sm:col-span-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-400">Индекс соответствия</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-blue-600">{matchScore}%</span>
                        <span className="text-xs text-slate-500">Match</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Стоимость:</span>
                        <span className="font-bold text-slate-900">
                          {uni.tuitionUsdPerYear === 0 ? 'Грант ($0)' : `$${uni.tuitionUsdPerYear.toLocaleString()}/г`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Дедлайн:</span>
                        <span className="font-bold text-slate-900">{uni.fallDeadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Мин. IELTS:</span>
                        <span className="font-bold text-slate-900">{uni.minIelts}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <a
                      href={uni.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <span>Официальный сайт</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleSelectUni(uni.id)}
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all ${
                        isSelectedForComparison
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>{isSelectedForComparison ? 'В сравнении ✓' : '+ В сравнение'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetUniId(uni.id);
                        setCurrentStep(6);
                      }}
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                        isTargetUni
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      <span>{isTargetUni ? 'Целевой вуз (выбран)' : 'Выбрать для Roadmap'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Навигация */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>К диагностике</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(5)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
          >
            <Layers className="h-4 w-4" />
            <span>Сравнить выбранные ({selectedUniIds.length})</span>
          </button>

          <button
            onClick={() => setCurrentStep(6)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            <span>Перейти к Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};