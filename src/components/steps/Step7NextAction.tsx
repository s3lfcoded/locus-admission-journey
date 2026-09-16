'use client';

import React, { useState } from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { getNextAction } from '../../lib/roadmapGenerator';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  RotateCcw,
  Trophy,
  Check,
  ExternalLink,
  Flame
} from 'lucide-react';

export const Step7NextAction: React.FC = () => {
  const { 
    roadmap, 
    toggleCompleteStep, 
    targetUniversity, 
    setCurrentStep, 
    resetAll 
  } = useAdmission();

  const nextStep = getNextAction(roadmap);
  const completedCount = roadmap.filter((s) => s.completed).length;
  const isAllDone = completedCount === roadmap.length;
  const [copied, setCopied] = useState(false);

  const handleToggle = (stepId: string) => {
    toggleCompleteStep(stepId);
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 7 из 7 • Твое следующее действие
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Фокус дня: один конкретный шаг вперед
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Поступление — это марафон. Не пытайся делать все сразу: сосредоточься на ближайшей задаче.
        </p>
      </div>

      {isAllDone ? (
        /* Экран триумфа */
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-lg sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Trophy className="h-10 w-10 animate-bounce" />
          </div>
          <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
            Поздравляем! Все этапы маршрута закрыты!
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Твоя заявка в <span className="font-bold text-slate-900">{targetUniversity?.name}</span> полностью укомплектована и готова к отправке.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCurrentStep(6)}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Пересмотреть весь Roadmap
            </button>
            <button
              onClick={resetAll}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Создать маршрут для другого вуза
            </button>
          </div>
        </div>
      ) : nextStep ? (
        /* Фокусная карточка следующего шага */
        <div className="overflow-hidden rounded-3xl border-2 border-blue-600 bg-white shadow-xl ring-4 ring-blue-600/10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-300 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Ближайший приоритет
                </span>
              </div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Дедлайн: {nextStep.deadlineDate}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  Категория: {nextStep.category}
                </span>
                <h3 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
                  {nextStep.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(nextStep.id)}
                className="group flex flex-col items-center gap-1 shrink-0"
                title="Нажми, чтобы отметить выполнение"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-all group-hover:border-blue-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-105">
                  <Check className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">
                  Отметить
                </span>
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {nextStep.description}
            </p>

            {nextStep.links && nextStep.links.length > 0 && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="text-xs font-bold text-blue-900">Полезные ссылки для выполнения:</div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {nextStep.links.map((lnk, idx) => (
                    <a
                      key={idx}
                      href={lnk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50"
                    >
                      <span>{lnk.title}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Осталось времени до дедлайна: <strong>{nextStep.timeRemaining}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(nextStep.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Я выполнил этот шаг!</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Прогресс-бар и кнопки */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Общий прогресс маршрута:</span>
          <span className="text-xs font-bold text-blue-600">{completedCount} из {roadmap.length} шагов</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.round((completedCount / roadmap.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Навигация */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          onClick={() => setCurrentStep(6)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад к полной шкале Roadmap</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
        >
          <Share2 className="h-4 w-4" />
          <span>{copied ? 'Ссылка скопирована!' : 'Поделиться маршрутом'}</span>
        </button>
      </div>
    </div>
  );
};