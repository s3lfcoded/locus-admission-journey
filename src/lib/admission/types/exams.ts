import { z } from 'zod';

/**
 * Экзаменационные системы разных стран. Ключевое отличие от одностранового
 * движка: у каждой системы своя шкала, свой шаг и свои правила сравнения,
 * поэтому «балл» нельзя складывать между системами.
 */
export const EXAM_SYSTEMS = ['ent', 'ege', 'sat', 'act', 'ielts', 'toefl', 'gpa', 'ib', 'alevel'] as const;
export const examSystemSchema = z.enum(EXAM_SYSTEMS);
export type ExamSystem = z.infer<typeof examSystemSchema>;

/**
 * Конкретные измеримые результаты. ЕНТ разложен на блоки, потому что у них
 * разные максимумы (20/10/10/50/50) — это не единая стобалльная шкала.
 */
export const EXAM_CODES = [
  // ЕНТ, Казахстан — обязательный блок
  'ent_history_kz',
  'ent_math_literacy',
  'ent_reading_literacy',
  // ЕНТ — профильные предметы, по 50 баллов каждый
  'ent_mathematics',
  'ent_physics',
  'ent_chemistry',
  'ent_biology',
  'ent_informatics',
  'ent_geography',
  'ent_world_history',
  'ent_human_society_law',
  'ent_kazakh_language',
  'ent_kazakh_literature',
  'ent_russian_language',
  'ent_russian_literature',
  'ent_foreign_language',
  // Международные тесты
  'ielts',
  'toefl_ibt',
  'sat_total',
  'act_composite',
  'duolingo',
  // Школьный аттестат
  'gpa_4',
  'gpa_5',
  // ЕГЭ, Россия — для тех, кто рассматривает российские вузы
  'ege_russian',
  'ege_math_profile',
  'ege_physics',
  'ege_chemistry',
  'ege_biology',
  'ege_informatics',
  'ege_history',
  'ege_social_studies',
  'ege_literature',
  'ege_geography',
  'ege_foreign_english',
] as const;

export const examCodeSchema = z.enum(EXAM_CODES);
export type ExamCode = z.infer<typeof examCodeSchema>;

export interface ExamDefinition {
  readonly code: ExamCode;
  readonly system: ExamSystem;
  /** Подписи для интерфейса на трёх языках региона. */
  readonly title: { readonly ru: string; readonly kk: string; readonly en: string };
  readonly min: number;
  readonly max: number;
  /** Шаг шкалы: 0.5 у IELTS, 1 у большинства, 0.01 у GPA. */
  readonly step: number;
  /** Профильный предмет ЕНТ — выбирается абитуриентом парой. */
  readonly isEntProfileSubject: boolean;
}

function ent(
  code: ExamCode,
  ru: string,
  kk: string,
  en: string,
  max: number,
  isProfile: boolean,
): ExamDefinition {
  return { code, system: 'ent', title: { ru, kk, en }, min: 0, max, step: 1, isEntProfileSubject: isProfile };
}

function ege(code: ExamCode, ru: string, en: string): ExamDefinition {
  return {
    code,
    system: 'ege',
    title: { ru, kk: ru, en },
    min: 0,
    max: 100,
    step: 1,
    isEntProfileSubject: false,
  };
}

