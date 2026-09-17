import { z } from 'zod';
import { provenanceSchema } from './sources';

/** Тип шага: определяет иконку, формулировку и то, можно ли шаг отложить. */
export const STEP_KINDS = [
  'exam', 'language_test', 'document', 'grant_application',
  'university_application', 'result', 'enrollment', 'visa', 'scholarship', 'interview',
] as const;
export const stepKindSchema = z.enum(STEP_KINDS);
export type StepKind = z.infer<typeof stepKindSchema>;

export const STEP_KIND_TITLES: Readonly<Record<StepKind, string>> = {
  exam: 'Экзамен',
  language_test: 'Языковой тест',
  document: 'Документ',
  grant_application: 'Заявка на грант',
  university_application: 'Заявка в вуз',
  result: 'Результаты',
  enrollment: 'Зачисление',
  visa: 'Виза',
  scholarship: 'Стипендия',
  interview: 'Собеседование',
};

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата в формате ГГГГ-ММ-ДД');

/** Шаг календаря приёмной кампании — данные, а не захардкоженная логика. */
export const calendarEntrySchema = z.object({
  id: z.string().min(2),
  kind: stepKindSchema,
  title: z.string().min(3),
  description: z.string().min(3),
  /** Окно, в которое шаг нужно выполнить. opensAt может отсутствовать. */
  opensAt: dateSchema.optional(),
  dueAt: dateSchema,
  /** Шаги, без которых этот невозможен. */
  dependsOn: z.array(z.string()).default([]),
  /** Пропуск этого шага закрывает траекторию целиком. */
  critical: z.boolean().default(true),
  /** К каким траекториям относится шаг. */
  appliesTo: z.array(z.enum(['ent', 'international', 'ege'])).min(1),
});
export type CalendarEntry = z.infer<typeof calendarEntrySchema>;

export const admissionCalendarSchema = z.object({
  id: z.string().min(2),
  country: z.string().min(2),
  intakeYear: z.number().int().min(2020).max(2100),
  entries: z.array(calendarEntrySchema).min(1),
  provenance: provenanceSchema,
});
export type AdmissionCalendar = z.infer<typeof admissionCalendarSchema>;

export type StepStatus = 'done' | 'available' | 'upcoming' | 'blocked' | 'overdue';

export const STEP_STATUS_TITLES: Readonly<Record<StepStatus, string>> = {
  done: 'Выполнено',
  available: 'Можно делать сейчас',
  upcoming: 'Ещё не открылось',
  blocked: 'Ждёт предыдущий шаг',
  overdue: 'Срок прошёл',
};

export interface RoadmapStep {
  readonly id: string;
  readonly kind: StepKind;
  readonly title: string;
  readonly description: string;
  readonly opensAt: string | null;
  readonly dueAt: string;
  readonly dependsOn: readonly string[];
  readonly critical: boolean;
  readonly status: StepStatus;
  /** Дней до дедлайна. Отрицательное — срок прошёл. */
  readonly daysLeft: number;
}

export type Urgency = 'overdue' | 'now' | 'soon' | 'later';

/**
 * Одно конкретное действие, которое абитуриенту нужно сделать следующим.
 *
 * Смысл сущности в том, чтобы не выкатывать человеку список из двадцати
 * пунктов: в любой момент времени есть ровно одно ближайшее дело.
 */
export interface NextAction {
  readonly step: RoadmapStep;
  /** Почему именно это — формулировка для интерфейса. */
  readonly why: string;
  readonly urgency: Urgency;
}

export interface Roadmap {
  readonly intakeYear: number;
  /** Дата, на которую рассчитан план. */
  readonly asOf: string;
  readonly steps: readonly RoadmapStep[];
  readonly nextAction: NextAction | null;
  /** Шаги с истёкшим сроком — показывать отдельно, это потерянные возможности. */
  readonly overdue: readonly RoadmapStep[];
  readonly warnings: readonly string[];
}
