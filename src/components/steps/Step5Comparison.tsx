'use client';

import React from 'react';
import { useAdmission } from '../../context/AdmissionContext';
import { UNIVERSITIES } from '../../data/universities';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  ExternalLink, 
  BookmarkCheck,
  Award,
  Calendar,
  DollarSign
} from 'lucide-react';

export const Step5Comparison: React.FC = () => {
  const { 
    selectedUniIds, 
    matches, 
    targetUniId, 
    setTargetUniId, 
    setCurrentStep 
  } = useAdmission();

  // Selected universities with their calculated matches
  const comparedList = selectedUniIds.map((id) => {
    const foundMatch = matches.find((m) => m.university.id === id);
    if (foundMatch) return foundMatch;
    const uni = UNIVERSITIES.find((u) => u.id === id)!;
    return {
      university: uni,
      matchScore: 60,
      tier: 'Target' as const,
      matchReasons: [],
      riskFactors: [],
      scholarshipAdvice: '',
    };
  }).filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Этап 5 из 7 • Сравнение программ
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Сравнение университетов бок о бок
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Сопоставь ключевые финансовые параметры, требования и дедлайны перед утверждением финального плана.
        </p>
      </div>

      {comparedList.length < 2 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">
            Выбрано менее двух университетов для сравнения.
          </p>
          <button
            onClick={() => setCurrentStep(4)}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            Вернуться к каталогу рекомендаций и добавить вузы
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4 w-1/4">Критерий</th>
                {comparedList.map((item) => (
                  <th key={item.university.id} className="p-4 text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.university.logo}</span>
                      <span className="text-sm font-bold">{item.university.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {/* Рейтинг и локация */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Страна и город</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4 font-medium text-slate-900">
                    {item.university.country}, {item.university.city}
                  </td>
                ))}
              </tr>

              {/* Совпадение профиля */}
              <tr className="bg-blue-50/30">
                <td className="p-4 font-semibold text-slate-500">Индекс Match</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4">
                    <span className="text-lg font-black text-blue-600">{item.matchScore}%</span>
                    <span className="ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                      {item.tier}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Стоимость обучения */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Обучение в год</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4 font-bold text-slate-900">
                    {item.university.tuitionUsdPerYear === 0 
                      ? 'Грант ($0)' 
                      : `$${item.university.tuitionUsdPerYear.toLocaleString()} / год`}
                  </td>
                ))}
              </tr>

              {/* Проживание в месяц */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Ориентир проживания</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4">
                    ~${item.university.costOfLivingUsdPerMonth} / месяц
                  </td>
                ))}
              </tr>

              {/* Порог IELTS */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Мин. IELTS</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4 font-semibold">
                    {item.university.minIelts}
                  </td>
                ))}
              </tr>

              {/* SAT / Экзамены */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">SAT / ЕНТ требования</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4">
                    {item.university.minSat ? `SAT ${item.university.minSat}+` : ''}
                    {item.university.minEnt ? `ЕНТ ${item.university.minEnt}+` : ''}
                    {!item.university.minSat && !item.university.minEnt && 'Не требуется'}
                  </td>
                ))}
              </tr>

              {/* Гранты */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Стипендии и гранты</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4">
                    <ul className="space-y-1">
                      {item.university.availableGrants.map((g, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Дедлайн */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Дедлайн подачи</td>
                {comparedList.map((item) => (
                  <td key={item.university.id} className="p-4 font-bold text-red-600">
                    {item.university.fallDeadline}
                  </td>
                ))}
              </tr>

              {/* Кнопка целевого выбора */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-500">Выбор для Roadmap</td>
                {comparedList.map((item) => {
                  const isTarget = targetUniId === item.university.id;
                  return (
                    <td key={item.university.id} className="p-4">
                      <button
                        onClick={() => {
                          setTargetUniId(item.university.id);
                          setCurrentStep(6);
                        }}
                        className={`w-full rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                          isTarget
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {isTarget ? 'Выбран целевым ✓' : 'Утвердить и перейти к плану'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Навигация */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>К каталогу рекомендаций</span>
        </button>
        <button
          onClick={() => setCurrentStep(6)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          <span>Перейти к Roadmap</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};