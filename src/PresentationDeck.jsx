import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Sparkle,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  GraduationCap,
  Path,
  Users,
  TrendUp,
  Cpu,
  FilePdf,
  House
} from '@phosphor-icons/react';
import './presentation.css';

export function PresentationDeck() {
  const [slide, setSlide] = useState(0);
  const total = 8;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Space') {
        e.preventDefault();
        setSlide((s) => Math.min(total - 1, s + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setSlide((s) => Math.max(0, s - 1));
      } else if (e.key === 'Home') {
        setSlide(0);
      } else if (e.key === 'End') {
        setSlide(total - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const slides = [
    // Slide 1
    (
      <div className="slide slide-title" key="s1">
        <div className="slide-badge">
          <Sparkle size={18} weight="fill" /> LOCUS STARTUP HACKATHON 2026 · CASE 02
        </div>
        <div className="title-hero">
          <div className="brand-pill">
            <Path size={32} weight="bold" />
            <span>UniPath <b>AI</b></span>
          </div>
          <h1>Персональный маршрут поступления<br /><span>на основе реальных данных, а не иллюзий</span></h1>
          <p className="lead-text">
            Интеллектуальная сквозная платформа для абитуриентов Казахстана и зарубежных программ с детерминированным Zod-движком и адаптивным таймлайном
          </p>
        </div>
        <div className="slide-footer-grid">
          <div className="footer-item">
            <small>Кейс хакатона</small>
            <b>Case 02: Personal Admission Journey</b>
          </div>
          <div className="footer-item">
            <small>Технологический стек</small>
            <b>TypeScript · React · Zod v4 · Vitest</b>
          </div>
          <div className="footer-item">
            <small>Дата защиты</small>
            <b>Сентябрь 2026 · Алматы</b>
          </div>
        </div>
      </div>
    ),

    // Slide 2
    (
      <div className="slide slide-content" key="s2">
        <div className="slide-header">
          <span className="slide-num">02 / 08</span>
          <h2>Проблема: Почему 80% абитуриентов теряют гранты?</h2>
          <p className="slide-subtitle">Хаос разрозненных сайтов и опасные галлюцинации generic AI</p>
        </div>
        <div className="cards-grid-3">
          <div className="deck-card danger">
            <div className="card-icon-wrap danger-icon">
              <WarningCircle size={28} weight="bold" />
            </div>
            <h3>1. Информационный хаос</h3>
            <p>
              50+ сайтов вузов с разрозненными правилами. Абитуриенты пропускают 7-дневное окно подачи на гранты (13–20 июля) и путаются в профильных парах.
            </p>
            <div className="card-stat">
              <b>7 дней</b>
              <span>на выбор 4 вузов на eGov</span>
            </div>
          </div>

          <div className="deck-card danger">
            <div className="card-icon-wrap danger-icon">
              <Cpu size={28} weight="bold" />
            </div>
            <h3>2. Галлюцинации ChatGPT</h3>
            <p>
              Обычные LLM выдумывают проходные баллы, не знают шкалы ЕНТ 2026 (140 баллов) и не понимают механику распределения сельских квот.
            </p>
            <div className="card-stat">
              <b>0% гарантий</b>
              <span>у стандартных AI-ботов</span>
            </div>
          </div>

          <div className="deck-card danger">
            <div className="card-icon-wrap danger-icon">
              <ShieldCheck size={28} weight="bold" />
            </div>
            <h3>3. Паралич решений</h3>
            <p>
              Выпускник видит огромный список требований и не знает, какое <b>одно ключевое действие</b> нужно совершить прямо сегодня для максимизации шансов.
            </p>
            <div className="card-stat">
              <b>&gt;60%</b>
              <span>испытывают стресс и выгорание</span>
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 3
    (
      <div className="slide slide-content" key="s3">
        <div className="slide-header">
          <span className="slide-num">03 / 08</span>
          <h2>Решение: Сквозной маршрут из 7 выверенных этапов</h2>
          <p className="slide-subtitle">От первичной оценки до конкретного шага в реальном времени</p>
        </div>
        <div className="workflow-steps-deck">
          {[
            { n: '1', title: 'Вход', desc: 'Выбор класса (10/11) и трека (РК / Зарубеж)' },
            { n: '2', title: 'Анкета + Демо', desc: 'Баллы GPA, IELTS, ЕНТ, SAT, квоты 35%' },
            { n: '3', title: 'SWOT-анализ', desc: 'Глубокая оценка сильных сторон и зон риска' },
            { n: '4', title: 'Матчинг вузов', desc: 'Safety / Target / Reach с честным % совпадения' },
            { n: '5', title: 'Сравнение', desc: 'Матрица сопоставления дедлайнов и условий' },
            { n: '6', title: 'Roadmap & PDF', desc: 'Календарь, эссе-ассистент, выгрузка .ics и PDF' },
            { n: '7', title: 'Фокус сегодня', desc: 'Приоритетный шаг с обратным отсчетом дней' },
          ].map((item) => (
            <div className="wf-step-card" key={item.n}>
              <div className="wf-step-badge">{item.n}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),

    // Slide 4
    (
      <div className="slide slide-content" key="s4">
        <div className="slide-header">
          <span className="slide-num">04 / 08</span>
          <h2>Живой продукт: Эргономика, дизайн и мультиязычность</h2>
          <p className="slide-subtitle">Интерфейс, спроектированный для мгновенного принятия решений</p>
        </div>
        <div className="cards-grid-3">
          <div className="deck-card">
            <div className="card-icon-wrap primary-icon">
              <Sparkle size={28} weight="bold" />
            </div>
            <h3>1-Click Демо-профили</h3>
            <p>
              Переключение реальных сценариев (Алихан — ЕНТ 125 IT-грант, Аружан — Зарубеж $0 DSU, Данияр — Сельская квота 35%) в 1 клик для демонстрации на защите.
            </p>
          </div>

          <div className="deck-card">
            <div className="card-icon-wrap success-icon">
              <GraduationCap size={28} weight="bold" />
            </div>
            <h3>Полная триязычность</h3>
            <p>
              Нативная поддержка <b>Қазақша (KZ)</b>, <b>Русский (RU)</b> и <b>English (ENG)</b>. Движок адаптирует термины («Ауыл квотасы», «Алтын белгі») на всех языках.
            </p>
          </div>

          <div className="deck-card">
            <div className="card-icon-wrap accent-icon">
              <CheckCircle size={28} weight="bold" />
            </div>
            <h3>Local-First & Скорость</h3>
            <p>
              Мгновенный отклик интерфейса без задержек. Все персональные данные абитуриента защищены и хранятся локально на его устройстве.
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 5
    (
      <div className="slide slide-content" key="s5">
        <div className="slide-header">
          <span className="slide-num">05 / 08</span>
          <h2>Технологии: Надежное математическое ядро</h2>
          <p className="slide-subtitle">Детерминированный скоринг на TypeScript с Zod-валидацией и 63 автотестами</p>
        </div>
        <div className="two-col-deck">
          <div className="deck-card">
            <h3>Архитектурная чистота движка</h3>
            <ul className="deck-list">
              <li><b>Изолированное ядро (<code>src/lib/admission</code>):</b> движок полностью отделен от UI и может использоваться как отдельный SDK или микросервис.</li>
              <li><b>Zod v4 Schemas:</b> строгая типизация профилей абитуриентов, экзаменационных баллов и требований вузов.</li>
              <li><b>6 факторов соответствия:</b> комбинация профильных предметов, академический порог, языковой тест, финансовая проходимость, географический фокус, квоты.</li>
              <li><b>63/63 Passing Vitest:</b> полное покрытие тестами логики квот, таймлайна и экзаменационных шкал.</li>
            </ul>
          </div>
          <div className="deck-card code-card">
            <div className="code-header">Admission Engine Architecture</div>
            <pre>
{`// Strict Zod & Multi-Factor Scoring
const evaluation = evaluateAdmissionState({
  interests: ['IT'],
  gpa: 3.9,
  ielts: 7.5,
  ent: 125,
  achievements: ['rural_quota'],
  budget: 0
});

// Deterministic Categorization:
// -> Safety: SDU (94% match)
// -> Target: Padua (89% match + DSU Grant)
// -> Reach:  NU (78% match)`}
            </pre>
          </div>
        </div>
      </div>
    ),

    // Slide 6
    (
      <div className="slide slide-content" key="s6">
        <div className="slide-header">
          <span className="slide-num">06 / 08</span>
          <h2>Киллер-фичи: Наше ключевое преимущество (УТП)</h2>
          <p className="slide-subtitle">То, чего нет ни у одного чат-бота или конкурирующего решения</p>
        </div>
        <div className="cards-grid-4">
          <div className="deck-card highlight-card">
            <h4>1. Честная неопределенность</h4>
            <p>Фиксация рисков: информирование о скрытых расходах (€6000 визовый депозит, апостиль ISEE, дедлайны эссе) с прямыми ссылками на первоисточники.</p>
          </div>
          <div className="deck-card highlight-card">
            <h4>2. Персонализированный SWOT</h4>
            <p>Динамическая генерация сильных сторон и зон внимания под конкретную комбинацию баллов, квот и финансовых рамок ученика.</p>
          </div>
          <div className="deck-card highlight-card">
            <h4>3. AI-ассистент эссе</h4>
            <p>Генератор структурированного мотивационного письма (Personal Statement) из 4 логических блоков под выбранный университет.</p>
          </div>
          <div className="deck-card highlight-card">
            <h4>4. Экспорт PDF & .ICS</h4>
            <p>Генерация официального печатного досье абитуриента в PDF в 1 клик и синхронизация всех дедлайнов с Apple/Google Календарем.</p>
          </div>
        </div>
      </div>
    ),

    // Slide 7
    (
      <div className="slide slide-content" key="s7">
        <div className="slide-header">
          <span className="slide-num">07 / 08</span>
          <h2>Команда проекта: Фокус на продуктовый результат</h2>
          <p className="slide-subtitle">Сбалансированная экспертиза от системной архитектуры до продуктового дизайна</p>
        </div>
        <div className="cards-grid-4 team-grid">
          <div className="deck-card team-card">
            <div className="team-avatar">🏗️</div>
            <h3>Lead Architect</h3>
            <small>Архитектура & Core Engine</small>
            <p>Проектирование Zod-моделей, логика скоринга, расчет сельских квот и тайбрейков.</p>
          </div>
          <div className="deck-card team-card">
            <div className="team-avatar">⚡</div>
            <h3>Frontend Lead</h3>
            <small>UI/UX & Experience</small>
            <p>Реализация сквозных 7 шагов, дизайн-система, мультиязычность, адаптивность.</p>
          </div>
          <div className="deck-card team-card">
            <div className="team-avatar">📊</div>
            <h3>Data & Research</h3>
            <small>Анализ правил приема</small>
            <p>Верификация проходных баллов ЕНТ 2026, стипендий DSU и международных дедлайнов.</p>
          </div>
          <div className="deck-card team-card">
            <div className="team-avatar">🎯</div>
            <h3>Product & Pitch</h3>
            <small>Продукт & Стратегия</small>
            <p>Пользовательские сценарии, ценностное предложение, экономика и бизнес-модель.</p>
          </div>
        </div>
      </div>
    ),

    // Slide 8
    (
      <div className="slide slide-content" key="s8">
        <div className="slide-header">
          <span className="slide-num">08 / 08</span>
          <h2>Бизнес-модель и Roadmap развития платформы</h2>
          <p className="slide-subtitle">Понятная монетизация и масштабирование на рынки Центральной Азии</p>
        </div>
        <div className="two-col-deck">
          <div className="deck-card">
            <h3>Двусторонняя модель монетизации</h3>
            <ul className="deck-list">
              <li><b>B2C Freemium:</b> базовый подбор университетов и таймлайн бесплатны. Платная подписка Pro ($9.90/мес) — глубокий AI-анализ эссе, трекинг статусов и проверка документов.</li>
              <li><b>B2B Партнерство:</b> интеграция с языковыми центрами и школами подготовки к ЕНТ/IELTS (квалифицированные лиды с выявленными дефицитами баллов).</li>
              <li><b>Лидогенерация для частных вузов:</b> целевые абитуриенты с подтвержденным проходным баллом.</li>
            </ul>
          </div>
          <div className="deck-card">
            <h3>Roadmap развития (2026–2027)</h3>
            <div className="roadmap-timeline-deck">
              <div className="rm-item">
                <b>Q4 2026</b>
                <p>Личные кабинеты менторов и школьных профориентаторов</p>
              </div>
              <div className="rm-item">
                <b>Q1 2027</b>
                <p>Интеграция с открытыми данными НЦТ (Testcenter.kz) и eGov</p>
              </div>
              <div className="rm-item">
                <b>Q2 2027</b>
                <p>Telegram-бот с персонализированными push-напоминаниями</p>
              </div>
              <div className="rm-item">
                <b>Q3 2027</b>
                <p>Масштабирование на Узбекистан, Кыргызстан и Турцию</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ];

  return (
    <div className="deck-wrapper">
      {/* Top Deck Navigation */}
      <div className="deck-navbar no-print">
        <div className="deck-nav-left">
          <a href="/" className="deck-back-btn">
            <House size={18} /> К продукту
          </a>
          <span className="deck-title-nav">UniPath AI · Командный питч (8 слайдов)</span>
        </div>
        <div className="deck-nav-center">
          <button
            className="deck-btn"
            disabled={slide === 0}
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            title="Предыдущий слайд (Left Arrow)"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="deck-page-indicator">
            {slide + 1} / {total}
          </span>
          <button
            className="deck-btn"
            disabled={slide === total - 1}
            onClick={() => setSlide((s) => Math.min(total - 1, s + 1))}
            title="Следующий слайд (Right Arrow / Space)"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="deck-nav-right">
          <button className="deck-print-btn" onClick={() => window.print()}>
            <FilePdf size={18} /> Экспорт всех 8 слайдов в PDF
          </button>
        </div>
      </div>

      {/* Slide Screen View */}
      <div className="deck-screen-viewport no-print">
        {slides[slide]}
      </div>

      {/* Print View: renders ALL 8 slides for multi-page print-to-pdf */}
      <div className="deck-print-viewport print-only">
        {slides.map((s, idx) => (
          <div className="print-slide-page" key={idx}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
