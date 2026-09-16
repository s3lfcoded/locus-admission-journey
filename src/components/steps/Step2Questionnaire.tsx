'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { FieldOfStudy } from '../../data/types';
import { 
  Code2, 
  Cpu, 
  TrendingUp, 
  Stethoscope, 
  Scale, 
  Palette, 
  DollarSign, 
  Globe2, 
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

const FIELDS: { id: FieldOfStudy; name: string; icon: React.ElementType }[] = [
  { id: 'cs_it', name: 'IT & Computer Science', icon: Code2 },
  { id: 'engineering', name: 'Инженерия и Технологии', icon: Cpu },
  { id: 'business_econ', name: 'Бизнес и Экономика', icon: TrendingUp },
  { id: 'medicine_bio', name: 'Медицина и Биотех', icon: Stethoscope },
  { id: 'social_humanities', name: 'Право и Общественные науки', icon: Scale },
  { id: 'design_art', name: 'Дизайн, Медиа и Архитектура', icon: Palette },
];

const AVAILABLE_COUNTRIES = [
  'Казахстан',
  'Германия',
  'Италия',
  'Венгрия',
  'Чехия',
  'Корея',
  'Турция',
  'США',
];

export const Step2Questionnaire: React.FC = () => {
  const { profile, updateProfile, setCurrentStep } = useAdmission();

  const toggleCountry = (country: string) => {
    const current = profile.preferredCountries;
    if (current.includes(country)) {
      if (current.length === 1) return; // don't leave empty
      updateProfile({ preferredCountries: current.filter((c) => c !== country) });
    } else {
      updateProfile({ preferredCountries: [...current, country] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 2 из 7 • Профиль абитуриента
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Твои вводные данные и ограничения
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Меняй параметры — алгоритм моментально пересчитает шансы, университеты и карту дедлайнов.
        </p>
      </div>

      {/* 1. Направление обучения */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="text-sm font-bold text-slate-900">
          1. Академическое направление
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {FIELDS.map((item) => {
            const Icon = item.icon;
            const isSelected = profile.field === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateProfile({ field: item.id })}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs sm:text-sm truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Успеваемость и экзамены */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900">
              Средний балл (GPA)
            </label>
            <span className="rounded-lg bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-700">
              {profile.gpa.toFixed(1)} / 4.0
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Ориентировочный средний балл аттестата / табеля
          </p>
          <input
            type="range"
            min="2.5"
            max="4.0"
            step="0.1"
            value={profile.gpa}
            onChange={(e) => updateProfile({ gpa: parseFloat(e.target.value) })}
            className="mt-4 w-full accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>2.5 (Удовлетворительно)</span>
            <span>3.5 (Хорошо)</span>
            <span>4.0 (Отлично)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900">
              Языковой сертификат (IELTS)
            </label>
            <span className="rounded-lg bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-700">
              {profile.ielts > 0 ? profile.ielts.toFixed(1) : 'Не сдавал'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Или эквивалент TOEFL / Duolingo English Test
          </p>
          <input
            type="range"
            min="4.5"
            max="9.0"
            step="0.5"
            value={profile.ielts || 5.5}
            onChange={(e) => updateProfile({ ielts: parseFloat(e.target.value) })}
            className="mt-4 w-full accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>4.5 (A2/B1)</span>
            <span>6.5 (B2/C1 Норма)</span>
            <span>9.0 (Native)</span>
          </div>
        </div>
      </div>

      {/* 3. Дополнительные тесты (ЕНТ / SAT) */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-bold text-slate-900">
            Балл ЕНТ (Казахстан)
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Для грантов РК (КБТУ, SDU, МУИТ, КазНУ)
          </p>
          <input
            type="number"
            min="50"
            max="140"
            value={profile.ent}
            onChange={(e) => updateProfile({ ent: parseInt(e.target.value) || 0 })}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Например: 110"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-bold text-slate-900">
            Балл SAT (General)
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Для Nazarbayev University, США, KAIST, Polimi
          </p>
          <input
            type="number"
            min="0"
            max="1600"
            step="10"
            value={profile.sat}
            onChange={(e) => updateProfile({ sat: parseInt(e.target.value) || 0 })}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Например: 1350"
          />
        </div>
      </div>

      {/* 4. Бюджет и стипендии */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <label className="text-sm font-bold text-slate-900">
              Годовой бюджет на обучение ($ USD / год)
            </label>
            <p className="text-xs text-slate-500">
              Сколько семья готова платить без учета гранта
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 ring-1 ring-emerald-600/20">
            {profile.annualBudgetUsd === 0 
              ? 'Только 100% Грант ($0)' 
              : `$${profile.annualBudgetUsd.toLocaleString()} / год`}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="35000"
          step="500"
          value={profile.annualBudgetUsd}
          onChange={(e) => updateProfile({ annualBudgetUsd: parseInt(e.target.value) })}
          className="mt-5 w-full accent-emerald-600"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'Только грант ($0)', val: 0 },
            { label: 'До $3,000 (РК/Турция)', val: 3000 },
            { label: 'До $8,000 (Европа/Азия)', val: 8000 },
            { label: 'До $25,000 (США/UK)', val: 25000 },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => updateProfile({ annualBudgetUsd: preset.val })}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                profile.annualBudgetUsd === preset.val
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. География / Страны */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="text-sm font-bold text-slate-900">
          Интересующие страны (выбери от 1 до 8)
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Алгоритм приоритезирует университеты из выбранных локаций
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AVAILABLE_COUNTRIES.map((country) => {
            const isSelected = profile.preferredCountries.includes(country);
            return (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {country}
              </button>
            );
          })}
        </div>
      </div>

      {/* Предупреждение о прозрачности */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <div>
          <span className="font-bold">Честная неопределенность:</span> расчет шансов базируется на открытых требованиях приемных комиссий вузов и проходных баллах грантов 2026 года. Сервис не дает ложных гарантий, а выявляет реалистичные сценарии.
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <span>Получить диагностику профиля</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};