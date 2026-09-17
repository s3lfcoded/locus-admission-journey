import { z } from 'zod';

/**
 * Насколько можно доверять числу в датасете.
 *
 * Это поле существует не для красоты: движок подбора вузов, где проходные баллы
 * взяты «примерно», вреден — абитуриент принимает по ним реальное решение.
 * Интерфейс обязан показывать разницу между подтверждённой и оценочной цифрой.
 */
export const CONFIDENCE_LEVELS = ['verified', 'reported', 'estimated'] as const;
export const confidenceSchema = z.enum(CONFIDENCE_LEVELS);
export type Confidence = z.infer<typeof confidenceSchema>;

export const CONFIDENCE_TITLES: Readonly<Record<Confidence, string>> = {
  verified: 'Подтверждено официальным источником',
  reported: 'По открытым публикациям, требует сверки',
  estimated: 'Оценка, официально не подтверждена',
};

export const sourceRefSchema = z.object({
  /** Ссылка на источник: страница приёмной комиссии, приказ, публикация. */
  url: z.string().url(),
  /** Что именно взято отсюда — чтобы не гадать при перепроверке. */
  claim: z.string().min(3),
  /** Когда данные снимали: цифры приёма живут один сезон. */
  retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата в формате ГГГГ-ММ-ДД'),
});
export type SourceRef = z.infer<typeof sourceRefSchema>;

export const provenanceSchema = z.object({
  confidence: confidenceSchema,
  sources: z.array(sourceRefSchema).default([]),
  /** Приёмная кампания, к которой относятся цифры. */
  admissionYear: z.number().int().min(2020).max(2100),
  /** Что именно осталось непроверенным — текст для команды, не для абитуриента. */
  caveat: z.string().optional(),
});
export type Provenance = z.infer<typeof provenanceSchema>;

/** Данные без подтверждённого источника нельзя подавать как факт. */
export function needsVerification(provenance: Provenance): boolean {
  return provenance.confidence !== 'verified' || provenance.sources.length === 0;
}
