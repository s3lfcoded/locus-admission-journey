import React, {useEffect, useState} from 'react';

export function useSavedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('unipath-v1-' + key));
      return parsed !== null && typeof parsed === typeof initial && Array.isArray(parsed) === Array.isArray(initial) ? parsed : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unipath-v1-' + key, JSON.stringify(value));
    } catch {
      /* Private browsing may disable storage. */
    }
  }, [key, value]);

  return [value, setValue];
}

export const TASK_GUIDES_BY_LANG = {
  RU: [
    ['15 минут', 'Запроси выписку с оценками и проверь имя, период обучения и шкалу оценивания.', 'Читаемая копия выписки сохранена в твоей папке документов.'],
    ['20 минут', 'Сравни учебные планы двух программ и выпиши предметы, которые тебе интересны.', 'Выбрано направление и записаны причины выбора.'],
    ['10–15 минут', 'Проверь формат экзамена, доступные даты и срок получения результатов.', 'Дата и экзаменационный центр выбраны; условия регистрации проверены.'],
    ['Первый черновик · 45 минут', 'Запиши три примера своих проектов, причину выбора программы и цель обучения.', 'Есть первый черновик письма с конкретными примерами.'],
    ['По расписанию экзамена', 'Подготовь документ для идентификации и проверь инструкции экзаменационного центра.', 'Результат получен и внесён в профиль.'],
    ['30–60 минут', 'Сверь документы с требованиями программы, проверь файлы и отправь заявку.', 'Письмо или номер подтверждения подачи сохранены.']
  ],
  KZ: [
    ['15 минут', 'Бағалар туралы транскриптті сұратып, аты-жөніңді, оқу кезеңін және бағалау жүйесін тексер.', 'Анық оқылатын көшірме құжаттар папкасында сақталған.'],
    ['20 минут', 'Екі бағдарламаның оқу жоспарын салыстырып, өзіңе қызықты пәндерді жазып ал.', 'Бағыт таңдалды және таңдау себептері жазылды.'],
    ['10–15 минут', 'Емтихан форматын, қолжетімді күндерді және нәтижелерді алу мерзімін тексер.', 'Күн мен емтихан орталығы таңдалды; тіркелу шарттары тексерілді.'],
    ['Алғашқы нұсқа · 45 минут', 'Өз жобаларыңның үш мысалын, бағдарламаны таңдау себебін және мақсатыңды жаз.', 'Нақты мысалдары бар алғашқы эссе нұсқасы дайын.'],
    ['Емтихан кестесі бойынша', 'Жеке басты растайтын құжатты дайындап, емтихан орталығының нұсқаулығын оқы.', 'Нәтиже алынды және профильге енгізілді.'],
    ['30–60 минут', 'Құжаттарды бағдарлама талаптарымен салыстыр, файлдарды тексеріп, өтінімді жібер.', 'Өтінімді растайтын хат немесе нөмір сақталды.']
  ],
  ENG: [
    ['15 mins', 'Request your official transcript and verify your name, study period, and grading scale.', 'A clear copy is saved in your application folder.'],
    ['20 mins', 'Compare curriculums of two programs and note the courses that interest you most.', 'Target major selected with key reasons documented.'],
    ['10–15 mins', 'Check exam format, available testing dates, and score turnaround times.', 'Test date and test center selected; registration rules confirmed.'],
    ['First draft · 45 mins', 'Write three key project highlights, why you chose this program, and your core goal.', 'First draft with specific personal examples completed.'],
    ['Per exam schedule', 'Prepare valid ID document and review exam center instructions carefully.', 'Official score report received and added to profile.'],
    ['30–60 mins', 'Cross-check all documents against program requirements and submit your application.', 'Submission confirmation receipt or application ID saved.']
  ]
};

export const taskGuides = TASK_GUIDES_BY_LANG.RU;

export const TASK_TITLES_BY_LANG = {
  RU: [
    'Добавить академическую выписку',
    'Определиться с направлением',
    'Выбрать дату IELTS / тестов',
    'Подготовить мотивационное письмо',
    'Сдать IELTS и внести балл',
    'Отправить заявку в университет'
  ],
  KZ: [
    'Академиялық транскриптті қосу',
    'Бағытты нақтылау',
    'IELTS / емтихан күнін таңдау',
    'Мотивациялық хат дайындау',
    'IELTS тапсырып, нәтижені енгізу',
    'Университетке өтінім жіберу'
  ],
  ENG: [
    'Add academic transcript',
    'Finalize target major',
    'Select IELTS / exam date',
    'Prepare personal statement',
    'Take IELTS & record score',
    'Submit university application'
  ]
};

export const TASK_TAGS_BY_LANG = {
  RU: { Documents: 'Документы', Activities: 'Активности', Exams: 'Экзамены', Deadlines: 'Дедлайны' },
  KZ: { Documents: 'Құжаттар', Activities: 'Белсенділік', Exams: 'Емтихандар', Deadlines: 'Мерзімдер' },
  ENG: { Documents: 'Documents', Activities: 'Activities', Exams: 'Exams', Deadlines: 'Deadlines' }
};

export function MatchDetails({ lang = 'RU' }) {
  const isKz = lang === 'KZ';
  const isEng = lang === 'ENG';

  return (
    <details className="match-explainer">
      <summary>
        {isKz ? 'Тізім мен Match пайызы қалай есептеледі?' : isEng ? 'How Match scoring works' : 'Как читать подборку и Match?'}
      </summary>
      <div>
        <b>
          {isKz ? 'Шешім қабылдаудың үш тірегі' : isEng ? 'Three pillars of evaluation' : 'Три опоры для решения'}
        </b>
        <div className="match-factors">
          <span>01 · {isKz ? 'Қызығушылық пен бағдарлама' : isEng ? 'Interests & Major' : 'Интересы и программа'}</span>
          <span>02 · {isKz ? 'Балдар мен талаптар' : isEng ? 'Scores & Requirements' : 'Баллы и требования'}</span>
          <span>03 · {isKz ? 'Бюджет пен ел' : isEng ? 'Budget & Country' : 'Бюджет и страна'}</span>
        </div>
        <p>
          {isKz
            ? 'UniPath AI нақты уақыт режімінде таңдалған бағыттар, академиялық көрсеткіштер (GPA, IELTS, ҰБТ, SAT), бюджет және оқу елі негізінде 36 университет каталогы бойынша сәйкестікті есептейді. Карточкалар Match пайызы бойынша сұрыпталып, Safety, Target және Reach санаттарына бөлінген.'
            : isEng
            ? 'UniPath AI dynamically computes match scores across a verified catalog of 36 universities based on chosen majors, academic scores (GPA, IELTS, ENT, SAT), budget, and target countries. Cards are sorted by Match percentage and categorized into Safety, Target, and Reach tiers.'
            : 'UniPath AI в реальном времени пересчитывает соответствие по каталогу из 36 университетов на основе выбранных направлений, академических баллов (GPA, IELTS, ЕНТ, SAT), бюджета и стран поступления. Карточки отсортированы по проценту Match и разделены на категории Safety, Target и Reach.'}
        </p>
      </div>
    </details>
  );
}
