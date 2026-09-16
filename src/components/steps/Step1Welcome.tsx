'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { EducationTarget } from '../../data/types';
import { ArrowRight, ShieldCheck, Zap, Compass, CheckCircle } from 'lucide-react';

const AUDIENCES: { target: EducationTarget; title: string; desc: string; icon: string }[] = [
  {
    target: 'high_school_9_11',
    title: 'Ученик 9–11 класса',
    desc: 'Выбор профиля, подготовка к тестам и стратегия на грант',
    icon: '🎒',
  },
  {
    target: 'bachelor_kz',
    title: 'Абитуриент бакалавриата в РК',
    desc: 'Госгранты РК, NUET, олимпиады КБТУ, SDU, МУИТ',
    icon: '🇰🇿',
  },
  {
    target: 'abroad_study',
    title: 'Поступление за рубеж',
    desc: 'Европа, Корея, Турция, США с полным или частичным грантом',
    icon: '✈️',
  },
];

export const Step1Welcome: React.FC = () => {
  const { profile, updateProfile, setCurrentStep } = useAdmission();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Zap className="h-3.5 w-3.5" />
          <span>Кейс 02 • Персональный маршрут поступления</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Твой понятный маршрут в университет, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            а не еще один случайный список
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Превращаем твои оценки, баллы тестов и бюджет в пошаговый навигатор: куда подавать, почему это твой вариант и какое действие сделать прямо сегодня.
        </p>
      </div>

      {/* Выбор роли */}
      <div>
        <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Шаг 1 из 7: Выбери свой текущий статус
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {AUDIENCES.map((item) => {
            const isSelected = profile.target === item.target;
            return (
              <button
                key={item.target}
                type="button"
                onClick={() => updateProfile({ target: item.target })}
                className={`relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10 ring-2 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="mt-3 font-bold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
                {isSelected && (
                  <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 кита системы */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Честная неопределенность</div>
            <div className="mt-1 text-xs text-slate-500">
              Показываем реальные риски и пороги баллов без ложных обещаний 100% поступления.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Категории шансов</div>
            <div className="mt-1 text-xs text-slate-500">
              Разделение вариантов на Safety (надежные), Target (по силам) и Reach (высокая планка).
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Next Action Focus</div>
            <div className="mt-1 text-xs text-slate-500">
              Выделяем один ключевой шаг на сегодня с отметкой в личном трекере дедлайнов.
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка перехода */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
        >
          <span>Заполнить анкету абитуриента</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};