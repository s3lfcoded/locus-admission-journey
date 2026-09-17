import type { z } from 'zod';
import type { admissionCalendarSchema } from '../types/roadmap';

type CalendarInput = z.input<typeof admissionCalendarSchema>;

/**
 * Календарь приёмной кампании Казахстана на 2026 год.
 *
 * Даты подачи на грант и публикации списков подтверждены публикациями
 * государственных СМИ; остальные шаги выведены из типового порядка кампании
 * и помечены как требующие сверки — см. provenance.caveat.
 */
export const KZ_CALENDAR_2026: CalendarInput = {
  id: 'kz-2026',
  country: 'KZ',
  intakeYear: 2026,
  provenance: {
    confidence: 'reported',
    admissionYear: 2026,
    caveat:
      'Даты гранта подтверждены публикациями; сроки регистрации на ЕНТ и зачисления выведены из типового порядка кампании и требуют сверки с приказом МНВО РК.',
    sources: [
      {
        url: 'https://www.zakon.kz/obshestvo/6521707-v-kazakhstane-obyavili-sroki-priema-zayavleniy-na-obrazovatelnye-granty.html',
        claim: 'Приём заявлений на конкурс образовательных грантов: 13–20 июля 2026',
        retrievedAt: '2026-09-17',
      },
      {
        url: 'https://tengrinews.kz/newseducation/kazahstane-nachalsya-prim-zayavleniy-uchastiya-konkurse-603784/',
        claim: 'Списки обладателей грантов публикуются до 10 августа 2026',
        retrievedAt: '2026-09-17',
      },
    ],
  },
  entries: [
    {
      id: 'ent-registration',
      kind: 'document',
      title: 'Зарегистрироваться на ЕНТ',
      description: 'Подать заявку на тестирование через сайт Национального центра тестирования и выбрать пару профильных предметов.',
      dueAt: '2026-03-15',
      appliesTo: ['ent'],
    },
    {
      id: 'ent-exam',
      kind: 'exam',
      title: 'Сдать ЕНТ',
      description: 'Основное тестирование: 120 заданий, максимум 140 баллов. Для участия в конкурсе на грант нужно минимум 65 баллов, для медицинских специальностей — 70.',
      dueAt: '2026-06-30',
      dependsOn: ['ent-registration'],
      appliesTo: ['ent'],
    },
    {
      id: 'school-certificate',
      kind: 'document',
      title: 'Получить аттестат',
      description: 'Аттестат о среднем образовании нужен и для конкурса на грант, и для подачи в вуз.',
      dueAt: '2026-06-25',
      appliesTo: ['ent', 'international', 'ege'],
    },
    {
      id: 'grant-application',
      kind: 'grant_application',
      title: 'Подать заявление на грант',
      description: 'Окно всего восемь дней. Нужны: удостоверение личности, сертификат ЕНТ, фото 3×4, аттестат. Подать можно через eGov.kz или приёмную комиссию вуза.',
      opensAt: '2026-07-13',
      dueAt: '2026-07-20',
      dependsOn: ['ent-exam', 'school-certificate'],
      appliesTo: ['ent'],
    },
    {
      id: 'grant-results',
      kind: 'result',
      title: 'Проверить списки грантов',
      description: 'Списки обладателей государственных образовательных грантов публикуются до 10 августа на портале МНВО РК.',
      dueAt: '2026-08-10',
      dependsOn: ['grant-application'],
      critical: false,
      appliesTo: ['ent'],
    },
    {
      id: 'university-enrollment',
      kind: 'enrollment',
      title: 'Подать документы в вуз и зачислиться',
      description: 'После публикации списков — договор с вузом: обладатели грантов подтверждают место, остальные поступают на платное.',
      opensAt: '2026-08-10',
      dueAt: '2026-08-25',
      dependsOn: ['grant-results'],
      appliesTo: ['ent'],
    },
    {
      id: 'language-test',
      kind: 'language_test',
      title: 'Сдать IELTS или TOEFL',
      description: 'Результат действует два года. Nazarbayev University требует IELTS 6.5 или TOEFL iBT 79 на бакалавриат, 5.5 — на Foundation.',
      dueAt: '2026-02-28',
      critical: true,
      appliesTo: ['international'],
    },
    {
      id: 'sat-exam',
      kind: 'exam',
      title: 'Сдать SAT или ACT',
      description: 'Нужен для международного трека. Результат действителен два года и не должен истечь к 1 августа года поступления.',
      dueAt: '2026-03-31',
      critical: false,
      appliesTo: ['international'],
    },
    {
      id: 'application-package',
      kind: 'document',
      title: 'Собрать пакет документов',
      description: 'Мотивационное письмо, рекомендации, транскрипт оценок, перевод аттестата. Собирается дольше всего — начинать заранее.',
      dueAt: '2026-01-15',
      appliesTo: ['international'],
    },
    {
      id: 'university-application',
      kind: 'university_application',
      title: 'Подать заявку в университет',
      description: 'Онлайн-заявка на портале вуза. У зарубежных университетов дедлайны раньше казахстанских — обычно зима.',
      dueAt: '2026-04-01',
      dependsOn: ['application-package', 'language-test'],
      appliesTo: ['international'],
    },
    {
      id: 'scholarship-application',
      kind: 'scholarship',
      title: 'Подать на стипендию',
      description: 'Стипендии вузов и программы вроде «Болашак» имеют собственные дедлайны, обычно раньше основной заявки.',
      dueAt: '2026-03-01',
      critical: false,
      appliesTo: ['international'],
    },
    {
      id: 'visa',
      kind: 'visa',
      title: 'Оформить студенческую визу',
      description: 'После получения приглашения. Сроки оформления зависят от страны — закладывайте не меньше месяца.',
      dueAt: '2026-08-01',
      dependsOn: ['university-application'],
      appliesTo: ['international'],
    },
  ],
};
