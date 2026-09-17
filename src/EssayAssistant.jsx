import React, { useState } from 'react';
import { Sparkle, Copy, Check, FileText, CaretDown, CaretUp, LightbulbFilament, ShieldCheck, ArrowRight } from '@phosphor-icons/react';

export function EssayAssistant({ schoolName, interests = [], gpa, lang = 'RU', onCopied, defaultOpen = false }) {
  const [tone, setTone] = useState('academic');
  const [targetLang, setTargetLang] = useState('en'); // EN is standard for uni essays
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const interestStr = interests.length ? interests.join(', ') : 'Computer Science & Software Engineering';

  const essayTemplates = {
    en: {
      title: 'Personal Statement & Motivation Letter Draft',
      subtitle: `Tailored for admission to ${schoolName || 'University'} · Field: ${interestStr}`,
      tones: {
        academic: 'Academic & Structured',
        story: 'Narrative & Impact',
        bullet: 'Key Talking Points',
      },
      badge: 'AI Draft Assistant',
      copyBtn: 'Copy Complete Draft',
      copiedBtn: 'Copied to Clipboard!',
      antiClicheTitle: 'Admissions Quality Checklist',
      checklist: [
        'Focus on specific projects rather than childhood dreams',
        `Mention why ${schoolName || 'this university'} specifically fits your ambitions`,
        'Highlight quantitative outcomes (GPA, rankings, contest results)',
        'Keep word count between 500 and 750 words',
      ],
      sections: [
        {
          num: '01',
          header: 'The Hook & Driving Motivation',
          text: `From my first encounters with ${interestStr}, I realized that engineering systems to solve real-world bottlenecks was where my curiosity turned into dedication. Applying to ${schoolName} represents a natural continuation of this focus.`,
        },
        {
          num: '02',
          header: 'Academic Preparation & Hands-on Work',
          text: `Maintaining a strong academic standing (GPA ${gpa?.toFixed ? gpa.toFixed(1) : '3.6'}/4.0) alongside practical coursework has provided me with a solid technical baseline. Beyond textbooks, I challenged myself with practical problem solving, exploring algorithmic fundamentals, system design, and competitive hackathons.`,
        },
        {
          num: '03',
          header: `Why ${schoolName || 'This Institution'} Specifically`,
          text: `${schoolName} stands out because of its modern curriculum, rigorous faculty standards, and vibrant student-led tech ecosystem. The opportunity to study under experienced mentors and collaborate with driven peers is exactly what will accelerate my trajectory.`,
        },
        {
          num: '04',
          header: 'Future Vision & Return on Investment',
          text: `Upon graduation, my goal is to lead technology initiatives that advance digital infrastructure and engineering excellence. The rigorous bachelor's degree at ${schoolName} will equip me with the technical depth and professional network required to realize this vision.`,
        },
      ],
    },
    ru: {
      title: 'Каркас мотивационного письма (Personal Statement)',
      subtitle: `Подготовлено под требования: ${schoolName || 'Университет'} · Направление: ${interestStr}`,
      tones: {
        academic: 'Академический тон',
        story: 'Личная история и влияние',
        bullet: 'Тезисный план',
      },
      badge: 'AI-генератор эссе',
      copyBtn: 'Скопировать черновик письма',
      copiedBtn: 'Скопировано в буфер обмена!',
      antiClicheTitle: 'Чек-лист сильного эссе от приёмной комиссии',
      checklist: [
        'Конкретные проекты вместо абстрактных «с детства мечтал»',
        `Чёткий ответ на вопрос «Почему именно ${schoolName || 'этот вуз'}»`,
        'Факты и цифры (средний балл, результаты олимпиад, пет-проекты)',
        'Оптимальный объём: 500–700 слов на один лист A4',
      ],
      sections: [
        {
          num: '01',
          header: 'Введение и отправная точка интереса',
          text: `Мой осознанный интерес к направлению «${interestStr}» сформировался благодаря решению реальных практических задач. Поступление в ${schoolName} — это обдуманный шаг для перехода от базовых экспериментов к фундаментальной инженерной подготовке.`,
        },
        {
          num: '02',
          header: 'Академическая база и реализованные проекты',
          text: `С академическим показателем GPA ${gpa?.toFixed ? gpa.toFixed(1) : '3.6'} из 4.0 я уделяю первостепенное внимание точным дисциплинам. Параллельно с учёбой я развивал прикладные навыки: участвовал в командных хакатонах, проектировал архитектуру собственных сервисов и изучал алгоритмы.`,
        },
        {
          num: '03',
          header: `Почему именно ${schoolName || 'выбранный университет'}`,
          text: `${schoolName} привлекает меня сильной академической школой, балансом теории и практики, а также сильным сообществом студентов. Возможность работать с преподавателями-практиками и участвовать в лабораториях кампуса даст мне необходимый импульс для роста.`,
        },
        {
          num: '04',
          header: 'Долгосрочные цели и вклад в сообщество',
          text: `После завершения обучения я планирую развивать высоконагруженные цифровые продукты и вносить вклад в развитие технологической экосистемы региона. Обучение в ${schoolName} станет надёжным фундаментом для реализации этих профессиональных планов.`,
        },
      ],
    },
    kz: {
      title: 'Уәждеме хаттың (Motivation Letter) құрылымы',
      subtitle: `${schoolName || 'Университет'} талаптарына сәйкес · Бағыты: ${interestStr}`,
      tones: {
        academic: 'Академиялық стиль',
        story: 'Жеке оқиға мен мақсат',
        bullet: 'Негізгі тезистер',
      },
      badge: 'AI эссе көмекшісі',
      copyBtn: 'Хаттың мәтінін көшіріп алу',
      copiedBtn: 'Буферге сәтті көшірілді!',
      antiClicheTitle: 'Қабылдау комиссиясының сапа талаптары',
      checklist: [
        'Жалпылама сөздердің орнына нақты жобалар мен тәжірибе',
        `Неліктен дәл ${schoolName || 'осы оқу орны'} таңдалғанын нақтылау`,
        'Академиялық нәтижелер мен олимпиада жетістіктерін көрсету',
        'Ұсынылатын көлем: 500–700 сөз',
      ],
      sections: [
        {
          num: '01',
          header: 'Кіріспе және мақсатты таңдау',
          text: `«${interestStr}» саласына деген қызығушылығым нақты жобалармен жұмыс істеу барысында қалыптасты. ${schoolName} университетіне оқуға түсу — кәсіби білім алып, терең инженерлік дағдыларды меңгеруге бағытталған саналы қадамым.`,
        },
        {
          num: '02',
          header: 'Академиялық дайындық пен жобалық тәжірибе',
          text: `GPA ${gpa?.toFixed ? gpa.toFixed(1) : '3.6'} көрсеткішімен мен нақты ғылымдарға басымдық беріп келемін. Сабақтан тыс уақытта хакатондарға қатысып, цифрлық шешімдердің архитектурасын зерттедім.`,
        },
        {
          num: '03',
          header: `Неліктен ${schoolName || 'бұл университет'}?`,
          text: `${schoolName} өзінің сапалы оқу бағдарламасымен және белсенді студенттік қауымдастығымен ерекшеленеді. Кампустағы зертханаларда жұмыс істеп, білікті оқытушылардан тәлім алу маған кәсіби тұрғыда өсуге мүмкіндік береді.`,
        },
        {
          num: '04',
          header: 'Болашақ жоспарлар мен мақсат',
          text: `Оқуды аяқтаған соң, еліміздің цифрлық экожүйесін дамытуға үлес қосатын технологиялық бастамаларды жүзеге асыруды жоспарлаймын. ${schoolName} осы жолдағы ең сенімді баспалдақ болады.`,
        },
      ],
    },
  };

  const currentPack = essayTemplates[targetLang] || essayTemplates.en;

  const handleCopy = () => {
    const fullText = [
      `MOTIVATION LETTER / PERSONAL STATEMENT`,
      `Target Institution: ${schoolName}`,
      `Field: ${interestStr}`,
      `Generated by UniPath AI\n`,
      ...currentPack.sections.map((s) => `[${s.num} - ${s.header}]\n${s.text}\n`),
    ].join('\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    if (onCopied) onCopied('Структура мотивационного письма скопирована в буфер!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="essay-assistant-card">
      <div className="essay-assistant-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="essay-assistant-title-group">
          <span className="badge blue">
            <Sparkle size={14} weight="bold" /> {currentPack.badge}
          </span>
          <h3>{currentPack.title}</h3>
          <p className="small muted">{currentPack.subtitle}</p>
        </div>
        <button
          type="button"
          className="essay-toggle-btn"
          aria-expanded={isOpen}
          aria-label="Показать черновик эссе"
        >
          {isOpen ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
        </button>
      </div>

      {isOpen && (
        <div className="essay-assistant-body">
          <div className="essay-controls">
            <div className="essay-lang-toggle" role="group" aria-label="Язык эссе">
              <button
                type="button"
                className={targetLang === 'en' ? 'active' : ''}
                onClick={() => setTargetLang('en')}
              >
                English (Recommended)
              </button>
              <button
                type="button"
                className={targetLang === 'ru' ? 'active' : ''}
                onClick={() => setTargetLang('ru')}
              >
                Русский
              </button>
              <button
                type="button"
                className={targetLang === 'kz' ? 'active' : ''}
                onClick={() => setTargetLang('kz')}
              >
                Қазақша
              </button>
            </div>

            <button type="button" className="secondary copy-draft-btn" onClick={handleCopy}>
              {copied ? <Check size={16} weight="bold" className="green-text" /> : <Copy size={16} />}
              {copied ? currentPack.copiedBtn : currentPack.copyBtn}
            </button>
          </div>

          <div className="essay-sections-list">
            {currentPack.sections.map((sec) => (
              <div key={sec.num} className="essay-section-block">
                <div className="essay-section-top">
                  <span className="essay-num">{sec.num}</span>
                  <h4>{sec.header}</h4>
                </div>
                <p className="essay-text">{sec.text}</p>
              </div>
            ))}
          </div>

          <div className="essay-checklist-box">
            <div className="checklist-title">
              <ShieldCheck size={18} className="green-text" weight="bold" />
              <b>{currentPack.antiClicheTitle}</b>
            </div>
            <ul>
              {currentPack.checklist.map((item, i) => (
                <li key={i}>
                  <Check size={14} className="green-text" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