export const EXAMS: Readonly<Record<ExamCode, ExamDefinition>> = {
  ent_history_kz: ent('ent_history_kz', 'История Казахстана', 'Қазақстан тарихы', 'History of Kazakhstan', 20, false),
  ent_math_literacy: ent('ent_math_literacy', 'Математическая грамотность', 'Математикалық сауаттылық', 'Mathematical literacy', 10, false),
  ent_reading_literacy: ent('ent_reading_literacy', 'Грамотность чтения', 'Оқу сауаттылығы', 'Reading literacy', 10, false),
  ent_mathematics: ent('ent_mathematics', 'Математика', 'Математика', 'Mathematics', 50, true),
  ent_physics: ent('ent_physics', 'Физика', 'Физика', 'Physics', 50, true),
  ent_chemistry: ent('ent_chemistry', 'Химия', 'Химия', 'Chemistry', 50, true),
  ent_biology: ent('ent_biology', 'Биология', 'Биология', 'Biology', 50, true),
  ent_informatics: ent('ent_informatics', 'Информатика', 'Информатика', 'Informatics', 50, true),
  ent_geography: ent('ent_geography', 'География', 'География', 'Geography', 50, true),
  ent_world_history: ent('ent_world_history', 'Всемирная история', 'Дүниежүзі тарихы', 'World history', 50, true),
  ent_human_society_law: ent('ent_human_society_law', 'Человек. Общество. Право', 'Адам. Қоғам. Құқық', 'Human. Society. Law', 50, true),
  ent_kazakh_language: ent('ent_kazakh_language', 'Казахский язык', 'Қазақ тілі', 'Kazakh language', 50, true),
  ent_kazakh_literature: ent('ent_kazakh_literature', 'Казахская литература', 'Қазақ әдебиеті', 'Kazakh literature', 50, true),
  ent_russian_language: ent('ent_russian_language', 'Русский язык', 'Орыс тілі', 'Russian language', 50, true),
  ent_russian_literature: ent('ent_russian_literature', 'Русская литература', 'Орыс әдебиеті', 'Russian literature', 50, true),
  ent_foreign_language: ent('ent_foreign_language', 'Иностранный язык', 'Шетел тілі', 'Foreign language', 50, true),

  ielts: { code: 'ielts', system: 'ielts', title: { ru: 'IELTS Academic', kk: 'IELTS Academic', en: 'IELTS Academic' }, min: 0, max: 9, step: 0.5, isEntProfileSubject: false },
  toefl_ibt: { code: 'toefl_ibt', system: 'toefl', title: { ru: 'TOEFL iBT', kk: 'TOEFL iBT', en: 'TOEFL iBT' }, min: 0, max: 120, step: 1, isEntProfileSubject: false },
  sat_total: { code: 'sat_total', system: 'sat', title: { ru: 'SAT (общий балл)', kk: 'SAT (жалпы балл)', en: 'SAT total' }, min: 400, max: 1600, step: 10, isEntProfileSubject: false },
  act_composite: { code: 'act_composite', system: 'act', title: { ru: 'ACT Composite', kk: 'ACT Composite', en: 'ACT Composite' }, min: 1, max: 36, step: 1, isEntProfileSubject: false },
  duolingo: { code: 'duolingo', system: 'toefl', title: { ru: 'Duolingo English Test', kk: 'Duolingo English Test', en: 'Duolingo English Test' }, min: 10, max: 160, step: 5, isEntProfileSubject: false },

  gpa_4: { code: 'gpa_4', system: 'gpa', title: { ru: 'GPA аттестата (из 4.0)', kk: 'Аттестат GPA (4.0)', en: 'GPA (4.0 scale)' }, min: 0, max: 4, step: 0.01, isEntProfileSubject: false },
  gpa_5: { code: 'gpa_5', system: 'gpa', title: { ru: 'GPA аттестата (из 5.0)', kk: 'Аттестат GPA (5.0)', en: 'GPA (5.0 scale)' }, min: 0, max: 5, step: 0.01, isEntProfileSubject: false },

  ege_russian: ege('ege_russian', 'ЕГЭ: Русский язык', 'USE: Russian'),
  ege_math_profile: ege('ege_math_profile', 'ЕГЭ: Математика (профиль)', 'USE: Mathematics'),
  ege_physics: ege('ege_physics', 'ЕГЭ: Физика', 'USE: Physics'),
  ege_chemistry: ege('ege_chemistry', 'ЕГЭ: Химия', 'USE: Chemistry'),
  ege_biology: ege('ege_biology', 'ЕГЭ: Биология', 'USE: Biology'),
  ege_informatics: ege('ege_informatics', 'ЕГЭ: Информатика', 'USE: Informatics'),
  ege_history: ege('ege_history', 'ЕГЭ: История', 'USE: History'),
  ege_social_studies: ege('ege_social_studies', 'ЕГЭ: Обществознание', 'USE: Social studies'),
  ege_literature: ege('ege_literature', 'ЕГЭ: Литература', 'USE: Literature'),
  ege_geography: ege('ege_geography', 'ЕГЭ: География', 'USE: Geography'),
  ege_foreign_english: ege('ege_foreign_english', 'ЕГЭ: Английский язык', 'USE: English'),
};

/** Обязательный блок ЕНТ: эти три предмета сдают все, суммарно 40 баллов. */
export const ENT_CORE_EXAMS = ['ent_history_kz', 'ent_math_literacy', 'ent_reading_literacy'] as const;

/** Пороговые баллы по блокам ЕНТ — ниже них результат не засчитывается. */
export const ENT_SUBJECT_THRESHOLDS: Readonly<Partial<Record<ExamCode, number>>> = {
  ent_history_kz: 5,
  ent_math_literacy: 3,
  ent_reading_literacy: 3,
};

/** Максимум ЕНТ: 20 + 10 + 10 + 50 + 50. */
export const ENT_MAX_TOTAL = 140;

/** Профильный предмет ЕНТ сдаётся с порогом 5 баллов из 50. */
export const ENT_PROFILE_THRESHOLD = 5;

/**
 * Минимальные баллы ЕНТ для участия в конкурсе на государственный грант.
 * Источник: правила приёма РК, кампания 2026 года.
 */
export const ENT_GRANT_THRESHOLDS = {
  general: 65,
  medical: 70,
  creative: 50,
} as const;

export const ENT_PROFILE_EXAMS: readonly ExamCode[] = EXAM_CODES.filter(
  (code) => EXAMS[code].isEntProfileSubject,
);

export function examTitle(code: ExamCode, lang: 'ru' | 'kk' | 'en' = 'ru'): string {
  return EXAMS[code].title[lang];
}

/** Доля от максимума — единственный корректный способ сравнить разные шкалы. */
export function normalizedScore(code: ExamCode, score: number): number {
  const exam = EXAMS[code];
  const span = exam.max - exam.min;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (score - exam.min) / span));
}
