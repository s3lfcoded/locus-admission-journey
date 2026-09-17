import { z } from 'zod';
import { EXAMS, examCodeSchema, type ExamCode } from './exams';
import { moneySchema } from './money';
import {
  countrySchema, degreeLevelSchema, fundingTypeSchema, languageSchema,
  studyFieldSchema, studyFormSchema,
} from './institution';

/**
 * Индивидуальные достижения. Набор казахстанский: «Алтын белгі» и знак
 * «Үздік» дают преимущество при равных баллах ЕНТ, олимпиады — отдельные квоты.
 */
export const ACHIEVEMENT_KINDS = [
  'altyn_belgi',
  'honours_certificate',
  'olympiad_republican',
  'olympiad_international',
  'presidential_scholarship',
  'rural_quota',
  'volunteering',
  'portfolio',
] as const;
export const achievementKindSchema = z.enum(ACHIEVEMENT_KINDS);
export type AchievementKind = z.infer<typeof achievementKindSchema>;

export const ACHIEVEMENT_TITLES: Readonly<Record<AchievementKind, string>> = {
  altyn_belgi: 'Знак «Алтын белгі»',
  honours_certificate: 'Аттестат с отличием',
  olympiad_republican: 'Призёр республиканской олимпиады',
  olympiad_international: 'Призёр международной олимпиады',
  presidential_scholarship: 'Президентская стипендия',
  rural_quota: 'Сельская квота',
  volunteering: 'Волонтёрская деятельность',
  portfolio: 'Портфолио проектов',
};

/**
 * В отличие от России, в Казахстане достижения не прибавляют баллы к ЕНТ.
 * «Алтын белгі» и победы в олимпиадах дают приоритет при равном балле и доступ
 * к отдельным квотам, а не арифметическую надбавку. Модель это отражает:
 * вес — это приоритет в очереди, а не баллы.
 */
export const ACHIEVEMENT_PRIORITY: Readonly<Record<AchievementKind, number>> = {
  olympiad_international: 5,
  olympiad_republican: 4,
  altyn_belgi: 3,
  presidential_scholarship: 3,
  honours_certificate: 2,
  rural_quota: 2,
  portfolio: 1,
  volunteering: 1,
};

export const applicantPreferencesSchema = z.object({
  fields: z.array(studyFieldSchema).default([]),
  /** Страны, которые рассматривает абитуриент. Пусто — любые. */
  countries: z.array(countrySchema).default([]),
  cities: z.array(z.string().min(2)).default([]),
  /** Языки, на которых абитуриент готов учиться. Пусто — любые. */
  languages: z.array(languageSchema).default([]),
  /** Какое финансирование рассматривается. Пусто — любое. */
  fundingTypes: z.array(fundingTypeSchema).default([]),
  /** Готов ли уезжать за пределы выбранных городов и стран. */
  willingToRelocate: z.boolean().default(true),
  maxTuitionPerYear: moneySchema.nullable().default(null),
  needsDormitory: z.boolean().default(false),
  studyForms: z.array(studyFormSchema).default([]),
  degreeLevels: z.array(degreeLevelSchema).default([]),
});
export type ApplicantPreferences = z.infer<typeof applicantPreferencesSchema>;

export const applicantProfileSchema = z
  .object({
    /** Результаты по каждому экзамену в его собственной шкале. */
    examScores: z.record(z.string(), z.number()).default({}),
    /** Пара профильных предметов ЕНТ, которую абитуриент сдаёт или сдал. */
    entProfilePair: z.tuple([examCodeSchema, examCodeSchema]).optional(),
    achievements: z.array(achievementKindSchema).default([]),
    preferences: applicantPreferencesSchema.default(() => applicantPreferencesSchema.parse({})),
    /** Планируемая дата подачи — от неё строится roadmap. ГГГГ-ММ-ДД. */
    plannedIntake: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .superRefine((profile, ctx) => {
    for (const [code, score] of Object.entries(profile.examScores)) {
      const exam = EXAMS[code as ExamCode];
      if (exam === undefined || score === undefined) continue;
      if (score < exam.min || score > exam.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['examScores', code],
          message: `${exam.title.ru}: ${score} вне шкалы ${exam.min}–${exam.max}`,
        });
      }
    }
    const pair = profile.entProfilePair;
    if (pair !== undefined) {
      if (pair[0] === pair[1]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['entProfilePair'], message: 'Профильные предметы ЕНТ должны различаться' });
      }
      for (const code of pair) {
        if (!EXAMS[code].isEntProfileSubject) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['entProfilePair'],
            message: `${EXAMS[code].title.ru} не является профильным предметом ЕНТ`,
          });
        }
      }
    }
  })
  .transform((profile) => ({ ...profile, achievements: [...new Set(profile.achievements)] }));

export type ApplicantProfile = z.infer<typeof applicantProfileSchema>;
export type ApplicantProfileInput = z.input<typeof applicantProfileSchema>;

/** Суммарный приоритет достижений — используется при равных баллах, не как надбавка. */
export function achievementPriority(achievements: readonly AchievementKind[]): number {
  return [...new Set(achievements)].reduce((sum, kind) => sum + ACHIEVEMENT_PRIORITY[kind], 0);
}
