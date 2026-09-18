import React from 'react';
import {CheckCircle, Clock, WarningCircle, Path, ShieldCheck} from '@phosphor-icons/react';

export function RoadmapPdfDocument({
  school,
  tasks,
  taskDates,
  taskGuides,
  gpa,
  ielts,
  ent,
  sat,
  budget,
  interests,
  countries,
  achievements,
  lang = 'RU'
}) {
  const isKz = lang === 'KZ';
  const isEng = lang === 'ENG';

  const todayStr = new Date().toLocaleDateString(isKz ? 'kk-KZ' : isEng ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dossierId = `UP-2026-${(school.id || 'TARGET').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const hasRural = achievements.includes('rural_quota');
  const hasAltyn = achievements.includes('altyn_belgi');

  return (
    <div id="print-roadmap-root" className="roadmap-print-container">
      {/* Header */}
      <header className="print-header">
        <div className="print-brand">
          <div className="print-logo">
            <Path size={24} weight="bold" />
            <span>UniPath <b>AI</b></span>
          </div>
          <div className="print-subtitle">
            {isKz ? 'Жеке оқуға түсу маршруты · Төлқұжат' : isEng ? 'Personal Admission Dossier · Verified Plan' : 'Персональное досье абитуриента · Верифицированный маршрут'}
          </div>
        </div>
        <div className="print-meta">
          <div className="dossier-id">ID: <b>{dossierId}</b></div>
          <div className="dossier-date">{todayStr}</div>
        </div>
      </header>

      {/* Profile Overview */}
      <section className="print-section print-profile-grid">
        <div className="print-card">
          <div className="print-card-title">
            {isKz ? 'Абитуриент бейіні' : isEng ? 'Applicant Profile' : 'Профиль абитуриента'}
          </div>
          <div className="print-facts-row">
            <div>
              <span className="fact-label">GPA:</span>
              <b>{Number(gpa).toFixed(1)} / 4.0</b>
            </div>
            <div>
              <span className="fact-label">IELTS:</span>
              <b>{Number(ielts).toFixed(1)} / 9.0</b>
            </div>
            {ent && (
              <div>
                <span className="fact-label">ЕНТ:</span>
                <b>{ent} / 140</b>
              </div>
            )}
            {sat && (
              <div>
                <span className="fact-label">SAT:</span>
                <b>{sat} / 1600</b>
              </div>
            )}
            <div>
              <span className="fact-label">{isKz ? 'Бюджет:' : isEng ? 'Budget:' : 'Бюджет:'}</span>
              <b>{budget === 0 ? (isKz ? 'Тек грант' : isEng ? 'Grant only' : 'Только грант') : `$${budget.toLocaleString('en-US')}/год`}</b>
            </div>
          </div>
          <div className="print-tags">
            <span className="print-tag">{interests.join(', ')}</span>
            <span className="print-tag">{countries.join(', ')}</span>
            {hasRural && <span className="print-tag highlight">🌾 Ауыл квотасы (35%)</span>}
            {hasAltyn && <span className="print-tag highlight">🎖️ Алтын белгі</span>}
          </div>
        </div>

        <div className="print-card target-uni-card">
          <div className="print-card-title">
            {isKz ? 'Мақсатты университет' : isEng ? 'Target University' : 'Целевой университет'}
          </div>
          <div className="target-uni-header">
            <h3>{school.name}</h3>
            <span className="badge-match">{school.match}% Match · {school.type}</span>
          </div>
          <p className="target-uni-place">{school.place}</p>
          <div className="target-uni-program">
            <b>{school.bestProgramTitle || 'Computer Science · Bachelor'}</b>
          </div>
          <div className="target-uni-dates">
            <span>{isKz ? 'Соңғы мерзім (дедлайн):' : isEng ? 'Final Deadline:' : 'Финальный дедлайн:'} <b>{school.date}</b></span>
            <span>{isKz ? 'Оқу ақысы:' : isEng ? 'Tuition:' : 'Стоимость:'} <b>{school.cost}</b></span>
          </div>
        </div>
      </section>

      {/* 6-Step Timeline */}
      <section className="print-section">
        <h4 className="print-heading">
          {isKz ? 'Қадамдық іс-қимыл жоспары (6 кезең)' : isEng ? 'Step-by-Step Action Plan (6 Milestones)' : 'Пошаговый план действий (6 ключевых этапов)'}
        </h4>
        <table className="print-tasks-table">
          <thead>
            <tr>
              <th style={{width: '6%'}}>№</th>
              <th style={{width: '18%'}}>{isKz ? 'Мерзімі' : isEng ? 'Date / Deadline' : 'Срок'}</th>
              <th style={{width: '32%'}}>{isKz ? 'Тапсырма' : isEng ? 'Action Item' : 'Этап и действие'}</th>
              <th style={{width: '14%'}}>{isKz ? 'Санат' : isEng ? 'Category' : 'Категория'}</th>
              <th style={{width: '14%'}}>{isKz ? 'Күйі' : isEng ? 'Status' : 'Статус'}</th>
              <th style={{width: '16%'}}>{isKz ? 'Уақыт' : isEng ? 'Est. Time' : 'Ориентир'}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => {
              const guide = taskGuides[idx] || ['1–2 часа', '', ''];
              return (
                <tr key={idx} className={task.done ? 'row-done' : ''}>
                  <td className="center-cell"><b>{idx + 1}</b></td>
                  <td><b>{task.date || school.date}</b></td>
                  <td>
                    <div className="task-name-cell">
                      <b>{task.name}</b>
                      {guide[1] && <small className="task-subtext">{guide[1]}</small>}
                    </div>
                  </td>
                  <td>
                    <span className={`print-badge badge-${task.tag}`}>
                      {task.tag}
                    </span>
                  </td>
                  <td>
                    {task.done ? (
                      <span className="status-done">
                        <CheckCircle size={14} weight="fill" /> {isKz ? 'Орындалды' : isEng ? 'Completed' : 'Выполнено'}
                      </span>
                    ) : (
                      <span className="status-pending">
                        <Clock size={14} /> {isKz ? 'Жоспарда' : isEng ? 'Pending' : 'В плане'}
                      </span>
                    )}
                  </td>
                  <td className="small-text">{guide[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Honest Uncertainty & Provenance */}
      <section className="print-section print-caveats">
        <div className="caveat-box">
          <div className="caveat-title">
            <ShieldCheck size={20} weight="bold" />
            <span>{isKz ? 'Адал белгісіздік және деректердің расталуы' : isEng ? 'Honest Uncertainty & Verification Notes' : 'Честная неопределённость и верификация данных'}</span>
          </div>
          <p className="caveat-text">
            {school.risk || 'Своевременно проверьте официальные требования на портале вуза.'}
          </p>
          <div className="caveat-provenance">
            <span>{isKz ? 'Ресми дереккөз:' : isEng ? 'Official Source:' : 'Официальный источник:'} {school.url}</span>
            <span> · {isKz ? 'Тексерілген күні:' : isEng ? 'Verified on:' : 'Верифицировано:'} 2026-09</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="print-footer">
        <div>UniPath AI · LOCUS Startup Hackathon 2026 · Case 02: Personal Admission Journey</div>
        <div>https://unipath.ai</div>
      </footer>
    </div>
  );
}
